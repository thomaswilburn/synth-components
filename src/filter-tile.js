import { context, BaseTile } from "./lib/base-tile.js";

class FilterTile extends BaseTile {
  static template = `
<fieldset>
  <legend>Filter</legend>
  <slot name="frequency">
    <label for="f-input">Frequency</label>
    <input type="number" as="frequency">
  </slot>
</fieldset>
<fieldset class="inputs">
  <legend>&raquo;</legend>
  <slot></slot>
</fieldset>
  `;

  static autoParamSlots = ["Q"];

  constructor() {
    super();
    this.audioNode = new BiquadFilterNode(context);
    this.elements.frequency.addEventListener("input", e => this.audioNode.frequency.value = e.target.value);
  }

  static observedAttributes = ["filtertype", "frequency"];
  attributeChangedCallback(attr, was, value) {
    switch (attr) {
      case "filtertype":
        this.audioNode.type = value;
        break;

      case "frequency":
        this.audioNode.frequency.value = value;
        this.elements.frequency.value = value;
        break;
    }
  }
}

window.customElements.define("filter-tile", FilterTile);