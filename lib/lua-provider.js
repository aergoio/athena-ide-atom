'use babel';

import LuaManager from './lua';

export default class LuaProvider {
  selector = '.source.lua';
  disableForSelector = '.source.lua .comment';
  inclusionPriority = 1;
  excludeLowerPriority = true;

  luaManager = new LuaManager();

  getSuggestions = async function (request) {
    const textBuffer = request.editor.getBuffer(); // atom TextBuffer
    const prefix = request.prefix;
    const prefixEndIndex = textBuffer.characterIndexForPosition(request.bufferPosition);
    const prefixStartIndex = prefixEndIndex - prefix.length;
    const lastSourceIndex = textBuffer.getMaxCharacterIndex();
    console.log("prefix: " + prefix + ", start: " + prefixStartIndex + " , end: " + prefixEndIndex);

    const textInIndex = (startIndex, endIndex) => {
      const range = [textBuffer.positionForCharacterIndex(startIndex), textBuffer.positionForCharacterIndex(endIndex)];
      return textBuffer.getTextInRange(range);
    }
    const source = textInIndex(0, prefixStartIndex) + textInIndex(prefixEndIndex, lastSourceIndex);
    this.luaManager.updateAST(source);
    return await this.luaManager.getSuggestions(prefix, prefixStartIndex);
  }
};
