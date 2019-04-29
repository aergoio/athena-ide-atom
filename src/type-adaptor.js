import * as atomTypes from './view/atom-types';
import { SuggestionKind, LintKind } from '@aergo/athena-analysis';

export function adaptSuggestionToAtom(suggestion, replacementPrefix) {
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
    case SuggestionKind.Snippet:
      atomSymbolKind = atomTypes.ATOM_SUGGESTION_SNIPPET;
      break;
  }

  return  {
    snippet: suggestion.snippet,
    type: atomSymbolKind,
    leftLabel: suggestion.prefix,
    rightLabel: suggestion.type,
    replacementPrefix: replacementPrefix
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