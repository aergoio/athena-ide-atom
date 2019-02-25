'use babel';

import {Contract} from '@herajs/client';
import logger from 'loglevel';

import {EventType} from '../event';
import {isEmpty} from './utils';

const successCreatedStatus = "CREATED";

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
      const trier = (nonce) => this._buildSignedTx(accountAddress, "", nonce, price, limit, payload)
          .then(signedTx => {
            logger.debug("Signed tx", signedTx);
            return this.nodeService.getClient().sendSignedTransaction(signedTx);
          });
      return this._try(accountAddress, trier);
    }).then(txHash => {
      this.eventDispatcher.dispatch(EventType.Log, { message: "Deploy TxHash: " + txHash, level: "info" });

      let receipt = null;
      const receiptRequest = () => {
          this.nodeService.getClient().getTransactionReceipt(txHash).then(receivedReceipt => {
            logger.debug("Received receipt", receivedReceipt);
            if (!isEmpty(receivedReceipt)) {
              receipt = receivedReceipt;
            }
          });
      };
      const timerId = setInterval(receiptRequest, 1000);
      return new Promise((resolve, reject) => {
          (function waitForComplete() {
              if (receipt) {
                clearInterval(timerId);
                if (successCreatedStatus === receipt.status) {
                  return resolve(receipt.contractaddress);
                } else {
                  return reject(receipt.status);
                }
              }
              setTimeout(waitForComplete, 30);
          })();
      });
    }).then(contractAddress => {
      return this.nodeService.getClient().getABI(contractAddress).then(abi =>
        this._buildContractAddressAndAbi(contractAddress, abi)
      );
    }).then(result => {
      logger.debug("Deploy result:", result);
      this.accountService.changeAccount(accountAddress);
      this.eventDispatcher.dispatch(EventType.Deploy, result);
      this.eventDispatcher.dispatch(EventType.Log, { message: "ContractAddress: " + result.contractAddress, level: "info" });
      this.eventDispatcher.dispatch(EventType.Notify, { message: "Successfully deployed contract", level: "success" });
      return result;
    }).catch(err => {
      this.accountService.changeAccount(accountAddress);
      this.eventDispatcher.dispatch(EventType.Log, { message: err, level: "error" });
      this.eventDispatcher.dispatch(EventType.Notify,
              { message: "Deploying contract failed", level: "error" });
    });
  }

  _try(from, trier) {
    return this._fetchRecentlyUsedNonceOf(from).then(nonce => trier(nonce + 1));
  }

  _fetchRecentlyUsedNonceOf(accountAddress) {
    const aergoClient = this.nodeService.getClient();
    return aergoClient.getState(accountAddress).then((s) => s.nonce);
  }

  _buildSignedTx(from, to, nonce, price, limit, payload) {
    const rawTransaction = {
      from: from,
      to: to,
      amount: "0",
      nonce: nonce,
      price: "0", // TODO : set price.toString() after hashTransaction is fixed
      limit: limit,
      payload: payload,
    };
    logger.debug("Raw transaction", rawTransaction);
    return this.accountService.sign(from, rawTransaction);
  }

  _dispatchError(message) {
    this.eventDispatcher.dispatch(EventType.Log, { message: message, level: "error" });
    this.eventDispatcher.dispatch(EventType.Notify, { message: message, level: "error" });
  }

  _buildContractAddressAndAbi(contractAddress, abi) {
    const contract = Contract.atAddress(contractAddress);
    contract.loadAbi(abi);
    return {
      contractAddress: contractAddress.toString(),
      contract: contract
    }
  }

}