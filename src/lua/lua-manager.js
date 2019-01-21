'use babel';

import LuaParser from './lua-parser';
import LuaScopeGenerator from './lua-scope-tree-generator';
import LuaSuggester from './lua-suggester';
import {Manager} from '../type';

export default class LuaManager extends Manager {

  constructor() {
    super();
    this.luaParser = new LuaParser();
    this.luaScopeGenerator = new LuaScopeGenerator();
    this.scopeComposite = null;

    this.luaParser.addVisitor(this.luaScopeGenerator);
  }

  updateAST(source) {
    this.luaParser.parse(source);
    this.scopeComposite = this.luaScopeGenerator.getGenerated();
  }

  getSuggestions(prefix, index) {
    const suggestions = new LuaSuggester(this.scopeComposite).getSuggestions(prefix, index);
    console.log("suggestions for prefix: " + prefix + ", index: " + index);
    console.log(suggestions);
    return suggestions;
  }

}