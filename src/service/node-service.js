'use babel';

import {AergoClient, GrpcProvider} from '@herajs/client';
import logger from 'loglevel';

import {EventType} from '../event';
import {isEmpty} from './utils';

export default class NodeService {

  constructor(eventDispatcher) {
    this.eventDispatcher = eventDispatcher;
    this.client = new AergoClient();
  }

  newNode(newNodeUrl) {
    logger.debug("New node", newNodeUrl);

    if (isEmpty(newNodeUrl)) {
      const message = "New node is empty";
      this._dispatchError(message);
      return Promise.reject(message);
    }

    this.client.setProvider(this._getProviderWithUrl(newNodeUrl));
    return this._getNodeState(newNodeUrl).then((node => {
      this.eventDispatcher.dispatch(EventType.NewNode, node);
      this.eventDispatcher.dispatch(EventType.Log, { message: node, level: "info" });
      return node;
    }));
  }

  changeNode(nodeUrl) {
    logger.debug("Change node to", nodeUrl);

    if (isEmpty(nodeUrl)) {
      const message = "Selected node is empty";
      this._dispatchError(message);
      return Promise.reject(message);
    }

    this.client.setProvider(this._getProviderWithUrl(nodeUrl));
    return this._getNodeState(nodeUrl).then((node => {
      this.eventDispatcher.dispatch(EventType.ChangeNode, node);
      return node;
    }));
  }

  _getProviderWithUrl(url) {
    return new GrpcProvider({url: url});
  }

  _getNodeState(url) {
    return this.getClient().blockchain().then((nodeStatus) => {
      logger.debug("Quried node state", nodeStatus);
      return { url: url, height: nodeStatus.bestHeight };
    }).catch((err) => {
      logger.debug(err);
      return { url: url, height: "unknown" };
    });
  }

  getClient() {
    return this.client;
  }

  _dispatchError(message) {
    this.eventDispatcher.dispatch(EventType.Log, { message: message, level: "error" });
    this.eventDispatcher.dispatch(EventType.Notify, { message: message, level: "error" });
  }

}

