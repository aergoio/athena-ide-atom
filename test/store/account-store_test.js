import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs from 'fs';
chai.use(chaiAsPromised);
const assert = chai.assert;

import AccountStore from '../../src/store/account-store';

describe("AccountStore", () => {

  describe("Persistant test", () => {

    it("should serialized and deserialize right", () => {
      const origin = new AccountStore();
      const serialized = origin.serialize();
      assert.isNotNull(serialized);

      const newOne = new AccountStore();
      newOne.deserialize(serialized);
    });

  });

});