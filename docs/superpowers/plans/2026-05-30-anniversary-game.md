# 6 Years of Us — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a browser-based 2D platformer anniversary game telling Jez & Mae's 6-year love story across 8 chapters (4 playable levels, 3 cutscenes, 1 cliffhanger), deployable as a static site.

**Architecture:** Vite + Phaser.js 3 project. Each chapter is a Phaser Scene. Cutscenes use an HTML overlay rendered on top of the Phaser canvas. Characters (Jez & Mae) are drawn via Phaser's Graphics API at runtime — no external sprite images needed for them. Kenney tileset PNGs are loaded as standard Phaser assets.

**Tech Stack:** Phaser.js 3, Vite, Vanilla JS (ES modules), Jest (logic tests), Kenney New Platformer Pack (CC0 tiles)

---

## File Structure

```
pxp-app-v2/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.js                     # Phaser game config, registers all scenes
│   ├── constants.js                # Colors, sizes, chapter list
│   ├── characters/
│   │   └── drawCharacter.js        # Draws Jez or Mae onto a Phaser Graphics object
│   ├── scenes/
│   │   ├── BootScene.js            # Preloads Kenney assets
│   │   ├── TitleScene.js           # Title screen + start button
│   │   ├── WorldMapScene.js        # Chapter progress dots between levels
│   │   ├── cutscenes/
│   │   │   ├── CutsceneScene.js    # Reusable scene: renders panels from a config array
│   │   │   ├── chapter1Config.js   # Panel data for Ch1 — Quarantine Quest
│   │   │   ├── chapter4Config.js   # Panel data for Ch4 — Long Distance
│   │   │   └── chapter7Config.js   # Panel data for Ch7 — Blink of an Eye
│   │   └── levels/
│   │       ├── BaseLevel.js        # Shared setup: tiles, player, HUD, collectibles, goal
│   │       ├── Chapter2Scene.js    # First Flight — airport level
│   │       ├── Chapter3Scene.js    # Baguio Quest — mountain level
│   │       ├── Chapter5Scene.js    # The Grind — split-screen auto-runner
│   │       ├── Chapter6Scene.js    # Manila Finally — city level
│   │       └── Chapter8Scene.js    # Final Quest — cliffhanger level
│   ├── ui/
│   │   └── HUD.js                  # Hearts display + collectible counter
│   └── utils/
│       ├── ChapterManager.js       # Tracks completed chapters, returns next scene key
│       └── AudioManager.js         # play/stop music + SFX helpers
├── assets/
│   ├── kenney/                     # Kenney New Platformer Pack PNGs (see Task 1)
│   └── audio/                      # Royalty-free tracks (see Task 1)
└── tests/
    ├── ChapterManager.test.js
    ├── drawCharacter.test.js
    └── CutsceneScene.test.js
```

---

## Task 1: Project Setup

**Files:**

- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `src/main.js`
- Create: `src/constants.js`

- [ ] **Step 1: Init project and install dependencies**

```bash
cd /home/jezu/workspace/pxp-app-v2
npm init -y
npm install phaser
npm install --save-dev vite jest @types/jest
```

- [ ] **Step 2: Create `vite.config.js`**

```js
// vite.config.js
export default {
  base: './',
  build: { outDir: 'dist' },
};
```

- [ ] **Step 3: Update `package.json` scripts**

Replace the `scripts` section:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "test": "jest"
},
"jest": {
  "testEnvironment": "node",
  "transform": {}
}
```

- [ ] **Step 4: Create `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>6 Years of Us 💕</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #0d0d1a; display: flex; justify-content: center; align-items: center; height: 100vh; overflow: hidden; }
    canvas { display: block; }
  </style>
</head>
<body>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

- [ ] **Step 5: Create `src/constants.js`**

```js
// src/constants.js
export const WIDTH = 800;
export const HEIGHT = 450;

export const COLORS = {
  JEZ: 0xFF6B9D,
  JEZ_DARK: 0xC43070,
  JEZ_LIGHT: 0xFFB3D1,
  MAE: 0xA855F7,
  MAE_DARK: 0x7E22CE,
  MAE_LIGHT: 0xE9D5FF,
  HELMET_RING: 0x1a1a1a,
  VISOR: 0xf2e6d4,
  SKY: 0xaee4ff,
  GROUND: 0x5cb85c,
  GROUND_DARK: 0x3a8a3a,
  BG_DARK: 0x0d0d1a,
};

export const CHAPTERS = [
  { key: 'Chapter1', type: 'cutscene', title: 'Quarantine Quest' },
  { key: 'Chapter2', type: 'level',    title: 'First Flight' },
  { key: 'Chapter3', type: 'level',    title: 'The Baguio Quest' },
  { key: 'Chapter4', type: 'cutscene', title: 'Long Distance' },
  { key: 'Chapter5', type: 'level',    title: 'The Grind' },
  { key: 'Chapter6', type: 'level',    title: 'Manila, Finally' },
  { key: 'Chapter7', type: 'cutscene', title: 'A Blink of an Eye' },
  { key: 'Chapter8', type: 'level',    title: 'The Final Quest' },
];
```

- [ ] **Step 6: Create `src/main.js` (placeholder — scenes added in later tasks)**

```js
// src/main.js
import Phaser from 'phaser';
import { WIDTH, HEIGHT } from './constants.js';
import { BootScene } from './scenes/BootScene.js';
import { TitleScene } from './scenes/TitleScene.js';

const config = {
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
  backgroundColor: '#0d0d1a',
  scene: [BootScene, TitleScene],
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 600 }, debug: false },
  },
};

new Phaser.Game(config);
```

- [ ] **Step 7: Download Kenney assets**

Go to `https://kenney.nl/assets/new-platformer-pack` and download the ZIP.
Extract and copy the PNG spritesheets into `assets/kenney/`:

```
assets/kenney/
  tilemap.png          # main tileset spritesheet
  tilemap.xml          # atlas data
  characters.png       # character sheet (optional reference)
```

- [ ] **Step 8: Verify dev server starts**

```bash
npm run dev
```

Expected: Vite prints a localhost URL, browser shows black screen (no errors in console).

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: project scaffold — Vite + Phaser.js setup"
```

---

## Task 2: Character Drawing Utility

**Files:**

- Create: `src/characters/drawCharacter.js`
- Create: `tests/drawCharacter.test.js`

- [ ] **Step 1: Write the failing test**

```js
// tests/drawCharacter.test.js
import { getCharacterConfig } from '../src/characters/drawCharacter.js';
import { COLORS } from '../src/constants.js';

test('jez config returns pink colors', () => {
  const cfg = getCharacterConfig('jez');
  expect(cfg.bodyColor).toBe(COLORS.JEZ);
  expect(cfg.darkColor).toBe(COLORS.JEZ_DARK);
});

test('mae config returns purple colors', () => {
  const cfg = getCharacterConfig('mae');
  expect(cfg.bodyColor).toBe(COLORS.MAE);
  expect(cfg.darkColor).toBe(COLORS.MAE_DARK);
});

