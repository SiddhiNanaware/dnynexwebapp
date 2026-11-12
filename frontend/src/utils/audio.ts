/**
 * DNYANEX Smart Audio System
 * Uses Web Audio API for harmonic notification chime / buzzer and DnyanPakshi audio.
 * Requires 0 external downloads and functions 100% offline.
 */

class AudioController {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;
  public volume: number = 0.6; // 0.0 to 1.0

  private getContext(): AudioContext | null {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Pleasant, dual-tone notification buzzer / chime for Smart Alerts
   */
  public playNotificationBuzzer(isUrgent: boolean = false) {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = isUrgent ? 'triangle' : 'sine';
      const baseFreq = isUrgent ? 880 : 587.33; // A5 or D5
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.12);

      const targetGain = Math.max(0.01, Math.min(1.0, this.volume * 0.15));
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(targetGain, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);

      // Second harmonic chime note
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      const start2 = now + 0.1;

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(baseFreq * 1.25, start2);
      osc2.frequency.exponentialRampToValueAtTime(baseFreq * 2, start2 + 0.15);

      gain2.gain.setValueAtTime(0.001, start2);
      gain2.gain.linearRampToValueAtTime(targetGain * 0.8, start2 + 0.04);
      gain2.gain.exponentialRampToValueAtTime(0.001, start2 + 0.35);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc2.start(start2);
      osc2.stop(start2 + 0.38);
    } catch (e) {
      console.debug("Audio buzzer error:", e);
    }
  }

  /**
   * Cheerful, soft melodic chirp for DnyanPakshi mascot
   */
  public playMascotChirp() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1600, now);
      osc.frequency.exponentialRampToValueAtTime(2400, now + 0.07);
      osc.frequency.exponentialRampToValueAtTime(2000, now + 0.12);

      const targetGain = Math.max(0.01, Math.min(1.0, this.volume * 0.12));
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(targetGain, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.14);
    } catch (e) {
      console.debug("Mascot chirp error:", e);
    }
  }

  public playChirp() {
    this.playMascotChirp();
  }

  /**
   * Text-to-speech engine
   */
  public speakText(text: string, lang: string = 'en') {
    if (this.isMuted || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.volume = this.volume;
      utterance.pitch = 1.1;

      if (lang === 'mr') {
        utterance.lang = 'mr-IN';
      } else if (lang === 'hi') {
        utterance.lang = 'hi-IN';
      } else {
        utterance.lang = 'en-US';
      }
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.debug("Speech error:", e);
    }
  }
}

export const soundManager = new AudioController();

export const playDnyanPakshiChirp = (isMuted?: boolean) => {
  if (!isMuted) {
    soundManager.playMascotChirp();
  }
};

