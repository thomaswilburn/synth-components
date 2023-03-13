export var context = new AudioContext();

export class BaseTile extends HTMLElement {

  #initialized = false;

  constructor() {
    super();
    var def = new.target;
    if (def.bindMethods) {
      for (var method of def.bindMethods) {
        this[method] = this[method].bind(this);
      }
    }
    this.whenSlotChanged = this.whenSlotChanged.bind(this);
    if (def.template) {
      this.attachShadow({ mode: "open" });
      this.shadowRoot.innerHTML = def.template;
      var slots = this.shadowRoot.querySelectorAll("slot");
      for (var slot of slots) {
        slot.addEventListener("slotchange", this.whenSlotChanged);
      }
    }
  }

  connectedCallback() {
    if (this.#initialized) return;
    for (var { name, value } of this.attributes) {
      if (this.audioNode[name] instanceof AudioParam) {
        this.audioNode[name].value = value;
      }
    }
    this.#initialized = true;
  }

  disconnectedCallback() {
    this.audioNode.disconnect();
  }

  connectAudioTo(destination) {
    this.audioNode.connect(destination);
  }

  whenSlotChanged(e) {
    var slot = e.target;
    var children = slot.assignedElements().filter(c => c instanceof BaseTile);
    var dest = this.audioNode;
    if (slot.dataset.param) {
      var param = this.audioNode[slot.dataset.param];
      if (param) dest = param;
    }
    // connect children to this node
    for (var child of children) {
      child.connectAudioTo(this.audioNode);
    }
  }

}