'use babel';

import {AergoClient, GrpcProvider} from '@herajs/client';
import {EventType} from '../event';
import logger from '../logger';

export default class NodeService {

  constructor(eventDispatcher) {
    this.eventDispatcher = eventDispatcher;
    this.client = new AergoClient();
  }

  newNode(newNodeUrl) {
    logger.debug("new node");
    logger.debug(newNodeUrl);
    this.client.setProvider(this._getProviderWithUrl(newNodeUrl));
    return this._getNodeState(newNodeUrl).then((node => {
      this.eventDispatcher.dispatch(EventType.NewNode, node);
      this.eventDispatcher.dispatch(EventType.AppendLog, node);
      return node;
    }));
  }

  changeNode(nodeUrl) {
    logger.debug("change node to");
    logger.debug(nodeUrl);
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
      logger.debug("quried node state");
      logger.debug(nodeStatus);
      return { url: url, height: nodeStatus.bestHeight };
    }).catch((err) => {
      logger.debug("quried node state err");
      logger.debug(err);
      return { url: url, height: "unknown" };
    });
  }

  getClient() {
    return this.client;
  }

}

