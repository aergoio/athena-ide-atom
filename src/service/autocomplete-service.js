import { LuaAnalyzer, LuaSuggester } from '@aergo/athena-analysis';
import logger from 'loglevel';

export default class AutoCompleteService {

  constructor() {
    this.luaAnalyzer = new LuaAnalyzer();
    this.luaSuggester = new LuaSuggester();
  }

  async suggest(source, filePath, prefix, index) {
    logger.debug("Resolve suggestion with", filePath, prefix, index);
    const analysisInfos = await this.luaAnalyzer.analyze(source, filePath);
    return await this.luaSuggester.suggest(analysisInfos, prefix, index);
  }

}