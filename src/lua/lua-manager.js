'use babel';

import LuaParser from './lua-parser';
import LuaSymbolTableGenerator from './lua-symbol-table-generator';
import LuaSuggester from './lua-suggester';
import {Manager} from '../type';

export default class LuaManager extends Manager {

  constructor() {
    super();
    this.luaParser = new LuaParser();
    this.luaSymbolTableGenerator = new LuaSymbolTableGenerator();
    this.symbolTable = null;

    this.luaParser.addVisitor(this.luaSymbolTableGenerator);
  }

  updateAST(source) {
    this.luaParser.parse(source);
    this.symbolTable = this.luaSymbolTableGenerator.getGenerated();
  }

  getSuggestions(prefix, index) {
    const suggestions = new LuaSuggester(this.symbolTable).getSuggestions(prefix, index);
    console.log("Raw suggestions for prefix: " + prefix + ", index: " + index);
    console.log(suggestions);
    return suggestions;
  }

}