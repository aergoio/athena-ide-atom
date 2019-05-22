import AccountService from './account-service';
import CompileService from './compile-service';
import ContractService from './contract-service';
import NodeService from './node-service';

import { isUndefined } from '../utils';

export class ServiceProvider {

  constructor() {
    this.endpoint = "";
  }

  get client() {
    if (isUndefined(this._client)) {
      let { AthenaClient } = require('@aergo/athena-client');
      this._client = new AthenaClient();
    }
    return this._client;
  }

  get accountService() {
    if (isUndefined(this._accountService)) {
      this._accountService = new AccountService(this.client);
    }
    return this._accountService;
  }

  get compileService() {
    if (isUndefined(this._compileService)) {
      this._compileService = new CompileService();
    }
    return this._compileService;
  }

  get contractService() {
    if (isUndefined(this._contractService)) {
      this._contractService = new ContractService(this.client);
    }
    return this._contractService;
  }

  get nodeService() {
    if (isUndefined(this._nodeService)) {
      this._nodeService = new NodeService(this.client);
    }
    return this._nodeService;
  }

  setEndpoint(endpoint) {
    if (this.endpoint !== endpoint) {
      this.endpoint = endpoint;
      if ("" === endpoint) {
        this.client.use("unknown");
      } else {
        this.client.use(endpoint);
      }
    }
  }

}

export default new ServiceProvider();
