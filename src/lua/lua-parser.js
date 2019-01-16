'use babel'

import luaparse from 'luaparse';
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
      return this.delegate.parse(source, {
        wait: false,
        comments: false,
        scope: true,
        ranges: true,
        locations: true,
        onCreateNode (node) {
          console.log("onCreateNode");
          console.log(node);
          visitors.forEach(visitor => visitor.onCreateNode(node));
        },
        onCreateScope () {
          console.log("onCreateScope");
          visitors.forEach(visitor => visitor.onCreateScope());
        },
        onDestroyScope () {
          console.log("onDestroyScope");
          visitors.forEach(visitor => visitor.onDestroyScope());
        },
        onLocalDeclaration (scopeName) {
          console.log("onLocalDeclaration");
          console.log(scopeName);
          visitors.forEach(visitor => visitor.onLocalDeclaration());
        },
        luaVersion: luaVersion
      });
    } catch (err) {
      console.error(err);
    }

    return new Object();
  }

}