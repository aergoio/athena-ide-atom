'use babel';

import * as atomTypes from './atom-types';
import * as luaTypes from './lua/lua-types'

export function adaptToAtomType(type) {
  if (luaTypes.ATHENA_LUA_LITERALS.indexOf(type) !== -1) {
    return atomTypes.ATOM_VARIABLE;
  } else if (luaTypes.ATHENA_LUA_FUNCTION === type) {
    return atomTypes.ATOM_FUNCTION;
  } else {
    // todo : do something
    return type;
  }
}