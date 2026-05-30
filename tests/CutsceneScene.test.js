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
