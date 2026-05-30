export class AudioManager {
  constructor(scene) {
    this._scene = scene;
  }
  playMusic(key) {
    this._scene.sound.stopAll();
    if (this._scene.sound.get(key) || this._scene.cache.audio.has(key)) {
      this._scene.sound.play(key, { loop: true, volume: 0.4 });
    }
  }
  sfx(key) {
    if (this._scene.cache.audio.has(key)) {
      this._scene.sound.play(key, { volume: 0.6 });
    }
  }
}
