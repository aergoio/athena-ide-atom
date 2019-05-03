import {observable, action} from 'mobx';
import logger from 'loglevel';

export default class ConsoleStore {

  @observable recent = { message: "", level: "info" };

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  serialize() {
    return {};
  }

  @action deserialize(data) {
    logger.debug("Deserialize", data);
  }

  @action log(message, level) {
    this.recent = { message: message, level: level };
  }

}
