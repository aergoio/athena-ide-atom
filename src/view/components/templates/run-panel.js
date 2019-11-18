import React from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import clipboardy from 'clipboardy';
import logger from 'loglevel';

import { Panel } from '../atoms';
import { Account, Node, Deployment, ContractImport } from '../organisms';
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

    this._onSync = this._onSync.bind(this);
    this._onNodeUrlChange = this._onNodeUrlChange.bind(this);

    this._onAddressChange = this._onAddressChange.bind(this);
    this._onAddressCopy = this._onAddressCopy.bind(this);

    this._onDeployTargetChange = this._onDeployTargetChange.bind(this);
    this._onRedeployTargetChange = this._onRedeployTargetChange.bind(this);
    this._onCompile = this._onCompile.bind(this);
    this._onDeploy = this._onDeploy.bind(this);

    this._onContractImport = this._onContractImport.bind(this);
    this._onContractCopy = this._onContractCopy.bind(this);
    this._onContractRemove = this._onContractRemove.bind(this);

    this._onAbiExec = this._onAbiExec.bind(this);
    this._onAbiQuery = this._onAbiQuery.bind(this);

    this._onError = this._onError.bind(this);
  }


  _onSync() {
    logger.info("Sync status");
    this.props.nodeStore.updateNodeState();
    this.props.accountStore.updateAccountState();
  }

  _onNodeUrlChange(selectedNode) {
    logger.info("Node change", selectedNode);
    this.props.nodeStore.changeNode(selectedNode);
    this._onSync();
  }


  _onAddressChange(selectedAddress) {
    logger.info("Account address change to", selectedAddress);
    this.props.accountStore.changeAccount(selectedAddress);
    this._onSync();
  }

  _onAddressCopy(accountAddress) {
    runWithCallback.call(this, () => {
      logger.debug("Copy address", accountAddress);
      clipboardy.writeSync(accountAddress);
    }, this._onError);
  }


  _onDeployTargetChange(selectedFile) {
    runWithCallback.call(this, () => {
      logger.debug("Compiled deploy target", selectedFile);
      this.props.deployTargetStore.changeTarget(selectedFile);
    }, this._onError);
  }

  _onRedeployTargetChange(selectedContract) {
    runWithCallback.call(this, () => {
      logger.debug("Change redeploy target", selectedContract);
      this.props.deployTargetStore.changeContract(selectedContract);
    }, this._onError);
  }

  _onCompile() {
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
      const baseDir = editor.getProjectRootDir();
      const target = editor.getCurrentByRelative();
      this.props.deployTargetStore.addTarget(baseDir, target);
    }, this._onError);
  }

  _onDeploy(inputsRef) {
    runWithCallback.call(this, () => {
      logger.debug("Deploy contract");
      logger.debug("Input ref", inputsRef);
      let constructorArgs = [];
      let gasLimit = undefined;
      let amount = "0";
      if (inputsRef.current) {
        constructorArgs = inputsRef.current.values;
        gasLimit = inputsRef.current.gasLimit;
        amount = inputsRef.current.amount;
      }
      this.props.contractStore.deployContract(constructorArgs, gasLimit, amount);
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


  _onAbiExec(contractAddress, targetFunction, inputsRef) {
    runWithCallback.call(this, () => {
      logger.debug("Execute contract");
      logger.debug("Input ref", inputsRef);
      const targetArgs = inputsRef.current.values;
      const gasLimit = inputsRef.current.gasLimit;
      const amount = inputsRef.current.amount;
      const feeDelegation = inputsRef.current.feeDelegation;
      this.props.contractStore.executeContract(contractAddress, targetFunction,
          targetArgs, gasLimit, amount, feeDelegation);
    }, this._onError);
  }

  _onAbiQuery(contractAddress, targetFunction, inputRefs) {
    runWithCallback.call(this, () => {
      logger.debug("Query contract");
      logger.debug("Input ref", inputRefs);
      const targetArgs = inputRefs.current.values;
      this.props.contractStore.queryContract(contractAddress, targetFunction, targetArgs);
    }, this._onError);
  }


  _onError(error) {
    logger.error(error);
    this.props.notificationStore.notify(error, "error");
  }


  render() {
    // node
    const onSync= this._onSync
    const node = this.props.nodeStore.currentNode;
    const nodes = this.props.nodeStore.nodes;
    const height = this.props.nodeStore.currentHeight;
    const gasPrice = this.props.nodeStore.gasPrice;
    const onNodeChange = this._onNodeUrlChange;

    // account
    const address = this.props.accountStore.currentAddress;
    const addresses = this.props.accountStore.addresses;
    const onAddressChange = this._onAddressChange;
    const onAddressCopy = this._onAddressCopy;
    const balance = this.props.accountStore.currentBalance;
    const nonce = this.props.accountStore.currentNonce;

    // deployment target
    const currentTarget = this.props.deployTargetStore.currentTarget;
    const targets = this.props.deployTargetStore.targets;
    const onDeployTargetChange = this._onDeployTargetChange;
    const constructorArgs = this.props.deployTargetStore.constructorArgs;
    const payable = this.props.deployTargetStore.isPayable;
    const currentContract = this.props.deployTargetStore.currentContract;
    const contracts = this.props.contractStore.contractAddresses;
    const onRedeployTargetChange = this._onRedeployTargetChange;
    const onCompile = this._onCompile;
    const onDeploy = this._onDeploy;

    // contract
    const onContractImport = this._onContractImport
    const onContractCopy = this._onContractCopy
    const onContractRemove = this._onContractRemove
    const contractAddress2Abi = this.props.contractStore.contractAddress2Abi;
    const onAbiExec = this._onAbiExec;
    const onAbiQuery = this._onAbiQuery;

    return (
      <Panel>
        <Node
          onSync={onSync}
          node={node}
          nodes={nodes}
          height={height}
          gasPrice={gasPrice}
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
          onDeployTargetChange={onDeployTargetChange}
          constructorArgs={constructorArgs}
          payable={payable}
          currentContract={currentContract}
          contracts={contracts}
          onRedeployTargetChange={onRedeployTargetChange}
          onCompile={onCompile}
          onDeploy={onDeploy}
        />
        <ContractImport
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
