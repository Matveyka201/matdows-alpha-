
const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
let ctx: AudioContext | null = null;

const getCtx = () => {
  if (!ctx) ctx = new AudioContext();
  return ctx;
};

const playTone = (freq: number, type: OscillatorType, duration: number, delay: number = 0, vol: number = 0.1) => {
  try {
    const audio = getCtx();
    // Resume context if suspended (browser autoplay policy)
    if (audio.state === 'suspended') {
      audio.resume();
    }

    const osc = audio.createOscillator();
    const gain = audio.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audio.currentTime + delay);
    
    // Envelope for smooth sound
    gain.gain.setValueAtTime(0, audio.currentTime + delay);
    gain.gain.linearRampToValueAtTime(vol, audio.currentTime + delay + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + delay + duration);

    osc.connect(gain);
    gain.connect(audio.destination);

    osc.start(audio.currentTime + delay);
    osc.stop(audio.currentTime + delay + duration);
  } catch (e) {
    console.error("Audio play failed", e);
  }
};

export const playStartup = () => {
  // A nice major chord sweep
  const start = 0.1;
  playTone(329.63, 'sine', 2.0, start, 0.1);       // E4
  playTone(440.00, 'sine', 2.0, start + 0.2, 0.1); // A4
  playTone(659.25, 'sine', 3.0, start + 0.4, 0.1); // E5
  playTone(880.00, 'sine', 3.0, start + 0.6, 0.05); // A5
};

export const playWindowOpen = () => {
  // An ascending cheerful slide
  playTone(400, 'sine', 0.1, 0, 0.05);
  playTone(600, 'sine', 0.2, 0.05, 0.05);
};

export const playWindowClose = () => {
  // A descending close sound
  playTone(600, 'sine', 0.1, 0, 0.05);
  playTone(400, 'sine', 0.2, 0.05, 0.05);
};

export const playMinimize = () => {
  playTone(300, 'sine', 0.2, 0, 0.05);
};

export const playMaximize = () => {
  playTone(500, 'sine', 0.2, 0, 0.05);
};

export const playError = () => {
  // Harsh square wave
  playTone(150, 'sawtooth', 0.4, 0, 0.1);
  playTone(145, 'sawtooth', 0.4, 0.05, 0.1);
};

export const playClick = () => {
  // Subtle high blip
  playTone(1200, 'sine', 0.05, 0, 0.02);
};

export const playNotification = () => {
  playTone(880, 'sine', 0.1, 0, 0.1);
  playTone(880, 'sine', 0.1, 0.15, 0.1);
};
