'use babel';

import {LuaLinter} from '@aergoio/athena-analysis';
import logger from 'loglevel';

export default class LintService {

  constructor() {
    this.luaLinter = new LuaLinter();
  }

  async lint(source, filePath) {
    logger.debug("Resolve lint with", filePath);
    return await this.luaLinter.lint(source, filePath);
  }

}

