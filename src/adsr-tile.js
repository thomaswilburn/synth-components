import { context, BaseTile } from "./lib/base-tile.js";
import { EnvelopeNode } from "./lib/envelope-node.js";

class ADSRTile extends BaseTile {
  static template = `
ADSR!
<slot></slot>
  `;

  constructor() {
    super();
    this.audioNode = new GainNode(context);
    this.audioNode.gain.value = 0;
    this.envelope = new EnvelopeNode(context);

    this.envelope.connect(this.audioNode.gain);

    document.body.addEventListener("keydown", e => !e.repeat && this.envelope.start());
    document.body.addEventListener("keyup", () => this.envelope.stop());
  }

  static observedAttributes = ["initial", "peak", "sustain", "attack", "decay", "release"];

  attributeChangedCallback(attr, was, value) {
    switch (attr) {
      case "initial":
      case "peak":
      case "sustain":
      case "attack":
      case "decay":
      case "release":
        this.envelope[attr] = value * 1;
        break;
    }
  }
}

window.customElements.define("adsr-tile", ADSRTile);