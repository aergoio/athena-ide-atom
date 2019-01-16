'use babel';

import LuaParser from './lua-parser';
import LuaScopeGenerator from './lua-scope-tree-generator';
import {Manager} from '../type';

export default class LuaManager extends Manager {

  constructor() {
    super();
    this.luaParser = new LuaParser();
    this.luaScopeGenerator = new LuaScopeGenerator();

    this.luaParser.addVisitor(this.luaScopeGenerator);
  }

  updateAST(source) {
    this.luaParser.parse(source);
  }

  getSuggestions(prefix, index) {
    const suggestions = this.luaScopeGenerator.getSuggestions(prefix, index);
    console.log("suggestions for prefix: " + prefix + ", index: " + index);
    console.log(suggestions);
    return suggestions;
  }

}