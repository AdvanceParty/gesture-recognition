import 'babel-polyfill';
import * as handTrack from 'handtrackjs';
import { ELEMENTS, CONFIG } from './js/settings.js';

const init = async () => {
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
    if (predictions[0]) {
      const { bbox } = predictions[0];

      const x = bbox[0];
      const y = bbox[1];
      const w = bbox[2];
      const h = bbox[3];

      setMsg(`${x}\n${y}\n${w}\n${h}`);

      context.clearRect(0, 0, ELEMENTS.CANVAS.width, ELEMENTS.CANVAS.height);
      context.strokeStyle = '#00FF00';
      context.rect(x, y, w, h);
      context.stroke();
    }
  });
  setTimeout(() => update(model, context), CONFIG.TICK_MS);
};

const setMsg = msg => {
  const msgBox = document.getElementById('msg_box');
  msgBox.innerText = msg;
};

init();
