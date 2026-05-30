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

  _buildBackground() {
    const rand = n => Math.abs(Math.sin(n * 127.1 + 311.7) * 43758.5453 % 1);

    const hills = (gfx, sf, yBase, color, alpha) => {
      const w = Math.ceil(WIDTH + (this._levelWidth - WIDTH) * sf) + 200;
      gfx.fillStyle(color, alpha);
      gfx.beginPath();
      gfx.moveTo(-10, HEIGHT + 10);
      for (let x = 0; x <= w + 10; x += 6) {
        gfx.lineTo(x, yBase + Math.sin(x*0.008)*22 + Math.sin(x*0.015)*12);
      }
      gfx.lineTo(w + 10, HEIGHT + 10);
      gfx.closePath();
      gfx.fillPath();
    };

    const pines = (gfx, sf, yBase, gap, color, alpha, seed) => {
      const w = Math.ceil(WIDTH + (this._levelWidth - WIDTH) * sf) + 200;
      gfx.fillStyle(color, alpha);
      for (let i = 0, x = rand(seed)*20; x < w; i++, x += gap + rand(i*3+seed)*gap*0.8) {
        const sz = 14 + rand(i*7+seed)*10;
        const y = yBase + Math.sin(x*0.008)*22 + Math.sin(x*0.015)*12;
        gfx.fillTriangle(x, y,          x-sz*0.55, y+sz,      x+sz*0.55, y+sz);
        gfx.fillTriangle(x, y-sz*0.40,  x-sz*0.45, y+sz*0.45, x+sz*0.45, y+sz*0.45);
      }
    };

    // Far pale hills
    const g1 = this.add.graphics().setScrollFactor(0.08, 1).setDepth(-5);
    hills(g1, 0.08, HEIGHT * 0.60, 0xb0d8b0, 0.45);

    // Mid hills + pines
    const g2 = this.add.graphics().setScrollFactor(0.18, 1).setDepth(-4);
    hills(g2, 0.18, HEIGHT * 0.60, 0x78b678, 0.58);
    pines(g2, 0.18, HEIGHT * 0.60, 28, 0x4a8a4a, 0.50, 1);

    // Mist band
    const gm = this.add.graphics().setScrollFactor(0.13, 1).setDepth(-3);
    const wm = Math.ceil(WIDTH + (this._levelWidth - WIDTH) * 0.13) + 200;
    gm.fillStyle(0xd8eedd, 0.22);
    gm.fillRect(0, HEIGHT * 0.50, wm, HEIGHT * 0.22);

    // Near hills + denser pines
    const g3 = this.add.graphics().setScrollFactor(0.30, 1).setDepth(-2);
    hills(g3, 0.30, HEIGHT * 0.62, 0x4a9a4a, 0.78);
    pines(g3, 0.30, HEIGHT * 0.62, 22, 0x2a6a2a, 0.72, 5);
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
    drawCharacter(this._maeGfx, 'mae', this._player.x - 70, this._player.y + 35, 0.85);
  }

  update() {
    super.update();
    if (this._maeGfx) {
      this._maeGfx.clear();
      const targetX = this._player.x - 70;
      this._maeGfx.x += (targetX - this._maeGfx.x) * 0.08;
      drawCharacter(this._maeGfx, 'mae', 0, this._player.y + 35, 0.85);
    }
  }
}
