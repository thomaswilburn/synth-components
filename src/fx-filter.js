import context from "./lib/audio-context.js";
import { BaseTile } from "./lib/base-tile.js";

export class FxFilter extends BaseTile {

  static autoParamSlots = ["frequency", "Q"];

  constructor() {
    super();
    this.audioNode = new BiquadFilterNode(context);
    this.audioNode.frequency.value = 0;
  }

  static observedAttributes = [...BaseTile.observedAttributes, "type", "frequency"];
  attributeChangedCallback(attr, was, value) {
    super.attributeChangedCallback(attr, was, value);
    switch (attr) {
      case "type":
        this.audioNode.type = value;
        break;

      case "frequency":
        this.audioNode.frequency.value = value;
        break;
    }
  }
}

window.customElements.define("fx-filter", FxFilter);