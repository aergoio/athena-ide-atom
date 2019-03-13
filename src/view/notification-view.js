'use babel';

/* eslint-disable */

import {autorun} from 'mobx';
import logger from 'loglevel';

import notificationStore from '../store/notification-store';

export default class NotificationView {

  constructor() {
    autorun(() => {
      if (null != notificationStore.recent && "" !== notificationStore.recent.message) {
        this.notify(notificationStore.recent)
      }
    })
  }

  notify(messageAndLevel) {
    const message = messageAndLevel.message.toString();
    const level = messageAndLevel.level;
    switch (level) {
      case 'success':
        this._notifySuccess(message)
        break;
      case 'info':
        this._notifyInfo(message)
        break;
      case 'warn':
        this._notifyWarn(message)
        break;
      case 'error':
        this._notifyError(message)
        break;
      case 'fatal':
        this._notifyFatalError(message)
        break;
      default:
        const error = "Unrecognized message type" + level;
        logger.error(error);
        this._notifyError(error)
        break;
    }
  }

  _notifySuccess(message) {
    atom.notifications.addSuccess(message);
  }

  _notifyInfo(message) {
    atom.notifications.addInfo(message);
  }

  _notifyWarn(message) {
    atom.notifications.addWarning(message);
  }

  _notifyError(message) {
    atom.notifications.addError(message);
  }

  _notifyFatalError(message) {
    atom.notifications.addFatalError(message);
  }

}