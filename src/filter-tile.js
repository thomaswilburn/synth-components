import { context, BaseTile } from "./lib/base-tile.js";

class FilterTile extends BaseTile {
  static template = `
<h3>Filter</h3>
<fieldset class="inputs">
  <legend>&raquo;</legend>
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