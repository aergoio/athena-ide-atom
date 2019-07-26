import logger from 'loglevel';

import { assertNotEmpty } from '../utils';

export default class ContractService {

  constructor(client) {
    this.client = client;
  }

  async getContractInterface(contractAddress) {
    assertNotEmpty(contractAddress, "Contract address is empty");
    return await this.client.getContractInterface(contractAddress);
  }

  async deploy(account, deployment, fee) {
    assertNotEmpty(account, "Selected account is empty");
    assertNotEmpty(deployment, "Deployment is empty");
    assertNotEmpty(deployment.payload, "Deploy target is empty");
    assertNotEmpty(fee, "Contract deploy fee is empty");

    logger.debug("Deploy with", account.address, deployment, fee);
    const deployResult = await this.client.deploy(account, deployment, fee);

    return deployResult;
  }

  async execute(account, invocation, fee) {
    assertNotEmpty(account, "Selected account is empty");
    assertNotEmpty(invocation, "Invocation is empty");
    assertNotEmpty(fee, "Contract deploy fee is empty");

    logger.debug("Execution with", account.address, invocation, fee);
    const executeResult = await this.client.execute(account, invocation, fee);

    return executeResult;
  }

  async query(query) {
    assertNotEmpty(query, "Invocation info is empty");

    logger.debug("Query with", query);
    const result = await this.client.query(query);
    return JSON.stringify(result);
  }

}
