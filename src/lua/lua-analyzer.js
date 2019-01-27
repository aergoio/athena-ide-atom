'use babel';

import LuaAnalysisGenerator from './lua-analysis-generator';
import LuaImportResolver from './lua-import-resolver';
import LuaSuggester from './lua-suggester';
import {Analyzer} from '../type';
import logger from '../logger';

export default class LuaAnalyzer extends Analyzer {

  constructor() {
    super();
    this.symbolTables = [];
    this.tableFieldTrees = [];
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
    this.symbolTables = [];
    this.tableFieldTrees = [];
  }

  _appendAnalysisInfo(analysisInfo) {
    this.symbolTables.push(analysisInfo.symbolTable);
    this.tableFieldTrees.push(analysisInfo.tableFieldTree);
  }

  getSuggestions(prefix, index, fileName) {
    const suggester = new LuaSuggester(this.symbolTables, this.tableFieldTrees);
    const suggestions = suggester.getSuggestions(prefix, index, fileName);
    logger.info("Raw suggestions for prefix: " + prefix + ", index: " + index);
    logger.info(suggestions);
    return suggestions;
  }

}