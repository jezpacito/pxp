import Phaser from 'phaser';
import { WIDTH, HEIGHT } from './constants.js';

const config = {
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
  backgroundColor: '#0d0d1a',
  scene: [],
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 600 }, debug: false },
  },
};

new Phaser.Game(config);
