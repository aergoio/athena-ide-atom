'use babel';

import React from 'react';
import PropTypes from 'prop-types';
import logger from 'loglevel';

import {Button, Title, Description, SelectBox, TextBox, SyncIcon, InputBox} from '../component';

import NewAccountButton from './new-account-button';
import ImportAccountButton from './import-account-button';
import ExportAccountButton from './export-account-button';

export default class RunPanel extends React.Component {

  static get propTypes() {
    return {
      context: PropTypes.any,
      value: PropTypes.string,
      options: PropTypes.array,
      onChange: PropTypes.func
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      context: props.context,
      price: "",
      limit: ""
    };
  }

  _parseCurrentNodeUrl() {
    return this.state.context.current.node.url;
  }

  _parseNodeUrls() {
    return Array.from(this.state.context.store.nodeUrls.keys());
  }

  _parseNodeHeight() {
    return this.state.context.current.node.height;
  }

  _parseAddress() {
    return this.state.context.current.account.accountAddress;
  }

  _parseBalance() {
    return this.state.context.current.account.balance;
  }

  _parseNonce() {
    return this.state.context.current.account.nonce;
  }

  _parseAddresses() {
    return Array.from(this.state.context.store.addresses.keys());
  }

  _parseCurrentFile() {
    return this.state.context.current.file;
  }

  _parseFiles() {
    return Array.from(this.state.context.store.file2CompiledResult.keys());
  }

  _syncNodeStatus() {
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
      this._updateAccountStatus(accountAddress);
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
    if ("" !== accountAddress) {
      logger.debug("Update account status", accountAddress);
      this.state.context.services.accountService.changeAccount(accountAddress)
    }
  }

  _onDeployButtonClicked() {
    const accountAddress = this.state.context.current.account.accountAddress;
    const price = this.state.price;
    const limit = this.state.limit;
    const currentFile = this.state.context.current.file;
    const contractPayload = this.state.context.store.file2CompiledResult.get(currentFile).payload;
    logger.debug("Deploy button clicked with", price, limit, currentFile, contractPayload);
    this.state.context.services.contractService.deploy(accountAddress, price, limit, contractPayload);
  }

  _onCompiledFileChange(selectedOption) {
    logger.debug("Compiled file change", selectedOption);
    this.state.context.services.compileService.changeCompiledTarget(selectedOption.value);
  }

  render() {
    return (
      <div className='athena-ide-tab-panel'>

        <div className='inset-panel components-holder'>
          <div className='components-row'>
            <Title title='Enviroment' />
            <SyncIcon context={this.props.context} onClick={() => this._syncNodeStatus()} />
          </div>
          <div className='components-row'>
            <Description description='Node' />
            <SelectBox
              value={this._parseCurrentNodeUrl(this.props.context)}
              options={this._parseNodeUrls(this.props.context)}
              onChange={(o) => this._onNodeUrlChange(o)}
              isCreatable
            />
          </div>
          <div className='components-row'>
            <Description description='Height' />
            <TextBox class='component-textbox-number' text={this._parseNodeHeight()} />
          </div>
        </div>

        <div className='inset-panel components-holder'>
          <div className='components-row'>
            <Title title='Account' />
            <SyncIcon context={this.props.context} onClick={() => this._onSyncAddressStatus()} />
          </div>
          <div className='components-row'>
            <Description description='Address' />
            <SelectBox
              value={this._parseAddress()}
              options={this._parseAddresses()}
              onChange={(o) => this._onAddressChange(o)}
            />
          </div>
          <div className='components-row'>
            <Description description='Balance' />
            <TextBox class='component-textbox-number' text={this._parseBalance(this.props.context)} />
          </div>
          <div className='components-row'>
            <Description description='Nonce' />
            <TextBox class='component-textbox-number' text={this._parseNonce(this.props.context)} />
          </div>
          <div className='components-row components-row-button'>
            <NewAccountButton context={this.props.context} />
            <ImportAccountButton context={this.props.context} />
            <ExportAccountButton context={this.props.context} />
          </div>
        </div>

        <div className='inset-panel components-holder'>
          <div className='components-row'>
            <Title title='Fee' />
          </div>
          <div className='components-row'>
            <Description description='Price' />
            <InputBox type='number' class='component-inputbox-number' placeHolder='eg. 10000 (unit : Aer)'
                onChange={(e) => this.setState({ price: e.target.value}) }/>
          </div>
          <div className='components-row'>
            <Description description='Limit' />
            <InputBox type='number' class='component-inputbox-number' placeHolder='eg. 10'
                onChange={(e) => this.setState({ limit: e.target.value}) }/>
          </div>
        </div>

        <div className='inset-panel components-holder'>
          <div className='components-row'>
            <Title title='Deploy' />
          </div>
          <div className='components-row'>
            <Button
              name='Deploy'
              class={['component-btn-runner', 'component-description', 'btn-success']}
              onClick={() => this._onDeployButtonClicked()}
            />
            <SelectBox
              value={this._parseCurrentFile()}
              options={this._parseFiles()}
              onChange={(o) => this._onCompiledFileChange(o)}
            />
          </div>
        </div>

      </div>
    );
  }

}