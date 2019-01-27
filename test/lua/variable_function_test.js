import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs from 'fs';
chai.use(chaiAsPromised);
const assert = chai.assert;

import LuaAnalyzer from '../../src/lua';
import * as types from '../../src/lua/lua-types';

describe("Autocomplete plain variable, function", () => {

  const filePath = __dirname + "/resources/variablefunction.lua";
  const source = fs.readFileSync(filePath, "utf8");

  describe("Suggestion in global", () => {
    it("after variable1, variable2, variable3", () => {
      const luaAnalyzer = new LuaAnalyzer();
      luaAnalyzer.analyze(source, filePath);

      const index = 77;

      const suggestions = luaAnalyzer.getSuggestions("v", index, filePath);
      assert.equal(suggestions.length, 3);
      assert.equal(suggestions.filter(s => types.ATHENA_LUA_VARIABLE === s.kind).length, 3);
    });

    it("after func1", () => {
      const luaAnalyzer = new LuaAnalyzer();
      luaAnalyzer.analyze(source, filePath);

      const index = 350;

      const variableSuggestions = luaAnalyzer.getSuggestions("v", index, filePath);
      assert.equal(variableSuggestions.length, 3);
      assert.equal(variableSuggestions.filter(s => types.ATHENA_LUA_VARIABLE === s.kind).length, 3);

      const functionSuggestions = luaAnalyzer.getSuggestions("f", index, filePath);
      assert.equal(functionSuggestions.length, 1);
      assert.equal(functionSuggestions.filter(s => types.ATHENA_LUA_FUNCTION === s.kind).length, 1);
    });

    it("after func2", () => {
      const luaAnalyzer = new LuaAnalyzer();
      luaAnalyzer.analyze(source, filePath);

      const index = 681;

      const variableSuggestions = luaAnalyzer.getSuggestions("v", index, filePath);
      assert.equal(variableSuggestions.length, 4);
      assert.equal(variableSuggestions.filter(s => types.ATHENA_LUA_VARIABLE === s.kind).length, 4);

      const functionSuggestions = luaAnalyzer.getSuggestions("f", index, filePath);
      assert.equal(functionSuggestions.length, 2);
      assert.equal(functionSuggestions.filter(s => types.ATHENA_LUA_FUNCTION === s.kind).length, 2);
    });

    it("after func3", () => {
      const luaAnalyzer = new LuaAnalyzer();
      luaAnalyzer.analyze(source, filePath);

      const index = 991;

      const variableSuggestions = luaAnalyzer.getSuggestions("v", index, filePath);
      assert.equal(variableSuggestions.length, 4);
      assert.equal(variableSuggestions.filter(s => types.ATHENA_LUA_VARIABLE === s.kind).length, 4);

      const functionSuggestions = luaAnalyzer.getSuggestions("f", index, filePath);
      assert.equal(functionSuggestions.length, 3);
      assert.equal(functionSuggestions.filter(s => types.ATHENA_LUA_FUNCTION === s.kind).length, 3);
    });

  });

  describe("Suggestion in named function with argument", () => {

    const index = 170;

    it("in function scope v_", () => {
      const luaAnalyzer = new LuaAnalyzer();
      luaAnalyzer.analyze(source, filePath);

      const suggestions = luaAnalyzer.getSuggestions("v", index, filePath);
      assert.equal(suggestions.length, 4);
      assert.equal(suggestions.filter(s => types.ATHENA_LUA_VARIABLE === s.kind).length, 4);
    });

    it("in function scope a_", () => {
      const luaAnalyzer = new LuaAnalyzer();
      luaAnalyzer.analyze(source, filePath);

      const suggestions = luaAnalyzer.getSuggestions("a", index, filePath);
      assert.equal(suggestions.length, 2);
      assert.equal(suggestions.filter(s => types.ATHENA_LUA_VARIABLE === s.kind).length, 2);
    });

    it("in function scope f_", () => {
      const luaAnalyzer = new LuaAnalyzer();
      luaAnalyzer.analyze(source, filePath);

      const suggestions = luaAnalyzer.getSuggestions("f", index, filePath);
      assert.equal(suggestions.length, 1);
      assert.equal(suggestions.filter(s => types.ATHENA_LUA_FUNCTION === s.kind).length, 1);
    });

  });

  describe("Suggestion in assigned anonymous function", () => {

    const index = 481;

    it("in function scope v_", () => {
      const luaAnalyzer = new LuaAnalyzer();
      luaAnalyzer.analyze(source, filePath);

      const suggestions = luaAnalyzer.getSuggestions("v", index, filePath);
      assert.equal(suggestions.length, 4);
      assert.equal(suggestions.filter(s => types.ATHENA_LUA_VARIABLE === s.kind).length, 4);
    });

    it("in function scope a_", () => {
      const luaAnalyzer = new LuaAnalyzer();
      luaAnalyzer.analyze(source, filePath);

      const suggestions = luaAnalyzer.getSuggestions("a", index, filePath);
      assert.equal(suggestions.length, 2);
      assert.equal(suggestions.filter(s => types.ATHENA_LUA_VARIABLE === s.kind).length, 2);
    });

    it("in function scope f_", () => {
      const luaAnalyzer = new LuaAnalyzer();
      luaAnalyzer.analyze(source, filePath);

      const suggestions = luaAnalyzer.getSuggestions("f", index, filePath);
      assert.equal(suggestions.length, 2);
      assert.equal(suggestions.filter(s => types.ATHENA_LUA_FUNCTION === s.kind).length, 2);
    });

  });

  describe("Suggestion in named function without argument", () => {

    const index = 798;

    it("in function scope v_", () => {
      const luaAnalyzer = new LuaAnalyzer();
      luaAnalyzer.analyze(source, filePath);

      const suggestions = luaAnalyzer.getSuggestions("v", index, filePath);
      assert.equal(suggestions.length, 4);
      assert.equal(suggestions.filter(s => types.ATHENA_LUA_VARIABLE === s.kind).length, 4);
    });

    it("in function scope a_", () => {
      const luaAnalyzer = new LuaAnalyzer();
      luaAnalyzer.analyze(source, filePath);

      const suggestions = luaAnalyzer.getSuggestions("a", index, filePath);
      assert.equal(suggestions.length, 0);
      assert.equal(suggestions.filter(s => types.ATHENA_LUA_VARIABLE === s.kind).length, 0);
    });

    it("in function scope f_", () => {
      const luaAnalyzer = new LuaAnalyzer();
      luaAnalyzer.analyze(source, filePath);

      const suggestions = luaAnalyzer.getSuggestions("f", index, filePath);
      assert.equal(suggestions.length, 3);
      assert.equal(suggestions.filter(s => types.ATHENA_LUA_FUNCTION === s.kind).length, 3);
    });

  });

  describe("Suggestion for imported one", () => {

    const index = 1098;

    it("in last line l_", () => {
      const luaAnalyzer = new LuaAnalyzer();
      luaAnalyzer.analyze(source, filePath);

      const suggestions = luaAnalyzer.getSuggestions("l", index, filePath);
      assert.equal(suggestions.length, 3);
      assert.equal(suggestions.filter(s => types.ATHENA_LUA_VARIABLE === s.kind).length, 2);
      assert.equal(suggestions.filter(s => types.ATHENA_LUA_FUNCTION === s.kind).length, 1);
    });

  });

});