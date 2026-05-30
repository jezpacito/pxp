import { BaseLevel } from './BaseLevel.js';
import { WIDTH, HEIGHT } from '../../constants.js';
import { drawCharacter } from '../../characters/drawCharacter.js';

export class Chapter6Scene extends BaseLevel {
  constructor() { super({ key: 'Chapter6' }); }

  create() {
    this._collectibleCount = 7;
    this._levelWidth = WIDTH * 5;
    super.create();
    this.cameras.main.setBackgroundColor('#2d1b4e');

    const title = this.add.text(WIDTH / 2, 40, '🏠  Chapter 6: Manila, Finally', {
      fontFamily: 'Georgia, serif', fontSize: '20px', color: '#e9d5ff',
      stroke: '#000', strokeThickness: 2,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(10);
    this.time.delayedCall(3000, () => {
      this.tweens.add({ targets: title, alpha: 0, duration: 500 });
    });
  }

  _buildLevel() {
    this._addPlatform(200,  HEIGHT - 150, 130);
    this._addPlatform(450,  HEIGHT - 200, 100);
    this._addPlatform(680,  HEIGHT - 250, 130);
    this._addPlatform(950,  HEIGHT - 180, 100);
    this._addPlatform(1200, HEIGHT - 240, 120);
    this._addPlatform(1450, HEIGHT - 300, 100);
    this._addPlatform(1700, HEIGHT - 220, 130);
    this._addPlatform(1950, HEIGHT - 280, 100);
    this._addPlatform(2200, HEIGHT - 180, 130);
    this._addPlatform(2500, HEIGHT - 240, 100);
    this._addPlatform(2750, HEIGHT - 300, 130);
    this._addPlatform(3000, HEIGHT - 220, 100);
    this._addPlatform(3250, HEIGHT - 260, 130);

    this._addCollectible(300,  HEIGHT - 200, '🔑');
    this._addCollectible(550,  HEIGHT - 250, '🍜');
    this._addCollectible(780,  HEIGHT - 300, '🔑');
    this._addCollectible(1050, HEIGHT - 230, '📸');
    this._addCollectible(1550, HEIGHT - 350, '🍜');
    this._addCollectible(2050, HEIGHT - 330, '📸');
    this._addCollectible(2850, HEIGHT - 350, '🔑');

    this._maeGfx = this.add.graphics();

    this.add.text(this._goalX, HEIGHT - 80, '🏠', { fontSize: '40px' }).setOrigin(0.5);
    this.add.text(this._goalX, HEIGHT - 125, 'HOME', {
      fontFamily: 'monospace', fontSize: '12px', color: '#e9d5ff',
      backgroundColor: '#7E22CE', padding: { x: 8, y: 4 },
    }).setOrigin(0.5);
  }

  update() {
    super.update();
    if (this._maeGfx) {
      this._maeGfx.clear();
      drawCharacter(this._maeGfx, 'mae', this._player.x - 70, this._player.y, 0.85);
    }
  }
}
