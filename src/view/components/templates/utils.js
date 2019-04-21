'use babel';

import logger from 'loglevel';

export function parseArgs(rawArgs) {
  const trimmed = rawArgs.trim();
  try {
    if ("[" === trimmed[0]) {
      return JSON.parse(trimmed);
    } else {
      return JSON.parse("[" + trimmed + "]");
    }
  } catch (err) {
    throw "Parsing error in arguments";
  }
}

export function runCallback(callback) {
  try {
    return callback();
  } catch (error) {
    logger.error(error);
    this.props.notificationStore.notify(error, "error");
  }
}