import { context, BaseTile } from "./lib/base-tile.js";

class AmpTile extends BaseTile {
  static template = `
GAIN NODE
<slot></slot>
  `;

  constructor() {
    super();
    this.audioNode = new GainNode(context);
  }

}

window.customElements.define("amp-tile", AmpTile);