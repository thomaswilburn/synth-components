import { context } from "./base-tile.js";

export class EnvelopeNode {
  // levels
  initial = 0;
  peak = 1;
  sustain = .5;

  // timing
  attack = .1;
  decay = .1;
  release = .2;

  constructor() {
    this.constant = new ConstantSourceNode(context);
    this.constant.offset.value = 0;
    this.constant.start();
  }

  connect(dest) {
    this.constant.connect(dest);
  }

  disconnect(dest) {
    this.constant.disconnect(dest);
  }

  start() {
    this.cancel();
    var now = context.currentTime;
    var { offset } = this.constant;
    offset.value = this.initial;
    offset.linearRampToValueAtTime(this.peak, now + this.attack);
    offset.setTargetAtTime(this.sustain, now + this.attack, this.decay);
  }

  stop() {
    var release = context.currentTime + this.release;
    this.constant.offset.linearRampToValueAtTime(0, release);
  }

  cancel() {
    this.constant.offset.cancelScheduledValues(0);
    this.constant.offset.value = 0;
  }
}