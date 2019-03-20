import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs from 'fs';
chai.use(chaiAsPromised);
const assert = chai.assert;

import {LuaSuggester, luaTypes} from '../../src/lua';

describe("Autocomplete for table", () => {

  const filePath = __dirname + "/resources/table.lua";
  const source = fs.readFileSync(filePath, "utf8");
  const luaSuggester = new LuaSuggester();

  describe("Suggestion for simple field", () => {

    const index = 250;

    it("FieldTable.", async () => {
      const suggestions = await luaSuggester.suggest(source, filePath, "FieldTable.", index);
      assert.equal(suggestions.length, 5);
      assert.equal(suggestions.filter(s => luaTypes.LUA_KIND_TABLE_MEMBER === s.kind).length, 5);
    });

    it("FieldTable.f", async () => {
      const suggestions = await luaSuggester.suggest(source, filePath, "FieldTable.f", index);
      assert.equal(suggestions.length, 4);
      assert.equal(suggestions.filter(s => luaTypes.LUA_KIND_TABLE_MEMBER === s.kind).length, 4);
    });

    it("FieldTable2.f", async () => {
      const suggestions = await luaSuggester.suggest(source, filePath, "FieldTable2.f", index);
      assert.equal(suggestions.length, 2);
      assert.equal(suggestions.filter(s => luaTypes.LUA_KIND_TABLE_MEMBER === s.kind).length, 2);
    });

  });

  describe("Suggestion for function field", () => {

    const index = 733;

    it("FuncTable.", async () => {
      const suggestions = await luaSuggester.suggest(source, filePath, "FuncTable.", index);
      assert.equal(suggestions.length, 5);
      assert.equal(suggestions.filter(s => luaTypes.LUA_KIND_TABLE_MEMBER === s.kind).length, 5);
    });

    it("FuncTable.s", async () => {
      const suggestions = await luaSuggester.suggest(source, filePath, "FuncTable.s", index);
      assert.equal(suggestions.length, 1);
      assert.equal(suggestions.filter(s => luaTypes.LUA_KIND_TABLE_MEMBER == s.kind).length, 1);
    });

    it("FuncTable.m", async () => {
      const suggestions = await luaSuggester.suggest(source, filePath, "FuncTable.m", index);
      assert.equal(suggestions.length, 3);
      assert.equal(suggestions.filter(s => luaTypes.LUA_KIND_TABLE_MEMBER === s.kind).length, 3);
    });

    it("FuncTable.d", async () => {
      const suggestions = await luaSuggester.suggest(source, filePath, "FuncTable.d", index);
      assert.equal(suggestions.length, 1);
      assert.equal(suggestions.filter(s => luaTypes.LUA_KIND_TABLE_MEMBER === s.kind).length, 1);
    });

  });

  describe("Suggestion for nested field", () => {

    const index = 1093;

    it("NestedTable.", async () => {
      const suggestions = await luaSuggester.suggest(source, filePath, "NestedTable.", index);
      assert.equal(suggestions.length, 2);
      assert.equal(suggestions.filter(s => luaTypes.LUA_KIND_TABLE_MEMBER === s.kind).length, 2);
    });

    it("NestedTable.field2.", async () => {
      const suggestions = await luaSuggester.suggest(source, filePath, "NestedTable.field2.", index);
      assert.equal(suggestions.length, 5);
      assert.equal(suggestions.filter(s => luaTypes.LUA_KIND_TABLE_MEMBER === s.kind).length, 5);
    });

    it("NestedTable.field2.m", async () => {
      const suggestions = await luaSuggester.suggest(source, filePath, "NestedTable.field2.m", index);
      assert.equal(suggestions.length, 1);
      assert.equal(suggestions.filter(s => luaTypes.LUA_KIND_TABLE_MEMBER === s.kind).length, 1);
    });

  });

  describe("Suggestion for imported table field", () => {

    const index = 1093;

    it("libraryTable.", async () => {
      const suggestions = await luaSuggester.suggest(source, filePath, "libraryTable.", index);
      assert.equal(suggestions.length, 2);
      assert.equal(suggestions.filter(s => luaTypes.LUA_KIND_TABLE_MEMBER === s.kind).length, 2);
    });

  });

});