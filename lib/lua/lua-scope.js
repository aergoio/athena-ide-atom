'use babel';

export default class LuaScopeComposite {

  constructor(start, end) {
    this.range = {start: start, end: end};
    this.definitions = [];
    this.children = [];
  }

  addDefinition(name, type) {
    console.log("name: " + name + ", type: " + type);
    definitions.push({name: name, type: type});
  }

  addChild(child) {
    console.log("child: " + child);
    this.children.push(child);
  }

}