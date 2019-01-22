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
    switch(node.type) {
      case types.LUAPARSE_FUNCTION_DECLARATION:
        this.parseFunctionDeclaration(node);
        break;
      case types.LUAPARSE_ASSIGNMENT_STATEMENT:
      case types.LUAPARSE_LOCAL_STATEMENT:
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
    // only parse assignment to identifier
    if (types.LUAPARSE_IDENTIFIER !== node.identifier.type) {
      return;
    }
    this.addFunctionDeclaration(node.identifier.name, node.parameters, this.parseStartIndex(node));
  }

  parseVariableAssignment(node) {
    // only parse assignment to identifier
    if (types.LUAPARSE_IDENTIFIER !== node.variables[0].type) {
      return;
    }
    const name = node.variables[0].name;
    const index = this.parseStartIndex(node);
    const type = node.init.length === 0 ? types.ATHENA_LUA_UNKNOWN
                                        : types.resolveType(node.init[0].type);
    const kind = types.ATHENA_LUA_VARIABLE;
    if (types.ATHENA_LUA_FUNCTION === type) {
      this.addFunctionDeclaration(name, node.init[0].parameters, index);
    } else {
      this.symbolTable.addEntry(name, index, type, kind);
    }
  }

  addFunctionDeclaration(name, parameters, index) {
    const nameWithArgs = name + " (" + parameters.reduce((acc, curr, index) => {
      if (0 !== index) {
        return  acc + ", " + curr.name;
      }
      return curr.name;
    }, "") + ")";
    const type = types.ATHENA_LUA_FUNCTION;
    const kind = types.ATHENA_LUA_FUNCTION;
    this.symbolTable.addEntry(nameWithArgs, index, type, kind);

    // function arguments should be in function scope
    parameters.forEach(parameter => {
      const name = parameter.name;
      const index = this.parseStartIndex(parameter);
      const type = types.ATHENA_LUA_UNKNOWN;
      const kind = types.ATHENA_LUA_VARIABLE;
      this.symbolTable.getLastChild().addEntry(name, index, type, kind);
    });
  }

  parseStartIndex(rangeHolder) {
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

};
