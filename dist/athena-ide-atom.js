'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var atomPackageDeps = require('atom-package-deps');
var logger = _interopDefault(require('loglevel'));
var mobx = require('mobx');
var athenaAnalysis = require('@aergo/athena-analysis');
var fs = _interopDefault(require('fs'));
var athenaCompiler = require('@aergo/athena-compiler');
var path = _interopDefault(require('path'));
var React = _interopDefault(require('react'));
var ReactDOM = _interopDefault(require('react-dom'));
var mobxReact = require('mobx-react');
var clipboardy = _interopDefault(require('clipboardy'));
var Collapsible = _interopDefault(require('react-collapsible'));
var Dropdown = _interopDefault(require('react-dropdown'));
var reflexbox = require('reflexbox');
var Popup = _interopDefault(require('reactjs-popup'));
var atomSpacePenViews = require('atom-space-pen-views');
var atom$1 = require('atom');
var os = _interopDefault(require('os'));
var crypto = _interopDefault(require('crypto'));
var ua = _interopDefault(require('universal-analytics'));

function _initializerDefineProperty(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object.keys(descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object.defineProperty(target, property, desc);
    desc = null;
  }

  return desc;
}

class AutoCompleteService {
  constructor() {
    this.luaAnalyzer = new athenaAnalysis.LuaAnalyzer();
    this.luaSuggester = new athenaAnalysis.LuaSuggester();
  }

  async suggest(source, filePath, prefix, index) {
    logger.debug("Resolve suggestion with", filePath, prefix, index);
    const analysisInfos = await this.luaAnalyzer.analyze(source, filePath);
    return await this.luaSuggester.suggest(analysisInfos, prefix, index);
  }

}

class LintService {
  constructor() {
    this.luaAnalyzer = new athenaAnalysis.LuaAnalyzer();
    this.luaLinter = new athenaAnalysis.LuaLinter();
  }

  async lint(source, filePath) {
    logger.debug("Resolve lint with", filePath);
    const analysisInfos = await this.luaAnalyzer.analyze(source, filePath);
    return await this.luaLinter.lint(analysisInfos);
  }

}

class AccountService {
  constructor(client) {
    this.client = client;
  }

  async getAccountState(accountAddress) {
    logger.debug("Get account state of", accountAddress);

    if ("" === accountAddress) {
      return {
        balance: "unknown",
        nonce: "unknown"
      };
    }

    return await this.client.getState(accountAddress).then(queriedState => {
      logger.debug("Quried account state:", queriedState);
      return {
        balance: queriedState.balance.toUnit("aer").formatNumber(),
        nonce: queriedState.nonce
      };
    })["catch"](err => {
      logger.debug(err);
      return {
        balance: "unknown",
        nonce: "unknown"
      };
    });
  }

}

class CompileService {
  constructor() {
    this.compiler = new athenaCompiler.CompilerFactory().create(athenaCompiler.CompilerType.Lua);
  }

  async compile(absolutePath) {
    logger.debug("Compile with", absolutePath);
    const source = fs.readFileSync(absolutePath, "utf8");
    const compileResult = await this.compiler.compile(source, absolutePath);
    return {
      payload: compileResult.payload,
      abi: JSON.stringify(compileResult.abi, null, 2)
    };
  }

}

function join() {
  return Array.from(arguments).reduce((acc, val) => acc.concat(val), []).join(' ');
}
function formatInteger(num) {
  if (Number.isNaN(num)) {
    throw num + " is not an number";
  }

  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}
const isEmpty = o => {
  if (typeof o === 'undefined' || null == o) {
    return true;
  }

  if (typeof o === 'string' && "" === o) {
    return true;
  }

  return false;
};
const assertNotEmpty = (o, message) => {
  if (isEmpty(o)) {
    throw new Error(typeof message === "undefined" ? o + " should not empty" : message);
  }
};
function runWithCallback(invoke, onError) {
  try {
    return invoke();
  } catch (err) {
    onError(err);
  }
}
let Amount = undefined;

const loadAmount = () => {
  if (typeof Amount === "undefined") {
    Amount = require('@aergo/athena-client').Amount;
  }

  return Amount;
};

let units = undefined;
function formatAergoBalance(balance) {
  let Amount = loadAmount();

  if (isUndefined(units)) {
    units = [new Amount("1", "aergo"), new Amount("1", "gaer"), new Amount("1", "aer")];
  }

  const amount = new Amount(balance, "aer");
  let unit = "aergo";

  for (let i = 0; i < units.length; ++i) {
    if (units[i].compare(amount) === -1) {
      unit = units[i].unit;
      break;
    }
  }

  return amount.toUnit(unit).toString();
}
function convertToAerAmountWithUnit(amount, unit) {
  let Amount = loadAmount();
  return new Amount(amount, unit).toUnit("aer").formatNumber();
}
function isUndefined(o) {
  return null == o || typeof o === "undefined";
}

class ContractService {
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
    assertNotEmpty(deployInfo.payload, "Deploy target is empty");
    assertNotEmpty(fee, "Contract deploy fee is empty");
    assertNotEmpty(amount, "Contract deploy amount is empty");
    logger.debug("Deploy with", account.address, deployInfo, fee, amount);
    const deployResult = await this.client.deploy(account, deployInfo, fee, amount);
    return {
      contractAddress: deployResult.contractAddress,
      abi: deployResult.abi,
      txHash: deployResult.txHash
    };
  }

  async execute(account, invocationInfo, fee, amount) {
    assertNotEmpty(account, "Selected account is empty");
    assertNotEmpty(invocationInfo, "Invocation info is empty");
    assertNotEmpty(fee, "Contract deploy fee is empty");
    assertNotEmpty(amount, "Contract deploy amount is empty");
    logger.debug("Execution with", account.address, invocationInfo, fee, amount);
    const executeResult = await this.client.execute(account, invocationInfo, fee, amount);
    return {
      txHash: executeResult.txHash,
      result: executeResult.result,
      status: executeResult.status
    };
  }

  async query(invocationInfo) {
    assertNotEmpty(invocationInfo, "Invocation info is empty");
    logger.debug("Query with", invocationInfo);
    const result = await this.client.query(invocationInfo);
    return JSON.stringify(result);
  }

}

class NodeService {
  constructor(client) {
    this.client = client;
  }

  async blockchainStatus() {
    return await this.client.getBlockchainStatus().then(blockchainStatus => {
      logger.debug("Quried node state", blockchainStatus);
      return {
        height: blockchainStatus.bestHeight,
        hash: blockchainStatus.bestBlockHash
      };
    })["catch"](err => {
      logger.error(err);
      return {
        height: "unknown",
        hash: "unknown"
      };
    });
  }

}

class ServiceProvider {
  constructor() {
    this.endpoint = "";
  }

