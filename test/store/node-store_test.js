import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs from 'fs';
chai.use(chaiAsPromised);
const assert = chai.assert;

import NodeStore from '../../src/store/node-store';

describe("NodeStore", () => {

  describe("Persistant test", () => {

    it("should serialized and deserialize right", () => {
      const origin = new NodeStore();
      const serialized = origin.serialize();
      assert.isNotNull(serialized);

      const newOne = new NodeStore();
      newOne.deserialize(serialized);
    });

  });

});