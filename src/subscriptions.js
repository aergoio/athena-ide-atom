/* eslint-disable */

import { CompositeDisposable, TextEditor } from 'atom';
import { SaveConfirmView, editor } from './view';

export default class Subscriptions {

  constructor(rootStore, views) {
    this.rootStore = rootStore;
    this.views = views;
    this.subscriptions = this._buildSubscriptions();
  }

  _buildSubscriptions() {
    const subscriptions = new CompositeDisposable();

    subscriptions.add(
      atom.commands.add('atom-text-editor', {
        'athena-ide:compile': () => {
          this._show();
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
  }

  _show() {
    this.views.athenaIdeView.show();
    this.views.consoleView.show();
  }

  _compile() {
    const baseDir = editor.getProjectRootDir();
    const target = editor.getCurrentByRelative();
    this.rootStore.deployTargetStore.addTarget(target, baseDir);
    this.rootStore.compileStore.compileCurrentTarget();
  }

  _isContractTarget(path) {
    return /\/\S+\.(lua|ascl)$/.test(path);
  }

  dispose() {
    this.subscriptions.dispose();
  }

}
