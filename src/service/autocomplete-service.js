'use babel';

import {LuaSuggester} from '@aergoio/athena-analysis';
import logger from 'loglevel';

export default class AutoCompleteService {

  constructor() {
    this.luaSuggester = new LuaSuggester();
  }

  async suggest(source, filePath, prefix, index) {
    logger.debug("Resolve suggestion with", filePath, prefix, index);
    return await this.luaSuggester.suggest(source, filePath, prefix, index);
  }

}