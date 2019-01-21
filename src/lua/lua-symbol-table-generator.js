'use babel';

import LuaSymbolTable from './lua-symbol-table';
import {Visitor} from '../type';

// luaparse node type
const FUNCTION_DECLARATION = 'FunctionDeclaration';
const LOCAL_STATEMENT = 'LocalStatement';

const IDENTIFIER = 'Identifier';

export default class LuaSymbolTableGenerator extends Visitor {

  symbolTable = null;

  getGenerated() {
    return this.symbolTable;
  }

  reset() {
    this.symbolTable = null;
  }

  onCreateNode(node) {
    console.log("LuaSymbolTreeGenerator : onCreateNode", node);
    switch(node.type) {
      case FUNCTION_DECLARATION:
        this.parseFunctionDeclaration(node);
        break;
      case LOCAL_STATEMENT:
        this.parseLocalStatement(node);
        break;
      default:
        // do nothing
        break;
    }
  }

  parseFunctionDeclaration(node) {
    const name = node.identifier.name + " (" + node.parameters.reduce((acc, curr, index) => {
      if (0 !== index) {
        return  acc.name + ", " + curr.name;
      }
      return curr.name;
    }, "") + ")";
    const index = this.parseStartIndex(node);
    const type = FUNCTION_DECLARATION;
    this.symbolTable.addEntry(index, name, type);

    node.parameters.forEach(parameter => {
      const name = parameter.name;
      const index = this.parseStartIndex(parameter);
      const type = "Unknown";
      this.symbolTable.addEntry(index, name, type);
    });
    return ;
  }

  parseLocalStatement(node) {
    const name = node.variables[0].name;
    const index = this.parseStartIndex(node);
    const type = 0 !== node.init.length ? node.init[0].type : "Unknown";
    this.symbolTable.addEntry(index, name, type);
  }

  parseStartIndex(rangeHolder) {
    return rangeHolder.range[0];
  }

  onCreateScope(scope) {
    console.log("LuaSymbolTreeGenerator : onCreateScope", scope);
    const child = new LuaSymbolTable(this.symbolTable);
    if (null == this.symbolTable) {
      this.symbolTable = LuaSymbolTable.newSymbolTable();
    } else {
      this.symbolTable.addChild(child);
      this.symbolTable = child;
    }
    this.symbolTable.setStart(scope.index);
  }

  onDestroyScope(scope) {
    console.log("LuaSymbolTreeGenerator : onDestroyScope", scope);
    const scopeEndIndex = this.symbolTable.isRoot() ? Infinity : scope.index;
    this.symbolTable.setEnd(scopeEndIndex);
    this.symbolTable = this.symbolTable.getParent();
  }

  onLocalDeclaration(identifierName) {
    console.log("LuaSymbolTreeGenerator : onLocalDeclaration", identifierName);
    // do nothing
  }

};
