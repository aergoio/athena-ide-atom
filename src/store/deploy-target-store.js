'use babel'

import {observable, action, computed} from 'mobx';
import logger from 'loglevel';

export default class DeployTargetStore {

  @observable currentTarget = "";
  @observable target2CompileResult = new Map();

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

  @computed get targets() {
    return Array.from(this.target2CompileResult.keys());
  }

  serialize() {
    return {};
  }

  @action deserialize(data) {
    logger.debug("Deserialize", data);
  }

  @action addTarget(candidate, compileResult) {
    logger.debug("Add compile target", candidate, compileResult);
    this.target2CompileResult.set(candidate, compileResult);
  }

  @action changeTarget(target) {
    logger.debug("Change target to", target);
    this.currentTarget = target;
  }

  @action removeTarget(target) {
    logger.debug("Remove possibly candidate", target);
    if (!this.target2CompileResult.has(target)) {
      return;
    }

    const result = this.target2CompileResult.get(target);
    if (typeof result !== "undefined") {
      return;
    }

    this.target2CompileResult.delete(target);
  }

}