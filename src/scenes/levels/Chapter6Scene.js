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

    const title = this.add.text(WIDTH / 2, 40, '🏠  Chapter 6: Luzon, Finally', {
      fontFamily: 'Georgia, serif', fontSize: '20px', color: '#e9d5ff',
      stroke: '#000', strokeThickness: 2,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(10);
    this.time.delayedCall(3000, () => {
      this.tweens.add({ targets: title, alpha: 0, duration: 500 });
    });
  }

  _buildBackground() {
    const rand = n => Math.abs(Math.sin(n * 127.1 + 311.7) * 43758.5453 % 1);

    // Stars (nearly fixed)
    const sf0 = 0.04;
    const ws = Math.ceil(WIDTH + (this._levelWidth - WIDTH) * sf0) + 200;
    const gs = this.add.graphics().setScrollFactor(sf0, 1).setDepth(-5);
    for (let i = 0; i < 70; i++) {
      gs.fillStyle(0xffffff, 0.30 + rand(i*11+4)*0.65);
      gs.fillCircle(rand(i*13+1)*ws, rand(i*7+2)*(HEIGHT*0.68), 0.6 + rand(i*17+3)*1.6);
    }

    // Far building silhouettes
    const sf1 = 0.12;
    const wf = Math.ceil(WIDTH + (this._levelWidth - WIDTH) * sf1) + 200;
    const gf = this.add.graphics().setScrollFactor(sf1, 1).setDepth(-4);
    gf.fillStyle(0x100828, 1);
    for (let i = 0, x = 0; x < wf; i++) {
      const bw = 14 + rand(i*7+1)*12;
      const bh = 35 + rand(i*11+2)*55;
      gf.fillRect(x, HEIGHT - bh - 22, bw, bh);
      x += bw + 2 + rand(i*5+3)*8;
    }

    // Near building silhouettes
    const sf2 = 0.22;
    const wn = Math.ceil(WIDTH + (this._levelWidth - WIDTH) * sf2) + 200;
    const gn = this.add.graphics().setScrollFactor(sf2, 1).setDepth(-3);
    gn.fillStyle(0x07041a, 1);
    const buildings = [];
    for (let i = 0, x = 0; x < wn; i++) {
      const bw = 18 + rand(i*9+5)*18;
      const bh = 55 + rand(i*13+6)*80;
      gn.fillRect(x, HEIGHT - bh - 22, bw, bh);
      buildings.push([x, HEIGHT - bh - 22, bw, bh]);
      x += bw + 3 + rand(i*7+9)*10;
    }

    // Lit windows
    buildings.forEach(([bx, by, bw], bi) => {
      for (let row = 0, wy = by + 6; wy < HEIGHT - 28; row++, wy += 9) {
        for (let col = 0, wx = bx + 3; wx < bx + bw - 5; col++, wx += 8) {
          if (rand(bi*100 + row*17 + col*31) > 0.45) {
            const warm = rand(bi*50 + row*13 + col*27) > 0.4;
            gn.fillStyle(warm ? 0xffe090 : 0x90c8ff, 0.55 + rand(bi*30 + row*11 + col*19)*0.4);
            gn.fillRect(wx, wy, 4, 4);
          }
        }
      }
    });

    // Ambient city glow pulse
    this.tweens.add({
      targets: gn, alpha: { from: 1.0, to: 0.82 },
      duration: 4200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
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
      drawCharacter(this._maeGfx, 'mae', this._player.x - 70, this._player.y + 35, 0.85);
    }
  }
}
