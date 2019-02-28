'use babel'

export default class LuaAnalysisInfo {

  constructor(file, symbolTable, tableFieldTree, err) {
    this.file = file;
    this.symbolTable = symbolTable;
    this.tableFieldTree = tableFieldTree;
    this.err = err;
  }

}