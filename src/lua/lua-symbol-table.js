'use babel';

export default class LuaSymbolTable {

  static newSymbolTable() {
    return new LuaSymbolTable(null);
  }

  constructor(parent) {
    this.range = {start: NaN, end: Infinity};
    this.entries = {};
    this.parent = parent;
    this.children = [];
  }

  isRoot() {
    return null == this.parent;
  }

  getParent() {
    return null == this.parent ? this : this.parent;
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

  addEntry(identifier, index, type, kind) {
    if (!this.entries.hasOwnProperty(identifier)) {
      const entry = {index: index, type: type, kind: kind};
      this.entries[identifier] = entry
    }
  }

  addChild(child) {
    this.children.push(child);
  }

}