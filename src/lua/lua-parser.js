'use babel'

import luaparse from '@aergoio/luaparse';
import {Parser} from '../type';
import logger from '../logger';

const luaVersion = '5.1';

export default class LuaParser extends Parser {

  constructor() {
    super();
    this.delegate = luaparse;
  }

  parse(source) {
    try {
      const visitors = this.visitors;
      visitors.forEach(visitor => visitor.reset());
      return this.delegate.parse(source, {
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
        luaVersion: luaVersion
      });
    } catch (err) {
      logger.debug("parsing error");
      console.debug(err);
    }

    return new Object();
  }

}