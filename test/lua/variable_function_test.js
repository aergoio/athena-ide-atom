import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs from 'fs';
chai.use(chaiAsPromised);
const assert = chai.assert;

import LuaManager from '../../src/lua';
import * as types from '../../src/lua/lua-types';

describe("Autocomplete plain variable, function", () => {

  const filePath = __dirname + "/resources/variablefunction.lua";
  const source = fs.readFileSync(filePath, "utf8");

  describe("Suggestion in global", () => {
    it("after variable1, variable2, variable3", () => {
      const luaManager = new LuaManager();
      luaManager.updateAST(source);

      const index = 53;

      const suggestions = luaManager.getSuggestions("v", index);
      assert.equal(suggestions.length, 3);
      assert.equal(suggestions.filter(s => types.ATHENA_LUA_VARIABLE === s.kind).length, 3);
    });

    it("after func1", () => {
      const luaManager = new LuaManager();
      luaManager.updateAST(source);

      const index = 326;

      const variableSuggestions = luaManager.getSuggestions("v", index);
      assert.equal(variableSuggestions.length, 3);
      assert.equal(variableSuggestions.filter(s => types.ATHENA_LUA_VARIABLE === s.kind).length, 3);

      const functionSuggestions = luaManager.getSuggestions("f", index);
      assert.equal(functionSuggestions.length, 1);
      assert.equal(functionSuggestions.filter(s => types.ATHENA_LUA_FUNCTION === s.kind).length, 1);
    });

    it("after func2", () => {
      const luaManager = new LuaManager();
      luaManager.updateAST(source);

      const index = 657;

      const variableSuggestions = luaManager.getSuggestions("v", index);
      assert.equal(variableSuggestions.length, 4);
      assert.equal(variableSuggestions.filter(s => types.ATHENA_LUA_VARIABLE === s.kind).length, 4);

      const functionSuggestions = luaManager.getSuggestions("f", index);
      assert.equal(functionSuggestions.length, 2);
      assert.equal(functionSuggestions.filter(s => types.ATHENA_LUA_FUNCTION === s.kind).length, 2);
    });

    it("after func3", () => {
      const luaManager = new LuaManager();
      luaManager.updateAST(source);

      const index = 966;

      const variableSuggestions = luaManager.getSuggestions("v", index);
      assert.equal(variableSuggestions.length, 4);
      assert.equal(variableSuggestions.filter(s => types.ATHENA_LUA_VARIABLE === s.kind).length, 4);

      const functionSuggestions = luaManager.getSuggestions("f", index);
      assert.equal(functionSuggestions.length, 3);
      assert.equal(functionSuggestions.filter(s => types.ATHENA_LUA_FUNCTION === s.kind).length, 3);
    });

  });

  describe("Suggestion in named function with argument", () => {

    const index = 148;

    it("in function scope v_", () => {
      const luaManager = new LuaManager();
      luaManager.updateAST(source);

      const suggestions = luaManager.getSuggestions("v", index);
      assert.equal(suggestions.length, 4);
      assert.equal(suggestions.filter(s => types.ATHENA_LUA_VARIABLE === s.kind).length, 4);
    });

    it("in function scope a_", () => {
      const luaManager = new LuaManager();
      luaManager.updateAST(source);

      const suggestions = luaManager.getSuggestions("a", index);
      assert.equal(suggestions.length, 2);
      assert.equal(suggestions.filter(s => types.ATHENA_LUA_VARIABLE === s.kind).length, 2);
    });

    it("in function scope f_", () => {
      const luaManager = new LuaManager();
      luaManager.updateAST(source);

      const suggestions = luaManager.getSuggestions("f", index);
      assert.equal(suggestions.length, 1);
      assert.equal(suggestions.filter(s => types.ATHENA_LUA_FUNCTION === s.kind).length, 1);
    });

  });

  describe("Suggestion in assigned anonymous function", () => {

    const index = 457;

    it("in function scope v_", () => {
      const luaManager = new LuaManager();
      luaManager.updateAST(source);

      const suggestions = luaManager.getSuggestions("v", index);
      assert.equal(suggestions.length, 4);
      assert.equal(suggestions.filter(s => types.ATHENA_LUA_VARIABLE === s.kind).length, 4);
    });

    it("in function scope a_", () => {
      const luaManager = new LuaManager();
      luaManager.updateAST(source);

      const suggestions = luaManager.getSuggestions("a", index);
      assert.equal(suggestions.length, 2);
      assert.equal(suggestions.filter(s => types.ATHENA_LUA_VARIABLE === s.kind).length, 2);
    });

    it("in function scope f_", () => {
      const luaManager = new LuaManager();
      luaManager.updateAST(source);

      const suggestions = luaManager.getSuggestions("f", index);
      assert.equal(suggestions.length, 2);
      assert.equal(suggestions.filter(s => types.ATHENA_LUA_FUNCTION === s.kind).length, 2);
    });

  });

  describe("Suggestion in named function without argument", () => {

    const index = 774;

    it("in function scope v_", () => {
      const luaManager = new LuaManager();
      luaManager.updateAST(source);

      const suggestions = luaManager.getSuggestions("v", index);
      assert.equal(suggestions.length, 4);
      assert.equal(suggestions.filter(s => types.ATHENA_LUA_VARIABLE === s.kind).length, 4);
    });

    it("in function scope a_", () => {
      const luaManager = new LuaManager();
      luaManager.updateAST(source);

      const suggestions = luaManager.getSuggestions("a", index);
      assert.equal(suggestions.length, 0);
      assert.equal(suggestions.filter(s => types.ATHENA_LUA_VARIABLE === s.kind).length, 0);
    });

    it("in function scope f_", () => {
      const luaManager = new LuaManager();
      luaManager.updateAST(source);

      const suggestions = luaManager.getSuggestions("f", index);
      assert.equal(suggestions.length, 3);
      assert.equal(suggestions.filter(s => types.ATHENA_LUA_FUNCTION === s.kind).length, 3);
    });

  });

});