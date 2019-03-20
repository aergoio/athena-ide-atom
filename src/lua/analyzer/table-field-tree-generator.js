'use babel';

import logger from 'loglevel';

import {LuaTableFieldTree, luaTypes} from '../model';

import Visitor from './visitor';
import * as luaparse from './luaparse-types';

export default class LuaTableFieldTreeGenerator extends Visitor {

  constructor() {
    super();
    this.tableFieldTree = LuaTableFieldTree.create();
  }

  getGenerated() {
    logger.debug("Generated table field tree", this.tableFieldTree);
    return this.tableFieldTree;
  }

  onCreateNode(node) {
    switch (node.type) {
      // only parse assignment for global, local statement for local variable
      case luaparse.LUAPARSE_ASSIGNMENT_STATEMENT:
      case luaparse.LUAPARSE_LOCAL_STATEMENT:
        this._parseAssignmentStatement(node);
        break;
      default:
        // do nothing
        break;
    }
  }

  onFunctionSignature(signature) {
    // only parse named function with table member expression function
    if (signature.identifier === null ||
        luaparse.LUAPARSE_TABLE_MEMBER_EXPRESSION !== signature.identifier.type) {
      return;
    }
    const fieldChain = this._parseIdentifierExpression(signature.identifier);
    const funcName = fieldChain[fieldChain.length - 1];
    const funcSnippet = this._funcArgAsPlaceHolder(funcName, signature.parameters);
    this.tableFieldTree.addFieldValue(fieldChain, luaTypes.LUA_TYPE_FUNCTION, funcSnippet);
  }

  // SomeTable = { field = ... }
  _parseAssignmentStatement(node) {
    // only parse when init exists
    if (node.init.length === 0) {
      return;
    }

    const identifier = node.variables[0];
    const init = node.init[0];
    if (luaparse.LUAPARSE_IDENTIFIER === identifier.type) {
      if (luaparse.LUAPARSE_TABLE_CONSTRUCTOR_EXPRESSION === init.type) {
        const fieldChain = this._parseIdentifierExpression(identifier);
        this._parseTable(fieldChain, init);
      } else if (luaparse.LUAPARSE_TABLE_CALL_EXPRESSION === init.type) {
        // TODO : parse table call
      }
    } else if (luaparse.LUAPARSE_TABLE_MEMBER_EXPRESSION === identifier.type) {
      const fieldChain = this._parseIdentifierExpression(identifier);
      this._parseFieldValue(fieldChain, init);
    } else if (luaparse.LUAPARSE_TABLE_INDEX_EXPRESSION === identifier.type) {
      // ignore NumericLiteralCase. That's array indexing
      if (luaparse.LUAPARSE_STRING_LITERAL !== identifier.index.type) {
        return;
      }
      const fieldChain = this._parseIdentifierExpression(identifier);
      this._parseFieldValue(fieldChain, init);
    }
  }

  _parseIdentifierExpression(expression) {
    // SomeTable = ...
    if (luaparse.LUAPARSE_IDENTIFIER === expression.type) {
      return [expression.name];
    }

    // SomeTable.field1.field2 = ...
    if (luaparse.LUAPARSE_TABLE_MEMBER_EXPRESSION === expression.type) {
      const fieldChain = this._parseIdentifierExpression(expression.base);
      fieldChain.push(expression.identifier.name);
      return fieldChain;
    }

    // SomeTable["member"] = ...
    if (luaparse.LUAPARSE_TABLE_INDEX_EXPRESSION === expression.type) {
      const fieldChain = this._parseIdentifierExpression(expression.base);
      fieldChain.push(expression.index.value);
      return fieldChain;
    }
  }

  _parseTable(fieldChain, table) {
    table.fields.forEach(field => {
      if (luaparse.LUAPARSE_TABLE_KEY_STRING === field.type) {
        const fieldName = field.key.name;
        this._parseFieldValue(fieldChain.concat(fieldName), field.value);
      } else if (luaparse.LUAPARSE_TABLE_KEY === field.type) {
        // ignore NumericLiteralCase. That's array indexing
        if (luaparse.LUAPARSE_STRING_LITERAL === field.key.type) {
          const fieldName = field.key.value;
          this._parseFieldValue(fieldChain.concat(fieldName), field.value);
        }
      } else if (luaparse.LUAPARSE_TABLE_VALUE === field.type) {
        // no special value for 'TableValue'
        const fieldName = field.value.name;
        const memberType = luaTypes.LUA_TYPE_TABLE_MEMBER;
        this.tableFieldTree.addFieldValue(fieldChain.concat(fieldName), memberType, fieldName);
      } else {
        logger.warn("Unexpected table field type", field.type);
      }
    });
  }

  _parseFieldValue(fieldChain, fieldValue) {
    const valueType = fieldValue.type;
    const resolvedType = luaparse.resolveType(valueType);
    if (luaparse.LUAPARSE_LITERALS.indexOf(valueType) !== -1) {
      this.tableFieldTree.addFieldValue(fieldChain, resolvedType, fieldChain[fieldChain.length - 1]);
    } else if (luaparse.LUAPARSE_FUNCTION_DECLARATION === valueType) {
      const funcName = fieldChain[fieldChain.length - 1];
      const funcSnippet = this._funcArgAsPlaceHolder(funcName, fieldValue.parameters);
      this.tableFieldTree.addFieldValue(fieldChain, resolvedType, funcSnippet);
    } else if (luaparse.LUAPARSE_IDENTIFIER === valueType) {
      // TODO : resolve field tree by semantic analysis?
      this.tableFieldTree.addFieldValue(fieldChain, resolvedType, fieldChain[fieldChain.length - 1]);
    } else if (luaparse.LUAPARSE_TABLE_CONSTRUCTOR_EXPRESSION === valueType) {
      this._parseTable(fieldChain, fieldValue);
    }
  }

  _funcArgAsPlaceHolder(funcName, parameters) {
    const asPlaceholder = (index, name) => "${" + (index + 1) + ":" + name + "}";
    return funcName + "(" + parameters.reduce((acc, curr, index) => {
      if (0 !== index) {
        return  acc + ", " + asPlaceholder(index, curr.name);
      }
      return asPlaceholder(index, curr.name);
    }, "") + ")";
  }

}