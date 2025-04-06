import { Assets, Container, Sprite, Text, Ticker } from "pixi.js";

export default class TrayUI {
  constructor(stage, letters, onLetterClick) {
    this.stage = stage;
    this.letters = letters;
    this.onLetterClick = onLetterClick;
    this.container = new Container();
    this.letterContainers = [];
    this.shuffleButton = null;
  }

  async init() {
    const circle = new Sprite(await Assets.load("/assets/circleWhite.png"));
    circle.anchor.set(0.5);
    circle.width = 180;
    circle.height = 180;
    circle.x = this.stage.width / 2;
    circle.y = this.stage.height - 150;
    circle.alpha = 0.5;
    this.container.addChild(circle);

    const centerX = circle.x;
    const centerY = circle.y;
    const radius = 60;

    for (let i = 0; i < this.letters.length; i++) {
      const char = this.letters[i];
      const angle = (i / this.letters.length) * Math.PI * 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      const container = new Container();
      container.x = x;
      container.y = y;
      container.eventMode = "static";
      container.cursor = "pointer";

      const letter = new Text(char, {
        fontFamily: "Arial",
        fontSize: 32,
        fill: 0xffa500,
        fontWeight: "bold",
      });
      letter.anchor.set(0.5);
      container.addChild(letter);

      container.on("pointerdown", () => {
        this.onLetterClick(char, container, letter);
      });

      this.container.addChild(container);
      this.letterContainers.push(container);
    }

    this.shuffleButton = new Sprite(await Assets.load("/assets/shuffle.png"));
    this.shuffleButton.anchor.set(0.5);
    this.shuffleButton.width = 40;
    this.shuffleButton.height = 40;
    this.shuffleButton.x = centerX;
    this.shuffleButton.y = centerY;
    this.shuffleButton.eventMode = "static";
    this.shuffleButton.cursor = "pointer";

    this.shuffleButton.on("pointerdown", () => {
      this.animateShuffle(this.shuffleButton);
      this.animateLettersShuffle();
    });

    this.container.addChild(this.shuffleButton);
    this.stage.addChild(this.container);
  }

  animateShuffle(sprite) {
    let rotation = 0;
    const fullTurn = Math.PI * 2;
    const step = 0.2;

    const ticker = new Ticker();
    ticker.add(() => {
      rotation += step;
      sprite.rotation = rotation;

      if (rotation >= fullTurn) {
        sprite.rotation = 0;
        ticker.stop();
        ticker.destroy();
      }
    });
    ticker.start();
  }

  animateLettersShuffle() {
    const centerX = this.stage.width / 2;
    const centerY = this.stage.height - 150;
    const radius = 60;

    const shuffled = [...this.letterContainers];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    shuffled.forEach((container, index) => {
      const angle = (index / shuffled.length) * Math.PI * 2;
      const targetX = centerX + radius * Math.cos(angle);
      const targetY = centerY + radius * Math.sin(angle);
      const startX = container.x;
      const startY = container.y;
      const duration = 20;
      let frame = 0;

      container.scale.set(0.8);

      const ticker = new Ticker();
      ticker.add(() => {
        frame++;
        const progress = frame / duration;

        container.x = startX + (targetX - startX) * progress;
        container.y = startY + (targetY - startY) * progress;

        if (progress < 0.5) {
          container.scale.set(0.8 + 0.2 * progress);
        } else {
          container.scale.set(1);
        }

        if (frame >= duration) {
          container.x = targetX;
          container.y = targetY;
          container.scale.set(1);
          ticker.stop();
          ticker.destroy();
        }
      });

      ticker.start();
    });

    this.letterContainers = shuffled;
  }

  getContainer() {
    return this.container;
  }
}
