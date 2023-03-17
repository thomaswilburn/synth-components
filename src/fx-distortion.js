import context from "./lib/audio-context.js";
import { BaseTile } from "./lib/base-tile.js";

const PI = Math.PI;
const POINTS = 15;

const CURVES = {
  k: (a, x) => (PI + a * 100) * x / (PI + a * 100 * Math.abs(x)),
  e: (a, x) => (1 - Math.E ** (-Math.abs(x))) || 0,
  sin: (a, x) => Math.sin(x * PI * .5) * (a * .5 + 1),
  atan: (a, x) => (Math.atan(x) / PI) * (4 + a * 2),
  hard: (a, x) => x * (a + 1)
}

export class FxDistortion extends BaseTile {

  type = "k";

  constructor() {
    super();

    this.audioNode = new WaveShaperNode(context);
    this.audioNode.curve = this.generateCurve();
    this.audioNode.oversample = "4x";
  }

  generateCurve(overdrive = .5) {
    var curve = new Float32Array(POINTS);
    var shaper = CURVES[this.type];
    for (var i = 0; i < curve.length; i++) {
      var x = (i / (POINTS - 1)) * 2 - 1;
      curve[i] = shaper(overdrive, x);
    }
    return curve;
  }

  static observedAttributes = ["drive"];
  attributeChangedCallback(attr, was, value) {
    super.attributeChangedCallback(attr, was, value);
    switch (attr) {
      case "drive":
        this.audioNode.curve = this.generateCurve(value * 1);
        break;
    }
  }
}

window.customElements.define("fx-distortion", FxDistortion);