test('unknown character throws', () => {
  expect(() => getCharacterConfig('unknown')).toThrow();
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- --testPathPattern=drawCharacter
```

Expected: FAIL — `Cannot find module`

- [ ] **Step 3: Create `src/characters/drawCharacter.js`**

```js
// src/characters/drawCharacter.js
import { COLORS } from '../constants.js';

const CONFIGS = {
  jez: {
    bodyColor: COLORS.JEZ,
    darkColor: COLORS.JEZ_DARK,
    lightColor: COLORS.JEZ_LIGHT,
    accessory: 'bow',
  },
  mae: {
    bodyColor: COLORS.MAE,
    darkColor: COLORS.MAE_DARK,
    lightColor: COLORS.MAE_LIGHT,
    accessory: 'star',
  },
};

export function getCharacterConfig(who) {
  const cfg = CONFIGS[who];
  if (!cfg) throw new Error(`Unknown character: ${who}`);
  return cfg;
}

/**
 * Draws a Jez or Mae character onto a Phaser.GameObjects.Graphics object.
 * @param {Phaser.GameObjects.Graphics} gfx
 * @param {string} who - 'jez' or 'mae'
 * @param {number} x - center x
 * @param {number} y - bottom y
 * @param {number} scale - default 1
 */
export function drawCharacter(gfx, who, x, y, scale = 1) {
  const cfg = getCharacterConfig(who);
  const s = scale;

  // arm left
  gfx.fillStyle(cfg.bodyColor);
  gfx.fillEllipse(x - 22 * s, y - 30 * s, 18 * s, 13 * s);
  // arm right
  gfx.fillEllipse(x + 22 * s, y - 30 * s, 18 * s, 13 * s);

  // body
  gfx.fillStyle(cfg.bodyColor);
  gfx.fillEllipse(x, y - 15 * s, 38 * s, 30 * s);

  // leg left
  gfx.fillEllipse(x - 13 * s, y - 2 * s, 20 * s, 12 * s);
  // leg right
  gfx.fillEllipse(x + 13 * s, y - 2 * s, 20 * s, 12 * s);

  // helmet ring (dark border circle)
  gfx.fillStyle(cfg.bodyColor);
  gfx.fillCircle(x, y - 52 * s, 38 * s);
  gfx.lineStyle(7 * s, COLORS.HELMET_RING);
  gfx.strokeCircle(x, y - 52 * s, 30 * s);

  // visor (face area)
  gfx.fillStyle(COLORS.VISOR);
  gfx.fillCircle(x, y - 52 * s, 23 * s);

  // left eye
  gfx.fillStyle(0x1a1a1a);
  gfx.fillEllipse(x - 9 * s, y - 52 * s, 10 * s, 11 * s);
  // right eye
  gfx.fillEllipse(x + 9 * s, y - 52 * s, 10 * s, 11 * s);

  // eye shine left
  gfx.fillStyle(0xffffff);
  gfx.fillCircle(x - 7 * s, y - 55 * s, 2.5 * s);
  // eye shine right
  gfx.fillCircle(x + 11 * s, y - 55 * s, 2.5 * s);

  // smile
  gfx.lineStyle(3 * s, 0x444444);
  gfx.beginPath();
  gfx.moveTo(x - 8 * s, y - 44 * s);
  gfx.bezierCurveTo(x - 4 * s, y - 40 * s, x + 4 * s, y - 40 * s, x + 8 * s, y - 44 * s);
  gfx.strokePath();

  // accessory
  if (cfg.accessory === 'bow') {
    _drawBow(gfx, x, y - 85 * s, s, cfg.darkColor, cfg.lightColor);
  } else if (cfg.accessory === 'star') {
    _drawStar(gfx, x, y - 90 * s, s);
  }
}

function _drawStar(gfx, x, y, s) {
  gfx.fillStyle(0xffd700);
  const points = [];
  for (let i = 0; i < 10; i++) {
    const angle = (i * Math.PI) / 5 - Math.PI / 2;
    const r = i % 2 === 0 ? 8 * s : 4 * s;
    points.push({ x: x + Math.cos(angle) * r, y: y + Math.sin(angle) * r });
  }
  gfx.fillPoints(points, true);
}

function _drawBow(gfx, x, y, s, darkColor, lightColor) {
  gfx.fillStyle(darkColor);
  gfx.fillTriangle(x - 14 * s, y - 7 * s, x, y, x - 14 * s, y + 7 * s);
  gfx.fillTriangle(x + 14 * s, y - 7 * s, x, y, x + 14 * s, y + 7 * s);
  gfx.fillStyle(lightColor);
  gfx.fillCircle(x, y, 5 * s);
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- --testPathPattern=drawCharacter
```

Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/characters/drawCharacter.js tests/drawCharacter.test.js
git commit -m "feat: character drawing utility for Jez and Mae"
```

---

## Task 3: ChapterManager

**Files:**

- Create: `src/utils/ChapterManager.js`
- Create: `tests/ChapterManager.test.js`

- [ ] **Step 1: Write the failing tests**

```js
// tests/ChapterManager.test.js
import { ChapterManager } from '../src/utils/ChapterManager.js';

test('starts at chapter index 0', () => {
  const cm = new ChapterManager();
  expect(cm.currentIndex()).toBe(0);
});

test('advance moves to next chapter', () => {
  const cm = new ChapterManager();
  cm.advance();
  expect(cm.currentIndex()).toBe(1);
});

test('currentSceneKey returns correct scene key', () => {
  const cm = new ChapterManager();
  expect(cm.currentSceneKey()).toBe('Chapter1');
  cm.advance();
  expect(cm.currentSceneKey()).toBe('Chapter2');
});

test('isComplete returns true after last chapter', () => {
  const cm = new ChapterManager();
  for (let i = 0; i < 8; i++) cm.advance();
  expect(cm.isComplete()).toBe(true);
});

test('reset brings back to chapter 0', () => {
  const cm = new ChapterManager();
  cm.advance();
  cm.reset();
  expect(cm.currentIndex()).toBe(0);
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- --testPathPattern=ChapterManager
```

Expected: FAIL — `Cannot find module`

- [ ] **Step 3: Create `src/utils/ChapterManager.js`**

```js
// src/utils/ChapterManager.js
import { CHAPTERS } from '../constants.js';

export class ChapterManager {
  constructor() {
    this._index = 0;
  }

  currentIndex() {
    return this._index;
  }

  currentSceneKey() {
    return CHAPTERS[this._index]?.key ?? null;
  }

  advance() {
    if (!this.isComplete()) this._index++;
  }

  isComplete() {
    return this._index >= CHAPTERS.length;
  }

  reset() {
    this._index = 0;
  }
}

export const chapterManager = new ChapterManager();
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- --testPathPattern=ChapterManager
```

Expected: PASS (5 tests)

- [ ] **Step 5: Commit**

```bash
git add src/utils/ChapterManager.js tests/ChapterManager.test.js
git commit -m "feat: ChapterManager tracks game progression"
```

---

## Task 4: BootScene + TitleScene

**Files:**

- Create: `src/scenes/BootScene.js`
- Create: `src/scenes/TitleScene.js`
- Modify: `src/main.js`

- [ ] **Step 1: Create `src/scenes/BootScene.js`**

```js
// src/scenes/BootScene.js
export class BootScene extends Phaser.Scene {
  constructor() { super({ key: 'Boot' }); }

  preload() {
    // Kenney tilemap spritesheet (64x64 tiles, 10 cols)
    this.load.spritesheet('tiles', 'assets/kenney/tilemap.png', {
      frameWidth: 64, frameHeight: 64,
    });

    // Audio (add files to assets/audio/ — see README)
    this.load.audio('music-title',  'assets/audio/title.mp3');
    this.load.audio('music-level',  'assets/audio/level.mp3');
    this.load.audio('music-cutscene', 'assets/audio/cutscene.mp3');
    this.load.audio('music-cliffhanger', 'assets/audio/cliffhanger.mp3');
    this.load.audio('sfx-jump',     'assets/audio/jump.mp3');
    this.load.audio('sfx-collect',  'assets/audio/collect.mp3');
    this.load.audio('sfx-complete', 'assets/audio/complete.mp3');
  }

  create() {
    this.scene.start('Title');
  }
}
```

- [ ] **Step 2: Create `src/scenes/TitleScene.js`**

```js
// src/scenes/TitleScene.js
import { WIDTH, HEIGHT, COLORS } from '../constants.js';
import { drawCharacter } from '../characters/drawCharacter.js';
import { chapterManager } from '../utils/ChapterManager.js';

export class TitleScene extends Phaser.Scene {
  constructor() { super({ key: 'Title' }); }

  create() {
    chapterManager.reset();

    // Sky gradient background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x1a1a3e, 0x1a1a3e, 0x0d0d1a, 0x0d0d1a, 1);
    bg.fillRect(0, 0, WIDTH, HEIGHT);

    // Floating stars
    for (let i = 0; i < 40; i++) {
      const x = Phaser.Math.Between(0, WIDTH);
      const y = Phaser.Math.Between(0, HEIGHT * 0.7);
      const star = this.add.circle(x, y, Phaser.Math.Between(1, 2), 0xffffff, 0.8);
      this.tweens.add({
        targets: star, alpha: 0.1, duration: Phaser.Math.Between(800, 2000),
        yoyo: true, repeat: -1, delay: Phaser.Math.Between(0, 1500),
      });
    }

    // Title text
    this.add.text(WIDTH / 2, 100, '✦ 6 YEARS OF US ✦', {
      fontFamily: 'Georgia, serif', fontSize: '42px', color: '#FF6B9D',
      stroke: '#000', strokeThickness: 4, align: 'center',
    }).setOrigin(0.5);

    this.add.text(WIDTH / 2, 155, 'a love story in 8 chapters', {
      fontFamily: 'Georgia, serif', fontSize: '18px', color: '#d8b4fe',
    }).setOrigin(0.5);

    // Draw Jez & Mae
    const gfxJez = this.add.graphics();
    drawCharacter(gfxJez, 'jez', WIDTH / 2 - 80, HEIGHT - 60, 1);
    const gfxMae = this.add.graphics();
    drawCharacter(gfxMae, 'mae', WIDTH / 2 + 80, HEIGHT - 60, 1);

    // Idle float animation
    this.tweens.add({ targets: gfxJez, y: -8, duration: 1800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.tweens.add({ targets: gfxMae, y: -8, duration: 2000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: 400 });

    // Heart between them
    const heart = this.add.text(WIDTH / 2, HEIGHT - 100, '💕', { fontSize: '28px' }).setOrigin(0.5);
    this.tweens.add({ targets: heart, scaleX: 1.3, scaleY: 1.3, duration: 1200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    // Start button
    const btn = this.add.text(WIDTH / 2, HEIGHT - 40, '▶  Press SPACE or click to start', {
      fontFamily: 'monospace', fontSize: '16px', color: '#ffffff', alpha: 0.8,
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.tweens.add({ targets: btn, alpha: 0.3, duration: 900, yoyo: true, repeat: -1 });

    const start = () => {
      this.sound.play('music-title', { loop: false, volume: 0.5 });
      this.scene.start('WorldMap');
    };
    btn.on('pointerdown', start);
    this.input.keyboard.once('keydown-SPACE', start);

    // Play title music
    if (!this.sound.get('music-title')) {
      this.sound.play('music-title', { loop: true, volume: 0.4 });
    }
  }
}
```

- [ ] **Step 3: Update `src/main.js` — only import scenes that exist so far**

```js
// src/main.js  (will be expanded in Task 13 once all scenes exist)
import Phaser from 'phaser';
import { WIDTH, HEIGHT } from './constants.js';
import { BootScene } from './scenes/BootScene.js';
import { TitleScene } from './scenes/TitleScene.js';

const config = {
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
  backgroundColor: '#0d0d1a',
  scene: [BootScene, TitleScene],
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 600 }, debug: false },
  },
};

new Phaser.Game(config);
```

> **Note:** After Task 13, update this file to import all scenes. The final version is shown in Task 13.

- [ ] **Step 4: Verify in browser**

```bash
npm run dev
```

Expected: Title screen shows "6 YEARS OF US", two floating blob characters, pulsing heart, blinking start text.

- [ ] **Step 5: Commit**

```bash
git add src/scenes/BootScene.js src/scenes/TitleScene.js src/main.js
git commit -m "feat: boot + title screen with animated characters"
```

---

## Task 5: WorldMapScene

**Files:**

- Create: `src/scenes/WorldMapScene.js`

- [ ] **Step 1: Create `src/scenes/WorldMapScene.js`**

```js
// src/scenes/WorldMapScene.js
import { WIDTH, HEIGHT, COLORS, CHAPTERS } from '../constants.js';
import { chapterManager } from '../utils/ChapterManager.js';

export class WorldMapScene extends Phaser.Scene {
  constructor() { super({ key: 'WorldMap' }); }

  create() {
    // Background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0d0d1a, 0x0d0d1a, 0x1a1a2e, 0x1a1a2e, 1);
    bg.fillRect(0, 0, WIDTH, HEIGHT);

    this.add.text(WIDTH / 2, 40, 'YOUR JOURNEY', {
      fontFamily: 'monospace', fontSize: '22px', color: '#FF6B9D',
    }).setOrigin(0.5);

    const currentIdx = chapterManager.currentIndex();

    // Draw chapter nodes in a winding path
    const positions = [
      [100, 360], [220, 300], [340, 340], [460, 260],
      [540, 320], [620, 250], [680, 300], [760, 200],
    ];

    // Draw connecting lines first
    for (let i = 0; i < positions.length - 1; i++) {
      const line = this.add.graphics();
      line.lineStyle(3, i < currentIdx ? COLORS.JEZ : 0x333355);
      line.beginPath();
      line.moveTo(positions[i][0], positions[i][1]);
      line.lineTo(positions[i + 1][0], positions[i + 1][1]);
      line.strokePath();
    }

    // Draw nodes
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
    const key = chapterManager.currentSceneKey();
    const type = CHAPTERS[index].type;
    if (type === 'cutscene') {
      this.scene.start('Cutscene', { chapterKey: key });
    } else {
      this.scene.start(key);
    }
  }
}
```

- [ ] **Step 2: Verify in browser**

Start the game, press SPACE on the title. Expected: World map shows numbered chapter dots connected by a path. Chapter 1 dot pulses.

- [ ] **Step 3: Commit**

```bash
git add src/scenes/WorldMapScene.js
git commit -m "feat: world map scene with chapter progress path"
```

---

## Task 6: CutsceneScene + Chapter 1 Config

**Files:**

- Create: `src/scenes/cutscenes/CutsceneScene.js`
- Create: `src/scenes/cutscenes/chapter1Config.js`
- Create: `tests/CutsceneScene.test.js`

- [ ] **Step 1: Write the failing test**

```js
// tests/CutsceneScene.test.js
import { buildPanels } from '../src/scenes/cutscenes/CutsceneScene.js';

test('buildPanels returns array of panel objects', () => {
  const panels = buildPanels([{ text: 'Hello', bg: 0x000000 }]);
  expect(Array.isArray(panels)).toBe(true);
  expect(panels[0].text).toBe('Hello');
});

test('buildPanels preserves all fields', () => {
  const input = [{ text: 'A', bg: 0x111111, emoji: '💕' }];
  const panels = buildPanels(input);
  expect(panels[0].emoji).toBe('💕');
  expect(panels[0].bg).toBe(0x111111);
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- --testPathPattern=CutsceneScene
```

Expected: FAIL

- [ ] **Step 3: Create `src/scenes/cutscenes/CutsceneScene.js`**

```js
// src/scenes/cutscenes/CutsceneScene.js
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
    this.sound.stopAll();
    this.sound.play('music-cutscene', { loop: true, volume: 0.4 });
    this._showPanel();

    // Click or SPACE advances
    this.input.on('pointerdown', () => this._next());
    this.input.keyboard.on('keydown-SPACE', () => this._next());
  }

  _showPanel() {
    this.children.removeAll(true);
    const panel = this._panels[this._index];
    if (!panel) { this._finish(); return; }

    // Background
    const bg = this.add.graphics();
    bg.fillStyle(panel.bg ?? 0x0d0d1a);
    bg.fillRect(0, 0, WIDTH, HEIGHT);

    // Emoji / illustration (large centered)
    if (panel.emoji) {
      this.add.text(WIDTH / 2, HEIGHT / 2 - 60, panel.emoji, {
        fontSize: '80px',
      }).setOrigin(0.5);
    }

    // Text
    this.add.text(WIDTH / 2, HEIGHT / 2 + 60, panel.text ?? '', {
      fontFamily: 'Georgia, serif', fontSize: '20px', color: '#ffffff',
      align: 'center', wordWrap: { width: WIDTH - 80 },
    }).setOrigin(0.5);

    // Sub text
    if (panel.sub) {
      this.add.text(WIDTH / 2, HEIGHT / 2 + 110, panel.sub, {
        fontFamily: 'monospace', fontSize: '13px', color: '#aaaacc',
        align: 'center', wordWrap: { width: WIDTH - 80 },
      }).setOrigin(0.5);
    }

    // Progress dots
    this._panels.forEach((_, i) => {
      const dot = this.add.circle(
        WIDTH / 2 - (this._panels.length - 1) * 8 + i * 16,
        HEIGHT - 24,
        4,
        i === this._index ? 0xFF6B9D : 0x444466,
      );
    });

    // Hint
    this.add.text(WIDTH - 16, HEIGHT - 16, 'click / SPACE ▶', {
      fontFamily: 'monospace', fontSize: '11px', color: '#555577',
    }).setOrigin(1, 1);

    // Fade in
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
```

- [ ] **Step 4: Create `src/scenes/cutscenes/chapter1Config.js`**

```js
// src/scenes/cutscenes/chapter1Config.js
export const chapter1Config = [
  {
    bg: 0x050510,
    emoji: '💻',
    text: '2020. The world stopped.',
    sub: 'But the internet never did.',
  },
  {
    bg: 0x080818,
    emoji: '📱',
    text: '"Hi." · "Hi." · "...Hi."',
    sub: 'Two strangers. Two screens. One Wi-Fi signal.',
  },
  {
    bg: 0x0a0a20,
    emoji: '💬',
    text: 'Messages turned into hours.\nHours turned into everything.',
    sub: 'Jez and Mae — quarantine quest, chapter one.',
  },
  {
    bg: 0x0d0d1a,
    emoji: '💕',
    text: 'Somewhere in Mindanao and Manila,\ntwo hearts started to sync.',
    sub: 'And neither of them saw it coming.',
  },
];
```

- [ ] **Step 5: Create stub configs (Chapter 4 & 7) so imports don't break**

```js
// src/scenes/cutscenes/chapter4Config.js
export const chapter4Config = [
  { bg: 0x0a1020, emoji: '🗺️', text: 'Manila ↔ Mindanao', sub: 'The map never felt so big.' },
  { bg: 0x0a1020, emoji: '💌', text: 'But love letters travel faster than flights.', sub: '...right?' },
];
```

```js
// src/scenes/cutscenes/chapter7Config.js
export const chapter7Config = [
  { bg: 0x0d0d1a, emoji: '✨', text: 'Year 1. Year 2. Year 3.', sub: 'Year 4. Year 5. Year 6.' },
  { bg: 0x0d0d1a, emoji: '💕', text: 'And just like that…', sub: '6 years.' },
];
```

- [ ] **Step 6: Run tests**

```bash
npm test -- --testPathPattern=CutsceneScene
```

Expected: PASS (2 tests)

- [ ] **Step 7: Verify in browser** — click Chapter 1 on world map. Expected: dark panels with emojis, text, click to advance, returns to world map.

- [ ] **Step 8: Commit**

```bash
git add src/scenes/cutscenes/ tests/CutsceneScene.test.js
git commit -m "feat: cutscene system + chapter 1 quarantine quest"
```

---

## Task 7: BaseLevel (shared platformer scaffolding)

**Files:**

- Create: `src/scenes/levels/BaseLevel.js`
- Create: `src/ui/HUD.js`
- Create: `src/utils/AudioManager.js`

- [ ] **Step 1: Create `src/utils/AudioManager.js`**

```js
// src/utils/AudioManager.js
export class AudioManager {
  constructor(scene) {
    this._scene = scene;
  }

  playMusic(key) {
    this._scene.sound.stopAll();
    this._scene.sound.play(key, { loop: true, volume: 0.4 });
  }

  sfx(key) {
    this._scene.sound.play(key, { volume: 0.6 });
  }
}
```

- [ ] **Step 2: Create `src/ui/HUD.js`**

```js
// src/ui/HUD.js
export class HUD {
  constructor(scene, total) {
    this._scene = scene;
    this._total = total;
    this._collected = 0;

    this._text = scene.add.text(16, 16, this._label(), {
      fontFamily: 'monospace', fontSize: '18px', color: '#ffffff',
      stroke: '#000', strokeThickness: 3,
    }).setScrollFactor(0).setDepth(10);
  }

  collect() {
    this._collected++;
    this._text.setText(this._label());
  }

  _label() {
    return `💕 ${this._collected} / ${this._total}`;
  }

  isComplete() {
    return this._collected >= this._total;
  }
}
```

- [ ] **Step 3: Create `src/scenes/levels/BaseLevel.js`**

```js
// src/scenes/levels/BaseLevel.js
import { WIDTH, HEIGHT, COLORS } from '../../constants.js';
import { drawCharacter } from '../../characters/drawCharacter.js';
import { chapterManager } from '../../utils/ChapterManager.js';
import { HUD } from '../../ui/HUD.js';
import { AudioManager } from '../../utils/AudioManager.js';

export class BaseLevel extends Phaser.Scene {
  // Subclasses set these before calling super.create()
  _collectibleCount = 5;
  _levelWidth = WIDTH * 3;

  create() {
    this.audio = new AudioManager(this);
    this.audio.playMusic('music-level');

    // Tilemap ground
    this._buildGround();

    // Player (Jez)
    this._playerGfx = this.add.graphics();
    this._player = this.physics.add.image(120, HEIGHT - 120, '__DEFAULT');
    this._player.setVisible(false).setCollideWorldBounds(true);
    this._player.body.setSize(36, 70).setOffset(0, 0);

    // Draw Jez on update
    this._redrawPlayer();

    // Camera follows player
    this.cameras.main.setBounds(0, 0, this._levelWidth, HEIGHT);
    this.cameras.main.startFollow(this._player, true, 0.1, 0.1);
    this.physics.world.setBounds(0, 0, this._levelWidth, HEIGHT);

    // Cursors
    this._cursors = this.input.keyboard.createCursorKeys();

    // HUD
    this.hud = new HUD(this, this._collectibleCount);

    // Goal zone (subclass positions it)
    this._goalX = this._levelWidth - 120;
    this._goalReached = false;

    this._buildLevel();
  }

  _buildGround() {
    // Static group of ground tiles
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
  }

  _buildLevel() {
    // Subclasses override to add platforms, collectibles, goal
  }

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

    // Check goal
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
    body.setVisible(false).body.setSize(width, 20).setOffset(-width / 2, -10);
    body.refreshBody();
    this.physics.add.collider(this._player, body);
    return body;
  }

  _addCollectible(x, y, emoji = '💕') {
    const text = this.add.text(x, y, emoji, { fontSize: '24px' }).setOrigin(0.5);
    this.tweens.add({ targets: text, y: y - 8, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    // Overlap check via physics zone
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
```

- [ ] **Step 4: Verify (no direct test — tested via chapter scenes)**

```bash
npm run dev
```

Expected: No errors in console. World map still works.

- [ ] **Step 5: Commit**

```bash
git add src/scenes/levels/BaseLevel.js src/ui/HUD.js src/utils/AudioManager.js
git commit -m "feat: base level scaffolding, HUD, audio manager"
```

---

## Task 8: Chapter 2 — First Flight (Playable)

**Files:**

- Create: `src/scenes/levels/Chapter2Scene.js`

- [ ] **Step 1: Create `src/scenes/levels/Chapter2Scene.js`**

```js
// src/scenes/levels/Chapter2Scene.js
import { BaseLevel } from './BaseLevel.js';
import { WIDTH, HEIGHT, COLORS } from '../../constants.js';
import { drawCharacter } from '../../characters/drawCharacter.js';

export class Chapter2Scene extends BaseLevel {
  constructor() { super({ key: 'Chapter2' }); }

  create() {
    this._collectibleCount = 5;
    this._levelWidth = WIDTH * 4;
    super.create();

    // Airport sky — light blue
    this.cameras.main.setBackgroundColor('#c9e8f5');

    // Title card
    const title = this.add.text(WIDTH / 2, 40, '✈️  Chapter 2: First Flight', {
      fontFamily: 'Georgia, serif', fontSize: '20px', color: '#1a1a3e',
      stroke: '#fff', strokeThickness: 2,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(10);
    this.time.delayedCall(3000, () => { this.tweens.add({ targets: title, alpha: 0, duration: 500 }); });
  }

  _buildLevel() {
    // Moving walkways (platforms with horizontal movement)
    this._addPlatform(300, HEIGHT - 160, 140);
    this._addPlatform(600, HEIGHT - 220, 120);
    this._addPlatform(900, HEIGHT - 160, 140);
    this._addPlatform(1200, HEIGHT - 240, 100);
    this._addPlatform(1500, HEIGHT - 180, 130);
    this._addPlatform(1800, HEIGHT - 140, 150);
    this._addPlatform(2200, HEIGHT - 200, 120);
    this._addPlatform(2500, HEIGHT - 160, 140);
    this._addPlatform(2800, HEIGHT - 220, 100);

    // Collectibles — boarding passes / hearts
    this._addCollectible(400, HEIGHT - 200, '🎫');
    this._addCollectible(700, HEIGHT - 270, '💕');
    this._addCollectible(1000, HEIGHT - 200, '🎫');
    this._addCollectible(1600, HEIGHT - 230, '💕');
    this._addCollectible(2300, HEIGHT - 250, '🎫');

    // Mae waiting at arrival gate
    const maeGfx = this.add.graphics();
    drawCharacter(maeGfx, 'mae', this._goalX, HEIGHT - 64, 1);

    // Welcome sign
    this.add.text(this._goalX, HEIGHT - 145, '💜 WELCOME JEZ! 💜', {
      fontFamily: 'monospace', fontSize: '12px', color: '#ffffff',
      backgroundColor: '#7E22CE', padding: { x: 8, y: 4 },
    }).setOrigin(0.5);
  }
}
```

- [ ] **Step 2: Verify in browser**

Navigate to Chapter 2 from the world map. Expected: airport level, Jez can run and jump, 5 boarding passes / hearts to collect, Mae waits at the end.

- [ ] **Step 3: Commit**

```bash
git add src/scenes/levels/Chapter2Scene.js
git commit -m "feat: chapter 2 — first flight playable level"
```

---

## Task 9: Chapter 3 — Baguio Quest (Playable)

**Files:**

- Create: `src/scenes/levels/Chapter3Scene.js`

- [ ] **Step 1: Create `src/scenes/levels/Chapter3Scene.js`**

```js
// src/scenes/levels/Chapter3Scene.js
import { BaseLevel } from './BaseLevel.js';
import { WIDTH, HEIGHT, COLORS } from '../../constants.js';
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
    this.time.delayedCall(3000, () => { this.tweens.add({ targets: title, alpha: 0, duration: 500 }); });
  }

  _buildLevel() {
    // Mountain-style rising platforms
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

    // Collectibles — strawberries and flowers
    this._addCollectible(300,  HEIGHT - 190, '🍓');
    this._addCollectible(520,  HEIGHT - 240, '🌸');
    this._addCollectible(720,  HEIGHT - 250, '🍓');
    this._addCollectible(1150, HEIGHT - 310, '🌸');
    this._addCollectible(1650, HEIGHT - 330, '🍓');
    this._addCollectible(2150, HEIGHT - 350, '🌸');

    // Mae companion (follows at offset)
    this._maeGfx = this.add.graphics();
    drawCharacter(this._maeGfx, 'mae', this._player.x - 70, this._player.y, 0.85);
  }

  update() {
    super.update();
    // Mae follows Jez with a delay
    if (this._maeGfx) {
      this._maeGfx.clear();
      const targetX = this._player.x - 70;
      this._maeGfx.x += (targetX - this._maeGfx.x) * 0.08;
      drawCharacter(this._maeGfx, 'mae', 0, this._player.y, 0.85);
    }
  }
}
```

- [ ] **Step 2: Verify in browser**

Chapter 3: green mountain level, Mae follows behind Jez, strawberries and flowers to collect.

- [ ] **Step 3: Commit**

```bash
git add src/scenes/levels/Chapter3Scene.js
git commit -m "feat: chapter 3 — baguio quest with Mae companion"
```

---

## Task 10: Chapter 4 & 7 Cutscene Configs (detailed)

**Files:**

- Modify: `src/scenes/cutscenes/chapter4Config.js`
- Modify: `src/scenes/cutscenes/chapter7Config.js`

- [ ] **Step 1: Replace chapter4Config with full panels**

```js
// src/scenes/cutscenes/chapter4Config.js
export const chapter4Config = [
  {
    bg: 0x080c18,
    emoji: '🗺️',
    text: 'Chapter 4: Long Distance',
    sub: 'Manila ↔ Mindanao',
  },
  {
    bg: 0x080c18,
    emoji: '📍',
    text: 'Two dots on a map.\nOne in the city. One back home.',
    sub: 'The distance felt enormous.',
  },
  {
    bg: 0x0a0e1e,
    emoji: '💌',
    text: '"Good morning."\n"Good night."\n"I miss you."',
    sub: 'Every day. Without fail.',
  },
  {
    bg: 0x0d1020,
    emoji: '📱',
    text: 'Video calls at 2am.\nLaughing at nothing.\nJust to hear each other.',
    sub: 'This is what love looks like across islands.',
  },
  {
    bg: 0x0d0d1a,
    emoji: '💜',
    text: 'Distance is just a number.',
    sub: 'But the wait? That part was real.',
  },
];
```

- [ ] **Step 2: Replace chapter7Config with full panels**

```js
// src/scenes/cutscenes/chapter7Config.js
export const chapter7Config = [
  {
    bg: 0x0d0d1a,
    emoji: '💫',
    text: 'Year 1.',
    sub: 'That first meeting. The hotel. The hug that said everything.',
  },
  {
    bg: 0x0d0d1a,
    emoji: '🌲',
    text: 'Year 2.',
    sub: 'Baguio. Strawberries. Pine trees. The beginning.',
  },
  {
    bg: 0x0d0d1a,
    emoji: '✈️',
    text: 'Year 3.',
    sub: 'Back and forth. Flights and farewells.',
  },
  {
    bg: 0x0d0d1a,
    emoji: '🏠',
    text: 'Year 4.',
    sub: 'Finally. One city. One home. One key.',
  },
  {
    bg: 0x0d0d1a,
    emoji: '🍜',
    text: 'Year 5.',
    sub: 'Eating out. Staying in. Everyday quests.',
  },
  {
    bg: 0x0d0d1a,
    emoji: '✨',
    text: 'Year 6.',
    sub: 'And just like that…',
  },
  {
    bg: 0x0d0d1a,
    emoji: '💕',
    text: '6 years.',
    sub: 'Happy anniversary, Mae. 🩷💜',
  },
];
```

- [ ] **Step 3: Verify both cutscenes in browser** — navigate to Chapter 4 and Chapter 7 from world map, advance all panels.

- [ ] **Step 4: Commit**

```bash
git add src/scenes/cutscenes/chapter4Config.js src/scenes/cutscenes/chapter7Config.js
git commit -m "feat: detailed cutscene content for chapters 4 and 7"
```

---

## Task 11: Chapter 5 — The Grind (Auto-Runner)

**Files:**

- Create: `src/scenes/levels/Chapter5Scene.js`

- [ ] **Step 1: Create `src/scenes/levels/Chapter5Scene.js`**

```js
// src/scenes/levels/Chapter5Scene.js
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

    // Background
    this.add.rectangle(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, 0x1a1a2e);

    // Divider line
    this.add.line(WIDTH / 2, HEIGHT / 2, 0, -HEIGHT / 2, 0, HEIGHT / 2, 0x333355, 1);

    // Labels
    this.add.text(WIDTH / 4, 20, '🩷 JEZ', { fontFamily: 'monospace', fontSize: '14px', color: '#FF6B9D' }).setOrigin(0.5);
    this.add.text(WIDTH * 3 / 4, 20, '💜 MAE', { fontFamily: 'monospace', fontSize: '14px', color: '#A855F7' }).setOrigin(0.5);

    // Progress bar
    this._barBg = this.add.rectangle(WIDTH / 2, 55, WIDTH - 40, 20, 0x222244).setOrigin(0.5);
    this._bar = this.add.rectangle(20, 55, 0, 16, 0xFF6B9D).setOrigin(0, 0.5);
    this.add.text(WIDTH / 2, 55, 'MANILA FUND', { fontFamily: 'monospace', fontSize: '10px', color: '#aaaacc' }).setOrigin(0.5).setDepth(1);

    // Ground (simple line)
    this.add.rectangle(WIDTH / 4, HEIGHT - 40, WIDTH / 2 - 20, 12, COLORS.GROUND);
    this.add.rectangle(WIDTH * 3 / 4, HEIGHT - 40, WIDTH / 2 - 20, 12, COLORS.GROUND);

    // Players (physics bodies)
    this._jezBody = this.physics.add.image(WIDTH / 4, HEIGHT - 80, '__DEFAULT').setVisible(false);
    this._jezBody.body.setSize(36, 60).setAllowGravity(false);
    this._jezGfx = this.add.graphics();

    this._maeBody = this.physics.add.image(WIDTH * 3 / 4, HEIGHT - 80, '__DEFAULT').setVisible(false);
    this._maeBody.body.setSize(36, 60).setAllowGravity(false);
    this._maeGfx = this.add.graphics();

    // Collectibles pool
    this._coins = this.physics.add.group();
    this._obstacles = this.physics.add.group();

    this._spawnTimer = this.time.addEvent({ delay: 900, callback: this._spawn, callbackScope: this, loop: true });

    this._cursors = this.input.keyboard.createCursorKeys();

    this._redraw();

    const title = this.add.text(WIDTH / 2, HEIGHT / 2, '💼  Chapter 5: The Grind', {
      fontFamily: 'Georgia, serif', fontSize: '20px', color: '#ffffff',
      stroke: '#000', strokeThickness: 2,
    }).setOrigin(0.5).setDepth(10);
    this.time.delayedCall(2500, () => { this.tweens.add({ targets: title, alpha: 0, duration: 500 }); });
  }

  _spawn() {
    const laneX = [WIDTH / 4, WIDTH * 3 / 4];
    laneX.forEach((x) => {
      if (Math.random() > 0.35) {
        const coin = this._coins.create(x + Phaser.Math.Between(-60, 60), -20, '__DEFAULT');
        coin.setVisible(false).body.setSize(20, 20).setAllowGravity(false);
        coin.setVelocityY(this._speed);
        const emoji = this.add.text(coin.x, coin.y, '💰', { fontSize: '22px' }).setOrigin(0.5);
        coin._emoji = emoji;
      } else {
        const obs = this._obstacles.create(x + Phaser.Math.Between(-50, 50), -20, '__DEFAULT');
        obs.setVisible(false).body.setSize(24, 24).setAllowGravity(false);
        obs.setVelocityY(this._speed * 0.8);
        const emoji = this.add.text(obs.x, obs.y, '📄', { fontSize: '22px' }).setOrigin(0.5);
        obs._emoji = emoji;
      }
    });
  }

  update() {
    // Move Jez left/right (left half only)
    const dx = this._cursors.left.isDown ? -180 : this._cursors.right.isDown ? 180 : 0;
    this._jezBody.setVelocityX(dx);
    this._jezBody.x = Phaser.Math.Clamp(this._jezBody.x, 20, WIDTH / 2 - 20);

    // Mae mirrors on right side (AI: tracks nearest coin)
    const nearestCoin = this._coins.getChildren()
      .filter(c => c.x > WIDTH / 2)
      .sort((a, b) => Phaser.Math.Distance.Between(a.x, a.y, this._maeBody.x, this._maeBody.y) -
                      Phaser.Math.Distance.Between(b.x, b.y, this._maeBody.x, this._maeBody.y))[0];
    if (nearestCoin) {
      const dir = nearestCoin.x < this._maeBody.x ? -160 : 160;
      this._maeBody.setVelocityX(dir);
    } else {
      this._maeBody.setVelocityX(0);
    }
    this._maeBody.x = Phaser.Math.Clamp(this._maeBody.x, WIDTH / 2 + 20, WIDTH - 20);

    // Update emoji positions
    [...this._coins.getChildren(), ...this._obstacles.getChildren()].forEach(obj => {
      if (obj._emoji) { obj._emoji.x = obj.x; obj._emoji.y = obj.y; }
      if (obj.y > HEIGHT) { if (obj._emoji) obj._emoji.destroy(); obj.destroy(); }
    });

    // Collect coins
    this._coins.getChildren().forEach(coin => {
      const targets = [this._jezBody, this._maeBody];
      targets.forEach(player => {
        if (Phaser.Math.Distance.Between(coin.x, coin.y, player.x, player.y) < 30) {
          if (coin._emoji) coin._emoji.destroy();
          coin.destroy();
          this._fund++;
          this.audio.sfx('sfx-collect');
          const barW = ((this._fund / FUND_TARGET) * (WIDTH - 40));
          this._bar.width = barW;
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
    this._spawnTimer.destroy();
    this.audio.sfx('sfx-complete');
    chapterManager.advance();
    this.cameras.main.fadeOut(600);
    this.time.delayedCall(650, () => this.scene.start('WorldMap'));
  }
}
```

- [ ] **Step 2: Verify in browser**

Chapter 5: split screen, Jez (left) moves with arrow keys, Mae (right) collects automatically, Manila Fund bar fills up, level completes at 20 coins.

- [ ] **Step 3: Commit**

```bash
git add src/scenes/levels/Chapter5Scene.js
git commit -m "feat: chapter 5 — the grind split-screen auto-runner"
```

---

## Task 12: Chapter 6 — Manila, Finally (Playable)

**Files:**

- Create: `src/scenes/levels/Chapter6Scene.js`

- [ ] **Step 1: Create `src/scenes/levels/Chapter6Scene.js`**

```js
// src/scenes/levels/Chapter6Scene.js
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

    const title = this.add.text(WIDTH / 2, 40, '🏠  Chapter 6: Manila, Finally', {
      fontFamily: 'Georgia, serif', fontSize: '20px', color: '#e9d5ff',
      stroke: '#000', strokeThickness: 2,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(10);
    this.time.delayedCall(3000, () => { this.tweens.add({ targets: title, alpha: 0, duration: 500 }); });
  }

  _buildLevel() {
    // City rooftops / apartments
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

    // Collectibles — keys, food, photos
    this._addCollectible(300,  HEIGHT - 200, '🔑');
    this._addCollectible(550,  HEIGHT - 250, '🍜');
    this._addCollectible(780,  HEIGHT - 300, '🔑');
    this._addCollectible(1050, HEIGHT - 230, '📸');
    this._addCollectible(1550, HEIGHT - 350, '🍜');
    this._addCollectible(2050, HEIGHT - 330, '📸');
    this._addCollectible(2850, HEIGHT - 350, '🔑');

    // Mae companion (follows)
    this._maeGfx = this.add.graphics();

    // Goal: front door of their apartment
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
      const maeX = this._player.x - 70;
      drawCharacter(this._maeGfx, 'mae', maeX, this._player.y, 0.85);
    }
  }
}
```

- [ ] **Step 2: Verify in browser** — city level (dark purple sky), Mae follows, 7 collectibles, apartment door at end.

- [ ] **Step 3: Commit**

```bash
git add src/scenes/levels/Chapter6Scene.js
git commit -m "feat: chapter 6 — manila finally city level"
```

---

## Task 13: Chapter 8 — The Final Quest (Cliffhanger)

**Files:**

- Create: `src/scenes/levels/Chapter8Scene.js`

- [ ] **Step 1: Create `src/scenes/levels/Chapter8Scene.js`**

```js
// src/scenes/levels/Chapter8Scene.js
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
    this.time.delayedCall(3000, () => { this.tweens.add({ targets: title, alpha: 0, duration: 500 }); });
  }

  _buildLevel() {
    // Golden glowing platforms
    this._addPlatform(200,  HEIGHT - 160, 120);
    this._addPlatform(420,  HEIGHT - 220, 100);
    this._addPlatform(640,  HEIGHT - 280, 120);
    this._addPlatform(880,  HEIGHT - 220, 100);
    this._addPlatform(1100, HEIGHT - 280, 120);
    this._addPlatform(1350, HEIGHT - 200, 100);
    this._addPlatform(1600, HEIGHT - 240, 120);

    // The chest at the end
    const chestX = this._goalX;
    this._chest = this.add.text(chestX, HEIGHT - 90, '📦', { fontSize: '48px' }).setOrigin(0.5);
    this.tweens.add({ targets: this._chest, y: HEIGHT - 100, duration: 1000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    // Golden glow around goal
    const glow = this.add.graphics();
    glow.fillStyle(0xffd700, 0.12);
    glow.fillCircle(chestX, HEIGHT - 100, 80);
  }

  _onLevelComplete() {
    // Override — do the cliffhanger instead of going to world map
    this._chest.setText('💍');
    this.time.delayedCall(400, () => this._playCliffhanger());
  }

  _playCliffhanger() {
    this.sound.stopAll();
    this.sound.play('music-cliffhanger', { volume: 0.5 });

    // Ring floats up
    const ring = this.add.text(this._goalX, HEIGHT - 90, '💍', {
      fontSize: '60px',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(20);

    // Reposition relative to camera
    ring.x = WIDTH / 2;
    ring.y = HEIGHT / 2;

    this.tweens.add({
      targets: ring,
      y: HEIGHT / 2 - 60,
      scaleX: 1.4, scaleY: 1.4,
      duration: 1800,
      ease: 'Sine.easeOut',
    });

    // Screen glows white
    this.time.delayedCall(2000, () => {
      this.cameras.main.flash(1000, 255, 255, 255, false);
    });

    // Fade to black
    this.time.delayedCall(3200, () => {
      this.cameras.main.fadeOut(1200, 0, 0, 0);
    });

    // Show "???"
    this.time.delayedCall(4500, () => {
      const q = this.add.text(WIDTH / 2, HEIGHT / 2, '???', {
        fontFamily: 'Georgia, serif', fontSize: '64px', color: '#fcd34d',
        stroke: '#000', strokeThickness: 3,
      }).setOrigin(0.5).setScrollFactor(0).setDepth(30).setAlpha(0);
      this.tweens.add({ targets: q, alpha: 1, duration: 800 });
    });

    // "To be continued…"
    this.time.delayedCall(6000, () => {
      const tbc = this.add.text(WIDTH / 2, HEIGHT / 2 + 70, 'To be continued…', {
        fontFamily: 'Georgia, serif', fontSize: '28px', color: '#ffffff',
      }).setOrigin(0.5).setScrollFactor(0).setDepth(30).setAlpha(0);
      this.tweens.add({ targets: tbc, alpha: 1, duration: 1000 });
    });

    // Credit
    this.time.delayedCall(8500, () => {
      const credit = this.add.text(WIDTH / 2, HEIGHT - 50, '💕  Happy 6th Anniversary, Mae  💕', {
        fontFamily: 'Georgia, serif', fontSize: '18px', color: '#FF6B9D',
      }).setOrigin(0.5).setScrollFactor(0).setDepth(30).setAlpha(0);
      this.tweens.add({ targets: credit, alpha: 1, duration: 1500 });
    });
  }
}
```

- [ ] **Step 2: Update `src/main.js` with all scene imports**

```js
// src/main.js — final version with all scenes registered
import Phaser from 'phaser';
import { WIDTH, HEIGHT } from './constants.js';
import { BootScene } from './scenes/BootScene.js';
import { TitleScene } from './scenes/TitleScene.js';
import { WorldMapScene } from './scenes/WorldMapScene.js';
import { CutsceneScene } from './scenes/cutscenes/CutsceneScene.js';
import { Chapter2Scene } from './scenes/levels/Chapter2Scene.js';
import { Chapter3Scene } from './scenes/levels/Chapter3Scene.js';
import { Chapter5Scene } from './scenes/levels/Chapter5Scene.js';
import { Chapter6Scene } from './scenes/levels/Chapter6Scene.js';
import { Chapter8Scene } from './scenes/levels/Chapter8Scene.js';

const config = {
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
  backgroundColor: '#0d0d1a',
  scene: [
    BootScene, TitleScene, WorldMapScene,
    CutsceneScene,
    Chapter2Scene, Chapter3Scene, Chapter5Scene, Chapter6Scene, Chapter8Scene,
  ],
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 600 }, debug: false },
  },
};

new Phaser.Game(config);
```

- [ ] **Step 3: Verify full game flow in browser**

Play through every chapter in order: Title → World Map → Ch1 → Ch2 → Ch3 → Ch4 → Ch5 → Ch6 → Ch7 → Ch8 → "To be continued…"

Expected: No console errors, all chapters reachable, cliffhanger plays correctly.

- [ ] **Step 4: Commit**

```bash
git add src/scenes/levels/Chapter8Scene.js src/main.js
git commit -m "feat: chapter 8 — final quest cliffhanger with ring reveal, all scenes wired"
```

---

## Task 14: Audio Files + Final Polish

**Files:**

- Create: `assets/audio/README.md` (instructions for sourcing audio)
- Modify: `index.html` (add favicon / page title polish)

- [ ] **Step 1: Download free audio tracks**

Recommended sources (all CC0 / royalty-free):
- `assets/audio/title.mp3` — search "lofi love chiptune" on freesound.org
- `assets/audio/level.mp3` — upbeat chiptune platformer track
- `assets/audio/cutscene.mp3` — slow, gentle piano/lofi
- `assets/audio/cliffhanger.mp3` — mysterious, building tension
- `assets/audio/jump.mp3` — Kenney audio pack: `jump_003.ogg` (rename to .mp3)
- `assets/audio/collect.mp3` — Kenney audio pack: `coin_000.ogg`
- `assets/audio/complete.mp3` — Kenney audio pack: `confirmation_002.ogg`

Kenney audio packs: `https://kenney.nl/assets/category:Audio`

- [ ] **Step 2: Create audio fallback in BootScene (handle missing files gracefully)**

In `src/scenes/BootScene.js`, wrap audio loads with error handling:

```js
// Replace the audio preload block with:
preload() {
  this.load.spritesheet('tiles', 'assets/kenney/tilemap.png', {
    frameWidth: 64, frameHeight: 64,
  });

  const audioFiles = [
    ['music-title', 'assets/audio/title.mp3'],
    ['music-level', 'assets/audio/level.mp3'],
    ['music-cutscene', 'assets/audio/cutscene.mp3'],
    ['music-cliffhanger', 'assets/audio/cliffhanger.mp3'],
    ['sfx-jump', 'assets/audio/jump.mp3'],
    ['sfx-collect', 'assets/audio/collect.mp3'],
    ['sfx-complete', 'assets/audio/complete.mp3'],
  ];

  audioFiles.forEach(([key, path]) => this.load.audio(key, path));

  this.load.on('loaderror', (file) => {
    console.warn(`Asset not found: ${file.key} — continuing without it`);
  });
}
```

- [ ] **Step 3: Run all tests**

```bash
npm test
```

Expected: All tests pass (ChapterManager × 5, drawCharacter × 3, CutsceneScene × 2 = 10 total)

- [ ] **Step 4: Build for production**

```bash
npm run build
```

Expected: `dist/` folder created with `index.html` + bundled assets. Open `dist/index.html` directly — game works offline.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: audio integration, production build verified"
```

---

## Task 15: Deploy

- [ ] **Step 1: Host on GitHub Pages or Netlify**

**Option A — Netlify (easiest):**

```bash
# Drag and drop the dist/ folder to https://app.netlify.com/drop
# You get a shareable URL immediately — no account needed
```

**Option B — GitHub Pages:**

```bash
git init  # (already done)
# Push to GitHub, then in repo Settings → Pages → deploy from /dist branch
```

- [ ] **Step 2: Test the live URL** — open on a different browser/device, play through all 8 chapters.

- [ ] **Step 3: Share the link with Mae 💕**

---

## Quick Reference

| Command | What it does |
| --- | --- |
| `npm run dev` | Start local dev server |
| `npm test` | Run Jest tests |
| `npm run build` | Build to `dist/` for deployment |
| Arrow keys | Move Jez |
| Space / Up | Jump |
| Space / Click | Advance cutscene panels |
