import { context, BaseTile } from "./lib/base-tile.js";

class NoiseTile extends BaseTile {
  static template = `
NOISE
  `;

  constructor() {
    super();
    var { sampleRate } = context;
    var length = 13 * sampleRate;
    var samples = Float32Array.from({ length: 13 * context.sampleRate }, () => Math.random());
    var buffer = new AudioBuffer({ length, sampleRate });
    buffer.copyToChannel(samples, 0);
    this.audioNode = new AudioBufferSourceNode(context, { buffer, loop: true });
    this.audioNode.start();
  }
}

window.customElements.define("noise-tile", NoiseTile);