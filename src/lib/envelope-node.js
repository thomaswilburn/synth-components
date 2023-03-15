import { context } from "./base-tile.js";

export class EnvelopeNode {
  // levels
  initial = 0;
  peak = 1;
  sustain = .3;

  // timing
  attack = .1;
  decay = .2;
  release = .5;

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
    var now = context.currentTime;
    var { offset } = this.constant;
    offset.cancelScheduledValues(0);
    offset.linearRampToValueAtTime(this.peak, now + this.attack);
    offset.setTargetAtTime(this.sustain, now + this.attack, this.decay);
  }

  stop() {
    var { offset } = this.constant;
    var value = offset.value;
    // FF doesn't support cancelAndHoldAtTime()
    offset.cancelScheduledValues(context.currentTime);
    offset.setValueAtTime(value, 0);
    offset.setTargetAtTime(0, 0, this.release);
  }
}