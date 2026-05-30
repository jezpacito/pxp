import { BaseLevel } from './BaseLevel.js';
import { WIDTH, HEIGHT } from '../../constants.js';
import { drawCharacter } from '../../characters/drawCharacter.js';

export class Chapter2Scene extends BaseLevel {
  constructor() { super({ key: 'Chapter2' }); }

  create() {
    this._collectibleCount = 5;
    this._levelWidth = WIDTH * 4;
    super.create();
    this.cameras.main.setBackgroundColor('#c9e8f5');

    const title = this.add.text(WIDTH / 2, 40, '✈️  Chapter 2: First Flight', {
      fontFamily: 'Georgia, serif', fontSize: '20px', color: '#1a1a3e',
      stroke: '#fff', strokeThickness: 2,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(10);
    this.time.delayedCall(3000, () => {
      this.tweens.add({ targets: title, alpha: 0, duration: 500 });
    });
  }

  _buildBackground() {
    const rand = n => Math.abs(Math.sin(n * 127.1 + 311.7) * 43758.5453 % 1);
    const cloud = (gfx, x, y, s) => {
      gfx.fillCircle(x,       y,       20*s);
      gfx.fillCircle(x+18*s,  y-8*s,   16*s);
      gfx.fillCircle(x-18*s,  y-5*s,   14*s);
      gfx.fillCircle(x+28*s,  y+4*s,   13*s);
      gfx.fillCircle(x-26*s,  y+4*s,   11*s);
      gfx.fillCircle(x+8*s,   y-16*s,  10*s);
    };

    // Far slow clouds
    const sf1 = 0.12;
    const w1 = Math.ceil(WIDTH + (this._levelWidth - WIDTH) * sf1) + 200;
    const gc1 = this.add.graphics().setScrollFactor(sf1, 1).setDepth(-4);
    gc1.fillStyle(0xffffff, 0.55);
    for (let i = 0, x = 50; x < w1; i++, x += 130 + rand(i*3+1)*90) {
      cloud(gc1, x, 28 + rand(i*7+2)*28, 0.80 + rand(i*11+3)*0.35);
    }

    // Near faster clouds
    const sf2 = 0.27;
    const w2 = Math.ceil(WIDTH + (this._levelWidth - WIDTH) * sf2) + 200;
    const gc2 = this.add.graphics().setScrollFactor(sf2, 1).setDepth(-3);
    gc2.fillStyle(0xffffff, 0.78);
    for (let i = 0, x = 90; x < w2; i++, x += 160 + rand(i*5+13)*100) {
      cloud(gc2, x, 56 + rand(i*9+5)*22, 0.75 + rand(i*13+7)*0.30);
    }
  }

  _buildLevel() {
    this._addPlatform(300, HEIGHT - 160, 140);
    this._addPlatform(600, HEIGHT - 220, 120);
    this._addPlatform(900, HEIGHT - 160, 140);
    this._addPlatform(1200, HEIGHT - 240, 100);
    this._addPlatform(1500, HEIGHT - 180, 130);
    this._addPlatform(1800, HEIGHT - 140, 150);
    this._addPlatform(2200, HEIGHT - 200, 120);
    this._addPlatform(2500, HEIGHT - 160, 140);
    this._addPlatform(2800, HEIGHT - 220, 100);

    this._addCollectible(400, HEIGHT - 200, '🎫');
    this._addCollectible(700, HEIGHT - 270, '💕');
    this._addCollectible(1000, HEIGHT - 200, '🎫');
    this._addCollectible(1600, HEIGHT - 230, '💕');
    this._addCollectible(2300, HEIGHT - 250, '🎫');

    const maeGfx = this.add.graphics();
    drawCharacter(maeGfx, 'mae', this._goalX, HEIGHT - 64, 1);

    this.add.text(this._goalX, HEIGHT - 145, '💜 WELCOME JEZ! 💜', {
      fontFamily: 'monospace', fontSize: '12px', color: '#ffffff',
      backgroundColor: '#7E22CE', padding: { x: 8, y: 4 },
    }).setOrigin(0.5);
  }
}
