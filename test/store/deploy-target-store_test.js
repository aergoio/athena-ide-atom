import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs from 'fs';
chai.use(chaiAsPromised);
const assert = chai.assert;

import DeployTargetStore from '../../src/store/deploy-target-store';

describe("DeployTargetStore", () => {

  describe("Persistant test", () => {

    it("should serialized and deserialize right", () => {
      const origin = new DeployTargetStore();
      const serialized = origin.serialize();
      assert.isNotNull(serialized);

      const newOne = new DeployTargetStore();
      newOne.deserialize(serialized);
    });

  });

});