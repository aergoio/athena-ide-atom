'use babel'

import {LuaAnalysisInfo} from '../model';
import logger from '../../logger';

import LuaParser from './parser';
import LuaSymbolTableGenerator from './symbol-table-generator';
import LuaTableFieldTreeGenerator from './table-field-tree-generator';

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
    const err = parseResult.err;
    return new LuaAnalysisInfo(file, symbolTables, tableFieldTrees, err);
  }

}