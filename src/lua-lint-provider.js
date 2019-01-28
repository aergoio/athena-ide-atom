'use babel';

import LuaAnalyzer from './lua';
import * as adaptor from './type-adaptor';
import logger from './logger';

export default class LuaLintProvider {
  name = 'Lua linter';
  scope = 'file'; // or 'project'
  lintsOnChange = false;
  grammarScopes = ['source.lua'];

  luaAnalyzer = new LuaAnalyzer();

  lint = async function (textEditor) {
    const textBuffer = textEditor.getBuffer();
    const source = textBuffer.getText();
    const fileName = textEditor.getPath();
    this.luaAnalyzer.analyze(source, fileName);
    const lints = this.luaAnalyzer.getLints();
    const indexToPosition = (index) => textBuffer.positionForCharacterIndex(index);
    const indexToLineEndingPotision = (index) => {
      const position = textBuffer.positionForCharacterIndex(index);
      const indexToLineEnding = textBuffer.lineLengthForRow(position.row) - position.column;
      return indexToPosition(index + indexToLineEnding);
    };
    return lints.map(lint => adaptor.adaptLintToAtom(lint, indexToPosition, indexToLineEndingPotision));
  }

};
