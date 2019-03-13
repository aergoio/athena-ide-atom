'use babel';

import {observable, action, computed} from 'mobx';
import logger from 'loglevel';
import serviceProvider from '../service';
import accountStore from './account-store';

export class NodeStore {

  @observable currentNode = "localhost:7845";
  @observable currentHeight = "unknown";
  @observable nodes = ["localhost:7845", "testnet.aergo.io:7845"];

  @action addNode(node) {
    logger.debug("Add node", node);
    this.nodes.push(node);
    this.changeNode(node);
  }

  @action changeNode(node) {
    logger.debug("Change node", node);
    this.currentNode = node;
    serviceProvider.setEndpoint(node);
    this.updateNodeState();
  }

  @action updateNodeState() {
    logger.debug("Update node state of", this.currentNode);
    if (typeof this.currentNode === "undefined" || "" === this.currentNode) {
      return;
    }

    serviceProvider.nodeService.blockchainStatus().then(status => {
      this.currentHeight = status.height;
    })
    accountStore.updateAccountState(accountStore);
  }


}

export default new NodeStore();