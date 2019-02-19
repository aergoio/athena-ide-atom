'use babel';

import logger from '../logger';

import EventEmitter from 'events';
import EventType from './event-type';

export default class EventDispatcher {

  constructor() {
    this.eventEmitter = new EventEmitter();
  }

  dispatch(eventType, payload) {
    logger.debug("Dispatch event: " + eventType);
    logger.debug(payload);
    this.eventEmitter.emit(eventType, payload);
  }

  setupListeners(views) {
    this.eventEmitter.eventNames().forEach(event => this.eventEmitter.removeAllListeners(event));
    this.views = views;

    this.eventEmitter.on(EventType.Compile, (payload) => {
      if (null == payload.err) {
        this.views.consoleView.log({data: payload.toString(), level: "info"});
        this.views.athenaIdeView.showCompileResult(payload);
      } else {
        this.views.consoleView.log({data: payload.toString(), level: "error"});
      }
    });

    this.eventEmitter.on(EventType.UpdateCompiledTarget, (payload) => {
      this.views.athenaIdeView.selectCompiledTarget(payload);
    });
  }

}