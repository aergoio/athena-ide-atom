import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs from 'fs';
chai.use(chaiAsPromised);
const assert = chai.assert;

import NotificationStore from '../../src/store/notification-store';

describe("NotificationStore", () => {

  describe("Persistant test", () => {

    it("should serialized and deserialize right", () => {
      const origin = new NotificationStore();
      const serialized = origin.serialize();
      assert.isNotNull(serialized);

      const newOne = new NotificationStore();
      newOne.deserialize(serialized);
    });

  });

});