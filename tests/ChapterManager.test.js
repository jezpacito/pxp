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
