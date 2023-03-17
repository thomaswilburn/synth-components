import context from "./lib/audio-context.js";
import { BaseTile } from "./lib/base-tile.js";
import { midi, NOTE_ON, NOTE_OFF, CONTROL_CHANGE } from "./lib/midi.js";

var keyMap = {
  a: 60, // middle C
  w: 61,
  s: 62,
  e: 63,
  d: 64,
  f: 65,
  t: 66,
  g: 67,
  y: 68,
  h: 69,
  u: 70,
  j: 71,
  k: 72
}

export class AudioOut extends BaseTile {
  static template = `
<style>
  :host {
    display: block;
    max-width: 800px;
    margin: auto;
  }

  fieldset {
    display: flex;
    text-align: center;
    font-family: sans-serif;
  }

  fieldset:focus-within legend {
    background: #808;
    color: white;
  }

  label {
    padding: 8px;
  }
</style>
<div class="outer">
  <fieldset>
    <legend>Synthesizer</legend>
    <button as="resume">Start audio</button>
    <slot></slot>
  </fieldset>
  <fieldset>
    <legend>MIDI</legend>
    <button as="midiaccess">Start MIDI</button>
    <label>
      Channel
      <input value="0" type="number" as="channel">
    </label>
    <label>
      CC ID
      <input value="16" type="number" as="ccID">
    </label>
    <label>
      CC value
      <input type="range" min="0" max="127" value="64" as="ccValue">
    </label>
    <label>
      Keyboard Zone
      <input type="text" as="note">
    </label>
  </fieldset>
</div>
  `

  static bindMethods = ["whenResumed", "whenCC", "whenKeyDown", "whenKeyUp"];

  constructor() {
    super();
    this.audioNode = context.destination;
    this.elements.resume.addEventListener("click", this.whenResumed);
    this.elements.midiaccess.addEventListener("click", () => midi.getAccess());
    this.elements.ccValue.addEventListener("input", this.whenCC);
    this.elements.note.addEventListener("keydown", this.whenKeyDown);
    this.elements.note.addEventListener("keyup", this.whenKeyUp);
  }

  whenResumed() {
    context.resume();
  }

  whenCC(e) {
    var value = e.target.valueAsNumber;
    var id = this.elements.ccID.valueAsNumber;
    var channel = this.elements.channel.valueAsNumber;
    midi.fake(CONTROL_CHANGE, channel, id, value);
  }

  whenKeyDown(e) {
    if (e.key in keyMap && !e.repeat) {
      var note = keyMap[e.key];
      var channel = this.elements.channel.valueAsNumber;
      midi.fake(NOTE_ON, channel, note, 64);
    }
    e.preventDefault();
  }

  whenKeyUp(e) {
    if (e.key in keyMap) {
      var note = keyMap[e.key];
      var channel = this.elements.channel.valueAsNumber;
      midi.fake(NOTE_OFF, channel, note);
    }
  }
}

window.customElements.define("audio-out", AudioOut);