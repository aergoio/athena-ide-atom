import logger from 'loglevel';

export default class NodeService {

  constructor(client) {
    this.client = client;
  }

  async blockchainStatus() {
   return await this.client.getBlockchainStatus().then(blockchainStatus => {
      logger.debug("Quried node state", blockchainStatus);
      return { height: blockchainStatus.bestHeight, hash: blockchainStatus.bestBlockHash };
    }).catch(err => {
      logger.error(err);
      return { height: "unknown", hash: "unknown" };
    });
  }

}
