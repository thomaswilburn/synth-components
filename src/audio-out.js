import context from "./lib/audio-context.js";
import { BaseTile } from "./lib/base-tile.js";
import { midi } from "./lib/midi.js";

export class AudioOut extends BaseTile {
  static template = `
<fieldset>
  <legend>Synthesizer</legend>
  <button as="resume">Start audio</button>
  <button as="midi">Start MIDI</button>
  <slot></slot>
</fieldset>
  `

  static bindMethods = ["whenResumed"];

  constructor() {
    super();
    this.audioNode = context.destination;
    this.elements.resume.addEventListener("click", this.whenResumed);
    this.elements.midi.addEventListener("click", () => midi.getAccess());
  }

  whenResumed() {
    context.resume();
  }
}

window.customElements.define("audio-out", AudioOut);