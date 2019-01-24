'use babel';

import LuaParser from './lua-parser';
import LuaSymbolTableGenerator from './lua-symbol-table-generator';
import LuaTableFieldTreeGenerator from './lua-table-field-tree-generator';
import LuaSuggester from './lua-suggester';
import {Manager} from '../type';
import logger from '../logger';

export default class LuaManager extends Manager {

  constructor() {
    super();
    this.symbolTable = null;
    this.tableFieldTree = null;

    this.luaParser = new LuaParser();
    this.luaSymbolTableGenerator = new LuaSymbolTableGenerator();
    this.luaTableFieldTreeGenerator = new LuaTableFieldTreeGenerator();

    this.luaParser.addVisitor(this.luaSymbolTableGenerator);
    this.luaParser.addVisitor(this.luaTableFieldTreeGenerator);
  }

  updateAST(source) {
    logger.debug("update ast");
    logger.debug(source);
    this.luaParser.parse(source);

    this.symbolTable = this.luaSymbolTableGenerator.getGenerated();
    this.tableFieldTree = this.luaTableFieldTreeGenerator.getGenerated();
    logger.info("Generated symbol table");
    logger.info(this.symbolTable);
    logger.info("Generated table field tree");
    logger.info(this.tableFieldTree);
  }

  getSuggestions(prefix, index) {
    const suggestions = new LuaSuggester(this.symbolTable, this.tableFieldTree).getSuggestions(prefix, index);
    logger.info("Raw suggestions for prefix: " + prefix + ", index: " + index);
    logger.info(suggestions);
    return suggestions;
  }

}