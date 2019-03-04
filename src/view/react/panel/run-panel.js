'use babel';

import React from 'react';
import PropTypes from 'prop-types';
import logger from 'loglevel';

import {
  Panel, ComponentsHolder, Row,
  Button, Title, Description, SelectBox, TextBox, SyncIcon, InputBox
} from '../components';

import {NewAccountModal, ImportAccountModal, ExportAccountModal} from '../modal';

export default class RunPanel extends React.Component {

  static get propTypes() {
    return {
      context: PropTypes.any
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      context: props.context
    };

    this._onSyncNodeStatus = this._onSyncNodeStatus.bind(this);
    this._onNodeUrlChange = this._onNodeUrlChange.bind(this);

    this._onSyncAddressStatus = this._onSyncAddressStatus.bind(this);
    this._onAddressChange = this._onAddressChange.bind(this);

    this._onPriceChange = this._onPriceChange.bind(this);
    this._onLimitChange = this._onLimitChange.bind(this);

    this._onDeployButtonClicked = this._onDeployButtonClicked.bind(this);
    this._onCompiledFileChange = this._onCompiledFileChange.bind(this);

    this._onContractAddressChange = this._onContractAddressChange.bind(this);
    this._onContractFunctionClicked = this._onContractFunctionClicked.bind(this);
  }

  _onSyncNodeStatus() {
    const nodeUrl = this.state.context.current.node.url;
    logger.debug("Sync node status request with", nodeUrl);
    this._updateNodeAndAccountStatus(nodeUrl);
  }

  _onNodeUrlChange(selectedNodeUrl) {
    logger.debug("Node url change", selectedNodeUrl);
    this._updateNodeAndAccountStatus(selectedNodeUrl.value);
  }

  _updateNodeAndAccountStatus(nodeUrl) {
    logger.debug("Update node status of", nodeUrl);
    this.state.context.services.nodeService.changeNode(nodeUrl).then(() => {
      const accountAddress = this.state.context.current.account.accountAddress;
      if ("" !== accountAddress) {
        this._updateAccountStatus(accountAddress);
      }
    });
  }

  _onSyncAddressStatus() {
    const accountAddress = this.state.context.current.account.accountAddress;
    logger.debug("Sync account status request with", accountAddress);
    this._updateAccountStatus(accountAddress);
  }

  _onAddressChange(selectedAddress) {
    logger.debug("Account address change to", selectedAddress);
    this._updateAccountStatus(selectedAddress.value);
  }

  _updateAccountStatus(accountAddress) {
    logger.debug("Update account status", accountAddress);
    this.state.context.services.accountService.changeAccount(accountAddress)
  }

  _onPriceChange(event) {
    const context = this.state.context;
    context.current.fee.price = event.target.value;
    this.setState(context);
  }

  _onLimitChange(event) {
    const context = this.state.context;
    context.current.fee.limit = event.target.value;
    this.setState(context);
  }

  _onDeployButtonClicked() {
    const accountAddress = this.state.context.current.account.accountAddress;
    const price = this.state.context.current.fee.price;
    const limit = this.state.context.current.fee.limit;
    const currentFile = this.state.context.current.file;
    let contractPayload = null
    if (this.state.context.store.file2CompiledResult.has(currentFile)) {
      contractPayload = this.state.context.store.file2CompiledResult.get(currentFile).payload;
    }
    logger.debug("Deploy button clicked with", price, limit, currentFile, contractPayload);
    this.state.context.services.contractService.deploy(accountAddress, price, limit, contractPayload);
  }

  _onCompiledFileChange(selectedOption) {
    logger.debug("Compiled file change", selectedOption);
    this.state.context.services.compileService.changeCompiledTarget(selectedOption.value);
  }

  _onContractAddressChange(selectedContractAddress) {
    logger.debug("Contract address change to", selectedContractAddress);
    const context = this.state.context;
    context.current.contract.contractAddress = selectedContractAddress.value;
    this.setState(context);
  }

