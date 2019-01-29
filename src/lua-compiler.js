'use babel';

import fs from 'fs';
import os from 'os';
import child_process from 'child_process';

import {LuaImportResolver} from './lua';
import logger from './logger';

const COMPIlER_PROGRAM = "aergoluac";
const TEMP_FILE = "athena_ide_atom_temp.lua";

export default class LuaComplier {

  constructor() {
    this.importResolver = new LuaImportResolver();
  }

  compile(source, filePath) {
    const dependencyResolved = this._resolveDependency(source, filePath);
    logger.debug("dependency resolved source");
    logger.debug(dependencyResolved);

    const tempSourceFile = this._saveToTemp(dependencyResolved);
    const compiler = this._resolveCompilerPath();
    logger.debug("compiler path");

    const result = child_process.spawnSync(compiler, ["--payload", tempSourceFile]);
    logger.debug("compile spawn result");
    logger.debug(result);
    if (0 === result.status && 0 === result.stderr.length) {
      return this._success(result.stdout.toString());
    } else {
      return this._fail(result.stderr.toString());
    }
  }

  _resolveDependency(source, baseFile) {
    let resolvedSource = "";
    const importStatements = this.importResolver.extractImportStatements(source);
    importStatements.forEach(importStatement => {
      const importSource = this.importResolver.getSourceOf(importStatement, baseFile);
      resolvedSource += this.importResolver.getImportTrimmed(importSource);
    });
    resolvedSource += this.importResolver.getImportTrimmed(source);
    return resolvedSource;
  }

  _saveToTemp(source) {
    const absPath = os.tmpdir() + "/" + TEMP_FILE;
    fs.writeFileSync(absPath, source)
    return absPath;
  }

  _resolveCompilerPath() {
    return __dirname + "/resources/" + COMPIlER_PROGRAM;
  }

  _success(message) {
    return {
      result: "success",
      message: message
    };
  }

  _fail(message) {
    return {
      result: "fail",
      message: message
    };
  }
};
