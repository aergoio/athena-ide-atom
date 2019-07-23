/* eslint-disable */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';

import ConsoleViewRoot from './components/console-view-root';

export default class ConsoleView {

  constructor(rootStore) {
    this.element = document.createElement('atom-panel');
    this.element.classList.add('native-key-bindings');
    this.element.setAttribute('tabindex', -1);
    this.consoleStore = rootStore.consoleStore;
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

  getElement() {
    return this.element;
  }

  show() {
    atom.workspace.getBottomDock().show();
    return atom.workspace.open(this, {activatePane: false}).then(() => {
      this._draw();
    });
  }

  _draw() {
    if (!this.rootReactNode) {
      this.rootReactNode = ReactDOM.render((
        <Provider consoleStore={this.consoleStore} >
          <ConsoleViewRoot />
        </Provider>),
        this.element
      );
    }
  }

  distroy() {
    // TODO remove element form dock
  }

}