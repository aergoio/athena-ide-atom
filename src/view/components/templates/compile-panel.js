'use babel';

import React from 'react';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import logger from 'loglevel';

import { Panel } from '../atoms';
import { CompileResult } from '../organisms';

@inject('compileResultStore')
@observer
export default class CompilePanel extends React.Component {

  static get propTypes() {
    return {
      compileResultStore: PropTypes.any
    };
  }

  constructor(props) {
    super(props);
    this._onFileChange = this._onFileChange.bind(this);
  }

  _onFileChange(selectedOption) {
    logger.debug("Compiled file change", selectedOption);
    this.props.compileResultStore.changeFile(selectedOption.value);
  }

  render() {
    logger.debug("Render with", this.props.compileResultStore)
    const currentFile = this.props.compileResultStore.currentFile;
    const files = this.props.compileResultStore.files;
    const payload = this.props.compileResultStore.compileResult.payload;
    const abi = this.props.compileResultStore.compileResult.abi;
    return (
      <Panel>
        <CompileResult
          currentFile={currentFile}
          files={files}
          payload={payload}
          abi={abi}
          onFileChange={this._onFileChange}
        />
     </Panel>
    );
  }

}