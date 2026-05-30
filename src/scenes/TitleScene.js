import Phaser from 'phaser';
import { WIDTH, HEIGHT, COLORS } from '../constants.js';
import { drawCharacter } from '../characters/drawCharacter.js';
import { chapterManager } from '../utils/ChapterManager.js';

export class TitleScene extends Phaser.Scene {
  constructor() { super({ key: 'Title' }); }

  create() {
    chapterManager.reset();

    const bg = this.add.graphics();
    bg.fillGradientStyle(0x1a1a3e, 0x1a1a3e, 0x0d0d1a, 0x0d0d1a, 1);
    bg.fillRect(0, 0, WIDTH, HEIGHT);

    for (let i = 0; i < 40; i++) {
      const x = Phaser.Math.Between(0, WIDTH);
      const y = Phaser.Math.Between(0, HEIGHT * 0.7);
      const star = this.add.circle(x, y, Phaser.Math.Between(1, 2), 0xffffff, 0.8);
      this.tweens.add({
        targets: star, alpha: 0.1, duration: Phaser.Math.Between(800, 2000),
        yoyo: true, repeat: -1, delay: Phaser.Math.Between(0, 1500),
      });
    }

    this.add.text(WIDTH / 2, 100, '✦ 6 YEARS OF US ✦', {
      fontFamily: 'Georgia, serif', fontSize: '42px', color: '#FF6B9D',
      stroke: '#000', strokeThickness: 4, align: 'center',
    }).setOrigin(0.5);

    this.add.text(WIDTH / 2, 155, 'a love story in 8 chapters', {
      fontFamily: 'Georgia, serif', fontSize: '18px', color: '#d8b4fe',
    }).setOrigin(0.5);

    const gfxJez = this.add.graphics();
    drawCharacter(gfxJez, 'jez', WIDTH / 2 - 80, HEIGHT - 60, 1);
    const gfxMae = this.add.graphics();
    drawCharacter(gfxMae, 'mae', WIDTH / 2 + 80, HEIGHT - 60, 1);

    this.tweens.add({ targets: gfxJez, y: -8, duration: 1800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.tweens.add({ targets: gfxMae, y: -8, duration: 2000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: 400 });

    const heart = this.add.text(WIDTH / 2, HEIGHT - 100, '💕', { fontSize: '28px' }).setOrigin(0.5);
    this.tweens.add({ targets: heart, scaleX: 1.3, scaleY: 1.3, duration: 1200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    const btn = this.add.text(WIDTH / 2, HEIGHT - 40, '▶  Press SPACE or click to start', {
      fontFamily: 'monospace', fontSize: '16px', color: '#ffffff',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.tweens.add({ targets: btn, alpha: 0.3, duration: 900, yoyo: true, repeat: -1 });

    const start = () => this.scene.start('WorldMap');
    btn.on('pointerdown', start);
    this.input.keyboard.once('keydown-SPACE', start);
  }
}
