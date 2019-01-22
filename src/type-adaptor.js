'use babel';

import * as atomTypes from './atom-types';
import * as luaTypes from './lua/lua-types'

export function adaptToAtomType(symbolKind) {
  if (luaTypes.ATHENA_LUA_LITERALS.indexOf(symbolKind) !== -1) {
    return atomTypes.ATOM_VARIABLE;
  } else if (luaTypes.ATHENA_LUA_FUNCTION === symbolKind) {
    return atomTypes.ATOM_FUNCTION;
  } else {
    // todo : do something
    return symbolKind;
  }
}