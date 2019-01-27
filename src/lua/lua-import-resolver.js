'use babel'

import path from 'path';
import os from 'os';
import fs from 'fs';

import LuaAnalysisGenerator from './lua-analysis-generator';

import logger from '../logger';

export default class LuaImportResolver {

  constructor() {
    this.importToAnalysisInfo = new Map();
    this.analysisGenerator = new LuaAnalysisGenerator();
  }

  extractImportStatements(source) {
    const importStatements = [];
    let startIndex = 0;
    while (startIndex < source.length) {
      const nextLineInfo = this._nextLine(source, startIndex);
      const nextLine = nextLineInfo.line;
      startIndex = nextLineInfo.endIndex + 1;
      if (!this._isImportStatement(nextLine)) {
        break;
      }
      importStatements.push(this._trimImportStatement(nextLine));
    }
    return importStatements;
  }

  _nextLine(source, startIndex) {
    let endIndex = startIndex;
    while (endIndex < source.length && source[endIndex] != '\n') {
      ++endIndex;
    }
    let line = source.substring(startIndex, endIndex + 1);
    return {line: line, endIndex: endIndex};
  }

  _isImportStatement(line) {
    return line.indexOf("import") !== -1;
  }

  _trimImportStatement(rawImportStatement) {
    const splited = rawImportStatement.trim().split(/\s+/);
    const importTarget = splited[1].substring(1, splited[1].length - 1);
    return "import "  + "\"" + importTarget + "\"";
  }

  getAnalysisInfosOf(rawImportStatement, fileName) {
    const trimmed = this._trimImportStatement(rawImportStatement);
    const source = this.getSourceOf(trimmed, fileName);
    if (this._isRelativeImport(trimmed)) {
      const importCanonicalPath = this._extractImportCanonicalPath(trimmed, fileName);
      return this.analysisGenerator.generate(source, importCanonicalPath);
    } else { // package import
      if (!this.importToAnalysisInfo.has(trimmed)) {
        const analysisInfo = this.analysisGenerator.generate();
        this.importToAnalysisInfo.set(trimmed, analysisInfo);
      }
      return this.importToAnalysisInfo.get(trimmed);
    }
  }

  getSourceOf(rawImportStatement, fileName) {
    const trimmed = this._trimImportStatement(rawImportStatement);
    const importCanonicalPath = this._extractImportCanonicalPath(trimmed, fileName);
    return this._readFile(importCanonicalPath);
  }

  _extractImportCanonicalPath(trimmedImportStatement, fileName) {
    const splited = trimmedImportStatement.trim().split(/\s+/);
    const importTarget = splited[1].substring(1, splited[1].length - 1);
    logger.info("splited: " + splited);

    let importPath = "";
    if (this._isRelativeImport(importTarget)) {
      importPath = os.homedir + "/.aergo_modules/" + importTarget;
      const aergoJson = this._getPackageInfo(importPath);
      importPath = importPath + "/" + aergoJson.target;
    } else { // package import
      importPath = path.resolve(path.dirname(fileName), importTarget);
    }
    return importPath;
  }

  _isRelativeImport(importTarget) {
    return importTarget[0] !== ".";
  }

  _getPackageInfo(packagePath) {
    const aergoJsonPath = packagePath + "/aergo.json";
    const rawAergoJson = this._readFile(aergoJsonPath);
    const aergoJson = JSON.parse(rawAergoJson)
    logger.info("package info: " + aergoJsonPath);
    logger.info(aergoJson);
    return aergoJson;
  }

  _readFile(filePath) {
    return fs.readFileSync(filePath, "utf8");
  }

}