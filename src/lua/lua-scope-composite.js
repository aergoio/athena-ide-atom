'use babel';

export default class LuaScopeComposite {

  constructor(parent) {
    this.range = {start: NaN, end: NaN};
    this.definitions = [];
    this.parent = parent;
    this.children = [];
  }

  isRoot() {
    return null == this.parent;
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

  addDefinition(definition) {
    console.log("definition: ", definition);
    this.definitions.push(definition);
  }

  addChild(child) {
    console.log("child: " + child);
    this.children.push(child);
  }

}