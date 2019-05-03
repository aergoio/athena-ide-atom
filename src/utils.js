import { Amount } from '@herajs/client';

export function join() {
  return Array.from(arguments).reduce((acc, val) => acc.concat(val), []).join(' ');
}

export function formatInteger(num) {
  if (Number.isNaN(num)) {
    throw num + " is not an number";
  }
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

export const isEmpty = o => {
  if (typeof o === 'undefined' || null == o) {
    return true;
  }
  if (typeof o === 'string' && "" === o) {
    return true;
  }
  return false;
}

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

export function runWithCallback(invoke, onError) {
  try {
    return invoke();
  } catch (err) {
    onError(err);
  }
}

const units = [
  new Amount("1", "aergo"),
  new Amount("1", "gaer"),
  new Amount("1", "aer"),
];

export function formatAergoBalance(balance) {
  const amount = new Amount(balance, "aer");
  let unit = "aergo";
  for (let i = 0; i < units.length; ++i) {
    if (units[i].compare(amount) === -1) {
      unit = units[i].unit;
      break;
    }
  }
  return amount.toUnit(unit).toString();
}
