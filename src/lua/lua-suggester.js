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
      Object.keys(symbolTable.entries).forEach((name) => {
        const entry = symbolTable.entries[name];
        if (entry.index < index && name.indexOf(prefix) === 0) {
          suggestions.push(this.makeNewSuggestion(name, entry, prefix));
        }
      });
      symbolTable.children.forEach(child => this.findSuggestions(child, prefix, index, suggestions));
    }
  }

  makeNewSuggestion(name, entry, prefix) {
    return {text: name, replacementPrefix: prefix};
  }

}