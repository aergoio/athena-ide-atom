import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs from 'fs';
chai.use(chaiAsPromised);
const assert = chai.assert;

import {LuaSuggester, luaTypes} from '../../src/lua';

describe("Autocomplete for plain variable, function", () => {

  const filePath = __dirname + "/resources/variablefunction.lua";
  const source = fs.readFileSync(filePath, "utf8");
  const luaSuggester = new LuaSuggester();

  describe("Suggestion in global after variable1, variable2, variable3", () => {

    const index = 77;

    it("variable", () => {
      luaSuggester.suggest(source, filePath, "variable", index).then(suggestions => {
        assert.equal(suggestions.length, 3);
        assert.equal(suggestions.filter(s => luaTypes.LUA_KIND_VARIABLE === s.kind).length, 3);
      });
    });

  });

  describe("Suggestion in global after func1", () => {

    const index = 350;

    it("variable", () => {
      luaSuggester.suggest(source, filePath, "variable", index).then(suggestions => {
        assert.equal(suggestions.length, 3);
        assert.equal(suggestions.filter(s => luaTypes.LUA_KIND_VARIABLE === s.kind).length, 3);
      });
    });

    it("func", () => {
      luaSuggester.suggest(source, filePath, "func", index).then(suggestions => {
        assert.equal(suggestions.length, 1);
        assert.equal(suggestions.filter(s => luaTypes.LUA_KIND_FUNCTION === s.kind).length, 1);
      });
    });

  });

  describe("Suggestion in global after func2", () => {

    const index = 681;

    it("variable", () => {
      luaSuggester.suggest(source, filePath, "variable", index).then(suggestions => {
        assert.equal(suggestions.length, 4);
        assert.equal(suggestions.filter(s => luaTypes.LUA_KIND_VARIABLE === s.kind).length, 4);
      });
    });

    it("func", () => {
      luaSuggester.suggest(source, filePath, "func", index).then(suggestions => {
        assert.equal(suggestions.length, 2);
        assert.equal(suggestions.filter(s => luaTypes.LUA_KIND_FUNCTION === s.kind).length, 2);
      });
    });

  });

  describe("Suggestion in global after func3", () => {

    const index = 991;

    it("variable", () => {
      luaSuggester.suggest(source, filePath, "variable", index).then(suggestions => {
        assert.equal(suggestions.length, 4);
        assert.equal(suggestions.filter(s => luaTypes.LUA_KIND_VARIABLE === s.kind).length, 4);
      });
    });

    it("func", () => {
      luaSuggester.suggest(source, filePath, "func", index).then(suggestions => {
        assert.equal(suggestions.length, 3);
        assert.equal(suggestions.filter(s => luaTypes.LUA_KIND_FUNCTION === s.kind).length, 3);
      });
    });

  });

  describe("Suggestion in named function with argument", () => {

    const index = 170;

    it("variable", () => {
      luaSuggester.suggest(source, filePath, "variable", index).then(suggestions => {
        assert.equal(suggestions.length, 4);
        assert.equal(suggestions.filter(s => luaTypes.LUA_KIND_VARIABLE === s.kind).length, 4);
      });
    });

    it("arg", () => {
      luaSuggester.suggest(source, filePath, "arg", index).then(suggestions => {
        assert.equal(suggestions.length, 2);
        assert.equal(suggestions.filter(s => luaTypes.LUA_KIND_VARIABLE === s.kind).length, 2);
      });
    });

    it("func", () => {
      luaSuggester.suggest(source, filePath, "func", index).then(suggestions => {
        assert.equal(suggestions.length, 1);
        assert.equal(suggestions.filter(s => luaTypes.LUA_KIND_FUNCTION === s.kind).length, 1);
      });
    });

  });

  describe("Suggestion in assigned anonymous function", () => {

    const index = 481;

    it("variable", () => {
      luaSuggester.suggest(source, filePath, "variable", index).then(suggestions => {
        assert.equal(suggestions.length, 4);
        assert.equal(suggestions.filter(s => luaTypes.LUA_KIND_VARIABLE === s.kind).length, 4);
      });
    });

    it("arg", () => {
      luaSuggester.suggest(source, filePath, "arg", index).then(suggestions => {
        assert.equal(suggestions.length, 2);
        assert.equal(suggestions.filter(s => luaTypes.LUA_KIND_VARIABLE === s.kind).length, 2);
      });
    });

    it("func", () => {
      luaSuggester.suggest(source, filePath, "func", index).then(suggestions => {
        assert.equal(suggestions.length, 2);
        assert.equal(suggestions.filter(s => luaTypes.LUA_KIND_FUNCTION === s.kind).length, 2);
      });
    });

  });

  describe("Suggestion in named function without argument", () => {

    const index = 798;

    it("variable", () => {
      luaSuggester.suggest(source, filePath, "variable", index).then(suggestions => {
        assert.equal(suggestions.length, 4);
        assert.equal(suggestions.filter(s => luaTypes.LUA_KIND_VARIABLE === s.kind).length, 4);
      });
    });

    it("arg", () => {
      luaSuggester.suggest(source, filePath, "arg", index).then(suggestions => {
        assert.equal(suggestions.length, 0);
        assert.equal(suggestions.filter(s => luaTypes.LUA_KIND_VARIABLE === s.kind).length, 0);
      });
    });

    it("func", () => {
      luaSuggester.suggest(source, filePath, "func", index).then(suggestions => {
        assert.equal(suggestions.length, 3);
        assert.equal(suggestions.filter(s => luaTypes.LUA_KIND_FUNCTION === s.kind).length, 3);
      });
    });

  });

  describe("Suggestion for imported one", () => {

    const index = 1098;

    it("library", () => {
      luaSuggester.suggest(source, filePath, "library", index).then(suggestions => {
        assert.equal(suggestions.length, 3);
        assert.equal(suggestions.filter(s => luaTypes.LUA_KIND_VARIABLE === s.kind).length, 2);
        assert.equal(suggestions.filter(s => luaTypes.LUA_KIND_FUNCTION === s.kind).length, 1);
      });
    });
  });

});