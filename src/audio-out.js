import { context, BaseTile } from "./lib/base-tile.js";

class AudioOut extends BaseTile {
  static template = `
<button class="resume">Start audio</button>
<slot></slot>
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