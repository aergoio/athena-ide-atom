'use babel';

import React from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import logger from 'loglevel';

import { Panel } from '../atoms';
import { Enviroment, Account, Deployment, ContractCall } from '../organisms';

@inject('accountStore', 'nodeStore', 'feeStore', 'compileResultStore', 'contractStore')
@observer
export default class RunPanel extends React.Component {

  static get propTypes() {
    return {
      accountStore: PropTypes.any,
      nodeStore: PropTypes.any,
      feeStore: PropTypes.any,
      compileResultStore: PropTypes.any,
      contractStore: PropTypes.any
    };
  }

  constructor(props) {
    super(props);

    this._onSyncNodeStatus = this._onSyncNodeStatus.bind(this);
    this._onNodeUrlChange = this._onNodeUrlChange.bind(this);

    this._onSyncAddressStatus = this._onSyncAddressStatus.bind(this);
    this._onAddressChange = this._onAddressChange.bind(this);

    this._onDeployButtonClicked = this._onDeployButtonClicked.bind(this);
    this._onCompiledFileChange = this._onCompiledFileChange.bind(this);

    this._onContractAddressChange = this._onContractAddressChange.bind(this);
    this._onContractFunctionClicked = this._onContractFunctionClicked.bind(this);
  }

  _onSyncNodeStatus() {
    logger.info("Sync node status");
    this.props.nodeStore.updateNodeState();
  }

  _onNodeUrlChange(selectedNode) {
    logger.info("Node change", selectedNode.value);
    this.props.nodeStore.changeNode(selectedNode.value);
  }

  _onSyncAddressStatus() {
    logger.info("Sync account state");
    this.props.accountStore.updateAccountState();
  }

  _onAddressChange(selectedAddress) {
    logger.info("Account address change to", selectedAddress.value);
    this.props.accountStore.changeAccount(selectedAddress.value);
  }

  _onDeployButtonClicked() {
    this.props.contractStore.deployContract();
  }

  _onCompiledFileChange(selectedOption) {
    const file = selectedOption.value;
    logger.info("Compiled file change", file);
    this.props.compileResultStore.changeFile(file);
  }

  _onContractAddressChange(selectedContractAddress) {
    const contractAddress = selectedContractAddress.value;
    logger.info("Contract address change to", contractAddress);
    this.props.contractStore.changeContract(contractAddress);
  }

  _onContractFunctionClicked(argInputRef, targetFunction) {
    logger.debug("Input ref:", argInputRef);
    const targetArgs = argInputRef.current.state.value.split(',')
      .map(arg => arg.trim())
      .map(arg => {
      const asNumber = Number(arg);
      return Number.isNaN(asNumber) ? arg.replace(/['"]+/g, '') : asNumber;
    });
    logger.info("Execute contract", targetFunction, "with args", targetArgs);
    this.props.contractStore.executeContract(targetFunction, targetArgs);
  }

  render() {
    // node
    const onSyncNode= this._onSyncNodeStatus;
    const currentNode = this.props.nodeStore.currentNode;
    const nodes = this.props.nodeStore.nodes;
    const height = this.props.nodeStore.currentHeight;
    const onNodeChange = this._onSyncNodeStatus;

    // address
    const onSyncAccount= this._onSyncAddressStatus;
    const currentAddress = this.props.accountStore.currentAddress;
    const addresses = this.props.accountStore.addresses;
    const onAddressChange = this._onAddressChange;
    const balance = this.props.accountStore.currentBalance;
    const nonce = this.props.accountStore.currentNonce;

    // deploy
    const currentFile = this.props.compileResultStore.currentFile;
    const files = this.props.compileResultStore.files;
    const onDeploy = this._onDeployButtonClicked;
    const onChangeTarget = this._onCompiledFileChange;

    // run
    const onContractChange = this._onContractAddressChange;
    const currentContract = this.props.contractStore.currentContract;
    const contracts = this.props.contractStore.contracts;
    const currentAbi = this.props.contractStore.currentAbi;
    const onAbiCall = this._onContractFunctionClicked;

    return (
      <Panel>
        <Enviroment
          onSyncNode={onSyncNode}
          node={currentNode}
          nodes={nodes}
          height={height}
          onNodeChange={onNodeChange}
        />
        <Account
          onSyncAccount={onSyncAccount}
          address={currentAddress}
          addresses={addresses}
          onAddressChange={onAddressChange}
          balance={balance}
          nonce={nonce}
        />
        <Deployment
          currentFile={currentFile}
          files={files}
          onDeploy={onDeploy}
          onChangeTarget={onChangeTarget}
        />
        <ContractCall
          onContractChange={onContractChange}
          currentContract={currentContract}
          contracts={contracts}
          currentAbi={currentAbi}
          onAbiCall={onAbiCall}
        />
      </Panel>
    );
  }

}