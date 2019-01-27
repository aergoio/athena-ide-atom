'use babel';

export default class Parser {

  parse(source, ...visitors) {
    return this._fail("Define your parse function");
  }

  _success(ast) {
    return this._makeResult(ast, {});
  }

  _fail(...errs) {
    return this._makeResult({}, errs);
  }

  _makeResult(ast, err) {
    return {ast: ast, err: err};
  }

}