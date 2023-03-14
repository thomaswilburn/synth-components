import { context, BaseTile } from "./lib/base-tile.js";

class OscTile extends BaseTile {
  static template = `
<fieldset>
  <legend>Oscillator</legend>
  <slot name="frequency">
    <input as="frequency" type="number">
  </slot>
</fieldset>
  `;
  static autoParamSlots = ["frequency"];

  constructor() {
    super();
    this.audioNode = new OscillatorNode(context);
    this.audioNode.start();
    var fInput = this.elements.frequency;
    fInput.value = this.audioNode.frequency.value;
  }

  static observedAttributes = ["wavetype", "frequency"];
  attributeChangedCallback(attr, was, value) {
    switch (attr) {
      case "wavetype":
        this.audioNode.type = value;
        break;

      case "frequency":
        this.audioNode.frequency.value = value;
        this.elements.frequency.value = value;
        break;
    }
  }
}

window.customElements.define("osc-tile", OscTile);