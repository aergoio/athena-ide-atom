import React from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import logger from 'loglevel';

import { Panel } from '../atoms';
import { Deployment, CompileResult } from '../organisms';
import { editor, SaveConfirmView } from '../../';

import Environment from './environment';
import { parseArgs, runWithCallback } from '../../../utils';

@inject('notificationStore', 'compileStore', 'contractStore', 'deployTargetStore')
@observer
export default class DeployPanel extends React.Component {

  static get propTypes() {
    return {
      notificationStore: PropTypes.any,
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
    this._onError = this._onError.bind(this);
  }

  _onFileChange(selectedOption) {
    runWithCallback.call(this, () => {
      logger.debug("Compiled file change", selectedOption);
      this.props.deployTargetStore.changeTarget(selectedOption.value);
    }, this._onError);
  }

  _onCompileButtonClicked() {
    runWithCallback.call(this, () => {
      logger.debug("Compile contract");
      if (editor.isAnyEditorDirty()) {
        new SaveConfirmView(() => this._compile()).show();
      } else {
        this._compile();
      }
    }, this._onError);
  }

  _compile() {
    runWithCallback.call(this, () => {
      this.props.compileStore.compileCurrentTarget();
    }, this._onError);
  }

  _onDeployButtonClicked(argInputRef) {
    runWithCallback.call(this, () => {
      logger.debug("Deploy contract");
      logger.debug("Input ref:", argInputRef);
      let constructorArgs = [];
      if (argInputRef.current) {
        constructorArgs = parseArgs(argInputRef.current.value);
      }
      this.props.contractStore.deployContract(constructorArgs);
    }, this._onError);
  }

  _onError(error) {
    logger.error(error);
    this.props.notificationStore.notify(error, "error");
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