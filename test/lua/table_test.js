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

    it("FieldTable.", () => {
      luaSuggester.suggest(source, filePath, "FieldTable.", index).then(suggestions => {
        assert.equal(suggestions.length, 5);
        assert.equal(suggestions.filter(s => luaTypes.LUA_KIND_TABLE_MEMBER === s.kind).length, 5);
      });
    });

    it("FieldTable.f", () => {
      luaSuggester.suggest(source, filePath, "FieldTable.f", index).then(suggestions => {
        assert.equal(suggestions.length, 4);
        assert.equal(suggestions.filter(s => luaTypes.LUA_KIND_TABLE_MEMBER === s.kind).length, 4);
      });
    });

    it("FieldTable2.f", () => {
      luaSuggester.suggest(source, filePath, "FieldTable2.f", index).then(suggestions => {
        assert.equal(suggestions.length, 2);
        assert.equal(suggestions.filter(s => luaTypes.LUA_KIND_TABLE_MEMBER === s.kind).length, 2);
      });
    });

  });

  describe("Suggestion for function field", () => {

    const index = 733;

    it("FuncTable.", () => {
      luaSuggester.suggest(source, filePath, "FuncTable.", index).then(suggestions => {
        assert.equal(suggestions.length, 5);
        assert.equal(suggestions.filter(s => luaTypes.LUA_KIND_TABLE_MEMBER === s.kind).length, 5);
      });
    });

    it("FuncTable.s", () => {
      luaSuggester.suggest(source, filePath, "FuncTable.s", index).then(suggestions => {
        assert.equal(suggestions.length, 1);
        assert.equal(suggestions.filter(s => luaTypes.LUA_KIND_TABLE_MEMBER == s.kind).length, 1);
      });
    });

    it("FuncTable.m", () => {
      luaSuggester.suggest(source, filePath, "FuncTable.m", index).then(suggestions => {
        assert.equal(suggestions.length, 3);
        assert.equal(suggestions.filter(s => luaTypes.LUA_KIND_TABLE_MEMBER === s.kind).length, 3);
      });
    });

    it("FuncTable.d", () => {
      luaSuggester.suggest(source, filePath, "FuncTable.d", index).then(suggestions => {
        assert.equal(suggestions.length, 1);
        assert.equal(suggestions.filter(s => luaTypes.LUA_KIND_TABLE_MEMBER === s.kind).length, 1);
      });
    });

  });

  describe("Suggestion for nested field", () => {

    const index = 1093;

    it("NestedTable.", () => {
      luaSuggester.suggest(source, filePath, "NestedTable.", index).then(suggestions => {
        assert.equal(suggestions.length, 2);
        assert.equal(suggestions.filter(s => luaTypes.LUA_KIND_TABLE_MEMBER === s.kind).length, 2);
      });
    });

    // TODO : not yet implemented

  });

  describe("Suggestion for imported table field", () => {

    const index = 1093;

    it("libraryTable.", () => {
      luaSuggester.suggest(source, filePath, "libraryTable.", index).then(suggestions => {
        assert.equal(suggestions.length, 2);
        assert.equal(suggestions.filter(s => luaTypes.LUA_KIND_TABLE_MEMBER === s.kind).length, 2);
      });
    });

  });

});