'use babel';

/* eslint-disable */

import {$$, View} from 'atom-space-pen-views';

export default class ConsoleView extends View {

  static content() {
    this.div({id: 'athena-ide-console'}, () => {
      this.div({class: 'panel-body view-scroller', outlet: 'body'}, () => {
        this.pre({class: 'native-key-bindings', outlet: 'output', tabindex: -1});
      });
    });
  }

  getTitle() {
    return 'Athena Ide Console';
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

  log(message) {
    this.show().then(() => {
      const data = message.data.toString();
      const level = message.level;
      const dataWithTime = this._wrapTime(data);
      this.output.append($$(function() {
        this.div({class: `level-${level}`}, dataWithTime);
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