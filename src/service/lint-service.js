import { LuaAnalyzer, LuaLinter } from '@aergo/athena-analysis';
import logger from 'loglevel';

export default class LintService {

  constructor() {
    this.luaAnalyzer = new LuaAnalyzer();
    this.luaLinter = new LuaLinter();
  }

  async lint(source, filePath) {
    logger.debug("Resolve lint with", filePath);
    const analysisInfos = await this.luaAnalyzer.analyze(source, filePath);
    return await this.luaLinter.lint(analysisInfos);
  }

}

