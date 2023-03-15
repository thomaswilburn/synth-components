import context from "./lib/audio-context.js";
import { BaseTile } from "./lib/base-tile.js";

class AmpTile extends BaseTile {

  static autoParamSlots = ["gain"]

  constructor() {
    super();
    this.audioNode = new GainNode(context);
  }

  static observedAttributes = [...BaseTile.observedAttributes, "gain"];
  attributeChangedCallback(attr, was, value) {
    super.attributeChangedCallback(attr, was, value);
    switch (attr) {
      case "gain":
        this.audioNode.gain.value = value;
    }
  }

}

window.customElements.define("gain-tile", AmpTile);