'use babel';

export default class LuaTableFieldTree {

  static newLuaTableFieldTree() {
    return new LuaTableFieldTree();
  }

  constructor() {
    this.entries = {};
  }

  getEntries() {
    return this.entries;
  }

  addEntry(tableName, ...fieldNames) {
    if (0 === fieldNames.length) {
      return;
    }

    // in this data structure, concat of tableName and fieldsName is possible
    // but for clarity, split following 3 lines
    if (!this.entries.hasOwnProperty(tableName)) {
      this.entries[tableName] = {};
    }
    // fields addition
    let currEntry = this.entries[tableName];
    fieldNames.forEach(fieldName => {
      if (!currEntry.hasOwnProperty(fieldName)) {
        currEntry[fieldName] = {};
      }
      currEntry = currEntry[fieldName];
    });
  }

}