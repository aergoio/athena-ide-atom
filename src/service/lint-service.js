'use babel';

import {LuaLinter} from '../lua';
import logger from 'loglevel';

export default class LintService {

  constructor(eventDispatcher) {
    this.eventDispatcher = eventDispatcher;
    this.luaLinter = new LuaLinter();
  }

  lint(source, filePath) {
    logger.debug("Resolve lint with", filePath);
    return this.luaLinter.lint(source, filePath);
  }

}

