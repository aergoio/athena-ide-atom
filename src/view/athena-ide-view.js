'use babel';

/* eslint-disable */

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'mobx-react';

import AthenaIdeViewRoot from './components';

export default class AtheneIdeView {

  constructor(rootStore) {
    this.element = document.createElement('atom-panel');
    this.element.appendChild(this._buildRoot());
    this.stores = {
      accountStore: rootStore.accountStore,
      compileResultStore: rootStore.compileResultStore,
      consoleStore: rootStore.consoleStore,
      contractStore: rootStore.contractStore,
      feeStore: rootStore.feeStore,
      nodeStore: rootStore.nodeStore,
      notificationStore: rootStore.notificationStore
    }
  }

  _buildRoot() {
    let rootNode = document.createElement('div');
    let attribute = document.createAttribute('id');
    attribute.value = 'athena-ide-panel-root';
    rootNode.setAttributeNode(attribute);
    rootNode.setAttribute('tabindex', '-1');
    return rootNode;
  }

  getElement() {
    return this.element;
  }

  getTitle() {
    return 'Athena Ide';
  }

  getPath() {
    return 'athena-ide-view';
  }

  getUri() {
    return `particle-dev://editor/${this.getPath()}`;
  }

  getDefaultLocation() {
    return 'right';
  }

  show() {
    atom.workspace.getRightDock().show();
    atom.workspace.open(this, {activatePane: false}).then(() => {
      this._draw();
    });
  }

  _draw() {
    if (!this.rootReactNode) {
      this.rootReactNode = ReactDOM.render((
        <Provider {...this.stores} >
          <AthenaIdeViewRoot />
        </Provider>),
        document.getElementById('athena-ide-panel-root')
      );
    }
  }

  distroy() {
    // TODO : remove view from the right dock
  }

}