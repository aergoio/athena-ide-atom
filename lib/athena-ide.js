'use babel';

import AthenaIdeView from './athena-ide-view';
import { CompositeDisposable } from 'atom';

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
    console.log('AthenaIde was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
