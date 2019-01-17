'use babel';

import LuaScopeComposite from './lua-scope-composite';
import {Visitor} from '../type';

const FUNCTION_DECLARATION = 'FunctionDeclaration';
const IDENTIFIER = 'Identifier';

export default class LuaScopeTreeGenerator extends Visitor {

  scopeComposite = null;

  reset() {
    this.scopeComposite = null;
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
        if (definition.name.indexOf(prefix) === 0) {
          suggestions.push(this.makeNewSuggestion(definition));
        }
      });
      scopeComposite.children.forEach(child => this.findSuggestions(child, prefix, index, suggestions));
    }
  }

  makeNewSuggestion(definition, prefix) {
    return {text: definition.name, replacementPrefix: prefix};
  }

  onCreateNode(node) {
    console.log("LuaScopeTreeGenerator : onCreateNode", node);
    switch(node.type) {
      case FUNCTION_DECLARATION:
        this.scopeComposite.addDefinition(FUNCTION_DECLARATION, node.identifier.name);
        break;
      default:
        // do nothing
        break;
    }
  }

  onCreateScope(scope) {
    console.log("LuaScopeTreeGenerator : onCreateScope", scope);
    if (null === this.scopeComposite) {
      this.scopeComposite = new LuaScopeComposite(null);
    } else {
      const child = new LuaScopeComposite(this.scopeComposite);
      this.scopeComposite.addChild(child);
      this.scopeComposite = child;
    }
    this.scopeComposite.setStart(scope.index);
  }

  onDestroyScope(scope) {
    console.log("LuaScopeTreeGenerator : onDestroyScope", scope);
    this.scopeComposite.setEnd(scope.index);
    this.scopeComposite = this.scopeComposite.getParent();
  }

  onLocalDeclaration(identifierName) {
    console.log("LuaScopeTreeGenerator : onLocalDeclaration", identifierName);
    this.scopeComposite.addDefinition(IDENTIFIER, identifierName);
  }

};
