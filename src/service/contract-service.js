import logger from 'loglevel';

import { assertNotEmpty } from '../utils';

export default class ContractService {

  constructor(client) {
    this.client = client;
  }

  async getABI(contractAddress) {
    assertNotEmpty(contractAddress, "Contract address is empty");
    return await this.client.getABI(contractAddress);
  }

  async deploy(account, deployInfo, fee, amount) {
    assertNotEmpty(account, "Selected account is empty");
    assertNotEmpty(deployInfo, "Deploy info is empty");
    assertNotEmpty(fee, "Contract deploy fee is empty");
    assertNotEmpty(amount, "Contract deploy amount is empty");

    logger.debug("Deploy with", account.address, deployInfo, fee, amount);
    const deployResult = await this.client.deploy(account, deployInfo, fee, amount);

    return { contractAddress: deployResult.contractAddress, abi: deployResult.abi, txHash: deployResult.txHash };
  }

  async execute(account, invocationInfo, fee, amount) {
    assertNotEmpty(account, "Selected account is empty");
    assertNotEmpty(invocationInfo, "Invocation info is empty");
    assertNotEmpty(fee, "Contract deploy fee is empty");
    assertNotEmpty(amount, "Contract deploy amount is empty");

    logger.debug("Execution with", account.address, invocationInfo, fee, amount);
    const executeResult = await this.client.execute(account, invocationInfo, fee, amount);

    return { txHash: executeResult.txHash, result: executeResult.result, status: executeResult.status };
  }

  async query(invocationInfo) {
    assertNotEmpty(invocationInfo, "Invocation info is empty");

    logger.debug("Query with", invocationInfo);
    const result = await this.client.query(invocationInfo);
    return JSON.stringify(result);
  }

}
