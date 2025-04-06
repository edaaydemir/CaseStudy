import TrayUI from "./trayUI.js";
import LetterSelector from "./letterSelector.js";
import { Text, Ticker } from "pixi.js";

export default class Tray {
  constructor(stage, letters, onWordSubmit) {
    this.stage = stage;
    this.letters = letters;
    this.onWordSubmit = onWordSubmit;

    this.ui = new TrayUI(stage, letters, this.handleLetterClick.bind(this));
    this.selector = new LetterSelector(stage, onWordSubmit);
  }

  async init() {
    await this.ui.init();
    const centerX = this.stage.width / 2;
    const centerY = this.stage.height - 100;
    await this.selector.init(centerX, centerY);
  }

  handleLetterClick(char, container, letterText) {
    this.selector.addLetter(char, container, letterText);
  }

  showCorrect() {
    this._showMessage("Correct!", "#00ff88");
  }

  showWrong() {
    this._showMessage("Wrong!", "#ff4444");
  }

  showAlreadyFound() {
    this._showMessage("Already found!", "#ffaa00");
  }

  _showMessage(text, color) {
    const msg = new Text(text, {
      fontFamily: "Arial",
      fontSize:34,
      fill: color,
      fontWeight: "bold",
      dropShadow: true,
      dropShadowColor: "#000000",
      dropShadowBlur: 5,
      dropShadowAlpha: 0.4,
      stroke: "#000000",
      strokeThickness: 2,
    });

    msg.anchor.set(0.5);
    msg.alpha = 0;
    msg.x = this.stage.width / 2;
    msg.y = 40; 

    msg.zIndex = 999;
    this.stage.addChild(msg);

    const ticker = new Ticker();
    let frame = 0;

    ticker.add(() => {
      frame++;

      if (frame <= 30) {
        msg.alpha += 0.033;
      } else if (frame > 60 && frame <= 90) {
        msg.alpha -= 0.033;
      }

      if (frame > 90) {
        ticker.stop();
        msg.destroy();
      }
    });

    ticker.start();
  }
}
