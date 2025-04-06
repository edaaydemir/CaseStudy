import { Application, Assets, Sprite } from 'pixi.js';
import GameManager from './gameManager.js';

const app = new Application();
await app.init({
  width: 400,
  height: 600,
  backgroundColor: 0x000000, 
});

document.body.appendChild(app.view);

const bgTexture = await Assets.load('/assets/bg.png');
const background = new Sprite(bgTexture);
background.width = app.screen.width;
background.height = app.screen.height;
background.zIndex = 0;
app.stage.addChild(background);

const game = new GameManager(app.stage, app);
await game.init();
