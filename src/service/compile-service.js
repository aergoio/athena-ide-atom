import fs from 'fs';
import logger from 'loglevel';

import { CompilerType, CompilerFactory } from '@aergo/athena-compiler';

export default class CompileService {

  constructor() {
    this.compiler = new CompilerFactory().create(CompilerType.Lua);
  }

  async compile(absolutePath) {
    logger.debug("Compile with", absolutePath);
    const source = this._readFile(absolutePath);
    return await this.compiler.compile(source, absolutePath);
  }

  _readFile(filePath) {
    return fs.readFileSync(filePath, "utf8");
  }

}
