/* eslint-disable */

export default {

  hasActiveEditor() {
    return typeof atom.workspace.getActiveTextEditor() !== "undefined";
  },

  getProjectRootDir() {
    const pathInfos = atom.project.relativizePath(this.getCurrentByAbsolute());
    return pathInfos[0];
  },

  getCurrentByAbsolute() {
    if (!this.hasActiveEditor()) {
      return undefined;
    }
    return atom.workspace.getActiveTextEditor().getBuffer().getPath();
  },

  getCurrentByRelative() {
    if (!this.hasActiveEditor()) {
      return undefined;
    }
    return this.getRelative(this.getCurrentByAbsolute());
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
      .map(a => this.getRelative(a));
  },

  getBaseDirAndRelativePath(absolutePath) {
    return atom.project.relativizePath(absolutePath);
  },

  getRelative(absolutePath) {
    return this.getBaseDirAndRelativePath(absolutePath)[1];
  },

};
