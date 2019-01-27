'use babel';

import LuaAnalyzer from './lua';
import * as adaptor from './type-adaptor';
import logger from './logger';

export default class LuaProvider {
  selector = '.source.lua';
  disableForSelector = '.source.lua .comment';
  inclusionPriority = 1;
  excludeLowerPriority = true;

  luaAnalyzer = new LuaAnalyzer();

  getSuggestions = async function (request) {
    const textBuffer = request.editor.getBuffer();
    const cursorPosition = request.bufferPosition;
    const originPrefix = request.prefix;
    const originPrefixEndIndex = textBuffer.characterIndexForPosition(request.bufferPosition);
    const originPrefixStartIndex = originPrefixEndIndex - originPrefix.length;
    logger.debug("origin prefix: " + originPrefix +
          " (start: " + originPrefixStartIndex + ", end: " + originPrefixEndIndex + ")");

    const currentLine = textBuffer.lineForRow(cursorPosition.row);
    const currentLineStartIndex = textBuffer.characterIndexForPosition({row: cursorPosition.row, column: 0});
    logger.debug("current line start index: " + currentLineStartIndex);

    let buffer = originPrefix;
    let cannotFillBuffer = false;
    let index = originPrefixStartIndex - currentLineStartIndex - 1;
    let prefix = "";
    logger.debug("member tracking from: " + index);
    while (index >= 0 && currentLine[index] !== ";") {
      if (currentLine[index] === " ") {
        if (buffer.length > 0) {
          cannotFillBuffer = true;
        }
      } else if (currentLine[index] === ".") {
        if (0 === buffer.length) break;
        prefix = "." + buffer + prefix;
        buffer = "";
        cannotFillBuffer = false;
      } else {
        // meet character after whitespace when buffer is filled
        if (cannotFillBuffer) break;
        buffer = currentLine[index] + buffer;
      }
      --index;
    }
    prefix = buffer + prefix;

    const textInIndex = (startIndex, endIndex) => {
      const range = [textBuffer.positionForCharacterIndex(startIndex), textBuffer.positionForCharacterIndex(endIndex)];
      return textBuffer.getTextInRange(range);
    }
    const prefixStartIndex = currentLineStartIndex + index + 1;
    const prefixEndIndex = originPrefixEndIndex;
    const lastSourceIndex = textBuffer.getMaxCharacterIndex();
    const source = textInIndex(0, prefixStartIndex) + textInIndex(prefixEndIndex, lastSourceIndex);
    const fileName = textBuffer.getPath();
    this.luaAnalyzer.analyze(source, fileName);

    return Promise.resolve(this.luaAnalyzer.getSuggestions(prefix, prefixStartIndex, fileName))
                  .then(suggestions => {
                      const atomSuggestions = suggestions.map(suggestion => {
                        return  {
                          text: suggestion.name,
                          snippet: suggestion.name,
                          type: adaptor.adaptToAtomType(suggestion.kind),
                          rightLabel: suggestion.type
                        };
                      });
                    return atomSuggestions;
                  });
  }

};
