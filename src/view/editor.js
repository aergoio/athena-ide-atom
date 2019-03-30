'use babel';

/* eslint-disable */

export default {

  getProjectRootDir() {
    const pathInfos = atom.project.relativizePath(this.getCurrentByAbsolute());
    return pathInfos[0];
  },

  getCurrentByAbsolute() {
    return atom.workspace.getActiveTextEditor().getBuffer().getPath();
  },

  getCurrentByRelative() {
    return this._getReliative(this.getCurrentByAbsolute());
  },

  isAnyEditorDirty() {
    return this.getModifiedEditors().length > 0;
  },

  getModifiedEditors() {
    return atom.workspace.getTextEditors().filter(e => e.isModified());
  },

  getModifiedEditorsPath() {
    return this.getModifiedEditors()
      .map(e => e.getBuffer().getPath())
      .map(this._getReliative);
  },

  _getReliative(absolutePath) {
    return atom.project.relativizePath(absolutePath)[1];
  },

};