'use babel';

import fs from 'fs';
import path from 'path';
import logger from 'loglevel';

import {CompilerType, CompilerFactory} from '@aergoio/athena-compiler';

export default class CompileService {

  constructor() {
    this.compiler = new CompilerFactory().create(CompilerType.Lua);
  }

  async compile(baseDir, relativePath) {
    logger.debug("Resolve compile with", baseDir, relativePath);
    const absolutePath = path.resolve(baseDir, relativePath);
    logger.debug("Resolved absolute path", absolutePath);
    const source = this._readFile(absolutePath);
    return this.compiler.compile(source, absolutePath);
  }

  _readFile(filePath) {
    return fs.readFileSync(filePath, "utf8");
  }

}
