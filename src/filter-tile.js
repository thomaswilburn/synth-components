import { context, BaseTile } from "./lib/base-tile.js";

class FilterTile extends BaseTile {
  static template = `
FILTER
<slot></slot>
  `;

  static observedAttributes = ["filtertype"]

  constructor() {
    super();
    this.audioNode = new BiquadFilterNode(context);
  }

  attributeChangedCallback(attr, was, value) {
    switch (attr) {
      case "filtertype":
        this.audioNode.type = value;
        break;
    }
  }
}

window.customElements.define("filter-tile", FilterTile);