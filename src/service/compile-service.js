'use babel';

import fs from 'fs';
import os from 'os';
import child_process from 'child_process';

import {LuaImportResolver} from '../lua';

import {EventType} from '../event';
import logger from '../logger';

const LUA_COMPILER_OSX = "aergoluac_osx";
const LUA_COMPILER_LINUX = "aergoluac_linux";
const LUA_COMPILER_WINDOW = "aergoluac_window";
const LUA_TEMP_FILE = "athena_ide_atom_temp.lua";

export default class CompileService {

  constructor(eventDispatcher) {
    this.eventDispatcher = eventDispatcher;
    this.importResolver = new LuaImportResolver();
  }

  compile(filePath) {
    logger.debug("Resolve compile with");
    logger.debug(filePath);

    const source = this._readFile(filePath);
    const dependencyResolved = this._resolveDependency(source, filePath);
    logger.debug("dependency resolved source");
    logger.debug(dependencyResolved);

    const tempSourceFile = this._saveToTemp(dependencyResolved);
    const compiler = this._resolveCompilerPath();
    logger.debug("compiler path");
    logger.debug(compiler);

    const spanResult = child_process.spawnSync(compiler, ["--payload", tempSourceFile]);
    logger.debug("compile spawn result");
    logger.debug(spanResult);

    let compileResult = null;
    if (0 === spanResult.status && 0 === spanResult.stderr.length) {
      compileResult = this._success(spanResult.stdout.toString());
    } else {
      compileResult = this._fail(spanResult.stderr.toString());
    }

    this.eventDispatcher.dispatch(EventType.Compile, compileResult);
    return Promise.resolve(compileResult);
  }

  _resolveDependency(source, baseFile) {
    let resolvedSource = "";
    const importStatements = this.importResolver.extractImportStatements(source);
    importStatements.forEach(importStatement => {
      const importSource = this.importResolver.getSourceOf(importStatement, baseFile);
      resolvedSource += this.importResolver.getImportTrimmed(importSource);
    });
    logger.debug("import statements");
    logger.debug(importStatements);
    resolvedSource += this.importResolver.getImportTrimmed(source);
    return resolvedSource;
  }

  _readFile(filePath) {
    return fs.readFileSync(filePath, "utf8");
  }

  _saveToTemp(source) {
    const absPath = os.tmpdir() + "/" + LUA_TEMP_FILE;
    fs.writeFileSync(absPath, source)
    return absPath;
  }

  _resolveCompilerPath() {
    let compiler = __dirname + "/res/";
    if ('darwin' === os.platform()) {
      compiler = compiler + LUA_COMPILER_OSX;
    } else if ('linux' === os.platform()) {
      compiler = compiler + LUA_COMPILER_LINUX;
    } else if ('win32' === os.platform()) {
      compiler = compiler + LUA_COMPILER_WINDOW;
    } else {
      throw "UnSupported os type";
    }
    return compiler;
  }

  _success(message) {
    return {
      result: message,
      err: null
    };
  }

  _fail(message) {
    return {
      result: null,
      err: message
    };
  }
}
