'use babel';

import LuaManager from './lua';
import * as adaptor from './type-adaptor';


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
    return Promise.resolve(this.luaManager.getSuggestions(prefix, prefixStartIndex))
                  .then(suggestions => {
                      const atomSuggestions = suggestions.map(suggestion => {
                        return  {
                          snippet: suggestion.name,
                          replacementPrefix: prefix,
                          type: adaptor.adaptToAtomType(suggestion.type),
                          rightLabel: suggestion.type
                        };
                      });
                      console.log("Adapted suggestions", atomSuggestions);
                    return atomSuggestions;
                  });
  }

};
