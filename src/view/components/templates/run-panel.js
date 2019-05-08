import React from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import logger from 'loglevel';

import { Panel } from '../atoms';
import { Deployment, ContractSelect, ContractCall } from '../organisms';
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
    this._onContractAddressChange = this._onContractAddressChange.bind(this);
    this._onAbiExec = this._onAbiExec.bind(this);
    this._onAbiQuery = this._onAbiQuery.bind(this);
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

  _onContractAddressChange(selectedContractAddress) {
    runWithCallback.call(this, () => {
      this.abiCallsRef.current.cleanArgsValue();
      const contractAddress = selectedContractAddress.value;
      logger.info("Contract address change to", contractAddress);
      this.props.contractStore.changeContract(contractAddress);
    }, this._onError);
  }

  _onAbiExec(argInputRef, targetFunction) {
    runWithCallback.call(this, () => {
      logger.debug("Input ref:", argInputRef);
      const targetArgs = parseArgs(argInputRef.current.value);
      logger.info("Execute contract", targetFunction, "with args", targetArgs);
      this.props.contractStore.executeContract(targetFunction, targetArgs);
    }, this._onError);
  }

  _onAbiQuery(argInputRef, targetFunction) {
    runWithCallback.call(this, () => {
      logger.debug("Input ref:", argInputRef);
      const targetArgs = parseArgs(argInputRef.current.value);
      logger.info("Query contract", targetFunction, "with args", targetArgs);
      this.props.contractStore.queryContract(targetFunction, targetArgs);
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

    // contract select
    const onContractChange = this._onContractAddressChange;
    const currentContract = this.props.contractStore.currentContract;
    const contracts = this.props.contractStore.contracts;

    // execute / query
    const currentAbi = this.props.contractStore.currentAbi;
    const onAbiExec = this._onAbiExec;
    const onAbiQuery = this._onAbiQuery;

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
        <ContractSelect
          onContractChange={onContractChange}
          currentContract={currentContract}
          contracts={contracts}
        />
        <ContractCall
          currentAbi={currentAbi}
          onAbiExec={onAbiExec}
          onAbiQuery={onAbiQuery}
          abiCallsRef={this.abiCallsRef}
        />
     </Panel>
    );
  }

}
