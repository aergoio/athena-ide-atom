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
  { basis: 1e18, unit: "aergo" },
  { basis: 1e9, unit: "gaer" },
  { basis: 1, unit: "aer" },
];

export function formatAergoBalance(balance) {
  if (Number.isNaN(balance)) {
    throw balance + " is not an number";
  }

  const balanceInNumber = Number.parseInt(balance);
  if (0 === balanceInNumber) {
    return "0 aergo";
  }

  let amount = "";
  let unit = "";
  for (let i = 0; i < units.length; ++i) {
    if (units[i].basis <= balanceInNumber) {
      amount = balanceInNumber / units[i].basis;
      unit = units[i].unit;
      break;
    }
  }

  return amount + " " + unit;
}