'use babel';

import {MessagePanelView, PlainMessageView} from 'atom-message-panel';

export default class CompileView extends MessagePanelView {

  constructor() {
    super({title: "Compile result", autoScroll: true, closeMethod: "destroy"});
  }

  setSuccess(message) {
    this.clear();
    this.add(new PlainMessageView({
      raw: true,
      message: this._buildMessage("success:", message),
      className: 'text-success'
    }));
  }

  setFail(message) {
    this.clear();
    this.add(new PlainMessageView({
      raw: true,
      message: this._buildMessage("fail:", message),
      className: 'text-danger'
    }));
  }

  destroy() {
    super.close();
  }

  _buildMessage(header, message) {
    return this._buildDiv(header) + this._buildDiv(message);
  }

  _buildDiv(content) {
    return "<div style=\"word-wrap: break-word;\">" + content + "</div>";
  }

}