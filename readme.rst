"A Eurorack in your DOM"
========================

A set of components for generating synthesizer patches, similar to a modular synth. Each "tile" in the synth will automatically connect output to the parent element, all the way up to a ``<audio-out>`` tag that represents the AudioContext destination. For example, this code will generate a filtered A note::

    <audio-out>
      <filter-tile type="bandpass" frequency="440">
        <osc-tile frequency="220" type="triangle"></osc-tile>
      </filter-tile>
    </audio-out>

In addition to mapping output through audio inputs and outputs, you can also assign a signal to a node's AudioParams using slots. This code will modulate the filter frequency by 50Hz every second::

    <filter-tile frequency=200>
      <gain-tile gain=50 slot=frequency>
        <osc-tile frequency=1></osc-tile>
      </gain-tile>
    </filter-tile>

All tiles can send a copy of their output to an aux bus by using the ``send`` attribute, and the audio can be returned to a different part of the signal graph through an ``<aux-return>`` element. This lets you create effect chains and wet/dry mixes. For example, here's a synth with a chorus effect applied::

    <!-- original output -->
    <synth-tile send="chorus"></synth-tile>
    <delay-tile time=".01">
      <!-- signal return -->
      <aux-return bus="chorus"></aux-return>
      <!-- LFO tweaking the delay time -->
      <gain-tile slot="delayTime" gain=".01">
        <osc-tile frequency="2"></osc-tile>
      </gain-tile>
    </delay-tile>


Primitive tiles
===============

These tiles generally host a WebAudio signal node directly.

``<audio-out>``
---------------

**AudioNode type:** ``AudioContext.destination``

**AudioParam slots:**

* None

**Attributes:**

* None

This tag is used to provide an output sink, so it will typically be the outermost element in your synth patch.

``<delay-tile>``
----------------

**AudioNode type:** ``DelayNode``

**AudioParam slots:**

* ``delayTime``

**Attributes:**

* ``time`` - controls the delay time in seconds

Delays a signal by a certain amount. Can also be used to set up feedback loops, which will otherwise be muted by the WebAudio API if they don't contain a ``DelayNode``.

``<filter-tile>``
-----------------

**AudioNode type:** ``BiquadFilterNode``

**AudioParam slots:**

* ``frequency``
* ``Q``

**Attributes:**

* ``frequency``
* ``q``
* ``type`` - selects between allowed filter types (lowpass, highpass, bandpass, notch, lowshelf, highshelf, peaking, and allpass)

Applies a frequency-domain filter to its inputs.

``<gain-tile>``
---------------

**AudioNode type:** ``GainNode``

**AudioParam slots:**

* ``gain``

**Attributes:**

* ``gain``

Amplifies a signal by a given amount. This can be applied to audio, but also to control values. For example, you might put an oscillator inside a gain tile to scale its numerical range for manipulating an AudioParam.

``<noise-tile>``
---------------

**AudioNode type:** ``AudioBufferSourceNode``

**AudioParam slots:**

* None

**Attributes:**

* None

Plays a looped noise sample. Each element creates its own noise buffer, so they can be layered without chorusing.

``<osc-tile>``
---------------

**AudioNode type:** ``OscillatorNode``

**AudioParam slots:**

* ``frequency``
* ``detune``

**Attributes:**

* ``waveform`` - selects a wave type (sine, square, triangle, or sawtooth)
* ``frequency``

Emits a regular audio signal, suitable for subtractive synthesis.


MIDI tiles
==========

These tiles listen to any connected MIDI controllers, providing the ability to trigger parts of the synth from a keyboard. As such, they're intended only as "control voltage" sources, usually hooked into an AudioParam by being slotted into another element. All MIDI elements support a ``midichannel`` attribute for selecting a specific message channel.

``<midi-vca>``
---------------

**Attributes:**

* ``midichannel``
* ``midicontroller`` - Select the specific CC id to listen on.
* ``min`` - Minimum output value (when the raw CC value is 0)
* ``max`` - Maximum output value (when the raw CC value is 127)
* ``value`` - Starting output value

This element listens for Control Change messages and outputs a corresponding value. It's useful for setting a knob to tune a synth parameter.

``<midi-pitchbend>``
--------------------

**Attributes:**

* ``midichannel``
* ``range`` - specifies how large the output range should be on either side of zero

This element listens for Pitch Wheel Change messages and outputs a corresponding value. By default its range is ±90, for when slotted into an oscillator's ``detune`` AudioParam.

``<midi-note-frequency>``
-------------------------

**Attributes:**

* ``midichannel``

This element emits the frequency value corresponding the last pressed Note On message as a constant signal. You can use this to patch into the ``frequency`` AudioParam slot of an oscillator tile if you're building a synth voice manually instead of using the ``synth-voice`` element (see below).


Complex tiles
=============

These units provide more complex functionality, often internally chaining together several AudioNodes, to provide common synth functionality.

``<adsr-tile>``
---------------

**Attributes:**

* ``midichannel``
* ``initial`` - Starting amplitude
* ``attack`` - Attack time in seconds
* ``peak`` - Amplitude at the end of the attack phase
* ``decay`` - Decay time in seconds
* ``sustain`` - Amplitude at the end of the decay phase and during note hold
* ``release`` - Release time in seconds

This element listeners for MIDI Note On and Note Off messages and emits a control voltage following an ADSR envelope in response.

``<envelope-tile>``
-------------------

**Attributes:**

* Same as ``asdr-tile``

Like an ADSR tile, but with a GainNode integrated into it, so that it automatically controls the volume of its inputs in response to MIDI.

``<synth-tile>``
----------------

**Attributes:**

* All attributes from ``adsr-tile``
* ``waveform`` - same as on ``osc-tile``

Like an envelope tile, but integrates an OscillatorNode. If you just want to make noises when a MIDI key is pressed, this is an easy way to hook that up in a single tag.

