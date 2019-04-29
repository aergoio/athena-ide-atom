import logger from 'loglevel';
import * as adaptor from './type-adaptor';
import { AutoCompleteService } from './service';

const prefixParsingEnd = [";", "(", ")", "{", "}"];

export default class AutoCompleteProvider {

  constructor() {
    this.selector = '.source.lua';
    this.disableForSelector = '.source.lua .comment';
    this.inclusionPriority = 1;
    this.excludeLowerPriority = true;

    this.autoCompleteService = new AutoCompleteService();
  }

  getSuggestions(request) {
    logger.debug("Resolve suggestions with", request);

    // resolve origin prefix info in editor
    const textBuffer = request.editor.getBuffer();
    const cursorPosition = request.bufferPosition;
    const originPrefix = request.prefix;
    const originPrefixEndIndex = textBuffer.characterIndexForPosition(request.bufferPosition);
    const originPrefixStartIndex = originPrefixEndIndex - originPrefix.length;
    logger.debug("Origin prefix:", originPrefix, "start index:",
        originPrefixStartIndex, "end index:", originPrefixEndIndex);

    // parse prefix info in line
    const currentLineStartIndex = textBuffer.characterIndexForPosition({row: cursorPosition.row, column: 0});
    const originPrefixStart = originPrefixStartIndex - currentLineStartIndex;
    const currentLine = textBuffer.lineForRow(cursorPosition.row);
    const prefixInfo = this._resolvePrefix(originPrefix, originPrefixStart, currentLine);
    logger.debug("Parsed prefix:", prefixInfo.prefix);

    // trim parsed prefix from source
    const textInIndex = (startIndex, endIndex) => {
      const range = [textBuffer.positionForCharacterIndex(startIndex), textBuffer.positionForCharacterIndex(endIndex)];
      return textBuffer.getTextInRange(range);
    }
    const prefixStartIndex = currentLineStartIndex + prefixInfo.prefixStart;
    const prefixEndIndex = originPrefixEndIndex;
    const lastSourceIndex = textBuffer.getMaxCharacterIndex();
    const source = textInIndex(0, prefixStartIndex) + textInIndex(prefixEndIndex, lastSourceIndex);
    const filePath = textBuffer.getPath();

    // TODO : why only "-" cause replacement prefix malfunction
    let replacementPrefix = originPrefix;
    if (prefixInfo.prefix === "-") {
      replacementPrefix = "-";
    }

    return this.autoCompleteService.suggest(source, filePath, prefixInfo.prefix, prefixStartIndex).then(rawSuggestions => {
      logger.debug("Raw suggestions:", rawSuggestions);
      const atomSuggestions = rawSuggestions.map(suggestion => adaptor.adaptSuggestionToAtom(suggestion, replacementPrefix));
      logger.info("Atom suggestions:", atomSuggestions);
      return atomSuggestions;
    });
  }

  _resolvePrefix(originPrefix, originPrefixStart, line) {
    let prefix = "";
    let buffer = originPrefix;
    let cannotFillBuffer = false;
    let index = originPrefixStart - 1;
    logger.debug("Member tracking from: ", index);
    while (index >= 0 && prefixParsingEnd.indexOf(line[index]) === -1) {
      if (line[index] === " ") {
        if (buffer.length > 0) {
          cannotFillBuffer = true;
        }
      } else if (line[index] === ".") {
        if (0 === buffer.length) break;
        prefix = "." + buffer + prefix;
        buffer = "";
        cannotFillBuffer = false;
      } else {
        // meet character after whitespace when buffer is filled
        if (cannotFillBuffer) break;
        buffer = line[index] + buffer;
      }
      --index;
    }
    prefix = buffer + prefix;

    return {
      prefix: prefix,
      prefixStart: index + 1
    };
  }

}
