// Web Audio API based authentic acoustic & devotional sound synthesizer

class SacredAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Synthesize authentic Conch Shell (Shankhnaad / शंखनाद) sound
   */
  public playShankhnaad() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const duration = 4.2;

      // Master gain for conch
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, now);
      masterGain.gain.linearRampToValueAtTime(0.35, now + 0.8);
      masterGain.gain.setValueAtTime(0.35, now + 2.5);
      masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      masterGain.connect(ctx.destination);

      // Low pass filter for warm acoustic horn timbre
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.linearRampToValueAtTime(1400, now + 1.2);
      filter.frequency.linearRampToValueAtTime(700, now + duration);
      filter.Q.value = 4.5;
      filter.connect(masterGain);

      // Fundamental frequency oscillator (approx. 432 Hz concert pitch / authentic conch note)
      const baseFreq = 425;
      const osc1 = ctx.createOscillator();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(baseFreq * 0.95, now);
      osc1.frequency.linearRampToValueAtTime(baseFreq, now + 0.6);
      osc1.frequency.linearRampToValueAtTime(baseFreq * 1.02, now + 2.0);
      osc1.frequency.linearRampToValueAtTime(baseFreq * 0.96, now + duration);

      // Harmonic overtone
      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(baseFreq * 2 * 0.95, now);
      osc2.frequency.linearRampToValueAtTime(baseFreq * 2, now + 0.6);
      osc2.frequency.linearRampToValueAtTime(baseFreq * 2 * 1.02, now + 2.0);

      // LFO for organic breath tremor
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 5.5; // vibrato rate
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 6;
      lfo.connect(osc1.frequency);
      lfo.connect(osc2.frequency);

      // Sub harmonic warmth
      const oscSub = ctx.createOscillator();
      oscSub.type = 'sine';
      oscSub.frequency.setValueAtTime(baseFreq * 0.5, now);

      osc1.connect(filter);
      osc2.connect(filter);
      oscSub.connect(filter);

      lfo.start(now);
      osc1.start(now);
      osc2.start(now);
      oscSub.start(now);

      lfo.stop(now + duration);
      osc1.stop(now + duration);
      osc2.stop(now + duration);
      oscSub.stop(now + duration);
    } catch (e) {
      console.warn('Audio synthesis error:', e);
    }
  }

  /**
   * Synthesize Temple Brass Bell (Mandir Ghanti / मंदिर की घंटी)
   */
  public playTempleBell() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const duration = 2.8;

      // Inharmonic frequencies typical of tuned brass bells
      const freqs = [1046, 2093, 2793, 3135, 4186];
      const gains = [0.3, 0.2, 0.15, 0.08, 0.04];

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(gains[idx], now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration * (1 - idx * 0.15));

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + duration);
      });
    } catch (e) {
      console.warn('Audio synthesis error:', e);
    }
  }

  /**
   * Synthesize Sacred Jal / Arghya Stream (जल अर्पण)
   */
  public playArghyaStream() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const duration = 2.5;

      // Noise buffer for sacred pouring water effect
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.2;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(600, now);
      bandpass.frequency.exponentialRampToValueAtTime(1400, now + 1.2);
      bandpass.frequency.exponentialRampToValueAtTime(450, now + duration);
      bandpass.Q.value = 3.0;

      const streamGain = ctx.createGain();
      streamGain.gain.setValueAtTime(0.01, now);
      streamGain.gain.linearRampToValueAtTime(0.2, now + 0.3);
      streamGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      whiteNoise.connect(bandpass);
      bandpass.connect(streamGain);
      streamGain.connect(ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + duration);

      // Complement with a gentle bell chime
      this.playTempleBell();
    } catch (e) {
      console.warn('Audio synthesis error:', e);
    }
  }

  /**
   * Synthesize gentle Diya Lighting glow chime
   */
  public playDiyaLight() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const notes = [587.33, 739.99, 880.00, 1174.66]; // D5, F#5, A5, D6 - Auspicious Raag Bhupali notes

      notes.forEach((note, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(note, now + index * 0.08);

        gain.gain.setValueAtTime(0.001, now + index * 0.08);
        gain.gain.linearRampToValueAtTime(0.12, now + index * 0.08 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.08 + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + index * 0.08);
        osc.stop(now + index * 0.08 + 1.3);
      });
    } catch (e) {
      console.warn('Audio synthesis error:', e);
    }
  }
}

export const soundSynth = new SacredAudioSynthesizer();
