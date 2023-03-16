import context from "./lib/audio-context.js";
import { BaseTile } from "./lib/base-tile.js";

export class SourceNoise extends BaseTile {
  constructor() {
    super();
    var { sampleRate } = context;
    var length = 13 * sampleRate;
    var samples = Float32Array.from({ length: 13 * context.sampleRate }, () => Math.random() * 2 - 1);
    var buffer = new AudioBuffer({ length, sampleRate });
    buffer.copyToChannel(samples, 0);
    this.audioNode = new AudioBufferSourceNode(context, { buffer, loop: true });
    this.audioNode.start();
  }
}

window.customElements.define("source-noise", SourceNoise);