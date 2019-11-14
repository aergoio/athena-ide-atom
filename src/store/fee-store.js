import {observable, action} from 'mobx';
import logger from 'loglevel';

export default class FeeStore {

  @observable limit = 0;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  serialize() {
    return {};
  }

  @action deserialize(data) {
    logger.debug("Deserialize", data);
  }

  @action changeLimit(limit) {
    this.limit = limit;
  }

}
