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
  }

  playMusic(key) {
    this._scene.sound.stopAll();
    this._playIfLoaded(key, { loop: true, volume: 0.4 });
  }

  sfx(key) {
    this._playIfLoaded(key, { volume: 0.6 });
  }

  _playIfLoaded(key, config) {
    if (this._scene.cache.audio.has(key)) {
      this._scene.sound.play(key, config);
    }
    // If not loaded yet, try loading it now (only fires once per key)
    else if (AUDIO_FILES[key] && !this._scene.load.isLoading()) {
      this._scene.load.audio(key, AUDIO_FILES[key]);
      this._scene.load.once(`filecomplete-audio-${key}`, () => {
        this._scene.sound.play(key, config);
      });
      this._scene.load.once('loaderror', () => { /* file missing — stay silent */ });
      this._scene.load.start();
    }
  }
}
