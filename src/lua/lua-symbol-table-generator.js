'use babel';

import LuaSymbolTable from './lua-symbol-table';
import {Visitor} from '../type';
import * as types from './lua-types';

export default class LuaSymbolTableGenerator extends Visitor {

  constructor() {
    super();
    this.symbolTable = null;
  }

  getGenerated() {
    // if parsing error, symbol table isn't referencing root table
    while (!this.symbolTable.isRoot()) {
      this.symbolTable = this.symbolTable.getParent();
    }
    return this.symbolTable;
  }

  reset() {
    this.symbolTable = null;
  }

  onCreateNode(node) {
    switch(node.type) {
      case types.LUAPARSE_ASSIGNMENT_STATEMENT:
      case types.LUAPARSE_LOCAL_STATEMENT:
        this._parseVariableAssignment(node);
        break;
      default:
        // do nothing
        break;
    }
  }

  _parseVariableAssignment(node) {
    // only parse assignment to identifier
    if (types.LUAPARSE_IDENTIFIER !== node.variables[0].type) {
      return;
    }
    const name = node.variables[0].name;
    const index = this._parseStartIndex(node);
    const type = node.init.length === 0 ? types.ATHENA_LUA_UNKNOWN
                                        : types.resolveType(node.init[0].type);
    const kind = types.ATHENA_LUA_VARIABLE;
    if (types.ATHENA_LUA_FUNCTION === type) {
      this._addFunctionDeclaration(this.symbolTable, name, node.init[0].parameters, index);
    } else {
      this.symbolTable.addEntry(name, index, type, kind);
    }
  }

  _addFunctionDeclaration(symbolTable, name, parameters, index) {
    const nameWithArgs = name + " (" + parameters.reduce((acc, curr, index) => {
      if (0 !== index) {
        return  acc + ", " + curr.name;
      }
      return curr.name;
    }, "") + ")";
    const type = types.ATHENA_LUA_FUNCTION;
    const kind = types.ATHENA_LUA_FUNCTION;
    symbolTable.getParent().addEntry(nameWithArgs, index, type, kind);
  }

  _parseStartIndex(rangeHolder) {
    return rangeHolder.range[0];
  }

  onCreateScope(scope) {
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
    const scopeEndIndex = this.symbolTable.isRoot() ? Infinity : scope.index;
    this.symbolTable.setEnd(scopeEndIndex);
    this.symbolTable = this.symbolTable.getParent();
  }

  onLocalDeclaration(identifierName) {
    // do nothing
  }

  onFunctionSignature(signature) {
    this._parseFunctionSignature(signature);
  }

  _parseFunctionSignature(signature) {
    const parameters = signature.parameters;
    const index = this._parseStartIndex(signature)
    // in case of named function
    if (null != signature.identifier) {
      const name = signature.identifier.name;
      this._addFunctionDeclaration(this.symbolTable.getParent(), name, parameters, index);
    }
    this._addFunctionParameters(this.symbolTable, parameters);
  }

  _addFunctionParameters(symbolTable, parameters) {
    parameters.forEach(parameter => {
      const name = parameter.name;
      const index = this._parseStartIndex(parameter);
      const type = types.ATHENA_LUA_UNKNOWN;
      const kind = types.ATHENA_LUA_VARIABLE;
      symbolTable.addEntry(name, index, type, kind);
    });
  }

};