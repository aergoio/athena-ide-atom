'use babel';

import LuaSymbolTable from './lua-symbol-table';
import {Visitor} from '../type';
import * as types from './lua-types';

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
      case types.FUNCTION_DECLARATION:
        this.parseFunctionDeclaration(node);
        break;
      case types.ASSIGNMENT_STATEMENT:
      case types.LOCAL_STATEMENT:
        this.parseVariableAssignment(node);
        break;
      default:
        // do nothing
        break;
    }
  }

  parseFunctionDeclaration(node) {
    // ignore anonymous function
    if (null == node.identifier) {
      return;
    }
    this.addFunctionDeclaration(node.identifier.name, node.parameters, this.parseStartIndex(node));
  }

  parseVariableAssignment(node) {
    const name = node.variables[0].name;
    const index = this.parseStartIndex(node);
    if (types.FUNCTION_DECLARATION === node.init[0].type) {
      this.addFunctionDeclaration(name, node.init[0].parameters, index);
    } else {
      const type = 0 !== node.init.length ? node.init[0].type : "Unknown";
      this.symbolTable.addEntry(name, index, type);
    }
  }

  addFunctionDeclaration(name, parameters, index) {
    const nameWithArgs = name + " (" + parameters.reduce((acc, curr, index) => {
      if (0 !== index) {
        return  acc + ", " + curr.name;
      }
      return curr.name;
    }, "") + ")";
    const type = types.FUNCTION_DECLARATION;
    this.symbolTable.addEntry(nameWithArgs, index, type);

    // function arguments should be in function scope
    parameters.forEach(parameter => {
      const name = parameter.name;
      const index = this.parseStartIndex(parameter);
      const type = "Unknown";
      this.symbolTable.getLastChild().addEntry(name, index, type);
    });
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
