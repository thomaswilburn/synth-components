import context from "./lib/audio-context.js";
import { BaseTile } from "./lib/base-tile.js";

class OscTile extends BaseTile {
  static autoParamSlots = ["frequency", "detune"];

  constructor() {
    super();
    this.audioNode = new OscillatorNode(context);
    this.audioNode.frequency.value = 0;
    this.audioNode.start();
  }

  static observedAttributes = [...BaseTile.observedAttributes, "wavetype", "frequency"];
  attributeChangedCallback(attr, was, value) {
    super.attributeChangedCallback(attr, was, value);
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