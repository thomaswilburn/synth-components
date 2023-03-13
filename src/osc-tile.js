import { context, BaseTile } from "./lib/base-tile.js";

class OscTile extends BaseTile {
  constructor() {
    super();
    this.audioNode = new OscillatorNode(context);
    this.audioNode.start();
  }
}

window.customElements.define("osc-tile", OscTile);