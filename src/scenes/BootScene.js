import Phaser from 'phaser';

const RUNNER_FRAMES = [1, 2, 3, 4, 5, 6].map((index) => ({
  key: `runner_run_${index}`,
  path: `assets/runner/run_${index}.png`,
}));

const ASSETS = {
  obstacles: [
    'log',
    'tires',
    'barbed_wire',
    'sandbags',
    'monkey_bars',
    'mud',
    'pit',
  ],
  backgrounds: ['sky', 'forest_far', 'forest_mid', 'grass'],
  menu: ['menu'],
  start: ['start'],
  meta: ['finish_gate'],
};

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    RUNNER_FRAMES.forEach((frame) => {
      this.load.image(frame.key, frame.path);
    });

    ASSETS.obstacles.forEach((key) => {
      this.load.image(`obstacle_${key}`, `assets/obstacles/${key}.png`);
    });

    ASSETS.backgrounds.forEach((key) => {
      this.load.image(`bg_${key}`, `assets/backgrounds/${key}.png`);
    });

    ASSETS.menu.forEach((key) => {
      this.load.image(`menu_${key}`, `assets/menu/${key}.png`);
    });

    ASSETS.start.forEach((key) => {
      this.load.image(`start_${key}`, `assets/start/${key}.png`);
    });

    // Source tile file is named dart_tile.png; we expose it under tile_dirt_tile key.
    this.load.image('tile_dirt_tile', 'assets/tiles/dart_tile.png');

    ASSETS.meta.forEach((key) => {
      this.load.image(`meta_${key}`, `assets/meta/${key}.png`);
    });
  }

  create() {
    if (!this.textures.exists('projectile_arrow')) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0xdc2626, 1);
      g.fillTriangle(60, 14, 36, 4, 36, 24);
      g.fillStyle(0xe5e7eb, 1);
      g.fillRect(8, 10, 30, 8);
      g.fillStyle(0x94a3b8, 1);
      g.fillRect(2, 8, 10, 12);
      g.lineStyle(1, 0x111827, 0.8);
      g.strokeRect(2, 8, 10, 12);
      g.generateTexture('projectile_arrow', 64, 28);
      g.destroy();
    }

    if (!this.anims.exists('runner-run')) {
      this.anims.create({
        key: 'runner-run',
        frames: RUNNER_FRAMES.map((frame) => ({ key: frame.key })),
        frameRate: 12,
        repeat: -1,
      });
    }

    this.scene.start('MenuScene');
  }
}
