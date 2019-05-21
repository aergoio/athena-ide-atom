import logger from 'loglevel';

export default class AccountService {

  constructor(client) {
    this.client = client;
  }

  async getAccountState(accountAddress) {
    logger.debug("Get account state of", accountAddress);
    if ("" === accountAddress) {
      return { balance: "unknown", nonce: "unknown" };
    }

    return await this.client.getState(accountAddress).then(queriedState => {
      logger.debug("Quried account state:", queriedState);
      return { balance: queriedState.balance.toUnit("aer").formatNumber(), nonce: queriedState.nonce };
    }).catch(err => {
      logger.debug(err);
      return { balance: "unknown", nonce: "unknown" };
    });
  }

}
