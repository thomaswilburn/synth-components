import { context, BaseTile } from "./lib/base-tile.js";

class AmpTile extends BaseTile {
  static template = `
<fieldset>
  <legend>Gain</legend>
  <slot name="gain">
    <label>Volume</label>
    <input type="number" as="gain">
  </slot>
</fieldset>
<fieldset class="inputs">
  <legend>&raquo;</legend>
  <slot class="inputs"></slot>
</fieldset>
  `;

  constructor() {
    super();
    this.audioNode = new GainNode(context);
  }

  static observedAttributes = ["gain"];
  attributeChangedCallback(attr, was, value) {
    switch (attr) {
      case "gain":
        this.audioNode.gain.value = value;
        this.elements.gain.value = value;
    }
  }

}

window.customElements.define("gain-tile", AmpTile);