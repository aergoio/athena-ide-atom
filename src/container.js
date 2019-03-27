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
        const modifiedEditors = atom.workspace.getTextEditors().filter(e => e.isModified())
        if (modifiedEditors.length > 0) {
          this._showSaveConfirmModal(modifiedEditors);
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

  _showSaveConfirmModal(modifiedEditors) {
    atom.confirm({
      message: "Do you want to save file before compile?",
      detail: modifiedEditors
        .map(e => this._getEditorTarget(e))
        .map(t => t[1])
        .reduce((pre, curr, index) => {
          if (0 === index) {
            return curr;
          }
          return  pre + "\n" + curr;
        }),
      buttons: ["Ok", "Cancel"]
    }, async response => {
      if (response === 0) {
        await Promise.all(modifiedEditors.map(e => e.save()));
        this._compile();
      }
    })
  },

  _compile() {
    const pathInfo = this._getEditorTarget(atom.workspace.getActiveTextEditor());
    const projectRoot = pathInfo[0];
    const relativePath = pathInfo[1];
    this._show();
    compileResultStore.addCompileResult(projectRoot, relativePath);
  },

  _getEditorTarget(editor) {
    const absolutePath = editor.getBuffer().getPath();
    return atom.project.relativizePath(absolutePath);
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