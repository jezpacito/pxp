import Phaser from 'phaser';
import { WIDTH, HEIGHT } from '../../constants.js';
import { chapterManager } from '../../utils/ChapterManager.js';
import { chapter1Config } from './chapter1Config.js';
import { chapter4Config } from './chapter4Config.js';
import { chapter7Config } from './chapter7Config.js';

const CONFIGS = {
  Chapter1: chapter1Config,
  Chapter4: chapter4Config,
  Chapter7: chapter7Config,
};

export function buildPanels(rawPanels) {
  return rawPanels.map(p => ({ ...p }));
}

export class CutsceneScene extends Phaser.Scene {
  constructor() { super({ key: 'Cutscene' }); }

  init(data) {
    this._chapterKey = data.chapterKey;
    this._panels = buildPanels(CONFIGS[data.chapterKey] ?? []);
    this._index = 0;
  }

  create() {
    if (this.sound.get('music-cutscene')) {
      this.sound.stopAll();
      this.sound.play('music-cutscene', { loop: true, volume: 0.4 });
    }
    this._showPanel();
    this.input.on('pointerdown', () => this._next());
    this.input.keyboard.on('keydown-SPACE', () => this._next());
  }

  _showPanel() {
    this.children.removeAll(true);
    const panel = this._panels[this._index];
    if (!panel) { this._finish(); return; }

    const bg = this.add.graphics();
    bg.fillStyle(panel.bg ?? 0x0d0d1a);
    bg.fillRect(0, 0, WIDTH, HEIGHT);

    if (panel.emoji) {
      this.add.text(WIDTH / 2, HEIGHT / 2 - 60, panel.emoji, { fontSize: '80px' }).setOrigin(0.5);
    }

    this.add.text(WIDTH / 2, HEIGHT / 2 + 60, panel.text ?? '', {
      fontFamily: 'Georgia, serif', fontSize: '20px', color: '#ffffff',
      align: 'center', wordWrap: { width: WIDTH - 80 },
    }).setOrigin(0.5);

    if (panel.sub) {
      this.add.text(WIDTH / 2, HEIGHT / 2 + 110, panel.sub, {
        fontFamily: 'monospace', fontSize: '13px', color: '#aaaacc',
        align: 'center', wordWrap: { width: WIDTH - 80 },
      }).setOrigin(0.5);
    }

    this._panels.forEach((_, i) => {
      this.add.circle(
        WIDTH / 2 - (this._panels.length - 1) * 8 + i * 16,
        HEIGHT - 24, 4,
        i === this._index ? 0xFF6B9D : 0x444466,
      );
    });

    this.add.text(WIDTH - 16, HEIGHT - 16, 'click / SPACE ▶', {
      fontFamily: 'monospace', fontSize: '11px', color: '#555577',
    }).setOrigin(1, 1);

    this.cameras.main.fadeIn(300);
  }

  _next() {
    this._index++;
    if (this._index >= this._panels.length) {
      this._finish();
    } else {
      this.cameras.main.fadeOut(200);
      this.time.delayedCall(220, () => this._showPanel());
    }
  }

  _finish() {
    chapterManager.advance();
    this.sound.stopAll();
    this.cameras.main.fadeOut(500);
    this.time.delayedCall(520, () => this.scene.start('WorldMap'));
  }
}
