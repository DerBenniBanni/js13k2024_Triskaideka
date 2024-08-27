    // This music has been exported by SoundBox. You can use it with
    // http://sb.bitsnbites.eu/player-small.js in your own product.

    // See http://sb.bitsnbites.eu/demo.html for an example of how to
    // use it in a demo.

const AUDIO_SFX_ENGINE = 4;
    // Song data
let sfxEngine = {
      songData: [
        { // Instrument 0
          i: [
          0, // OSC1_WAVEFORM
          59, // OSC1_VOL
          92, // OSC1_SEMI
          0, // OSC1_XENV
          3, // OSC2_WAVEFORM
          21, // OSC2_VOL
          95, // OSC2_SEMI
          0, // OSC2_DETUNE
          0, // OSC2_XENV
          97, // NOISE_VOL
          11, // ENV_ATTACK
          212, // ENV_SUSTAIN
          31, // ENV_RELEASE
          0, // ENV_EXP_DECAY
          16, // ARP_CHORD
          4, // ARP_SPEED
          2, // LFO_WAVEFORM
          35, // LFO_AMT
          6, // LFO_FREQ
          1, // LFO_FX_FREQ
          2, // FX_FILTER
          94, // FX_FREQ
          73, // FX_RESONANCE
          0, // FX_DIST
          69, // FX_DRIVE
          0, // FX_PAN_AMT
          0, // FX_PAN_FREQ
          134, // FX_DELAY_AMT
          1 // FX_DELAY_TIME
          ],
          // Patterns
          p: [1],
          // Columns
          c: [
            {n: [159],
             f: []}
          ]
        },
      ],
      rowLen: 5513,   // In sample lengths
      patternLen: 32,  // Rows per pattern
      endPattern: 0,  // End pattern
      numChannels: 1  // Number of channels
    };

loadMusic(sfxEngine, AUDIO_SFX_ENGINE, false);