  get client() {
    if (isUndefined(this._client)) {
      let {
        AthenaClient
      } = require('@aergo/athena-client');

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
var serviceProvider = new ServiceProvider();

var _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _temp;
let Account = undefined;

const loadAccount = () => {
  if (typeof Account === "undefined") {
    Account = require("@aergo/athena-client").Account;
  }

  return Account;
};

let AccountStore = (_class = (_temp = class AccountStore {
  constructor(rootStore) {
    _initializerDefineProperty(this, "currentAddress", _descriptor, this);

    _initializerDefineProperty(this, "currentBalance", _descriptor2, this);

    _initializerDefineProperty(this, "currentBalanceWithUnit", _descriptor3, this);

    _initializerDefineProperty(this, "currentNonce", _descriptor4, this);

    _initializerDefineProperty(this, "address2Account", _descriptor5, this);

    this.rootStore = rootStore;
  }

  get currentAccount() {
    return this.address2Account.get(this.currentAddress);
  }

  get addresses() {
    return Array.from(this.address2Account.keys());
  }

  serialize() {
    return {};
  }

  deserialize(data) {
    logger.debug("Deserialize", data);
  }

  newAccount() {
    logger.debug("New account");
    loadAccount()["new"]().then(account => {
      this.address2Account.set(account.address, account);
      this.changeAccount(account.address);
      const message = "Created account " + account.address + " successfully";
      this.rootStore.consoleStore.log(message, "info");
      this.rootStore.notificationStore.notify(message, "success");
    })["catch"](err => {
      logger.error(err);
      this.rootStore.consoleStore.log(err, "error");
      this.rootStore.notificationStore.notify("Creating account failed", "error");
    });
  }

  addAccount(encryptedPrivateKey, password) {
    logger.debug("Add account with", encryptedPrivateKey);
    loadAccount().from(encryptedPrivateKey, password).then(account => {
      this.address2Account.set(account.address, account);
      this.changeAccount(account.address);
      const message = "Successfully imported account " + account.address;
      this.rootStore.consoleStore.log(message, "info");
      this.rootStore.notificationStore.notify(message, "success");
    })["catch"](err => {
      logger.error(err);
      this.rootStore.consoleStore.log(err, "error");
      this.rootStore.notificationStore.notify("Importing account failed", "error");
    });
  }

  changeAccount(address) {
    this.rootStore.consoleStore.log("Change account to " + address, "info");
    this.currentAddress = address;
    this.updateAccountState();
  }

  updateAccountState() {
    logger.debug("Update account state of", this.currentAddress);
    serviceProvider.accountService.getAccountState(this.currentAddress).then(state => {
      this.currentBalance = "unknown" === state.balance ? state.balance : formatInteger(state.balance);
      this.currentBalanceWithUnit = "unknown" === state.balance ? state.balance : formatAergoBalance(state.balance);
      this.currentNonce = state.nonce;
    });
  }

  exportAccount(password) {
    logger.debug("Export current account", this.currentAddress);

    if (typeof this.currentAddress === "undefined" || "" === this.currentAddress) {
      return;
    }

    const account = this.address2Account.get(this.currentAddress);
    account.encrypt(password).then(encrypted => {
      const message = "exported: " + encrypted;
      this.rootStore.consoleStore.log(message, "info");
      this.rootStore.notificationStore.notify(message, "success");
    })["catch"](err => {
      logger.error(err);
      this.rootStore.consoleStore.log(err, "error");
      this.rootStore.notificationStore.notify("Exporting account failed", "error");
    });
  }

  removeAccount(address) {
    logger.debug("Remove account", address);

    if (!this.address2Account.has(address)) {
      return;
    }

    this.address2Account["delete"](address);
    this.changeAccount("");
  }

}, _temp), (_descriptor = _applyDecoratedDescriptor(_class.prototype, "currentAddress", [mobx.observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return "";
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "currentBalance", [mobx.observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return "";
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, "currentBalanceWithUnit", [mobx.observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return "";
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, "currentNonce", [mobx.observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return "";
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class.prototype, "address2Account", [mobx.observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return new Map();
  }
}), _applyDecoratedDescriptor(_class.prototype, "currentAccount", [mobx.computed], Object.getOwnPropertyDescriptor(_class.prototype, "currentAccount"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "addresses", [mobx.computed], Object.getOwnPropertyDescriptor(_class.prototype, "addresses"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "deserialize", [mobx.action], Object.getOwnPropertyDescriptor(_class.prototype, "deserialize"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "newAccount", [mobx.action], Object.getOwnPropertyDescriptor(_class.prototype, "newAccount"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "addAccount", [mobx.action], Object.getOwnPropertyDescriptor(_class.prototype, "addAccount"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "changeAccount", [mobx.action], Object.getOwnPropertyDescriptor(_class.prototype, "changeAccount"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "updateAccountState", [mobx.action], Object.getOwnPropertyDescriptor(_class.prototype, "updateAccountState"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "exportAccount", [mobx.action], Object.getOwnPropertyDescriptor(_class.prototype, "exportAccount"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "removeAccount", [mobx.action], Object.getOwnPropertyDescriptor(_class.prototype, "removeAccount"), _class.prototype)), _class);

var _class$1, _descriptor$1, _temp$1;
let ConsoleStore = (_class$1 = (_temp$1 = class ConsoleStore {
  constructor(rootStore) {
    _initializerDefineProperty(this, "recent", _descriptor$1, this);

    this.rootStore = rootStore;
  }

  serialize() {
    return {};
  }

  deserialize(data) {
    logger.debug("Deserialize", data);
  }

  log(message, level) {
    this.recent = {
      message: message,
      level: level
    };
  }

}, _temp$1), (_descriptor$1 = _applyDecoratedDescriptor(_class$1.prototype, "recent", [mobx.observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return {
      message: "",
      level: "info"
    };
  }
}), _applyDecoratedDescriptor(_class$1.prototype, "deserialize", [mobx.action], Object.getOwnPropertyDescriptor(_class$1.prototype, "deserialize"), _class$1.prototype), _applyDecoratedDescriptor(_class$1.prototype, "log", [mobx.action], Object.getOwnPropertyDescriptor(_class$1.prototype, "log"), _class$1.prototype)), _class$1);

var _class$2, _descriptor$2, _temp$2;
let ContractStore = (_class$2 = (_temp$2 = class ContractStore {
  constructor(rootStore) {
    _initializerDefineProperty(this, "observableContractAddress2Abi", _descriptor$2, this);

    this.rootStore = rootStore;
  }

  serialize() {
    return {};
  }

  get contractAddress2Abi() {
    return this.observableContractAddress2Abi.toJS();
  }

  deserialize(data) {
    logger.debug("Deserialize", data);
  }

  addContract(contract) {
    logger.debug("Add contract", contract);
    serviceProvider.contractService.getABI(contract).then(abi => {
      this.observableContractAddress2Abi.set(contract, abi);
      const message = "Successfully imported contract " + contract;
      this.rootStore.consoleStore.log(message, "info");
      this.rootStore.notificationStore.notify(message, "success");
    })["catch"](err => {
      logger.error(err);
      this.rootStore.consoleStore.log(err, "error");
      this.rootStore.notificationStore.notify("Importing contract failed", "error");
    });
  }

  deployContract(constructorArgs, amount) {
    logger.debug("Deploy contract with", constructorArgs, amount);
    const account = this.rootStore.accountStore.currentAccount;
    const deployInfo = {
      payload: this.rootStore.deployTargetStore.compileResult.payload.trim(),
      args: constructorArgs
    };
    const fee = {
      price: this.rootStore.feeStore.price,
      limit: this.rootStore.feeStore.limit
    };
    serviceProvider.contractService.deploy(account, deployInfo, fee, amount).then(deployResult => {
      this.rootStore.accountStore.updateAccountState();
      const contractAddress = deployResult.contractAddress;
      const abi = deployResult.abi;
      const txHash = deployResult.txHash;
      this.observableContractAddress2Abi.set(contractAddress, abi);
      this.rootStore.consoleStore.log("Deploy TxHash: " + txHash, "info");
      this.rootStore.consoleStore.log("ContractAddress: " + contractAddress, "info");
      this.rootStore.notificationStore.notify("Successfully deployed contract", "success");
    })["catch"](err => {
      this.rootStore.accountStore.updateAccountState();
      logger.error(err);
      this.rootStore.consoleStore.log(err, "error");
      this.rootStore.notificationStore.notify("Deploying contract failed", "error");
    });
  }

  executeContract(contractAddress, abi, functionName, args, amount) {
    logger.debug("Execute contract with", contractAddress, abi, functionName, args, amount);
    const account = this.rootStore.accountStore.currentAccount;
    const invocationInfo = {
      contractAddress: contractAddress,
      abi: abi,
      targetFunction: functionName,
      args: args
    };
    const fee = {
      price: this.rootStore.feeStore.price,
      limit: this.rootStore.feeStore.limit
    };
    serviceProvider.contractService.execute(account, invocationInfo, fee, amount).then(execResult => {
      this.rootStore.accountStore.updateAccountState();
      const txHash = execResult.txHash;
      const result = execResult.result;
      const status = execResult.status;
      this.rootStore.consoleStore.log("Execute txHash: " + txHash, "info");
      this.rootStore.consoleStore.log("Execute result: " + result + ", status: " + status, "info");
    })["catch"](err => {
      logger.error(err);
      this.rootStore.accountStore.updateAccountState();
      this.rootStore.consoleStore.log(err, "error");
      this.rootStore.notificationStore.notify("Executing contract failed", "error");
    });
  }

  queryContract(contractAddress, abi, functionName, args) {
    logger.debug("Query contract with", contractAddress, abi, functionName, args);
    const invocationInfo = {
      contractAddress: contractAddress,
      abi: abi,
      targetFunction: functionName,
      args: args
    };
    serviceProvider.contractService.query(invocationInfo).then(queryResult => {
      this.rootStore.consoleStore.log("Query result: " + queryResult, "info");
    })["catch"](err => {
      logger.error(err);
      this.rootStore.consoleStore.log(err, "error");
      this.rootStore.notificationStore.notify("Query contract failed", "error");
    });
  }

  removeContract(contractAddress) {
    logger.debug("Remove contract", contractAddress);

    if (!this.observableContractAddress2Abi.has(contractAddress)) {
      return;
    }

    this.observableContractAddress2Abi["delete"](contractAddress);
  }

}, _temp$2), (_descriptor$2 = _applyDecoratedDescriptor(_class$2.prototype, "observableContractAddress2Abi", [mobx.observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return new Map();
  }
}), _applyDecoratedDescriptor(_class$2.prototype, "contractAddress2Abi", [mobx.computed], Object.getOwnPropertyDescriptor(_class$2.prototype, "contractAddress2Abi"), _class$2.prototype), _applyDecoratedDescriptor(_class$2.prototype, "deserialize", [mobx.action], Object.getOwnPropertyDescriptor(_class$2.prototype, "deserialize"), _class$2.prototype), _applyDecoratedDescriptor(_class$2.prototype, "addContract", [mobx.action], Object.getOwnPropertyDescriptor(_class$2.prototype, "addContract"), _class$2.prototype), _applyDecoratedDescriptor(_class$2.prototype, "deployContract", [mobx.action], Object.getOwnPropertyDescriptor(_class$2.prototype, "deployContract"), _class$2.prototype), _applyDecoratedDescriptor(_class$2.prototype, "executeContract", [mobx.action], Object.getOwnPropertyDescriptor(_class$2.prototype, "executeContract"), _class$2.prototype), _applyDecoratedDescriptor(_class$2.prototype, "queryContract", [mobx.action], Object.getOwnPropertyDescriptor(_class$2.prototype, "queryContract"), _class$2.prototype), _applyDecoratedDescriptor(_class$2.prototype, "removeContract", [mobx.action], Object.getOwnPropertyDescriptor(_class$2.prototype, "removeContract"), _class$2.prototype)), _class$2);

var _class$3, _descriptor$3, _descriptor2$1, _temp$3;
let DeployTargetStore = (_class$3 = (_temp$3 = class DeployTargetStore {
  constructor(rootStore) {
    _initializerDefineProperty(this, "currentTarget", _descriptor$3, this);

    _initializerDefineProperty(this, "target2CompileResult", _descriptor2$1, this);

    this.rootStore = rootStore;
  }

  get compileResult() {
    const compileResult = this.target2CompileResult.get(this.currentTarget);
    return typeof compileResult !== "undefined" ? compileResult : {
      payload: "",
      abi: ""
    };
  }

  get constructorArgs() {
    const compileResult = this.target2CompileResult.get(this.currentTarget);

    if (typeof compileResult === "undefined") {
      return [];
    }

    const abi = JSON.parse(compileResult.abi);
    const abiFunctions = abi.functions;

    if (typeof abiFunctions === "undefined") {
      return [];
    }

    return abiFunctions.filter(f => "constructor" === f.name).map(f => f.arguments).reduce((acc, a) => acc.concat(a), []) // flatten
    .map(a => a.name);
  }

  get isPayable() {
    const compileResult = this.target2CompileResult.get(this.currentTarget);

    if (typeof compileResult === "undefined") {
      return false;
    }

    const abi = JSON.parse(compileResult.abi);
    const abiFunctions = abi.functions;
    return abiFunctions.filter(f => "constructor" === f.name).filter(f => typeof f.payable !== "undefined").length === 1;
  }

  get targets() {
    return Array.from(this.target2CompileResult.keys());
  }

  serialize() {
    return {};
  }

  deserialize(data) {
    logger.debug("Deserialize", data);
  }

  addTarget(baseDir, target) {
    logger.debug("Compile with", baseDir, target);
    Promise.resolve(path.resolve(baseDir, target)).then(absolutePath => {
      return serviceProvider.compileService.compile(absolutePath);
    }).then(compileResult => {
      this.target2CompileResult.set(target, compileResult);
      this.changeTarget(target);
      this.rootStore.consoleStore.log("Compile success", "info");
      this.rootStore.consoleStore.log("payload: " + compileResult.payload, "info");
      this.rootStore.consoleStore.log("abi: \n" + compileResult.abi, "info");
      this.rootStore.notificationStore.notify("Compiled successfully", "success");
    })["catch"](err => {
      logger.error(err);
      const message = err.toString();
      this.rootStore.consoleStore.log(message, "error");
      this.rootStore.notificationStore.notify("Compile failed", "error");
    });
  }

  changeTarget(target) {
    logger.debug("Change target to", target);
    this.currentTarget = target;
  }

  removeTarget(target) {
    logger.debug("Remove deploy target", target);
    this.target2CompileResult["delete"](target);
  }

}, _temp$3), (_descriptor$3 = _applyDecoratedDescriptor(_class$3.prototype, "currentTarget", [mobx.observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return "";
  }
}), _descriptor2$1 = _applyDecoratedDescriptor(_class$3.prototype, "target2CompileResult", [mobx.observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return new Map();
  }
}), _applyDecoratedDescriptor(_class$3.prototype, "compileResult", [mobx.computed], Object.getOwnPropertyDescriptor(_class$3.prototype, "compileResult"), _class$3.prototype), _applyDecoratedDescriptor(_class$3.prototype, "constructorArgs", [mobx.computed], Object.getOwnPropertyDescriptor(_class$3.prototype, "constructorArgs"), _class$3.prototype), _applyDecoratedDescriptor(_class$3.prototype, "isPayable", [mobx.computed], Object.getOwnPropertyDescriptor(_class$3.prototype, "isPayable"), _class$3.prototype), _applyDecoratedDescriptor(_class$3.prototype, "targets", [mobx.computed], Object.getOwnPropertyDescriptor(_class$3.prototype, "targets"), _class$3.prototype), _applyDecoratedDescriptor(_class$3.prototype, "deserialize", [mobx.action], Object.getOwnPropertyDescriptor(_class$3.prototype, "deserialize"), _class$3.prototype), _applyDecoratedDescriptor(_class$3.prototype, "addTarget", [mobx.action], Object.getOwnPropertyDescriptor(_class$3.prototype, "addTarget"), _class$3.prototype), _applyDecoratedDescriptor(_class$3.prototype, "changeTarget", [mobx.action], Object.getOwnPropertyDescriptor(_class$3.prototype, "changeTarget"), _class$3.prototype), _applyDecoratedDescriptor(_class$3.prototype, "removeTarget", [mobx.action], Object.getOwnPropertyDescriptor(_class$3.prototype, "removeTarget"), _class$3.prototype)), _class$3);

var _class$4, _descriptor$4, _descriptor2$2, _temp$4;
let FeeStore = (_class$4 = (_temp$4 = class FeeStore {
  constructor(rootStore) {
    _initializerDefineProperty(this, "price", _descriptor$4, this);

    _initializerDefineProperty(this, "limit", _descriptor2$2, this);

    this.rootStore = rootStore;
  }

  serialize() {
    return {};
  }

  deserialize(data) {
    logger.debug("Deserialize", data);
  }

  setPrice(price) {
    this.price = price;
  }

  setLimit(limit) {
    this.limit = limit;
  }

}, _temp$4), (_descriptor$4 = _applyDecoratedDescriptor(_class$4.prototype, "price", [mobx.observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return "0";
  }
}), _descriptor2$2 = _applyDecoratedDescriptor(_class$4.prototype, "limit", [mobx.observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return "0";
  }
}), _applyDecoratedDescriptor(_class$4.prototype, "deserialize", [mobx.action], Object.getOwnPropertyDescriptor(_class$4.prototype, "deserialize"), _class$4.prototype), _applyDecoratedDescriptor(_class$4.prototype, "setPrice", [mobx.action], Object.getOwnPropertyDescriptor(_class$4.prototype, "setPrice"), _class$4.prototype), _applyDecoratedDescriptor(_class$4.prototype, "setLimit", [mobx.action], Object.getOwnPropertyDescriptor(_class$4.prototype, "setLimit"), _class$4.prototype)), _class$4);

var _class$5, _descriptor$5, _descriptor2$3, _descriptor3$1, _descriptor4$1, _temp$5;
let NodeStore = (_class$5 = (_temp$5 = class NodeStore {
  constructor(rootStore) {
    _initializerDefineProperty(this, "currentNode", _descriptor$5, this);

    _initializerDefineProperty(this, "currentHeight", _descriptor2$3, this);

    _initializerDefineProperty(this, "bestHash", _descriptor3$1, this);

    _initializerDefineProperty(this, "nodeSet", _descriptor4$1, this);

    this.rootStore = rootStore;
  }

  get nodes() {
    return Array.from(this.nodeSet.values());
  }

  serialize() {
    return {
      currentNode: this.currentNode,
      nodeSet: JSON.stringify(this.nodes)
    };
  }

  deserialize(data) {
    logger.debug("Deserialize", data);

    if (data) {
      this.currentNode = data.currentNode;
      this.nodeSet = new Set(JSON.parse(data.nodeSet));
    }
  }

  addNode(node) {
    logger.debug("Add node", node);

    if (typeof node === "undefined" || "" === node) {
      return;
    }

    this.nodeSet.add(node);
    this.changeNode(node);
  }

  changeNode(node) {
    this.rootStore.consoleStore.log("Change node to " + node, "info");
    this.currentNode = node;
    serviceProvider.setEndpoint(node);
    this.updateNodeState();
  }

  updateNodeState() {
    logger.debug("Update node state of", this.currentNode);
    serviceProvider.setEndpoint(this.currentNode);
    serviceProvider.nodeService.blockchainStatus().then(status => {
      this.currentHeight = "unknown" === status.height ? status.height : formatInteger(status.height);
      this.bestHash = status.hash;
    });
    this.rootStore.accountStore.updateAccountState();
  }

  removeNode(node) {
    logger.debug("Remove node", node);

    if (!this.nodeSet.has(node)) {
      return;
    }

    this.nodeSet["delete"](node);
    this.changeNode("");
  }

}, _temp$5), (_descriptor$5 = _applyDecoratedDescriptor(_class$5.prototype, "currentNode", [mobx.observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return "localhost:7845";
  }
}), _descriptor2$3 = _applyDecoratedDescriptor(_class$5.prototype, "currentHeight", [mobx.observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return "unknown";
  }
}), _descriptor3$1 = _applyDecoratedDescriptor(_class$5.prototype, "bestHash", [mobx.observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return "unknown";
  }
}), _descriptor4$1 = _applyDecoratedDescriptor(_class$5.prototype, "nodeSet", [mobx.observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return new Set(["localhost:7845", "testnet.aergo.io:7845"]);
  }
}), _applyDecoratedDescriptor(_class$5.prototype, "nodes", [mobx.computed], Object.getOwnPropertyDescriptor(_class$5.prototype, "nodes"), _class$5.prototype), _applyDecoratedDescriptor(_class$5.prototype, "deserialize", [mobx.action], Object.getOwnPropertyDescriptor(_class$5.prototype, "deserialize"), _class$5.prototype), _applyDecoratedDescriptor(_class$5.prototype, "addNode", [mobx.action], Object.getOwnPropertyDescriptor(_class$5.prototype, "addNode"), _class$5.prototype), _applyDecoratedDescriptor(_class$5.prototype, "changeNode", [mobx.action], Object.getOwnPropertyDescriptor(_class$5.prototype, "changeNode"), _class$5.prototype), _applyDecoratedDescriptor(_class$5.prototype, "updateNodeState", [mobx.action], Object.getOwnPropertyDescriptor(_class$5.prototype, "updateNodeState"), _class$5.prototype), _applyDecoratedDescriptor(_class$5.prototype, "removeNode", [mobx.action], Object.getOwnPropertyDescriptor(_class$5.prototype, "removeNode"), _class$5.prototype)), _class$5);

var _class$6, _descriptor$6, _temp$6;
let NotificationStore = (_class$6 = (_temp$6 = class NotificationStore {
  constructor(rootStore) {
    _initializerDefineProperty(this, "recent", _descriptor$6, this);

    this.rootStore = rootStore;
  }

  serialize() {
    return {};
  }

  deserialize(data) {
    logger.debug("Deserialize", data);
  }

  notify(message, level) {
    this.recent = {
      message: message,
      level: level
    };
  }

}, _temp$6), (_descriptor$6 = _applyDecoratedDescriptor(_class$6.prototype, "recent", [mobx.observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return {
      message: "",
      level: ""
    };
  }
}), _applyDecoratedDescriptor(_class$6.prototype, "deserialize", [mobx.action], Object.getOwnPropertyDescriptor(_class$6.prototype, "deserialize"), _class$6.prototype), _applyDecoratedDescriptor(_class$6.prototype, "notify", [mobx.action], Object.getOwnPropertyDescriptor(_class$6.prototype, "notify"), _class$6.prototype)), _class$6);

class RootStore {
  constructor() {
    this.stores = {
      accountStore: new AccountStore(this),
      consoleStore: new ConsoleStore(this),
      contractStore: new ContractStore(this),
      deployTargetStore: new DeployTargetStore(this),
      feeStore: new FeeStore(this),
      nodeStore: new NodeStore(this),
      notificationStore: new NotificationStore(this)
    };
  }

  serialize() {
    const rawSerialized = Object.keys(this.stores).map(key => this.stores[key].serialize());
    const data = JSON.parse(JSON.stringify(rawSerialized));
    logger.debug("Serialize", data);
    return data;
  }

  deserialize({
    data
  }) {
    logger.debug("Deserialize", data);
    Object.keys(this.stores).map((key, index) => this.stores[key].deserialize(data[index]));
  }

  get accountStore() {
    return this.stores.accountStore;
  }

  get consoleStore() {
    return this.stores.consoleStore;
  }

  get contractStore() {
    return this.stores.contractStore;
  }

  get deployTargetStore() {
    return this.stores.deployTargetStore;
  }

  get feeStore() {
    return this.stores.feeStore;
  }

  get nodeStore() {
    return this.stores.nodeStore;
  }

  get notificationStore() {
    return this.stores.notificationStore;
  }

}

var global$1 = (typeof global !== "undefined" ? global :
            typeof self !== "undefined" ? self :
            typeof window !== "undefined" ? window : {});

if (typeof global$1.setTimeout === 'function') ;
if (typeof global$1.clearTimeout === 'function') ;

// from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
var performance = global$1.performance || {};
var performanceNow =
  performance.now        ||
  performance.mozNow     ||
  performance.msNow      ||
  performance.oNow       ||
  performance.webkitNow  ||
  function(){ return (new Date()).getTime() };

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var reactIs_production_min = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0});
var b="function"===typeof Symbol&&Symbol.for,c=b?Symbol.for("react.element"):60103,d=b?Symbol.for("react.portal"):60106,e=b?Symbol.for("react.fragment"):60107,f=b?Symbol.for("react.strict_mode"):60108,g=b?Symbol.for("react.profiler"):60114,h=b?Symbol.for("react.provider"):60109,k=b?Symbol.for("react.context"):60110,l=b?Symbol.for("react.async_mode"):60111,m=b?Symbol.for("react.concurrent_mode"):60111,n=b?Symbol.for("react.forward_ref"):60112,p=b?Symbol.for("react.suspense"):60113,q=b?Symbol.for("react.memo"):
60115,r=b?Symbol.for("react.lazy"):60116;function t(a){if("object"===typeof a&&null!==a){var u=a.$$typeof;switch(u){case c:switch(a=a.type,a){case l:case m:case e:case g:case f:case p:return a;default:switch(a=a&&a.$$typeof,a){case k:case n:case h:return a;default:return u}}case r:case q:case d:return u}}}function v(a){return t(a)===m}exports.typeOf=t;exports.AsyncMode=l;exports.ConcurrentMode=m;exports.ContextConsumer=k;exports.ContextProvider=h;exports.Element=c;exports.ForwardRef=n;
exports.Fragment=e;exports.Lazy=r;exports.Memo=q;exports.Portal=d;exports.Profiler=g;exports.StrictMode=f;exports.Suspense=p;exports.isValidElementType=function(a){return "string"===typeof a||"function"===typeof a||a===e||a===m||a===g||a===f||a===p||"object"===typeof a&&null!==a&&(a.$$typeof===r||a.$$typeof===q||a.$$typeof===h||a.$$typeof===k||a.$$typeof===n)};exports.isAsyncMode=function(a){return v(a)||t(a)===l};exports.isConcurrentMode=v;exports.isContextConsumer=function(a){return t(a)===k};
exports.isContextProvider=function(a){return t(a)===h};exports.isElement=function(a){return "object"===typeof a&&null!==a&&a.$$typeof===c};exports.isForwardRef=function(a){return t(a)===n};exports.isFragment=function(a){return t(a)===e};exports.isLazy=function(a){return t(a)===r};exports.isMemo=function(a){return t(a)===q};exports.isPortal=function(a){return t(a)===d};exports.isProfiler=function(a){return t(a)===g};exports.isStrictMode=function(a){return t(a)===f};
exports.isSuspense=function(a){return t(a)===p};
});

