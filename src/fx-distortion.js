import context from "./lib/audio-context.js";
import { BaseTile } from "./lib/base-tile.js";

const PI = Math.PI;
const POINTS = 7;

export class FxDistortion extends BaseTile {
  constructor() {
    super();

    this.audioNode = new WaveShaperNode(context);
    this.audioNode.curve = this.generateCosineCurve();
    this.audioNode.oversample = true;
  }

  generateCosineCurve(overdrive = .5) {
    var curve = new Float32Array(POINTS);
    var k = overdrive * 100;
    for (var i = 0; i < curve.length; i++) {
      var x = (i / (POINTS - 1)) * 2 - 1;
      curve[i] = (PI + k) * x / (PI + k * Math.abs(x));
    }
    return curve;
  }

  static observedAttributes = ["drive"];
  attributeChangedCallback(attr, was, value) {
    super.attributeChangedCallback(attr, was, value);
    switch (attr) {
      case "drive":
        this.audioNode.curve = this.generateCosineCurve(value * 1);
        break;
    }
  }
}

window.customElements.define("fx-distortion", FxDistortion);