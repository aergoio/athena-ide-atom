import logger from 'loglevel';
import * as adaptor from './type-adaptor';
import { LintService } from './service';

export default class LintProvider {

  constructor() {
    this.name = 'Lua linter';
    this.scope = 'file'; // or 'project'
    this.lintsOnChange = false;
    this.grammarScopes = ['source.lua'];

    this.lintService = new LintService();
  }

  lint(textEditor) {
    const textBuffer = textEditor.getBuffer();
    const source = textBuffer.getText();
    const filePath = textBuffer.getPath();
    logger.debug("Lint request with", filePath);
    
    const indexToPosition = (index) => textBuffer.positionForCharacterIndex(index);
    const indexToLineEndingPotision = (index) => {
      const position = textBuffer.positionForCharacterIndex(index);
      const indexToLineEnding = textBuffer.lineLengthForRow(position.row) - position.column;
      return indexToPosition(index + indexToLineEnding);
    };

    return this.lintService.lint(source, filePath).then((rawLints) => {
      logger.debug("Raw lints:", rawLints);
      const atomLints = rawLints.map(lint => adaptor.adaptLintToAtom(filePath, lint, indexToPosition, indexToLineEndingPotision));
      logger.info("Atom lints:", atomLints);
      return atomLints;
    });
  }

}