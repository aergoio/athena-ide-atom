/* eslint-disable */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';

import AthenaIdeViewRoot from './components';

export default class AtheneIdeView {

  constructor(rootStore) {
    this.element = this._buildContainer();
    this.rootView = this._buildRootView();
    this.element.appendChild(this.rootView);

    this.stores = {
      accountStore: rootStore.accountStore,
      consoleStore: rootStore.consoleStore,
      contractStore: rootStore.contractStore,
      deployTargetStore: rootStore.deployTargetStore,
      feeStore: rootStore.feeStore,
      nodeStore: rootStore.nodeStore,
      notificationStore: rootStore.notificationStore
    }
  }

  _buildContainer() {
    const athenaIdeViewContainer = document.createElement('div');
    athenaIdeViewContainer.classList.add('athena-ide-view-container');
    return athenaIdeViewContainer;
  }

  _buildRootView() {
    const athenaIdeView = document.createElement('div');
    athenaIdeView.classList.add('athena-ide-view');
    return athenaIdeView;
  }

  getElement() {
    return this.element;
  }

  getTitle() {
    return 'Athena IDE';
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
        this.rootView
      );
    }
  }

  distroy() {
    // TODO : remove view from the right dock
  }

}
