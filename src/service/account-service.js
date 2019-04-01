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

  async decryptIdentity(encryptedPrivateKey, password) {
    logger.debug("Decrypt private key with", encryptedPrivateKey);

    if (isEmpty(encryptedPrivateKey)) {
      throw "Encrypted private key is empty";
    }

    if (isEmpty(password)) {
      throw "Password to decrypt is empty";
    }

    const encryptedBytes = decodePrivateKey(encryptedPrivateKey);
    const decryptedBytes = await decryptPrivateKey(encryptedBytes, password);
    return identifyFromPrivateKey(decryptedBytes);
  }

  async encryptIdentity(identity, password) {
    logger.debug("Encrypt identity");
    logger.debug(identity, password);

    if (isEmpty(identity)) {
      throw "Identity is empty";
    }

    if (isEmpty(password)) {
      throw "Password to decrypt is empty";
    }

    const encryptedBytes = await encryptPrivateKey(identity.privateKey, password);
    const encryptedEncoded = encodePrivateKey(Buffer.from(encryptedBytes));
    return encryptedEncoded;
  }

  async getAccountState(accountAddress) {
    logger.debug("Get account state of", accountAddress);
    return await this.client.getState(accountAddress).then(queriedState => {
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