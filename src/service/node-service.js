import logger from 'loglevel';

export default class NodeService {

  constructor(client) {
    this.client = client;
  }

  async blockchainStatus() {
   return await this.client.getBlockchainStatus().then(blockchainStatus => {
      logger.debug("Queried node state", blockchainStatus);
      return { height: blockchainStatus.bestHeight, hash: blockchainStatus.bestBlockHash };
    }).catch(err => {
      logger.error(err);
      return { height: "unknown", hash: "unknown" };
    });
  }

  async gasPrice() {
   return await this.client.getGasPrice().then(price => {
      logger.debug("Queried gas price", price);
      return price;
    }).catch(err => {
      logger.error(err);
      return "unknown";
    });
  }

}
