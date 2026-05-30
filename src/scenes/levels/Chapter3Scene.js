import { BaseLevel } from './BaseLevel.js';
import { WIDTH, HEIGHT } from '../../constants.js';
import { drawCharacter } from '../../characters/drawCharacter.js';

export class Chapter3Scene extends BaseLevel {
  constructor() { super({ key: 'Chapter3' }); }

  create() {
    this._collectibleCount = 6;
    this._levelWidth = WIDTH * 3.5;
    super.create();
    this.cameras.main.setBackgroundColor('#c8e6c9');

    const title = this.add.text(WIDTH / 2, 40, '🌲  Chapter 3: The Baguio Quest', {
      fontFamily: 'Georgia, serif', fontSize: '20px', color: '#1a3a1a',
      stroke: '#fff', strokeThickness: 2,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(10);
    this.time.delayedCall(3000, () => {
      this.tweens.add({ targets: title, alpha: 0, duration: 500 });
    });
  }

  _buildLevel() {
    this._addPlatform(200,  HEIGHT - 140, 120);
    this._addPlatform(400,  HEIGHT - 190, 100);
    this._addPlatform(620,  HEIGHT - 240, 130);
    this._addPlatform(820,  HEIGHT - 200, 100);
    this._addPlatform(1050, HEIGHT - 260, 110);
    this._addPlatform(1300, HEIGHT - 220, 120);
    this._addPlatform(1550, HEIGHT - 280, 100);
    this._addPlatform(1800, HEIGHT - 240, 130);
    this._addPlatform(2050, HEIGHT - 300, 110);
    this._addPlatform(2300, HEIGHT - 260, 120);

    this._addCollectible(300,  HEIGHT - 190, '🍓');
    this._addCollectible(520,  HEIGHT - 240, '🌸');
    this._addCollectible(720,  HEIGHT - 250, '🍓');
    this._addCollectible(1150, HEIGHT - 310, '🌸');
    this._addCollectible(1650, HEIGHT - 330, '🍓');
    this._addCollectible(2150, HEIGHT - 350, '🌸');

    this._maeGfx = this.add.graphics();
    drawCharacter(this._maeGfx, 'mae', this._player.x - 70, this._player.y, 0.85);
  }

  update() {
    super.update();
    if (this._maeGfx) {
      this._maeGfx.clear();
      const targetX = this._player.x - 70;
      this._maeGfx.x += (targetX - this._maeGfx.x) * 0.08;
      drawCharacter(this._maeGfx, 'mae', 0, this._player.y, 0.85);
    }
  }
}
