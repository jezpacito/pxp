import Phaser from 'phaser';
import { WIDTH, HEIGHT, COLORS, CHAPTERS } from '../constants.js';
import { chapterManager } from '../utils/ChapterManager.js';

export class WorldMapScene extends Phaser.Scene {
  constructor() { super({ key: 'WorldMap' }); }

  create() {
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0d0d1a, 0x0d0d1a, 0x1a1a2e, 0x1a1a2e, 1);
    bg.fillRect(0, 0, WIDTH, HEIGHT);

    this.add.text(WIDTH / 2, 40, 'YOUR JOURNEY', {
      fontFamily: 'monospace', fontSize: '22px', color: '#FF6B9D',
    }).setOrigin(0.5);

    const currentIdx = chapterManager.currentIndex();

    const positions = [
      [100, 360], [220, 300], [340, 340], [460, 260],
      [540, 320], [620, 250], [680, 300], [760, 200],
    ];

    for (let i = 0; i < positions.length - 1; i++) {
      const line = this.add.graphics();
      line.lineStyle(3, i < currentIdx ? COLORS.JEZ : 0x333355);
      line.beginPath();
      line.moveTo(positions[i][0], positions[i][1]);
      line.lineTo(positions[i + 1][0], positions[i + 1][1]);
      line.strokePath();
    }

    positions.forEach(([x, y], i) => {
      const isUnlocked = i <= currentIdx;
      const isCurrent = i === currentIdx;
      const color = isUnlocked ? (i % 2 === 0 ? COLORS.JEZ : COLORS.MAE) : 0x333355;

      const circle = this.add.circle(x, y, isCurrent ? 20 : 14, color);
      if (isCurrent) {
        this.tweens.add({ targets: circle, scaleX: 1.2, scaleY: 1.2, duration: 700, yoyo: true, repeat: -1 });
      }

      this.add.text(x, y - 28, `${i + 1}`, {
        fontFamily: 'monospace', fontSize: '11px',
        color: isUnlocked ? '#ffffff' : '#555577',
      }).setOrigin(0.5);

      const label = this.add.text(x, y + 24, CHAPTERS[i].title, {
        fontFamily: 'monospace', fontSize: '9px',
        color: isUnlocked ? '#aaaacc' : '#333355',
        wordWrap: { width: 80 }, align: 'center',
      }).setOrigin(0.5);

      if (isUnlocked) {
        circle.setInteractive({ useHandCursor: true });
        circle.on('pointerdown', () => this._goToChapter(i));
        label.setInteractive({ useHandCursor: true });
        label.on('pointerdown', () => this._goToChapter(i));
      }
    });

    this.add.text(WIDTH / 2, HEIGHT - 20, 'Click a chapter to play · SPACE to continue from current', {
      fontFamily: 'monospace', fontSize: '11px', color: '#555577',
    }).setOrigin(0.5);

    this.input.keyboard.once('keydown-SPACE', () => this._goToChapter(currentIdx));
  }

  _goToChapter(index) {
    chapterManager._index = index;
    const type = CHAPTERS[index].type;
    if (type === 'cutscene') {
      this.scene.start('Cutscene', { chapterKey: CHAPTERS[index].key });
    } else {
      this.scene.start(CHAPTERS[index].key);
    }
  }
}
