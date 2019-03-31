'use babel'

import {observable, action, computed} from 'mobx';
import logger from 'loglevel';

import serviceProvider from '../service';

export default class ContractStore {

  @observable currentContract = "";
  @observable contract2Abi = new Map();

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @computed get currentAbi() {
    return this.contract2Abi.has(this.currentContract) ? 
      this.contract2Abi.get(this.currentContract) : {};
  }

  @computed get contracts() {
    return Array.from(this.contract2Abi.keys());
  }

  serialize() {
    return {
      currentContract: this.currentContract,
      contract2Abi: JSON.stringify([...this.contract2Abi])
    };
  }

  @action deserialize(data) {
    logger.debug("Deserialize", data);
    if (data) {
      this.currentContract = data.currentContract,
      this.contract2Abi = new Map(JSON.parse(data.contract2Abi));
    }
  }

  @action addContract(contract) {
    logger.debug("Add contract", contract);
    serviceProvider.contractService.getABI(contract).then(abi => {
      this.contract2Abi.set(contract, abi);
      this.changeContract(contract);
      const message = "Successfully imported contract " + contract;
      this.rootStore.consoleStore.log(message, "info");
      this.rootStore.notificationStore.notify(message, "success");
    }).catch(err => {
      logger.error(err);
      this.rootStore.consoleStore.log(err, "error");
      this.rootStore.notificationStore.notify("Importing contract failed", "error");
    });
  }

  @action deployContract(constructorArgs) {
    logger.debug("deploy contract with", constructorArgs);
    const identity = this.rootStore.accountStore.currentIdentity;
    const price = this.rootStore.feeStore.price;
    const limit = this.rootStore.feeStore.limit;
    const payload = this.rootStore.deployTargetStore.compileResult.payload;
    logger.debug("Deploy contract with", price, limit, payload, constructorArgs);

    serviceProvider.contractService.deploy(identity, price, limit, payload, constructorArgs).then(deployResult => {
      logger.debug("Deploy result:", deployResult);
      const contractAddress = deployResult.contractAddress;
      const abi = deployResult.abi;
      this.contract2Abi.set(contractAddress, abi);

      this.rootStore.accountStore.updateAccountState();
      this.rootStore.consoleStore.log("ContractAddress: " + contractAddress, "info");
      this.rootStore.notificationStore.notify("Successfully deployed contract", "success");
      this.changeContract(contractAddress);
    }).catch(err => {
      this.rootStore.accountStore.updateAccountState();
      logger.error(err);
      this.rootStore.consoleStore.log(err, "error");
      this.rootStore.notificationStore.notify("Deploying contract failed", "error");
    });
  }

  @action executeContract(functionName, args) {
    const identity = this.rootStore.accountStore.currentIdentity;
    const contractAddress = this.currentContract;
    const abi = this.currentAbi;
    const price = this.rootStore.feeStore.price;
    const limit = this.rootStore.feeStore.limit;
    logger.debug("Execute contract with", functionName, args, contractAddress, abi, price, limit);

    serviceProvider.contractService.execute(identity, functionName, args,
          contractAddress, abi, price, limit).then(execResult => {
      this.rootStore.accountStore.updateAccountState();
      this.rootStore.consoleStore.log("Execute ret: " + execResult, "info");
    }).catch(err => {
      logger.error(err);
      this.rootStore.accountStore.updateAccountState();
      this.rootStore.consoleStore.log(err, "error");
      this.rootStore.notificationStore.notify("Executing contract failed", "error");
    });
  }

  @action changeContract(contractAddress) {
    const message = "Change contract to " + contractAddress;
    logger.debug(message);
    this.rootStore.consoleStore.log(message, "info");
    this.currentContract = contractAddress;
  }

  @action removeContract(contract) {
    logger.debug("Remove contract", contract);
    if (!this.contract2Abi.has(contract)) {
      return;
    }

    this.contract2Abi.delete(contract);
    this.changeContract("");
  }

}