'use babel'

// luaparse literal types
export const LUAPARSE_LITERALS = [
  'StringLiteral',
  'NumericLiteral',
  'BooleanLiteral',
  'NilLiteral',
  'VarargLiteral'
];

// luaparse node types
export const LUAPARSE_FUNCTION_DECLARATION = 'FunctionDeclaration';
export const LUAPARSE_ASSIGNMENT_STATEMENT = 'AssignmentStatement';
export const LUAPARSE_LOCAL_STATEMENT = 'LocalStatement';
export const LUAPARSE_IDENTIFIER = 'Identifier';


// athena lua types
export const ATHENA_LUA_LITERALS = [
  'string',
  'numeric',
  'boolean',
  'nil',
  'vararg'
];

// athena symbol types
export const ATHENA_LUA_FUNCTION = "function";
export const ATHENA_LUA_TABLE = "table";
export const ATHENA_LUA_UNKNOWN = "unknown";