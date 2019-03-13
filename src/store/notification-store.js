'use babel'

import {observable, action} from 'mobx';

export class NotificationStore {

  @observable recent = { message: "", level: "" };

  @action notify(message, level) {
    this.recent = { message: message, level: level };
  }

}

export default new NotificationStore();