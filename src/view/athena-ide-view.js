'use babel';

/* eslint-disable */

import React from 'react';
import ReactDOM from 'react-dom';
import AthenaIde from './component';
import logger from '../logger';

export default class AtheneIdeView {

  constructor() {
    this.element = document.createElement('atom-panel');
    this.element.classList.add('athena-ide-panel');
    this.element.appendChild(this._buildRoot());

    this.context = this._buildProps();
  }

  _buildRoot() {
    let rootNode = document.createElement('div');
    let attribute = document.createAttribute('id');
    attribute.value = 'athena-ide-root';
    rootNode.setAttributeNode(attribute);
    return rootNode;
  }

  _buildProps() {
    return {
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
      ReactDOM.render(<AthenaIde context={this.context}/>, document.getElementById('athena-ide-root'));
    });
  }

  distroy() {
    // TODO : remove view from the bottom dock
  }

  showCompileResult(compileResult) {
    this.context = { compileResult: compileResult };
    this.show();
  }

}