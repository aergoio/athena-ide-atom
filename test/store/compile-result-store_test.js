import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs from 'fs';
chai.use(chaiAsPromised);
const assert = chai.assert;

import CompileResultStore from '../../src/store/compile-result-store';

describe("CompileResultStore", () => {

  describe("Persistant test", () => {

    it("should serialized and deserialize right", () => {
      const origin = new CompileResultStore();
      const serialized = origin.serialize();
      assert.isNotNull(serialized);

      const newOne = new CompileResultStore();
      newOne.deserialize(serialized);
    });

  });

});