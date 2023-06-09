import context from "./lib/audio-context.js";
import { BaseTile } from "./lib/base-tile.js";

export class SourceOscillator extends BaseTile {
  static autoParamSlots = ["frequency", "detune"];

  constructor() {
    super();
    this.audioNode = new OscillatorNode(context);
    this.audioNode.frequency.value = 0;
    this.audioNode.start();
  }

  static observedAttributes = [...BaseTile.observedAttributes, "waveform", "frequency"];
  attributeChangedCallback(attr, was, value) {
    super.attributeChangedCallback(attr, was, value);
    switch (attr) {
      case "waveform":
        this.audioNode.type = value;
        break;

      case "frequency":
        this.audioNode.frequency.value = value;
        break;
    }
  }
}

window.customElements.define("source-osc", SourceOscillator);