// Web Audio API Synthesizer Node for AURAVEND Sci-Fi Audio Environment
// Creates fully synthesized sounds on-the-fly without requiring external audio assets.

let audioContext: AudioContext | null = null;
let ambientOscillator: OscillatorNode | null = null;
let ambientGainNode: GainNode | null = null;

function ensureContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
  return audioContext;
}

/**
 * Play a high-fidelity digital coin insertion drop effect
 */
export function playCoinChime() {
  try {
    const ctx = ensureContext();
    const now = ctx.currentTime;

    // Direct chime (pure metal resonant frequency)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = "sine";
    osc2.type = "triangle";

    // Resonance frequencies for standard metal slot entry
    osc1.frequency.setValueAtTime(880, now); // A5 chord
    osc1.frequency.exponentialRampToValueAtTime(1760, now + 0.08); // high harmonic lift
    
    osc2.frequency.setValueAtTime(1320, now); // E6
    osc2.frequency.exponentialRampToValueAtTime(2640, now + 0.12);

    gainNode.gain.setValueAtTime(0.12, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);

    osc1.stop(now + 0.4);
    osc2.stop(now + 0.4);
  } catch (e) {
    console.warn("Audio Context unavailable or blocked on current browser viewport", e);
  }
}

/**
 * Play a swept filter laser dispensing hum effect
 */
export function playDispensingSound(duration: number = 1.8) {
  try {
    const ctx = ensureContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gainNode = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(80, now);
    // Vibrating pulse
    osc.frequency.linearRampToValueAtTime(110, now + duration);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(250, now);
    filter.frequency.exponentialRampToValueAtTime(1200, now + duration * 0.5);
    filter.frequency.exponentialRampToValueAtTime(150, now + duration);
    filter.Q.setValueAtTime(5, now);

    gainNode.gain.setValueAtTime(0.06, now);
    // Pulse animation LFO style
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.1);
  } catch (e) {
    console.warn("Audio unavailable", e);
  }
}

/**
 * Play a beautiful electronic arpeggio upon successful molecular formulation synthesis
 */
export function playSuccessChime() {
  try {
    const ctx = ensureContext();
    const now = ctx.currentTime;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio chord
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gainNode.gain.setValueAtTime(0.0, now);
      gainNode.gain.linearRampToValueAtTime(0.08, now + idx * 0.08 + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.4);
    });
  } catch (e) {
    console.warn("Audio chime failed to execute", e);
  }
}

/**
 * Synthesize a highly customized tactical consumption sound:
 * Sip / Gulp / Bubbles (liquids) vs Crunch / Snap (snacks)
 */
export function playConsumptionSound(isSnack: boolean) {
  try {
    const ctx = ensureContext();
    const now = ctx.currentTime;

    if (isSnack) {
      // Synthesize a dry crispy crunch sound
      const osc = ctx.createOscillator();
      const noiseGain = ctx.createGain();
      
      osc.type = "triangle";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(440, now + 0.02);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.12);

      noiseGain.gain.setValueAtTime(0.08, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);

      // Mini-crunch echo
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const noiseGain2 = ctx.createGain();
        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(320, now + 0.08);
        osc2.frequency.exponentialRampToValueAtTime(60, now + 0.16);
        noiseGain2.gain.setValueAtTime(0.05, now + 0.08);
        noiseGain2.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc2.connect(noiseGain2);
        noiseGain2.connect(ctx.destination);
        osc2.start(now + 0.08);
        osc2.stop(now + 0.25);
      }, 80);
    } else {
      // Synthesize liquid drink sip (bubbly sliding noise)
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.15);
      osc.frequency.linearRampToValueAtTime(200, now + 0.3);

      gainNode.gain.setValueAtTime(0.05, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    }
  } catch (e) {
    console.warn("Consumption sound failed", e);
  }
}

/**
 * Activate the background ambient core reactor low hum frequency drone
 */
export function startAmbientHum(baseFrequence: number = 55) {
  try {
    const ctx = ensureContext();
    const now = ctx.currentTime;

    // Clean up previous instance to prevent multiple audio threads accumulating
    stopAmbientHum();

    ambientOscillator = ctx.createOscillator();
    ambientGainNode = ctx.createGain();

    // Warm, sub-harmonic oscillation (55Hz standard power grid frequency)
    ambientOscillator.type = "sine";
    ambientOscillator.frequency.setValueAtTime(baseFrequence, now);

    // Warmth harmonic overtone
    const overtoneOsc = ctx.createOscillator();
    overtoneOsc.type = "triangle";
    overtoneOsc.frequency.setValueAtTime(baseFrequence * 2, now);

    ambientGainNode.gain.setValueAtTime(0.02, now); // extremely low volume to serve as pleasant ambient drone

    ambientOscillator.connect(ambientGainNode);
    overtoneOsc.connect(ambientGainNode);
    ambientGainNode.connect(ctx.destination);

    ambientOscillator.start(now);
    overtoneOsc.start(now);

    // Track state by saving reference
    (ambientOscillator as any).overtoneOsc = overtoneOsc;
  } catch (e) {
    console.warn("Ambient hum initialization rejected by autoplay blocker policies", e);
  }
}

/**
 * Live tune the ambient hum frequency dynamically
 */
export function updateAmbientHumFreq(freq: number) {
  if (ambientOscillator) {
    try {
      const now = ensureContext().currentTime;
      ambientOscillator.frequency.linearRampToValueAtTime(freq, now + 0.1);
      if ((ambientOscillator as any).overtoneOsc) {
        (ambientOscillator as any).overtoneOsc.frequency.linearRampToValueAtTime(freq * 2, now + 0.1);
      }
    } catch (e) {
       // bypass silent
    }
  }
}

/**
 * Shut down ambient hum
 */
export function stopAmbientHum() {
  try {
    if (ambientOscillator) {
      ambientOscillator.stop();
      ambientOscillator.disconnect();
      if ((ambientOscillator as any).overtoneOsc) {
        const ov = (ambientOscillator as any).overtoneOsc;
        ov.stop();
        ov.disconnect();
      }
      ambientOscillator = null;
    }
    if (ambientGainNode) {
      ambientGainNode.disconnect();
      ambientGainNode = null;
    }
  } catch (e) {
    // bypass silence
  }
}
