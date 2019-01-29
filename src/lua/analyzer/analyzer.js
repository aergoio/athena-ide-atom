'use babel';

import {LuaSuggester, LuaLinter} from '../provider';
import logger from '../../logger';

import LuaImportResolver from './import-resolver';
import LuaAnalysisGenerator from './analysis-generator';

export default class LuaAnalyzer {

  constructor() {
    this.analysisInfos = [];
    this.importResolver = new LuaImportResolver();
    this.suggester = new LuaSuggester();
    this.linter = new LuaLinter();
  }

  analyze(source, fileName) {
    this._clearAnalysisInfos();
    const importStatements = this.importResolver.extractImportStatements(source);
    importStatements.forEach(importStatement => {
      this._appendAnalysisInfo(this.importResolver.getAnalysisInfosOf(importStatement, fileName));
    });
    this._appendAnalysisInfo(new LuaAnalysisGenerator().generate(source, fileName));
  }

  _clearAnalysisInfos() {
    this.analysisInfos = [];
  }

  _appendAnalysisInfo(analysisInfo) {
    this.analysisInfos.push(analysisInfo);
  }

  getSuggestions(prefix, index, fileName) {
    const suggestions = this.suggester.getSuggestions(this.analysisInfos, prefix, index, fileName);
    logger.info("Raw suggestions for prefix: " + prefix + ", index: " + index);
    logger.info(suggestions);
    return suggestions;
  }

  getLints() {
    const lints = this.linter.getLints(this.analysisInfos);
    logger.info("Raw lints");
    logger.info(lints);
    return lints;
  }

}