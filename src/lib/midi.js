import dom from "./dom.js";

export class MIDITargetEvent extends Event {
  constructor(type, data) {
    super(type);
    this.data = data;
  }
}

export const NOTE_OFF = 8;
export const NOTE_ON = 9;
export const AFTERTOUCH = 10;
export const CONTROL_CHANGE = 11;
export const PROGRAM_CHANGE = 12;
export const CHANNEL_AFTERTOUCH = 13;
export const PITCH_BEND = 14;

export class MIDITarget extends EventTarget {

  constructor() {
    super();
    this.onMIDI = this.onMIDI.bind(this);
    this.getAccess();
  }

  async getAccess() {
    if (!navigator.requestMIDIAccess) return;
    var midi = await navigator.requestMIDIAccess();
    this.midi = midi;
    for (var entry of midi.inputs.values()) {
      entry.onmidimessage = this.onMIDI;
    }
    this.fire("ready", midi);
  }

  toFrequency(note) {
    var semitones = note - 69;
    var f = Math.pow(2, semitones/12) * 440;
    return f;
  }

  onMIDI(e) {
    var [ a, b, c ] = e.data;
    var message = a >> 4;
    var channel = a & 0xF;
    switch (message) {
      case NOTE_ON:
      case NOTE_OFF:
        if (c == 0 || message == NOTE_OFF) {
          this.fire("noteoff", { channel, key: b });
        } else {
          var frequency = this.toFrequency(b);
          this.fire("noteon", { channel, key: b, pressure: c, frequency });
        }
        break;

      case CONTROL_CHANGE:
        this.fire("controlchange", { channel, controller: b, value: c });
        break;

      case PITCH_BEND:
        var amount = (c << 7) | b;
        var maxPitch = (2**14) - 1;
        var scaled = (amount / maxPitch) * 2 - 1;
        scaled = Math.round(scaled * 1000) / 1000;
        this.fire("pitchbend", { channel, amount, scaled })

      // other message types unimplemented because my keyboard doesn't fire them

    }

  }

  fake(message, channel, b, c) {
    var a = (message << 4) + channel;
    var e = { data: [a, b, c] };
    this.onMIDI(e);
  }

  sendMIDI(message, channel = 0, b = 0, c = 0) {
    if (!this.midi) return;
    // should probably be targeted?
    var a = (message << 4) + channel;
    for (var entry of this.midi.outputs.values()) {
      entry.send([a, b, c]);
    }
  }

  sendReset() {
    // reset all controllers, all channels
    for (var i = 0; i < 16; i++) {
      this.sendMIDI(CONTROL_CHANGE, i, 121);
    }
  }

  fire(event, data = {}) {
    var e = new MIDITargetEvent(event, data);
    console.log(event, data);
    this.dispatchEvent(e);
  }

  on(event, callback) {
    this.addEventListener(event, callback);
  }

  off(event, callback) {
    this.removeEventListener(event, callback);
  }

}

export var midi = new MIDITarget();