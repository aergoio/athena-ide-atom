'use babel'

// luaparse literal types
export const LUAPARSE_LITERALS = [
  'StringLiteral',
  'NumericLiteral',
  'BooleanLiteral',
  'NilLiteral',
  'VarargLiteral'
];

// literal types to display
export const DISPLAY_LITERALS = [
  'string',
  'numeric',
  'boolean',
  'nil',
  'vararg'
];

// luaparse node types
export const FUNCTION_DECLARATION = 'FunctionDeclaration';
export const ASSIGNMENT_STATEMENT = 'AssignmentStatement';
export const LOCAL_STATEMENT = 'LocalStatement';
export const IDENTIFIER = 'Identifier';