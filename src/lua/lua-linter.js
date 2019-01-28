'use babel'

import * as types from './lua-types';
import logger from '../logger';

export default class LuaLinter {

  constructor(analyzeInfos) {
    this.analyzeInfos = analyzeInfos;
  }

  getLints() {
    const lints = [];
    this.analyzeInfos.filter((a, i) => (this.analyzeInfos.length - 1) == i)
                     .filter(a => null != a.err)
                     .forEach(analysisInfo => lints.push(this._resolveParsingError(analysisInfo)));
    return lints;
  }

  _resolveParsingError(analysisInfo) {
    const err = analysisInfo.err;
    logger.debug("Resolve parsing error to lint");
    logger.debug(err);

    const type = types.ATHENA_LINT_TYPE_ERROR;
    const file = analysisInfo.file;
    const index = err.index;
    const message = err.message;
    return new types.Lint(type, file, index, message);
  }

}