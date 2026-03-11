import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { MenuScene } from './scenes/MenuScene';
import { GameScene, GAME_CONSTANTS } from './scenes/GameScene';
import { UIScene } from './scenes/UIScene';

const config = {
  type: Phaser.AUTO,
  parent: 'app',
  width: GAME_CONSTANTS.BASE_WIDTH,
  height: GAME_CONSTANTS.BASE_HEIGHT,
  pixelArt: false,
  roundPixels: false,
  backgroundColor: '#87ceeb',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_CONSTANTS.BASE_WIDTH,
    height: GAME_CONSTANTS.BASE_HEIGHT,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [BootScene, MenuScene, GameScene, UIScene],
};

new Phaser.Game(config);
