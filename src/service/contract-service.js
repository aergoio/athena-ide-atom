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

  async deploy(account, deployment, gasLimit) {
    assertNotEmpty(account, "Selected account is empty");
    assertNotEmpty(deployment, "Deployment is empty");
    assertNotEmpty(deployment.payload, "Deploy target is empty");
    assertNotEmpty(gasLimit, "Contract deploy gas limit is empty");

    logger.debug("Deploy with", account.address, deployment, gasLimit);
    const deployResult = await this.client.deploy(account, deployment, gasLimit);

    return deployResult;
  }

  async redeploy(account, redeployTarget, redeployment, gasLimit) {
    assertNotEmpty(account, "Selected account is empty");
    assertNotEmpty(redeployTarget, "ReDeployment is empty");
    assertNotEmpty(redeployment, "ReDeployment is empty");
    assertNotEmpty(redeployment.payload, "ReDeploy target is empty");
    assertNotEmpty(gasLimit, "Contract redeploy gas limit is empty");

    logger.debug("ReDeploy with", account.address, redeployTarget, redeployment, gasLimit);
    const redeployResult = await this.client.redeploy(account, redeployTarget, redeployment, gasLimit);

    return redeployResult;
  }

  async execute(account, invocation, gasLimit) {
    assertNotEmpty(account, "Selected account is empty");
    assertNotEmpty(invocation, "Invocation is empty");
    assertNotEmpty(gasLimit, "Contract invocation gas limit is empty");

    logger.debug("Execution with", account.address, invocation, gasLimit);
    const executeResult = await this.client.execute(account, invocation, gasLimit);

    return executeResult;
  }

  async query(query) {
    assertNotEmpty(query, "Invocation info is empty");

    logger.debug("Query with", query);
    const result = await this.client.query(query);
    return JSON.stringify(result);
  }

}
