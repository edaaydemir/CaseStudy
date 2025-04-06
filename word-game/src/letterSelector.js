import { Assets, Container, Sprite, Text, Ticker } from "pixi.js";

export default class LetterSelector {
  constructor(stage, onWordSubmit) {
    this.stage = stage;
    this.container = new Container();
    this.onWordSubmit = onWordSubmit;
    this.selectedWord = "";
    this.selectedLetters = [];
    this.letterTexts = [];
    this.connectors = [];
    this.bgSprite = null;
    this.clearTimeout = null;
  }

  async init(centerX, centerY) {
    const bgTexture = await Assets.load("/assets/background.png");

    this.bgSprite = new Sprite(bgTexture);
    this.bgSprite.anchor.set(0.5);
    this.bgSprite.width = 60;
    this.bgSprite.height = 40;
    this.bgSprite.x = centerX;
    this.bgSprite.y = centerY - 170;
    this.bgSprite.visible = false;

    this.container.addChild(this.bgSprite);
    this.stage.addChild(this.container);
  }

  async addLetter(char, container, letterSprite) {
    if (this.selectedLetters.includes(container)) return;

    this.selectedWord += char;
    this.selectedLetters.push(container);

    const circleIn = new Sprite(await Assets.load("/assets/circle-in.png"));
    circleIn.anchor.set(0.5);
    circleIn.width = 50;
    circleIn.height = 50;
    container.addChildAt(circleIn, 0);

    letterSprite.style.fill = "#ffffff";
    this.animateBounce(letterSprite);

    const displayLetter = new Text(char, {
      fontFamily: "Arial",
      fontSize: 24,
      fill: "#ffffff",
      fontWeight: "bold",
    });
    displayLetter.anchor.set(0.5);
    this.letterTexts.push(displayLetter);
    this.container.addChild(displayLetter);

    this.updateDisplayLetters();

    if (this.selectedLetters.length > 1) {
      await this.connectWithPrevious();
    }

    this.checkWordState();
  }

  updateDisplayLetters() {
    if (!this.bgSprite.visible) this.bgSprite.visible = true;

    const padding = 10;
    const totalWidth = this.letterTexts.length * 24 + padding * 2;
    this.bgSprite.width = totalWidth;
    this.bgSprite.x = this.stage.width / 2;
    const startX = this.bgSprite.x - totalWidth / 2 + padding + 12;

    this.letterTexts.forEach((letter, i) => {
      letter.x = startX + i * 24;
      letter.y = this.bgSprite.y;
    });
  }

  async connectWithPrevious() {
    const prev = this.selectedLetters[this.selectedLetters.length - 2];
    const curr = this.selectedLetters[this.selectedLetters.length - 1];

    const connector = new Sprite(await Assets.load("/assets/orange-pane.png"));
    connector.anchor.set(0.5);
    connector.height = 6; 
    connector.alpha = 0.7; 

    const dx = curr.x - prev.x;
    const dy = curr.y - prev.y;

    connector.x = (curr.x + prev.x) / 2;
    connector.y = (curr.y + prev.y) / 2;
    connector.width = Math.sqrt(dx * dx + dy * dy);
    connector.rotation = Math.atan2(dy, dx);

    this.container.addChildAt(connector, 0); 
    this.connectors.push(connector);
  }

  checkWordState() {
    const validWords = ["GOLD", "DOG", "GOD", "LOG"];
    const current = this.selectedWord.toUpperCase();

    if (validWords.includes(current)) {
      this.onWordSubmit(current, () => {
        setTimeout(() => this.reset(), 150);
      });
      return;
    }

    const isPrefix = validWords.some((word) => word.startsWith(current));
    if (isPrefix) {
      if (this.clearTimeout) clearTimeout(this.clearTimeout);
      this.clearTimeout = setTimeout(() => {
        if (this.selectedWord.length < 3) this.reset();
      }, 3000);
      return;
    }

    if (current.length >= 3) {
      this.onWordSubmit(current, () => this.reset());
    }
  }

  animateBounce(sprite) {
    let scale = 1;
    let direction = 1;
    let frame = 0;

    const ticker = new Ticker();
    ticker.add(() => {
      frame++;
      scale += direction * 0.05;
      sprite.scale.set(scale);

      if (scale >= 1.2) direction = -1;
      if (scale <= 1) {
        sprite.scale.set(1);
        ticker.stop();
        ticker.destroy();
      }
    });
    ticker.start();
  }

  reset() {
    this.selectedWord = "";

    this.letterTexts.forEach((text) => this.container.removeChild(text));
    this.letterTexts = [];

    this.selectedLetters.forEach((c) => {
      if (c.children.length > 1) c.removeChildAt(0);
      const letter = c.children[0];
      letter.style.fill = 0xffa500;
    });
    this.selectedLetters = [];

    this.connectors.forEach((c) => this.container.removeChild(c));
    this.connectors = [];

    this.bgSprite.visible = false;
    this.bgSprite.width = 60;

    if (this.clearTimeout) {
      clearTimeout(this.clearTimeout);
      this.clearTimeout = null;
    }
  }

  getContainer() {
    return this.container;
  }
}
