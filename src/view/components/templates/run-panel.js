import React from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import clipboardy from 'clipboardy';
import logger from 'loglevel';

import { Panel } from '../atoms';
import { Deployment, Contract } from '../organisms';
import { editor, SaveConfirmView } from '../..';

import Environment from './environment';
import { parseArgs, runWithCallback } from '../../../utils';

@inject('notificationStore', 'compileStore', 'contractStore', 'deployTargetStore')
@observer
export default class RunPanel extends React.Component {

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
    this._onAbiExec = this._onAbiExec.bind(this);
    this._onAbiQuery = this._onAbiQuery.bind(this);
    this._onCopyContract = this._onCopyContract.bind(this);
    this._onRemoveContract = this._onRemoveContract.bind(this);
    this._onError = this._onError.bind(this);

    // FIXME : acktsap's hack to refresh input value
    this.abiCallsRef = React.createRef();
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

  _onAbiExec(contractAddress, abi, targetFunction, argInputRef) {
    runWithCallback.call(this, () => {
      logger.debug("Input ref:", argInputRef);
      const targetArgs = parseArgs(argInputRef.current.value);
      logger.info("Execute contract", targetFunction, "with args", targetArgs);
      this.props.contractStore.executeContract(contractAddress, abi, targetFunction, targetArgs);
    }, this._onError);
  }

  _onAbiQuery(contractAddress, abi, targetFunction, argInputRef) {
    runWithCallback.call(this, () => {
      logger.debug("Input ref:", argInputRef);
      const targetArgs = parseArgs(argInputRef.current.value);
      logger.info("Query contract", targetFunction, "with args", targetArgs);
      this.props.contractStore.queryContract(contractAddress, abi, targetFunction, targetArgs);
    }, this._onError);
  }

  _onCopyContract(contractAddress) {
    runWithCallback.call(this, () => {
      logger.debug("Copy contract", contractAddress);
      clipboardy.writeSync(contractAddress);
    }, this._onError);
  }

  _onRemoveContract(contractAddress) {
    runWithCallback.call(this, () => {
      logger.debug("Remove contract", contractAddress);
      this.props.contractStore.removeContract(contractAddress);
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

    // contract
    const contractAddress2Abi = this.props.contractStore.contractAddress2Abi;
    const onAbiExec = this._onAbiExec;
    const onAbiQuery = this._onAbiQuery;
    const onCopyContract = this._onCopyContract
    const onRemoveContract = this._onRemoveContract

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
        <Contract
          contractAddress2Abi={contractAddress2Abi}
          onAbiExec={onAbiExec}
          onAbiQuery={onAbiQuery}
          onCopyContract={onCopyContract}
          onRemoveContract={onRemoveContract}
        />
     </Panel>
    );
  }

}
