'use babel'

import {observable, action} from 'mobx';

export class ConsoleStore {

  @observable recent = { message: "Athena ide package launched", level: "info" };

  @action log(message, level) {
    this.recent = { message: message, level: level };
  }

}

export default new ConsoleStore();