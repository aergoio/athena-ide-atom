'use babel';

import fs from 'fs';
import os from 'os';
import path from 'path';
import child_process from 'child_process';
import logger from 'loglevel';

import {LuaImportResolver} from '../lua';

const LUA_COMPILER_OSX = "aergoluac_osx";
const LUA_COMPILER_LINUX = "aergoluac_linux";
const LUA_COMPILER_WINDOW = "aergoluac_window";

const LUA_ABI_TEMP_FILE = "temp_athena_ide_atom.abi";
const LUA_BC_TEMP_FILE = "temp_athena_ide_atom.bc";
const LUA_TEMP_FILE = "temp_athena_ide_atom.lua";

export default class CompileService {

  constructor() {
    this.importResolver = new LuaImportResolver();
  }

  compile(baseDir, relativePath) {
    logger.debug("Resolve compile with", baseDir, relativePath);

    const absolutePath = path.resolve(baseDir, relativePath);
    logger.debug("Resolved absolute path", absolutePath);
    const source = this._readFile(absolutePath);
    const dependencyResolved = this._resolveDependency(source, absolutePath);
    const tempSourceFile = this._saveToTemp(dependencyResolved);
    logger.debug("Dependency resolved source");
    logger.debug(dependencyResolved);
    logger.debug("Temp file saved to", tempSourceFile);

    const compileResult = this._compile(tempSourceFile);
    logger.debug("Compile result", compileResult);

    return new Promise((resolve, reject) => {
      if (null != compileResult.err) {
        reject(compileResult.err);
      }
      resolve(compileResult.result);
    });
  }

  _resolveDependency(source, baseFile) {
    let resolvedSource = "";
    const importStatements = this.importResolver.extractImportStatements(source);
    importStatements.forEach(importStatement => {
      const importSource = this.importResolver.getSourceOf(importStatement, baseFile);
      resolvedSource += this.importResolver.getImportTrimmed(importSource);
    });
    logger.debug("Import statements", importStatements);
    resolvedSource += this.importResolver.getImportTrimmed(source);
    return resolvedSource;
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

  _compile(sourceFilePath) {
    const compileResult = {
      payload: "",
      abi: ""
    };

    const compiler = this._resolveCompilerPath();
    logger.debug("Compiler path:", compiler);

    const payloadResult = child_process.spawnSync(compiler, ["--payload", sourceFilePath]);
    logger.debug("Payload result:", payloadResult);
    if (this._isSpanFail(payloadResult)) {
      compileResult.err = payloadResult.stderr.toString();
      return compileResult;
    }

    const abiTempFile = this._appendToTemp(LUA_ABI_TEMP_FILE);
    const bcTempFile = this._appendToTemp(LUA_BC_TEMP_FILE);
    const abiResult = child_process.spawnSync(compiler, ["--abi", abiTempFile, sourceFilePath, bcTempFile]);
    logger.debug("Abi result:", abiResult);
    if (this._isSpanFail(abiResult)) {
      return { result: null, err: abiResult.stderr.toString() };
    }

    compileResult.payload = payloadResult.stdout.toString();
    compileResult.abi = JSON.stringify(JSON.parse(this._readFile(abiTempFile)), null, 2);

    return { result: compileResult, err: null };
  }

  _isSpanFail(spanResult) {
    return (0 !== spanResult.status) || (0 !== spanResult.stderr.length);
  }

  _appendToTemp(filePath) {
    return os.tmpdir() + "/" + filePath;
  }

  _readFile(filePath) {
    return fs.readFileSync(filePath, "utf8");
  }

}
