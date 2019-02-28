'use babel';

export default class LuaLint {

  constructor(type, file, index, message) {
    this.type = type;
    this.file = file;
    this.index = index;
    this.message = message;
  }

}
