'use babel';

import LuaAnalyzer from './lua';
import * as adaptor from './type-adaptor';
import logger from './logger';

export default class LuaLintProvider {

  constructor() {
    this.name = 'Lua linter';
    this.scope = 'file'; // or 'project'
    this.lintsOnChange = false;
    this.grammarScopes = ['source.lua'];

    this.luaAnalyzer = new LuaAnalyzer();
  }

  lint(textEditor) {
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
    const atomLints = lints.map(lint => adaptor.adaptLintToAtom(lint, indexToPosition, indexToLineEndingPotision));
    logger.info("Atom lints");
    logger.info(atomLints);
    return atomLints;
  }

}
