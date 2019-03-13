'use babel'

import {observable, action, computed} from 'mobx';
import logger from 'loglevel';

import serviceProvider from '../service';

import consoleStore from './console-store';
import notificationStore from './notification-store';

export class AccountStore {

  @observable currentAddress = "";
  @observable currentBalance = "";
  @observable currentNonce = "";
  @observable address2Identity = new Map();

  @action newAccount() {
    logger.debug("New account");
    serviceProvider.accountService.newAccount().then(identity => {
      this.address2Identity.set(identity.address, identity);
      this.changeAccount(identity.address);
      const message = "Created account " + identity.address + " successfully";
      consoleStore.log(message, "info");
      notificationStore.notify(message, "success");
    }).catch(err => {
      logger.error(err);
      consoleStore.log({ message: err, level: "error" });
      notificationStore.notify("Creating account failed", "error");
    });

  }

  @action addAccount(encryptedPrivateKey, password) {
    logger.debug("Add account with", encryptedPrivateKey);
    serviceProvider.accountService.decryptIdentity(encryptedPrivateKey, password).then(identity => {
      this.address2Identity.set(identity.address, identity);
      this.changeAccount(identity.address);
      const message = "Successfully imported account " + identity.address;
      consoleStore.log(message, "info");
      notificationStore.notify(message, "success");
    }).catch(err => {
      logger.error(err);
      consoleStore.log(err, "error");
      notificationStore.notify("Importing account failed", "error");
    });
  }

  @action changeAccount(address) {
    logger.debug("Change account to", address);
    this.currentAddress = address;
    this.updateAccountState();
  }

  @action updateAccountState() {
    logger.debug("Update account state of", this.currentAddress);
    if (typeof this.currentAddress === "undefined" || "" === this.currentAddress) {
      return;
    }

    serviceProvider.accountService.getAccountState(this.currentAddress).then(state => {
      this.currentBalance = state.balance;
      this.currentNonce = state.nonce;
    });
  }

  @computed get currentIdentity() {
    return this.address2Identity.get(this.currentAddress);
  }

  @computed get addresses() {
    return Array.from(this.address2Identity.keys());
  }

  @action exportAccount(password) {
    logger.debug("Export current account", this.currentAddress);
    if (typeof this.currentAddress === "undefined" || "" === this.currentAddress) {
      return;
    }

    const identity = this.address2Identity.get(this.currentAddress);
    serviceProvider.accountService.encryptIdentity(identity, password).then(encrypted => {
      const message = "exported: " + encrypted;
      consoleStore.log(message, "info");
      notificationStore.notify(message, "success");
    }).catch(err => {
      logger.error(err);
      consoleStore.log(err, "error");
      notificationStore.notify("Exporting account failed", "error");
    });
  }

  @action removeAccount(address) {
    logger.debug("Remove account", address);
    if (this.address2Identity.has(address)) {
      this.address2Identity.remove(address);
      changeAccount("");
      consoleStore.log("Remove account " + address, "info");
      notificationStore.notify("Successfully removed account", "success");
    } else {
      const message = "No account " + address;
      logger.error(message);
      consoleStore.log(message, "error");
      notificationStore.notify("Removing account failed", "success");
    }
  }

}

export default new AccountStore();