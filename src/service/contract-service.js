'use babel';

import {Contract} from '@herajs/client';

import {EventType} from '../event';
import logger from '../logger';

const pendingInterval = 3000;
const successCreatedStatus = "CREATED";

export default class ContractService {

  constructor(nodeService, accountService, eventDispatcher) {
    this.nodeService = nodeService;
    this.accountService = accountService;
    this.eventDispatcher = eventDispatcher;
    this.contractAddress2Abi = new Map();
  }

  deploy(accountAddress, price, limit, contractPayload) {
    logger.debug("deploy with");
    logger.debug(accountAddress);
    logger.debug(price);
    logger.debug(limit);
    logger.debug(contractPayload);

    const trimmedPayload = contractPayload.trim();
    const payload = Contract.fromCode(trimmedPayload).asPayload([10]);
    this._try(accountAddress, (nonce) => {
      return this._buildDeployTx(accountAddress, "", nonce, payload).then(signedTx => {
        logger.debug("signed tx");
        logger.debug(signedTx);
        this._logInfo("Deploying..");
        return this.nodeService.getClient().sendSignedTransaction(signedTx);
      });
    }).then(txHash => {
      this._logInfo("TxHash: " + txHash);
      let contractAddress = null;
      let finalReceipt = null;
      const receiptRequest = () => {
        if (null == contractAddress) {
          this.nodeService.getClient().getTransactionReceipt(txHash).then(receipt => {
            logger.debug("receipt");
            logger.debug(receipt);
            logger.debug(receipt.status);
            if (successCreatedStatus === receipt.status) {
              contractAddress = receipt.contractaddress;
              finalReceipt = receipt;
            }
          });
        }
      };
      const timerId = setInterval(receiptRequest, 1000);
      setTimeout(() => {
        clearInterval(timerId);
        if (null != contractAddress) {
          this._logInfo("ContractAddress: " + contractAddress);
        } else {
          this._logError(finalReceipt.status);
        }
      }, pendingInterval);
    }).catch(err => {
      this._logError(err);
    });
  }

  _try(from, trier) {
    return this._fetchRecentlyUsedNonceOf(from).then(nonce => trier(nonce + 1));
  }

  _fetchRecentlyUsedNonceOf(accountAddress) {
    const aergoClient = this.nodeService.getClient();
    return aergoClient.getState(accountAddress).then((s) => s.nonce);
  }

  _buildDeployTx(from, to, nonce, payload) {
    const rawTx = {
      from: from,
      to: to,
      amount: "0",
      nonce: nonce,
      payload: payload,
    };
    return this.accountService.sign(from, rawTx);
  }

  _logInfo(message) {
    this.eventDispatcher.dispatch(EventType.AppendLog, { data: message, level: "info" });
  }

  _logError(message) {
    this.eventDispatcher.dispatch(EventType.AppendLog, { data: message, level: "error" });
  }

}