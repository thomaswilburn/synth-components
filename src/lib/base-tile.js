import dom from "./dom.js";
import context from "./audio-context.js";
import mixer from "./aux-mixer.js";

export class BaseTile extends HTMLElement {

  #connectedTo = undefined;

  constructor() {
    super();
    var def = new.target;
    if (def.bindMethods) {
      for (var method of def.bindMethods) {
        this[method] = this[method].bind(this);
      }
    }

    this.whenSlotChanged = this.whenSlotChanged.bind(this);

    this.elements = {};
    
    var root = this.attachShadow({ mode: "open" });
    root.innerHTML = def.template || `<slot></slot>`;

    if (def.autoParamSlots) {
      root.append(...def.autoParamSlots.map(name => dom("slot", { name })));
    }

    var slots = root.querySelectorAll("slot");
    for (var slot of slots) {
      slot.addEventListener("slotchange", this.whenSlotChanged);
    }

    var assigned = root.querySelectorAll("[as]");
    for (var element of assigned) {
      this.elements[element.getAttribute("as")] = element;
    }
  }

  disconnectedCallback() {
    if (!this.parentElement) this.audioNode.disconnect();
  }

  connectAudioTo(destination) {
    if (this.#connectedTo) {
      if (this.#connectedTo == destination) return;
      this.audioNode.disconnect(this.#connectedTo);
    }
    this.audioNode.connect(destination);
    this.#connectedTo = destination;
  }

  static observedAttributes = ["send"];
  attributeChangedCallback(attr, was, value) {
    switch (attr) {
      case "send":
        if (was) {
          mixer.disconnectSend(was, this.audioNode);
        }
        mixer.connectSend(value, this.audioNode);
        break;
    }
  }

  whenSlotChanged(e) {
    var slot = e.target;
    var children = slot.assignedElements().filter(c => c instanceof BaseTile);
    var dest = this.audioNode;
    if (slot.name) {
      var param = this.audioNode[slot.name];
      if (param) dest = param;
    }
    // connect children to this node
    for (var child of children) {
      child.connectAudioTo(dest);
    }
  }

}