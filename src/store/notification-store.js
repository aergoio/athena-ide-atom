import {observable, action} from 'mobx';
import logger from 'loglevel';

export default class NotificationStore {

  @observable recent = { message: "", level: "" };

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  serialize() {
    return {};
  }

  @action deserialize(data) {
    logger.debug("Deserialize", data);
  }

  @action notify(message, level) {
    this.recent = { message: message, level: level };
  }

}
