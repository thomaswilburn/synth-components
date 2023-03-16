import context from "./lib/audio-context.js";
import { BaseTile } from "./lib/base-tile.js";
import { EnvelopeNode } from "./lib/envelope-node.js";
import { midi } from "./lib/midi.js";

// pure parameter control, useful for slotting envelopes into other things
export class MidiADSR extends BaseTile {
  midiChannel = 0;
  #keyCount = 0;

  static bindMethods = ["whenNoteOn", "whenNoteOff"];

  constructor() {
    super();
    this.audioNode = this.envelope = new EnvelopeNode(context);

    midi.addEventListener("noteon", this.whenNoteOn);
    midi.addEventListener("noteoff", this.whenNoteOff);
  }

  static observedAttributes = [
    ...BaseTile.observedAttributes,
    "initial",
    "peak",
    "sustain",
    "attack",
    "decay",
    "release",
    "midichannel"
  ];

  attributeChangedCallback(attr, was, value) {
    super.attributeChangedCallback(attr, was, value);
    switch (attr) {
      case "initial":
      case "peak":
      case "sustain":
      case "attack":
      case "decay":
      case "release":
        this.envelope[attr] = value * 1;
        break;

      case "midichannel":
        this.midiChannel = value * 1;
    }
  }

  whenNoteOn(e) {
    var { channel } = e.data;
    if (channel != this.midiChannel) return;
    this.#keyCount++;
    this.envelope.start();
  }

  whenNoteOff(e) {
    var { channel } = e.data;
    if (channel != this.midiChannel) return;
    this.#keyCount--;
    if (this.#keyCount == 0) {
      this.envelope.stop();
    }
  }
}

window.customElements.define("midi-adsr", MidiADSR);

// actual ADSR gain envelope, covers the common use pattern of gain-tile > adsr-tile[slot=gain]
export class MidiEnvelope extends MidiADSR {
  constructor() {
    super();
    this.audioNode = new GainNode(context, { gain: 0 });
    this.envelope = new EnvelopeNode(context);

    this.envelope.connect(this.audioNode.gain);

    midi.addEventListener("noteon", this.whenNoteOn);
    midi.addEventListener("noteoff", this.whenNoteOff);
  }
}

window.customElements.define("midi-envelope", MidiEnvelope);
