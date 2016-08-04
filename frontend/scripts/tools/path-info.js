export default class LinkInfo {
  constructor(path, name, text) {
    this.path = path;
    this.name = name;
    this.text = text;
  }

  get text() {
    return this._text
  }

  set text(text) {
    this._text = text
  }

  get name() {
    return this._name
  }

  set name(name) {
    this._name = name
  }

  get path() {
    return this._path
  }

  set path(path) {
    this._path = path
  }

}
