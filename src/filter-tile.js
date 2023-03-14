import { context, BaseTile } from "./lib/base-tile.js";

class FilterTile extends BaseTile {
  static template = `
<fieldset>
  <legend>Filter</legend>
  <slot></slot>
</fieldset>
  `;

  static autoParamSlots = ["frequency", "Q"];

  constructor() {
    super();
    this.audioNode = new BiquadFilterNode(context);
  }

  static observedAttributes = ["filtertype", "frequency"];
  attributeChangedCallback(attr, was, value) {
    switch (attr) {
      case "filtertype":
        this.audioNode.type = value;
        break;

      case "frequency":
        this.audioNode.frequency.value = value;
        break;
    }
  }
}

window.customElements.define("filter-tile", FilterTile);