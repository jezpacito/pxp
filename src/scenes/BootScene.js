import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() { super({ key: 'Boot' }); }

  preload() {
    // Audio files are loaded dynamically at runtime — see AudioManager.loadIfPresent()
    // Drop MP3s into assets/audio/ (title, level, cutscene, cliffhanger,
    // sfx-jump, sfx-collect, sfx-complete) and they'll be picked up automatically.
  }

  create() {
    this.scene.start('Title');
  }
}
