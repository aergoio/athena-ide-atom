/* eslint-disable */

import { CompositeDisposable } from 'atom';
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
    this.rootStore.deployTargetStore.addTarget(baseDir, target);
  }

  _isContractTarget(path) {
    return /\/\S+\.(lua|ascl)$/.test(path);
  }

  dispose() {
    this.subscriptions.dispose();
  }

}
