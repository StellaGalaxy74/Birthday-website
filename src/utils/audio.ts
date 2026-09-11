// Web Audio Synthesizer & Sound Effects & TTS Controller

class SoundEngine {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private isAmbientPlaying = false;
  private ambientOscillators: OscillatorNode[] = [];
  private ambientInterval: number | null = null;
  private volume = 0.6;
  private isMuted = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Realistic Cricket Bat Strike Sound ("THWACK!")
  // Combines high-frequency leather impact transient, willow wood body knock,
  // low-end kinetic punch, and hollow blade cavity resonance.
  playBatThwack() {
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;
      const vol = this.isMuted ? 0 : this.volume;

      // 1. Initial High-Frequency Contact Transient (Leather seam strike on willow)
      const clickBufferSize = Math.floor(ctx.sampleRate * 0.025);
      const clickBuffer = ctx.createBuffer(1, clickBufferSize, ctx.sampleRate);
      const clickData = clickBuffer.getChannelData(0);
      for (let i = 0; i < clickBufferSize; i++) {
        clickData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (clickBufferSize * 0.15));
      }
      const clickSource = ctx.createBufferSource();
      clickSource.buffer = clickBuffer;
      const clickFilter = ctx.createBiquadFilter();
      clickFilter.type = 'bandpass';
      clickFilter.frequency.setValueAtTime(3200, now);
      clickFilter.Q.setValueAtTime(4.0, now);

      const clickGain = ctx.createGain();
      clickGain.gain.setValueAtTime(1.0 * vol, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.028);

      clickSource.connect(clickFilter);
      clickFilter.connect(clickGain);
      clickGain.connect(ctx.destination);
      clickSource.start(now);

      // 2. Primary Kashmir/English Willow Wood Knock (Sweet spot resonant drop)
      const woodOsc = ctx.createOscillator();
      const woodGain = ctx.createGain();
      woodOsc.type = 'triangle';
      woodOsc.frequency.setValueAtTime(380, now);
      woodOsc.frequency.exponentialRampToValueAtTime(95, now + 0.08);

      woodGain.gain.setValueAtTime(0.95 * vol, now);
      woodGain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

      woodOsc.connect(woodGain);
      woodGain.connect(ctx.destination);
      woodOsc.start(now);
      woodOsc.stop(now + 0.12);

      // 3. Willow Wood 2nd Harmonic (Warm overtone)
      const overtoneOsc = ctx.createOscillator();
      const overtoneGain = ctx.createGain();
      overtoneOsc.type = 'sine';
      overtoneOsc.frequency.setValueAtTime(760, now);
      overtoneOsc.frequency.exponentialRampToValueAtTime(210, now + 0.06);

      overtoneGain.gain.setValueAtTime(0.55 * vol, now);
      overtoneGain.gain.exponentialRampToValueAtTime(0.001, now + 0.075);

      overtoneOsc.connect(overtoneGain);
      overtoneGain.connect(ctx.destination);
      overtoneOsc.start(now);
      overtoneOsc.stop(now + 0.08);

      // 4. Low-End Kinetic Punch Thump (Massive power transfer)
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(110, now);
      subOsc.frequency.exponentialRampToValueAtTime(55, now + 0.09);

      subGain.gain.setValueAtTime(0.85 * vol, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);

      subOsc.connect(subGain);
      subGain.connect(ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.14);

