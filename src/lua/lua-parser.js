'use babel'

import luaparse from '@aergoio/luaparse';
import {Parser} from '../type';

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
          console.log("onCreateNode", node);
          visitors.forEach(visitor => visitor.onCreateNode(node));
        },
        onCreateScope (scope) {
          console.log("onCreateScope", scope);
          visitors.forEach(visitor => visitor.onCreateScope(scope));
        },
        onDestroyScope (scope) {
          console.log("onDestroyScope", scope);
          visitors.forEach(visitor => visitor.onDestroyScope(scope));
        },
        onLocalDeclaration (identifierName) {
          console.log("onLocalDeclaration", identifierName);
          visitors.forEach(visitor => visitor.onLocalDeclaration(identifierName));
        },
        luaVersion: luaVersion
      });
    } catch (err) {
      console.error(err);
    }

    return new Object();
  }

}