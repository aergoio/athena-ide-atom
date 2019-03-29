import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs from 'fs';
chai.use(chaiAsPromised);
const assert = chai.assert;

import FeeStore from '../../src/store/fee-store';

describe("FeeStore", () => {

  describe("Persistant test", () => {

    it("should serialized and deserialize right", () => {
      const origin = new FeeStore();
      const serialized = origin.serialize();
      assert.isNotNull(serialized);

      const newOne = new FeeStore();
      newOne.deserialize(serialized);
    });

  });

});