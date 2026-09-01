// Atmospheric, Classical High-Register Romantic Piano Synthesizer
// Custom-tuned for delicate, crystalline acoustic piano timbre (clear bell-like hammer attack & lush harmonic decay)

class RomanticPianoEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isInitialized: boolean = false;
  private lastScrollTime: number = 0;
  private scrollIndex: number = 0;

  // Gentle, high-register romantic pentatonic scale (airy, delicate, bell-like piano notes)
  // C5, D5, E5, G5, A5, C6, D6, E6
  private notes = [
    523.25, // C5
    587.33, // D5
    659.25, // E5
    783.99, // G5
    880.00, // A5
    1046.50, // C6
    1174.66, // D6
    1318.51, // E6
  ];

  public init() {
    if (this.isInitialized && this.ctx && this.ctx.state === 'running') return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!this.ctx) {
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.isInitialized = true;
    } catch (e) {
      console.warn('AudioContext initialization error:', e);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Play a delicate, high-register romantic piano tone with soft hammer attack and singing resonance
   */
  public playPianoNote(frequency: number, volume = 0.05, duration = 2.0) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || this.ctx.state !== 'running') return;

    try {
      const now = this.ctx.currentTime;

      // Master output envelope
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(0.0001, now);
      masterGain.gain.linearRampToValueAtTime(volume, now + 0.008);
      masterGain.gain.exponentialRampToValueAtTime(volume * 0.4, now + 0.12);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      // Warm acoustic soundboard filter
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3200, now);
      filter.frequency.exponentialRampToValueAtTime(1400, now + duration);

      // 1. Soft Piano Hammer Felt Transient
      const strike = this.ctx.createOscillator();
      const strikeGain = this.ctx.createGain();
      strike.type = 'triangle';
      strike.frequency.setValueAtTime(frequency * 2.2, now);

      strikeGain.gain.setValueAtTime(0.0001, now);
      strikeGain.gain.linearRampToValueAtTime(0.08, now + 0.004);
      strikeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

      strike.connect(strikeGain);
      strikeGain.connect(filter);
      strike.start(now);
      strike.stop(now + 0.04);

      // 2. Piano String Overtones (Fundamental, 2nd, 3rd, 4th partials)
      const harmonics = [
        { ratio: 1.0, amp: 1.0, decay: 1.0 },
        { ratio: 2.0, amp: 0.42, decay: 0.8 },
        { ratio: 3.01, amp: 0.18, decay: 0.55 },
        { ratio: 4.02, amp: 0.08, decay: 0.35 },
      ];

      harmonics.forEach(({ ratio, amp, decay }) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const pGain = this.ctx.createGain();

        // Subtle natural grand piano chorus micro-detuning
        const detune = (Math.random() - 0.5) * 1.5;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(frequency * ratio + detune, now);

        const hDuration = duration * decay;
        pGain.gain.setValueAtTime(0.0001, now);
        pGain.gain.linearRampToValueAtTime(amp, now + 0.008);
        pGain.gain.exponentialRampToValueAtTime(0.0001, now + hDuration);

        osc.connect(pGain);
        pGain.connect(filter);

        osc.start(now);
        osc.stop(now + hDuration);
      });

      filter.connect(masterGain);
      masterGain.connect(this.ctx.destination);
    } catch {
      // Audio safety
    }
  }

  /**
   * Responds to user scroll by triggering gentle, melodic piano notes
   */
  public onScrollTick(deltaY: number) {
    if (this.isMuted) return;
    const now = performance.now();
    // Musical throttling
    if (now - this.lastScrollTime < 160) return;
    if (Math.abs(deltaY) < 14) return;

    this.lastScrollTime = now;

    if (deltaY > 0) {
      this.scrollIndex = (this.scrollIndex + 1) % this.notes.length;
    } else {
      this.scrollIndex = (this.scrollIndex - 1 + this.notes.length) % this.notes.length;
    }

    const freq = this.notes[this.scrollIndex];
    const vol = Math.min(0.05, 0.018 + Math.abs(deltaY) * 0.0003);
    this.playPianoNote(freq, vol, 1.8);
  }

  /**
   * Lush rolled romantic piano arpeggio chord for milestone moments
   */
  public playEtherealBellChord() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || this.ctx.state !== 'running') return;

    // Romantic Arpeggio: C5, E5, G5, B5, D6
    const chord = [523.25, 659.25, 783.99, 987.77, 1174.66];
    chord.forEach((freq, idx) => {
      setTimeout(() => {
        this.playPianoNote(freq, 0.045, 2.6);
      }, idx * 75);
    });
  }

  public playSoftChime() {
    this.playEtherealBellChord();
  }

  /**
   * Single soft piano note tap
   */
  public playSoftTap() {
    this.playPianoNote(659.25, 0.035, 1.0);
  }
}

export const soundEffects = new RomanticPianoEngine();
