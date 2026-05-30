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
