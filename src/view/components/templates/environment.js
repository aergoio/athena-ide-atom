import React from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import logger from 'loglevel';

import { Summary, Sync, Account, Node } from '../organisms';

@inject('accountStore', 'nodeStore')
@observer
export default class Enviroment extends React.Component {

  static get propTypes() {
    return {
      accountStore: PropTypes.any,
      nodeStore: PropTypes.any
    };
  }

  constructor(props) {
    super(props);

    this._onSync = this._onSync.bind(this);
    this._onNodeUrlChange = this._onNodeUrlChange.bind(this);
    this._onAddressChange = this._onAddressChange.bind(this);
  }

  _onSync() {
    logger.info("Sync status");
    this.props.nodeStore.updateNodeState();
    this.props.accountStore.updateAccountState();
  }

  _onNodeUrlChange(selectedNode) {
    logger.info("Node change", selectedNode.value);
    this.props.nodeStore.changeNode(selectedNode.value);
    this._onSync();
  }

  _onAddressChange(selectedAddress) {
    logger.info("Account address change to", selectedAddress.value);
    this.props.accountStore.changeAccount(selectedAddress.value);
    this._onSync();
  }

  render() {
    // summary
    const node = this.props.nodeStore.currentNode;
    const address = this.props.accountStore.currentAddress;
    const height = this.props.nodeStore.currentHeight;
    const balanceWithUnit = this.props.accountStore.currentBalanceWithUnit;
    const nonce = this.props.accountStore.currentNonce;

    // sync
    const onSync= this._onSync

    // node
    // const node = this.props.nodeStore.currentNode;
    const nodes = this.props.nodeStore.nodes;
    // const height = this.props.nodeStore.currentHeight;
    const onNodeChange = this._onNodeUrlChange;

    // address
    // const accountAddress = this.props.accountStore.currentAddress;
    const addresses = this.props.accountStore.addresses;
    const onAddressChange = this._onAddressChange;
    const balance = this.props.accountStore.currentBalance;
    // const nonce = this.props.accountStore.currentNonce;

    return (
      <div>
        <Summary
          node={node}
          address={address}
          height={height}
          balanceWithUnit={balanceWithUnit}
          nonce={nonce}
        />
        <Sync
          onSync={onSync}
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
          balance={balance}
          nonce={nonce}
        />
      </div>
    );
  }

}