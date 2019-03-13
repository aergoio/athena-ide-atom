'use babel';

/* eslint-disable */

import {CompositeDisposable} from 'atom';
import {install} from 'atom-package-deps';
import logger from 'loglevel';

import compileResultStore from './store/compile-result-store';
import {AutoCompleteProvider, LintProvider, AthenaIdeView, ConsoleView, NotificationView} from './view';

export default {

  views: {},
  subscriptions: null,

  autoCompleteProvider: new AutoCompleteProvider(),
  lintProvider: new LintProvider(),

  activate(state) {
    install('athena-ide-atom').then(() => {
      logger.info("All dependeicies are installed");
    }).catch(err => {
      logger.error(err);
    });
    this.views = this._buildViews();
    this.subscriptions = this._buildSubscriptions();
  },

  deactivate() {
    Object.keys(this.views).forEach(key => this.views[key].distroy());
    this.views = null;
    this.subscriptions.dispose();
    this.subscriptions = null;
  },

  _buildViews() {
    return {
      athenaIdeView: new AthenaIdeView(),
      consoleView: new ConsoleView(),
      notificationView: new NotificationView()
    };
  },

  _buildSubscriptions() {
    const subscriptions = new CompositeDisposable();
    subscriptions.add(atom.commands.add('atom-text-editor', {
      'athena-ide:compile': () => {
        const absolutePath = atom.workspace.getActiveTextEditor().getBuffer().getPath();
        const pathInfo = atom.project.relativizePath(absolutePath);
        const projectRoot = pathInfo[0];
        const relativePath = pathInfo[1];
        this._show();
        compileResultStore.addCompileResult(projectRoot, relativePath);
      }
    }));
    subscriptions.add(atom.commands.add('atom-workspace', {
      'athena-ide-view:show': () => {
        this._show();
      }
    }));
    return subscriptions;
  },

  _show() {
    this.views.athenaIdeView.show();
    this.views.consoleView.show();
  },

  getProvider () {
    return this.autoCompleteProvider;
  },

  getLinter () {
    return this.lintProvider;
  },

};