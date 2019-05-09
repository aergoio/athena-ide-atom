import {observable, action, computed} from 'mobx';
import logger from 'loglevel';

import serviceProvider from '../service';
import { formatInteger, formatAergoBalance } from '../utils';

export default class AccountStore {

  @observable currentAddress = "";
  @observable currentBalance = "";
  @observable currentBalanceWithUnit = "";
  @observable currentNonce = "";
  @observable address2Identity = new Map();

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @computed get currentIdentity() {
    return this.address2Identity.get(this.currentAddress);
  }

  @computed get addresses() {
    return Array.from(this.address2Identity.keys());
  }

  serialize() {
    return {};
  }

  @action deserialize(data) {
    logger.debug("Deserialize", data);
  }

  @action newAccount() {
    logger.debug("New account");
    serviceProvider.accountService.newAccount().then(identity => {
      this.address2Identity.set(identity.address, identity);
      const message = "Created account " + identity.address + " successfully";
      this.rootStore.consoleStore.log(message, "info");
      this.rootStore.notificationStore.notify(message, "success");
      this.changeAccount(identity.address);
    }).catch(err => {
      logger.error(err);
      this.rootStore.consoleStore.log(err, "error");
      this.rootStore.notificationStore.notify("Creating account failed", "error");
    });

  }

  @action addAccount(encryptedPrivateKey, password) {
    logger.debug("Add account with", encryptedPrivateKey);
    serviceProvider.accountService.decryptIdentity(encryptedPrivateKey, password).then(identity => {
      this.address2Identity.set(identity.address, identity);
      const message = "Successfully imported account " + identity.address;
      this.rootStore.consoleStore.log(message, "info");
      this.rootStore.notificationStore.notify(message, "success");
      this.changeAccount(identity.address);
    }).catch(err => {
      logger.error(err);
      this.rootStore.consoleStore.log(err, "error");
      this.rootStore.notificationStore.notify("Importing account failed", "error");
    });
  }

  @action changeAccount(address) {
    const message = "Change account to " + address;
    logger.debug(message);
    this.rootStore.consoleStore.log(message, "info");
    this.currentAddress = address;
    this.updateAccountState();
  }

  @action updateAccountState() {
    logger.debug("Update account state of", this.currentAddress);
    serviceProvider.accountService.getAccountState(this.currentAddress).then(state => {
      this.currentBalance = "unknown" === state.balance ? state.balance : formatInteger(state.balance);
      this.currentBalanceWithUnit = "unknown" === state.balance ? state.balance : formatAergoBalance(state.balance);
      this.currentNonce = state.nonce;
    });
  }

  @action exportAccount(password) {
    logger.debug("Export current account", this.currentAddress);
    if (typeof this.currentAddress === "undefined" || "" === this.currentAddress) {
      return;
    }

    const identity = this.address2Identity.get(this.currentAddress);
    serviceProvider.accountService.encryptIdentity(identity, password).then(encrypted => {
      const message = "exported: " + encrypted;
      this.rootStore.consoleStore.log(message, "info");
      this.rootStore.notificationStore.notify(message, "success");
    }).catch(err => {
      logger.error(err);
      this.rootStore.consoleStore.log(err, "error");
      this.rootStore.notificationStore.notify("Exporting account failed", "error");
    });
  }

  @action removeAccount(address) {
    logger.debug("Remove account", address);
    if (!this.address2Identity.has(address)) {
      return;
    }

    this.address2Identity.delete(address);
    this.changeAccount("");
  }

}
