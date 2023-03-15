import { context, BaseTile } from "./lib/base-tile.js";

class DelayTile extends BaseTile {
  
  constructor() {
    super();
    this.audioNode = new DelayNode(context);
  }

  static observedAttributes = ["time"];
  attributeChangedCallback(attr, was, value) {
    this.audioNode.delayTime.value = value * 1;
  }
}

window.customElements.define("delay-tile", DelayTile);