'use babel';

import LuaScope from './lua-scope';
import {Visitor} from '../type';

export default class LuaScopeTreeGenerator extends Visitor {

  scope = null;

  initScope(start, end) {
    this.scope = new LuaScope(start, end);
  }

  getScopeTree() {
    return this.scope;
  }

  getSuggestions(prefix, index) {
    const suggestions = [{text: 'complete', replacementPrefix: 'com'}];
    return suggestions;
  }

  onCreateNode(node) {
    console.log("LuaRecommander : onCreateNode")
  }

  onCreateScope() {
    console.log("LuaRecommander : onCreateScope")
  }

  onDestroyScope() {
    console.log("LuaRecommander : onDestroyScope")
  }

  onLocalDeclaration(scopeName) {
    console.log("LuaRecommander : onLocalDeclaration")
  }

};
