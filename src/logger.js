'use babel';

const logOn = false;

export default {
  trace: logOn ? (m) => console.trace(m) : (m) => {},
  debug: logOn ? (m) => console.debug(m) : (m) => {},
  info: logOn ? (m) => console.info(m) : (m) => {},
  warn: logOn ? (m) => console.warn(m) : (m) => {},
  error: logOn ? (m) => console.error(m) : (m) => {},
};
