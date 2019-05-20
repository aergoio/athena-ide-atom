import fs from 'fs';
import logger from 'loglevel';

import { CompilerType, CompilerFactory } from '@aergo/athena-compiler';

export default class CompileService {

  constructor() {
    this.compiler = new CompilerFactory().create(CompilerType.Lua);
  }

  async compile(absolutePath) {
    logger.debug("Compile with", absolutePath);
    const source = fs.readFileSync(absolutePath, "utf8");
    const compileResult = await this.compiler.compile(source, absolutePath);
    return { payload: compileResult.payload, abi: JSON.stringify(compileResult.abi, null, 2) };
  }

}
