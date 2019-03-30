'use babel'

import {observable, action, computed} from 'mobx';
import logger from 'loglevel';

import serviceProvider from '../service';

export default class CompileResultStore {

  @observable rootDir = "";
  @observable currentFile = "";
  @observable file2CompileResult = new Map();

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  serialize() {
    return {};
  }

  @action deserialize(data) {
    logger.debug("Deserialize", data);
  }

  @action setRootDir(rootDir) {
    this.rootDir = rootDir;
  }

  @action compileWithCurrent() {
    logger.debug("Resolve compile with", this.rootDir, this.currentFile);
    serviceProvider.compileService.compile(this.rootDir, this.currentFile).then(compileResult => {
      this.file2CompileResult.set(this.currentFile, compileResult);
      this.rootStore.consoleStore.log("Compile success", "info");
      this.rootStore.consoleStore.log("payload: " + compileResult.payload, "info");
      this.rootStore.notificationStore.notify("Compiled successfully", "success");
    }).catch(err => {
      logger.error(err);
      const message = err.toString();
      this.rootStore.consoleStore.log(message, "error");
      this.rootStore.notificationStore.notify("Compile failed", "error");
    });
  }

  @action changeFile(file) {
    logger.debug("Change file to", file);
    this.currentFile = file;
  }

  @computed get files() {
    return Array.from(this.file2CompileResult.keys());
  }

  @computed get compileResult() {
    if (!this.file2CompileResult.has(this.currentFile)) {
      return { payload: "", abi: "" };
    }
    return this.file2CompileResult.get(this.currentFile);
  }

}