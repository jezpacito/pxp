import { BaseLevel } from './BaseLevel.js';
import { WIDTH, HEIGHT } from '../../constants.js';

export class Chapter8Scene extends BaseLevel {
  constructor() { super({ key: 'Chapter8' }); }

  create() {
    this._collectibleCount = 0;
    this._levelWidth = WIDTH * 2.5;
    super.create();
    this.cameras.main.setBackgroundColor('#1a0a00');
    this.audio.playMusic('music-cliffhanger');

    const title = this.add.text(WIDTH / 2, 40, '🌅  The Final Quest', {
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
        gfx.lineTo(x, yBase + Math.sin(x * 0.010) * 20 + Math.sin(x * 0.018) * 10);
      }
      gfx.lineTo(w + 10, HEIGHT + 10);
      gfx.closePath();
      gfx.fillPath();
    };

    const sf0 = 0.04;
    const wm = Math.ceil(WIDTH + (this._levelWidth - WIDTH) * sf0) + 200;
    const gm = this.add.graphics().setScrollFactor(sf0, 1).setDepth(-5);
    for (let r = 55; r >= 18; r -= 5) {
      gm.fillStyle(0xff8020, Math.max(0, (55 - r) * 0.007));
      gm.fillCircle(wm * 0.62, HEIGHT * 0.27, r);
    }
    gm.fillStyle(0xffd060, 1);
    gm.fillCircle(wm * 0.62, HEIGHT * 0.27, 18);

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

    const goalX = this._goalX;
    const beacon = this.add.text(goalX, HEIGHT - 90, '🌅', { fontSize: '44px' }).setOrigin(0.5);
    this.tweens.add({ targets: beacon, y: HEIGHT - 100, duration: 1200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    const glow = this.add.graphics();
    glow.fillStyle(0xff8c42, 0.15);
    glow.fillCircle(goalX, HEIGHT - 100, 70);
  }

  _onLevelComplete() {
    this.time.delayedCall(300, () => this._playBeachEnding());
  }

  _playBeachEnding() {
    this.sound.stopAll();
    this.cameras.main.fadeOut(900, 0, 0, 0);

    this.time.delayedCall(1000, () => {
      this._buildBeachScene();
      this.cameras.main.fadeIn(1500);

      this.time.delayedCall(2000, () => this._launchFireworks());

      this.time.delayedCall(3200, () => {
        const line1 = this.add.text(WIDTH / 2, HEIGHT * 0.16, 'I Love you Langga', {
          fontFamily: 'Georgia, serif', fontSize: '40px', color: '#ffe0f0',
          stroke: '#9d174d', strokeThickness: 3, align: 'center',
        }).setOrigin(0.5).setScrollFactor(0).setDepth(60).setAlpha(0);

        const line2 = this.add.text(WIDTH / 2, HEIGHT * 0.16 + 56, 'Happy Anniversary 💕', {
          fontFamily: 'Georgia, serif', fontSize: '24px', color: '#fda4af',
          stroke: '#000', strokeThickness: 2, align: 'center',
        }).setOrigin(0.5).setScrollFactor(0).setDepth(60).setAlpha(0);

        this.tweens.add({ targets: line1, alpha: 1, duration: 1400, ease: 'Sine.easeIn' });
        this.tweens.add({ targets: line2, alpha: 1, duration: 1400, delay: 600, ease: 'Sine.easeIn' });
      });
    });
  }

  _buildBeachScene() {
    // Sky gradient — deep purple → pink → orange → gold
    const sky = this.add.graphics().setScrollFactor(0).setDepth(50);
    sky.fillGradientStyle(0x08001a, 0x08001a, 0x6b1060, 0x6b1060, 1);
    sky.fillRect(0, 0, WIDTH, HEIGHT * 0.25);
    sky.fillGradientStyle(0x6b1060, 0x6b1060, 0xd63a87, 0xd63a87, 1);
    sky.fillRect(0, HEIGHT * 0.25, WIDTH, HEIGHT * 0.18);
    sky.fillGradientStyle(0xd63a87, 0xd63a87, 0xff6e2d, 0xff6e2d, 1);
    sky.fillRect(0, HEIGHT * 0.43, WIDTH, HEIGHT * 0.15);
    sky.fillGradientStyle(0xff6e2d, 0xff6e2d, 0xffcc44, 0xffcc44, 1);
    sky.fillRect(0, HEIGHT * 0.58, WIDTH, HEIGHT * 0.08);

    // Stars
    const rand = n => Math.abs(Math.sin(n * 127.1 + 311.7) * 43758.5453 % 1);
    const stars = this.add.graphics().setScrollFactor(0).setDepth(50);
    for (let i = 0; i < 45; i++) {
      stars.fillStyle(0xffffff, 0.25 + rand(i * 7) * 0.65);
      stars.fillCircle(rand(i * 13) * WIDTH, rand(i * 5) * HEIGHT * 0.50, 0.7 + rand(i * 17) * 1.4);
    }

    // Sun sitting on horizon
    const sunX = WIDTH / 2, sunY = HEIGHT * 0.66;
    const sun = this.add.graphics().setScrollFactor(0).setDepth(51);
    for (let r = 80; r >= 24; r -= 7) {
      sun.fillStyle(0xffd166, (80 - r) * 0.006);
      sun.fillCircle(sunX, sunY, r);
    }
    sun.fillStyle(0xffeaa7, 1);
    sun.fillCircle(sunX, sunY, 26);
    // Sun half-submerged below horizon
    sun.fillStyle(0x1a3a5c, 1);
    sun.fillRect(0, sunY, WIDTH, HEIGHT);

    // Ocean
    const ocean = this.add.graphics().setScrollFactor(0).setDepth(52);
    ocean.fillGradientStyle(0x1a3a6c, 0x1a3a6c, 0x0d2040, 0x0d2040, 1);
    ocean.fillRect(0, HEIGHT * 0.64, WIDTH, HEIGHT * 0.15);

    // Sun reflection shimmer
    const refl = this.add.graphics().setScrollFactor(0).setDepth(53);
    for (let i = 0; i < 9; i++) {
      const rw = 55 - i * 5;
      const rx = sunX - rw / 2 + (i % 2 === 0 ? -6 : 6);
      refl.fillStyle(0xffd166, 0.22 - i * 0.02);
      refl.fillRect(rx, HEIGHT * 0.655 + i * 9, rw, 5);
    }

    // Sand
    const sand = this.add.graphics().setScrollFactor(0).setDepth(54);
    sand.fillGradientStyle(0xd4a84b, 0xd4a84b, 0xb8860b, 0xb8860b, 1);
    sand.fillRect(0, HEIGHT * 0.79, WIDTH, HEIGHT * 0.21);
    // Wet sand edge
    sand.fillStyle(0xc49a3c, 0.5);
    sand.fillEllipse(WIDTH / 2, HEIGHT * 0.79, WIDTH * 1.2, 22);

    // Two silhouettes sitting together watching the sunset
    const sil = this.add.graphics().setScrollFactor(0).setDepth(55);
    sil.fillStyle(0x080010, 1);
    this._drawSitting(sil, WIDTH / 2 - 40, HEIGHT * 0.80);  // Jez
    this._drawSitting(sil, WIDTH / 2 + 38, HEIGHT * 0.80);  // Mae
    // Leaning heads together
    sil.fillStyle(0x080010, 1);
    sil.fillEllipse(WIDTH / 2, HEIGHT * 0.80 - 36, 22, 10); // heads touching
  }

  _drawSitting(gfx, x, y) {
    gfx.fillCircle(x, y - 32, 14);           // head
    gfx.fillEllipse(x, y - 12, 26, 30);       // torso
    gfx.fillEllipse(x + 12, y + 8, 30, 12);   // legs out
    gfx.fillEllipse(x - 8, y + 4, 16, 10);    // lap
  }

  _launchFireworks() {
    const COLORS = [0xFF6B9D, 0xffd700, 0xa855f7, 0x60a5fa, 0xfb923c, 0x4ade80, 0xf9a8d4, 0xfef08a, 0xff4d6d];

    const burst = () => {
      const cx = Phaser.Math.Between(60, WIDTH - 60);
      const cy = Phaser.Math.Between(25, HEIGHT * 0.44);
      const color = COLORS[Phaser.Math.Between(0, COLORS.length - 1)];
      const n = Phaser.Math.Between(14, 22);

      // Central flash
      const flash = this.add.circle(cx, cy, 7, 0xffffff, 0.95)
        .setScrollFactor(0).setDepth(58);
      this.tweens.add({
        targets: flash, scale: 3.5, alpha: 0, duration: 280,
        onComplete: () => flash.destroy(),
      });

      // Particles
      for (let i = 0; i < n; i++) {
        const angle = (i / n) * Math.PI * 2 + Math.random() * 0.3;
        const dist = Phaser.Math.Between(55, 115);
        const dot = this.add.circle(cx, cy, Phaser.Math.Between(2, 4), color, 1)
          .setScrollFactor(0).setDepth(57);
        this.tweens.add({
          targets: dot,
          x: cx + Math.cos(angle) * dist,
          y: cy + Math.sin(angle) * dist + dist * 0.25,
          alpha: 0,
          scale: 0.2,
          duration: Phaser.Math.Between(750, 1100),
          ease: 'Power1',
          onComplete: () => dot.destroy(),
        });
      }

      // Trailing sparks
      for (let i = 0; i < 6; i++) {
        const spark = this.add.circle(
          cx + Phaser.Math.Between(-8, 8),
          cy + Phaser.Math.Between(-8, 8),
          1.5, 0xffffff, 0.7,
        ).setScrollFactor(0).setDepth(57);
        this.tweens.add({
          targets: spark, alpha: 0, scale: 0.1, duration: 400,
          onComplete: () => spark.destroy(),
        });
      }
    };

    burst();
    this.time.addEvent({ delay: 700,  callback: burst, repeat: -1 });
    this.time.addEvent({ delay: 1300, callback: burst, repeat: -1 });
    this.time.addEvent({ delay: 1900, callback: burst, repeat: -1 });
  }
}
