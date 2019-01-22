'use babel'

// luaparse literal types
export const LUAPARSE_LITERALS = [
  "StringLiteral",
  "NumericLiteral",
  "BooleanLiteral",
  "NilLiteral",
  "VarargLiteral"
];

// luaparse node types
export const LUAPARSE_TABLE_CONSTRUCTOR_EXPRESSION = "TableConstructorExpression";
export const LUAPARSE_TABLE_MEMBER_EXPRESSION = "MemberExpression";
export const LUAPARSE_TABLE_INDEX_EXPRESSION = "IndexExpression";
export const LUAPARSE_FUNCTION_DECLARATION = "FunctionDeclaration";
export const LUAPARSE_ASSIGNMENT_STATEMENT = "AssignmentStatement";
export const LUAPARSE_LOCAL_STATEMENT = "LocalStatement";
export const LUAPARSE_IDENTIFIER = "Identifier";


// athena lua types
export const ATHENA_LUA_LITERALS = [
  "string",
  "numeric",
  "boolean",
  "nil",
  "vararg"
];

// athena symbol types
export const ATHENA_LUA_VARIABLE = "variable";
export const ATHENA_LUA_FUNCTION = "function";
export const ATHENA_LUA_TABLE = "table";
export const ATHENA_LUA_UNKNOWN = "unknown";


// resolver functions
export function resolveType(luaparseType) {
  if (null == luaparseType) {
    return ATHENA_LUA_UNKNOWN;
  }
  const literalIndex = LUAPARSE_LITERALS.indexOf(luaparseType);
  if (-1 !== literalIndex) {
    return ATHENA_LUA_LITERALS[literalIndex];
  } else if (LUAPARSE_FUNCTION_DECLARATION === luaparseType) {
    return ATHENA_LUA_FUNCTION;
  } else  if (LUAPARSE_TABLE_CONSTRUCTOR_EXPRESSION === luaparseType) {
    return ATHENA_LUA_TABLE;
  } else {
    return ATHENA_LUA_UNKNOWN;
  }
}
