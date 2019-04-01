'use babel';

import logger from 'loglevel';

export default class NodeService {

  constructor(client) {
    this.client = client;
  }

  async blockchainStatus() {
   return await this.client.blockchain().then(nodeStatus => {
      logger.debug("Quried node state", nodeStatus);
      return { height: nodeStatus.bestHeight, hash: nodeStatus.bestBlockHash };
    }).catch(err => {
      logger.error(err);
      return { height: "unknown", hash: "unknown" };
    });
  }

}