import { context, BaseTile } from "./lib/base-tile.js";

class AudioOut extends BaseTile {
  static template = `
<fieldset>
  <legend>Synthesizer</legend>
  <button class="resume">Start audio</button>
  <slot></slot>
</fieldset>
  `

  constructor() {
    super();
    this.audioNode = context.destination;
    this.shadowRoot.querySelector(".resume").addEventListener("click", this.whenResumed.bind(this));
  }

  whenResumed() {
    context.resume();
  }
}

window.customElements.define("audio-out", AudioOut);