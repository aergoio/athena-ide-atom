'use babel'

import {observable, action, computed} from 'mobx';
import logger from 'loglevel';

import serviceProvider from '../service';

export default class CompileResultStore {

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

  @action addCompileResult(baseDir, filePath) {
    logger.debug("Resolve compile with", baseDir, filePath);
    serviceProvider.compileService.compile(baseDir, filePath).then(compileResult => {
      this.changeFile(filePath);
      this.file2CompileResult.set(filePath, compileResult);
      const message = "payload: " + compileResult.payload + " abi: " + compileResult.abi;
      this.rootStore.consoleStore.log(message, "info");
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