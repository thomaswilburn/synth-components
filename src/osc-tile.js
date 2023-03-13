import { context, BaseTile } from "./lib/base-tile.js";

class OscTile extends BaseTile {
  constructor() {
    super();
    this.audioNode = new OscillatorNode(context);
    this.audioNode.start();
  }

  static observedAttributes = ["wavetype"];

  attributeChangedCallback(attr, was, value) {
    switch (attr) {
      case "wavetype":
        this.audioNode.type = value;
        break;
    }
  }
}

window.customElements.define("osc-tile", OscTile);