unwrapExports(reactIs_production_min);
var reactIs_production_min_1 = reactIs_production_min.typeOf;
var reactIs_production_min_2 = reactIs_production_min.AsyncMode;
var reactIs_production_min_3 = reactIs_production_min.ConcurrentMode;
var reactIs_production_min_4 = reactIs_production_min.ContextConsumer;
var reactIs_production_min_5 = reactIs_production_min.ContextProvider;
var reactIs_production_min_6 = reactIs_production_min.Element;
var reactIs_production_min_7 = reactIs_production_min.ForwardRef;
var reactIs_production_min_8 = reactIs_production_min.Fragment;
var reactIs_production_min_9 = reactIs_production_min.Lazy;
var reactIs_production_min_10 = reactIs_production_min.Memo;
var reactIs_production_min_11 = reactIs_production_min.Portal;
var reactIs_production_min_12 = reactIs_production_min.Profiler;
var reactIs_production_min_13 = reactIs_production_min.StrictMode;
var reactIs_production_min_14 = reactIs_production_min.Suspense;
var reactIs_production_min_15 = reactIs_production_min.isValidElementType;
var reactIs_production_min_16 = reactIs_production_min.isAsyncMode;
var reactIs_production_min_17 = reactIs_production_min.isConcurrentMode;
var reactIs_production_min_18 = reactIs_production_min.isContextConsumer;
var reactIs_production_min_19 = reactIs_production_min.isContextProvider;
var reactIs_production_min_20 = reactIs_production_min.isElement;
var reactIs_production_min_21 = reactIs_production_min.isForwardRef;
var reactIs_production_min_22 = reactIs_production_min.isFragment;
var reactIs_production_min_23 = reactIs_production_min.isLazy;
var reactIs_production_min_24 = reactIs_production_min.isMemo;
var reactIs_production_min_25 = reactIs_production_min.isPortal;
var reactIs_production_min_26 = reactIs_production_min.isProfiler;
var reactIs_production_min_27 = reactIs_production_min.isStrictMode;
var reactIs_production_min_28 = reactIs_production_min.isSuspense;

