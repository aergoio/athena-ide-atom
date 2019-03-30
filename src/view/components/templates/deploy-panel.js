'use babel';

import React from 'react';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import logger from 'loglevel';

import { Panel } from '../atoms';
import { Environment, Deployment, CompileResult } from '../organisms';

@inject('compileResultStore', 'contractStore')
@observer
export default class DeployPanel extends React.Component {

  static get propTypes() {
    return {
      compileResultStore: PropTypes.any,
      contractStore: PropTypes.any
    };
  }

  constructor(props) {
    super(props);

    this._onFileChange = this._onFileChange.bind(this);
    this._onDeployButtonClicked = this._onDeployButtonClicked.bind(this);
    this._onCompileButtonClicked = this._onCompileButtonClicked.bind(this);
  }

  _onFileChange(selectedOption) {
    logger.debug("Compiled file change", selectedOption);
    this.props.compileResultStore.changeFile(selectedOption.value);
  }

  _onCompileButtonClicked() {
    logger.debug("Compile contract");
    this.props.compileResultStore.compileWithCurrent();
  }

  _onDeployButtonClicked() {
    logger.debug("Deploy contract");
    this.props.contractStore.deployContract();
  }

  render() {
    // deploy
    const currentFile = this.props.compileResultStore.currentFile;
    const files = this.props.compileResultStore.files;
    const onChangeTarget = this._onFileChange;
    const onCompile = this._onCompileButtonClicked;
    const onDeploy = this._onDeployButtonClicked;

    // file
    // const currentFile = this.props.compileResultStore.currentFile;
    // const files = this.props.compileResultStore.files;
    const payload = this.props.compileResultStore.compileResult.payload;
    const abi = this.props.compileResultStore.compileResult.abi;
    const onFileChange = this._onFileChange;

    return (
      <Panel>
        <Environment />
        <Deployment
          currentFile={currentFile}
          files={files}
          onChangeTarget={onChangeTarget}
          onCompile={onCompile}
          onDeploy={onDeploy}
        />
        <CompileResult
          currentFile={currentFile}
          files={files}
          payload={payload}
          abi={abi}
          onFileChange={onFileChange}
        />
     </Panel>
    );
  }

}