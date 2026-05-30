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

export function drawCharacter(gfx, who, x, y, scale = 1) {
  const cfg = getCharacterConfig(who);
  const s = scale;

  gfx.fillStyle(cfg.bodyColor);
  gfx.fillEllipse(x - 22 * s, y - 30 * s, 18 * s, 13 * s);
  gfx.fillEllipse(x + 22 * s, y - 30 * s, 18 * s, 13 * s);
  gfx.fillEllipse(x, y - 15 * s, 38 * s, 30 * s);
  gfx.fillEllipse(x - 13 * s, y - 2 * s, 20 * s, 12 * s);
  gfx.fillEllipse(x + 13 * s, y - 2 * s, 20 * s, 12 * s);

  gfx.fillStyle(cfg.bodyColor);
  gfx.fillCircle(x, y - 52 * s, 38 * s);
  gfx.lineStyle(7 * s, COLORS.HELMET_RING);
  gfx.strokeCircle(x, y - 52 * s, 30 * s);

  gfx.fillStyle(COLORS.VISOR);
  gfx.fillCircle(x, y - 52 * s, 23 * s);

  gfx.fillStyle(0x1a1a1a);
  gfx.fillEllipse(x - 9 * s, y - 52 * s, 10 * s, 11 * s);
  gfx.fillEllipse(x + 9 * s, y - 52 * s, 10 * s, 11 * s);

  gfx.fillStyle(0xffffff);
  gfx.fillCircle(x - 7 * s, y - 55 * s, 2.5 * s);
  gfx.fillCircle(x + 11 * s, y - 55 * s, 2.5 * s);

  gfx.lineStyle(3 * s, 0x444444);
  gfx.beginPath();
  gfx.arc(x, y - 47 * s, 9 * s, 0.3, Math.PI - 0.3, false);
  gfx.strokePath();

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
