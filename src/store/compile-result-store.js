'use babel'

import {observable, action, computed} from 'mobx';
import logger from 'loglevel';

import serviceProvider from '../service';
import consoleStore from './console-store';
import notificationStore from './notification-store';

export class CompileResultStore {

  @observable currentFile = "";
  @observable file2CompileResult = new Map();

  @action addCompileResult(baseDir, filePath) {
    logger.debug("Resolve compile with", baseDir, filePath);
    serviceProvider.compileService.compile(baseDir, filePath).then(compileResult => {
      this.changeFile(filePath);
      this.file2CompileResult.set(filePath, compileResult);
      const message = "payload: " + compileResult.payload + " abi: " + compileResult.abi;
      consoleStore.log(message, "info");
      notificationStore.notify("Compiled successfully", "success");
    }).catch(err => {
      logger.error(err);
      const message = err.toString();
      consoleStore.log(message, "error");
      notificationStore.notify("Compile failed", "error");
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

export default new CompileResultStore();