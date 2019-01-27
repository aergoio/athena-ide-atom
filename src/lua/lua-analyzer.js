'use babel';

import LuaParser from './lua-parser';
import LuaSymbolTableGenerator from './lua-symbol-table-generator';
import LuaTableFieldTreeGenerator from './lua-table-field-tree-generator';
import LuaSuggester from './lua-suggester';
import {Analyzer} from '../type';
import logger from '../logger';

export default class LuaAnalyzer extends Analyzer {

  constructor() {
    super();
    this.symbolTable = null;
    this.tableFieldTree = null;
    this.luaParser = new LuaParser();
  }

  updateTableInfo(source, fileName) {
    logger.debug("Update ast");
    logger.debug(source);

    const symbolTableGenerator = new LuaSymbolTableGenerator(fileName);
    const tableFieldTreeGenerator = new LuaTableFieldTreeGenerator();
    const parseResult = this.luaParser.parse(source, symbolTableGenerator, tableFieldTreeGenerator);
    logger.info("Parse result");
    logger.info(parseResult);

    this.symbolTable = symbolTableGenerator.getGenerated();
    this.tableFieldTree = tableFieldTreeGenerator.getGenerated();
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