'use babel'

import path from 'path';
import os from 'os';
import fs from 'fs';

import logger from 'loglevel';

import LuaAnalysisGenerator from './analysis-generator';

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

  getAnalysisInfosOf(importStatement, baseFile) {
    const trimmed = this._trimImportStatement(importStatement);
    const source = this.getSourceOf(trimmed, baseFile);
    if (this._isRelativeImport(trimmed)) {
      const importCanonicalPath = this._extractImportCanonicalPath(trimmed, baseFile);
      return this.analysisGenerator.generate(source, importCanonicalPath);
    } else { // package import
      if (!this.importToAnalysisInfo.has(trimmed)) {
        const analysisInfo = this.analysisGenerator.generate();
        this.importToAnalysisInfo.set(trimmed, analysisInfo);
      }
      return this.importToAnalysisInfo.get(trimmed);
    }
  }

  getSourceOf(importStatement, baseFile) {
    const trimmed = this._trimImportStatement(importStatement);
    const importCanonicalPath = this._extractImportCanonicalPath(trimmed, baseFile);
    return this._readFile(importCanonicalPath);
  }

  getImportTrimmed(source) {
    let startIndex = 0;
    while (startIndex < source.length) {
      const nextLineInfo = this._nextLine(source, startIndex);
      const nextLine = nextLineInfo.line;
      if (!this._isImportStatement(nextLine)) {
        break;
      }
      startIndex = nextLineInfo.endIndex + 1;
    }
    return source.substring(startIndex);
  }

  _extractImportCanonicalPath(trimmedImportStatement, baseFile) {
    const splited = trimmedImportStatement.trim().split(/\s+/);
    const importTarget = splited[1].substring(1, splited[1].length - 1);
    logger.debug("Splited import statement:", splited);

    let importPath = "";
    if (this._isRelativeImport(importTarget)) {
      importPath = os.homedir + "/.aergo_modules/" + importTarget;
      const aergoJson = this._getPackageInfo(importPath);
      importPath = importPath + "/" + aergoJson.target;
    } else { // package import
      importPath = path.resolve(path.dirname(baseFile), importTarget);
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
    logger.debug("Package info", aergoJsonPath, aergoJson);
    return aergoJson;
  }

  _readFile(filePath) {
    return fs.readFileSync(filePath, "utf8");
  }

}