var reactIs_development = createCommonjsModule(function (module, exports) {



{
  (function() {

Object.defineProperty(exports, '__esModule', { value: true });

// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var hasSymbol = typeof Symbol === 'function' && Symbol.for;

var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace;
var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;
var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;

function isValidElementType(type) {
  return typeof type === 'string' || typeof type === 'function' ||
  // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
  type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE);
}

/**
 * Forked from fbjs/warning:
 * https://github.com/facebook/fbjs/blob/e66ba20ad5be433eb54423f2b097d829324d9de6/packages/fbjs/src/__forks__/warning.js
 *
 * Only change is we use console.warn instead of console.error,
 * and do nothing when 'console' is not supported.
 * This really simplifies the code.
 * ---
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var lowPriorityWarning = function () {};

{
  var printWarning = function (format) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var argIndex = 0;
    var message = 'Warning: ' + format.replace(/%s/g, function () {
      return args[argIndex++];
    });
    if (typeof console !== 'undefined') {
      console.warn(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };

  lowPriorityWarning = function (condition, format) {
    if (format === undefined) {
      throw new Error('`lowPriorityWarning(condition, format, ...args)` requires a warning ' + 'message argument');
    }
    if (!condition) {
      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      printWarning.apply(undefined, [format].concat(args));
    }
  };
}

var lowPriorityWarning$1 = lowPriorityWarning;

function typeOf(object) {
  if (typeof object === 'object' && object !== null) {
    var $$typeof = object.$$typeof;
    switch ($$typeof) {
      case REACT_ELEMENT_TYPE:
        var type = object.type;

        switch (type) {
          case REACT_ASYNC_MODE_TYPE:
          case REACT_CONCURRENT_MODE_TYPE:
          case REACT_FRAGMENT_TYPE:
          case REACT_PROFILER_TYPE:
          case REACT_STRICT_MODE_TYPE:
          case REACT_SUSPENSE_TYPE:
            return type;
          default:
            var $$typeofType = type && type.$$typeof;

            switch ($$typeofType) {
              case REACT_CONTEXT_TYPE:
              case REACT_FORWARD_REF_TYPE:
              case REACT_PROVIDER_TYPE:
                return $$typeofType;
              default:
                return $$typeof;
            }
        }
      case REACT_LAZY_TYPE:
      case REACT_MEMO_TYPE:
      case REACT_PORTAL_TYPE:
        return $$typeof;
    }
  }

  return undefined;
}

// AsyncMode is deprecated along with isAsyncMode
var AsyncMode = REACT_ASYNC_MODE_TYPE;
var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
var ContextConsumer = REACT_CONTEXT_TYPE;
var ContextProvider = REACT_PROVIDER_TYPE;
var Element = REACT_ELEMENT_TYPE;
var ForwardRef = REACT_FORWARD_REF_TYPE;
var Fragment = REACT_FRAGMENT_TYPE;
var Lazy = REACT_LAZY_TYPE;
var Memo = REACT_MEMO_TYPE;
var Portal = REACT_PORTAL_TYPE;
var Profiler = REACT_PROFILER_TYPE;
var StrictMode = REACT_STRICT_MODE_TYPE;
var Suspense = REACT_SUSPENSE_TYPE;

var hasWarnedAboutDeprecatedIsAsyncMode = false;

// AsyncMode should be deprecated
function isAsyncMode(object) {
  {
    if (!hasWarnedAboutDeprecatedIsAsyncMode) {
      hasWarnedAboutDeprecatedIsAsyncMode = true;
      lowPriorityWarning$1(false, 'The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 17+. Update your code to use ' + 'ReactIs.isConcurrentMode() instead. It has the exact same API.');
    }
  }
  return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
}
function isConcurrentMode(object) {
  return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
}
function isContextConsumer(object) {
  return typeOf(object) === REACT_CONTEXT_TYPE;
}
function isContextProvider(object) {
  return typeOf(object) === REACT_PROVIDER_TYPE;
}
function isElement(object) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
}
function isForwardRef(object) {
  return typeOf(object) === REACT_FORWARD_REF_TYPE;
}
function isFragment(object) {
  return typeOf(object) === REACT_FRAGMENT_TYPE;
}
function isLazy(object) {
  return typeOf(object) === REACT_LAZY_TYPE;
}
function isMemo(object) {
  return typeOf(object) === REACT_MEMO_TYPE;
}
function isPortal(object) {
  return typeOf(object) === REACT_PORTAL_TYPE;
}
function isProfiler(object) {
  return typeOf(object) === REACT_PROFILER_TYPE;
}
function isStrictMode(object) {
  return typeOf(object) === REACT_STRICT_MODE_TYPE;
}
function isSuspense(object) {
  return typeOf(object) === REACT_SUSPENSE_TYPE;
}

exports.typeOf = typeOf;
exports.AsyncMode = AsyncMode;
exports.ConcurrentMode = ConcurrentMode;
exports.ContextConsumer = ContextConsumer;
exports.ContextProvider = ContextProvider;
exports.Element = Element;
exports.ForwardRef = ForwardRef;
exports.Fragment = Fragment;
exports.Lazy = Lazy;
exports.Memo = Memo;
exports.Portal = Portal;
exports.Profiler = Profiler;
exports.StrictMode = StrictMode;
exports.Suspense = Suspense;
exports.isValidElementType = isValidElementType;
exports.isAsyncMode = isAsyncMode;
exports.isConcurrentMode = isConcurrentMode;
exports.isContextConsumer = isContextConsumer;
exports.isContextProvider = isContextProvider;
exports.isElement = isElement;
exports.isForwardRef = isForwardRef;
exports.isFragment = isFragment;
exports.isLazy = isLazy;
exports.isMemo = isMemo;
exports.isPortal = isPortal;
exports.isProfiler = isProfiler;
exports.isStrictMode = isStrictMode;
exports.isSuspense = isSuspense;
  })();
}
});

unwrapExports(reactIs_development);
var reactIs_development_1 = reactIs_development.typeOf;
var reactIs_development_2 = reactIs_development.AsyncMode;
var reactIs_development_3 = reactIs_development.ConcurrentMode;
var reactIs_development_4 = reactIs_development.ContextConsumer;
var reactIs_development_5 = reactIs_development.ContextProvider;
var reactIs_development_6 = reactIs_development.Element;
var reactIs_development_7 = reactIs_development.ForwardRef;
var reactIs_development_8 = reactIs_development.Fragment;
var reactIs_development_9 = reactIs_development.Lazy;
var reactIs_development_10 = reactIs_development.Memo;
var reactIs_development_11 = reactIs_development.Portal;
var reactIs_development_12 = reactIs_development.Profiler;
var reactIs_development_13 = reactIs_development.StrictMode;
var reactIs_development_14 = reactIs_development.Suspense;
var reactIs_development_15 = reactIs_development.isValidElementType;
var reactIs_development_16 = reactIs_development.isAsyncMode;
var reactIs_development_17 = reactIs_development.isConcurrentMode;
var reactIs_development_18 = reactIs_development.isContextConsumer;
var reactIs_development_19 = reactIs_development.isContextProvider;
var reactIs_development_20 = reactIs_development.isElement;
var reactIs_development_21 = reactIs_development.isForwardRef;
var reactIs_development_22 = reactIs_development.isFragment;
var reactIs_development_23 = reactIs_development.isLazy;
var reactIs_development_24 = reactIs_development.isMemo;
var reactIs_development_25 = reactIs_development.isPortal;
var reactIs_development_26 = reactIs_development.isProfiler;
var reactIs_development_27 = reactIs_development.isStrictMode;
var reactIs_development_28 = reactIs_development.isSuspense;

var reactIs = createCommonjsModule(function (module) {

{
  module.exports = reactIs_development;
}
});

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

var ReactPropTypesSecret_1 = ReactPropTypesSecret;

var printWarning = function() {};

{
  var ReactPropTypesSecret$1 = ReactPropTypesSecret_1;
  var loggedTypeFailures = {};
  var has = Function.call.bind(Object.prototype.hasOwnProperty);

  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  {
    for (var typeSpecName in typeSpecs) {
      if (has(typeSpecs, typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          if (typeof typeSpecs[typeSpecName] !== 'function') {
            var err = Error(
              (componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' +
              'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.'
            );
            err.name = 'Invariant Violation';
            throw err;
          }
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret$1);
        } catch (ex) {
          error = ex;
        }
        if (error && !(error instanceof Error)) {
          printWarning(
            (componentName || 'React class') + ': type specification of ' +
            location + ' `' + typeSpecName + '` is invalid; the type checker ' +
            'function must return `null` or an `Error` but returned a ' + typeof error + '. ' +
            'You may have forgotten to pass an argument to the type checker ' +
            'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
            'shape all require an argument).'
          );
        }
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          printWarning(
            'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')
          );
        }
      }
    }
  }
}

/**
 * Resets warning cache when testing.
 *
 * @private
 */
checkPropTypes.resetWarningCache = function() {
  {
    loggedTypeFailures = {};
  }
};

var checkPropTypes_1 = checkPropTypes;

var has$1 = Function.call.bind(Object.prototype.hasOwnProperty);
var printWarning$1 = function() {};

{
  printWarning$1 = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

function emptyFunctionThatReturnsNull() {
  return null;
}

var factoryWithTypeCheckers = function(isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    elementType: createElementTypeTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker,
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message) {
    this.message = message;
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret_1) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          var err = new Error(
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
            'Use `PropTypes.checkPropTypes()` to call them. ' +
            'Read more at http://fb.me/use-check-prop-types'
          );
          err.name = 'Invariant Violation';
          throw err;
        } else if (typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;
          if (
            !manualPropTypeCallCache[cacheKey] &&
            // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3
          ) {
            printWarning$1(
              'You are manually calling a React.PropTypes validation ' +
              'function for the `' + propFullName + '` prop on `' + componentName  + '`. This is deprecated ' +
              'and will throw in the standalone `prop-types` package. ' +
              'You may be seeing this warning due to a third-party PropTypes ' +
              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.'
            );
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunctionThatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret_1);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!reactIs.isValidElementType(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement type.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      {
        if (arguments.length > 1) {
          printWarning$1(
            'Invalid arguments supplied to oneOf, expected an array, got ' + arguments.length + ' arguments. ' +
            'A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z]).'
          );
        } else {
          printWarning$1('Invalid argument supplied to oneOf, expected an array.');
        }
      }
      return emptyFunctionThatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues, function replacer(key, value) {
        var type = getPreciseType(value);
        if (type === 'symbol') {
          return String(value);
        }
        return value;
      });
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + String(propValue) + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (has$1(propValue, key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
      printWarning$1('Invalid argument supplied to oneOfType, expected an instance of array.');
      return emptyFunctionThatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        printWarning$1(
          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
          'received ' + getPostfixForTypeWarning(checker) + ' at index ' + i + '.'
        );
        return emptyFunctionThatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret_1) == null) {
          return null;
        }
      }

      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (!checker) {
          continue;
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      // We need to check all keys in case some are required but missing from
      // props.
      var allKeys = objectAssign({}, props[propName], shapeTypes);
      for (var key in allKeys) {
        var checker = shapeTypes[key];
        if (!checker) {
          return new PropTypeError(
            'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
            '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
            '\nValid keys: ' +  JSON.stringify(Object.keys(shapeTypes), null, '  ')
          );
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
        if (error) {
          return error;
        }
      }
      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // falsy value can't be a Symbol
    if (!propValue) {
      return false;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes_1;
  ReactPropTypes.resetWarningCache = checkPropTypes_1.resetWarningCache;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

var propTypes = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

{
  var ReactIs = reactIs;

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = factoryWithTypeCheckers(ReactIs.isElement, throwOnDirectAccess);
}
});

const AddIcon = props => {
  return React.createElement("div", {
    className: join('inline-block', 'icon-diff-added', 'component-icon'),
    onClick: props.onClick
  });
};
AddIcon.propTypes = {
  onClick: propTypes.func
};

const argumentNameClass = 'component-argument-name';
const ArgumentName = props => {
  return React.createElement("div", {
    className: join('inline-block', argumentNameClass)
  }, props.name);
};
ArgumentName.propTypes = {
  name: propTypes.string
};

const argumentRowClass = 'argument-row';
const ArgumentRow = props => {
  return React.createElement("div", {
    className: join(argumentRowClass, props["class"])
  }, props.children);
};
ArgumentRow.propTypes = {
  children: propTypes.element.isRequired,
  "class": propTypes["class"]
};

const buttonClass = 'component-btn';
const disabledButtonClass = 'component-btn-disabled';
const Button = props => {
  let classes;
  let onClick;

  if (typeof props.disabled === "undefined" || !props.disabled) {
    classes = join('inline-block', buttonClass, props["class"], buttonClass);
    onClick = props.onClick;
  } else {
    classes = join('inline-block', buttonClass, props["class"], disabledButtonClass);
    onClick = undefined;
  }

  return React.createElement("div", {
    className: classes,
    onClick: onClick
  }, props.name);
};
Button.propTypes = {
  disabled: propTypes.bool,
  "class": propTypes["class"],
  onClick: propTypes.func,
  name: propTypes.string
};

const cardItemClass = 'component-card-item';
const CardItem = props => {
  const ratio = typeof props.ratio === "undefined" ? 0 : props.ratio;
  const hideOverflow = typeof props.hideOverflow === "undefined" ? false : props.hideOverflow;
  const inlineStyle = {
    flex: join(ratio, ratio, "auto")
  };

  if (hideOverflow) {
    inlineStyle.width = "1px";
  }

  return React.createElement("div", {
    style: inlineStyle,
    className: join(cardItemClass, "inline-block", props["class"])
  }, props.children);
};
CardItem.propTypes = {
  children: propTypes.element.isRequired,
  ratio: propTypes.number,
  hideOverflow: propTypes.bool,
  "class": propTypes["class"]
};

const cardRowClass = 'component-card-row';
const CardRow = props => {
  return React.createElement("div", {
    className: join(cardRowClass, props["class"])
  }, props.children);
};
CardRow.propTypes = {
  children: propTypes.element.isRequired,
  "class": propTypes["class"]
};

const cardClass = 'card';
const Card = props => {
  return React.createElement("div", {
    className: join('inset-panel', cardClass, props["class"])
  }, props.children);
};
Card.propTypes = {
  "class": propTypes["class"],
  children: propTypes.element.isRequired
};

const CopyIcon = props => {
  return React.createElement("div", {
    className: join('inline-block', 'icon-clippy', 'component-icon'),
    onClick: props.onClick
  });
};
CopyIcon.propTypes = {
  onClick: propTypes.func
};

const descriptionClass = 'component-description';
const Description = props => {
  return React.createElement("div", {
    className: join('inline-block', descriptionClass)
  }, props.description);
};
Description.propTypes = {
  description: propTypes.string
};

const foldableClass = 'foldable';
const Foldable = props => {
  const triggerBaseClass = typeof props.triggerBaseClass === "undefined" ? foldableClass : props.triggerBaseClass;
  const trigger = props.trigger;
  const children = props.children;
  const open = typeof props.isOpen === "undefined" ? true : props.isOpen;
  const transitionTime = typeof props.transitionTime === "undefined" ? 100 : props.transitionTime;
  return React.createElement(Collapsible, {
    classParentString: foldableClass,
    className: foldableClass + '-closed',
    openedClassName: foldableClass + '-opened',
    triggerClassName: triggerBaseClass + '-trigger-closed',
    triggerOpenedClassName: triggerBaseClass + '-trigger-opened',
    trigger: trigger,
    open: open,
    transitionTime: transitionTime // ms

  }, children);
};
Foldable.propTypes = {
  triggerBaseClass: propTypes["class"],
  trigger: propTypes.any.isRequired,
  children: propTypes.element.isRequired,
  isOpen: propTypes.bool,
  transitionTime: propTypes.number
};

const inputBoxClass = 'component-inputbox';
const inputBoxNumberClass = 'component-inputbox-number';
class InputBox extends React.Component {
  static get propTypes() {
    return {
      "class": propTypes["class"],
      tabIndex: propTypes.number,
      type: propTypes.string,
      placeHolder: propTypes.string,
      defaultValue: propTypes.any,
      onChange: propTypes.func,
      onFocus: propTypes.func,
      onBlur: propTypes.func
    };
  }

  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

  get value() {
    return this.inputRef.current.value;
  }

  cleanValue() {
    this.inputRef.current.value = "";
  }

  render() {
    const injectedClass = this.props["class"];
    const tabIndex = typeof this.props.tabIndex === "undefined" ? -1 : this.props.tabIndex;
    const type = this.props.type;
    const placeHolder = this.props.placeHolder;
    const defaultValue = typeof this.props.defaultValue === "undefined" ? "" : this.props.defaultValue;
    const onChange = this.props.onChange;
    const onFocus = this.props.onFocus;
    const onBlur = this.props.onBlur;
    const numberTypeClass = this.props.type === "number" ? inputBoxNumberClass : "";
    const inputRef = this.inputRef;
    return React.createElement("input", {
      className: join('inline-block', 'native-key-bindings', inputBoxClass, numberTypeClass, injectedClass),
      tabIndex: tabIndex,
      type: type,
      placeHolder: placeHolder,
      defaultValue: defaultValue,
      onChange: onChange,
      onFocus: onFocus,
      onBlur: onBlur,
      ref: inputRef
    });
  }

}

const panelClass = 'athena-ide-tab-panel';
const Panel = props => {
  return React.createElement("div", {
    className: panelClass
  }, props.children);
};
Panel.propTypes = {
  children: propTypes.element.isRequired
};

const selectBoxClass = 'component-selectbox';
const SelectBox = props => {
  const injectedClass = props["class"];
  const value = props.value;
  const options = props.options;
  const placeholder = typeof props.placeholder === "undefined" ? "select an item" : props.placeholder;
  const onChange = props.onChange;
  const arrowClassName = selectBoxClass + '__arrow';
  return React.createElement(Dropdown // main dropdown component
  , {
    className: join('inline-block', selectBoxClass, injectedClass),
    controlClassName: selectBoxClass + '__control',
    placeholderClassName: selectBoxClass + '__placeholder',
    menuClassName: selectBoxClass + '__menu',
    arrowClassName: arrowClassName,
    value: value,
    options: options,
    placeholder: placeholder,
    onChange: o => onChange(o.value)
  });
};
SelectBox.propTypes = {
  "class": propTypes["class"],
  value: propTypes.string,
  options: propTypes.array,
  placeholder: propTypes.string,
  onChange: propTypes.func
};

const starsCellClass = 'star-cell';
const StarsCell = props => {
  const rowspan = typeof props.rowspan == "undefined" ? "1" : props.rowspan;
  const colspan = typeof props.colspan == "undefined" ? "1" : props.colspan;
  return React.createElement("td", {
    rolspan: rowspan,
    colSpan: colspan,
    className: join(starsCellClass, props["class"])
  }, props.children);
};
StarsCell.propTypes = {
  "class": propTypes["class"],
  rowspan: propTypes.number,
  colspan: propTypes.number,
  children: propTypes.element.isRequired
};

const starContentClass = 'star-content';
const StarContent = props => {
  return React.createElement("div", {
    className: join(starContentClass, props["class"])
  }, props.content);
};
StarContent.propTypes = {
  "class": propTypes["class"],
  content: propTypes.string
};

const starTitleClass = 'star-title';
const StarTitle = props => {
  return React.createElement("div", {
    className: join(starTitleClass, props["class"])
  }, props.title);
};
StarTitle.propTypes = {
  "class": propTypes["class"],
  title: propTypes.string
};

const starsRowClass = 'stars-row';
const StarsRow = props => {
  return React.createElement("tr", {
    className: join(starsRowClass, props["class"])
  }, props.children);
};
StarsRow.propTypes = {
  "class": propTypes["class"],
  children: propTypes.element.isRequired
};

const starsClass = 'stars';
const Stars = props => {
  return React.createElement("table", {
    className: join(starsClass, props["class"])
  }, props.children);
};
Stars.propTypes = {
  "class": propTypes["class"],
  children: propTypes.element.isRequired
};

const SyncIcon = props => {
  return React.createElement("div", {
    className: join('inline-block', 'icon-sync', 'component-icon'),
    onClick: props.onClick
  });
};
SyncIcon.propTypes = {
  onClick: propTypes.func
};

const testBoxClass = 'component-textbox';
const TextBox = props => {
  return React.createElement("div", {
    className: join('inline-block', testBoxClass, props["class"])
  }, props.text);
};
TextBox.propTypes = {
  text: propTypes.string,
  "class": propTypes["class"]
};

const titleClass = 'component-title';
const Title = props => {
  return React.createElement("div", {
    className: join('inline-block', titleClass, props["class"])
  }, props.title);
};
Title.propTypes = {
  title: propTypes.string,
  "class": propTypes["class"]
};

const TrashIcon = props => {
  return React.createElement("div", {
    className: join('inline-block', 'icon-trashcan', 'component-icon'),
    onClick: props.onClick
  });
};
TrashIcon.propTypes = {
  onClick: propTypes.func
};

const voidClass = 'void';
const Void = props => {
  return React.createElement("div", {
    className: join(voidClass, props["class"])
  }, props.children);
};
Void.propTypes = {
  "class": propTypes["class"],
  children: propTypes.element.isRequired
};

const AddressSelect = props => {
  const accountAddress = props.address;
  const accountAddresses = props.addresses;
  const onAddressChange = props.onAddressChange;
  const onAddressCopy = props.onAddressCopy;
  return React.createElement(CardRow, null, React.createElement(CardItem, {
    ratio: 0
  }, React.createElement(Description, {
    description: "Address"
  })), React.createElement(CardItem, {
    ratio: 1,
    hideOverflow: true
  }, React.createElement(SelectBox, {
    value: accountAddress,
    options: accountAddresses,
    onChange: onAddressChange
  })), React.createElement(CardItem, {
    ratio: 0
  }, React.createElement(CopyIcon, {
    onClick: e => {
      e.stopPropagation();
      onAddressCopy(accountAddress);
    }
  })));
};
AddressSelect.propTypes = {
  address: propTypes.string,
  addresses: propTypes.array,
  onAddressChange: propTypes.func,
  onAddressCopy: propTypes.func
};

const noArgumentsDisplay = "No arguments provided";
const units$1 = ["aer", "gaer", "aergo"];
class Arguments extends React.Component {
  static get propTypes() {
    return {
      resetState: propTypes.bool,
      args: propTypes.array.isRequired,
      payable: propTypes.bool
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      isFocused: false,
      args: new Array(props.args.length).fill(""),
      amount: "",
      unit: "aer"
    }; // hack to clean value when reset

    this.inputRefs = [];
    this._onFocusOnAnyInput = this._onFocusOnAnyInput.bind(this);
    this._onBrurOnAnyInput = this._onBrurOnAnyInput.bind(this);
    this._onArgumentValueChange = this._onArgumentValueChange.bind(this);
    this._onAmountChange = this._onAmountChange.bind(this);
    this._onUnitChange = this._onUnitChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.args.length !== nextProps.args.length) {
      this.inputRefs.forEach(inputRef => inputRef.current.cleanValue());
      this.setState({
        args: new Array(nextProps.args.length).fill(""),
        amount: "",
        unit: "aer"
      });
    }
  }

  get values() {
    return this.state.args;
  }

  get amount() {
    const amount = "" === this.state.amount ? "0" : this.state.amount;
    return convertToAerAmountWithUnit(amount, this.state.unit);
  }

  _onArgumentValueChange(e, index) {
    const newValue = e.target.value;
    const newArgs = this.state.args.map((oldValue, i) => {
      return index === i ? newValue : oldValue;
    });
    logger.debug("new arguments", index, newValue, newArgs);
    this.setState({
      args: newArgs
    });
  }

  _onAmountChange(e) {
    const newValue = e.target.value;
    this.setState({
      amount: newValue.toString()
    });
  }

  _onUnitChange(newUnit) {
    this.setState({
      unit: newUnit
    });
  }

  _generateArgsDisplay() {
    let argumentDisplay = noArgumentsDisplay;

    if (this.state.args.map(a => a.trim()).filter(a => "" !== a).length > 0) {
      argumentDisplay = "[" + this.state.args.join(", ") + "]";
    }

    return argumentDisplay;
  }

  _generateAmountDisplay() {
    return "" !== this.state.amount ? this.state.amount + " " + this.state.unit : "";
  }

  _onFocusOnAnyInput() {
    if (!this.state.isFocused) {
      this.setState({
        isFocused: true
      });
    }
  }

  _onBrurOnAnyInput() {
    this.setState({
      isFocused: false
    });
  }

  render() {
    // reactive tabindex
    let tabIndex = 1;

    const tabIndexProvider = () => this.state.isFocused ? tabIndex++ : -1;

    this.inputRefs = [];
    const argumentComponents = this.props.args.map((arg, index) => {
      // hack to clean value when reset
      const inputRef = React.createRef();
      this.inputRefs.push(inputRef);
      return React.createElement(ArgumentRow, {
        key: index
      }, React.createElement(ArgumentName, {
        name: arg
      }), React.createElement(InputBox, {
        tabIndex: tabIndexProvider(),
        onFocus: this._onFocusOnAnyInput,
        onBlur: this._onBrurOnAnyInput,
        "class": "component-inputbox-argument",
        onChange: e => this._onArgumentValueChange(e, index),
        ref: inputRef
      }));
    });

    if (this.props.payable) {
      // hack to clean value when reset
      const inputRef = React.createRef();
      this.inputRefs.push(inputRef);
      argumentComponents.push(React.createElement(ArgumentRow, null, React.createElement(ArgumentName, {
        name: "Amount"
      }), React.createElement(InputBox, {
        tabIndex: tabIndexProvider(),
        type: "number",
        "class": "component-inputbox-argument",
        onChange: this._onAmountChange,
        onFocus: this._onFocusOnAnyInput,
        onBlur: this._onBrurOnAnyInput,
        ref: inputRef
      }), React.createElement(SelectBox, {
        "class": "component-selectbox-unit",
        value: this.state.unit,
        options: units$1,
        onChange: this._onUnitChange
      })));
    }

    const argumentDisplay = this._generateArgsDisplay();

    const amountDisplay = this._generateAmountDisplay();

    const argumentsTextBoxClass = argumentDisplay === noArgumentsDisplay ? join('component-textbox-no-arguments', 'component-textbox-arguments') : 'component-textbox-arguments';
    const trigger = React.createElement("div", {
      className: "component-arguments-and-amount"
    }, React.createElement(TextBox, {
      "class": argumentsTextBoxClass,
      text: argumentDisplay
    }), React.createElement(TextBox, {
      "class": "component-textbox-amount",
      text: amountDisplay
    }));
    return React.createElement(Foldable, {
      isOpen: false,
      transitionTime: 1,
      trigger: trigger
    }, argumentComponents);
  }

}

const ArgumentsAndRunner = props => {
  const args = props.args;
  const payable = props.payable;
  const runnerName = props.runnerName;
  const runnerStyle = props.runnerStyle;
  const runner = props.runner;
  const argsRef = React.createRef();
  return React.createElement(CardRow, {
    "class": "component-card-row-argument"
  }, React.createElement(CardItem, {
    ratio: 1,
    hideOverflow: true
  }, React.createElement(Arguments, {
    args: args,
    payable: payable,
    ref: argsRef
  })), React.createElement(CardItem, {
    ratio: 0
  }, React.createElement(Button, {
    name: runnerName,
    "class": runnerStyle,
    onClick: () => runner(argsRef)
  })));
};

ArgumentsAndRunner.propTypes = {
  args: propTypes.array,
  payable: propTypes.bool,
  runnerName: propTypes.string,
  runnerStyle: propTypes.string,
  runner: propTypes.func
};

const Balance = props => {
  return React.createElement(CardRow, null, React.createElement(CardItem, {
    ratio: 0
  }, React.createElement(Description, {
    description: "Balance"
  })), React.createElement(CardItem, {
    ratio: 1
  }, React.createElement(TextBox, {
    text: props.balance
  })));
};
Balance.propTypes = {
  balance: propTypes.string
};

const CardTitle = props => {
  return React.createElement(CardRow, null, React.createElement(Title, {
    title: props.title,
    "class": props.titleClass
  }), props.children);
};
CardTitle.propTypes = {
  title: propTypes.string.isRequired,
  titleClass: propTypes["class"],
  children: propTypes.element
};

const ConstructorArguments = props => {
  const args = props.args;
  const payable = props.payable;
  const argsRef = props.argsRef;
  return React.createElement(CardRow, null, React.createElement(CardItem, {
    ratio: 0
  }, React.createElement(Description, {
    description: "Args"
  })), React.createElement(CardItem, {
    ratio: 1,
    hideOverflow: true
  }, React.createElement(Arguments, {
    args: args,
    payable: payable,
    ref: argsRef
  })));
};

ConstructorArguments.propTypes = {
  args: propTypes.array,
  payable: propTypes.bool,
  argsRef: propTypes.any
};

const FoldableCard = props => {
  return React.createElement(Card, {
    "class": props["class"]
  }, React.createElement(Foldable, {
    triggerBaseClass: props.foldableClass,
    trigger: props.trigger,
    isOpen: props.isOpen,
    transitionTime: props.transitionTime
  }, props.children));
};
FoldableCard.propTypes = {
  "class": propTypes["class"],
  foldableClass: propTypes["class"],
  trigger: propTypes.element.isRequired,
  children: propTypes.element.isRequired,
  isOpen: propTypes.bool,
  transitionTime: propTypes.number
};

const Height = props => {
  return React.createElement(CardRow, null, React.createElement(CardItem, {
    ratio: 0
  }, React.createElement(Description, {
    description: "Height"
  })), React.createElement(CardItem, {
    ratio: 1
  }, React.createElement(TextBox, {
    text: props.height
  })));
};
Height.propTypes = {
  height: propTypes.string
};

const NodeSelect = props => {
  return React.createElement(CardRow, null, React.createElement(CardItem, {
    ratio: 0
  }, React.createElement(Description, {
    description: "Node"
  })), React.createElement(CardItem, {
    ratio: 1,
    hideOverflow: true
  }, React.createElement(SelectBox, {
    value: props.node,
    options: props.nodes,
    onChange: props.onChange
  })));
};
NodeSelect.propTypes = {
  node: propTypes.string,
  nodes: propTypes.array,
  onChange: propTypes.func
};

const Nonce = props => {
  return React.createElement(CardRow, null, React.createElement(CardItem, {
    ratio: 0
  }, React.createElement(Description, {
    description: "Nonce"
  })), React.createElement(CardItem, {
    ratio: 1
  }, React.createElement(TextBox, {
    text: props.nonce
  })));
};
Nonce.propTypes = {
  nonce: propTypes.string
};

const Payload = props => {
  return React.createElement(CardRow, null, React.createElement(Description, {
    description: "Payload"
  }), React.createElement(TextBox, {
    "class": "component-textbox-compile-result",
    text: props.payload
  }));
};
Payload.propTypes = {
  payload: propTypes.string
};

const starClass = 'star';
const Star = props => {
  return React.createElement("div", {
    className: starClass
  }, React.createElement(StarTitle, {
    title: props.title
  }), React.createElement(StarContent, {
    content: props.content
  }));
};
Star.propTypes = {
  title: propTypes.string,
  content: propTypes.string
};

const TargetSelect = props => {
  return React.createElement(CardRow, null, React.createElement(CardItem, {
    ratio: 0
  }, React.createElement(Description, {
    description: "Target"
  })), React.createElement(CardItem, {
    ratio: 1,
    hideOverflow: true
  }, React.createElement(SelectBox, {
    value: props.target,
    options: props.targets,
    onChange: props.onChange
  })));
};
TargetSelect.propTypes = {
  target: propTypes.string,
  targets: propTypes.array,
  onChange: propTypes.func
};

var _dec, _class$7;
let ExportAccountModal = (_dec = mobxReact.inject('accountStore'), _dec(_class$7 = mobxReact.observer(_class$7 = class ExportAccountModal extends React.Component {
  static get propTypes() {
    return {
      accountStore: propTypes.any
    };
  }

  constructor(props) {
    super(props);
    this.passwordInputRef = React.createRef();
  }

  _onConfirm() {
    logger.debug("Export account button clicked");
    const password = this.passwordInputRef.current.value;
    this.props.accountStore.exportAccount(password);
  }

  render() {
    return React.createElement(Popup, {
      modal: true,
      trigger: React.createElement(Button, {
        "class": "component-btn-ocean",
        name: "Export"
      })
    }, close => React.createElement("atom-panel", {
      "class": "modal"
    }, React.createElement("div", null, React.createElement(CardTitle, {
      title: "Enter password to decrypt private key"
    }), React.createElement(CardRow, null, React.createElement(Description, {
      description: "Password"
    }), React.createElement(InputBox, {
      ref: this.passwordInputRef,
      type: "text",
      placeHolder: "password to encrypt private key"
    })), React.createElement(CardRow, {
      "class": "component-card-row-button-modal"
    }, React.createElement(Button, {
      name: "Cancel",
      onClick: close
    }), React.createElement(Button, {
      "class": "component-btn-rightmost",
      name: "Ok",
      onClick: () => {
        this._onConfirm();

        close();
      }
    })))));
  }

}) || _class$7) || _class$7);

var _dec$1, _class$8;
let ImportAccountModal = (_dec$1 = mobxReact.inject('accountStore'), _dec$1(_class$8 = mobxReact.observer(_class$8 = class ImportAccountModal extends React.Component {
  static get propTypes() {
    return {
      accountStore: propTypes.any
    };
  }

  constructor(props) {
    super(props);
    this.privateKeyInputRef = React.createRef();
    this.passwordInputRef = React.createRef();
  }

  _onConfirm() {
    const encryptedPrivateKey = this.privateKeyInputRef.current.value;
    const password = this.passwordInputRef.current.value;
    logger.debug("Import account confirm button clicked with", encryptedPrivateKey);
    this.props.accountStore.addAccount(encryptedPrivateKey, password);
  }

  render() {
    return React.createElement(Popup, {
      modal: true,
      trigger: React.createElement(Button, {
        "class": "component-btn-ocean",
        name: "Import"
      })
    }, close => React.createElement("atom-panel", {
      "class": "modal"
    }, React.createElement("div", null, React.createElement(CardTitle, {
      title: "Import account with encrypted private key"
    }), React.createElement(CardRow, null, React.createElement(Description, {
      description: "Private key"
    }), React.createElement(InputBox, {
      ref: this.privateKeyInputRef,
      type: "text",
      placeHolder: "encrypted private key"
    })), React.createElement(CardRow, null, React.createElement(Description, {
      description: "Password"
    }), React.createElement(InputBox, {
      ref: this.passwordInputRef,
      type: "text",
      placeHolder: "password to decrypt encrypted private key"
    })), React.createElement(CardRow, {
      "class": "component-card-row-button-modal"
    }, React.createElement(Button, {
      name: "Cancel",
      onClick: close
    }), React.createElement(Button, {
      "class": "component-btn-rightmost",
      name: "Ok",
      onClick: () => {
        this._onConfirm();

        close();
      }
    })))));
  }

}) || _class$8) || _class$8);

var _dec$2, _class$9;
let NewAccountModal = (_dec$2 = mobxReact.inject('accountStore'), _dec$2(_class$9 = mobxReact.observer(_class$9 = class NewAccountModal extends React.Component {
  static get propTypes() {
    return {
      accountStore: propTypes.any
    };
  }

  constructor(props) {
    super(props);
    this._onConfirm = this._onConfirm.bind(this);
  }

  _onConfirm() {
    logger.debug("New account confirm button clicked");
    this.props.accountStore.newAccount();
  }

  render() {
    return React.createElement(Popup, {
      modal: true,
      trigger: React.createElement(Button, {
        name: "New",
        "class": "component-btn-rightmost"
      })
    }, close => React.createElement("atom-panel", {
      "class": "modal"
    }, React.createElement("div", null, React.createElement(CardTitle, {
      title: "Do you want to make a new account?"
    }), React.createElement(CardRow, {
      "class": "component-card-row-button-modal"
    }, React.createElement(Button, {
      name: "Cancel",
      onClick: close
    }), React.createElement(Button, {
      name: "Ok",
      "class": "component-btn-rightmost",
      onClick: () => {
        this._onConfirm();

        close();
      }
    })))));
  }

}) || _class$9) || _class$9);

var _dec$3, _class$a;
let NewNodeModal = (_dec$3 = mobxReact.inject('nodeStore'), _dec$3(_class$a = mobxReact.observer(_class$a = class NewNodeModal extends React.Component {
  static get propTypes() {
    return {
      nodeStore: propTypes.any
    };
  }

  constructor(props) {
    super(props);
    this.nodetInputRef = React.createRef();
  }

  _onConfirm() {
    logger.debug("Add node button clicked");
    const node = this.nodetInputRef.current.value;
    this.props.nodeStore.addNode(node);
  }

  render() {
    return React.createElement(Popup, {
      modal: true,
      trigger: React.createElement(Button, {
        name: "New",
        "class": "component-btn-rightmost"
      })
    }, close => React.createElement("atom-panel", {
      "class": "modal"
    }, React.createElement("div", null, React.createElement(CardTitle, {
      title: "Enter node endpoint"
    }), React.createElement(CardRow, null, React.createElement(Description, {
      description: "Node"
    }), React.createElement(InputBox, {
      ref: this.nodetInputRef,
      type: "text",
      placeHolder: "eg. 192.168.1.168:7845"
    })), React.createElement(CardRow, {
      "class": "component-card-row-button-modal"
    }, React.createElement(Button, {
      name: "Cancel",
      onClick: close
    }), React.createElement(Button, {
      name: "Ok",
      "class": "component-btn-rightmost",
      onClick: () => {
        this._onConfirm();

        close();
      }
    })))));
  }

}) || _class$a) || _class$a);

var _dec$4, _class$b;
let RemoveAccountModal = (_dec$4 = mobxReact.inject('accountStore'), _dec$4(_class$b = mobxReact.observer(_class$b = class RemoveAccountModal extends React.Component {
  static get propTypes() {
    return {
      accountStore: propTypes.any
    };
  }

  constructor(props) {
    super(props);
    this._onConfirm = this._onConfirm.bind(this);
  }

  _onConfirm() {
    logger.debug("Remove account confirm button clicked");
    const currentAddress = this.props.accountStore.currentAddress;
    this.props.accountStore.removeAccount(currentAddress);
  }

  render() {
    const disabled = "" === this.props.accountStore.currentAddress;
    return React.createElement(Popup, {
      modal: true,
      trigger: React.createElement(Button, {
        name: "Remove",
        disabled: disabled
      })
    }, close => React.createElement("atom-panel", {
      "class": "modal"
    }, React.createElement("div", null, React.createElement(CardTitle, {
      title: "Do you want to remove current account?"
    }), React.createElement(CardRow, {
      "class": "component-card-row-button-modal"
    }, React.createElement(Button, {
      name: "Cancel",
      onClick: close
    }), React.createElement(Button, {
      name: "Ok",
      "class": "component-btn-rightmost",
      onClick: () => {
        this._onConfirm();

        close();
      }
    })))));
  }

}) || _class$b) || _class$b);

var _dec$5, _class$c;
let RemoveNodeModal = (_dec$5 = mobxReact.inject('nodeStore'), _dec$5(_class$c = mobxReact.observer(_class$c = class RemoveNodeModal extends React.Component {
  static get propTypes() {
    return {
      nodeStore: propTypes.any
    };
  }

  constructor(props) {
    super(props);
    this._onConfirm = this._onConfirm.bind(this);
  }

  _onConfirm() {
    logger.debug("Remove node confirm button clicked");
    const node = this.props.nodeStore.currentNode;
    this.props.nodeStore.removeNode(node);
  }

  render() {
    const disabled = "" === this.props.nodeStore.currentNode;
    return React.createElement(Popup, {
      modal: true,
      trigger: React.createElement(Button, {
        name: "Remove",
        disabled: disabled
      })
    }, close => React.createElement("atom-panel", {
      "class": "modal"
    }, React.createElement("div", null, React.createElement(CardTitle, {
      title: "Do you want to remove current node?"
    }), React.createElement(CardRow, {
      "class": "component-card-row-button-modal"
    }, React.createElement(Button, {
      name: "Cancel",
      onClick: close
    }), React.createElement(Button, {
      name: "Ok",
      "class": "component-btn-rightmost",
      onClick: () => {
        this._onConfirm();

        close();
      }
    })))));
  }

}) || _class$c) || _class$c);

const Account$1 = props => {
  const address = props.address;
  const addresses = props.addresses;
  const onAddressChange = props.onAddressChange;
  const onAddressCopy = props.onAddressCopy;
  const balance = props.balance;
  const nonce = props.nonce;
  return React.createElement(FoldableCard, {
    trigger: React.createElement(CardTitle, {
      title: "Account"
    })
  }, React.createElement(AddressSelect, {
    address: address,
    addresses: addresses,
    onAddressChange: onAddressChange,
    onAddressCopy: onAddressCopy
  }), React.createElement(Balance, {
    balance: balance
  }), React.createElement(Nonce, {
    nonce: nonce
  }), React.createElement(CardRow, null, React.createElement(Description, {
    description: ""
  }), React.createElement(reflexbox.Flex, {
    justify: "space-between",
    w: 1
  }, React.createElement(reflexbox.Box, null, React.createElement(ImportAccountModal, null), React.createElement(ExportAccountModal, null)), React.createElement(reflexbox.Box, null, React.createElement(RemoveAccountModal, null), React.createElement(NewAccountModal, null)))));
};
Account$1.propTypes = {
  address: propTypes.string,
  addresses: propTypes.array,
  onAddressChange: propTypes.func,
  onAddressCopy: propTypes.func,
  balance: propTypes.number,
  nonce: propTypes.number
};

class ContractRun extends React.Component {
  static get propTypes() {
    return {
      contractAddress: propTypes.string,
      abi: propTypes.object,
      onAbiExec: propTypes.func,
      onAbiQuery: propTypes.func,
      onContractCopy: propTypes.func,
      onContractRemove: propTypes.func
    };
  }

  constructor(props) {
    super(props);
  }

  render() {
    const contractAddress = this.props.contractAddress;
    const abi = this.props.abi;
    const abiFunctions = abi.functions;
    const onAbiExec = this.props.onAbiExec;
    const onAbiQuery = this.props.onAbiQuery;
    const onContractCopy = this.props.onContractCopy;
    const onContractRemove = this.props.onContractRemove;

    if (typeof abiFunctions === "undefined") {
      return React.createElement("div", null);
    }

    const abiCalls = abiFunctions.filter(f => "constructor" !== f.name).map((abiFunction, index) => {
      const args = abiFunction.arguments.map(a => a.name);
      const payable = abiFunction.payable;
      const runnerName = abiFunction.name;
      let runnerStyle = 'component-btn-transaction';
      let runner = onAbiExec;

      if (abiFunction.view) {
        runnerStyle = '';
        runner = onAbiQuery;
      }

      return React.createElement(ArgumentsAndRunner, {
        key: index,
        args: args,
        payable: payable,
        runnerName: runnerName,
        runnerStyle: runnerStyle,
        runner: argsRef => runner(contractAddress, abi, runnerName, argsRef)
      });
    });
    const trigger = React.createElement(CardTitle, {
      title: contractAddress,
      titleClass: "component-contract-run-title"
    }, React.createElement(CopyIcon, {
      onClick: e => {
        e.stopPropagation();
        onContractCopy(contractAddress);
      }
    }), React.createElement(TrashIcon, {
      onClick: e => {
        e.stopPropagation();
        onContractRemove(contractAddress);
      }
    }));
    return React.createElement(FoldableCard, {
      foldableClass: "before-component-foldable",
      trigger: trigger,
      transitionTime: 1
    }, abiCalls);
  }

}

const Contract = props => {
  const onContractImport = props.onContractImport;
  const onContractCopy = props.onContractCopy;
  const onContractRemove = props.onContractRemove;
  const contractAddress2Abi = props.contractAddress2Abi;
  const onAbiExec = props.onAbiExec;
  const onAbiQuery = props.onAbiQuery;
  let border;

  if (contractAddress2Abi.size !== 0) {
    border = React.createElement(CardRow, {
      "class": "component-card-row-border"
    });
  } // reverse to display recent elememt first


  let contractRuns = Array.from(contractAddress2Abi.keys()).reverse().map(contractAddress => {
    const abi = contractAddress2Abi.get(contractAddress);
    return React.createElement(ContractRun, {
      key: contractAddress,
      contractAddress: contractAddress,
      abi: abi,
      onAbiExec: onAbiExec,
      onAbiQuery: onAbiQuery,
      onContractCopy: onContractCopy,
      onContractRemove: onContractRemove
    });
  });
  const contractInputRef = React.createRef();
  return React.createElement(Card, null, React.createElement(CardTitle, {
    title: "Contract"
  }), React.createElement(CardRow, null, React.createElement(Description, {
    description: "Contract"
  }), React.createElement(InputBox, {
    ref: contractInputRef,
    type: "text",
    placeHolder: "eg. Amg6TQrTd6f7dE67PBzv6vbVDnxpEnzKpRfRbV46NNNDhjqmdk77"
  })), React.createElement(CardRow, null, React.createElement(reflexbox.Flex, {
    justify: "flex-end",
    w: 1
  }, React.createElement(Button, {
    name: "Import",
    "class": "component-btn-ocean",
    onClick: () => onContractImport(contractInputRef)
  }))), border, contractRuns);
};
Contract.propTypes = {
  onContractImport: propTypes.func,
  onContractCopy: propTypes.func,
  onContractRemove: propTypes.func,
  contractAddress2Abi: propTypes.object,
  onAbiExec: propTypes.func,
  onAbiQuery: propTypes.func
};

const Deployment = props => {
  const currentTarget = props.currentTarget;
  const targets = props.targets;
  const onTargetChange = props.onTargetChange;
  const constructorArgs = props.constructorArgs;
  const payable = props.payable;
  const argsRef = React.createRef();
  const onDeploy = props.onDeploy;
  let constructorOrNot;

  if (constructorArgs.length > 0 || payable === true) {
    constructorOrNot = React.createElement(ConstructorArguments, {
      args: constructorArgs,
      payable: payable,
      argsRef: argsRef
    });
  } else {
    constructorOrNot = React.createElement("div", null);
  }

  return React.createElement(FoldableCard, {
    trigger: React.createElement(CardTitle, {
      title: "Deploy"
    })
  }, React.createElement(TargetSelect, {
    target: currentTarget,
    targets: targets,
    onChange: onTargetChange
  }), constructorOrNot, React.createElement(CardRow, null, React.createElement(Description, {
    description: ""
  }), React.createElement(reflexbox.Flex, {
    justify: "flex-end",
    w: 1
  }, React.createElement(Button, {
    name: "Deploy",
    "class": "component-btn-transaction",
    onClick: () => onDeploy(argsRef)
  }))));
};
Deployment.propTypes = {
  currentTarget: propTypes.string,
  targets: propTypes.array,
  onTargetChange: propTypes.func,
  constructorArgs: propTypes.array,
  payable: propTypes.bool,
  onDeploy: propTypes.func
};

const Node = props => {
  const node = props.node;
  const nodes = props.nodes;
  const height = props.height;
  const onNodeChange = props.onNodeChange;
  return React.createElement(FoldableCard, {
    trigger: React.createElement(CardTitle, {
      title: "Node"
    })
  }, React.createElement(NodeSelect, {
    node: node,
    nodes: nodes,
    onChange: onNodeChange
  }), React.createElement(Height, {
    height: height
  }), React.createElement(CardRow, null, React.createElement(Description, {
    description: ""
  }), React.createElement(reflexbox.Flex, {
    justify: "flex-end",
    w: 1
  }, React.createElement(RemoveNodeModal, null), React.createElement(NewNodeModal, null))));
};
Node.propTypes = {
  node: propTypes.string,
  nodes: propTypes.array,
  height: propTypes.number,
  onNodeChange: propTypes.func
};

const Summary = props => {
  const node = props.node;
  const address = props.address;
  const height = props.height;
  const balanceWithUnit = props.balanceWithUnit;
  const nonce = props.nonce;
  return React.createElement(Void, null, React.createElement(Stars, null, React.createElement(StarsRow, null, React.createElement(StarsCell, null, React.createElement(Star, {
    title: "Node",
    content: node
  })), React.createElement(StarsCell, {
    colspan: "2"
  }, React.createElement(Star, {
    title: "Account",
    content: address
  }))), React.createElement(StarsRow, null, React.createElement(StarsCell, null, React.createElement(Star, {
    title: "Height",
    content: height
  })), React.createElement(StarsCell, null, React.createElement(Star, {
    title: "Balance",
    content: balanceWithUnit
  })), React.createElement(StarsCell, null, React.createElement(Star, {
    title: "Nonce",
    content: nonce
  })))));
};
Summary.propTypes = {
  node: propTypes.string,
  address: propTypes.string,
  height: propTypes.number,
  balanceWithUnit: propTypes.number,
  nonce: propTypes.number
};

const TopBar = props => {
  const onCompile = props.onCompile;
  const onRefresh = props.onRefresh;
  return React.createElement(Card, {
    "class": "transparent-background"
  }, React.createElement(CardRow, {
    "class": "component-card-row-top-bar"
  }, React.createElement(Button, {
    name: "Compile",
    "class": "component-btn-top-bar",
    onClick: onCompile
  }), React.createElement(Button, {
    name: "Refresh",
    "class": "component-btn-top-bar",
    onClick: onRefresh
  })));
};
TopBar.propTypes = {
  onCompile: propTypes.func,
  onRefresh: propTypes.func
};

var _dec$6, _class$d;
let RunPanel = (_dec$6 = mobxReact.inject('nodeStore', 'accountStore', 'notificationStore', 'contractStore', 'deployTargetStore'), _dec$6(_class$d = mobxReact.observer(_class$d = class RunPanel extends React.Component {
  static get propTypes() {
    return {
      nodeStore: propTypes.any,
      accountStore: propTypes.any,
      notificationStore: propTypes.any,
      contractStore: propTypes.any,
      deployTargetStore: propTypes.any
    };
  }

  constructor(props) {
    super(props);
    this._onCompileButtonClicked = this._onCompileButtonClicked.bind(this);
    this._onRefresh = this._onRefresh.bind(this);
    this._onNodeUrlChange = this._onNodeUrlChange.bind(this);
    this._onAddressChange = this._onAddressChange.bind(this);
    this._onAddressCopy = this._onAddressCopy.bind(this);
    this._onFileChange = this._onFileChange.bind(this);
    this._onDeployButtonClicked = this._onDeployButtonClicked.bind(this);
    this._onContractImport = this._onContractImport.bind(this);
    this._onContractCopy = this._onContractCopy.bind(this);
    this._onContractRemove = this._onContractRemove.bind(this);
    this._onAbiExec = this._onAbiExec.bind(this);
    this._onAbiQuery = this._onAbiQuery.bind(this);
    this._onError = this._onError.bind(this);
  }

  _onCompileButtonClicked() {
    runWithCallback.call(this, () => {
      logger.debug("Compile contract");

      if (editor.isAnyEditorDirty()) {
        new SaveConfirmView(() => this._compile()).show();
      } else {
        this._compile();
      }
    }, this._onError);
  }

  _onRefresh() {
    logger.info("Sync status");
    this.props.nodeStore.updateNodeState();
    this.props.accountStore.updateAccountState();
  }

  _onNodeUrlChange(selectedNode) {
    logger.info("Node change", selectedNode);
    this.props.nodeStore.changeNode(selectedNode);

    this._onRefresh();
  }

  _onAddressChange(selectedAddress) {
    logger.info("Account address change to", selectedAddress);
    this.props.accountStore.changeAccount(selectedAddress);

    this._onRefresh();
  }

  _onAddressCopy(accountAddress) {
    runWithCallback.call(this, () => {
      logger.debug("Copy address", accountAddress);
      clipboardy.writeSync(accountAddress);
    }, this._onError);
  }

  _onFileChange(selectedFile) {
    runWithCallback.call(this, () => {
      logger.debug("Compiled file change", selectedFile);
      this.props.deployTargetStore.changeTarget(selectedFile);
    }, this._onError);
  }

  _compile() {
    runWithCallback.call(this, () => {
      const baseDir = editor.getProjectRootDir();
      const target = editor.getCurrentByRelative();
      this.props.deployTargetStore.addTarget(baseDir, target);
    }, this._onError);
  }

  _onDeployButtonClicked(argInputRef) {
    runWithCallback.call(this, () => {
      logger.debug("Deploy contract");
      logger.debug("Input ref", argInputRef);
      let constructorArgs = [];
      let amount = "0";

      if (argInputRef.current) {
        constructorArgs = argInputRef.current.values;
        amount = argInputRef.current.amount;
      }

      this.props.contractStore.deployContract(constructorArgs, amount);
    }, this._onError);
  }

  _onContractImport(contractInputRef) {
    logger.debug("Import contract button clicked");
    const contract = contractInputRef.current.value;
    this.props.contractStore.addContract(contract);
  }

  _onContractCopy(contractAddress) {
    runWithCallback.call(this, () => {
      logger.debug("Copy contract", contractAddress);
      clipboardy.writeSync(contractAddress);
    }, this._onError);
  }

  _onContractRemove(contractAddress) {
    runWithCallback.call(this, () => {
      logger.debug("Remove contract", contractAddress);
      this.props.contractStore.removeContract(contractAddress);
    }, this._onError);
  }

  _onAbiExec(contractAddress, abi, targetFunction, argInputRef) {
    runWithCallback.call(this, () => {
      logger.debug("Execute contract");
      logger.debug("Input ref", argInputRef);
      const targetArgs = argInputRef.current.values;
      const amount = argInputRef.current.amount;
      logger.info("Execute contract", targetFunction, "with args", targetArgs);
      this.props.contractStore.executeContract(contractAddress, abi, targetFunction, targetArgs, amount);
    }, this._onError);
  }

  _onAbiQuery(contractAddress, abi, targetFunction, argInputRef) {
    runWithCallback.call(this, () => {
      logger.debug("Query contract");
      logger.debug("Input ref", argInputRef);
      const targetArgs = argInputRef.current.values;
      logger.info("Query contract", targetFunction, "with args", targetArgs);
      this.props.contractStore.queryContract(contractAddress, abi, targetFunction, targetArgs);
    }, this._onError);
  }

  _onError(error) {
    logger.error(error);
    this.props.notificationStore.notify(error, "error");
  }

  render() {
    // summary
    const node = this.props.nodeStore.currentNode;
    const address = this.props.accountStore.currentAddress;
    const height = this.props.nodeStore.currentHeight;
    const balanceWithUnit = this.props.accountStore.currentBalanceWithUnit;
    const nonce = this.props.accountStore.currentNonce; // sync

    const onCompile = this._onCompileButtonClicked;
    const onRefresh = this._onRefresh; // node
    // const node = this.props.nodeStore.currentNode;

    const nodes = this.props.nodeStore.nodes; // const height = this.props.nodeStore.currentHeight;

    const onNodeChange = this._onNodeUrlChange; // address
    // const accountAddress = this.props.accountStore.currentAddress;

    const addresses = this.props.accountStore.addresses;
    const onAddressChange = this._onAddressChange;
    const onAddressCopy = this._onAddressCopy;
    const balance = this.props.accountStore.currentBalance; // const nonce = this.props.accountStore.currentNonce;
    // deployment target

    const currentTarget = this.props.deployTargetStore.currentTarget;
    const targets = this.props.deployTargetStore.targets;
    const onTargetChange = this._onFileChange;
    const onDeploy = this._onDeployButtonClicked;
    const constructorArgs = this.props.deployTargetStore.constructorArgs;
    const payable = this.props.deployTargetStore.isPayable; // contract

    const onContractImport = this._onContractImport;
    const onContractCopy = this._onContractCopy;
    const onContractRemove = this._onContractRemove;
    const contractAddress2Abi = this.props.contractStore.contractAddress2Abi;
    const onAbiExec = this._onAbiExec;
    const onAbiQuery = this._onAbiQuery;
    return React.createElement(Panel, null, React.createElement(Summary, {
      node: node,
      address: address,
      height: height,
      balanceWithUnit: balanceWithUnit,
      nonce: nonce
    }), React.createElement(TopBar, {
      onCompile: onCompile,
      onRefresh: onRefresh
    }), React.createElement(Node, {
      node: node,
      nodes: nodes,
      height: height,
      onNodeChange: onNodeChange
    }), React.createElement(Account$1, {
      address: address,
      addresses: addresses,
      onAddressChange: onAddressChange,
      onAddressCopy: onAddressCopy,
      balance: balance,
      nonce: nonce
    }), React.createElement(Deployment, {
      currentTarget: currentTarget,
      targets: targets,
      onTargetChange: onTargetChange,
      constructorArgs: constructorArgs,
      payable: payable,
      onDeploy: onDeploy
    }), React.createElement(Contract, {
      onContractImport: onContractImport,
      onContractCopy: onContractCopy,
      onContractRemove: onContractRemove,
      contractAddress2Abi: contractAddress2Abi,
      onAbiExec: onAbiExec,
      onAbiQuery: onAbiQuery
    }));
  }

}) || _class$d) || _class$d);

class AthenaIdeViewRoot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0
    };
  }

  render() {
    return React.createElement(RunPanel, null);
  }

}

/* eslint-disable */
class AtheneIdeView {
  constructor(rootStore) {
    this.element = this._buildContainer();
    this.rootView = this._buildRootView();
    this.element.appendChild(this.rootView);
    this.stores = {
      accountStore: rootStore.accountStore,
      consoleStore: rootStore.consoleStore,
      contractStore: rootStore.contractStore,
      deployTargetStore: rootStore.deployTargetStore,
      feeStore: rootStore.feeStore,
      nodeStore: rootStore.nodeStore,
      notificationStore: rootStore.notificationStore
    };
  }

  _buildContainer() {
    const athenaIdeViewContainer = document.createElement('div');
    athenaIdeViewContainer.classList.add('athena-ide-view-container');
    return athenaIdeViewContainer;
  }

  _buildRootView() {
    const athenaIdeView = document.createElement('div');
    athenaIdeView.classList.add('athena-ide-view');
    return athenaIdeView;
  }

  getElement() {
    return this.element;
  }

  getTitle() {
    return 'Athena IDE';
  }

  getPath() {
    return 'athena-ide-view';
  }

  getUri() {
    return `particle-dev://editor/${this.getPath()}`;
  }

  getDefaultLocation() {
    return 'right';
  }

  show() {
    atom.workspace.getRightDock().show();
    atom.workspace.open(this, {
      activatePane: false
    }).then(() => {
      this._draw();
    });
  }

  _draw() {
    if (!this.rootReactNode) {
      this.rootReactNode = ReactDOM.render(React.createElement(mobxReact.Provider, this.stores, React.createElement(AthenaIdeViewRoot, null)), this.rootView);
    }
  }

  distroy() {// TODO : remove view from the right dock
  }

}

/* eslint-disable */
class ConsoleView extends atomSpacePenViews.View {
  static content() {
    this.div({
      id: 'athena-ide-console'
    }, () => {
      this.div({
        "class": 'panel-body view-scroller',
        outlet: 'body'
      }, () => {
        this.pre({
          "class": 'native-key-bindings',
          outlet: 'output',
          tabindex: -1
        });
      });
    });
  }

  constructor(rootStore) {
    super();
    mobx.autorun(() => {
      if (null != rootStore.consoleStore.recent && "" !== rootStore.consoleStore.recent.message) {
        this.log(rootStore.consoleStore.recent);
      }
    });
  }

  getTitle() {
    return 'Athena IDE Console';
  }

  getPath() {
    return 'athena-ide-console-view';
  }

  getUri() {
    return `particle-dev://editor/${this.getPath()}`;
  }

  getDefaultLocation() {
    return 'bottom';
  }

  show() {
    atom.workspace.getBottomDock().show();
    return atom.workspace.open(this, {
      activatePane: false
    });
  }

  distroy() {
    // TODO remove element form dock
    this.clear();
  }

  log(messageAndLevel) {
    this.show().then(() => {
      const message = messageAndLevel.message.toString();
      const level = messageAndLevel.level;

      const messageWithTime = this._wrapTime(message);

      this.output.append(atomSpacePenViews.$$(function () {
        this.div({
          "class": `level-${level}`
        }, messageWithTime);
      }));
      this.body.scrollToBottom();
    });
  }

  _wrapTime(message) {
    const date = new Date();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    const timeInfo = [hour, minute, second].map(m => m < 10 ? "0" + m : m).join(":");
    return timeInfo + " " + message.toString();
  }

  clear() {
    this.output.empty();
  }

}

/* eslint-disable */
var editor = {
  hasActiveEditor() {
    return typeof atom.workspace.getActiveTextEditor() !== "undefined";
  },

  getProjectRootDir() {
    const pathInfos = atom.project.relativizePath(this.getCurrentByAbsolute());
    return pathInfos[0];
  },

  getCurrentByAbsolute() {
    if (!this.hasActiveEditor()) {
      return undefined;
    }

    return atom.workspace.getActiveTextEditor().getBuffer().getPath();
  },

  getCurrentByRelative() {
    if (!this.hasActiveEditor()) {
      return undefined;
    }

    return this.getRelative(this.getCurrentByAbsolute());
  },

  isAnyEditorDirty() {
    return this.getModifiedEditors().length > 0;
  },

  getModifiedEditors() {
    return atom.workspace.getTextEditors().filter(e => e.isModified());
  },

  getModifiedEditorsPath() {
    return this.getModifiedEditors().map(e => e.getBuffer().getPath()).map(a => this.getRelative(a));
  },

  getBaseDirAndRelativePath(absolutePath) {
    return atom.project.relativizePath(absolutePath);
  },

  getRelative(absolutePath) {
    return this.getBaseDirAndRelativePath(absolutePath)[1];
  }

};

/* eslint-disable */
class NotificationView {
  constructor(rootStore) {
    mobx.autorun(() => {
      if (null != rootStore.notificationStore.recent && "" !== rootStore.notificationStore.recent.message) {
        this.notify(rootStore.notificationStore.recent);
      }
    });
  }

  notify(messageAndLevel) {
    const message = messageAndLevel.message.toString();
    const level = messageAndLevel.level;

    switch (level) {
      case 'success':
        this._notifySuccess(message);

        break;

      case 'info':
        this._notifyInfo(message);

        break;

      case 'warn':
        this._notifyWarn(message);

        break;

      case 'error':
        this._notifyError(message);

        break;

      case 'fatal':
        this._notifyFatalError(message);

        break;

      default:
        const error = "Unrecognized message type" + level;
        logger.error(error);

        this._notifyError(error);

        break;
    }
  }

  _notifySuccess(message) {
    atom.notifications.addSuccess(message);
  }

  _notifyInfo(message) {
    atom.notifications.addInfo(message);
  }

  _notifyWarn(message) {
    atom.notifications.addWarning(message);
  }

  _notifyError(message) {
    atom.notifications.addError(message);
  }

  _notifyFatalError(message) {
    atom.notifications.addFatalError(message);
  }

  distroy() {// do nothing
  }

}

/* eslint-disable */
class SaveConfirmView {
  constructor(callback) {
    this.callback = callback;
  }

  show() {
    atom.confirm({
      message: "Do you want to save file before compile?",
      detail: editor.getModifiedEditorsPath().reduce((pre, curr, index) => {
        if (0 === index) {
          return curr;
        }

        return pre + "\n" + curr;
      }),
      buttons: ["Ok", "Cancel"]
    }, response => {
      if (response === 0) {
        Promise.all(editor.getModifiedEditors().map(e => e.save())).then(() => {
          if (this.callback) {
            this.callback();
          }
        });
      }
    });
  }

}

// atom provider suggestion types
// see also https://github.com/atom/autocomplete-plus/wiki/Provider-API
const ATOM_SUGGESTION_VARIABLE = "variable";
const ATOM_SUGGESTION_METHOD = "method";
const ATOM_SUGGESTION_FUNCTION = "function";
const ATOM_SUGGESTION_SNIPPET = "snippet";
// see also https://github.com/steelbrain/linter/blob/master/docs/types/linter-message-v2.md

const ATOM_LINTER_SEVERITY_ERROR = "error";
const ATOM_LINTER_SEVERITY_WARN = "warning";

function adaptSuggestionToAtom(suggestion, replacementPrefix) {
  const athenaSymbolKind = suggestion.kind;
  let atomSymbolKind = athenaSymbolKind;

  switch (athenaSymbolKind) {
    case athenaAnalysis.SuggestionKind.Variable:
    case athenaAnalysis.SuggestionKind.System:
      atomSymbolKind = ATOM_SUGGESTION_VARIABLE;
      break;

    case athenaAnalysis.SuggestionKind.Function:
      atomSymbolKind = ATOM_SUGGESTION_FUNCTION;
      break;

    case athenaAnalysis.SuggestionKind.Member:
      atomSymbolKind = ATOM_SUGGESTION_METHOD;
      break;

    case athenaAnalysis.SuggestionKind.Snippet:
      atomSymbolKind = ATOM_SUGGESTION_SNIPPET;
      break;
  }

  return {
    snippet: suggestion.snippet,
    type: atomSymbolKind,
    leftLabel: suggestion.prefix,
    rightLabel: suggestion.type,
    replacementPrefix: replacementPrefix
  };
}
function adaptLintToAtom(file, lint, indexToPosition, indexToLineEndingPosition) {
  const athenaLintKind = lint.kind;
  let atomLintType = undefined;

  switch (athenaLintKind) {
    case athenaAnalysis.LintKind.Warn:
      atomLintType = ATOM_LINTER_SEVERITY_WARN;
      break;

    case athenaAnalysis.LintKind.Error:
      atomLintType = ATOM_LINTER_SEVERITY_ERROR;
      break;
  }

  return {
    severity: atomLintType,
    location: {
      file: file,
      position: [indexToPosition(lint.index), indexToLineEndingPosition(lint.index)]
    },
    excerpt: lint.message
  };
}

const prefixParsingEnd = [";", "(", ")", "{", "}"];
class AutoCompleteProvider {
  constructor() {
    this.selector = '.source.lua';
    this.disableForSelector = '.source.lua .comment';
    this.inclusionPriority = 1;
    this.excludeLowerPriority = true;
    this.autoCompleteService = new AutoCompleteService();
  }

  getSuggestions(request) {
    logger.debug("Resolve suggestions with", request); // resolve origin prefix info in editor

    const textBuffer = request.editor.getBuffer();
    const cursorPosition = request.bufferPosition;
    const originPrefix = request.prefix;
    const originPrefixEndIndex = textBuffer.characterIndexForPosition(request.bufferPosition);
    const originPrefixStartIndex = originPrefixEndIndex - originPrefix.length;
    logger.debug("Origin prefix:", originPrefix, "start index:", originPrefixStartIndex, "end index:", originPrefixEndIndex); // parse prefix info in line

    const currentLineStartIndex = textBuffer.characterIndexForPosition({
      row: cursorPosition.row,
      column: 0
    });
    const originPrefixStart = originPrefixStartIndex - currentLineStartIndex;
    const currentLine = textBuffer.lineForRow(cursorPosition.row);

    const prefixInfo = this._resolvePrefix(originPrefix, originPrefixStart, currentLine);

    logger.debug("Parsed prefix:", prefixInfo.prefix); // trim parsed prefix from source

    const textInIndex = (startIndex, endIndex) => {
      const range = [textBuffer.positionForCharacterIndex(startIndex), textBuffer.positionForCharacterIndex(endIndex)];
      return textBuffer.getTextInRange(range);
    };

    const prefixStartIndex = currentLineStartIndex + prefixInfo.prefixStart;
    const prefixEndIndex = originPrefixEndIndex;
    const lastSourceIndex = textBuffer.getMaxCharacterIndex();
    const source = textInIndex(0, prefixStartIndex) + textInIndex(prefixEndIndex, lastSourceIndex);
    const filePath = textBuffer.getPath(); // TODO : why only "-" cause replacement prefix malfunction

    let replacementPrefix = originPrefix;

    if (prefixInfo.prefix === "-") {
      replacementPrefix = "-";
    }

    return this.autoCompleteService.suggest(source, filePath, prefixInfo.prefix, prefixStartIndex).then(rawSuggestions => {
      logger.debug("Raw suggestions:", rawSuggestions);
      const atomSuggestions = rawSuggestions.map(suggestion => adaptSuggestionToAtom(suggestion, replacementPrefix));
      logger.info("Atom suggestions:", atomSuggestions);
      return atomSuggestions;
    });
  }

  _resolvePrefix(originPrefix, originPrefixStart, line) {
    let prefix = "";
    let buffer = originPrefix;
    let cannotFillBuffer = false;
    let index = originPrefixStart - 1;
    logger.debug("Member tracking from: ", index);

    while (index >= 0 && prefixParsingEnd.indexOf(line[index]) === -1) {
      if (line[index] === " ") {
        if (buffer.length > 0) {
          cannotFillBuffer = true;
        }
      } else if (line[index] === ".") {
        if (0 === buffer.length) break;
        prefix = "." + buffer + prefix;
        buffer = "";
        cannotFillBuffer = false;
      } else {
        // meet character after whitespace when buffer is filled
        if (cannotFillBuffer) break;
        buffer = line[index] + buffer;
      }

      --index;
    }

    prefix = buffer + prefix;
    return {
      prefix: prefix,
      prefixStart: index + 1
    };
  }

}

class LintProvider {
  constructor() {
    this.name = 'Lua linter';
    this.scope = 'file'; // or 'project'

    this.lintsOnChange = false;
    this.grammarScopes = ['source.lua'];
    this.lintService = new LintService();
  }

  lint(textEditor) {
    const textBuffer = textEditor.getBuffer();
    const source = textBuffer.getText();
    const filePath = textBuffer.getPath();
    logger.debug("Lint request with", filePath);

    const indexToPosition = index => textBuffer.positionForCharacterIndex(index);

    const indexToLineEndingPotision = index => {
      const position = textBuffer.positionForCharacterIndex(index);
      const indexToLineEnding = textBuffer.lineLengthForRow(position.row) - position.column;
      return indexToPosition(index + indexToLineEnding);
    };

    return this.lintService.lint(source, filePath).then(rawLints => {
      logger.debug("Raw lints:", rawLints);
      const atomLints = rawLints.map(lint => adaptLintToAtom(filePath, lint, indexToPosition, indexToLineEndingPotision));
      logger.info("Atom lints:", atomLints);
      return atomLints;
    });
  }

}

/* eslint-disable */
class Subscriptions {
  constructor(rootStore, views) {
    this.rootStore = rootStore;
    this.views = views;
    this.subscriptions = this._buildSubscriptions();
  }

  _buildSubscriptions() {
    const subscriptions = new atom$1.CompositeDisposable();
    subscriptions.add(atom.commands.add('atom-text-editor', {
      'athena-ide:compile': () => {
        this._show();

        if (editor.isAnyEditorDirty()) {
          new SaveConfirmView(() => this._compile()).show();
        } else {
          this._compile();
        }
      }
    }), atom.commands.add('atom-workspace', {
      'athena-ide-view:show': () => {
        this._show();
      }
    }));
    return subscriptions;
  }

  _show() {
    this.views.athenaIdeView.show();
    this.views.consoleView.show();
  }

  _compile() {
    const baseDir = editor.getProjectRootDir();
    const target = editor.getCurrentByRelative();
    this.rootStore.deployTargetStore.addTarget(baseDir, target);
  }

  _isContractTarget(path) {
    return /\/\S+\.(lua|ascl)$/.test(path);
  }

  dispose() {
    this.subscriptions.dispose();
  }

}

var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
var inited = false;
function init () {
  inited = true;
  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i];
    revLookup[code.charCodeAt(i)] = i;
  }

  revLookup['-'.charCodeAt(0)] = 62;
  revLookup['_'.charCodeAt(0)] = 63;
}

