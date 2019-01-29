'use babel'

import {LuaLint, luaTypes} from '../model';
import logger from '../../logger';

export default class LuaLinter {

  getLints(analyzeInfos) {
    logger.debug("lint with");
    logger.debug(analyzeInfos);
    const lints = [];
    analyzeInfos.filter((a, i) => (analyzeInfos.length - 1) == i)
                     .filter(a => null != a.err)
                     .forEach(analysisInfo => lints.push(this._resolveParsingError(analysisInfo)));
    return lints;
  }

  _resolveParsingError(analysisInfo) {
    const err = analysisInfo.err;
    logger.debug("Resolve parsing error to lint");
    logger.debug(err);

    const type = luaTypes.LUA_LINT_TYPE_ERROR;
    const file = analysisInfo.file;
    const index = err.index;
    const message = err.message;
    return new LuaLint(type, file, index, message);
  }

}