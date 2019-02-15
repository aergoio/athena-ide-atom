'use babel';

import {LuaLinter} from '../lua';
import logger from '../logger';

export default class LintService {

  constructor(eventDispatcher) {
    this.eventDispatcher = eventDispatcher;
    this.luaLinter = new LuaLinter();
  }

  lint(source, filePath) {
    logger.debug("Resolve lint with")
    logger.debug(filePath);
    logger.debug(source);
    return this.luaLinter.lint(source, filePath);
  }

}

