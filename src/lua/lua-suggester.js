'use babel'

export default class LuaSuggester {

  constructor(scopeComposite) {
    this.scopeComposite = scopeComposite;
  }

  getSuggestions(prefix, index) {
    const suggestions = [];
    this.findSuggestions(this.scopeComposite, prefix, index, suggestions);
    return suggestions;
  }

  findSuggestions(scopeComposite, prefix, index, suggestions) {
    console.log(scopeComposite, index);
    if (scopeComposite.isInScope(index)) {
      scopeComposite.definitions.forEach((definition) => {
        if (definition.index < index && definition.name.indexOf(prefix) === 0) {
          suggestions.push(this.makeNewSuggestion(definition));
        }
      });
      scopeComposite.children.forEach(child => this.findSuggestions(child, prefix, index, suggestions));
    }
  }

  makeNewSuggestion(definition, prefix) {
    return {text: definition.name, replacementPrefix: prefix};
  }

}