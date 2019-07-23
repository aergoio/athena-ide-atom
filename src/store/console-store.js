import { observable, action } from 'mobx';
import logger from 'loglevel';

export default class ConsoleStore {

  @observable logs = [];

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
    const stringMessage = typeof message === "string" ? message : message.toString();
    const time = this._getTime();
    const logElement = {time: time, message: stringMessage, level: level};
    this.logs.push(logElement);
  }

  _getTime() {
    const date = new Date();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    const timeInfo = [ hour, minute, second ].map((m) => m < 10 ? "0" + m : m).join(":");
    return timeInfo;
  }

  @action clear() {
    this.logs.clear();
  }

}
