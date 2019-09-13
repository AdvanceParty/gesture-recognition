class MessageBox {
  constructor({ title = '', maxMessages = 5, className = 'msgBox', pointerEvents = 'none' } = {}) {
    this._containerNode = document.createElement('div');
    this._containerNode.className = className;

    this._titleNode = document.createElement('h2');
    this._containerNode.appendChild(this._titleNode);

    this._bodyNode = document.createElement('div');
    this._containerNode.appendChild(this._bodyNode);

    this._messages = [];
    this.title = title;
    this.maxMessages = maxMessages;
    this.pointerEvents = pointerEvents;
  }

  set pointerEvents(str) {
    // when set to 'none', the message box won't block
    // clock events for objects which are stacked beneath it on the page
    // see: css pointer-events property for more info
    this._containerNode.style.pointerEvents = str;
  }

  set maxMessages(num) {
    this._maxMessages = Math.max(0, Number(num));
  }

  get maxMessages() {
    return this._maxMessages;
  }
  get html() {
    return this._containerNode;
  }

  set title(str) {
    if (str != this.title) {
      this._titleText = str;
      this._titleNode.innerHTML = str;
    }
  }

  get title() {
    return this._titleText;
  }

  pushMesage(msg) {
    this._messages.push(msg);
    const el = document.createElement('p');
    const txt = document.createTextNode(msg);

    el.appendChild(txt);

    this._bodyNode.appendChild(el);

    while (this._bodyNode.childNodes.length > this.maxMessages) {
      this._bodyNode.removeChild(this._bodyNode.childNodes[0]);
    }
  }

  clearMessages() {
    this._bodyNode.innerHTML = '';
  }

  get lastMessage() {
    return this.getMessageAt(this._messages.length - 1);
  }

  getMessageAt(index) {
    return this._messages[index];
  }

  getAllMessages() {
    return [...this._messages];
  }
}

export default MessageBox;
