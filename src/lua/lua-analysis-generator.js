'use babel'

import {AnalysisInfo} from './lua-types';
import LuaParser from './lua-parser';
import LuaSymbolTableGenerator from './lua-symbol-table-generator';
import LuaTableFieldTreeGenerator from './lua-table-field-tree-generator';
import logger from '../logger';

export default class LuaAnalysisGenerator {

  generate(source, fileName) {
    const luaParser = new LuaParser();
    const symbolTableGenerator = new LuaSymbolTableGenerator(fileName);
    const tableFieldTreeGenerator = new LuaTableFieldTreeGenerator();
    const parseResult = luaParser.parse(source, symbolTableGenerator, tableFieldTreeGenerator);
    logger.debug("Parse result for " + fileName);
    logger.debug(parseResult);

    const file = fileName;
    const symbolTables = symbolTableGenerator.getGenerated();
    const tableFieldTrees = tableFieldTreeGenerator.getGenerated();
    const err = parseResult.err.length > 0 ? parseResult.err[0] : null;
    return new AnalysisInfo(file, symbolTables, tableFieldTrees, err);
  }

}