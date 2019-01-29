'use babel';

import {luaTypes} from './lua';
import * as atomTypes from './atom-types';

export function adaptSuggestionToAtom(suggestion) {
  const athenaSymbolKind = suggestion.kind;
  let atomSymbolKind = athenaSymbolKind;
  if (luaTypes.LUA_KIND_VARIABLE.indexOf(athenaSymbolKind) !== -1) {
    atomSymbolKind = atomTypes.ATOM_SUGGESTION_VARIABLE;
  } else if (luaTypes.LUA_KIND_FUNCTION === athenaSymbolKind) {
    atomSymbolKind = atomTypes.ATOM_SUGGESTION_FUNCTION;
  } else if (luaTypes.LUA_KIND_TABLE_MEMBER === athenaSymbolKind) {
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
  if (luaTypes.LUA_LINT_TYPE_ERROR === athenaLintType) {
    atomLintType = atomTypes.ATOM_LINTER_SEVERITY_ERROR;
  } else if (luaTypes.LUA_LINT_TYPE_WARN === athenaLintType) {
    atomLintType = atomTypes.ATOM_LINTER_SEVERITY_WARN;
  } else if (luaTypes.LUA_LINT_TYPE_INFO === athenaLintType) {
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