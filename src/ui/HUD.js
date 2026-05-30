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
  _label() { return `💕 ${this._collected} / ${this._total}`; }
  isComplete() { return this._collected >= this._total; }
}
