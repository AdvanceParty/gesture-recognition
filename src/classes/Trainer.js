import * as tf from '@tensorflow/tfjs';
import * as mobilenetModule from '@tensorflow-models/mobilenet';
import * as knnClassifier from '@tensorflow-models/knn-classifier';

export default class Trainer {
  constructor() {
    this.ready = false;
    this.TOPK = 3;
    this.classifier = knnClassifier.create();
  }

  async loadModule() {
    this.mobilenet = await mobilenetModule.load();
    this.ready = true;
    return this.ready;
  }

  addExample(source, label) {
    if (!this.mobilenet) return;
    try {
      const image = tf.browser.fromPixels(source);
      const logits = this.mobilenet.infer(image, 'conv_preds');
      this.classifier.addExample(logits, label);
      image.dispose();
      logits.dispose();
    } catch (e) {
      //
    }
  }

  async predictClass(source) {
    const numClasses = this.classifier.getNumClasses();
    if (numClasses === 0) return;

    try {
      const image = tf.browser.fromPixels(source);
      const logits = this.mobilenet.infer(image, 'conv_preds');
      const res = await this.classifier.predictClass(logits, this.TOPK);
      image.dispose();
      logits.dispose();
      return { labelId: res.label, confidences: res.confidences };
    } catch (e) {
      //
    }
  }
}
