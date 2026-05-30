import Phaser from 'phaser';
import { WIDTH, HEIGHT } from './constants.js';
import { BootScene } from './scenes/BootScene.js';
import { TitleScene } from './scenes/TitleScene.js';
import { WorldMapScene } from './scenes/WorldMapScene.js';
import { CutsceneScene } from './scenes/cutscenes/CutsceneScene.js';

const config = {
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
  backgroundColor: '#0d0d1a',
  scene: [BootScene, TitleScene, WorldMapScene, CutsceneScene],
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 600 }, debug: false },
  },
};

new Phaser.Game(config);
