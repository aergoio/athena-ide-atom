import { observable, action, computed } from 'mobx';
import logger from 'loglevel';

import serviceProvider from '../service';
import { formatInteger, formatAergoBalance } from '../utils';

let Account = undefined;
const loadAccount = () => {
  if (typeof Account === "undefined") {
    Account = require("@aergo/athena-client").Account;
  }
  return Account;
}

export default class AccountStore {

  @observable currentAddress = "";
  @observable currentBalance = "";
  @observable currentBalanceWithUnit = "";
  @observable currentNonce = "";
  @observable address2Account = new Map();

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @computed get currentAccount() {
    return this.address2Account.get(this.currentAddress);
  }

  @computed get addresses() {
    return Array.from(this.address2Account.keys());
  }

  serialize() {
    return {};
  }

  @action deserialize(data) {
    logger.debug("Deserialize", data);
  }

  @action newAccount() {
    logger.debug("New account");

    loadAccount().new().then(account => {
      this.address2Account.set(account.address, account);
      this.changeAccount(account.address);

      const message = "Created account " + account.address + " successfully";
      this.rootStore.consoleStore.log(message, "info");
      this.rootStore.notificationStore.notify(message, "success");
    }).catch(err => {
      logger.error(err);
      this.rootStore.consoleStore.log(err, "error");
      this.rootStore.notificationStore.notify("Creating account failed", "error");
    });

  }

  @action addAccount(encryptedPrivateKey, password) {
    logger.debug("Add account with", encryptedPrivateKey);
    loadAccount().from(encryptedPrivateKey, password).then(account => {
      this.address2Account.set(account.address, account);
      this.changeAccount(account.address);

      const message = "Successfully imported account " + account.address;
      this.rootStore.consoleStore.log(message, "info");
      this.rootStore.notificationStore.notify(message, "success");
    }).catch(err => {
      logger.error(err);
      this.rootStore.consoleStore.log(err, "error");
      this.rootStore.notificationStore.notify("Importing account failed", "error");
    });
  }

  @action changeAccount(address) {
    this.rootStore.consoleStore.log("Change account to " + address, "info");
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

    const account = this.address2Account.get(this.currentAddress);
    account.encrypt(password).then(encrypted => {
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
    if (!this.address2Account.has(address)) {
      return;
    }

    this.address2Account.delete(address);
    this.changeAccount("");
  }

}
