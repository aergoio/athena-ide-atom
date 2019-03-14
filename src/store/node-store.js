'use babel';

import {observable, action, computed} from 'mobx';
import logger from 'loglevel';
import serviceProvider from '../service';
import accountStore from './account-store';
import consoleStore from './console-store';
import notificationStore from './notification-store';

export class NodeStore {

  @observable currentNode = "localhost:7845";
  @observable currentHeight = "unknown";
  @observable nodeSet = new Set(["localhost:7845", "testnet.aergo.io:7845"]);

  @action addNode(node) {
    logger.debug("Add node", node);
    if (typeof node === "undefined" || "" === node) {
      return;
    }

    this.nodeSet.add(node);
    this.changeNode(node);
  }

  @computed get nodes() {
    return Array.from(this.nodeSet.values());
  }

  @action changeNode(node) {
    const message = "Change node to " + node;
    logger.debug(message);
    consoleStore.log(message, "info");
    this.currentNode = node;
    serviceProvider.setEndpoint(node);
    this.updateNodeState();
  }

  @action updateNodeState() {
    logger.debug("Update node state of", this.currentNode);
    serviceProvider.nodeService.blockchainStatus().then(status => {
      this.currentHeight = status.height;
    })
    accountStore.updateAccountState();
  }

  @action removeNode() {
    logger.debug("Remove node", this.currentNode);
    if (typeof this.currentNode === "undefined" || "" === this.currentNode) {
      return;
    }

    this.nodeSet.delete(this.currentNode);
    this.changeNode("");
  }

}

export default new NodeStore();