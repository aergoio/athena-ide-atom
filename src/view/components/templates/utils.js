'use babel';

export const parseArgs = (rawArgs) => {
  return rawArgs.split(',')
    .map(arg => arg.trim())
    .map(arg => {
    const asNumber = Number(arg);
    return Number.isNaN(asNumber) ? arg.replace(/['"]+/g, '') : asNumber;
  });
}