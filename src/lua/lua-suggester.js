'use babel'

import * as types from './lua-types';
import logger from '../logger';

export default class LuaSuggester {

  constructor(analyzeInfos) {
    this.analyzeInfos = analyzeInfos;
  }

  getSuggestions(prefix, index, fileName) {
    const prefixChain = prefix.split(".");
    logger.debug("prefix chain: " + prefixChain);
    let suggestions = [];
    if (1 === prefixChain.length) {
      const symbolTables = this.analyzeInfos.map(a => a.symbolTable);
      suggestions = this._findSuggestionFromSymbolTables(symbolTables, prefixChain[0], index, fileName);
    } else {
      const tableFieldTrees = this.analyzeInfos.map(a => a.tableFieldTree);
      suggestions = this._findSuggestionFromTableFields(tableFieldTrees, prefixChain);
    }
    return suggestions;
  }

  _findSuggestionFromSymbolTables(symbolTables, prefix, index, fileName) {
    logger.debug("visit table with index: " + index);
    logger.debug(symbolTables);
    let suggestions = [];
    symbolTables.forEach(symbolTable => {
      if (symbolTable.fileName === fileName) {
        const subSuggestions = this._findSuggestionRecursively(symbolTable, prefix, index);
        suggestions = suggestions.concat(subSuggestions);
      } else {
        Object.keys(symbolTable.entries).forEach((name) => {
          const entry = symbolTable.entries[name];
          if (name.indexOf(prefix) === 0) {
            suggestions.push(new types.Suggestion(name, entry.type, entry.kind));
          }
        });
      }
    });
    return suggestions;
  }

  _findSuggestionRecursively(symbolTable, prefix, index) {
    let suggestions = [];
    if (symbolTable.isInScope(index)) {
      Object.keys(symbolTable.entries).forEach((name) => {
        const entry = symbolTable.entries[name];
        if (entry.index < index && name.indexOf(prefix) === 0) {
          suggestions.push(new types.Suggestion(name, entry.type, entry.kind));
        }
      });
      symbolTable.children.forEach(child => {
        suggestions = suggestions.concat(this._findSuggestionRecursively(child, prefix, index));
      });
    }
    return suggestions;
  }

  _findSuggestionFromTableFields(tableFieldTrees, prefixChain) {
    if (prefixChain.length <= 1) {
      logger.error("prefixchain length must be longer than 1");
      return [];
    }

    let suggestions = [];
    tableFieldTrees.forEach(tableFieldTree => {
      let index = 0;
      let currEntry = tableFieldTree.getEntries();
      while (index < prefixChain.length - 1 && null != currEntry) {
        const prefix = prefixChain[index];
        const filteredKeys = Object.keys(currEntry).filter(item => item === prefix);
        currEntry = (1 === filteredKeys.length) ? currEntry[filteredKeys[0]] : null;
        ++index;
      }

      if (null != currEntry) {
        const lastPrefix = prefixChain[prefixChain.length - 1];
        Object.keys(currEntry).forEach((name) => {
          if (name.indexOf(lastPrefix) === 0) {
            const entry = {type: types.ATHENA_LUA_TABLE_MEMBER, kind: types.ATHENA_LUA_TABLE_MEMBER};
            suggestions.push(new types.Suggestion(name, entry.type, entry.kind));
          }
        });
      }
    });
    return suggestions;
  }

}