import Grid from "./grid.js";
import Tray from "./tray.js";
import WordValidator from "./wordValidator.js";
import { Text, Graphics } from "pixi.js";

export default class GameManager {
  constructor(stage, app) {
    this.stage = stage;
    this.app = app;
    this.validWords = ["GOLD", "DOG", "GOD", "LOG"];
    this.grid = new Grid(stage);
    this.validator = new WordValidator(this.validWords);
    this.tray = new Tray(
      stage,
      ["G", "O", "L", "D"],
      this.handleWordSubmit.bind(this)
    );

    this.stage.sortableChildren = true;
  }

  async init() {
    await this.grid.drawGameGrid();
    await this.tray.init();
    await this.addRefreshButton();
  }

  handleWordSubmit(word, done) {
    if (this.validator.isUsed(word)) {
      this.tray.showAlreadyFound();
      done();
      return;
    }

    if (this.validator.isValid(word)) {
      const wordData = this.validator.getWordData(word);
      this.grid.placeWord(word, wordData);
      this.tray.showCorrect();
      this.validator.markAsUsed(word);

      if (this.validator.isFinished()) {
        setTimeout(() => this.showVictoryScreen(), 500);
      }
    } else {
      this.tray.showWrong();
    }

    done();
  }

  async addRefreshButton() {
    const btn = new Text("↻ Refresh", {
      fontFamily: "Arial",
      fontSize: 24,
      fill: "#ff6600",
      fontWeight: "bold",
    });

    btn.anchor.set(0.5);
    btn.x = this.app.screen.width / 2;
    btn.y = this.app.screen.height - 30;
    btn.eventMode = "static";
    btn.cursor = "pointer";

    btn.on("pointerover", () => {
      btn.scale.set(1.15);
      btn.style.fill = "#ffaa33";
    });

    btn.on("pointerout", () => {
      btn.scale.set(1);
      btn.style.fill = "#ff6600";
    });

    btn.on("pointerdown", () => {
      window.location.reload();
    });

    this.stage.addChild(btn);
  }

  showVictoryScreen() {
    const blocker = new Graphics()
      .rect(0, 0, this.app.screen.width, this.app.screen.height)
      .fill({ color: 0x000000, alpha: 0 });
  
    blocker.zIndex = 99;
    blocker.eventMode = "static"; 
    blocker.cursor = "default";
    this.stage.addChild(blocker);
  
    const overlay = new Graphics()
      .rect(0, 0, this.app.screen.width, this.app.screen.height)
      .fill({ color: 0x000000, alpha: 0.7 });
  
    overlay.zIndex = 100;
    this.stage.addChild(overlay);
  
    const message = new Text("🎉✨ You Win! 🎉✨", {
      fontFamily: "Arial",
      fontSize: 32,
      fill: "#ffffff",
      fontWeight: "bold",
      align: "center",
      dropShadow: true,
      dropShadowColor: "#000000",
      dropShadowBlur: 10,
      stroke: "#ffaa00",
      strokeThickness: 4,
    });
  
    message.anchor.set(0.5);
    message.x = this.app.screen.width / 2;
    message.y = this.app.screen.height / 2;
    message.zIndex = 101;
    this.stage.addChild(message);
  
    const restart = new Text("🔁 Play Again", {
      fontFamily: "Arial",
      fontSize: 20,
      fill: "#00ccff",
      fontWeight: "bold",
    });
  
    restart.anchor.set(0.5);
    restart.x = this.app.screen.width / 2;
    restart.y = message.y + 60;
    restart.zIndex = 102;
    restart.eventMode = "static";
    restart.cursor = "pointer";
  
    restart.on("pointerover", () => {
      restart.scale.set(1.15);
      restart.style.fill = "#33ddff";
    });
  
    restart.on("pointerout", () => {
      restart.scale.set(1);
      restart.style.fill = "#00ccff";
    });
  
    restart.on("pointerdown", () => window.location.reload());
  
    this.stage.addChild(restart);
  }
  
}
