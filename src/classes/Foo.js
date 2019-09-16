export default class Foo {
  constructor() {
    this._created = Date.now();
  }

  get created() {
    return this._created;
  }
}
