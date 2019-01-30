'use babel';

const logOn = false;

export default {
  trace: (m) => logOn ? console.trace(m) : {},
  debug: (m) => logOn ? console.debug(m) : {},
  info: (m) => logOn ? console.info(m) : {},
  warn: (m) => logOn ? console.warn(m) : {},
  error: (m) => logOn ? console.error(m) : {},
};
