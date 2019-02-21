'use babel';

import {
  createIdentity,
  identifyFromPrivateKey,
  decodePrivateKey,
  decryptPrivateKey,
  encryptPrivateKey,
  encodePrivateKey,
} from '@herajs/crypto';
import {EventType} from '../event';
import logger from '../logger';

export default class AccountService {

  constructor(eventDispatcher, nodeService) {
    this.eventDispatcher = eventDispatcher;
    this.nodeService = nodeService;
    this.address2Identity = new Map();
  }

  newAccount() {
    const identity = createIdentity();
    logger.debug("new account identity");
    logger.debug(identity);
    this._addIdentity(identity);
    return this._wrapAccountState(identity.address).then(account => {
      this.eventDispatcher.dispatch(EventType.NewAccount, account);
      this.eventDispatcher.dispatch(EventType.AppendLog, { data: account, level: "info" });
      return account;
    }).catch(err => {
      this.eventDispatcher.dispatch(EventType.AppendLog, { data: err, level: "error" });
    });
  }

  importAccount(encryptedPrivateKey, password) {
    logger.debug("import account with");
    logger.debug(encryptedPrivateKey);
    logger.debug(password);
    try {
      const encryptedBytes = decodePrivateKey(encryptedPrivateKey);
      return decryptPrivateKey(encryptedBytes, password).then(decryptedBytes => {
        return identifyFromPrivateKey(decryptedBytes)
      }).then(identity => {
        logger.debug("imported account identity");
        logger.debug(identity);
        this._addIdentity(identity);
        return this._wrapAccountState(identity.address);
      }).then(account => {
        this.eventDispatcher.dispatch(EventType.ImportAccount, account);
        this.eventDispatcher.dispatch(EventType.AppendLog, { data: account, level: "info" });
        return account;
      }).catch(err => {
        logger.error(err);
        this.eventDispatcher.dispatch(EventType.AppendLog, { data: err, level: "error" });
      });
    } catch (err) {
      logger.error(err);
      this.eventDispatcher.dispatch(EventType.AppendLog, { data: err, level: "error" });
    }
 }

  exportAccount(accountAddress, password) {
    logger.debug("export account with");
    logger.debug(accountAddress);
    logger.debug(password);
    if (!this.address2Identity.has(accountAddress)) {
      return Promise.resolve("");
    }

    return Promise.resolve(this.address2Identity.get(accountAddress))
              .then(identity => {
                logger.debug("found identity");
                logger.debug(identity);
                const rawArray = new Uint8Array(identity.privateKey.toArray());
                logger.debug("raw array");
                logger.debug(rawArray);
                return encryptPrivateKey(rawArray, password);
              }).then(encryptedBytes => {
                const encodedEncryptedOne = encodePrivateKey(encryptedBytes);
                const message = { data: { toString: () => "exported: " + encodedEncryptedOne }, level: "info" };
                this.eventDispatcher.dispatch(EventType.AppendLog, message);
                this.eventDispatcher.dispatch(EventType.ExportAccount, encodedEncryptedOne);
                return encodedEncryptedOne;
              }).catch(err => {
                logger.error(err);
                this.eventDispatcher.dispatch(EventType.AppendLog, { data: err, level: "error" });
              });
  }

  changeAccount(accountAddress) {
    logger.debug("change account");
    logger.debug(accountAddress);
    return this._wrapAccountState(accountAddress).then(account => {
      this.eventDispatcher.dispatch(EventType.ChangeAccount, account);
      return account;
    });
  }

  _addIdentity(identity) {
    logger.debug("add new identity");
    logger.debug(identity);
    this.address2Identity.set(identity.address, identity);
  }

  _removeIdentityWith(accountAddress) {
    this.address2Identity.delete(accountAddress);
  }

  _wrapAccountState(accountAddress) {
    return this.nodeService.getClient().getState(accountAddress).then(queriedState => {
      logger.debug("quried account state");
      logger.debug(queriedState);
      return this._buildAccount(accountAddress, queriedState.balance.value.toString(), queriedState.nonce);
    }).catch(err => {
      logger.debug("quried account state err");
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