      // 5. Willow Blade Internal Cavity Resonance
      const resonanceSize = Math.floor(ctx.sampleRate * 0.08);
      const resonanceBuffer = ctx.createBuffer(1, resonanceSize, ctx.sampleRate);
      const resData = resonanceBuffer.getChannelData(0);
      for (let i = 0; i < resonanceSize; i++) {
        resData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (resonanceSize * 0.25));
      }
      const resSource = ctx.createBufferSource();
      resSource.buffer = resonanceBuffer;
      const resFilter = ctx.createBiquadFilter();
      resFilter.type = 'bandpass';
      resFilter.frequency.setValueAtTime(640, now);
      resFilter.Q.setValueAtTime(5.5, now);

      const resGain = ctx.createGain();
      resGain.gain.setValueAtTime(0.7 * vol, now);
      resGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      resSource.connect(resFilter);
      resFilter.connect(resGain);
      resGain.connect(ctx.destination);
      resSource.start(now);
    } catch {
      // Audio fallback silent
    }
  }

  // Backwards-compatible alias
  playBatCrack() {
    this.playBatThwack();
  }

  // Enhanced Stadium Crowd Cheering Roar (Thousands of roaring fans)
  playCrowdCheer(duration = 3.5) {
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;
      const vol = this.isMuted ? 0 : this.volume;

      // Generate stadium crowd noise buffer (brownian + pink noise integration)
      const bufferSize = Math.floor(ctx.sampleRate * duration);
      const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
      const leftChannel = buffer.getChannelData(0);
      const rightChannel = buffer.getChannelData(1);

      let b0L = 0, b1L = 0, b2L = 0;
      let b0R = 0, b1R = 0, b2R = 0;

      for (let i = 0; i < bufferSize; i++) {
        const whiteL = Math.random() * 2 - 1;
        const whiteR = Math.random() * 2 - 1;

        // Pink noise filtering per channel
        b0L = 0.99886 * b0L + whiteL * 0.0555179;
        b1L = 0.99332 * b1L + whiteL * 0.0750759;
        b2L = 0.96900 * b2L + whiteL * 0.1538520;
        leftChannel[i] = (b0L + b1L + b2L + whiteL * 0.5362) * 0.45;

        b0R = 0.99886 * b0R + whiteR * 0.0555179;
        b1R = 0.99332 * b1R + whiteR * 0.0750759;
        b2R = 0.96900 * b2R + whiteR * 0.1538520;
        rightChannel[i] = (b0R + b1R + b2R + whiteR * 0.5362) * 0.45;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;

      // Vocal Formant 1: Deep vocal chest roar (around 650Hz - 900Hz)
      const chestFilter = ctx.createBiquadFilter();
      chestFilter.type = 'bandpass';
      chestFilter.frequency.setValueAtTime(600, now);
      chestFilter.frequency.linearRampToValueAtTime(850, now + 0.6);
      chestFilter.frequency.exponentialRampToValueAtTime(500, now + duration);
      chestFilter.Q.setValueAtTime(2.2, now);

      // Vocal Formant 2: Open throat crowd surge (around 1200Hz - 1800Hz)
      const throatFilter = ctx.createBiquadFilter();
      throatFilter.type = 'bandpass';
      throatFilter.frequency.setValueAtTime(1100, now);
      throatFilter.frequency.linearRampToValueAtTime(1650, now + 0.7);
      throatFilter.frequency.exponentialRampToValueAtTime(900, now + duration);
      throatFilter.Q.setValueAtTime(2.8, now);

      // Crowd excitement envelope
      const masterCrowdGain = ctx.createGain();
      masterCrowdGain.gain.setValueAtTime(0.01, now);
      // Fast explosive swell upon boundary / milestone
      masterCrowdGain.gain.linearRampToValueAtTime(0.75 * vol, now + 0.4);
      // Turbulent sustained energy
      masterCrowdGain.gain.setValueAtTime(0.7 * vol, now + 1.2);
      masterCrowdGain.gain.linearRampToValueAtTime(0.5 * vol, now + 2.0);
      // Gentle stadium decay
      masterCrowdGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noiseSource.connect(chestFilter);
      chestFilter.connect(masterCrowdGain);

      noiseSource.connect(throatFilter);
      throatFilter.connect(masterCrowdGain);

      masterCrowdGain.connect(ctx.destination);
      noiseSource.start(now);
      noiseSource.stop(now + duration + 0.05);

      // Occasional celebratory whistling / pitch chirps in stadium
      [0.2, 0.6, 1.1].forEach((delay) => {
        const whistleOsc = ctx.createOscillator();
        const whistleGain = ctx.createGain();
        whistleOsc.type = 'sine';
        const startFreq = 1800 + Math.random() * 400;
        whistleOsc.frequency.setValueAtTime(startFreq, now + delay);
        whistleOsc.frequency.linearRampToValueAtTime(startFreq + 300, now + delay + 0.2);
        whistleOsc.frequency.linearRampToValueAtTime(startFreq - 100, now + delay + 0.45);

        whistleGain.gain.setValueAtTime(0.001, now + delay);
        whistleGain.gain.linearRampToValueAtTime(0.08 * vol, now + delay + 0.08);
        whistleGain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.48);

        whistleOsc.connect(whistleGain);
        whistleGain.connect(ctx.destination);
        whistleOsc.start(now + delay);
        whistleOsc.stop(now + delay + 0.5);
      });
    } catch {
      // Audio silent
    }
  }

  // Celebration sparkle chime
  playCelebrationChime() {
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.25 * this.volume, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.85);
      });
    } catch {
      // Audio silent
    }
  }

  // Melodic Happy Birthday Anthem synthesizer with warm stadium harmony
  startAmbientMusic() {
    if (this.isAmbientPlaying) return;
    try {
      const ctx = this.initCtx();
      this.isAmbientPlaying = true;

      this.ambientGain = ctx.createGain();
      this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume * 0.4, ctx.currentTime);
      this.ambientGain.connect(ctx.destination);

      // Complete note-for-note Happy Birthday melody in key of C major
      const melodyNotes = [
        // Phrase 1: "Happy Birthday to you"
        { t: 0.0, f: 392.00, d: 0.42 },   // G4 (Hap-)
        { t: 0.44, f: 392.00, d: 0.16 },  // G4 (-py)
        { t: 0.62, f: 440.00, d: 0.55 },  // A4 (Birth-)
        { t: 1.20, f: 392.00, d: 0.55 },  // G4 (-day)
        { t: 1.78, f: 523.25, d: 0.55 },  // C5 (to)
        { t: 2.36, f: 493.88, d: 1.15 },  // B4 (you)

        // Phrase 2: "Happy Birthday to you"
        { t: 3.60, f: 392.00, d: 0.42 },  // G4 (Hap-)
        { t: 4.04, f: 392.00, d: 0.16 },  // G4 (-py)
        { t: 4.22, f: 440.00, d: 0.55 },  // A4 (Birth-)
        { t: 4.80, f: 392.00, d: 0.55 },  // G4 (-day)
        { t: 5.38, f: 587.33, d: 0.55 },  // D5 (to)
        { t: 5.96, f: 523.25, d: 1.15 },  // C5 (you)

        // Phrase 3: "Happy Birthday dear Ullas"
        { t: 7.20, f: 392.00, d: 0.42 },  // G4 (Hap-)
        { t: 7.64, f: 392.00, d: 0.16 },  // G4 (-py)
        { t: 7.82, f: 783.99, d: 0.55 },  // G5 (Birth-)
        { t: 8.40, f: 659.25, d: 0.55 },  // E5 (-day)
        { t: 8.98, f: 523.25, d: 0.55 },  // C5 (dear)
        { t: 9.56, f: 493.88, d: 0.55 },  // B4 (Ul-)
        { t: 10.14, f: 440.00, d: 1.15 }, // A4 (-las)

        // Phrase 4: "Happy Birthday to you!"
        { t: 11.40, f: 698.46, d: 0.42 }, // F5 (Hap-)
        { t: 11.84, f: 698.46, d: 0.16 }, // F5 (-py)
        { t: 12.02, f: 659.25, d: 0.55 }, // E5 (Birth-)
        { t: 12.60, f: 523.25, d: 0.55 }, // C5 (-day)
        { t: 13.18, f: 587.33, d: 0.55 }, // D5 (to)
        { t: 13.76, f: 523.25, d: 1.60 }, // C5 (you!)

        // Celebration flourish arpeggio chimes
        { t: 15.50, f: 523.25, d: 0.22 }, // C5
        { t: 15.74, f: 659.25, d: 0.22 }, // E5
        { t: 15.98, f: 783.99, d: 0.22 }, // G5
        { t: 16.22, f: 1046.50, d: 0.85 }, // C6!
      ];

      // Polyphonic warm stadium backing chords
      const backingChords = [
        { t: 0.60, freqs: [130.81, 196.00, 261.63, 329.63], d: 1.7 }, // C major
        { t: 2.36, freqs: [98.00, 146.83, 196.00, 246.94], d: 1.2 },   // G major
        { t: 4.22, freqs: [98.00, 146.83, 196.00, 246.94], d: 1.7 },   // G major
        { t: 5.96, freqs: [130.81, 196.00, 261.63, 329.63], d: 1.2 }, // C major
        { t: 7.82, freqs: [130.81, 196.00, 261.63, 329.63], d: 1.7 }, // C major
        { t: 9.56, freqs: [87.31, 130.81, 174.61, 220.00], d: 1.7 },  // F major
        { t: 12.02, freqs: [130.81, 196.00, 261.63, 329.63], d: 1.1 }, // C major
        { t: 13.18, freqs: [98.00, 146.83, 174.61, 246.94], d: 0.6 },  // G7
        { t: 13.76, freqs: [130.81, 196.00, 261.63, 329.63, 523.25], d: 2.2 }, // C triumphant
      ];

      const songCycleDuration = 17.5; // in seconds

      const scheduleSongCycle = () => {
        if (!this.isAmbientPlaying || !this.ctx || !this.ambientGain) return;
        const now = this.ctx.currentTime;

        // Schedule melody lead notes
        melodyNotes.forEach((n) => {
          const startTime = now + n.t;
          const stopTime = startTime + n.d;

          // Main musical bell oscillator
          const oscLead = this.ctx!.createOscillator();
          const gainLead = this.ctx!.createGain();
          const filter = this.ctx!.createBiquadFilter();

          oscLead.type = 'triangle';
          oscLead.frequency.setValueAtTime(n.f, startTime);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(2400, startTime);

          // Bell chime envelope
          gainLead.gain.setValueAtTime(0.0001, startTime);
          gainLead.gain.linearRampToValueAtTime(0.32, startTime + 0.035);
          gainLead.gain.exponentialRampToValueAtTime(0.001, stopTime);

          oscLead.connect(filter);
          filter.connect(gainLead);
          gainLead.connect(this.ambientGain!);

          oscLead.start(startTime);
          oscLead.stop(stopTime + 0.05);
          this.ambientOscillators.push(oscLead);

          // Soft bell overtone harmonic (pure sine 1 octave higher for shimmer)
          if (n.d >= 0.4) {
            const oscOvertone = this.ctx!.createOscillator();
            const gainOvertone = this.ctx!.createGain();
            oscOvertone.type = 'sine';
            oscOvertone.frequency.setValueAtTime(n.f * 2, startTime);

            gainOvertone.gain.setValueAtTime(0.0001, startTime);
            gainOvertone.gain.linearRampToValueAtTime(0.08, startTime + 0.02);
            gainOvertone.gain.exponentialRampToValueAtTime(0.0001, startTime + n.d * 0.7);

            oscOvertone.connect(gainOvertone);
            gainOvertone.connect(this.ambientGain!);
            oscOvertone.start(startTime);
            oscOvertone.stop(startTime + n.d * 0.75);
            this.ambientOscillators.push(oscOvertone);
          }
        });

        // Schedule backing chords
        backingChords.forEach((chord) => {
          const startTime = now + chord.t;
          const stopTime = startTime + chord.d;

          chord.freqs.forEach((freq, idx) => {
            const oscChord = this.ctx!.createOscillator();
            const gainChord = this.ctx!.createGain();

            oscChord.type = idx === 0 ? 'sine' : 'triangle';
            oscChord.frequency.setValueAtTime(freq, startTime);

            // Smooth lush pad envelope
            gainChord.gain.setValueAtTime(0.0001, startTime);
            gainChord.gain.linearRampToValueAtTime(0.06, startTime + 0.18);
            gainChord.gain.linearRampToValueAtTime(0.04, stopTime - 0.1);
            gainChord.gain.exponentialRampToValueAtTime(0.0001, stopTime + 0.15);

            oscChord.connect(gainChord);
            gainChord.connect(this.ambientGain!);

            oscChord.start(startTime);
            oscChord.stop(stopTime + 0.2);
            this.ambientOscillators.push(oscChord);
          });
        });
      };

      scheduleSongCycle();
      this.ambientInterval = window.setInterval(scheduleSongCycle, songCycleDuration * 1000);
    } catch {
      this.isAmbientPlaying = false;
    }
  }

  stopAmbientMusic() {
    this.isAmbientPlaying = false;
    if (this.ambientInterval) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
    if (this.ambientGain && this.ctx) {
      try {
        this.ambientGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);
      } catch {
        // Safe exit
      }
    }
    // Clean up stored oscillators
    this.ambientOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // Already stopped
      }
    });
    this.ambientOscillators = [];
  }

  setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume * 0.4, this.ctx.currentTime);
    }
  }

  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume * 0.4, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  getIsPlaying() {
    return this.isAmbientPlaying;
  }

  getVolume() {
    return this.volume;
  }

  getIsMuted() {
    return this.isMuted;
  }
}

