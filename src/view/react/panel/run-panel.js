'use babel';

import React from 'react';
import PropTypes from 'prop-types';

import {Title, Description, SelectBox, TextBox, SyncIcon} from '../component';

import NewAccountButton from './new-account-button';
import ImportAccountButton from './import-account-button';
import ExportAccountButton from './export-account-button';

import logger from '../../../logger';

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
      newAccountVisible: false,
      ImportAccountVisible: false,
      ExportAccountVisible: false
    };
  }

  _parseCurrentNodeUrl(context) {
    return context.current.node.url;
  }

  _parseNodeUrls(context) {
    return Array.from(context.store.nodeUrls.keys());
  }

  _syncNodeStatus() {
    const nodeUrl = this.props.context.current.node.url;
    this.props.context.services.nodeService.changeNode(nodeUrl).then(() => {
      const accountAddress = this.props.context.current.account.accountAddress;
      if ("" !== accountAddress) {
        this.props.context.services.accountService.changeAccount(accountAddress)
      }
    });
  }

  _onNodeUrlChange(selectedNodeUrl) {
    this.props.context.services.nodeService.changeNode(selectedNodeUrl.value).then(() => {
      const accountAddress = this.props.context.current.account.accountAddress;
      this.props.context.services.accountService.changeAccount(accountAddress)
    });
  }

  _parseNodeHeight(context) {
    return context.current.node.height;
  }

  _parseAddress(context) {
    return context.current.account.accountAddress;
  }

  _parseBalance(context) {
    return context.current.account.balance;
  }

  _parseNonce(context) {
    return context.current.account.nonce;
  }

  _parseAddresses(context) {
    return Array.from(context.store.addresses.keys());
  }

  _onSyncAddressStatus() {
    const accountAddress = this.props.context.current.account.accountAddress;
    this.props.context.services.accountService.changeAccount(accountAddress);
  }

  _onAddressChange(selectedAddress) {
    this.props.context.services.accountService.changeAccount(selectedAddress.value);
  }

  _onDeployButtonClicked() {
    logger.debug("deploy contract button clicked");
  }

  _parseCurrentFile(context) {
    return context.current.file;
  }

  _parseFiles(context) {
    return Array.from(context.store.file2CompiledResult.keys());
  }

  _onCompiledFileChange(selectedOption) {
    this.props.context.services.compileService.changeCompiledTarget(selectedOption.value);
  }

  render() {
    return (
      <div className='athena-ide-panel'>

        <div className='inset-panel components-holder'>
          <div className='components-row'>
            <Title title='Enviroment' />
            <SyncIcon context={this.props.context} onClick={this._syncNodeStatus} />
          </div>
          <div className='components-row'>
            <Description description='Node' />
            <SelectBox
              context={this.props.context}
              value={this._parseCurrentNodeUrl(this.props.context)}
              options={this._parseNodeUrls(this.props.context)}
              onChange={this._onNodeUrlChange}
              isCreatable
            />
          </div>
          <div className='components-row'>
            <Description description='Height' />
            <TextBox class='component-textbox-number' text={this._parseNodeHeight(this.props.context)} />
          </div>
        </div>

        <div className='inset-panel components-holder'>
          <div className='components-row'>
            <Title title='Account' />
            <SyncIcon context={this.props.context} onClick={this._onSyncAddressStatus} />
          </div>
          <div className='components-row'>
            <Description description='Address' />
            <SelectBox
              context={this.props.context}
              value={this._parseAddress(this.props.context)}
              options={this._parseAddresses(this.props.context)}
              onChange={this._onAddressChange}
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

      </div>
    );
  }

}