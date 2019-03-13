'use babel'

import {observable, action} from 'mobx';

export class NodeStore {

  @observable price = 0;
  @observable limit = 0;

  @action setPrice(price) {
    this.price = price;
  }

  @action setLimit(limit) {
    this.limit = limit;
  }

}

export default new NodeStore();