'use babel';

import {EventType} from '../event';
import logger from '../logger';

export default class SelectService {

  constructor(eventDispatcher) {
    this.eventDispatcher = eventDispatcher;
  }

  updateCompiledTarget(file) {
    this.eventDispatcher.dispatch(EventType.UpdateCompiledTarget, file);
  }

}