import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs from 'fs';
chai.use(chaiAsPromised);
const assert = chai.assert;

import CompileStore from '../../src/store/compile-store';

describe("CompileStore", () => {

  describe("Persistant test", () => {

    it("should serialized and deserialize right", () => {
      const origin = new CompileStore();
      const serialized = origin.serialize();
      assert.isNotNull(serialized);

      const newOne = new CompileStore();
      newOne.deserialize(serialized);
    });

  });

});