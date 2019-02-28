'use babel';

import {Contract, FunctionCall} from '@herajs/client';
import _ from 'lodash';
import logger from 'loglevel';

import {EventType} from '../event';
import {isEmpty} from './utils';

const contractTxSuccesses = ["CREATED", "SUCCESS"];

export default class ContractService {

  constructor(nodeService, accountService, eventDispatcher) {
    this.nodeService = nodeService;
    this.accountService = accountService;
    this.eventDispatcher = eventDispatcher;
    this.contractAddress2Abi = new Map();
  }

  deploy(accountAddress, price, limit, contractPayload) {
    logger.debug("Deploy with", accountAddress, price, limit, contractPayload);

    if (isEmpty(accountAddress)) {
      const message = "Selected account is empty";
      this._dispatchError(message);
      return Promise.reject(message);
    }

    if (isEmpty(price) || isEmpty(limit)) {
      const message = "Price or limit is empty";
      this._dispatchError(message);
      return Promise.reject(message);
    }

    if (isEmpty(contractPayload)) {
      const message = "Deploy target is empty";
      this._dispatchError(message);
      return Promise.reject(message);
    }

    const trimmedPayload = contractPayload.trim();
    return Promise.resolve(Contract.fromCode(trimmedPayload).asPayload([10])).then(payload => {
      const trier = (nonce) => {
        const rawTx = this._buildDeployTx(accountAddress, "", nonce, price, limit, payload);
        return this._signTx(accountAddress, rawTx).then(signedTx => {
          logger.debug("Signed tx", signedTx);
          return this.nodeService.getClient().sendSignedTransaction(signedTx);
        });
      };
      return this._tryWithNonceRefresh(accountAddress, trier);
    }).then(txHash => {
      this.eventDispatcher.dispatch(EventType.Log, { message: "Deploy TxHash: " + txHash, level: "info" });
      return this._pollingReceipt(txHash, receipt => receipt.contractaddress);
    }).then(contractAddress => {
      return this.nodeService.getClient().getABI(contractAddress).then(abi => {
        logger.debug("Queried Abi", abi);
        return {
          contractAddress: contractAddress.toString(),
          abi: abi
        }
      });
    }).then(result => {
      logger.debug("Deploy result:", result);
      this.accountService.updateAccount(accountAddress);
      this.eventDispatcher.dispatch(EventType.Deploy, result);
      this.eventDispatcher.dispatch(EventType.Log, { message: "ContractAddress: " + result.contractAddress, level: "info" });
      this.eventDispatcher.dispatch(EventType.Notify, { message: "Successfully deployed contract", level: "success" });
      return result;
    }).catch(err => {
      logger.error(err);
      this.accountService.updateAccount(accountAddress);
      this.eventDispatcher.dispatch(EventType.Log, { message: err, level: "error" });
      this.eventDispatcher.dispatch(EventType.Notify,
              { message: "Deploying contract failed", level: "error" });
    });
  }

  execute(accountAddress, price, limit, targetFunction, targetArgs, contractAddress, abi) {
    logger.debug("Execution with", accountAddress, price, limit, targetFunction, targetArgs, contractAddress, abi);

    if (isEmpty(accountAddress)) {
      const message = "Selected account is empty";
      this._dispatchError(message);
      return Promise.reject(message);
    }

    if (isEmpty(price) || isEmpty(limit)) {
      const message = "Price or limit is empty";
      this._dispatchError(message);
      return Promise.reject(message);
    }

    if (isEmpty(targetFunction) || isEmpty(targetArgs) || isEmpty(contractAddress) || isEmpty(abi)) {
      const message = "One of contract execution information is empty";
      this._dispatchError(message);
      return Promise.reject(message);
    }

    const contract = Contract.fromAbi(abi).setAddress(contractAddress);
    logger.debug("Generatd contract object:", contract);

    const targetFunctionAbi = abi.functions.filter(f => f.name === targetFunction)[0];
    logger.debug("Abi functions:", abi.functions, "target function:", targetFunctionAbi);
    if (typeof targetFunctionAbi === 'undefined') {
      const message = "Target function is not found in abi";
      this._dispatchError(message);
      return Promise.reject(message);
    }

    const functionCall = contract[targetFunctionAbi.name](...targetArgs);
    logger.debug("Function call:", functionCall, ", tx form:", functionCallTx);
    const functionCallTx = functionCall.asTransaction({
      from: accountAddress,
      amount: "0",
      price: "0", // TODO : set price.toString() after hashTransaction is fixed
      limit: limit
    });
    // TODO : should do this? no better api?
    functionCallTx.to = contractAddress;

    const trier = (nonce) => {
      const rawTx = _.cloneDeep(functionCallTx);
      rawTx.nonce = nonce;
      return this._signTx(accountAddress, rawTx).then(signedTx => {
        logger.debug("Signed tx", signedTx);
        return this.nodeService.getClient().sendSignedTransaction(signedTx);
      });
    };

    return this._tryWithNonceRefresh(accountAddress, trier).then(txHash => {
      this.eventDispatcher.dispatch(EventType.Log, { message: "Execute TxHash: " + txHash, level: "info" });
      return this._pollingReceipt(txHash, receipt => receipt.result);
    }).then(result => {
      this.accountService.updateAccount(accountAddress);
      this.eventDispatcher.dispatch(EventType.Log, { message: "Execute ret: " + result, level: "info" });
      return result;
    }).catch(err => {
      logger.error(err);
      this.accountService.updateAccount(accountAddress);
      this.eventDispatcher.dispatch(EventType.Log, { message: err, level: "error" });
      this.eventDispatcher.dispatch(EventType.Notify,
              { message: "Executing contract failed", level: "error" });
    });
  }

  _tryWithNonceRefresh(from, trier) {
    // TODO : refresh nonce
    return this._fetchNextNonceOf(from).then(nonce => trier(nonce));
  }

  _fetchNextNonceOf(accountAddress) {
    const aergoClient = this.nodeService.getClient();
    return aergoClient.getState(accountAddress).then((s) => s.nonce + 1);
  }

  _pollingReceipt(txHash, callback) {
    let receipt = null;
    const receiptRequest = () => {
        this.nodeService.getClient().getTransactionReceipt(txHash).then(receivedReceipt => {
          logger.debug("Received receipt", receivedReceipt);
          if (!isEmpty(receivedReceipt)) {
            receipt = receivedReceipt;
          }
        }).catch(err => {
          logger.debug("GetReceipt failed with", err.toString());
        });
    };
    const timerId = setInterval(receiptRequest, 1000);
    return new Promise((resolve, reject) => {
        (function waitForComplete() {
            if (receipt) {
              clearInterval(timerId);
              if (contractTxSuccesses.indexOf(receipt.status) !== -1) {
                return resolve(callback(receipt));
              } else {
                return reject(receipt.status);
              }
            }
            setTimeout(waitForComplete, 30);
        })();
    });
  }

  _buildDeployTx(from, to, nonce, price, limit, payload) {
    return {
      from: from,
      to: to,
      amount: "0",
      nonce: nonce,
      price: "0", // TODO : set price.toString() after hashTransaction is fixed
      limit: limit,
      payload: payload,
    };
  }

  _signTx(from, rawTransaction) {
    logger.debug("Raw transaction", rawTransaction);
    return this.accountService.sign(from, rawTransaction);
  }

  _dispatchError(message) {
    this.eventDispatcher.dispatch(EventType.Log, { message: message, level: "error" });
    this.eventDispatcher.dispatch(EventType.Notify, { message: message, level: "error" });
  }

}