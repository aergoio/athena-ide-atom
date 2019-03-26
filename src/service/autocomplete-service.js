'use babel';

import {LuaSuggester} from '@aergoio/athena-analysis';
import logger from 'loglevel';

export default class AutoCompleteService {

  constructor() {
    this.luaSuggester = new LuaSuggester();
  }

  suggest(source, filePath, prefix, index) {
    logger.debug("Resolve suggestion with", filePath, prefix, index);
    return this.luaSuggester.suggest(source, filePath, prefix, index);
  }

}