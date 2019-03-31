'use babel';

import React from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import logger from 'loglevel';

import { Panel } from '../atoms';
import { Environment, Deployment, CompileResult } from '../organisms';
import { editor, SaveConfirmView } from '../../';

import { parseArgs } from './utils';

@inject('compileStore', 'contractStore', 'deployTargetStore')
@observer
export default class DeployPanel extends React.Component {

  static get propTypes() {
    return {
      compileStore: PropTypes.any,
      contractStore: PropTypes.any,
      deployTargetStore: PropTypes.any
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
    this.props.deployTargetStore.changeTarget(selectedOption.value);
  }

  _onCompileButtonClicked() {
    logger.debug("Compile contract");
    if (editor.isAnyEditorDirty()) {
      new SaveConfirmView(() => this._compile()).show();
    } else {
      this._compile();
    }
  }

  _compile() {
    this.props.compileStore.compileCurrentTarget();
  }

  _onDeployButtonClicked(argInputRef) {
    logger.debug("Deploy contract");
    logger.debug("Input ref:", argInputRef);
    let constructorArgs = [];
    if (argInputRef.current) {
      constructorArgs = parseArgs(argInputRef.current.state.value);
    }
    this.props.contractStore.deployContract(constructorArgs);
  }

  render() {
    // deployment target
    const currentTarget = this.props.deployTargetStore.currentTarget;
    const targets = this.props.deployTargetStore.targets;
    const onChangeTarget = this._onFileChange;
    const onCompile = this._onCompileButtonClicked;
    const onDeploy = this._onDeployButtonClicked;
    const constructorArgs = this.props.deployTargetStore.constructorArgs;

    // compile result
    const payload = this.props.deployTargetStore.compileResult.payload;
    const abi = this.props.deployTargetStore.compileResult.abi;

    return (
      <Panel>
        <Environment />
        <Deployment
          currentTarget={currentTarget}
          targets={targets}
          onChangeTarget={onChangeTarget}
          onCompile={onCompile}
          onDeploy={onDeploy}
          constructorArgs={constructorArgs}
        />
        <CompileResult
          payload={payload}
          abi={abi}
        />
     </Panel>
    );
  }

}