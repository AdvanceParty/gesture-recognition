import * as tf from '@tensorflow/tfjs';
import * as mobilenetModule from '@tensorflow-models/mobilenet';
import * as knnClassifier from '@tensorflow-models/knn-classifier';

import { prediction } from '../stores/store.js';

export default class Trainer {
  constructor() {
    this.ready = false;
    this._TOPK = 3;
    this._classifier = knnClassifier.create();
  }

  async loadModule() {
    this.mobilenet = await mobilenetModule.load();
    this.ready = true;
    return this.ready;
  }

  set ready(bool) {
    this._ready = bool;
  }

  get ready() {
    return this._ready;
  }

  addExample(source, label) {
    if (!this.mobilenet) return;

    try {
      const image = tf.browser.fromPixels(source);
      const logits = this.mobilenet.infer(image, 'conv_preds');
      this._classifier.addExample(logits, label);

      image.dispose();
      logits.dispose();
    } catch (e) {
      //
    }
  }

  async predictClass(source) {
    const numClasses = this._classifier.getNumClasses();
    if (numClasses === 0) return;

    try {
      const image = tf.browser.fromPixels(source);
      const logits = this.mobilenet.infer(image, 'conv_preds');
      const res = await this._classifier.predictClass(logits, this._TOPK);

      prediction.set({
        label: res.label,
        confidences: res.confidences,
      });

      image.dispose();
      logits.dispose();

      return { labelId: res.label, confidences: res.confidences };
    } catch (e) {
      //
    }
  }
}
