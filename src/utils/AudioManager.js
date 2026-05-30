const AUDIO_FILES = {
  'music-title':       'assets/audio/title.mp3',
  'music-level':       'assets/audio/level.mp3',
  'music-cutscene':    'assets/audio/cutscene.mp3',
  'music-cliffhanger': 'assets/audio/cliffhanger.mp3',
  'sfx-jump':          'assets/audio/sfx-jump.mp3',
  'sfx-collect':       'assets/audio/sfx-collect.mp3',
  'sfx-complete':      'assets/audio/sfx-complete.mp3',
};

export class AudioManager {
  constructor(scene) {
    this._scene = scene;
    this._loading = new Set();
    this._queue   = new Map(); // key → config waiting for buffer
    this._prewarmSFX();
  }

  playMusic(key) {
    this._scene.sound.stopAll();
    this._play(key, { loop: true, volume: 0.4 });
  }

  sfx(key) {
    this._play(key, { volume: 0.6 });
  }

  // ── internal ──────────────────────────────────────────────

  _play(key, config) {
    if (this._scene.cache.audio.has(key)) {
      try { this._scene.sound.play(key, config); } catch (_) {}
    } else if (!this._loading.has(key)) {
      this._loading.add(key);
      this._queue.set(key, config);
      this._loadOrSynth(key);
    }
  }

  // Pre-synth SFX synchronously so they're ready on first use.
  _prewarmSFX() {
    const ctx = this._scene.sound.context;
    if (!ctx) return;
    for (const key of ['sfx-jump', 'sfx-collect', 'sfx-complete']) {
      if (!this._scene.cache.audio.has(key)) {
        const buf = this._synth(ctx, key);
        if (buf) this._scene.cache.audio.add(key, buf);
      }
    }
  }

  async _loadOrSynth(key) {
    const ctx = this._scene.sound.context;
    if (!ctx) return;
    let buffer = null;
    if (AUDIO_FILES[key]) {
      try {
        const r = await fetch(AUDIO_FILES[key]);
        if (r.ok) buffer = await ctx.decodeAudioData(await r.arrayBuffer()).catch(() => null);
      } catch (_) {}
    }
    if (!buffer) buffer = this._synth(ctx, key);
    if (!buffer) { this._loading.delete(key); return; }
    try {
      this._scene.cache.audio.add(key, buffer);
      const config = this._queue.get(key);
      if (config) { this._scene.sound.play(key, config); this._queue.delete(key); }
    } catch (_) {}
    this._loading.delete(key);
  }

  // ── synthesis ─────────────────────────────────────────────

  _synth(ctx, key) {
    if (key === 'sfx-jump')     return this._sweep(ctx, 280, 560, 0.12, 0.28);
    if (key === 'sfx-collect')  return this._harmonic(ctx, 880, [1, 1.5, 2], 0.18, 0.20);
    if (key === 'sfx-complete') return this._arpeggio(ctx, [523.3, 659.3, 784.0, 1046.5], 0.10, 0.22);

    const MUSIC = {
      'music-level':       { bpm: 140, notes: [[659.3,.5],[784,.5],[880,.5],[784,.5],[659.3,.5],[523.3,.5],[587.3,.5],[659.3,1]] },
      'music-title':       { bpm: 120, notes: [[523.3,.5],[659.3,.5],[784,.5],[1046.5,.5],[784,.5],[659.3,.5],[698.5,.5],[659.3,1]] },
      'music-cutscene':    { bpm:  90, notes: [[440,.75],[523.3,.75],[659.3,.75],[784,.5],[698.5,.5],[659.3,.75],[587.3,.75],[523.3,1.5]] },
      'music-cliffhanger': { bpm:  72, notes: [[220,1],[220,.5],[196,.5],[220,1],[261.6,1],[246.9,.5],[220,1.5]] },
    };
    const def = MUSIC[key];
    return def ? this._melody(ctx, def.notes, def.bpm) : null;
  }

  // Pitch sweep (jump)
  _sweep(ctx, f0, f1, dur, amp) {
    const sr = ctx.sampleRate;
    const buf = ctx.createBuffer(1, Math.floor(sr * dur), sr);
    const d = buf.getChannelData(0);
    let ph = 0;
    for (let i = 0; i < d.length; i++) {
      const t = i / sr;
      ph += (2 * Math.PI * (f0 + (f1 - f0) * (t / dur))) / sr;
      d[i] = Math.sin(ph) * Math.pow(1 - t / dur, 2) * amp;
    }
    return buf;
  }

  // Bell-like tone with harmonics (collect)
  _harmonic(ctx, base, ratios, dur, amp) {
    const sr = ctx.sampleRate;
    const buf = ctx.createBuffer(1, Math.floor(sr * dur), sr);
    const d = buf.getChannelData(0);
    const ph = ratios.map(() => 0);
    for (let i = 0; i < d.length; i++) {
      const t = i / sr;
      const env = Math.pow(1 - t / dur, 1.8);
      let v = 0;
      ratios.forEach((r, j) => { ph[j] += (2 * Math.PI * base * r) / sr; v += Math.sin(ph[j]); });
      d[i] = (v / ratios.length) * env * amp;
    }
    return buf;
  }

  // Rising chord arpeggio (complete)
  _arpeggio(ctx, freqs, noteDur, amp) {
    const sr = ctx.sampleRate;
    const ns = Math.floor(sr * noteDur);
    const buf = ctx.createBuffer(1, ns * freqs.length, sr);
    const d = buf.getChannelData(0);
    freqs.forEach((freq, i) => {
      let ph = 0;
      for (let s = 0; s < ns; s++) {
        const t = s / sr;
        ph += (2 * Math.PI * freq) / sr;
        d[i * ns + s] = Math.sin(ph) * Math.pow(1 - t / noteDur, 1.2) * amp;
      }
    });
    return buf;
  }

  // Simple melody with octave bass (music tracks)
  _melody(ctx, notes, bpm) {
    const sr  = ctx.sampleRate;
    const bd  = 60 / bpm;
    const len = Math.floor(notes.reduce((s, [, b]) => s + b * bd, 0) * sr) + sr;
    const buf = ctx.createBuffer(1, len, sr);
    const d   = buf.getChannelData(0);
    let pos = 0;
    notes.forEach(([freq, beats]) => {
      const ns  = Math.floor(beats * bd * sr);
      const sus = Math.floor(ns * 0.82);
      let mel = 0, bass = 0;
      for (let s = 0; s < sus; s++) {
        const t = s / sr;
        const env = Math.min(1, t * 80) * Math.min(1, (beats * bd - t) * 18);
        mel  += (2 * Math.PI * freq)       / sr;
        bass += (2 * Math.PI * freq * 0.5) / sr;
        d[pos + s] = (Math.sin(mel) * 0.16 + Math.sin(bass) * 0.08) * env;
      }
      pos += ns;
    });
    return buf;
  }
}
