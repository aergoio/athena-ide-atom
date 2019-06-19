import React from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import clipboardy from 'clipboardy';
import logger from 'loglevel';

import { Panel } from '../atoms';
import { Summary, TopBar, Account, Node, Deployment, Contract } from '../organisms';
import { editor, SaveConfirmView } from '../..';
import { runWithCallback } from '../../../utils';

@inject('nodeStore', 'accountStore', 'notificationStore', 'contractStore', 'deployTargetStore')
@observer
export default class RunPanel extends React.Component {

  static get propTypes() {
    return {
      nodeStore: PropTypes.any,
      accountStore: PropTypes.any,
      notificationStore: PropTypes.any,
      contractStore: PropTypes.any,
      deployTargetStore: PropTypes.any
    };
  }

  constructor(props) {
    super(props);

    this._onCompileButtonClicked = this._onCompileButtonClicked.bind(this);
    this._onRefresh = this._onRefresh.bind(this);

    this._onNodeUrlChange = this._onNodeUrlChange.bind(this);

    this._onAddressChange = this._onAddressChange.bind(this);
    this._onAddressCopy = this._onAddressCopy.bind(this);

    this._onFileChange = this._onFileChange.bind(this);
    this._onDeployButtonClicked = this._onDeployButtonClicked.bind(this);

    this._onContractImport = this._onContractImport.bind(this);
    this._onContractCopy = this._onContractCopy.bind(this);
    this._onContractRemove = this._onContractRemove.bind(this);

    this._onAbiExec = this._onAbiExec.bind(this);
    this._onAbiQuery = this._onAbiQuery.bind(this);

    this._onError = this._onError.bind(this);
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

  _onRefresh() {
    logger.info("Sync status");
    this.props.nodeStore.updateNodeState();
    this.props.accountStore.updateAccountState();
  }

  _onNodeUrlChange(selectedNode) {
    logger.info("Node change", selectedNode);
    this.props.nodeStore.changeNode(selectedNode);
    this._onRefresh();
  }

  _onAddressChange(selectedAddress) {
    logger.info("Account address change to", selectedAddress);
    this.props.accountStore.changeAccount(selectedAddress);
    this._onRefresh();
  }

  _onAddressCopy(accountAddress) {
    runWithCallback.call(this, () => {
      logger.debug("Copy address", accountAddress);
      clipboardy.writeSync(accountAddress);
    }, this._onError);
  }

  _onFileChange(selectedFile) {
    runWithCallback.call(this, () => {
      logger.debug("Compiled file change", selectedFile);
      this.props.deployTargetStore.changeTarget(selectedFile);
    }, this._onError);
  }

  _compile() {
    runWithCallback.call(this, () => {
      const baseDir = editor.getProjectRootDir();
      const target = editor.getCurrentByRelative();
      this.props.deployTargetStore.addTarget(baseDir, target);
    }, this._onError);
  }

  _onDeployButtonClicked(argInputRef) {
    runWithCallback.call(this, () => {
      logger.debug("Deploy contract");
      logger.debug("Input ref", argInputRef);
      let constructorArgs = [];
      let amount = "0";
      if (argInputRef.current) {
        constructorArgs = argInputRef.current.values;
        amount = argInputRef.current.amount;
      }
      this.props.contractStore.deployContract(constructorArgs, amount);
    }, this._onError);
  }

  _onContractImport(contractInputRef) {
    logger.debug("Import contract button clicked");
    const contract = contractInputRef.current.value;
    this.props.contractStore.addContract(contract);
  }

  _onContractCopy(contractAddress) {
    runWithCallback.call(this, () => {
      logger.debug("Copy contract", contractAddress);
      clipboardy.writeSync(contractAddress);
    }, this._onError);
  }

  _onContractRemove(contractAddress) {
    runWithCallback.call(this, () => {
      logger.debug("Remove contract", contractAddress);
      this.props.contractStore.removeContract(contractAddress);
    }, this._onError);
  }

  _onAbiExec(contractAddress, abi, targetFunction, argInputRef) {
    runWithCallback.call(this, () => {
      logger.debug("Execute contract");
      logger.debug("Input ref", argInputRef);
      const targetArgs = argInputRef.current.values;
      const amount = argInputRef.current.amount;
      logger.info("Execute contract", targetFunction, "with args", targetArgs);
      this.props.contractStore.executeContract(contractAddress, abi, targetFunction, targetArgs, amount);
    }, this._onError);
  }

  _onAbiQuery(contractAddress, abi, targetFunction, argInputRef) {
    runWithCallback.call(this, () => {
      logger.debug("Query contract");
      logger.debug("Input ref", argInputRef);
      const targetArgs = argInputRef.current.values;
      logger.info("Query contract", targetFunction, "with args", targetArgs);
      this.props.contractStore.queryContract(contractAddress, abi, targetFunction, targetArgs);
    }, this._onError);
  }

  _onError(error) {
    logger.error(error);
    this.props.notificationStore.notify(error, "error");
  }

  render() {
    // summary
    const node = this.props.nodeStore.currentNode;
    const address = this.props.accountStore.currentAddress;
    const height = this.props.nodeStore.currentHeight;
    const balanceWithUnit = this.props.accountStore.currentBalanceWithUnit;
    const nonce = this.props.accountStore.currentNonce;

    // sync
    const onCompile = this._onCompileButtonClicked;
    const onRefresh= this._onRefresh

    // node
    // const node = this.props.nodeStore.currentNode;
    const nodes = this.props.nodeStore.nodes;
    // const height = this.props.nodeStore.currentHeight;
    const onNodeChange = this._onNodeUrlChange;

    // address
    // const accountAddress = this.props.accountStore.currentAddress;
    const addresses = this.props.accountStore.addresses;
    const onAddressChange = this._onAddressChange;
    const onAddressCopy = this._onAddressCopy;
    const balance = this.props.accountStore.currentBalance;
    // const nonce = this.props.accountStore.currentNonce;

    // deployment target
    const currentTarget = this.props.deployTargetStore.currentTarget;
    const targets = this.props.deployTargetStore.targets;
    const onTargetChange = this._onFileChange;
    const onDeploy = this._onDeployButtonClicked;
    const constructorArgs = this.props.deployTargetStore.constructorArgs;
    const payable = this.props.deployTargetStore.isPayable;

    // contract
    const onContractImport = this._onContractImport
    const onContractCopy = this._onContractCopy
    const onContractRemove = this._onContractRemove
    const contractAddress2Abi = this.props.contractStore.contractAddress2Abi;
    const onAbiExec = this._onAbiExec;
    const onAbiQuery = this._onAbiQuery;

    return (
      <Panel>
        <Summary
          node={node}
          address={address}
          height={height}
          balanceWithUnit={balanceWithUnit}
          nonce={nonce}
        />
        <TopBar
          onCompile={onCompile}
          onRefresh={onRefresh}
        />
        <Node
          node={node}
          nodes={nodes}
          height={height}
          onNodeChange={onNodeChange}
        />
        <Account
          address={address}
          addresses={addresses}
          onAddressChange={onAddressChange}
          onAddressCopy={onAddressCopy}
          balance={balance}
          nonce={nonce}
        />
        <Deployment
          currentTarget={currentTarget}
          targets={targets}
          onTargetChange={onTargetChange}
          constructorArgs={constructorArgs}
          payable={payable}
          onDeploy={onDeploy}
        />
        <Contract
          onContractImport={onContractImport}
          onContractCopy={onContractCopy}
          onContractRemove={onContractRemove}
          contractAddress2Abi={contractAddress2Abi}
          onAbiExec={onAbiExec}
          onAbiQuery={onAbiQuery}
        />
     </Panel>
    );
  }

}
