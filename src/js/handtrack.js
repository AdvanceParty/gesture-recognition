import * as handTrack from 'handtrackjs';
import MessageBox from './utils/MessageBox';

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

const msgBox = new MessageBox();

const init = async () => {
  msgBox.title = 'HandTracker JS Library';
  document.body.appendChild(msgBox.html);

  var video = ELEMENTS.VIDEO;

  setMsg('Hang on a minute. Setting up.');
  ELEMENTS.BTN_VIDEO_TOGGLE.onclick = e => toggleVideo();
  ELEMENTS.BTN_VIDEO_TOGGLE.disabled = true;
  const model = await loadTrackingModel();
  ELEMENTS.BTN_VIDEO_TOGGLE.disabled = false;
  startVideo();
  update(model, ELEMENTS.CANVAS.getContext('2d'));
  setMsg('HELLO!');
};

const loadTrackingModel = () => {
  return handTrack.load(CONFIG.MODEL);
};

const toggleVideo = () => {
  const hidden = ELEMENTS.VIDEO.classList.toggle('hidden');
  ELEMENTS.BTN_VIDEO_TOGGLE.innerText = hidden ? 'Show Video' : 'Hide Video';
};

const startVideo = () => {
  return handTrack.startVideo(ELEMENTS.VIDEO);
};

const update = (model, context) => {
  model.detect(ELEMENTS.VIDEO).then(predictions => {
    context.clearRect(0, 0, ELEMENTS.CANVAS.width, ELEMENTS.CANVAS.height);

    if (predictions[0]) {
      const { bbox } = predictions[0];

      const x = bbox[0];
      const y = bbox[1];
      const w = bbox[2];
      const h = bbox[3];

      setMsg(`${x}\n${y}\n${w}\n${h}`);

      context.strokeStyle = '#00FF00';
      context.rect(x, y, w, h);
      context.stroke();
    }
  });
  setTimeout(() => update(model, context), CONFIG.TICK_MS);
};

const setMsg = msg => {
  msgBox.pushMesage(msg);
};

init();
