const isSupported = () => navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
const unsupportedMsg = 'Browser API navigator.mediaDevices.getUserMedia not available';

export default class WebcamConnector {
  static get FacingMode() {
    return { ...facingMode };
  }

  constructor({
    videoElement = null,
    width = 300,
    height = 250,
    audio = false,
    facingMode = WebcamConnector.FacingMode.User,
  } = {}) {
    this.width = width;
    this.height = height;
    this.facingMode = facingMode;
    this.audio = audio;

    if (videoElement) {
      this.videoElement = videoElement;
    }
  }

  async start() {
    if (!isSupported) {
      throw new Error(unsupportedMsg);
    }

    const stream = await navigator.mediaDevices.getUserMedia(this.options);
    this.videoElement.srcObject = stream;
    return new Promise(resolve => {
      this.videoElement.onloadedmetadata = () => {
        resolve(this.videoElement);
      };
    });
  }

  get options() {
    return {
      video: {
        width: this.width,
        height: this.height,
        facingMode: this.facingMode,
      },
      audio: this.audio,
    };
  }

  set facingMode(str) {
    this._facingMode = str;
  }
  get facingMode() {
    return this._facingMode;
  }

  set width(width) {
    this._width = width;
  }

  get width() {
    return this._width;
  }

  set height(height) {
    this._height = height;
  }

  get height() {
    return this._height;
  }
  set audio(val) {
    this._audio = val;
  }

  get audio() {
    return this._audio;
  }

  set videoElement(el) {
    this._videoElement = el;
  }
  get videoElement() {
    return this._videoElement;
  }
}

const facingMode = {
  User: 'user',
  Selfie: 'user',
  Reverse: 'user',
  Rear: 'user',
  Environment: 'environment',
  Front: 'environment',
  Main: 'environment',
};
