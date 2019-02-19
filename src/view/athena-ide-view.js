'use babel';

/* eslint-disable */

import React from 'react';
import ReactDOM from 'react-dom';
import AthenaIde from './component';
import logger from '../logger';

export default class AtheneIdeView {

  constructor(services) {
    this.element = document.createElement('atom-panel');
    this.element.classList.add('athena-ide-panel');
    this.element.appendChild(this._buildRoot());

    this.context = this._buildContext(services);
  }

  _buildRoot() {
    let rootNode = document.createElement('div');
    let attribute = document.createAttribute('id');
    attribute.value = 'athena-ide-view-root';
    rootNode.setAttributeNode(attribute);
    rootNode.classList.add('athena-ide-view');
    return rootNode;
  }

  _buildContext(services) {
    return {
      current: {
        file: "",
        hostName: "",
        account: {
          accountAddress: "",
          balance: "",
          nonce: "",
        },
        contract: {
          fee: {
            price: "",
            limit: ""
          },
          contractAddress: ""
        }
      },
      store: {
        file2CompiledResult: new Map(),
        hostNames: new Set(),
        address2Identity: new Map(),
        contract2Abi: new Map()
      },
      services: services
    };
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
      ReactDOM.render(<AthenaIde context={this.context}/>, document.getElementById('athena-ide-view-root'));
    });
  }

  distroy() {
    // TODO : remove view from the bottom dock
  }

  selectCompiledTarget(selectedFile) {
    this.context.current.file = selectedFile;
    this.show();
  }

  showCompileResult(compileResult) {
    this.context.current.file = compileResult.file;
    this.context.store.file2CompiledResult.set(compileResult.file, compileResult);
    this.show();
  }

}