function toByteArray (b64) {
  if (!inited) {
    init();
  }
  var i, j, l, tmp, placeHolders, arr;
  var len = b64.length;

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0;

  // base64 is 4/3 + up to two characters of the original data
  arr = new Arr(len * 3 / 4 - placeHolders);

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len;

  var L = 0;

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)];
    arr[L++] = (tmp >> 16) & 0xFF;
    arr[L++] = (tmp >> 8) & 0xFF;
    arr[L++] = tmp & 0xFF;
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4);
    arr[L++] = tmp & 0xFF;
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2);
    arr[L++] = (tmp >> 8) & 0xFF;
    arr[L++] = tmp & 0xFF;
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp;
  var output = [];
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
    output.push(tripletToBase64(tmp));
  }
  return output.join('')
}

function fromByteArray (uint8) {
  if (!inited) {
    init();
  }
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
  var output = '';
  var parts = [];
  var maxChunkLength = 16383; // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)));
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    output += lookup[tmp >> 2];
    output += lookup[(tmp << 4) & 0x3F];
    output += '==';
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1]);
    output += lookup[tmp >> 10];
    output += lookup[(tmp >> 4) & 0x3F];
    output += lookup[(tmp << 2) & 0x3F];
    output += '=';
  }

  parts.push(output);

  return parts.join('')
}

