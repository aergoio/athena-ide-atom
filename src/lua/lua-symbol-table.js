'use babel';

class LuaSymbolTableEntry {

  constructor(index, name, type) {
    this.index = index;
    this.name = name;
    this.type = type;
  }

}

export default class LuaSymbolTable {

  static newSymbolTable() {
    return new LuaSymbolTable(null);
  }

  constructor(parent) {
    this.range = {start: NaN, end: NaN};
    this.entries = [];
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

  addEntry(index, name, type) {
    const entry = new LuaSymbolTableEntry(index, name, type);
    console.log("new entry: ", entry);
    this.entries.push(entry);
  }

  addChild(child) {
    console.log("child: " + child);
    this.children.push(child);
  }

}