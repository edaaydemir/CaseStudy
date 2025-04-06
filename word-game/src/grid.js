import { Assets, Sprite, Text, Ticker } from "pixi.js";

export default class Grid {
  constructor(stage) {
    this.stage = stage;
    this.tileSize = 75;
    this.padding = 3;
    this.origin = { x: 50, y: 50 };
    this.grid = [];
  }

  async drawGameGrid() {
    const texture = await Assets.load("/assets/rect.png");
    const positions = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
      { x: 0, y: 1 },
      { x: 2, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
    ];

    for (const pos of positions) {
      if (!this.grid[pos.y]) this.grid[pos.y] = [];

      const cell = new Sprite(texture);
      cell.width = this.tileSize - this.padding;
      cell.height = this.tileSize - this.padding;
      cell.x = this.origin.x + pos.x * this.tileSize + this.padding / 2;
      cell.y = this.origin.y + pos.y * this.tileSize + this.padding / 2;

      this.stage.addChild(cell);

      this.grid[pos.y][pos.x] = {
        sprite: cell,
        letter: null,
        bgSprite: null,
        letterSprite: null,
      };
    }
  }

  async placeWord(word, { x, y, dir }) {
    const bgTexture = await Assets.load("/assets/background.png");

    for (let i = 0; i < word.length; i++) {
      const posX = dir === "H" ? x + i : x;
      const posY = dir === "V" ? y + i : y;
      const cell = this.grid[posY]?.[posX];
      if (!cell || cell.letter) continue;

      const bg = new Sprite(bgTexture);
      bg.width = this.tileSize - this.padding;
      bg.height = this.tileSize - this.padding;
      bg.x = cell.sprite.x;
      bg.y = cell.sprite.y;
      this.stage.addChild(bg);

      const letter = new Text(word[i], {
        fontFamily: "Arial",
        fontSize: 28,
        fill: "#ffffff",
        fontWeight: "bold",
      });

      letter.anchor.set(0.5);
      letter.x = bg.x + (this.tileSize - this.padding) / 2;
      letter.y = bg.y + (this.tileSize - this.padding) / 2;
      this.stage.addChild(letter);

      cell.bgSprite = bg;
      cell.letterSprite = letter;
      cell.letter = word[i];

      this.animateCell(bg);
    }
  }

  animateCell(sprite) {
    let frame = 0;
    const totalFrames = 20;
    const originalScale = sprite.scale.x;

    const ticker = new Ticker();
    ticker.add(() => {
      frame++;
      const progress =
        frame <= totalFrames / 2
          ? frame / (totalFrames / 2)
          : (frame - totalFrames / 2) / (totalFrames / 2);

      const scaleAmount =
        0.05 * (frame <= totalFrames / 2 ? progress : 1 - progress);
      sprite.scale.set(originalScale + scaleAmount);

      if (frame >= totalFrames) {
        sprite.scale.set(originalScale);
        ticker.stop();
        ticker.destroy();
      }
    });

    ticker.start();
  }
}
