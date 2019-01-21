'use babel';

import LuaScopeComposite from './lua-scope-composite';
import {Visitor} from '../type';

// luaparse node type
const FUNCTION_DECLARATION = 'FunctionDeclaration';
const LOCAL_STATEMENT = 'LocalStatement';

const IDENTIFIER = 'Identifier';

export default class LuaScopeTreeGenerator extends Visitor {

  scopeComposite = null;

  getGenerated() {
    return this.scopeComposite;
  }

  reset() {
    this.scopeComposite = null;
  }

  onCreateNode(node) {
    console.log("LuaScopeTreeGenerator : onCreateNode", node);
    switch(node.type) {
      case FUNCTION_DECLARATION:
        this.parseFunctionDeclaration(node);
        break;
      case LOCAL_STATEMENT:
        this.parseLocalStatement(node);
        break;
      default:
        // do nothing
        break;
    }
  }

  parseFunctionDeclaration(node) {
    const name = node.identifier.name + " (" + node.parameters.reduce((acc, curr, index) => {
      if (0 !== index) {
        return  acc.name + ", " + curr.name;
      }
      return curr.name;
    }) + ")";
    const index = this.parseStartIndex(node);
    const type = FUNCTION_DECLARATION;
    this.scopeComposite.addDefinition(this.makeDefinition(name, index, type));

    node.parameters.forEach(parameter => {
      const name = parameter.name;
      const index = this.parseStartIndex(parameter);
      const type = "Unknown";
      this.scopeComposite.addDefinition(this.makeDefinition(name, index, type));
    });
    return ;
  }

  parseLocalStatement(node) {
    const name = node.variables[0].name;
    const index = this.parseStartIndex(node);
    const type = 0 !== node.init.length ? node.init[0].type : "Unknown";
    this.scopeComposite.addDefinition(this.makeDefinition(name, index, type));
  }

  makeDefinition(name, index, type) {
    return {name: name, index: index, type: type};
  }

  parseStartIndex(rangeHolder) {
    return rangeHolder.range[0];
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
    const scopeEndIndex = this.scopeComposite.isRoot() ? Infinity : scope.index;
    this.scopeComposite.setEnd(scopeEndIndex);
    this.scopeComposite = this.scopeComposite.getParent();
  }

  onLocalDeclaration(identifierName) {
    console.log("LuaScopeTreeGenerator : onLocalDeclaration", identifierName);
    // do nothing
  }

};
