import { context, BaseTile } from "./lib/base-tile.js";

var mixer = {
  channels: {},

  getChannel(name) {
    var channel = this.channels[name];
    if (!channel) {
      channel = this.channels[name] = new GainNode(context);
    }
    return channel;
  },

  connectSend(name, node) {
    var bus = this.getChannel(name);
    node.connect(bus);
  },

  connectReturn(name, node) {
    var bus = this.getChannel(name);
    bus.connect(node);
  },

  disconnectSend(name, node) {
    var bus = this.getChannel(name);
    node.disconnect(bus);
  },

  disconnectReturn(name, node) {
    var bus = this.getChannel(name);
    bus.disconnect(node);
  }
}

class AuxSend extends BaseTile {

  constructor() {
    super();
    this.audioNode = new GainNode(context);
  }

  static observedAttributes = ["bus"];
  attributeChangedCallback(_, was, value) {
    if (was) {
      mixer.disconnectSend(was, this.audioNode);
    }
    mixer.connectSend(value, this.audioNode);
  }
}

window.customElements.define("aux-send", AuxSend);

class AuxReturn extends BaseTile {
  constructor() {
    super();
    this.audioNode = new GainNode(context);
  }

  static observedAttributes = ["bus"];
  attributeChangedCallback(_, was, value) {
    if (was) {
      mixer.disconnectReturn(was, this.audioNode);
    }
    mixer.connectReturn(value, this.audioNode);
  }
}

window.customElements.define("aux-return", AuxReturn);