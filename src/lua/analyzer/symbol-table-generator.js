'use babel';

import logger from 'loglevel';

import {LuaSymbolTable, luaTypes} from '../model';

import Visitor from './visitor';
import * as luaparseType from './luaparse-types';

export default class LuaSymbolTableGenerator extends Visitor {

  constructor(fileName) {
    super();
    this.fileName = fileName;
    this.symbolTable = null;
  }

  getGenerated() {
    // if parsing error, symbol table isn't referencing root table
    while (!this.symbolTable.isRoot()) {
      this.symbolTable = this.symbolTable.getParent();
    }
    logger.debug("Generated symbol table", this.symbolTable);
    return this.symbolTable;
  }

  onCreateNode(node) {
    const nodeType = node.type;
    if (luaparseType.LUAPARSE_ASSIGNMENT_STATEMENT === nodeType ||
        luaparseType.LUAPARSE_LOCAL_STATEMENT === nodeType) {
          this._parseVariableAssignment(node);
    }
  }

  _parseVariableAssignment(node) {
    // only parse assignment to identifier
    if (luaparseType.LUAPARSE_IDENTIFIER !== node.variables[0].type) {
      return;
    }

    const identifierName = node.variables[0].name;
    const index = this._parseStartIndex(node);
    const initType = node.init.length === 0 ? luaTypes.LUA_TYPE_UNKNOWN
                                        : luaparseType.resolveType(node.init[0].type);
    const kind = luaTypes.LUA_KIND_VARIABLE;
    if (luaTypes.LUA_TYPE_FUNCTION === initType) {
      const parameters = node.init[0].parameters;
      this._addFunctionDeclaration(this.symbolTable, identifierName, parameters, index);
    } else {
      this.symbolTable.addEntry(identifierName, index, initType, kind, identifierName);
    }
  }
  _parseStartIndex(rangeHolder) {
    return rangeHolder.range[0];
  }

  onCreateScope(scope) {
    if (null == this.symbolTable) {
      this.symbolTable = new LuaSymbolTable(this.fileName);
    } else {
      const child = new LuaSymbolTable(this.fileName);
      child.setParent(this.symbolTable);
      this.symbolTable.addChild(child);
      this.symbolTable = child;
    }
    this.symbolTable.setStart(scope.index);
  }

  onDestroyScope(scope) {
    const scopeEndIndex = this.symbolTable.isRoot() ? Infinity : scope.index;
    this.symbolTable.setEnd(scopeEndIndex);
    this.symbolTable = this._getParentOrItself(this.symbolTable);
  }

  onFunctionSignature(signature) {
    this._parseFunctionSignature(signature);
  }

  _parseFunctionSignature(signature) {
    const parameters = signature.parameters;
    const index = this._parseStartIndex(signature)
    // only parse named function
    if (null != signature.identifier && luaparseType.LUAPARSE_IDENTIFIER === signature.identifier.type) {
      const name = signature.identifier.name;
      // add function symbol to the parent scope
      this._addFunctionDeclaration(this._getParentOrItself(this.symbolTable), name, parameters, index);
    }
    this._addFunctionParameters(this.symbolTable, parameters);
  }

  _addFunctionDeclaration(symbolTable, name, parameters, index) {
    const asPlaceholder = (index, name) => "${" + (index + 1) + ":" + name + "}";
    const nameWithArgs = name + "(" + parameters.reduce((acc, curr, index) => {
      if (0 !== index) {
        return  acc + ", " + asPlaceholder(index, curr.name);
      }
      return asPlaceholder(index, curr.name);
    }, "") + ")";
    const type = luaTypes.LUA_TYPE_FUNCTION;
    const kind = luaTypes.LUA_KIND_FUNCTION;
    symbolTable.addEntry(name, index, type, kind, nameWithArgs);
  }

  _addFunctionParameters(symbolTable, parameters) {
    parameters.forEach(parameter => {
      const name = parameter.name;
      const index = this._parseStartIndex(parameter);
      const type = luaTypes.LUA_TYPE_UNKNOWN;
      const kind = luaTypes.LUA_KIND_VARIABLE;
      symbolTable.addEntry(name, index, type, kind, name);
    });
  }

  _getParentOrItself(symbolTable) {
    return symbolTable.isRoot() ? symbolTable : symbolTable.getParent();
  }

}