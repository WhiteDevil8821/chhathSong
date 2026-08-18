// Web Audio API based authentic acoustic & devotional sound synthesizer

class SacredAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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
      streamGain.gain.linearRampToValueAtTime(0.22, now + 0.3);
      streamGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      whiteNoise.connect(bandpass);
      bandpass.connect(streamGain);
      streamGain.connect(ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + duration);
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