export const soundEngine = new SoundEngine();

// Speech Synthesis Helper with Generic Warm Male Voice
export class BirthdayTTS {
  private isSpeaking = false;
  private isPaused = false;
  private isMuted = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private onLineChangeCallback?: (lineIndex: number) => void;
  private onEndCallback?: () => void;

  constructor(
    onLineChange?: (lineIndex: number) => void,
    onEnd?: () => void
  ) {
    this.onLineChangeCallback = onLineChange;
    this.onEndCallback = onEnd;
  }

  isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  speakLines(lines: string[], startIndex = 0) {
    if (!this.isSupported()) {
      if (this.onEndCallback) this.onEndCallback();
      return;
    }

    window.speechSynthesis.cancel();
    this.isSpeaking = true;
    this.isPaused = false;

    let currentIndex = startIndex;

    const speakNext = () => {
      if (currentIndex >= lines.length) {
        this.isSpeaking = false;
        if (this.onEndCallback) this.onEndCallback();
        return;
      }

      if (this.onLineChangeCallback) {
        this.onLineChangeCallback(currentIndex);
      }

      const text = lines[currentIndex];
      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;

      // Select warm male voice if available
      const voices = window.speechSynthesis.getVoices();
      const maleVoice = voices.find(v => 
        (v.name.toLowerCase().includes('male') || 
         v.name.toLowerCase().includes('david') || 
         v.name.toLowerCase().includes('george') || 
         v.name.toLowerCase().includes('guy') || 
         v.name.toLowerCase().includes('ravi') || 
         v.name.toLowerCase().includes('natural')) &&
        v.lang.startsWith('en')
      ) || voices.find(v => v.lang.startsWith('en'));

      if (maleVoice) {
        utterance.voice = maleVoice;
      }

      utterance.rate = 0.92; // Deliberate, warm, steady pacing
      utterance.pitch = 0.95; // Slightly lower, warm pitch
      utterance.volume = this.isMuted ? 0 : 0.9;

      utterance.onend = () => {
        currentIndex++;
        // Small pause between thoughts
        setTimeout(() => {
          if (this.isSpeaking && !this.isPaused) {
            speakNext();
          }
        }, 500);
      };

      utterance.onerror = () => {
        currentIndex++;
        if (this.isSpeaking && !this.isPaused) {
          speakNext();
        }
      };

      window.speechSynthesis.speak(utterance);
    };

    speakNext();
  }

  pause() {
    if (this.isSupported() && this.isSpeaking) {
      window.speechSynthesis.pause();
      this.isPaused = true;
    }
  }

  resume() {
    if (this.isSupported() && this.isPaused) {
      window.speechSynthesis.resume();
      this.isPaused = false;
    }
  }

  stop() {
    if (this.isSupported()) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
      this.isPaused = false;
    }
  }

  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.currentUtterance) {
      this.currentUtterance.volume = this.isMuted ? 0 : 0.9;
    }
    return this.isMuted;
  }

  getStatus() {
    return {
      isSpeaking: this.isSpeaking,
      isPaused: this.isPaused,
      isMuted: this.isMuted,
    };
  }
}
