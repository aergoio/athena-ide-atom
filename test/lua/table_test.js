import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs from 'fs';
chai.use(chaiAsPromised);
const assert = chai.assert;

import LuaAnalyzer from '../../src/lua';
import * as types from '../../src/lua/lua-types';

describe("Autocomplete for table", () => {

  const filePath = __dirname + "/resources/table.lua";
  const source = fs.readFileSync(filePath, "utf8");

  describe("Suggestion for simple field", () => {

    const index = 250;

    it("FieldTable.", () => {
      const luaAnalyzer = new LuaAnalyzer();
      luaAnalyzer.analyze(source, filePath);

      const suggestions = luaAnalyzer.getSuggestions("FieldTable.", index, filePath);
      assert.equal(suggestions.length, 5);
      assert.equal(suggestions.filter(s => types.ATHENA_LUA_TABLE_MEMBER === s.kind).length, 5);
    });

    it("FieldTable.f", () => {
      const luaAnalyzer = new LuaAnalyzer();
      luaAnalyzer.analyze(source, filePath);

      const suggestions = luaAnalyzer.getSuggestions("FieldTable.f", index, filePath);
      assert.equal(suggestions.length, 4);
      assert.equal(suggestions.filter(s => types.ATHENA_LUA_TABLE_MEMBER === s.kind).length, 4);
    });

    it("FieldTable2.f", () => {
      const luaAnalyzer = new LuaAnalyzer();
      luaAnalyzer.analyze(source, filePath);

      const suggestions = luaAnalyzer.getSuggestions("FieldTable2.f", index, filePath);
      assert.equal(suggestions.length, 2);
      assert.equal(suggestions.filter(s => types.ATHENA_LUA_TABLE_MEMBER === s.kind).length, 2);
    });

  });

  describe("Suggestion for function field", () => {

    const index = 733;

    it("FuncTable.", () => {
      const luaAnalyzer = new LuaAnalyzer();
      luaAnalyzer.analyze(source, filePath);

      const suggestions = luaAnalyzer.getSuggestions("FuncTable.", index, filePath);
      assert.equal(suggestions.length, 5);
      assert.equal(suggestions.filter(s => types.ATHENA_LUA_TABLE_MEMBER === s.kind).length, 5);
    });

    it("FuncTable.s", () => {
      const luaAnalyzer = new LuaAnalyzer();
      luaAnalyzer.analyze(source, filePath);

      const suggestions = luaAnalyzer.getSuggestions("FuncTable.s", index, filePath);
      assert.equal(suggestions.length, 1);
      assert.equal(suggestions.filter(s => types.ATHENA_LUA_TABLE_MEMBER === s.kind).length, 1);
    });

    it("FuncTable.m", () => {
      const luaAnalyzer = new LuaAnalyzer();
      luaAnalyzer.analyze(source, filePath);

      const suggestions = luaAnalyzer.getSuggestions("FuncTable.m", index, filePath);
      assert.equal(suggestions.length, 3);
      assert.equal(suggestions.filter(s => types.ATHENA_LUA_TABLE_MEMBER === s.kind).length, 3);
    });

    it("FuncTable.d", () => {
      const luaAnalyzer = new LuaAnalyzer();
      luaAnalyzer.analyze(source, filePath);

      const suggestions = luaAnalyzer.getSuggestions("FuncTable.d", index, filePath);
      assert.equal(suggestions.length, 1);
      assert.equal(suggestions.filter(s => types.ATHENA_LUA_TABLE_MEMBER === s.kind).length, 1);
    });

  });

  describe("Suggestion for nested field", () => {

    const index = 1093;

    it("NestedTable.", () => {
      const luaAnalyzer = new LuaAnalyzer();
      luaAnalyzer.analyze(source, filePath);

      const suggestions = luaAnalyzer.getSuggestions("NestedTable.", index, filePath);
      assert.equal(suggestions.length, 2);
      assert.equal(suggestions.filter(s => types.ATHENA_LUA_TABLE_MEMBER === s.kind).length, 2);
    });

    // TODO : not yet implemented

  });

  describe("Suggestion for imported table field", () => {

    const index = 1093;

    it("libraryTable.", () => {
      const luaAnalyzer = new LuaAnalyzer();
      luaAnalyzer.analyze(source, filePath);

      const suggestions = luaAnalyzer.getSuggestions("libraryTable.", index, filePath);
      assert.equal(suggestions.length, 2);
      assert.equal(suggestions.filter(s => types.ATHENA_LUA_TABLE_MEMBER === s.kind).length, 2);
    });

  });

});