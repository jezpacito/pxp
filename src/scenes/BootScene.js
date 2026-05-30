import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() { super({ key: 'Boot' }); }

  preload() {
    // Audio is optional — add MP3s to assets/audio/ to enable (see README there)
    // We probe each file with a HEAD request before asking Phaser to decode it,
    // so missing files never reach the audio decoder and cause EncodingErrors.
    const audioFiles = [
      ['music-title',       'assets/audio/title.mp3'],
      ['music-level',       'assets/audio/level.mp3'],
      ['music-cutscene',    'assets/audio/cutscene.mp3'],
      ['music-cliffhanger', 'assets/audio/cliffhanger.mp3'],
      ['sfx-jump',          'assets/audio/jump.mp3'],
      ['sfx-collect',       'assets/audio/collect.mp3'],
      ['sfx-complete',      'assets/audio/complete.mp3'],
    ];

    audioFiles.forEach(([key, path]) => {
      const xhr = new XMLHttpRequest();
      xhr.open('HEAD', path, false); // synchronous probe
      try {
        xhr.send();
        if (xhr.status === 200) this.load.audio(key, path);
      } catch (_) { /* file not found — skip silently */ }
    });
  }

  create() {
    this.scene.start('Title');
  }
}
