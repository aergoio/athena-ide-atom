'use babel';

export default class LuaScopeComposite {

  constructor(parent) {
    this.range = {start: NaN, end: NaN};
    this.definitions = [];
    this.parent = parent;
    this.children = [];
  }

  getParent() {
    return null === this.parent ? this : this.parent;
  }

  isInScope(index) {
    return this.range.start <= index && index <= this.range.end;
  }

  setStart(start) {
    this.range.start = start;
  }

  setEnd(end) {
    this.range.end = end;
  }

  addDefinition(type, name) {
    console.log("name: " + name + ", type: " + type);
    this.definitions.push({name: name, type: type});
  }

  addChild(child) {
    console.log("child: " + child);
    this.children.push(child);
  }

}