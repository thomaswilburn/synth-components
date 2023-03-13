Synth Components
================

**Still in experimental stages, use at your own risk**

"A Eurorack in your DOM"
------------------------

A set of components for generating synthesizer patches, similar to a modular synthesizer. Each "tile" in the synth will automatically connect output to the parent element, all the way up to a ``<audio-out>`` tag that represents the AudioContext destination. For example, this code will generate a filtered A note::

    <audio-out>
      <filter-tile>
        <osc-tile frequency="220" type="triangle"></osc-tile>
      </filter-tile>
    </audio-out>

In addition to mapping output through audio inputs and outputs, you can also assign a signal to a node's AudioParams using slots. This code will modulate the filter frequency by 50Hz every second::

    <filter-tile frequency=200>
      <amp-tile gain=50 slot=frequency>
        <osc-tile frequency=1></osc-tile>
      </amp-tile>
    </filter-tile>

Rack Tiles
----------

Generally, tiles are a 1:1 mapping between WebAudio nodes and the element they provide, although the names may be slightly different.

* ``audio-out``: ``AudioContext.destination``
* ``filter-tile``: ``BiquadFilterNode``
* ``gain-tile``: ``GainNode``
* ``osc-tile``: ``OscillatorNode``

Additionally, there are some tiles provided that incorporate common synth patch patterns so that they don't need to be built manually.

* ``noise-tile``: Outputs a sample of random noise (default: 13 seconds long)
* ``adsr-tile``: An attack/decay/sustain/release envelope controller.

Notes/To-do
-----------

* Add a constant source node
* Build out the aux sends and returns
* Add MIDI support
* Start adding controls in slot placeholders
* Shared stylesheet for component setup
* 