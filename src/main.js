import Phaser from 'phaser';
import { WIDTH, HEIGHT } from './constants.js';
import { BootScene } from './scenes/BootScene.js';
import { TitleScene } from './scenes/TitleScene.js';
import { WorldMapScene } from './scenes/WorldMapScene.js';
import { CutsceneScene } from './scenes/cutscenes/CutsceneScene.js';
import { Chapter2Scene } from './scenes/levels/Chapter2Scene.js';
import { Chapter3Scene } from './scenes/levels/Chapter3Scene.js';
import { Chapter5Scene } from './scenes/levels/Chapter5Scene.js';
import { Chapter6Scene } from './scenes/levels/Chapter6Scene.js';
import { Chapter8Scene } from './scenes/levels/Chapter8Scene.js';

const config = {
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
  backgroundColor: '#0d0d1a',
  scene: [
    BootScene, TitleScene, WorldMapScene, CutsceneScene,
    Chapter2Scene, Chapter3Scene, Chapter5Scene, Chapter6Scene, Chapter8Scene,
  ],
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 600 }, debug: false },
  },
};

new Phaser.Game(config);
