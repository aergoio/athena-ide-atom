'use babel';

export default class Parser {

  constructor() {
    this.visitors = [];
  }

  addVisitor(visitor) {
    this.visitors.push(visitor);
  }

  parse(source) {
    console.error("Define your parse function");
    return new Object();
  }

}