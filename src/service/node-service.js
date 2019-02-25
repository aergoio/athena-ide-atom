'use babel';

import {AergoClient, GrpcProvider} from '@herajs/client';
import logger from 'loglevel';
import {EventType} from '../event';

export default class NodeService {

  constructor(eventDispatcher) {
    this.eventDispatcher = eventDispatcher;
    this.client = new AergoClient();
  }

  newNode(newNodeUrl) {
    logger.debug("New node", newNodeUrl);
    this.client.setProvider(this._getProviderWithUrl(newNodeUrl));
    return this._getNodeState(newNodeUrl).then((node => {
      this.eventDispatcher.dispatch(EventType.NewNode, node);
      this.eventDispatcher.dispatch(EventType.AppendLog, node);
      return node;
    }));
  }

  changeNode(nodeUrl) {
    logger.debug("Change node to", nodeUrl);
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

}

