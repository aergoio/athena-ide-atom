'use babel';

import React from 'react';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import logger from 'loglevel';

import {
  Panel, ComponentsHolder, Row,
  Button, Title, Description, SelectBox, TextBox, SyncIcon, InputBox
} from '../components';

import {NewNodeModal, RemoveNodeModal, NewAccountModal, ImportAccountModal, ExportAccountModal} from '../modal';

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
    const node = this.props.nodeStore.currentNode;
    const nodes = this.props.nodeStore.nodes;
    const height = this.props.nodeStore.currentHeight;
    logger.debug("node", node, "nodes", nodes, "height", height);

    // address
    const address = this.props.accountStore.currentAddress;
    const addresses = this.props.accountStore.addresses;
    const balance = this.props.accountStore.currentBalance;
    const nonce = this.props.accountStore.currentNonce;

    // target
    const currentFile = this.props.compileResultStore.currentFile;
    const files = this.props.compileResultStore.files;

    // contract
    const currentContract = this.props.contractStore.currentContract;
    const contracts = this.props.contractStore.contracts;
    const currentAbi = this.props.contractStore.currentAbi;

    return (
      <Panel>
        <ComponentsHolder>
          <EnviromentTitle onClick={this._onSyncNodeStatus} />
          <NodeSelect node={node} nodes={nodes} onChange={this._onNodeUrlChange} />
          <NodeHeight height={height} />
          <NodeManipulateButtons />
        </ComponentsHolder>
        <ComponentsHolder>
          <AccountTitle onClick={this._onSyncAddressStatus} />
          <AddressSelect address={address} addresses={addresses} onChange={this._onAddressChange} />
          <Balance balance={balance} />
          <Nonce nonce={nonce} />
          <AccountManipulateButtons />
        </ComponentsHolder>
        <ComponentsHolder>
          <DeployTitle />
          <DeploySelectAndRun
            file={currentFile}
            files={files}
            onClick={this._onDeployButtonClicked}
            onChange={this._onCompiledFileChange}
          />
        </ComponentsHolder>
        <ComponentsHolder>
          <RunContractTitle />
          <AbiSelect contract={currentContract} contracts={contracts} onChange={this._onContractAddressChange} />
          <Abis abi={currentAbi} onClick={this._onContractFunctionClicked} />
        </ComponentsHolder>
      </Panel>
    );
  }

}

const EnviromentTitle = (props) => {
  return (
    <Row>
      <Title title='Enviroment'/>
      <SyncIcon onClick={props.onClick} />
    </Row>
  );
}

EnviromentTitle.propTypes = {
  onClick: PropTypes.func
}

const NodeSelect = (props) => {
  return (
    <Row>
      <Description description='Node' />
      <SelectBox
        value={props.node}
        options={props.nodes}
        onChange={props.onChange}
      />
    </Row>
  );
}

NodeSelect.propTypes = {
  node: PropTypes.string,
  nodes: PropTypes.array,
  onChange: PropTypes.func
}

const NodeHeight = (props) => {
  return (
    <Row>
      <Description description='Height' />
      <TextBox class='component-textbox-number' text={props.height} />
    </Row>
  );
}

NodeHeight.propTypes = {
  height: PropTypes.string
}

const NodeManipulateButtons = () => {
  return (
    <Row class='components-row-button'>
      <NewNodeModal trigger={<Button name='New' />} />
      <RemoveNodeModal trigger={<Button name='Remove' />} />
    </Row>
  );
}

const AccountTitle = (props) => {
  return (
    <Row>
      <Title title='Account'/>
      <SyncIcon onClick={props.onClick} />
    </Row>
  );
}

AccountTitle.propTypes = {
  onClick: PropTypes.func
}

const AddressSelect = (props) => {
  return (
    <Row>
      <Description description='Address' />
      <SelectBox
        value={props.address}
        options={props.addresses}
        onChange={props.onChange}
      />
    </Row>
  );
};

