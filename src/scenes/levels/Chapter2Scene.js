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
