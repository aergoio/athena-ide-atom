'use babel'

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
    console.log(symbolTable, index);
    if (symbolTable.isInScope(index)) {
      symbolTable.entries.forEach((entry) => {
        if (entry.index < index && entry.name.indexOf(prefix) === 0) {
          suggestions.push(this.makeNewSuggestion(entry));
        }
      });
      symbolTable.children.forEach(child => this.findSuggestions(child, prefix, index, suggestions));
    }
  }

  makeNewSuggestion(entry, prefix) {
    return {text: entry.name, replacementPrefix: prefix};
  }

}