'use babel';

/* eslint-disable */

import {CompositeDisposable, TextEditor} from 'atom';
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
    subscriptions.add(
      atom.commands.add('atom-text-editor', {
        'athena-ide:compile': () => {
          if (editor.isAnyEditorDirty()) {
            new SaveConfirmView(() => this._compile()).show();
          } else {
            this._compile();
          }
      }
      }),
      atom.commands.add('atom-workspace', {
        'athena-ide-view:show': () => {
          this._show();
        }
      }),
      atom.workspace.observeTextEditors(activeEditor => {
        const targetAbsolute = activeEditor.getBuffer().getPath();
        if (this._isContractTarget(targetAbsolute)) {
          const baseDirAndRelative = editor.getBaseDirAndRelativePath(targetAbsolute);
          this.rootStore.deployTargetStore.addTarget(baseDirAndRelative[1], baseDirAndRelative[0]);
          this.rootStore.deployTargetStore.changeTarget(baseDirAndRelative[1]);
        }
      }),
      atom.workspace.onDidChangeActiveTextEditor(activeEditor => {
        if (typeof activeEditor === "undefined") {
          this.rootStore.deployTargetStore.changeTarget("");
          return;
        }

        const targetAbsolute = activeEditor.getBuffer().getPath();
        if (this._isContractTarget(targetAbsolute)) {
          const baseDirAndRelative = editor.getBaseDirAndRelativePath(targetAbsolute);
          this.rootStore.deployTargetStore.addTarget(baseDirAndRelative[1], baseDirAndRelative[0]);
          this.rootStore.deployTargetStore.changeTarget(baseDirAndRelative[1]);
        }
      }),
      atom.workspace.onDidDestroyPaneItem(event => {
        const item = event.item;
        if (item instanceof TextEditor) {
          const targetAbsolute = item.getBuffer().getPath();
          const targetRelative = editor.getRelative(targetAbsolute);
          this.rootStore.deployTargetStore.removeTarget(targetRelative);
        }
      })
    );
    return subscriptions;
  },

  _isContractTarget(path) {
    return /\/\S+\.(lua|ascl)$/.test(path);
  },

  _compile() {
    this._show();
    const baseDir = editor.getProjectRootDir();
    const target = editor.getCurrentByRelative();
    this.rootStore.deployTargetStore.addTarget(target, baseDir);
    this.rootStore.compileStore.compileCurrentTarget();
  },

  _show() {
    this.views.athenaIdeView.show();
    this.views.consoleView.show();
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