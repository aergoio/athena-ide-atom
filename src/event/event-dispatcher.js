'use babel';

import EventEmitter from 'events';
import logger from 'loglevel';

import EventType from './event-type';

export default class EventDispatcher {

  constructor() {
    this.eventEmitter = new EventEmitter();
  }

  dispatch(eventType, payload) {
    logger.debug("Dispatch event", eventType, payload);
    this.eventEmitter.emit(eventType, payload);
  }

  setupListeners(views) {
    this.eventEmitter.eventNames().forEach(event => this.eventEmitter.removeAllListeners(event));
    this.views = views;

    this.eventEmitter.on(EventType.AppendLog, (payload) => {
      this.views.consoleView.log({data: payload.data, level: payload.level});
    });

    this.eventEmitter.on(EventType.NewCompileTarget, (payload) => {
      this.views.athenaIdeView.newCompileInfo(payload);
    });
    this.eventEmitter.on(EventType.ChangeCompileTarget, (payload) => {
      this.views.athenaIdeView.selectFile(payload);
    });

    this.eventEmitter.on(EventType.NewNode, (payload) => {
      this.views.athenaIdeView.selectNode(payload);
    });
    this.eventEmitter.on(EventType.ChangeNode, (payload) => {
      this.views.athenaIdeView.selectNode(payload);
    });

    this.eventEmitter.on(EventType.NewAccount, (payload) => {
      this.views.athenaIdeView.selectAccount(payload);
    });
    this.eventEmitter.on(EventType.ImportAccount, (payload) => {
      this.views.athenaIdeView.selectAccount(payload);
    });
    this.eventEmitter.on(EventType.ExportAccount, (payload) => {
      // do nothing
    });
    this.eventEmitter.on(EventType.ChangeAccount, (payload) => {
      this.views.athenaIdeView.selectAccount(payload);
    });
  }

}