var base64 = /*#__PURE__*/Object.freeze({
  toByteArray: toByteArray,
  fromByteArray: fromByteArray
});

function read (buffer, offset, isLE, mLen, nBytes) {
  var e, m;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = -7;
  var i = isLE ? (nBytes - 1) : 0;
  var d = isLE ? -1 : 1;
  var s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

function write (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0);
  var i = isLE ? 0 : (nBytes - 1);
  var d = isLE ? 1 : -1;
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128;
}

var toString = {}.toString;

var isArray = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

var INSPECT_MAX_BYTES = 50;

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global$1.TYPED_ARRAY_SUPPORT !== undefined
  ? global$1.TYPED_ARRAY_SUPPORT
  : true;

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length);
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length);
    }
    that.length = length;
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192; // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype;
  return arr
};

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
};

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype;
  Buffer.__proto__ = Uint8Array;
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size);
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
};

function allocUnsafe (that, size) {
  assertSize(size);
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0;
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
};
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
};

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8';
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0;
  that = createBuffer(that, length);

  var actual = that.write(string, encoding);

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual);
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0;
  that = createBuffer(that, length);
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255;
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength; // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array);
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset);
  } else {
    array = new Uint8Array(array, byteOffset, length);
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array;
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array);
  }
  return that
}

