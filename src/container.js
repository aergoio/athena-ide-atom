'use babel';

/* eslint-disable */

import {CompositeDisposable} from 'atom';

import {EventDispatcher} from './event';
import {
  AutoCompleteService, LintService,
  CompileService, NodeService, AccountService, ContractService
} from './service';
import {AutoCompleteProvider, LintProvider, AthenaIdeView, ConsoleView} from './view';

export default {

  eventDispatcher: null,
  services: {},
  views: {},
  subscriptions: null,

  // keep two provider as singleton since we can't control its view directly
  autoCompleteProvider: new AutoCompleteProvider(),
  lintProvider: new LintProvider(),

  activate(state) {
    this.eventDispatcher = new EventDispatcher();
    this.services = this._buildServices(this.eventDispatcher);
    this.views = this._buildViews(this.services);
    this.eventDispatcher.setupListeners(this.views);
    this.subscriptions = this._buildSubscriptions();
  },

  deactivate() {
    this.eventDispatcher = null;
    Object.keys(this.views).forEach(key => this.views[key].distroy());
    this.views = null;
    this.services = null;
    this.subscriptions.dispose();
    this.subscriptions = null;
  },

  _buildServices(eventDispatcher) {
    const nodeService = new NodeService(eventDispatcher);
    const accountService = new AccountService(nodeService, eventDispatcher);
    return {
      autoCompleteService: new AutoCompleteService(eventDispatcher),
      lintService: new LintService(eventDispatcher),
      compileService: new CompileService(eventDispatcher),
      nodeService: nodeService,
      accountService: accountService,
      contractService: new ContractService(nodeService, accountService, eventDispatcher)
    };
  },

  _buildViews(services) {
    // two providers are considerd as view
    this.autoCompleteProvider.bindServices(services);
    this.lintProvider.bindServices(services);
    return {
      athenaIdeView: new AthenaIdeView(services),
      consoleView: new ConsoleView()
    };
  },

  _buildSubscriptions() {
    const subscriptions = new CompositeDisposable();
    subscriptions.add(atom.commands.add('atom-text-editor', {
      'athena-ide:compile': () => {
        const filePath = atom.workspace.getActiveTextEditor().getBuffer().getPath();
        this.services.compileService.compile(filePath);
      }
    }));
    subscriptions.add(atom.commands.add('atom-workspace', {
      'athena-ide-view:show': () => {
        this.views.athenaIdeView.show();
      }
    }));
    return subscriptions;
  },

  getProvider () {
    return this.autoCompleteProvider;
  },

  getLinter () {
    return this.lintProvider;
  },

};