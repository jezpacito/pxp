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
