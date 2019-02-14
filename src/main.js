'use babel';

/* eslint-disable */

import { CompositeDisposable } from 'atom';

import ConsoleView from './view/console-view';
import LuaAutocompleteProvider from './lua-autocomplete-provider';
import LuaLintProvider from './lua-lint-provider';
import LuaCompiler from './lua-compiler';

export default {

  activate(state) {
    this.consoleView = new ConsoleView();
    this.subscriptions = new CompositeDisposable();
    this._addSubscriptions(this.subscriptions);
  },

  deactivate() {
    this.subscriptions.dispose();
    this.consoleView.distroy();
  },

  _addSubscriptions(subscriptions) {
    subscriptions.add(atom.commands.add('atom-text-editor', {
      'athena-ide:compile': () => {
        const filePath = atom.workspace.getActiveTextEditor().getBuffer().getPath();
        const source = atom.workspace.getActiveTextEditor().getBuffer().getText();
        const compileResult = new LuaCompiler().compile(source, filePath);
        this.consoleView.show().then((view) => {
          if (compileResult.result === "success") {
            view.log({data: compileResult.message, level: "info"});
          } else {
            view.log({data: compileResult.message, level: "error"});
          }
        });
      }
    }));
    subscriptions.add(atom.workspace.observeTextEditors(editor => {
      editor.onDidSave(path => console.log(path));
    }));
  },

  getProvider () {
    return new LuaAutocompleteProvider()
  },

  getLinter () {
    return new LuaLintProvider()
  },

};
