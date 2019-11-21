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

export const assertNotEmpty = (o, message) => {
  if (isEmpty(o)) {
    throw new Error(typeof message === "undefined" ? o + " should not empty" : message);
  }
}

export function runWithCallback(invoke, onError) {
  try {
    return invoke();
  } catch (err) {
    onError(err);
  }
}

// lazy loading (herajs which used by athena client is too heavy)
let Amount = undefined;
const loadAmount = () => {
  if (typeof Amount === "undefined") {
    Amount = require('@aergo/athena-client').Amount;
  }
  return Amount;
}

let units = undefined;

export function convertAerPretty(balance) {
  if (isNaN(balance)) {
    return balance;
  }

  let Amount = loadAmount();

  if (isUndefined(units)) {
    units = [
      new Amount("1", "aergo"),
      new Amount("1", "gaer"),
      new Amount("1", "aer"),
    ];
  }

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

export function convertToUnit(amount, originUnit, newUnit) {
  if (isNaN(amount)) {
    return amount;
  }

  let Amount = loadAmount();
  return new Amount(amount, originUnit).toUnit(newUnit).formatNumber();
}

export function isUndefined(o) {
  return null == o || typeof o === "undefined";
}
