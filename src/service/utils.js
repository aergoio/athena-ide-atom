'use babel';

export const isEmpty = o => {
  if (typeof o === 'undefined' || null == o) {
    return true;
  }
  if (typeof o === 'string' && "" === o) {
    return true;
  }
  return false;
}