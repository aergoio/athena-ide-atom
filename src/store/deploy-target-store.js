import path from 'path';
import { observable, action, computed } from 'mobx';
import logger from 'loglevel';

import serviceProvider from '../service';

export default class DeployTargetStore {

  @observable currentTarget = "";
  @observable target2CompileResult = new Map();
  @observable currentContract = "";

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @computed get compileResult() {
    const compileResult = this.target2CompileResult.get(this.currentTarget);
    return typeof compileResult !== "undefined" ?
      compileResult : { payload: "", abi: "" };
  }

  @computed get constructorArgs() {
    const compileResult = this.target2CompileResult.get(this.currentTarget);
    if (typeof compileResult === "undefined") {
      return [];
    }

    const abi = JSON.parse(compileResult.abi);
    const abiFunctions = abi.functions;
    if (typeof abiFunctions === "undefined") {
      return [];
    }

    return abiFunctions.filter(f => "constructor" === f.name)
      .map(f => f.arguments)
      .reduce((acc, a) => acc.concat(a), []) // flatten
      .map(a => a.name);
  }

  @computed get isPayable() {
    const compileResult = this.target2CompileResult.get(this.currentTarget);
    if (typeof compileResult === "undefined") {
      return false;
    }

    const abi = JSON.parse(compileResult.abi);
    const abiFunctions = abi.functions;
    return abiFunctions.filter(f => "constructor" === f.name)
      .filter(f => typeof f.payable !== "undefined")
      .length === 1;
  }

  @computed get targets() {
    return Array.from(this.target2CompileResult.keys());
  }

  serialize() {
    return {};
  }

  @action deserialize(data) {
    logger.debug("Deserialize", data);
  }

  @action addTarget(baseDir, target) {
    logger.debug("Compile with", baseDir, target);
    Promise.resolve(path.resolve(baseDir, target)).then(absolutePath => {
      return serviceProvider.compileService.compile(absolutePath);
    }).then(compileResult => {
      this.target2CompileResult.set(target, compileResult);
      this.changeTarget(target);

      this.rootStore.consoleStore.log("Compile success", "info");
      this.rootStore.consoleStore.log("Payload:\n" + compileResult.payload, "info");
      this.rootStore.consoleStore.log("Abi:\n" + compileResult.abi, "info");
      this.rootStore.notificationStore.notify("Compiled successfully", "success");
    }).catch(err => {
      logger.error(err);
      const message = err.toString();
      this.rootStore.consoleStore.log(message, "error");
      this.rootStore.notificationStore.notify("Compile failed", "error");
    });
  }

  @action changeTarget(target) {
    logger.debug("Change target to", target);
    this.currentTarget = target;
  }

  @action removeTarget(target) {
    logger.debug("Remove deploy target", target);
    this.target2CompileResult.delete(target);
  }

  @action changeContract(contract) {
    logger.debug("Change contract to", contract);
    this.currentContract = contract;
  }

  @action removeContract() {
    logger.debug("Remove deploy contract");
    this.currentContract = "";
  }

}
