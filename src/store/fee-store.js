'use babel'

import {observable, action} from 'mobx';
import logger from 'loglevel';

export default class FeeStore {

  @observable price = "0";
  @observable limit = "0";

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  serialize() {
    return {};
  }

  @action deserialize(data) {
    logger.debug("Deserialize", data);
  }

  @action setPrice(price) {
    this.price = price;
  }

  @action setLimit(limit) {
    this.limit = limit;
  }

}