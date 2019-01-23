'use babel';

import LuaParser from './lua-parser';
import LuaSymbolTableGenerator from './lua-symbol-table-generator';
import LuaSuggester from './lua-suggester';
import {Manager} from '../type';
import logger from '../logger';

export default class LuaManager extends Manager {

  constructor() {
    super();
    this.luaParser = new LuaParser();
    this.luaSymbolTableGenerator = new LuaSymbolTableGenerator();
    this.symbolTable = null;

    this.luaParser.addVisitor(this.luaSymbolTableGenerator);
  }

  updateAST(source) {
    logger.debug("Update ast");
    logger.debug(source);
    this.luaParser.parse(source);
    this.symbolTable = this.luaSymbolTableGenerator.getGenerated();
    logger.info("Generated symbol table");
    logger.info(this.symbolTable);
  }

  getSuggestions(prefix, index) {
    const suggestions = new LuaSuggester(this.symbolTable).getSuggestions(prefix, index);
    logger.info("Raw suggestions for prefix: " + prefix + ", index: " + index);
    logger.info(suggestions);
    return suggestions;
  }

}