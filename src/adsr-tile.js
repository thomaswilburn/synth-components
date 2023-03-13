import { context, BaseTile } from "./lib/base-tile.js";
import { EnvelopeNode } from "./lib/envelope-node.js";

class ADSRTile extends BaseTile {
  static template = `
ADSR!
  `;

  constructor() {
    super();
    this.audioNode = new GainNode(context);
    this.audioNode.gain.value = 0;
    this.envelope = new EnvelopeNode(context);
    this.oscillator = new OscillatorNode(context);

    this.oscillator.connect(this.audioNode);
    this.envelope.connect(this.audioNode.gain);
    this.oscillator.start();

    document.body.addEventListener("keydown", e => !e.repeat && this.envelope.start());
    document.body.addEventListener("keyup", () => this.envelope.stop());
  }
}

window.customElements.define("adsr-tile", ADSRTile);