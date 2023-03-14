import { context, BaseTile } from "./lib/base-tile.js";
import { EnvelopeNode } from "./lib/envelope-node.js";

class ADSRTile extends BaseTile {
  static template = `
<pre>== ADSR ==</pre>
  `;

  constructor() {
    super();
    this.audioNode = new EnvelopeNode(context);

    document.body.addEventListener("keydown", e => !e.repeat && this.audioNode.start());
    document.body.addEventListener("keyup", () => this.audioNode.stop());
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
        this.audioNode[attr] = value * 1;
        break;
    }
  }
}

window.customElements.define("adsr-tile", ADSRTile);