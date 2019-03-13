'use babel';

import {
  createIdentity,
  identifyFromPrivateKey,
  decodePrivateKey,
  decryptPrivateKey,
  encryptPrivateKey,
  encodePrivateKey
} from '@herajs/crypto';
import logger from 'loglevel';

import {isEmpty} from './utils';

export default class AccountService {

  constructor(client) {
    this.client = client;
  }

  newAccount() {
    const identity = createIdentity();
    logger.debug("New account identity address:", identity.address);
    return Promise.resolve(identity);
  }

  decryptIdentity(encryptedPrivateKey, password) {
    logger.debug("Decrypt private key with", encryptedPrivateKey);

    if (isEmpty(encryptedPrivateKey)) {
      return Promise.reject("Encrypted private key is empty");
    }

    if (isEmpty(password)) {
      return Promise.reject("Password to decrypt is empty");
    }

    return Promise.resolve(decodePrivateKey(encryptedPrivateKey)).then(encryptedBytes => {
      return decryptPrivateKey(encryptedBytes, password);
    }).then(decryptedBytes => {
      return identifyFromPrivateKey(decryptedBytes);
    });
  }

  encryptIdentity(identity, password) {
    logger.debug("Encrypt identity");
    logger.debug(identity, password);
    if (isEmpty(identity)) {
      return Promise.reject("Identity is empty");
    }

    if (isEmpty(password)) {
      return Promise.reject("Password to decrypt is empty");
    }

    return Promise.resolve(identity).then(identity => {
      const rawArray = new Uint8Array(identity.privateKey.toArray());
      return encryptPrivateKey(rawArray, password);
    }).then(encryptedBytes => {
      return encodePrivateKey(encryptedBytes);
    });
  }

  getAccountState(accountAddress) {
    logger.debug("Get account state of", accountAddress);
    return this.client.getState(accountAddress).then(queriedState => {
      logger.debug("Quried account state:", queriedState);
      return this._buildAccount(queriedState.balance.value.toString(), queriedState.nonce);
    }).catch(err => {
      logger.debug(err);
      return this._buildAccount("unknown", "unknown");
    });
  }

  _buildAccount(balance, nonce) {
    return {
      balance: balance,
      nonce: nonce,
    }
  }

}