/* eslint-disable */

import editor from './editor';

export default class SaveConfirmView {

  constructor(callback) {
    this.callback = callback;
  }

  show() {
    atom.confirm({
      message: "Do you want to save file before compile?",
      detail: editor.getModifiedEditorsPath()
        .reduce((pre, curr, index) => {
          if (0 === index) {
            return curr;
          }
          return  pre + "\n" + curr;
        }),
      buttons: ["Ok", "Cancel"]
    }, response => {
      if (response === 0) {
        Promise.all(editor.getModifiedEditors().map(e => e.save()))
          .then(() => {
            if (this.callback) {
              this.callback()
            }
          });
      }
    })
  }

}