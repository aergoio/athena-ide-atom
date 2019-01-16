'use babel';

import { CompositeDisposable } from 'atom';

import AthenaIdeView from './view/athena-ide-view';
import LuaProvider from './lua-provider';

export default {

  athenaIdeView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.athenaIdeView = new AthenaIdeView(state.athenaIdeViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.athenaIdeView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();
    
    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'athena-ide:toggle': () => this.toggle()
    }));
    this.subscriptions.add(atom.workspace.observeTextEditors(editor => {
      editor.onDidSave(path => console.log(path));
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.athenaIdeView.destroy();
  },

  serialize() {
    return {
      athenaIdeViewState: this.athenaIdeView.serialize()
    };
  },

  toggle() {
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  },

  getProvider () {
    return new LuaProvider()
  },

};
