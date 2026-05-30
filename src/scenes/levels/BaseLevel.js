import Phaser from 'phaser';
import { WIDTH, HEIGHT, COLORS } from '../../constants.js';
import { drawCharacter } from '../../characters/drawCharacter.js';
import { chapterManager } from '../../utils/ChapterManager.js';
import { HUD } from '../../ui/HUD.js';
import { AudioManager } from '../../utils/AudioManager.js';

export class BaseLevel extends Phaser.Scene {
  _collectibleCount = 5;
  _levelWidth = WIDTH * 3;

  create() {
    this.audio = new AudioManager(this);
    this.audio.playMusic('music-level');

    this._buildGround();

    this._playerGfx = this.add.graphics();
    this._player = this.physics.add.image(120, HEIGHT - 120, '__DEFAULT');
    this._player.setVisible(false).setCollideWorldBounds(true);
    this._player.body.setSize(36, 70);

    this.cameras.main.setBounds(0, 0, this._levelWidth, HEIGHT);
    this.cameras.main.startFollow(this._player, true, 0.1, 0.1);
    this.physics.world.setBounds(0, 0, this._levelWidth, HEIGHT);

    this._cursors = this.input.keyboard.createCursorKeys();
    this.hud = new HUD(this, this._collectibleCount);

    this._goalX = this._levelWidth - 120;
    this._goalReached = false;

    this._buildLevel();
    this._redrawPlayer();
  }

  _buildGround() {
    this._ground = this.physics.add.staticGroup();
    const tileW = 64;
    const cols = Math.ceil(this._levelWidth / tileW) + 1;
    for (let i = 0; i < cols; i++) {
      const tile = this.add.graphics();
      tile.fillStyle(COLORS.GROUND);
      tile.fillRect(0, 0, tileW, 64);
      tile.fillStyle(COLORS.GROUND_DARK);
      tile.fillRect(0, 4, tileW, 60);
      tile.x = i * tileW;
      tile.y = HEIGHT - 64;
      const body = this._ground.create(i * tileW + tileW / 2, HEIGHT - 32, '__DEFAULT');
      body.setVisible(false).refreshBody();
    }
    this.physics.add.collider(this._player, this._ground);
  }

  _buildLevel() {}

  _redrawPlayer() {
    this._playerGfx.clear();
    drawCharacter(this._playerGfx, 'jez', this._player.x, this._player.y + 35, 0.85);
  }

  update() {
    const onGround = this._player.body.blocked.down;
    const speed = 220;

    if (this._cursors.left.isDown) {
      this._player.setVelocityX(-speed);
    } else if (this._cursors.right.isDown) {
      this._player.setVelocityX(speed);
    } else {
      this._player.setVelocityX(0);
    }

    if ((this._cursors.up.isDown || this._cursors.space.isDown) && onGround) {
      this._player.setVelocityY(-520);
      this.audio.sfx('sfx-jump');
    }

    this._redrawPlayer();

    if (!this._goalReached && Math.abs(this._player.x - this._goalX) < 60) {
      this._goalReached = true;
      this._onLevelComplete();
    }
  }

  _onLevelComplete() {
    this.audio.sfx('sfx-complete');
    chapterManager.advance();
    this.cameras.main.fadeOut(600);
    this.time.delayedCall(650, () => this.scene.start('WorldMap'));
  }

  _addPlatform(x, y, width) {
    const gfx = this.add.graphics();
    gfx.fillStyle(COLORS.GROUND);
    gfx.fillRect(0, 0, width, 20);
    gfx.fillStyle(COLORS.GROUND_DARK);
    gfx.fillRect(0, 4, width, 16);
    gfx.x = x;
    gfx.y = y;
    const body = this.physics.add.staticImage(x + width / 2, y + 10, '__DEFAULT');
    body.setVisible(false);
    body.body.setSize(width, 20).setOffset(-width / 2, -10);
    body.refreshBody();
    this.physics.add.collider(this._player, body);
    return body;
  }

  _addCollectible(x, y, emoji = '💕') {
    const text = this.add.text(x, y, emoji, { fontSize: '24px' }).setOrigin(0.5);
    this.tweens.add({ targets: text, y: y - 8, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    const zone = this.physics.add.image(x, y, '__DEFAULT').setVisible(false);
    zone.body.setSize(30, 30).setAllowGravity(false);
    this.physics.add.overlap(this._player, zone, () => {
      text.destroy();
      zone.destroy();
      this.hud.collect();
      this.audio.sfx('sfx-collect');
    });
  }
}
