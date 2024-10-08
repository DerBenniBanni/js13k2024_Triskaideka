// This music has been exported by SoundBox. You can use it with
// http://sb.bitsnbites.eu/player-small.js in your own product.

// See http://sb.bitsnbites.eu/demo.html for an example of how to
// use it in a demo.

const AUDIO_SFX_LASER = 1;
// Song data
let sfxLaser = {
      songData: [
        { // Instrument 0
          i: [
          0, // OSC1_WAVEFORM
          255, // OSC1_VOL
          127, // OSC1_SEMI
          48, // OSC1_XENV
          0, // OSC2_WAVEFORM
          255, // OSC2_VOL
          110, // OSC2_SEMI
          0, // OSC2_DETUNE
          63, // OSC2_XENV
          0, // NOISE_VOL
          0, // ENV_ATTACK
          0, // ENV_SUSTAIN
          60, // ENV_RELEASE
          21, // ENV_EXP_DECAY
          0, // ARP_CHORD
          0, // ARP_SPEED
          0, // LFO_WAVEFORM
          0, // LFO_AMT
          0, // LFO_FREQ
          0, // LFO_FX_FREQ
          2, // FX_FILTER
          16, // FX_FREQ
          117, // FX_RESONANCE
          4, // FX_DIST
          142, // FX_DRIVE
          0, // FX_PAN_AMT
          0, // FX_PAN_FREQ
          60, // FX_DELAY_AMT
          1 // FX_DELAY_TIME
          ],
          // Patterns
          p: [1],
          // Columns
          c: [
            {n: [176],
             f: []}
          ]
        },
      ],
      rowLen: 5513,   // In sample lengths
      patternLen: 4,  // Rows per pattern
      endPattern: 0,  // End pattern
      numChannels: 1  // Number of channels
    };

loadMusic(sfxLaser, AUDIO_SFX_LASER, false);
