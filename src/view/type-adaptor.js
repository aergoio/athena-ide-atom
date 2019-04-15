'use babel';

import * as atomTypes from './atom-types';
import { SuggestionKind, luaTypes, LintKind } from '@aergoio/athena-analysis';

export function adaptSuggestionToAtom(suggestion) {
  const athenaSymbolKind = suggestion.kind;
  let atomSymbolKind = athenaSymbolKind;
  switch (athenaSymbolKind) {
    case SuggestionKind.Variable:
    case SuggestionKind.System:
      atomSymbolKind = atomTypes.ATOM_SUGGESTION_VARIABLE;
      break;
    case SuggestionKind.Function:
      atomSymbolKind = atomTypes.ATOM_SUGGESTION_FUNCTION;
      break;
    case SuggestionKind.Member:
      atomSymbolKind = atomTypes.ATOM_SUGGESTION_METHOD;
      break;
    case SuggestionKind.Variable:
      atomSymbolKind = atomTypes.ATOM_SUGGESTION_VARIABLE;
      break;
  }

  return  {
    text: suggestion.name,
    snippet: suggestion.snippet,
    type: atomSymbolKind,
    rightLabel: suggestion.type
  };
}

export function adaptLintToAtom(file, lint, indexToPosition, indexToLineEndingPosition) {
  const athenaLintKind = lint.kind;
  let atomLintType = undefined;
  switch (athenaLintKind) {
    case LintKind.Warn:
      atomLintType = atomTypes.ATOM_LINTER_SEVERITY_WARN;
      break;
    case LintKind.Error:
      atomLintType = atomTypes.ATOM_LINTER_SEVERITY_ERROR;
      break;
  }

  return {
    severity: atomLintType,
    location: {
      file: file,
      position: [indexToPosition(lint.index), indexToLineEndingPosition(lint.index)]
    },
    excerpt: lint.message
  }
}