import { BaseLevel } from './BaseLevel.js';
import { WIDTH, HEIGHT } from '../../constants.js';
import { chapterManager } from '../../utils/ChapterManager.js';

export class Chapter8Scene extends BaseLevel {
  constructor() { super({ key: 'Chapter8' }); }

  create() {
    this._collectibleCount = 0;
    this._levelWidth = WIDTH * 2.5;
    super.create();
    this.cameras.main.setBackgroundColor('#1a0a00');
    this.audio.playMusic('music-cliffhanger');

    const title = this.add.text(WIDTH / 2, 40, '💍  The Final Quest', {
      fontFamily: 'Georgia, serif', fontSize: '22px', color: '#fcd34d',
      stroke: '#000', strokeThickness: 2,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(10);
    this.time.delayedCall(3000, () => {
      this.tweens.add({ targets: title, alpha: 0, duration: 500 });
    });
  }

  _buildBackground() {
    const hills = (gfx, sf, yBase, color, alpha) => {
      const w = Math.ceil(WIDTH + (this._levelWidth - WIDTH) * sf) + 200;
      gfx.fillStyle(color, alpha);
      gfx.beginPath();
      gfx.moveTo(-10, HEIGHT + 10);
      for (let x = 0; x <= w + 10; x += 6) {
        gfx.lineTo(x, yBase + Math.sin(x*0.010)*20 + Math.sin(x*0.018)*10);
      }
      gfx.lineTo(w + 10, HEIGHT + 10);
      gfx.closePath();
      gfx.fillPath();
    };

    // Moon + glow
    const sf0 = 0.04;
    const wm = Math.ceil(WIDTH + (this._levelWidth - WIDTH) * sf0) + 200;
    const gm = this.add.graphics().setScrollFactor(sf0, 1).setDepth(-5);
    for (let r = 55; r >= 18; r -= 5) {
      gm.fillStyle(0xff8020, Math.max(0, (55 - r) * 0.007));
      gm.fillCircle(wm * 0.62, HEIGHT * 0.27, r);
    }
    gm.fillStyle(0xffd060, 1);
    gm.fillCircle(wm * 0.62, HEIGHT * 0.27, 18);

    // Three silhouette hill layers
    const g1 = this.add.graphics().setScrollFactor(0.10, 1).setDepth(-4);
    hills(g1, 0.10, HEIGHT * 0.60, 0x3a1500, 0.55);

    const g2 = this.add.graphics().setScrollFactor(0.20, 1).setDepth(-3);
    hills(g2, 0.20, HEIGHT * 0.63, 0x220c00, 0.75);

    const g3 = this.add.graphics().setScrollFactor(0.33, 1).setDepth(-2);
    hills(g3, 0.33, HEIGHT * 0.67, 0x140500, 0.92);
  }

  _buildLevel() {
    this._addPlatform(200,  HEIGHT - 160, 120);
    this._addPlatform(420,  HEIGHT - 220, 100);
    this._addPlatform(640,  HEIGHT - 280, 120);
    this._addPlatform(880,  HEIGHT - 220, 100);
    this._addPlatform(1100, HEIGHT - 280, 120);
    this._addPlatform(1350, HEIGHT - 200, 100);
    this._addPlatform(1600, HEIGHT - 240, 120);

    const chestX = this._goalX;
    this._chest = this.add.text(chestX, HEIGHT - 90, '📦', { fontSize: '48px' }).setOrigin(0.5);
    this.tweens.add({ targets: this._chest, y: HEIGHT - 100, duration: 1000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    const glow = this.add.graphics();
    glow.fillStyle(0xffd700, 0.12);
    glow.fillCircle(chestX, HEIGHT - 100, 80);
  }

  _onLevelComplete() {
    this._chest.setText('💍');
    this.time.delayedCall(400, () => this._playCliffhanger());
  }

  _playCliffhanger() {
    this.sound.stopAll();

    const ring = this.add.text(WIDTH / 2, HEIGHT / 2, '💍', { fontSize: '60px' })
      .setOrigin(0.5).setScrollFactor(0).setDepth(20);

    this.tweens.add({
      targets: ring, y: HEIGHT / 2 - 60, scaleX: 1.4, scaleY: 1.4,
      duration: 1800, ease: 'Sine.easeOut',
    });

    this.time.delayedCall(2000, () => {
      this.cameras.main.flash(1000, 255, 255, 255, false);
    });
    this.time.delayedCall(3200, () => {
      this.cameras.main.fadeOut(1200, 0, 0, 0);
    });
    this.time.delayedCall(4500, () => {
      const q = this.add.text(WIDTH / 2, HEIGHT / 2, '???', {
        fontFamily: 'Georgia, serif', fontSize: '64px', color: '#fcd34d',
        stroke: '#000', strokeThickness: 3,
      }).setOrigin(0.5).setScrollFactor(0).setDepth(30).setAlpha(0);
      this.tweens.add({ targets: q, alpha: 1, duration: 800 });
    });
    this.time.delayedCall(6000, () => {
      const tbc = this.add.text(WIDTH / 2, HEIGHT / 2 + 70, 'To be continued…', {
        fontFamily: 'Georgia, serif', fontSize: '28px', color: '#ffffff',
      }).setOrigin(0.5).setScrollFactor(0).setDepth(30).setAlpha(0);
      this.tweens.add({ targets: tbc, alpha: 1, duration: 1000 });
    });
    this.time.delayedCall(8500, () => {
      const credit = this.add.text(WIDTH / 2, HEIGHT - 50, '💕  Happy 6th Anniversary, Mae  💕', {
        fontFamily: 'Georgia, serif', fontSize: '18px', color: '#FF6B9D',
      }).setOrigin(0.5).setScrollFactor(0).setDepth(30).setAlpha(0);
      this.tweens.add({ targets: credit, alpha: 1, duration: 1500 });
    });
  }
}