  _onContractFunctionClicked(argInputRef, targetFunction, contractAddress) {
    const context = this.state.context;
    const accountAddress = context.current.account.accountAddress;
    const price = context.current.fee.price;
    const limit = context.current.fee.limit;
    logger.debug("Account:", accountAddress, ", fee:", price, limit);

    logger.debug("Input ref:", argInputRef);
    const targetArgs = argInputRef.current.state.value.split(',').map(arg => arg.trim()).map(arg => {
      const asNumber = Number(arg);
      return Number.isNaN(asNumber) ? arg.replace(/\\"/g, '') : asNumber;
    });
    const abi = context.store.contractAddress2Abi.get(contractAddress);
    logger.debug("Contract function execution clicked with", targetFunction, targetArgs,
                  contractAddress, abi);

    this.state.context.services.contractService.execute(accountAddress, price, limit,
          targetFunction, targetArgs, contractAddress, abi);
  }

  render() {
    return (
      <Panel>
        <ComponentsHolder>
          <EnviromentTitle context={this.props.context} onClick={this._onSyncNodeStatus} />
          <NodeSelect context={this.props.context} onChange={this._onNodeUrlChange} />
          <NodeHeight context={this.props.context} />
        </ComponentsHolder>
        <ComponentsHolder>
          <AccountTitle context={this.props.context} onClick={this._onSyncAddressStatus} />
          <AddressSelect context={this.props.context} onChange={this._onAddressChange} />
          <Balance context={this.props.context} />
          <Nonce context={this.props.context} />
          <AccountManipulateButtons context={this.props.context} />
        </ComponentsHolder>
        <ComponentsHolder>
          <FeeTitle />
          <PriceInput context={this.props.context} onChange={this._onPriceChange} />
          <LimitInput context={this.props.context} onChange={this._onLimitChange} />
        </ComponentsHolder>
        <ComponentsHolder>
          <DeployTitle />
          <DeploySelectAndRun context={this.props.context}
              onClick={this._onDeployButtonClicked}
              onChange={this._onCompiledFileChange} />
        </ComponentsHolder>
        <ComponentsHolder>
          <RunContractTitle />
          <AbiSelect context={this.props.context} onChange={this._onContractAddressChange} />
          <Abis context={this.props.context} onClick={this._onContractFunctionClicked} />
        </ComponentsHolder>
      </Panel>
    );
  }

}

const EnviromentTitle = (props) => {
  return (
    <Row>
      <Title title='Enviroment'/>
      <SyncIcon context={props.context} onClick={props.onClick} />
    </Row>
  );
}

EnviromentTitle.propTypes = {
  context: PropTypes.any,
  onClick: PropTypes.func
}

const NodeSelect = (props) => {
  const option = props.context.current.node.url;
  const options = Array.from(props.context.store.nodeUrls.keys());
  return (
    <Row>
      <Description description='Node' />
      <SelectBox
        value={option}
        options={options}
        onChange={props.onChange}
        isCreatable
      />
    </Row>
  );
}

NodeSelect.propTypes = {
  context: PropTypes.any,
  onChange: PropTypes.func
}

const NodeHeight = (props) => {
  const height = props.context.current.node.height;
  return (
    <Row>
      <Description description='Height' />
      <TextBox class='component-textbox-number' text={height} />
    </Row>
  );
}

NodeHeight.propTypes = {
  context: PropTypes.any
}

const AccountTitle = (props) => {
  return (
    <Row>
      <Title title='Account'/>
      <SyncIcon context={props.context} onClick={props.onClick} />
    </Row>
  );
}

AccountTitle.propTypes = {
  context: PropTypes.any,
  onClick: PropTypes.func
}

const AddressSelect = (props) => {
  const option = props.context.current.account.accountAddress;
  const options = Array.from(props.context.store.addresses.keys());
  return (
    <Row>
      <Description description='Address' />
      <SelectBox
        value={option}
        options={options}
        onChange={props.onChange}
      />
    </Row>
  );
};

AddressSelect.propTypes = {
  context: PropTypes.any,
  onChange: PropTypes.func
}

const Balance = (props) => {
  const balance = props.context.current.account.balance;
  return (
    <Row>
      <Description description='Balance' />
      <TextBox class='component-textbox-number' text={balance} />
    </Row>
  );
};

Balance.propTypes = {
  context: PropTypes.any
}

const Nonce = (props) => {
  const nonce = props.context.current.account.nonce;
  return (
    <Row>
      <Description description='Nonce' />
      <TextBox class='component-textbox-number' text={nonce} />
    </Row>
  );
};

Nonce.propTypes = {
  context: PropTypes.any
}

const AccountManipulateButtons = (props) => {
  const newButton = <Button name='New' />;
  const importButton = <Button name='Import' />;
  const exportButton = <Button name='Export' />;
  return (
    <Row class='components-row-button'>
      <NewAccountModal context={props.context} trigger={newButton} />
      <ImportAccountModal context={props.context} trigger={importButton} />
      <ExportAccountModal context={props.context} trigger={exportButton} />
    </Row>
  );
}

AccountManipulateButtons.propTypes = {
  context: PropTypes.any
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
          onChange={props.onChange} />
    </Row>
  );
}

PriceInput.propTypes = {
  onChange: PropTypes.func
}

const LimitInput = (props) => {
  return (
    <Row>
      <Description description='Limit' />
      <InputBox type='number' class='component-inputbox-number' placeHolder='eg. 10'
          onChange={props.onChange} />
    </Row>
  );
}

LimitInput.propTypes = {
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
  const option = props.context.current.file;
  const options = Array.from(props.context.store.file2CompiledResult.keys());
  return (
    <Row>
      <Button
        name='Deploy'
        class={['component-btn-runner', 'component-description', 'component-btn-deploy']}
        onClick={props.onClick}
      />
      <SelectBox
        value={option}
        options={options}
        onChange={props.onChange}
      />
    </Row>
  );
}

DeploySelectAndRun.propTypes = {
  context: PropTypes.any,
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
  const option = props.context.current.contract.contractAddress;
  const options = Array.from(props.context.store.contractAddress2Abi.keys());
  return (
    <Row>
      <Description description='ABI' />
      <SelectBox
        value={option}
        options={options}
        onChange={props.onChange}
      />
    </Row>
  );
}

AbiSelect.propTypes = {
  context: PropTypes.any,
  onChange: PropTypes.func
}

const Abis = (props) => {
  const context = props.context;
  const contractAddress = context.current.contract.contractAddress;
  if (!context.store.contractAddress2Abi.has(contractAddress)) {
    return <div></div>;
  }

  const abi = context.store.contractAddress2Abi.get(contractAddress);
  logger.debug("Current Abi", abi);
  return abi.functions.map((abiFunction, index) => {
    const argsRef = React.createRef();
    const args = abiFunction.arguments;
    const inputPlaceHolder = args.length === 0 ? "No argument" : args.map(a => a.name).join(", ");
    return (
      <Row key={index} >
        <Button
          name={abiFunction.name}
          class={['component-btn-runner', 'component-description', 'component-btn-execute']}
          onClick={() => props.onClick(argsRef, abiFunction.name, contractAddress)}
        />
        <InputBox type='text' class='component-inputbox-text'
          ref={argsRef}
          placeHolder={inputPlaceHolder}
        />
      </Row>
    );
  });
}

Abis.propTypes = {
  context: PropTypes.any,
  trigger: PropTypes.element,
  onClick: PropTypes.func
}