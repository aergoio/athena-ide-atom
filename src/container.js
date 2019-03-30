'use babel';

/* eslint-disable */

import {CompositeDisposable} from 'atom';
import {install} from 'atom-package-deps';
import logger from 'loglevel';

import RootStore from './store';
import {
  AthenaIdeView, AutoCompleteProvider, ConsoleView, LintProvider, NotificationView, SaveConfirmView
} from './view';
import { editor } from './view';

export default {

  rootStore: null,
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
    this.rootStore = new RootStore();
    this.views = this._buildViews(this.rootStore);
    this.subscriptions = this._buildSubscriptions();
    if (state) {
      atom.deserializers.deserialize(state);
    }
    this._setupRootDir();
  },

  _buildViews(rootStore) {
    return {
      athenaIdeView: new AthenaIdeView(rootStore),
      consoleView: new ConsoleView(rootStore),
      notificationView: new NotificationView(rootStore)
    };
  },

  _buildSubscriptions() {
    const subscriptions = new CompositeDisposable();
    subscriptions.add(atom.commands.add('atom-text-editor', {
      'athena-ide:compile': () => {
        if (editor.isAnyEditorDirty()) {
          new SaveConfirmView(() => this._compile()).show();
        } else {
          this._compile();
        }
     }
    }));
    subscriptions.add(atom.commands.add('atom-workspace', {
      'athena-ide-view:show': () => {
        this._show();
      }
    }));
    return subscriptions;
  },

  _compile() {
    this._show();
    this.rootStore.compileResultStore.changeFile(editor.getCurrentByRelative());
    this.rootStore.compileResultStore.compileWithCurrent();
  },

  _show() {
    this.views.athenaIdeView.show();
    this.views.consoleView.show();
  },

  _setupRootDir() {
    this.rootStore.compileResultStore.setRootDir(editor.getProjectRootDir());
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

  getProvider () {
    return this.autoCompleteProvider;
  },

  getLinter () {
    return this.lintProvider;
  },

};