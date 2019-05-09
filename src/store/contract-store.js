import { observable, action, computed } from 'mobx';
import logger from 'loglevel';

import serviceProvider from '../service';

export default class ContractStore {

  @observable observableContractAddress2Abi = new Map();

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  serialize() {
    return {};
  }

  @computed get contractAddress2Abi() {
    return this.observableContractAddress2Abi.toJS();
  }

  @action deserialize(data) {
    logger.debug("Deserialize", data);
  }

  @action addContract(contract) {
    logger.debug("Add contract", contract);
    serviceProvider.contractService.getABI(contract).then(abi => {
      this.observableContractAddress2Abi.set(contract, abi);
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
      this.observableContractAddress2Abi.set(contractAddress, abi);

      this.rootStore.accountStore.updateAccountState();
      this.rootStore.consoleStore.log("ContractAddress: " + contractAddress, "info");
      this.rootStore.notificationStore.notify("Successfully deployed contract", "success");
    }).catch(err => {
      this.rootStore.accountStore.updateAccountState();
      logger.error(err);
      this.rootStore.consoleStore.log(err, "error");
      this.rootStore.notificationStore.notify("Deploying contract failed", "error");
    });
  }

  @action executeContract(contractAddress, abi, functionName, args) {
    const identity = this.rootStore.accountStore.currentIdentity;
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

  @action queryContract(contractAddress, abi, functionName, args) {
    logger.debug("Query contract with", contractAddress, abi, functionName, args);

    serviceProvider.contractService.query(contractAddress, abi, functionName, args).then(queryResult => {
      this.rootStore.consoleStore.log("Query result: " + queryResult, "info");
    }).catch(err => {
      logger.error(err);
      this.rootStore.consoleStore.log(err, "error");
      this.rootStore.notificationStore.notify("Query contract failed", "error");
    });
  }

  @action removeContract(contractAddress) {
    logger.debug("Remove contract", contractAddress);
    if (!this.observableContractAddress2Abi.has(contractAddress)) {
      return;
    }
    this.observableContractAddress2Abi.delete(contractAddress);
  }

}
