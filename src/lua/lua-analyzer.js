'use babel';

import {AnalysisInfo} from './lua-types';
import LuaAnalysisGenerator from './lua-analysis-generator';
import LuaImportResolver from './lua-import-resolver';
import LuaSuggester from './lua-suggester';
import LuaLinter from './lua-linter';
import {Analyzer} from '../type';
import logger from '../logger';

export default class LuaAnalyzer extends Analyzer {

  constructor() {
    super();
    this.analysisInfos = [];
    this.importResolver = new LuaImportResolver();
    this.analysisGenerator = new LuaAnalysisGenerator();
  }

  analyze(source, fileName) {
    this._clearAnalysisInfos();
    const importStatements = this.importResolver.extractImportStatements(source);
    importStatements.forEach(importStatement => {
      this._appendAnalysisInfo(this.importResolver.getAnalysisInfosOf(importStatement, fileName));
    });
    this._appendAnalysisInfo(this.analysisGenerator.generate(source, fileName));
  }

  _clearAnalysisInfos() {
    this.analysisInfos = [];
  }

  _appendAnalysisInfo(analysisInfo) {
    this.analysisInfos.push(analysisInfo);
  }

  getSuggestions(prefix, index, fileName) {
    const suggester = new LuaSuggester(this.analysisInfos);
    const suggestions = suggester.getSuggestions(prefix, index, fileName);
    logger.info("Raw suggestions for prefix: " + prefix + ", index: " + index);
    logger.info(suggestions);
    return suggestions;
  }

  getLints() {
    const linter = new LuaLinter(this.analysisInfos);
    const lints = linter.getLints();
    logger.info("Raw lints");
    logger.info(lints);
    return lints;
  }

}