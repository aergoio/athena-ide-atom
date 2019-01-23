'use babel'

import logger from '../logger';

export default class LuaSuggester {

  constructor(symbolTable) {
    this.symbolTable = symbolTable;
  }

  getSuggestions(prefix, index) {
    const suggestions = [];
    this.findSuggestions(this.symbolTable, prefix, index, suggestions);
    return suggestions;
  }

  findSuggestions(symbolTable, prefix, index, suggestions) {
    logger.debug("visit table with index: " + index);
    logger.debug(symbolTable);
    if (symbolTable.isInScope(index)) {
      Object.keys(symbolTable.entries).forEach((name) => {
        const entry = symbolTable.entries[name];
        if (entry.index < index && name.indexOf(prefix) === 0) {
          suggestions.push(this.makeNewSuggestion(name, entry));
        }
      });
      symbolTable.children.forEach(child => this.findSuggestions(child, prefix, index, suggestions));
    }
  }

  makeNewSuggestion(name, entry) {
    return {name: name, type: entry.type, kind: entry.kind};
  }

}