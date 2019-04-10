'use babel';

import {signTransaction, hashTransaction} from '@herajs/crypto';
import {Address, Contract} from '@herajs/client';

import _ from 'lodash';
import logger from 'loglevel';

import {isEmpty} from './utils';

const contractTxSuccesses = ["CREATED", "SUCCESS"];

export default class ContractService {

  constructor(client) {
    this.client = client;
  }

  async getABI(contractAddress) {
    if (isEmpty(contractAddress)) {
      throw new Error("Contract address is empty");
    }
    const decoded = Address.decode(contractAddress);
    return await this.client.getABI(decoded);
  }

  async deploy(identity, price, limit, contractPayload, args) {
    if (isEmpty(identity)) {
      throw "Selected account is empty";
    }

    const accountAddress = identity.address;
    logger.debug("Deploy with", accountAddress, price, limit, contractPayload);

    if (isEmpty(price) || isEmpty(limit)) {
      throw "Price or limit is empty";
    }

    if (isEmpty(contractPayload)) {
      throw "Deploy target is empty";
    }

    if (isEmpty(args)) {
      throw "Deploy args is empty";
    }

    const payload = Contract.fromCode(contractPayload.trim()).asPayload(args);

    const chainIdHash = await this.client.getChainIdHash();
    const trier = (nonce) => {
      const rawTx = this._buildDeployTx(chainIdHash, accountAddress, "", nonce, payload);
      return this._signTx(identity, rawTx).then(signedTx => {
        logger.debug("Signed tx", signedTx);
        return this.client.sendSignedTransaction(signedTx);
      });
    };
    const txHash = await this._tryWithNonceRefresh(accountAddress, trier);
    logger.debug("Deploy TxHash", txHash);

    const contractAddress = await this._pollingReceipt(txHash, receipt => receipt.contractaddress);
    const abi = await this.client.getABI(contractAddress);
    logger.debug("Queried Abi", abi);

    return { contractAddress: contractAddress.toString(), abi: abi }
  }

  async execute(identity, targetFunction, targetArgs, contractAddress, abi, price, limit) {
    if (isEmpty(identity)) {
      throw "Selected account is empty";
    }

    const accountAddress = identity.address;
    logger.debug("Execution with", accountAddress, price, limit, targetFunction, targetArgs, contractAddress, abi);

    if (isEmpty(price) || isEmpty(limit)) {
      throw "Price or limit is empty";
    }

    if (isEmpty(targetFunction) || isEmpty(targetArgs) || isEmpty(contractAddress) || isEmpty(abi)) {
      throw "One of contract execution information is empty";
    }

    const contract = Contract.fromAbi(abi).setAddress(contractAddress);
    logger.debug("Generatd contract object:", contract);

    const targetFunctionAbi = abi.functions.filter(f => f.name === targetFunction)[0];
    logger.debug("Abi functions:", abi.functions, "target function:", targetFunctionAbi);
    if (typeof targetFunctionAbi === 'undefined') {
      throw "Target function is not found in abi";
    }

    const functionCall = contract[targetFunctionAbi.name](...targetArgs);
    logger.debug("Function call:", functionCall, ", tx form:", functionCallTx);

    const chainIdHash = await this.client.getChainIdHash();
    const functionCallTx = functionCall.asTransaction({
      chainIdHash: chainIdHash,
      from: accountAddress,
      amount: "0"
    });

    const trier = (nonce) => {
      const rawTx = _.cloneDeep(functionCallTx);
      rawTx.nonce = nonce;
      return this._signTx(identity, rawTx).then(signedTx => {
        logger.debug("Signed tx", signedTx);
        return this.client.sendSignedTransaction(signedTx);
      });
    };

    const txHash = await this._tryWithNonceRefresh(accountAddress, trier);
    logger.debug("Execute TxHash", txHash);
    const txReceipt = await this._pollingReceipt(txHash, receipt => receipt.result)

    return txReceipt;
  }

  async query(contractAddress, abi, targetFunction, targetArgs) {
    const contract = Contract.fromAbi(abi).setAddress(contractAddress);
    logger.debug("Generatd contract object:", contract);

    const targetFunctionAbi = abi.functions.filter(f => f.name === targetFunction)[0];
    logger.debug("Abi functions:", abi.functions, "target function:", targetFunctionAbi);
    if (typeof targetFunctionAbi === 'undefined') {
      throw "Target function is not found in abi";
    }

    const functionCall = contract[targetFunctionAbi.name](...targetArgs);
    logger.debug("Function call:", functionCall);

    const result = await this.client.queryContract(functionCall);
    return JSON.stringify(result);
  }

  async _tryWithNonceRefresh(from, trier) {
    const nonce = await this._fetchNextNonceOf(from);
    return await trier(nonce);
  }

  async _fetchNextNonceOf(accountAddress) {
    const accountState = await this.client.getState(accountAddress);
    return accountState.nonce + 1;
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
                reject(receipt.result);
              }
            }
            setTimeout(waitForComplete, 30);
        })();
    });
  }

  _buildDeployTx(chainIdHash, from, to, nonce, payload) {
    return {
      chainIdHash: chainIdHash,
      from: from,
      to: to,
      amount: "0",
      nonce: nonce,
      payload: payload,
    };
  }

  async _signTx(identity, rawTransaction) {
    const signedTransaction = _.cloneDeep(rawTransaction)

    const sign = await signTransaction(rawTransaction, identity.keyPair);
    signedTransaction.sign = sign;
    const hash = await hashTransaction(signedTransaction, "base58");
    signedTransaction.hash = hash;

    return signedTransaction;
  }

}