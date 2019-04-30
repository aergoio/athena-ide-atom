import React from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import logger from 'loglevel';

import { Account, Node } from '../organisms';

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

    this._onSyncNodeStatus = this._onSyncNodeStatus.bind(this);
    this._onNodeUrlChange = this._onNodeUrlChange.bind(this);

    this._onSyncAddressStatus = this._onSyncAddressStatus.bind(this);
    this._onAddressChange = this._onAddressChange.bind(this);
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

  render() {
    // node
    const onSyncNode= this._onSyncNodeStatus;
    const currentNode = this.props.nodeStore.currentNode;
    const nodes = this.props.nodeStore.nodes;
    const height = this.props.nodeStore.currentHeight;
    const onNodeChange = this._onNodeUrlChange;

    // address
    const onSyncAccount= this._onSyncAddressStatus;
    const currentAddress = this.props.accountStore.currentAddress;
    const addresses = this.props.accountStore.addresses;
    const onAddressChange = this._onAddressChange;
    const balance = this.props.accountStore.currentBalance;
    const nonce = this.props.accountStore.currentNonce;

    return (
      <div>
        <Node
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
      </div>
    );
  }

}