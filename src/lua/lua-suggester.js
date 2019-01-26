'use babel'

import * as types from './lua-types';
import logger from '../logger';

export default class LuaSuggester {

  constructor(symbolTable, tableFieldTree) {
    this.symbolTable = symbolTable;
    this.tableFieldTree = tableFieldTree;
  }

  getSuggestions(prefix, index) {
    const prefixChain = prefix.split(".");
    logger.debug("prefix chain: " + prefixChain);
    let suggestions = [];
    if (1 === prefixChain.length) {
      suggestions = this._findSuggestionFromSymbolTable(this.symbolTable, prefixChain[0], index);
    } else {
      suggestions = this._findSuggestionFromTableField(this.tableFieldTree, prefixChain);
    }
    return suggestions;
  }

  _findSuggestionFromSymbolTable(symbolTable, prefix, index) {
    logger.debug("visit table with index: " + index);
    logger.debug(symbolTable);

    let suggestions = [];
    if (symbolTable.isInScope(index)) {
      Object.keys(symbolTable.entries).forEach((name) => {
        const entry = symbolTable.entries[name];
        if (entry.index < index && name.indexOf(prefix) === 0) {
          suggestions.push(this._makeNewSuggestion(name, entry));
        }
      });
      symbolTable.children.forEach(child => {
        suggestions = suggestions.concat(this._findSuggestionFromSymbolTable(child, prefix, index));
      });
    }
    return suggestions;
  }

  _findSuggestionFromTableField(tableFieldTree, prefixChain) {
    if (prefixChain.length <= 1) {
      logger.warn("prefixchain length must be longer than 1");
    }

    let index = 0;
    let currEntry = tableFieldTree.getEntries();
    while (index < prefixChain.length - 1 && null != currEntry) {
      const prefix = prefixChain[index];
      const filteredKeys = Object.keys(currEntry).filter(item => item === prefix);
      currEntry = (1 === filteredKeys.length) ? currEntry[filteredKeys[0]] : null;
      ++index;
    }

    const lastPrefix = prefixChain[prefixChain.length - 1];
    let suggestions = [];
    if (null != currEntry) {
      Object.keys(currEntry).forEach((name) => {
        if (name.indexOf(lastPrefix) === 0) {
          const entry = {type: types.ATHENA_LUA_TABLE_MEMBER, kind: types.ATHENA_LUA_TABLE_MEMBER};
          suggestions.push(this._makeNewSuggestion(name, entry));
        }
      });
    }
    return suggestions;
  }

  _makeNewSuggestion(name, entry) {
    return {name: name, type: entry.type, kind: entry.kind};
  }

}