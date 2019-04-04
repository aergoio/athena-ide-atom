'use babel';

/* eslint-disable */

import {$$, View} from 'atom-space-pen-views';
import {autorun} from 'mobx';
import logger from 'loglevel';

export default class ConsoleView extends View {

  static content() {
    this.div({id: 'athena-ide-console'}, () => {
      this.div({class: 'panel-body view-scroller', outlet: 'body'}, () => {
        this.pre({class: 'native-key-bindings', outlet: 'output', tabindex: -1});
      });
    });
  }

  constructor(rootStore) {
    super();
    autorun(() => {
      if (null != rootStore.consoleStore.recent && "" !== rootStore.consoleStore.recent.message) {
        this.log(rootStore.consoleStore.recent);
      }
    })
  }

  getTitle() {
    return 'Athena IDE Console';
  }

  getPath() {
    return 'athena-ide-console-view';
  }

  getUri() {
    return `particle-dev://editor/${this.getPath()}`;
  }

  getDefaultLocation() {
    return 'bottom';
  }

  show() {
    atom.workspace.getBottomDock().show();
    return atom.workspace.open(this, {activatePane: false});
  }

  distroy() {
    // TODO remove element form dock
    this.clear();
  }

  log(messageAndLevel) {
    this.show().then(() => {
      const message = messageAndLevel.message.toString();
      const level = messageAndLevel.level;
      const messageWithTime = this._wrapTime(message);
      this.output.append($$(function() {
        this.div({class: `level-${level}`}, messageWithTime);
      }));
      this.body.scrollToBottom();
    });
  }

  _wrapTime(message) {
    const date = new Date();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    const timeInfo = [ hour, minute, second ].map((m) => m < 10 ? "0" + m : m).join(":");
    return timeInfo + " " + message.toString();
  }

  clear() {
    this.output.empty();
  }

}