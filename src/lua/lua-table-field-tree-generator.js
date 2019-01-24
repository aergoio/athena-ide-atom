'use babel';

import LuaTableFieldTree from './lua-table-field-tree';
import {Visitor} from '../type';
import * as types from './lua-types';
import logger from '../logger';

export default class LuaTableFieldTreeGenerator extends Visitor {

  constructor() {
    super();
    this.tableFieldTree = LuaTableFieldTree.newLuaTableFieldTree();
  }

  getGenerated() {
    return this.tableFieldTree;
  }

  reset() {
    this.tableFieldTree = LuaTableFieldTree.newLuaTableFieldTree();
  }

  onCreateNode(node) {
    switch (node.type) {
      // assignment for global, local statement for local variable
      case types.LUAPARSE_ASSIGNMENT_STATEMENT:
      case types.LUAPARSE_LOCAL_STATEMENT:
        this._parseVariableAssignment(node);
        break;
      case types.LUAPARSE_TABLE_MEMBER_EXPRESSION:
        this._parseTableMemberExpression(node);
        break;
      case types.LUAPARSE_TABLE_INDEX_EXPRESSION:
        this._parseTableIndexExpression(node);
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

    const identifierName = node.variables[0].name;
    const initType = node.init.length === 0 ? types.ATHENA_LUA_UNKNOWN : node.init[0].type;
    if (types.LUAPARSE_TABLE_CONSTRUCTOR_EXPRESSION === initType) {
      const tableName = identifierName;
      const tableFields = node.init[0].fields;
      this._addTableFields(tableName, tableFields);
    } else if (types.LUAPARSE_TABLE_CALL_EXPRESSION === initType) {
      // TODO
    } 
  }

  _parseTableMemberExpression(node) {
    const tableName = node.base.name;
    const fieldName = node.identifier.name;
    this.tableFieldTree.addEntry(tableName, fieldName);
  }

  _parseTableIndexExpression(node) {
    if (types.LUAPARSE_STRING_LITERAL === node.index.type) {
      const tableName = node.base.name;
      const fieldName = node.index.value;
      this.tableFieldTree.addEntry(tableName, fieldName);
    }
  }

  _addTableFields(tableName, tableFields) {
    tableFields.forEach(field => {
      const fieldType = field.type;
      if (types.LUAPARSE_TABLE_KEY_STRING === fieldType) {
        this.tableFieldTree.addEntry(tableName, field.key.name);
      } else if (types.LUAPARSE_TABLE_KEY === fieldType) {
        // ignore NumericLiteralCase. That's array indexing
        if (types.LUAPARSE_STRING_LITERAL === field.key.type) {
          this.tableFieldTree.addEntry(tableName, field.key.value);
        }
      } else if (types.LUAPARSE_TABLE_VALUE === fieldType) {
        this.tableFieldTree.addEntry(tableName, field.value.name);
      } else {
        logger.warn("Unexpected table field type: " + fieldType);
      }
    });
  }

};