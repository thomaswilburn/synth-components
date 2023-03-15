import context from "./lib/audio-context.js";
import mixer from "./lib/aux-mixer.js";
import { BaseTile } from "./lib/base-tile.js";

class AuxReturn extends BaseTile {
  constructor() {
    super();
    this.audioNode = new GainNode(context);
  }

  static observedAttributes = ["bus"];
  attributeChangedCallback(_, was, value) {
    if (was) {
      mixer.disconnectReturn(was, this.audioNode);
    }
    mixer.connectReturn(value, this.audioNode);
  }
}

window.customElements.define("aux-return", AuxReturn);