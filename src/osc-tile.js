import { context, BaseTile } from "./lib/base-tile.js";

class OscTile extends BaseTile {
  static template = `
<pre>== OSCILLATOR ==</pre>
  `;
  static autoParamSlots = ["frequency"];

  constructor() {
    super();
    this.audioNode = new OscillatorNode(context);
    this.audioNode.start();
  }

  static observedAttributes = ["wavetype", "frequency"];
  attributeChangedCallback(attr, was, value) {
    switch (attr) {
      case "wavetype":
        this.audioNode.type = value;
        break;

      case "frequency":
        this.audioNode.frequency.value = value;
        break;
    }
  }
}

window.customElements.define("osc-tile", OscTile);