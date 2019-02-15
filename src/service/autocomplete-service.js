'use babel';

import {LuaSuggester} from '../lua';
import logger from '../logger';

export default class AutoCompleteService {

  constructor(eventDispatcher) {
    this.eventDispatcher = eventDispatcher;
    this.luaSuggester = new LuaSuggester();
  }

  suggest(source, filePath, prefix, index) {
    logger.debug("Resolve suggestion with")
    logger.debug(filePath);
    logger.debug(source);
    logger.debug(prefix);
    logger.debug(index);
    return this.luaSuggester.suggest(source, filePath, prefix, index);
  }

}