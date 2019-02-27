'use babel';

import {
  createIdentity,
  identifyFromPrivateKey,
  decodePrivateKey,
  decryptPrivateKey,
  encryptPrivateKey,
  encodePrivateKey,
  signTransaction,
  hashTransaction
} from '@herajs/crypto';
import _ from 'lodash';
import logger from 'loglevel';

import {EventType} from '../event';
import {isEmpty} from './utils';

export default class AccountService {

  constructor(nodeService, eventDispatcher) {
    this.nodeService = nodeService;
    this.eventDispatcher = eventDispatcher;
    this.address2Identity = new Map();
  }

  newAccount() {
    const identity = createIdentity();
    logger.debug("New account identity address:", identity.address);
    this._addIdentity(identity);

    return this._wrapAccountState(identity.address).then(account => {
      this.eventDispatcher.dispatch(EventType.NewAccount, account);
      this.eventDispatcher.dispatch(EventType.Log, { message: account, level: "info" });
      this.eventDispatcher.dispatch(EventType.Notify, { message: "Created account successfully", level: "success" });
      return account;
    }).catch(err => {
      this.eventDispatcher.dispatch(EventType.Log, { message: err, level: "error" });
      this.eventDispatcher.dispatch(EventType.Notify, { message: "Creating account failed", level: "error" });
    });
  }

  importAccount(encryptedPrivateKey, password) {
    logger.debug("Import account with", encryptedPrivateKey);

    if (isEmpty(encryptedPrivateKey)) {
      const message = "Encrypted private key is empty";
      this._dispatchError(message);
      return Promise.reject(message);
    }

    if (isEmpty(password)) {
      const message = "Password to decrypt is empty";
      this._dispatchError(message);
      return Promise.reject(message);
    }

    return Promise.resolve(decodePrivateKey(encryptedPrivateKey)).then(encryptedBytes => {
      return decryptPrivateKey(encryptedBytes, password);
    }).then(decryptedBytes => {
      return identifyFromPrivateKey(decryptedBytes);
    }).then(identity => {
      logger.debug("Imported account identity address:", identity.address);
      this._addIdentity(identity);
      return this._wrapAccountState(identity.address);
    }).then(account => {
      this.eventDispatcher.dispatch(EventType.ImportAccount, account);
      this.eventDispatcher.dispatch(EventType.Log, { message: account, level: "info" });
      this.eventDispatcher.dispatch(EventType.Notify,
            { message: "Successfully imported account " + account.address, level: "success" });
      return account;
    }).catch(err => {
      logger.error(err);
      this.eventDispatcher.dispatch(EventType.Log, { message: err, level: "error" });
      this.eventDispatcher.dispatch(EventType.Notify, { message: "Importing account failed", level: "error" });
    });
 }

  exportAccount(accountAddress, password) {
    logger.debug("Export account of", accountAddress);

    if (isEmpty(accountAddress)) {
      const message = "Selected account is empty";
      this._dispatchError(message);
      return Promise.reject(message);
    }

    if (isEmpty(password)) {
      const message = "Password to decrypt is empty";
      this._dispatchError(message);
      return Promise.reject(message);
    }

    return Promise.resolve(this.address2Identity.get(accountAddress)).then(identity => {
      if (typeof identity === undefined) {
        throw "Cannot found identity for " + accountAddress;
      }
      const rawArray = new Uint8Array(identity.privateKey.toArray());
      return encryptPrivateKey(rawArray, password);
    }).then(encryptedBytes => {
      const encodedEncryptedOne = encodePrivateKey(encryptedBytes);
      const message = "exported: " + encodedEncryptedOne;
      this.eventDispatcher.dispatch(EventType.ExportAccount, encodedEncryptedOne);
      this.eventDispatcher.dispatch(EventType.Log, { message: message, level: "info" });
      this.eventDispatcher.dispatch(EventType.Notify, { message: message, level: "success" });
      return encodedEncryptedOne;
    }).catch(err => {
      logger.error(err);
      this.eventDispatcher.dispatch(EventType.Log, { message: err, level: "error" });
      this.eventDispatcher.dispatch(EventType.Notify, { message: "Exporting acconnt failed", level: "error" });
    });
  }

  changeAccount(accountAddress) {
    return this.updateAccount(accountAddress).then(account => {
      this.eventDispatcher.dispatch(EventType.Log, { message: account, level: "info" });
      return account;
    });
  }

  updateAccount(accountAddress) {
    logger.debug("Update account of", accountAddress);

    if (isEmpty(accountAddress)) {
      const message = "Selected account is empty";
      this._dispatchError(message);
      return Promise.reject(message);
    }

    return this._wrapAccountState(accountAddress).then(account => {
      this.eventDispatcher.dispatch(EventType.ChangeAccount, account);
      return account;
    });
  }

  sign(accountAddress, rawTransaction) {
    logger.debug("Sign request with", accountAddress, rawTransaction);

    if (!this.address2Identity.has(accountAddress)) {
      const message = "No identity found for " + accountAddress;
      logger.debug(message);
      return Promise.reject(message);
    }

    const signedTransaction = _.cloneDeep(rawTransaction)
    const identity = this.address2Identity.get(accountAddress);
    return signTransaction(rawTransaction, identity.keyPair).then(sign => {
      signedTransaction.sign = sign;
      return hashTransaction(signedTransaction, "base58");
    }).then(hash => {
      signedTransaction.hash = hash;
      return signedTransaction;
    });
  }

  _dispatchError(message) {
    this.eventDispatcher.dispatch(EventType.Log, { message: message, level: "error" });
    this.eventDispatcher.dispatch(EventType.Notify, { message: message, level: "error" });
  }

  _addIdentity(identity) {
    this.address2Identity.set(identity.address, identity);
  }

  _removeIdentityWith(accountAddress) {
    this.address2Identity.delete(accountAddress);
  }

  _wrapAccountState(accountAddress) {
    return this.nodeService.getClient().getState(accountAddress).then(queriedState => {
      logger.debug("Quried account state:", queriedState);
      return this._buildAccount(accountAddress, queriedState.balance.value.toString(), queriedState.nonce);
    }).catch(err => {
      logger.debug(err);
      return this._buildAccount(accountAddress, "unknown", "unknown");
    });
  }

  _buildAccount(accountAddress, balance, nonce) {
    return {
      accountAddress: accountAddress,
      balance: balance,
      nonce: nonce,
      toString: function() {
        return "account: " + this.accountAddress +
                ", balance: " + this.balance + ", nonce: " + this.nonce;
      }
    }
  }

}