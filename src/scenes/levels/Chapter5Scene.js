import Phaser from 'phaser';
import { WIDTH, HEIGHT, COLORS } from '../../constants.js';
import { drawCharacter } from '../../characters/drawCharacter.js';
import { chapterManager } from '../../utils/ChapterManager.js';
import { AudioManager } from '../../utils/AudioManager.js';

const FUND_TARGET = 20;

export class Chapter5Scene extends Phaser.Scene {
  constructor() { super({ key: 'Chapter5' }); }

  create() {
    this.audio = new AudioManager(this);
    this.audio.playMusic('music-level');
    this._fund = 0;
    this._speed = 200;
    this._done = false;

    this.add.rectangle(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, 0x1a1a2e);
    this.add.line(WIDTH / 2, HEIGHT / 2, 0, -HEIGHT / 2, 0, HEIGHT / 2, 0x333355, 1);

    this.add.text(WIDTH / 4,     20, '🩷 JEZ', { fontFamily: 'monospace', fontSize: '14px', color: '#FF6B9D' }).setOrigin(0.5);
    this.add.text(WIDTH * 3 / 4, 20, '💜 MAE', { fontFamily: 'monospace', fontSize: '14px', color: '#A855F7' }).setOrigin(0.5);

    this.add.rectangle(WIDTH / 2, 55, WIDTH - 40, 20, 0x222244).setOrigin(0.5);
    this._bar = this.add.rectangle(20, 55, 0, 16, 0xFF6B9D).setOrigin(0, 0.5);
    this.add.text(WIDTH / 2, 55, 'LUZON FUND', { fontFamily: 'monospace', fontSize: '10px', color: '#aaaacc' }).setOrigin(0.5).setDepth(1);

    this.add.rectangle(WIDTH / 4,     HEIGHT - 40, WIDTH / 2 - 20, 12, COLORS.GROUND);
    this.add.rectangle(WIDTH * 3 / 4, HEIGHT - 40, WIDTH / 2 - 20, 12, COLORS.GROUND);

    this._jezBody = this.physics.add.image(WIDTH / 4,     HEIGHT - 80, '__DEFAULT').setVisible(false);
    this._jezBody.body.setSize(36, 60).setAllowGravity(false);
    this._jezGfx = this.add.graphics();

    this._maeBody = this.physics.add.image(WIDTH * 3 / 4, HEIGHT - 80, '__DEFAULT').setVisible(false);
    this._maeBody.body.setSize(36, 60).setAllowGravity(false);
    this._maeGfx = this.add.graphics();

    this._coins = this.physics.add.group();

    this._spawnTimer = this.time.addEvent({
      delay: 900, callback: this._spawn, callbackScope: this, loop: true,
    });

    this._cursors = this.input.keyboard.createCursorKeys();
    this._redraw();

    const title = this.add.text(WIDTH / 2, HEIGHT / 2, '💼  Chapter 5: The Grind', {
      fontFamily: 'Georgia, serif', fontSize: '20px', color: '#ffffff',
      stroke: '#000', strokeThickness: 2,
    }).setOrigin(0.5).setDepth(10);
    this.time.delayedCall(2500, () => {
      this.tweens.add({ targets: title, alpha: 0, duration: 500 });
    });
  }

  _spawn() {
    const laneX = [WIDTH / 4, WIDTH * 3 / 4];
    laneX.forEach((x) => {
      const coin = this._coins.create(x + Phaser.Math.Between(-60, 60), -20, '__DEFAULT');
      coin.setVisible(false);
      coin.body.setSize(20, 20).setAllowGravity(false);
      coin.setVelocityY(this._speed);
      coin._emoji = this.add.text(coin.x, coin.y, '💰', { fontSize: '22px' }).setOrigin(0.5);
    });
  }

  update() {
    if (this._done) return;

    const dx = this._cursors.left.isDown ? -180 : this._cursors.right.isDown ? 180 : 0;
    this._jezBody.setVelocityX(dx);
    this._jezBody.x = Phaser.Math.Clamp(this._jezBody.x, 20, WIDTH / 2 - 20);

    const rightCoins = this._coins.getChildren().filter(c => c.active && c.x > WIDTH / 2);
    const nearest = rightCoins.sort((a, b) =>
      Phaser.Math.Distance.Between(a.x, a.y, this._maeBody.x, this._maeBody.y) -
      Phaser.Math.Distance.Between(b.x, b.y, this._maeBody.x, this._maeBody.y)
    )[0];
    if (nearest) {
      this._maeBody.setVelocityX(nearest.x < this._maeBody.x ? -160 : 160);
    } else {
      this._maeBody.setVelocityX(0);
    }
    this._maeBody.x = Phaser.Math.Clamp(this._maeBody.x, WIDTH / 2 + 20, WIDTH - 20);

    this._coins.getChildren().forEach(coin => {
      if (!coin.active) return;
      if (coin._emoji) { coin._emoji.x = coin.x; coin._emoji.y = coin.y; }
      if (coin.y > HEIGHT) {
        if (coin._emoji) coin._emoji.destroy();
        coin.destroy();
        return;
      }
      const players = [this._jezBody, this._maeBody];
      players.forEach(player => {
        if (Phaser.Math.Distance.Between(coin.x, coin.y, player.x, player.y) < 30) {
          if (coin._emoji) coin._emoji.destroy();
          coin.destroy();
          this._fund++;
          this.audio.sfx('sfx-collect');
          this._bar.width = (this._fund / FUND_TARGET) * (WIDTH - 40);
          if (this._fund >= FUND_TARGET) this._complete();
        }
      });
    });

    this._redraw();
  }

  _redraw() {
    this._jezGfx.clear();
    drawCharacter(this._jezGfx, 'jez', this._jezBody.x, this._jezBody.y + 30, 0.8);
    this._maeGfx.clear();
    drawCharacter(this._maeGfx, 'mae', this._maeBody.x, this._maeBody.y + 30, 0.8);
  }

  _complete() {
    if (this._done) return;
    this._done = true;
    this._spawnTimer.remove();
    this.audio.sfx('sfx-complete');
    chapterManager.advance();
    this.cameras.main.fadeOut(600);
    this.time.delayedCall(650, () => this.scene.start('WorldMap'));
  }
}
