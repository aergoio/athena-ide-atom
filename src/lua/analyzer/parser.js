'use babel'

import luaparse from '@aergoio/luaparse';
import logger from '../../logger';

const LUA_VERSION = '5.1';

export default class LuaParser {

  constructor() {
    this.delegate = luaparse;
  }

  parse(source, ...visitors) {
    try {
      const ast = this.delegate.parse(source, {
        wait: false,
        comments: false,
        scope: true,
        ranges: true,
        locations: true,
        onCreateNode (node) {
          logger.debug("onCreateNode");
          logger.debug(node);
          visitors.forEach(visitor => visitor.onCreateNode(node));
        },
        onCreateScope (scope) {
          logger.debug("onCreateScope");
          logger.debug(scope);
          visitors.forEach(visitor => visitor.onCreateScope(scope));
        },
        onDestroyScope (scope) {
          logger.debug("onDestroyScope");
          logger.debug(scope);
          visitors.forEach(visitor => visitor.onDestroyScope(scope));
        },
        onLocalDeclaration (identifierName) {
          logger.debug("onLocalDeclaration");
          logger.debug(identifierName);
          visitors.forEach(visitor => visitor.onLocalDeclaration(identifierName));
        },
        onFunctionSignature (signature) {
          logger.debug("onFunctionSignature");
          logger.debug(signature);
          visitors.forEach(visitor => visitor.onFunctionSignature(signature));
        },
        luaVersion: LUA_VERSION
      });
      return this._makeResult(ast, null);
    } catch (err) {
      return this._makeResult(null, err);
    }
  }

  _makeResult(ast, err) {
    return {ast: ast, err: err}
  }

}