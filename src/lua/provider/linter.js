'use babel'

import logger from '../../logger';
import {LuaLint, luaTypes} from '../model';
import {LuaAnalyzer} from '../analyzer';

export default class LuaLinter {

  constructor() {
    this.analyzer = new LuaAnalyzer();
  }

  lint(source, filePath) {
    return this.analyzer.analyze(source, filePath).then((analysisInfos) =>
      this._extractLints(analysisInfos)
    );
  }

  _extractLints(analyzeInfos) {
    logger.info("Extract lints from");
    logger.info(analyzeInfos);

    return analyzeInfos.filter((a, i) => (analyzeInfos.length - 1) == i)
              .filter(a => null != a.err)
              .map(a => this._resolveParsingError(a));
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