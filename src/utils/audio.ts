/**
 * Web Audio API synthesizer for romantic acoustic chimes, harp arpeggios, and heartbeat tones.
 * Zero external assets needed; works flawlessly offline and in sandboxed iframes.
 */

class RomanticAudio {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public playHeartbeat(fast = false) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const interval = fast ? 0.12 : 0.18;
      
      // Lub sound (low pitch sine with rapid decay)
      this.triggerThud(now, 72, 40, 0.18, 0.45);
      // Dub sound (slightly higher and punchier)
      this.triggerThud(now + interval, 88, 44, 0.22, 0.4);
    } catch {
      // Audio might be blocked until user gesture
    }
  }

  public playComingSoonMelody() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // An emotional ascending music-box arpeggio (C5, E5, G5, B5, C6, E6)
      const notes = [523.25, 659.25, 783.99, 987.77, 1046.5, 1318.51];
      notes.forEach((freq, idx) => {
        this.playChimeNote(freq, now + idx * 0.14, 1.2, 0.15);
      });
    } catch {
      // Audio error handling
    }
  }

  private triggerThud(time: number, startFreq: number, endFreq: number, duration: number, gainVal: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, time);
    osc.frequency.exponentialRampToValueAtTime(endFreq, time + duration);

    gain.gain.setValueAtTime(gainVal, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(time);
    osc.stop(time + duration);
  }

  public playRomanticCascade() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Romantic dream harp scale (F major 9 / D minor 9 - lush, dreamy and warm)
      // F4, A4, C5, E5, G5, A5, C6
      const freqs = [349.23, 440.0, 523.25, 659.25, 783.99, 880.0, 1046.5];

      freqs.forEach((f, index) => {
        const time = now + index * 0.08;
        this.playChimeNote(f, time, 0.9, 0.18);
      });

      // Second harmonic shimmer wave
      const sparkleFreqs = [1046.5, 1174.66, 1318.51, 1567.98];
      sparkleFreqs.forEach((f, index) => {
        const time = now + 0.35 + index * 0.09;
        this.playChimeNote(f, time, 1.2, 0.12);
      });
    } catch {
      // Audio error handling
    }
  }

  public playBurstSparkle() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const chimePool = [587.33, 659.25, 783.99, 880.0, 1046.5, 1318.51];
      const randomNote = chimePool[Math.floor(Math.random() * chimePool.length)];
      this.playChimeNote(randomNote, now, 0.6, 0.15);
    } catch {
      // Audio error handling
    }
  }

  private playChimeNote(freq: number, time: number, duration: number, maxVol: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle'; // triangle gives soft bell/harp like sweetness
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.exponentialRampToValueAtTime(maxVol, time + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(time);
    osc.stop(time + duration + 0.05);
  }
}

export const romanticAudio = new RomanticAudio();
