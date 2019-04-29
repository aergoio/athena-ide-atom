import { AergoClient, GrpcProvider } from '@herajs/client';
import logger from 'loglevel';

import AccountService from './account-service';
import CompileService from './compile-service';
import ContractService from './contract-service';
import NodeService from './node-service';

export class ServiceProvider {

  constructor() {
    this.client = new AergoClient();
    this._accountService = new AccountService(this.client);
    this._compileService = new CompileService();
    this._contractService = new ContractService(this.client);
    this._nodeService = new NodeService(this.client);
  }

  get accountService() {
    return this._accountService;
  }

  get compileService() {
    return this._compileService;
  }

  get contractService() {
    return this._contractService;
  }

  get nodeService() {
    return this._nodeService;
  }

  setEndpoint(endpoint) {
    logger.debug("Set endpoint as", endpoint);
    this.client.setProvider(new GrpcProvider({url: endpoint}));
    this.client.chainIdHash = undefined;
  }

}

export default new ServiceProvider();