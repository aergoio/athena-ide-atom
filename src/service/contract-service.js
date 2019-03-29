'use babel';

import {signTransaction, hashTransaction} from '@herajs/crypto';
import {Contract, FunctionCall} from '@herajs/client';

import _ from 'lodash';
import logger from 'loglevel';

import {isEmpty} from './utils';

const contractTxSuccesses = ["CREATED", "SUCCESS"];

export default class ContractService {

  constructor(client) {
    this.client = client;
  }

  deploy(identity, price, limit, contractPayload) {
    if (isEmpty(identity)) {
      return Promise.reject("Selected account is empty");
    }

    const accountAddress = identity.address;
    logger.debug("Deploy with", accountAddress, price, limit, contractPayload);

    if (isEmpty(price) || isEmpty(limit)) {
      return Promise.reject("Price or limit is empty");
    }

    if (isEmpty(contractPayload)) {
      return Promise.reject("Deploy target is empty");
    }

    const trimmedPayload = contractPayload.trim();
    return Promise.resolve(Contract.fromCode(trimmedPayload).asPayload()).then(payload => {
      const trier = (nonce) => {
        const rawTx = this._buildDeployTx(accountAddress, "", nonce, price, limit, payload);
        return this._signTx(identity, rawTx).then(signedTx => {
          logger.debug("Signed tx", signedTx);
          return this.client.sendSignedTransaction(signedTx);
        });
      };
      return this._tryWithNonceRefresh(accountAddress, trier);
    }).then(txHash => {
      logger.debug("Deploy TxHash", txHash);
      return this._pollingReceipt(txHash, receipt => receipt.contractaddress);
    }).then(contractAddress => {
      return this.client.getABI(contractAddress).then(abi => {
        logger.debug("Queried Abi", abi);
        return {
          contractAddress: contractAddress.toString(),
          abi: abi
        }
      });
    }).then(result => result);
  }

  execute(identity, targetFunction, targetArgs, contractAddress, abi, price, limit) {
    if (isEmpty(identity)) {
      return Promise.reject("Selected account is empty");
    }

    const accountAddress = identity.address;
    logger.debug("Execution with", accountAddress, price, limit, targetFunction, targetArgs, contractAddress, abi);

    if (isEmpty(price) || isEmpty(limit)) {
      return Promise.reject("Price or limit is empty");
    }

    if (isEmpty(targetFunction) || isEmpty(targetArgs) || isEmpty(contractAddress) || isEmpty(abi)) {
      return Promise.reject("One of contract execution information is empty");
    }

    const contract = Contract.fromAbi(abi).setAddress(contractAddress);
    logger.debug("Generatd contract object:", contract);

    const targetFunctionAbi = abi.functions.filter(f => f.name === targetFunction)[0];
    logger.debug("Abi functions:", abi.functions, "target function:", targetFunctionAbi);
    if (typeof targetFunctionAbi === 'undefined') {
      return Promise.reject("Target function is not found in abi");
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
      return this._signTx(identity, rawTx).then(signedTx => {
        logger.debug("Signed tx", signedTx);
        return this.client.sendSignedTransaction(signedTx);
      });
    };

    return this._tryWithNonceRefresh(accountAddress, trier).then(txHash => {
      logger.debug("Execute TxHash", txHash);
      return this._pollingReceipt(txHash, receipt => receipt.result);
    });
  }

  _tryWithNonceRefresh(from, trier) {
    // TODO : refresh nonce
    return this._fetchNextNonceOf(from).then(nonce => trier(nonce));
  }

  _fetchNextNonceOf(accountAddress) {
    const aergoClient = this.client;
    return aergoClient.getState(accountAddress).then((s) => s.nonce + 1);
  }

  _pollingReceipt(txHash, callback) {
    let receipt = null;
    const receiptRequest = () => {
        this.client.getTransactionReceipt(txHash).then(receivedReceipt => {
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
                resolve(callback(receipt));
              } else {
                reject(receipt.status);
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

  _signTx(identity, rawTransaction) {
    const signedTransaction = _.cloneDeep(rawTransaction)
    return signTransaction(rawTransaction, identity.keyPair).then(sign => {
      signedTransaction.sign = sign;
      return hashTransaction(signedTransaction, "base58");
    }).then(hash => {
      signedTransaction.hash = hash;
      return signedTransaction;
    });
  }

}