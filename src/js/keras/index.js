import * as tf from '@tensorflow/tfjs';
import * as mobilenetModule from '@tensorflow-models/mobilenet';
import * as knnClassifier from '@tensorflow-models/knn-classifier';

import MessageBox from '../classes/MessageBox';
import { WebcamConnector } from '../classes/WebcamConnector';

const WebCam = require('../classes/WebcamConnector');

// Number of classes to classify
const NUM_CLASSES = 3;

// K value for KNN
const TOPK = 3;
const infoTexts = [];
let training = -1;
let classifier;
let mobilenet;

const video = document.createElement('video');
const camOptions = {
  width: 300,
  height: 250,
  videoElement: video,
};
/**
 * Setup training GUI. Adds a training button for each class,
 * and sets up mouse events.
 */
function setupGui() {
  const ui = document.createElement('div');
  ui.className = 'ui';
  document.body.appendChild(ui);

  // Create training buttons and info texts
  for (let i = 0; i < NUM_CLASSES; i++) {
    const div = document.createElement('div');
    const button = document.createElement('button');
    const infoText = document.createElement('span');

    div.appendChild(button);
    div.appendChild(infoText);

    button.innerText = 'Train ' + i;
    button.addEventListener('mousedown', evt => (training = i));

    infoText.innerText = ' No examples added';
    infoTexts.push(infoText);

    ui.appendChild(div);
  }
}

async function render() {
  // Get image data from video element
  const image = tf.browser.fromPixels(video);
  let logits;
  // 'conv_preds' is the logits activation of MobileNet.
  const infer = () => mobilenet.infer(image, 'conv_preds');

  // Train class if one of the buttons is held down
  if (training != -1) {
    logits = infer();
    // Add current image to classifier
    classifier.addExample(logits, training);
    training = -1;
  }

  // If the classifier has examples for any classes, make a prediction!
  const numClasses = classifier.getNumClasses();
  if (numClasses > 0) {
    logits = infer();

    const res = await classifier.predictClass(logits, TOPK);
    for (let i = 0; i < NUM_CLASSES; i++) {
      // Make the predicted class bold
      if (res.classIndex == i) {
        infoTexts[i].style.fontWeight = 'bold';
      } else {
        infoTexts[i].style.fontWeight = 'normal';
      }

      const classExampleCount = classifier.getClassExampleCount();
      // Update info text
      if (classExampleCount[i] > 0) {
        const conf = res.confidences[i] * 100;
        infoTexts[i].innerText = ` ${classExampleCount[i]} examples - ${conf}%`;
      }
    }
  }

  image.dispose();
  if (logits != null) {
    logits.dispose();
  }

  requestAnimationFrame(render);
}

/**
 * Kicks off the demo by loading the knn model, finding and loading
 * available camera devices, and setting off the render function.
 */
const init = async () => {
  const mBox = new MessageBox();
  const cam = new WebcamConnector(camOptions);

  video.autoplay = true;
  video.className = 'video';
  video.style.opacity = 0.2;

  document.body.appendChild(mBox.html);
  document.body.appendChild(video);

  mBox.title = 'KNN Classifiers for Gesture Recognition';
  mBox.pushMesage('Connecting to webcam.');
  await cam.start();

  mBox.clearMessages();
  mBox.pushMesage('Webcam connected!');
  mBox.pushMesage('Loading models.');
  classifier = knnClassifier.create();
  mobilenet = await mobilenetModule.load();

  mBox.clearMessages();
  mBox.pushMesage('Ready!');
  video.style.opacity = 1;

  // Setup the GUI
  setupGui();

  // kickoff the render loop
  render();
};

init();
