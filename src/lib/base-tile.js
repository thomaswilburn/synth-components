import dom from "./dom.js";

export var context = new AudioContext();

export class BaseTile extends HTMLElement {

  #initialized = false;
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
    this.whenSlotInput = this.whenSlotInput.bind(this);

    this.elements = {};
    
    var root = this.attachShadow({ mode: "open" });
    if (def.template) {
      root.innerHTML = def.template;
    }

    if (def.autoParamSlots) {
      root.append(...def.autoParamSlots.map(name => dom("slot", { name })));
    }

    var slots = root.querySelectorAll("slot");
    for (var slot of slots) {
      slot.addEventListener("slotchange", this.whenSlotChanged);
      slot.addEventListener("input", this.whenSlotInput);
    }

    var assigned = root.querySelectorAll("[as]");
    for (var element of assigned) {
      this.elements[element.getAttribute("as")] = element;
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
    if (!this.parentElement) this.audioNode.disconnect();
  }

  connectAudioTo(destination) {
    if (this.#connectedTo == destination) return;
    this.audioNode.disconnect(this.#connectedTo);
    this.audioNode.connect(destination);
    this.#connectedTo = destination;
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

  whenSlotInput(e) {
    e.stopPropagation();
    var input = e.target;
    var slot = e.currentTarget;
    var param = this.audioNode[slot.name];
    if (param) param.value = input.valueAsNumber;
  }

}