class AudioSynthService {
  private ctx: AudioContext | null = null;
  private activeBuzzers: Map<string, { osc: OscillatorNode; gain: GainNode }> = new Map();
  private isMuted: boolean = false;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopAllBuzzers();
    }
  }

  public playToggleSound(stateOn: boolean) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(stateOn ? 600 : 400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(stateOn ? 800 : 300, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // AudioContext policy catch
    }
  }

  public playConnectSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, this.ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, this.ctx.currentTime + 0.04); // E5

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch {
      // Ignore
    }
  }

  public setBuzzerState(nodeId: string, active: boolean) {
    if (this.isMuted) {
      this.stopBuzzer(nodeId);
      return;
    }

    if (active) {
      if (this.activeBuzzers.has(nodeId)) return; // Already buzzing
      this.initCtx();
      if (!this.ctx) return;

      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, this.ctx.currentTime); // A4 note

        gain.gain.setValueAtTime(0.04, this.ctx.currentTime);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        this.activeBuzzers.set(nodeId, { osc, gain });
      } catch {
        // Ignore
      }
    } else {
      this.stopBuzzer(nodeId);
    }
  }

  private stopBuzzer(nodeId: string) {
    const entry = this.activeBuzzers.get(nodeId);
    if (entry && this.ctx) {
      try {
        entry.gain.gain.setValueAtTime(entry.gain.gain.value, this.ctx.currentTime);
        entry.gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.02);
        setTimeout(() => {
          entry.osc.stop();
          entry.osc.disconnect();
        }, 20);
      } catch {
        // Ignore
      }
      this.activeBuzzers.delete(nodeId);
    }
  }

  public stopAllBuzzers() {
    this.activeBuzzers.forEach((_, id) => this.stopBuzzer(id));
  }
}

export const soundFx = new AudioSynthService();
