'use babel';

/* eslint-disable */

import { CompositeDisposable } from 'atom';

import CompileView from './view/compile-view';
import LuaAutocompleteProvider from './lua-autocomplete-provider';
import LuaLintProvider from './lua-lint-provider';
import LuaCompiler from './lua-compiler';

export default {

  compileView: null,
  subscriptions: null,

  activate(state) {
    // compile view
    this.compileView = new CompileView();

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();
    
    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-text-editor', {
      'athena-ide:compile': () => {
        const filePath = atom.workspace.getActiveTextEditor().getBuffer().getPath();
        const source = atom.workspace.getActiveTextEditor().getBuffer().getText();
        const compileResult = new LuaCompiler().compile(source, filePath);
        this.compileView.attach();
        if (compileResult.result === "success") {
          this.compileView.setSuccess(compileResult.message);
        } else {
          this.compileView.setFail(compileResult.message);
        }
      }
    }));
    this.subscriptions.add(atom.workspace.observeTextEditors(editor => {
      editor.onDidSave(path => console.log(path));
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
    this.compileView.destroy();
  },

  getProvider () {
    return new LuaAutocompleteProvider()
  },

  getLinter () {
    return new LuaLintProvider()
  },

};