function fromObject (that, obj) {
  if (internalIsBuffer(obj)) {
    var len = checked(obj.length) | 0;
    that = createBuffer(that, len);

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len);
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}
Buffer.isBuffer = isBuffer;
function internalIsBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!internalIsBuffer(a) || !internalIsBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
};

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
};

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i;
  if (length === undefined) {
    length = 0;
    for (i = 0; i < list.length; ++i) {
      length += list[i].length;
    }
  }

  var buffer = Buffer.allocUnsafe(length);
  var pos = 0;
  for (i = 0; i < list.length; ++i) {
    var buf = list[i];
    if (!internalIsBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos);
    pos += buf.length;
  }
  return buffer
};

function byteLength (string, encoding) {
  if (internalIsBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string;
  }

  var len = string.length;
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
}
Buffer.byteLength = byteLength;

function slowToString (encoding, start, end) {
  var loweredCase = false;

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0;
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length;
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0;
  start >>>= 0;

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8';

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase();
        loweredCase = true;
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true;

function swap (b, n, m) {
  var i = b[n];
  b[n] = b[m];
  b[m] = i;
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length;
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1);
  }
  return this
};

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length;
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3);
    swap(this, i + 1, i + 2);
  }
  return this
};

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length;
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7);
    swap(this, i + 1, i + 6);
    swap(this, i + 2, i + 5);
    swap(this, i + 3, i + 4);
  }
  return this
};

