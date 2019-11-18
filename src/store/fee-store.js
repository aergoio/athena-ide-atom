import {observable, action} from 'mobx';
import logger from 'loglevel';

import serviceProvider from '../service';

export default class FeeStore {

  @observable price = "unknown";
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

  @action updatePrice() {
    logger.debug("Update price");
    serviceProvider.nodeService.gasPrice().then(price => {
      this.price = price;
    });
  }

  @action changeLimit(limit) {
    this.limit = limit;
  }

}
