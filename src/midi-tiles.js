import { midi } from "./lib/midi.js";
import context from "./lib/audio-context.js";
import { BaseTile } from "./lib/base-tile.js";

class MidiVCA extends BaseTile {

  midiChannel = 0;
  midiController = 0;
  min = 0;
  max = 1;
  type = "cc";

  static bindMethods = ["whenCC"];

  constructor() {
    super();
    this.audioNode = new ConstantSourceNode(context);
    this.audioNode.offset.value = 0;
    this.audioNode.start();

    midi.addEventListener("controlchange", this.whenCC);
  }

  static observedAttributes = ["midichannel", "midicontroller", "min", "max", "value"];

  attributeChangedCallback(attr, was, value) {
    switch (attr) {
      case "midichannel":
        this.midiChannel = value * 1;
        break;

      case "midicontroller":
        this.midiController = value * 1;
        break;

      case "max":
      case "min":
        this[attr] = value * 1;
        break;

      case "value":
        this.audioNode.offset.value = value * 1;
        break;
    }
  }

  whenCC(e) {
    var { channel, controller, value } = e.data;
    if (channel != this.midiChannel || controller != this.midiController) return;
    var ratio = value / 127;
    var range = this.max - this.min;
    var offset = ratio * range + this.min;
    this.audioNode.offset.value = offset;
  }
}

window.customElements.define("midi-vca", MidiVCA);

class MidiNoteFrequency extends BaseTile {
  midiChannel = 0;

  static bindMethods = ["whenNote"];

  constructor() {
    super();
    this.audioNode = new ConstantSourceNode(context);
    this.audioNode.offset.value = 440;
    this.audioNode.start();

    midi.addEventListener("noteon", this.whenNote);
  }

  static observedAttributes = ["midiChannel"];
  attributeChangedCallback(attr, was, value) {
    this.midiChannel = value * 1;
  }

  whenNote(e) {
    var { frequency } = e.data;
    this.audioNode.offset.value = frequency;
  }
}

window.customElements.define("midi-note-frequency", MidiNoteFrequency);

class MidiPitchbend extends BaseTile {
  midiChannel = 0;
  range = 90;

  static bindMethods = ["whenPitch"];

  constructor() {
    super();
    this.audioNode = new ConstantSourceNode(context);
    this.audioNode.offset.value = 0;
    this.audioNode.start();

    midi.addEventListener("pitchbend", this.whenPitch);
  }

  static observedAttributes = ["midichannel", "range"];

  attributeChangedCallback(attr, was, value) {
    switch (attr) {
      case "midichannel":
        this.midiChannel = value * 1;
        break;

      case "range":
        this.range = value * 1;
        break;
    }
  }

  whenPitch(e) {
    var { channel, scaled } = e.data;
    if (channel != this.midiChannel) return;
    this.audioNode.offset.value = this.range * scaled;
  }
}

window.customElements.define("midi-pitchbend", MidiPitchbend);