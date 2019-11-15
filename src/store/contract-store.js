import { observable, action, computed } from 'mobx';
import logger from 'loglevel';

import serviceProvider from '../service';

export default class ContractStore {

  @observable address2Interface = new Map();

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  serialize() {
    return {};
  }

  @computed get contractAddress2Abi() {
    const address2AbiInArray = Array.from(this.address2Interface.toJS()).map(([address, i]) => [ address, i.abi ]);
    const address2Abi = new Map(address2AbiInArray);
    return address2Abi;
  }

  @computed get contractAddresses() {
    return Array.from(this.address2Interface.toJS()).map(([address]) => address);
  }

  @action deserialize(data) {
    logger.debug("Deserialize", data);
  }

  @action addContract(contractAddress) {
    logger.debug("Add contract", contractAddress);
    serviceProvider.contractService.getContractInterface(contractAddress).then(contractInterface => {
      this.address2Interface.set(contractAddress, contractInterface);

      const message = "Successfully imported contract " + contractAddress;
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
    const redeployTarget = this.rootStore.deployTargetStore.currentContract;
    const deployment = {
      payload: this.rootStore.deployTargetStore.compileResult.payload.trim(),
      args: constructorArgs,
      amount: amount
    }
    if ("" !== redeployTarget) {
      logger.debug("Redeploy to", redeployTarget);
      // TODO: set redeploy
    }
    const feeLimit = this.rootStore.feeStore.limit

    serviceProvider.contractService.deploy(account, deployment, feeLimit).then(deployResult => {
      this.rootStore.accountStore.updateAccountState();

      const contractAddress = deployResult.contractAddress;
      const contractInterface = deployResult.contractInterface;
      const txHash = deployResult.txHash;
      this.address2Interface.set(contractAddress, contractInterface);

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

  @action executeContract(contractAddress, functionName, args, amount, delegationFee) {
    logger.debug("Execute contract with", contractAddress, functionName, args, amount, delegationFee);

    const contractInterface = this.address2Interface.get(contractAddress);

    const account = this.rootStore.accountStore.currentAccount;
    const execution = contractInterface.getInvocation(functionName, ...args);
    execution.amount = amount;
    // TODO: sync with athena
    // execution.delegationFee = delegationFee;
    const feeLimit = this.rootStore.feeStore.limit;

    serviceProvider.contractService.execute(account, execution, feeLimit).then(execResult => {
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

  @action queryContract(contractAddress, functionName, args) {
    logger.debug("Query contract with", contractAddress, functionName, args);

    const contractInterface = this.address2Interface.get(contractAddress);
    const query = contractInterface.getInvocation(functionName, ...args);

    serviceProvider.contractService.query(query).then(queryResult => {
      this.rootStore.consoleStore.log("Query result: " + queryResult, "info");
    }).catch(err => {
      logger.error(err);
      this.rootStore.consoleStore.log(err, "error");
      this.rootStore.notificationStore.notify("Query contract failed", "error");
    });
  }

  @action removeContract(contractAddress) {
    logger.debug("Remove contract", contractAddress);
    if (!this.address2Interface.has(contractAddress)) {
      return;
    }
    this.address2Interface.delete(contractAddress);
    this.rootStore.deployTargetStore.removeContract();
  }

}
