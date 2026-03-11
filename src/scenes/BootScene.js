import Phaser from 'phaser';

const RUNNER_FRAMES = [1, 2, 3, 4, 5, 6].map((index) => ({
  key: `runner_run_${index}`,
  path: `assets/runner/run_${index}.png`,
}));
const RUNNER_SLIDE_FRAMES = [1, 2].map((index) => ({
  key: `runner_slide_${index}`,
  path: `assets/runner/slide_${index}.png`,
}));
const RUNNER_JUMP_FRAME = {
  key: 'runner_jump_1',
  path: 'assets/runner/jump_1.png',
};
const RUNNER_DEAD_FRAME = {
  key: 'runner_dead',
  path: 'assets/runner/dead.png',
};
const RUNNER_O_IDLE_FRAMES = [1, 2, 3].map((index) => ({
  key: `runner_o_idle_${index}`,
  path: `assets/runner/o/o_s_${index}.png`,
}));
const RUNNER_O_START_FRAME = {
  key: 'runner_o_start',
  path: 'assets/runner/o/o_s.png',
};
const RUNNER_O_RUN_FRAMES = [1, 2, 3, 4, 5, 6].map((index) => ({
  key: `runner_o_run_${index}`,
  path: `assets/runner/o/o_r_${index}.png`,
}));
const RUNNER_O_SLIDE_FRAMES = [1, 2].map((index) => ({
  key: `runner_o_slide_${index}`,
  path: `assets/runner/o/o_c_${index}.png`,
}));
const RUNNER_O_JUMP_FRAME = {
  key: 'runner_o_jump_1',
  path: 'assets/runner/o/o_j_1.png',
};
const RUNNER_O_DEAD_FRAME = {
  key: 'runner_o_dead',
  path: 'assets/runner/o/o_d_1.png',
};
const RUNNER_M_IDLE_FRAMES = [1, 2, 3].map((index) => ({
  key: `runner_m_idle_${index}`,
  path: `assets/runner/m/m_s_${index}.png`,
}));
const RUNNER_M_START_FRAME = {
  key: 'runner_m_start',
  path: 'assets/runner/m/m_s.png',
};
const RUNNER_M_RUN_FRAMES = [1, 2, 3, 4, 5, 6].map((index) => ({
  key: `runner_m_run_${index}`,
  path: `assets/runner/m/m_r_${index}.png`,
}));
const RUNNER_M_SLIDE_FRAMES = [1, 2].map((index) => ({
  key: `runner_m_slide_${index}`,
  path: `assets/runner/m/m_c_${index}.png`,
}));
const RUNNER_M_JUMP_FRAME = {
  key: 'runner_m_jump_1',
  path: 'assets/runner/m/m_j_1.png',
};
const RUNNER_M_DEAD_FRAME = {
  key: 'runner_m_dead',
  path: 'assets/runner/m/m_d_1.png',
};
const RUNNER_P_IDLE_FRAMES = [1, 2, 3].map((index) => ({
  key: `runner_p_idle_${index}`,
  path: `assets/runner/p/p_s_${index}.png`,
}));
const RUNNER_P_RUN_FRAMES = [1, 2, 3, 4, 5, 6].map((index) => ({
  key: `runner_p_run_${index}`,
  path: `assets/runner/p/p_r_${index}.png`,
}));
const RUNNER_P_SLIDE_FRAMES = [1, 2].map((index) => ({
  key: `runner_p_slide_${index}`,
  path: `assets/runner/p/p_c_${index}.png`,
}));
const RUNNER_P_JUMP_FRAME = {
  key: 'runner_p_jump_1',
  path: 'assets/runner/p/p_j_1.png',
};
const RUNNER_P_DEAD_FRAME = {
  key: 'runner_p_dead',
  path: 'assets/runner/p/p_d_1.png',
};
const BIRD_JUMP_FRAMES = [1, 2].map((index) => ({
  key: `bird1_${index}`,
  path: `assets/birds/bird1_${index}.png`,
}));
const BIRD_SLIDE_FRAMES = [1, 2].map((index) => ({
  key: `bird2_${index}`,
  path: `assets/birds/bird2_${index}.png`,
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
  logo: ['logo', 'logo_ui', 'logo_hud', 'logo_end'],
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
    RUNNER_SLIDE_FRAMES.forEach((frame) => {
      this.load.image(frame.key, frame.path);
    });
    this.load.image(RUNNER_JUMP_FRAME.key, RUNNER_JUMP_FRAME.path);
    this.load.image(RUNNER_DEAD_FRAME.key, RUNNER_DEAD_FRAME.path);
    RUNNER_O_IDLE_FRAMES.forEach((frame) => {
      this.load.image(frame.key, frame.path);
    });
    this.load.image(RUNNER_O_START_FRAME.key, RUNNER_O_START_FRAME.path);
    RUNNER_O_RUN_FRAMES.forEach((frame) => {
      this.load.image(frame.key, frame.path);
    });
    RUNNER_O_SLIDE_FRAMES.forEach((frame) => {
      this.load.image(frame.key, frame.path);
    });
    this.load.image(RUNNER_O_JUMP_FRAME.key, RUNNER_O_JUMP_FRAME.path);
    this.load.image(RUNNER_O_DEAD_FRAME.key, RUNNER_O_DEAD_FRAME.path);
    RUNNER_M_IDLE_FRAMES.forEach((frame) => {
      this.load.image(frame.key, frame.path);
    });
    this.load.image(RUNNER_M_START_FRAME.key, RUNNER_M_START_FRAME.path);
    RUNNER_M_RUN_FRAMES.forEach((frame) => {
      this.load.image(frame.key, frame.path);
    });
    RUNNER_M_SLIDE_FRAMES.forEach((frame) => {
      this.load.image(frame.key, frame.path);
    });
    this.load.image(RUNNER_M_JUMP_FRAME.key, RUNNER_M_JUMP_FRAME.path);
    this.load.image(RUNNER_M_DEAD_FRAME.key, RUNNER_M_DEAD_FRAME.path);
    RUNNER_P_IDLE_FRAMES.forEach((frame) => {
      this.load.image(frame.key, frame.path);
    });
    RUNNER_P_RUN_FRAMES.forEach((frame) => {
      this.load.image(frame.key, frame.path);
    });
    RUNNER_P_SLIDE_FRAMES.forEach((frame) => {
      this.load.image(frame.key, frame.path);
    });
    this.load.image(RUNNER_P_JUMP_FRAME.key, RUNNER_P_JUMP_FRAME.path);
    this.load.image(RUNNER_P_DEAD_FRAME.key, RUNNER_P_DEAD_FRAME.path);
    BIRD_JUMP_FRAMES.forEach((frame) => {
      this.load.image(frame.key, frame.path);
    });
    BIRD_SLIDE_FRAMES.forEach((frame) => {
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

    ASSETS.logo.forEach((key) => {
      this.load.image(`logo_${key}`, `assets/Logo/${key}.png`);
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
    if (this.textures.exists('menu_menu')) {
      this.textures.get('menu_menu').setFilter(Phaser.Textures.FilterMode.LINEAR);
    }
    ['log', 'tires', 'barbed_wire', 'sandbags', 'monkey_bars', 'mud', 'pit'].forEach((key) => {
      const textureKey = `obstacle_${key}`;
      if (this.textures.exists(textureKey)) {
        this.textures.get(textureKey).setFilter(Phaser.Textures.FilterMode.LINEAR);
      }
    });

    if (this.textures.exists('logo_logo_ui')) {
      this.textures.get('logo_logo_ui').setFilter(Phaser.Textures.FilterMode.LINEAR);
    }
    if (this.textures.exists('logo_logo_hud')) {
      this.textures.get('logo_logo_hud').setFilter(Phaser.Textures.FilterMode.LINEAR);
    }
    if (this.textures.exists('logo_logo_end')) {
      this.textures.get('logo_logo_end').setFilter(Phaser.Textures.FilterMode.LINEAR);
    }

    if (!this.anims.exists('runner-run')) {
      this.anims.create({
        key: 'runner-run',
        frames: RUNNER_FRAMES.map((frame) => ({ key: frame.key })),
        frameRate: 12,
        repeat: -1,
      });
    }
    if (!this.anims.exists('runner-slide')) {
      this.anims.create({
        key: 'runner-slide',
        frames: RUNNER_SLIDE_FRAMES.map((frame) => ({ key: frame.key })),
        frameRate: 7,
        repeat: -1,
      });
    }
    if (!this.anims.exists('runner-jump')) {
      this.anims.create({
        key: 'runner-jump',
        frames: [{ key: RUNNER_JUMP_FRAME.key }],
        frameRate: 1,
        repeat: 0,
      });
    }
    if (!this.anims.exists('runner-idle')) {
      this.anims.create({
        key: 'runner-idle',
        frames: [{ key: 'runner_run_1' }],
        frameRate: 1,
        repeat: -1,
      });
    }
    if (!this.anims.exists('runner-o-idle')) {
      this.anims.create({
        key: 'runner-o-idle',
        frames: RUNNER_O_IDLE_FRAMES.map((frame) => ({ key: frame.key })),
        frameRate: 3.5,
        repeat: -1,
      });
    }
    if (!this.anims.exists('runner-o-run')) {
      this.anims.create({
        key: 'runner-o-run',
        frames: RUNNER_O_RUN_FRAMES.map((frame) => ({ key: frame.key })),
        frameRate: 12,
        repeat: -1,
      });
    }
    if (!this.anims.exists('runner-o-slide')) {
      this.anims.create({
        key: 'runner-o-slide',
        frames: RUNNER_O_SLIDE_FRAMES.map((frame) => ({ key: frame.key })),
        frameRate: 7,
        repeat: -1,
      });
    }
    if (!this.anims.exists('runner-o-jump')) {
      this.anims.create({
        key: 'runner-o-jump',
        frames: [{ key: RUNNER_O_JUMP_FRAME.key }],
        frameRate: 1,
        repeat: 0,
      });
    }
    if (
      !this.anims.exists('runner-m-idle') &&
      RUNNER_M_IDLE_FRAMES.every((frame) => this.textures.exists(frame.key))
    ) {
      this.anims.create({
        key: 'runner-m-idle',
        frames: RUNNER_M_IDLE_FRAMES.map((frame) => ({ key: frame.key })),
        frameRate: 3.5,
        repeat: -1,
      });
    }
    if (
      !this.anims.exists('runner-m-run') &&
      RUNNER_M_RUN_FRAMES.every((frame) => this.textures.exists(frame.key))
    ) {
      this.anims.create({
        key: 'runner-m-run',
        frames: RUNNER_M_RUN_FRAMES.map((frame) => ({ key: frame.key })),
        frameRate: 12,
        repeat: -1,
      });
    }
    if (
      !this.anims.exists('runner-m-slide') &&
      RUNNER_M_SLIDE_FRAMES.every((frame) => this.textures.exists(frame.key))
    ) {
      this.anims.create({
        key: 'runner-m-slide',
        frames: RUNNER_M_SLIDE_FRAMES.map((frame) => ({ key: frame.key })),
        frameRate: 7,
        repeat: -1,
      });
    }
    if (!this.anims.exists('runner-m-jump') && this.textures.exists(RUNNER_M_JUMP_FRAME.key)) {
      this.anims.create({
        key: 'runner-m-jump',
        frames: [{ key: RUNNER_M_JUMP_FRAME.key }],
        frameRate: 1,
        repeat: 0,
      });
    }
    if (
      !this.anims.exists('runner-p-idle') &&
      RUNNER_P_IDLE_FRAMES.every((frame) => this.textures.exists(frame.key))
    ) {
      this.anims.create({
        key: 'runner-p-idle',
        frames: RUNNER_P_IDLE_FRAMES.map((frame) => ({ key: frame.key })),
        frameRate: 3.5,
        repeat: -1,
      });
    }
    if (
      !this.anims.exists('runner-p-run') &&
      RUNNER_P_RUN_FRAMES.every((frame) => this.textures.exists(frame.key))
    ) {
      this.anims.create({
        key: 'runner-p-run',
        frames: RUNNER_P_RUN_FRAMES.map((frame) => ({ key: frame.key })),
        frameRate: 12,
        repeat: -1,
      });
    }
    if (
      !this.anims.exists('runner-p-slide') &&
      RUNNER_P_SLIDE_FRAMES.every((frame) => this.textures.exists(frame.key))
    ) {
      this.anims.create({
        key: 'runner-p-slide',
        frames: RUNNER_P_SLIDE_FRAMES.map((frame) => ({ key: frame.key })),
        frameRate: 7,
        repeat: -1,
      });
    }
    if (!this.anims.exists('runner-p-jump') && this.textures.exists(RUNNER_P_JUMP_FRAME.key)) {
      this.anims.create({
        key: 'runner-p-jump',
        frames: [{ key: RUNNER_P_JUMP_FRAME.key }],
        frameRate: 1,
        repeat: 0,
      });
    }
    if (!this.anims.exists('bird-jump-fly')) {
      this.anims.create({
        key: 'bird-jump-fly',
        frames: BIRD_JUMP_FRAMES.map((frame) => ({ key: frame.key })),
        frameRate: 9,
        repeat: -1,
      });
    }
    if (!this.anims.exists('bird-slide-fly')) {
      this.anims.create({
        key: 'bird-slide-fly',
        frames: BIRD_SLIDE_FRAMES.map((frame) => ({ key: frame.key })),
        frameRate: 9,
        repeat: -1,
      });
    }

    this.scene.start('MenuScene');
  }
}
