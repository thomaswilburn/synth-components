import { MidiADSR } from "./midi-adsr.js";
import context from "./lib/audio-context.js";
import { EnvelopeNode } from "./lib/envelope-node.js";
import { midi } from "./lib/midi.js";

// full synth voice
export class SourceMonosynth extends MidiADSR {

  constructor() {
    super();
    this.audioNode = new GainNode(context, { gain: 0 });
    this.envelope = new EnvelopeNode(context);
    this.oscillator = new OscillatorNode(context);

    this.envelope.connect(this.audioNode.gain);
    this.oscillator.connect(this.audioNode);
    this.oscillator.start();

    midi.addEventListener("noteon", this.whenNoteOn);
    midi.addEventListener("noteoff", this.whenNoteOff);
  }

  static observedAttributes = [...MidiADSR.observedAttributes, "waveform"];
  attributeChangedCallback(attr, was, value) {
    super.attributeChangedCallback(attr, was, value);
    switch (attr) {
      case "waveform":
        this.oscillator.type = value;
        break;
    }
  }

  whenNoteOn(e) {
    var { frequency } = e.data;
    this.oscillator.frequency.value = frequency;
    super.whenNoteOn(e);
  }
}

window.customElements.define("source-monosynth", SourceMonosynth);