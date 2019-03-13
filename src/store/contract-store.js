'use babel'

import {observable, action, computed} from 'mobx';
import logger from 'loglevel';

import serviceProvider from '../service';

import accountStore from './account-store';
import compileResultStore from './compile-result-store';
import feeStore from './fee-store';
import consoleStore from './console-store';
import notificationStore from './notification-store';

export class ContractStore {

  @observable currentContract = "";
  @observable contract2Abi = new Map();

  @action deployContract() {
    const identity = accountStore.currentIdentity;
    const price = feeStore.price;
    const limit = feeStore.limit;
    const payload = compileResultStore.compileResult.payload;
    logger.debug("Deploy contract with", price, limit, payload);

    serviceProvider.contractService.deploy(identity, price, limit, payload).then(deployResult => {
      logger.debug("Deploy result:", deployResult);
      const contractAddress = deployResult.contractAddress;
      const abi = deployResult.abi;
      this.contract2Abi.set(contractAddress, abi);
      this.changeContract(contractAddress);

      accountStore.updateAccountState();
      consoleStore.log("ContractAddress: " + contractAddress, "info");
      notificationStore.notify("Successfully deployed contract", "success");
    }).catch(err => {
      accountStore.updateAccountState();
      logger.error(err);
      consoleStore.log(err, "error");
      notificationStore.notify("Deploying contract failed", "error");
    });
  }

  @action executeContract(functionName, args) {
    const identity = accountStore.currentIdentity;
    const contractAddress = this.currentContract;
    const abi = this.currentAbi;
    const price = feeStore.price;
    const limit = feeStore.limit;
    logger.debug("Execute contract with", functionName, args, contractAddress, abi, price, limit);

    serviceProvider.contractService.execute(identity, functionName, args,
          contractAddress, abi, price, limit).then(execResult => {
      accountStore.updateAccountState();
      consoleStore.log("Execute ret: " + execResult, "info");
    }).catch(err => {
      accountStore.updateAccountState();
      logger.error(err);
      this.accountService.updateAccount(accountAddress);
      consoleStore.log(err, "error");
      notificationStore.notify("Executing contract failed", "error");
    });
  }

  @action changeContract(contractAddress) {
    logger.debug("Change contract to", contractAddress);
    this.currentContract = contractAddress;
  }

  @computed get currentAbi() {
    if (!this.contract2Abi.has(this.currentContract)) {
      return {};
    }
    return this.contract2Abi.get(this.currentContract);
  }

  @computed get contracts() {
    return Array.from(this.contract2Abi.keys());
  }

}

export default new ContractStore();