AddressSelect.propTypes = {
  address : PropTypes.string,
  addresses : PropTypes.array,
  onChange: PropTypes.func
}

const Balance = (props) => {
  return (
    <Row>
      <Description description='Balance' />
      <TextBox class='component-textbox-number' text={props.balance} />
    </Row>
  );
};

Balance.propTypes = {
  balance: PropTypes.string
}

const Nonce = (props) => {
  return (
    <Row>
      <Description description='Nonce' />
      <TextBox class='component-textbox-number' text={props.nonce} />
    </Row>
  );
};

Nonce.propTypes = {
  nonce: PropTypes.string
}

const AccountManipulateButtons = () => {
  return (
    <Row class='components-row-button'>
      <NewAccountModal trigger={<Button name='New' />} />
      <ImportAccountModal trigger={<Button name='Import' />} />
      <ExportAccountModal trigger={<Button name='Export' />} />
    </Row>
  );
}

const FeeTitle = () => {
  return (
    <Row>
      <Title title='Fee'/>
    </Row>
  );
}

const PriceInput = (props) => {
  return (
    <Row>
      <Description description='Price' />
      <InputBox type='number' class='component-inputbox-number' placeHolder='eg. 10000 (unit : Aer)'
          onChange={props.onChange} value={props.price}
      />
    </Row>
  );
}

PriceInput.propTypes = {
  price: PropTypes.string,
  onChange: PropTypes.func
}

const LimitInput = (props) => {
  return (
    <Row>
      <Description description='Limit' />
      <InputBox type='number' class='component-inputbox-number' placeHolder='eg. 10'
          onChange={props.onChange} value={props.limit}
      />
    </Row>
  );
}

LimitInput.propTypes = {
  limit: PropTypes.string,
  onChange: PropTypes.func
}

const DeployTitle = () => {
  return (
    <Row>
      <Title title='Deploy'/>
    </Row>
  );
}

const DeploySelectAndRun = (props) => {
  return (
    <Row>
      <Button
        name='Deploy'
        class={['component-btn-runner', 'component-description', 'component-btn-deploy']}
        onClick={props.onClick}
      />
      <SelectBox
        value={props.file}
        options={props.files}
        onChange={props.onChange}
      />
    </Row>
  );
}

DeploySelectAndRun.propTypes = {
  file: PropTypes.string,
  files: PropTypes.array,
  onClick: PropTypes.func,
  onChange: PropTypes.func
}

const RunContractTitle = () => {
  return (
    <Row>
      <Title title='Execute / Query' />
    </Row>
  );
}

const AbiSelect = (props) => {
  return (
    <Row>
      <Description description='ABI' />
      <SelectBox
        value={props.contract}
        options={props.contracts}
        onChange={props.onChange}
      />
    </Row>
  );
}

AbiSelect.propTypes = {
  contract: PropTypes.string,
  contracts: PropTypes.array,
  onChange: PropTypes.func
}

const Abis = (props) => {
  const abiFunctions = props.abi.functions;
  if (typeof abiFunctions === "undefined") {
    return <div></div>;
  }
  return props.abi.functions.filter(f => "constructor" !== f.name)
    .map((abiFunction, index) => {
      const argsRef = React.createRef();
      const args = abiFunction.arguments;
      const inputPlaceHolder = args.length === 0 ? "No argument" : args.map(a => a.name).join(", ");
      return (
        <Row key={index} >
          <Button
            name={abiFunction.name}
            class={['component-btn-runner', 'component-description', 'component-btn-execute']}
            onClick={() => props.onClick(argsRef, abiFunction.name)}
          />
          <InputBox type='text' class='component-inputbox-text'
            ref={argsRef}
            placeHolder={inputPlaceHolder}
          />
        </Row>
      );
    }
  );
}

Abis.propTypes = {
  abi: PropTypes.object,
  trigger: PropTypes.element,
  onClick: PropTypes.func
}