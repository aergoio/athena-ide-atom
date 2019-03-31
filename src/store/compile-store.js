'use babel'

import path from 'path';
import {action} from 'mobx';
import logger from 'loglevel';

import serviceProvider from '../service';

export default class CompileStore {

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  serialize() {
    return {};
  }

  @action deserialize(data) {
    logger.debug("Deserialize", data);
  }

  @action compileCurrentTarget() {
    const target = this.rootStore.deployTargetStore.currentTarget;
    if ("" === target) {
      return;
    }

    const baseDir = this.rootStore.deployTargetStore.currentBaseDir;
    logger.debug("Compile with", baseDir, target);
    Promise.resolve(path.resolve(baseDir, target)).then(absolutePath => {
      return serviceProvider.compileService.compile(absolutePath);
    }).then(compileResult => {
      this.rootStore.deployTargetStore.changeTarget(target);
      this.rootStore.deployTargetStore.addTargetResult(target, compileResult);
      this.rootStore.consoleStore.log("Compile success", "info");
      this.rootStore.consoleStore.log("payload: " + compileResult.payload, "info");
      this.rootStore.notificationStore.notify("Compiled successfully", "success");
    }).catch(err => {
      logger.error(err);
      const message = err.toString();
      this.rootStore.consoleStore.log(message, "error");
      this.file2CompileResult.
      this.rootStore.notificationStore.notify("Compile failed", "error");
    });
  }

}