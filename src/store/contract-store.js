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

  @action deployContract(constructorArgs, amount) {
    logger.debug("Deploy contract with", constructorArgs, amount);

    const account = this.rootStore.accountStore.currentAccount;
    const deployInfo = {
      payload: this.rootStore.deployTargetStore.compileResult.payload.trim(),
      args: constructorArgs
    }
    const fee = {
      price: this.rootStore.feeStore.price,
      limit: this.rootStore.feeStore.limit
    }

    serviceProvider.contractService.deploy(account, deployInfo, fee, amount).then(deployResult => {
      this.rootStore.accountStore.updateAccountState();

      const contractAddress = deployResult.contractAddress;
      const abi = deployResult.abi;
      const txHash = deployResult.txHash;
      this.observableContractAddress2Abi.set(contractAddress, abi);
      this.rootStore.consoleStore.log("Deploy TxHash: " + txHash, "info");
      this.rootStore.consoleStore.log("ContractAddress: " + contractAddress, "info");
      this.rootStore.notificationStore.notify("Successfully deployed contract", "success");
    }).catch(err => {
      this.rootStore.accountStore.updateAccountState();
      logger.error(err);
      this.rootStore.consoleStore.log(err, "error");
      this.rootStore.notificationStore.notify("Deploying contract failed", "error");
    });
  }

  @action executeContract(contractAddress, abi, functionName, args, amount) {
    logger.debug("Execute contract with", contractAddress, abi, functionName, args, amount);

    const account = this.rootStore.accountStore.currentAccount;
    const invocationInfo = {
      contractAddress: contractAddress,
      abi: abi,
      targetFunction: functionName,
      args: args
    };
    const fee = {
      price: this.rootStore.feeStore.price,
      limit: this.rootStore.feeStore.limit
    }

    serviceProvider.contractService.execute(account, invocationInfo, fee, amount).then(execResult => {
      this.rootStore.accountStore.updateAccountState();

      const txHash = execResult.txHash;
      const result = execResult.result;
      const status = execResult.status;
      this.rootStore.consoleStore.log("Execute txHash: " + txHash, "info");
      this.rootStore.consoleStore.log("Execute result: " + result + ", status: " + status, "info");
    }).catch(err => {
      logger.error(err);
      this.rootStore.accountStore.updateAccountState();
      this.rootStore.consoleStore.log(err, "error");
      this.rootStore.notificationStore.notify("Executing contract failed", "error");
    });
  }

  @action queryContract(contractAddress, abi, functionName, args) {
    logger.debug("Query contract with", contractAddress, abi, functionName, args);

    const invocationInfo = {
      contractAddress: contractAddress,
      abi: abi,
      targetFunction: functionName,
      args: args
    };

    serviceProvider.contractService.query(invocationInfo).then(queryResult => {
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
