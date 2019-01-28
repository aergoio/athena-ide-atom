'use babel';

import * as atomTypes from './atom-types';
import {luaTypes} from './lua';
import logger from './logger';

export function adaptSuggestionToAtom(suggestion) {
  const athenaSymbolKind = suggestion.kind;
  let atomSymbolKind = athenaSymbolKind;
  if (luaTypes.ATHENA_LUA_LITERALS.indexOf(athenaSymbolKind) !== -1) {
    atomSymbolKind = atomTypes.ATOM_SUGGESTION_VARIABLE;
  } else if (luaTypes.ATHENA_LUA_FUNCTION === athenaSymbolKind) {
    atomSymbolKind = atomTypes.ATOM_SUGGESTION_FUNCTION;
  } else if (luaTypes.ATHENA_LUA_TABLE_MEMBER === athenaSymbolKind) {
    atomSymbolKind = atomTypes.ATOM_SUGGESTION_METHOD;
  }
  return  {
    text: suggestion.name,
    snippet: suggestion.name,
    type: atomSymbolKind,
    rightLabel: suggestion.type
  };
}

export function adaptLintToAtom(lint, indexToPosition, indexToLineEndingPosition) {
  const athenaLintType = lint.type;
  let atomLintType = athenaLintType
  if (luaTypes.ATHENA_LINT_TYPE_ERROR === athenaLintType) {
    atomLintType = atomTypes.ATOM_LINTER_SEVERITY_ERROR;
  } else if (luaTypes.ATHENA_LINT_TYPE_WARN === athenaLintType) {
    atomLintType = atomTypes.ATOM_LINTER_SEVERITY_WARN;
  } else if (luaTypes.ATHENA_LINT_TYPE_INFO === athenaLintType) {
    atomLintType = atomTypes.ATOM_LINTER_SEVERITY_INFO;
  }
  return {
    severity: atomLintType,
    location: {
      file: lint.file,
      position: [indexToPosition(lint.index), indexToLineEndingPosition(lint.index)]
    },
    excerpt: lint.message
  }
}