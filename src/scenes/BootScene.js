import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() { super({ key: 'Boot' }); }

  preload() {
    const audioFiles = [
      ['music-title', 'assets/audio/title.mp3'],
      ['music-level', 'assets/audio/level.mp3'],
      ['music-cutscene', 'assets/audio/cutscene.mp3'],
      ['music-cliffhanger', 'assets/audio/cliffhanger.mp3'],
      ['sfx-jump', 'assets/audio/jump.mp3'],
      ['sfx-collect', 'assets/audio/collect.mp3'],
      ['sfx-complete', 'assets/audio/complete.mp3'],
    ];
    audioFiles.forEach(([key, path]) => this.load.audio(key, path));
    this.load.on('loaderror', (file) => {
      console.warn(`Asset not found: ${file.key} — continuing without it`);
    });
  }

  create() {
    this.scene.start('Title');
  }
}
