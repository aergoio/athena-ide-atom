'use babel'

import logger from 'loglevel';
import {LuaSuggestion, LuaSymbolTable, LuaTableFieldTree, luaTypes} from '../model';
import {LuaAnalyzer} from '../analyzer';

const AERGO_SYMBOLS = 'aergo-symbols.json';
const AERGO_TABLE_TREE = 'aergo-table-tree.json';

export default class LuaSuggester {

  constructor() {
    this.analyzer = new LuaAnalyzer();

    const aergoSymbols = require(__dirname + '/res/' + AERGO_SYMBOLS);
    const aergoTableTree = require(__dirname + '/res/' + AERGO_TABLE_TREE);
    this.aergoSymbolTable = LuaSymbolTable.create("aergo", aergoSymbols);
    this.aergoTableFieldTree = LuaTableFieldTree.create(aergoTableTree);
  }

  suggest(source, filePath, prefix, index) {
    logger.debug("Resolve suggestion with", filePath, prefix, index);
    logger.debug(source);
    return this.analyzer.analyze(source, filePath).then((analysisInfos) =>
      this._getSuggestions(analysisInfos, filePath, prefix, index)
    );
  }

  _getSuggestions(analyzeInfos, filePath, prefix, index) {
    logger.debug("Suggestions with", analyzeInfos);
    const prefixChain = prefix.split(".");
    logger.debug("Prefix chain", prefixChain);
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
    logger.debug("Visit table with index", index);
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
            suggestions.push(new LuaSuggestion(name, entry.type, entry.kind, entry.snippet));
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
          suggestions.push(new LuaSuggestion(name, entry.type, entry.kind, entry.snippet));
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
      let currEntry = tableFieldTree.getRoot();
      while (index < prefixChain.length - 1 && null != currEntry) {
        const prefix = prefixChain[index];
        if (!currEntry.hasOwnProperty(prefix)) {
          currEntry = null;
          break;
        }
        currEntry = currEntry[prefix]
        ++index;
      }

      if (null != currEntry) {
        const lastPrefix = prefixChain[index];
        Object.keys(currEntry)
          .filter(key => key !== "__possibleValues")
          .forEach(key => {
            if (key.indexOf(lastPrefix) === 0) {
              const entryValues = currEntry[key].__possibleValues;
              if (typeof entryValues !== "undefined") {
                entryValues.forEach(entryValue => {
                  suggestions.push(new LuaSuggestion(key, entryValue.type, entryValue.kind, entryValue.snippet));
                });
              } else {
                const type = luaTypes.LUA_TYPE_TABLE;
                const kind = luaTypes.LUA_KIND_TABLE_MEMBER;
                suggestions.push(new LuaSuggestion(key, type, kind, key));
              }
            }
          });
      }
    });

    return suggestions;
  }

}