import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs from 'fs';
chai.use(chaiAsPromised);
const assert = chai.assert;

import ConsoleStore from '../../src/store/console-store';

describe("ConsoleStore", () => {

  describe("Persistant test", () => {

    it("should serialized and deserialize right", () => {
      const origin = new ConsoleStore();
      const serialized = origin.serialize();
      assert.isNotNull(serialized);

      const newOne = new ConsoleStore();
      newOne.deserialize(serialized);
    });

  });

});