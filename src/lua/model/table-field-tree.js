'use babel';

import logger from 'loglevel';
import * as luaTypes from './types';

export class LuaTableFieldValue {

  constructor(type, kind, snippet) {
    this.type = type;
    this.kind = kind;
    this.snippet = snippet;
  }

}

export class LuaTableFieldTree {

  static create(entries) {
    return new LuaTableFieldTree(entries);
  }

  constructor(entries) {
    this.root = null == entries ? {} : entries;
  }

  getRoot() {
    return this.root;
  }

  addFieldValue(fieldChain, type, snippet) {
    let currField = this.root;
    fieldChain.forEach(field => {
      if (!currField.hasOwnProperty(field)) {
        currField[field] = {};
      }
      currField = currField[field];
    });

    if (typeof currField.values === "undefined") {
      currField.__possibleValues = [];
    }
    currField.__possibleValues.push(new LuaTableFieldValue(type, luaTypes.LUA_KIND_TABLE_MEMBER, snippet));
  }

}

export default LuaTableFieldTree;