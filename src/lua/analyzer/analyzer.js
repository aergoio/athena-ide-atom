'use babel';

import logger from 'loglevel';

import LuaImportResolver from './import-resolver';
import LuaAnalysisGenerator from './analysis-generator';

export default class LuaAnalyzer {

  constructor() {
    this.importResolver = new LuaImportResolver();
    this.analysisGenerator = new LuaAnalysisGenerator();
  }

  analyze(source, filePath) {
    logger.debug("Analyze", filePath);
    logger.debug(source);
    const analysisInfos = [];
    const importStatements = this.importResolver.extractImportStatements(source);
    importStatements.forEach(importStatement => {
      analysisInfos.push(this.importResolver.getAnalysisInfosOf(importStatement, filePath));
    });
    analysisInfos.push(this.analysisGenerator.generate(source, filePath));
    return Promise.resolve(analysisInfos);
  }

}