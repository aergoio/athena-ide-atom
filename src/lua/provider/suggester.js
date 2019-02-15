'use babel'

import logger from '../../logger';
import {LuaSuggestion, LuaSymbolTable, LuaTableFieldTree, luaTypes} from '../model';
import {LuaAnalyzer} from '../analyzer';

const AERGO_SUGGESTION = 'aergo_suggestion.json';

export default class LuaSuggester {

  constructor() {
    this.analyzer = new LuaAnalyzer();

    const aergoSuggestion = require(__dirname + '/res/' + AERGO_SUGGESTION);
    this.aergoSymbolTable = LuaSymbolTable.create("aergo", aergoSuggestion.symbol);
    this.aergoTableFieldTree = LuaTableFieldTree.create(aergoSuggestion.table);
  }

  suggest(source, filePath, prefix, index) {
    return this.analyzer.analyze(source, filePath).then((analysisInfos) =>
      this._getSuggestions(analysisInfos, filePath, prefix, index)
    );
  }

  _getSuggestions(analyzeInfos, filePath, prefix, index) {
    logger.debug("suggestions with");
    logger.debug(analyzeInfos);
    const prefixChain = prefix.split(".");
    logger.debug("prefix chain: " + prefixChain);
    let suggestions = [];
    if (1 === prefixChain.length) {
      const symbolTables = analyzeInfos.map(a => a.symbolTable);
      symbolTables.unshift(this.aergoSymbolTable);
      suggestions = this._findSuggestionFromSymbolTables(symbolTables, prefixChain[0], index, filePath);
    } else {
      const tableFieldTrees = analyzeInfos.map(a => a.tableFieldTree);
      tableFieldTrees.unshift(this.aergoTableFieldTree);
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
            suggestions.push(new LuaSuggestion(name, entry.type, entry.kind));
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
          suggestions.push(new LuaSuggestion(name, entry.type, entry.kind));
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
            const entry = {type: luaTypes.LUA_TYPE_TABLE_MEMBER, kind: luaTypes.LUA_KIND_TABLE_MEMBER};
            suggestions.push(new LuaSuggestion(name, entry.type, entry.kind));
          }
        });
      }
    });
    return suggestions;
  }

}