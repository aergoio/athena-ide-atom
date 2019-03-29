import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs from 'fs';
chai.use(chaiAsPromised);
const assert = chai.assert;

import ContractStore from '../../src/store/contract-store';

describe("ContractStore", () => {

  describe("Persistant test", () => {

    it("should serialized and deserialize right", () => {
      const origin = new ContractStore();
      const serialized = origin.serialize();
      assert.isNotNull(serialized);

      const newOne = new ContractStore();
      newOne.deserialize(serialized);
    });

  });

});