Buffer.prototype.toString = function toString () {
  var length = this.length | 0;
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
};

Buffer.prototype.equals = function equals (b) {
  if (!internalIsBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
};

Buffer.prototype.inspect = function inspect () {
  var str = '';
  var max = INSPECT_MAX_BYTES;
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
    if (this.length > max) str += ' ... ';
  }
  return '<Buffer ' + str + '>'
};

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!internalIsBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0;
  }
  if (end === undefined) {
    end = target ? target.length : 0;
  }
  if (thisStart === undefined) {
    thisStart = 0;
  }
  if (thisEnd === undefined) {
    thisEnd = this.length;
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0;
  end >>>= 0;
  thisStart >>>= 0;
  thisEnd >>>= 0;

  if (this === target) return 0

  var x = thisEnd - thisStart;
  var y = end - start;
  var len = Math.min(x, y);

  var thisCopy = this.slice(thisStart, thisEnd);
  var targetCopy = target.slice(start, end);

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i];
      y = targetCopy[i];
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
};

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset;
    byteOffset = 0;
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff;
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000;
  }
  byteOffset = +byteOffset;  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1);
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1;
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0;
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding);
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (internalIsBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF; // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1;
  var arrLength = arr.length;
  var valLength = val.length;

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase();
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2;
      arrLength /= 2;
      valLength /= 2;
      byteOffset /= 2;
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i;
  if (dir) {
    var foundIndex = -1;
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i;
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex;
        foundIndex = -1;
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
    for (i = byteOffset; i >= 0; i--) {
      var found = true;
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false;
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
};

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
};

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
};

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0;
  var remaining = buf.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = Number(length);
    if (length > remaining) {
      length = remaining;
    }
  }

  // must be an even number of digits
  var strLen = string.length;
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2;
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16);
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed;
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8';
    length = this.length;
    offset = 0;
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset;
    length = this.length;
    offset = 0;
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0;
    if (isFinite(length)) {
      length = length | 0;
      if (encoding === undefined) encoding = 'utf8';
    } else {
      encoding = length;
      length = undefined;
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset;
  if (length === undefined || length > remaining) length = remaining;

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8';

  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
};

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
};

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return fromByteArray(buf)
  } else {
    return fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end);
  var res = [];

  var i = start;
  while (i < end) {
    var firstByte = buf[i];
    var codePoint = null;
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1;

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint;

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte;
          }
          break
        case 2:
          secondByte = buf[i + 1];
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F);
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint;
            }
          }
          break
        case 3:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F);
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint;
            }
          }
          break
        case 4:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          fourthByte = buf[i + 3];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F);
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint;
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD;
      bytesPerSequence = 1;
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000;
      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
      codePoint = 0xDC00 | codePoint & 0x3FF;
    }

    res.push(codePoint);
    i += bytesPerSequence;
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000;

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length;
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = '';
  var i = 0;
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    );
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F);
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i]);
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length;

  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;

  var out = '';
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i]);
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end);
  var res = '';
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length;
  start = ~~start;
  end = end === undefined ? len : ~~end;

  if (start < 0) {
    start += len;
    if (start < 0) start = 0;
  } else if (start > len) {
    start = len;
  }

  if (end < 0) {
    end += len;
    if (end < 0) end = 0;
  } else if (end > len) {
    end = len;
  }

  if (end < start) end = start;

  var newBuf;
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end);
    newBuf.__proto__ = Buffer.prototype;
  } else {
    var sliceLen = end - start;
    newBuf = new Buffer(sliceLen, undefined);
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start];
    }
  }

  return newBuf
};

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }

  return val
};

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length);
  }

  var val = this[offset + --byteLength];
  var mul = 1;
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul;
  }

  return val
};

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  return this[offset]
};

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return this[offset] | (this[offset + 1] << 8)
};

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return (this[offset] << 8) | this[offset + 1]
};

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
};

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
};

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val
};

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var i = byteLength;
  var mul = 1;
  var val = this[offset + --i];
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val
};

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
};

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset] | (this[offset + 1] << 8);
  return (val & 0x8000) ? val | 0xFFFF0000 : val
};

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset + 1] | (this[offset] << 8);
  return (val & 0x8000) ? val | 0xFFFF0000 : val
};

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
};

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
};

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return read(this, offset, true, 23, 4)
};

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return read(this, offset, false, 23, 4)
};

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return read(this, offset, true, 52, 8)
};

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return read(this, offset, false, 52, 8)
};

function checkInt (buf, value, offset, ext, max, min) {
  if (!internalIsBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var mul = 1;
  var i = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var i = byteLength - 1;
  var mul = 1;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  this[offset] = (value & 0xff);
  return offset + 1
};

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8;
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2
};

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8);
    this[offset + 1] = (value & 0xff);
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2
};

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff;
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24);
    this[offset + 2] = (value >>> 16);
    this[offset + 1] = (value >>> 8);
    this[offset] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4
};

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24);
    this[offset + 1] = (value >>> 16);
    this[offset + 2] = (value >>> 8);
    this[offset + 3] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4
};

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = 0;
  var mul = 1;
  var sub = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = byteLength - 1;
  var mul = 1;
  var sub = 0;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  if (value < 0) value = 0xff + value + 1;
  this[offset] = (value & 0xff);
  return offset + 1
};

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2
};

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8);
    this[offset + 1] = (value & 0xff);
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2
};

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
    this[offset + 2] = (value >>> 16);
    this[offset + 3] = (value >>> 24);
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4
};

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (value < 0) value = 0xffffffff + value + 1;
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24);
    this[offset + 1] = (value >>> 16);
    this[offset + 2] = (value >>> 8);
    this[offset + 3] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4
};

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38);
  }
  write(buf, value, offset, littleEndian, 23, 4);
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
};

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
};

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308);
  }
  write(buf, value, offset, littleEndian, 52, 8);
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
};

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
};

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0;
  if (!end && end !== 0) end = this.length;
  if (targetStart >= target.length) targetStart = target.length;
  if (!targetStart) targetStart = 0;
  if (end > 0 && end < start) end = start;

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length;
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start;
  }

  var len = end - start;
  var i;

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start];
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start];
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    );
  }

  return len
};

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start;
      start = 0;
      end = this.length;
    } else if (typeof end === 'string') {
      encoding = end;
      end = this.length;
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0);
      if (code < 256) {
        val = code;
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255;
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0;
  end = end === undefined ? this.length : end >>> 0;

  if (!val) val = 0;

  var i;
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val;
    }
  } else {
    var bytes = internalIsBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString());
    var len = bytes.length;
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len];
    }
  }

  return this
};

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '');
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '=';
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity;
  var codePoint;
  var length = string.length;
  var leadSurrogate = null;
  var bytes = [];

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i);

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue
        }

        // valid lead
        leadSurrogate = codePoint;

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
        leadSurrogate = codePoint;
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
    }

    leadSurrogate = null;

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint);
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      );
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      );
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      );
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF);
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo;
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i);
    hi = c >> 8;
    lo = c % 256;
    byteArray.push(lo);
    byteArray.push(hi);
  }

  return byteArray
}


function base64ToBytes (str) {
  return toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i];
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}


// the following is from is-buffer, also by Feross Aboukhadijeh and with same lisence
// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
function isBuffer(obj) {
  return obj != null && (!!obj._isBuffer || isFastBuffer(obj) || isSlowBuffer(obj))
}

function isFastBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isFastBuffer(obj.slice(0, 0))
}

// Unique ID creation requires a high quality random # generator.  In node.js
// this is pretty straight-forward - we use the crypto API.



var rng = function nodeRNG() {
  return crypto.randomBytes(16);
};

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
  return ([bth[buf[i++]], bth[buf[i++]], 
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]],
	bth[buf[i++]], bth[buf[i++]],
	bth[buf[i++]], bth[buf[i++]]]).join('');
}

var bytesToUuid_1 = bytesToUuid;

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options === 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid_1(rnds);
}

var v4_1 = v4;

var assertString_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = assertString;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function assertString(input) {
  var isString = typeof input === 'string' || input instanceof String;

  if (!isString) {
    var invalidType;

    if (input === null) {
      invalidType = 'null';
    } else {
      invalidType = _typeof(input);

      if (invalidType === 'object' && input.constructor && input.constructor.hasOwnProperty('name')) {
        invalidType = input.constructor.name;
      } else {
        invalidType = "a ".concat(invalidType);
      }
    }

    throw new TypeError("Expected string but received ".concat(invalidType, "."));
  }
}

module.exports = exports.default;
module.exports.default = exports.default;
});

unwrapExports(assertString_1);

var isUUID_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isUUID;

var _assertString = _interopRequireDefault(assertString_1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var uuid = {
  3: /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
  4: /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
  5: /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
  all: /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i
};

function isUUID(str) {
  var version = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'all';
  (0, _assertString.default)(str);
  var pattern = uuid[version];
  return pattern && pattern.test(str);
}

module.exports = exports.default;
module.exports.default = exports.default;
});

var isUUID = unwrapExports(isUUID_1);

const ACCOUNT_ID = "UA-139075431-1";
const AERGO_TOOLS_DIR = "/.aergo_tools";
const ATHENA_USER_ID = "athena_userid";

class GoogleAnalytics {
  constructor() {
    const aergoToolsDir = os.homedir() + AERGO_TOOLS_DIR;
    const athenaUserId = aergoToolsDir + "/" + ATHENA_USER_ID;

    if (!fs.existsSync(aergoToolsDir)) {
      fs.mkdirSync(aergoToolsDir);
    }

    if (!fs.existsSync(athenaUserId)) {
      fs.writeFileSync(athenaUserId, new Buffer(v4_1()));
    }

    let uuid = fs.readFileSync(athenaUserId).toString('utf-8');

    if (!isUUID(uuid)) {
      logger.info("uuid", uuid, "is invalid. creating new one");
      uuid = v4_1();
      fs.writeFileSync(athenaUserId, new Buffer(uuid));
    }

    logger.info("Athena user uuid", uuid);
    this.visitor = ua(ACCOUNT_ID, uuid);
  }

  event(category, action, label) {
    this.visitor.event(category, action, label).send();
  }

}

var googleAnalytics = new GoogleAnalytics();

/* eslint-disable */

const packageVersion = require("../package.json").version;

var container = {
  rootStore: null,
  views: null,
  subscriptions: null,
  autoCompleteProvider: new AutoCompleteProvider(),
  lintProvider: new LintProvider(),
  config: {
    enableGoogleAnalytics: {
      title: "Enable google analytics",
      description: "Send anonymous usage statistics for improvement.",
      type: "boolean",
      "default": true,
      order: 1
    }
  },

  activate(state) {
    atomPackageDeps.install('athena-ide-atom').then(() => {
      logger.info("All dependeicies are installed");
      this.rootStore = new RootStore();
      this.views = this._buildViews(this.rootStore);
      this.subscriptions = new Subscriptions(this.rootStore, this.views);

      this._setupGoogleAnalytics();

      if (state) {
        atom.deserializers.deserialize(state);
      }
    })["catch"](err => {
      logger.error(err);
    });
  },

  _buildViews(rootStore) {
    return {
      athenaIdeView: new AtheneIdeView(rootStore),
      consoleView: new ConsoleView(rootStore),
      notificationView: new NotificationView(rootStore)
    };
  },

  _setupGoogleAnalytics() {
    let isEnabled = atom.config.get("athena-ide-atom.enableGoogleAnalytics");

    if (isEnabled) {
      logger.info("Google analytics is enabled");
      logger.info("Package version", packageVersion);
      googleAnalytics.event("Athena IDE Atom", "Open", packageVersion);
    }
  },

  deserializeStores(data) {
    logger.info("Deserialize", data);
    this.rootStore.deserialize(data);
  },

  serialize() {
    const data = this.rootStore.serialize();
    return {
      deserializer: "RootStore",
      data: data
    };
  },

  deactivate() {
    Object.keys(this.views).forEach(key => this.views[key].distroy());
    this.views = null;
    this.subscriptions.dispose();
    this.subscriptions = null;
  },

  getProvider() {
    return this.autoCompleteProvider;
  },

  getLinter() {
    return this.lintProvider;
  }

};

module.exports = container;
