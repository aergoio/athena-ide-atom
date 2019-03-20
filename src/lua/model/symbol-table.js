'use babel';

export class LuaSymbolEntry {

  constructor(index, type, kind, snippet) {
    this.index = index;
    this.type = type;
    this.kind = kind;
    this.snippet = snippet;
  }

}

export class LuaSymbolTable {

  static create(fileName, entries) {
    return new LuaSymbolTable(fileName, entries);
  }

  constructor(fileName, entries) {
    this.fileName = fileName;
    this.range = {start: 0, end: Infinity};
    this.entries = null == entries ? {} : entries;
    this.parent = null;
    this.children = [];
  }

  isRoot() {
    return null == this.parent;
  }

  getParent() {
    return this.parent;
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

  addEntry(identifier, index, type, kind, snippet) {
    if (!this.entries.hasOwnProperty(identifier)) {
      this.entries[identifier] = new LuaSymbolEntry(index, type, kind, snippet);
    }
  }

  setParent(parent) {
    this.parent = parent;
  }

  addChild(child) {
    this.children.push(child);
  }

}

export default LuaSymbolTable;