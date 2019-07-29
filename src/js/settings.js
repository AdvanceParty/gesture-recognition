const ELEMENTS = {
  VIDEO: document.getElementsByTagName('video')[0],
  CANVAS: document.getElementsByTagName('canvas')[0],
  BTN_VIDEO_TOGGLE: document.getElementById('btn_toggleVideo'),
  MSG_BOX: document.getElementById('btn_toggleVideo'),
};

const CONFIG = {
  TICK_MS: 100,
  MODEL: {
    flipHorizontal: true, // flip e.g for video
    maxNumBoxes: 1, // maximum number of boxes to detect
    iouThreshold: 0.5, // ioU threshold for non-max suppression
    scoreThreshold: 0.6, // confidence threshold for predictions.
  },
};

module.exports.ELEMENTS = ELEMENTS;
module.exports.CONFIG = CONFIG;
