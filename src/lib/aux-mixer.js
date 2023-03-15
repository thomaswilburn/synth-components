import context from "./audio-context.js";

export default {
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