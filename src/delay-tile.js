import context from "./lib/audio-context.js";
import { BaseTile } from "./lib/base-tile.js";

export class DelayTile extends BaseTile {

  static autoParamSlots = ["delayTime"];
  
  constructor() {
    super();
    this.audioNode = new DelayNode(context);
  }

  static observedAttributes = [...BaseTile.observedAttributes, "time"];
  attributeChangedCallback(attr, was, value) {
    super.attributeChangedCallback(attr, was, value);
    if (attr == "time") {
      this.audioNode.delayTime.value = value * 1;
    }
  }
}

window.customElements.define("delay-tile", DelayTile);