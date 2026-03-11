import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { Obstacle } from '../entities/Obstacle';
import { Parallax } from '../systems/Parallax';
import { Spawner } from '../systems/Spawner';
import { Storage } from '../systems/Storage';
import { resolveSkinId } from '../systems/Skins';
import { useTouchInstructions } from '../systems/Device';

export const GAME_CONSTANTS = {
  BASE_WIDTH: 1280,
  BASE_HEIGHT: 720,

  PLAYER_X: 240,
  GROUND_SURFACE_Y: 628,
  COLLISION_TRIGGER_X_OFFSET: 42,
  SLOW_TRIGGER_X_OFFSET: -8,
  SLOW_GROUND_CONTACT_Y: 24,
  GRASS_LAYER_HEIGHT: 420,
  GRASS_SURFACE_OFFSET: 52,

  PLAYER_DISPLAY_WIDTH: 170,
  PLAYER_DISPLAY_HEIGHT: 170,
  PLAYER_GRAVITY: 2600,
  JUMP_VELOCITY: -980,
  JUMP_CLEAR_Y: 86,

  BASE_SPEED: 360,
  MAX_SPEED: 1100,
  SPEED_GROWTH_PER_SECOND: 6.2,

  SCORE_PER_SECOND: 25,
  SCORE_SPEED_MULTIPLIER: 0.07,
  SCORE_PER_PASSED_OBSTACLE: 120,

  RUN_DURATION_MS: Number.POSITIVE_INFINITY,
  FINISH_GATE_OFFSET_X: 260,
  FINISH_GATE_HEIGHT: 250,
  START_GATE_GROUND_OFFSET: 24,
  FINISH_GATE_GROUND_OFFSET: 24,

  MASH_TARGET_CLICKS: 10,
  MASH_DURATION_MS: 1200,

  MUD_SLOW_MULTIPLIER: 0.48,
  MUD_SLOW_MS: 1900,
  MUD_SCORE_PENALTY: 500,

  WATER_SLOW_MULTIPLIER: 0.6,
  WATER_SLOW_MS: 1300,
  LOSE_GATE_HEIGHT: 240,
  BIRD_BASE_COOLDOWN_MS: 1500,
  BIRD_MIN_COOLDOWN_MS: 700,
  MIN_TIME_GAP_SEC: 0.26,
  CONFLICT_GAP_SEC: 0.62,
  BIRD_GAP_SEC: 0.5,

  DEBUG_HITBOXES: false,
};

const OBSTACLE_DEFINITIONS = [
  {
    type: 'log',
    textureKey: 'obstacle_log',
    behavior: 'jump',
    yOffset: 0,
    displayWidth: 196,
    displayHeight: 96,
    hitbox: { width: 112, height: 34, offsetX: 0, bottomOffset: 2 },
    crop: { x: 0.2, y: 0.34, w: 0.6, h: 0.28 },
  },
  {
    type: 'tires',
    textureKey: 'obstacle_tires',
    behavior: 'jump',
    yOffset: 0,
    displayWidth: 162,
    displayHeight: 122,
    hitbox: { width: 82, height: 42, offsetX: 0, bottomOffset: 2 },
    crop: { x: 0.23, y: 0.3, w: 0.54, h: 0.34 },
  },
  {
    type: 'sandbags',
    textureKey: 'obstacle_sandbags',
    behavior: 'jump',
    yOffset: 0,
    displayWidth: 196,
    displayHeight: 112,
    hitbox: { width: 112, height: 38, offsetX: 0, bottomOffset: 2 },
    crop: { x: 0.2, y: 0.3, w: 0.6, h: 0.32 },
  },
  {
    type: 'pit',
    textureKey: 'obstacle_pit',
    behavior: 'jump',
    yOffset: 0,
    displayWidth: 210,
    displayHeight: 92,
    hitbox: { width: 112, height: 20, offsetX: 0, bottomOffset: 0 },
    crop: { x: 0.18, y: 0.38, w: 0.64, h: 0.24 },
  },
  {
    type: 'barbed_wire',
    textureKey: 'obstacle_barbed_wire',
    behavior: 'jump',
    yOffset: 34,
    displayWidth: 286,
    displayHeight: 176,
    hitbox: { width: 150, height: 34, offsetX: 0, bottomOffset: 6 },
    crop: { x: 0.17, y: 0.28, w: 0.66, h: 0.3 },
  },
  {
    type: 'monkey_bars',
    textureKey: 'obstacle_monkey_bars',
    behavior: 'slide',
    yOffset: 38,
    displayWidth: 276,
    displayHeight: 196,
    hitbox: { width: 158, height: 38, offsetX: 0, bottomOffset: 92 },
    crop: { x: 0.14, y: 0.24, w: 0.72, h: 0.36 },
  },
  {
    type: 'mud',
    textureKey: 'obstacle_mud',
    behavior: 'slow',
    yOffset: 0,
    displayWidth: 198,
    displayHeight: 108,
    hitbox: { width: 102, height: 16, offsetX: 0, bottomOffset: 0 },
    crop: { x: 0.14, y: 0.33, w: 0.72, h: 0.33 },
    effects: {
      slowMultiplier: GAME_CONSTANTS.MUD_SLOW_MULTIPLIER,
      slowDurationMs: GAME_CONSTANTS.MUD_SLOW_MS,
      scorePenalty: GAME_CONSTANTS.MUD_SCORE_PENALTY,
    },
  },
];

const BIRD_DEFINITIONS = [
  {
    type: 'bird_jump',
    textureKey: 'bird1_1',
    animKey: 'bird-jump-fly',
    behavior: 'jump',
    yOffset: -34,
    displayWidth: 124,
    displayHeight: 64,
    hitbox: { width: 56, height: 24, offsetX: 0, bottomOffset: 18 },
    speedMultiplier: 1.24,
    crop: { x: 0, y: 0, w: 1, h: 1 },
  },
  {
    type: 'bird_slide',
    textureKey: 'bird2_1',
    animKey: 'bird-slide-fly',
    behavior: 'slide',
    yOffset: -138,
    displayWidth: 132,
    displayHeight: 68,
    hitbox: { width: 62, height: 22, offsetX: 0, bottomOffset: 16 },
    speedMultiplier: 1.32,
    crop: { x: 0, y: 0, w: 1, h: 1 },
  },
];

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');

    this.player = null;
    this.obstacles = [];
    this.groundLayer = null;

    this.parallax = null;
    this.spawner = null;

    this.elapsedMs = 0;
    this.score = 0;
    this.scrollSpeed = GAME_CONSTANTS.BASE_SPEED;

    this.slowUntilMs = 0;
    this.activeSlowMultiplier = 1;

    this.isFinished = false;
    this.finishSpawned = false;
    this.finishGate = null;

    this.mashState = null;

    this.cursors = null;
    this.spaceKey = null;
    this.shiftKey = null;
    this.sKey = null;

    this.boundRestartHandler = null;
    this.runStarted = false;
    this.startOverlay = null;
    this.startStructure = null;
    this.lastBirdSpawnAt = -99999;
    this.birdSpawnTimer = null;

    this.debugEnabled = GAME_CONSTANTS.DEBUG_HITBOXES;
    this.debugGraphics = null;
    this.debugHintText = null;
    this.hKey = null;
    this.pendingSpacePresses = 0;
    this.boundSpaceKeyHandler = null;
    this.boundPointerDownHandler = null;
    this.boundPointerUpHandler = null;
    this.boundGameOutHandler = null;
    this.touchSlideHeld = false;
    this.touchSlidePointerId = null;
  }

  create() {
    this.createWorld();
    this.createPlayer();
    this.createInput();
    this.createDebugOverlay();

    this.elapsedMs = 0;
    this.score = 0;
    this.scrollSpeed = GAME_CONSTANTS.BASE_SPEED;
    this.slowUntilMs = 0;
    this.activeSlowMultiplier = 1;
    this.isFinished = false;
    this.finishSpawned = false;
    this.finishGate = null;
    this.mashState = null;
    this.obstacles = [];
    this.runStarted = false;
    this.lastBirdSpawnAt = -99999;
    this.birdSpawnTimer = null;
    this.pendingSpacePresses = 0;
    this.touchSlideHeld = false;
    this.touchSlidePointerId = null;

    this.spawner = new Spawner(
      this,
      OBSTACLE_DEFINITIONS,
      (definition) => {
        this.spawnObstacle(definition);
      },
      () => {
        const t = Phaser.Math.Clamp(
          (this.scrollSpeed - GAME_CONSTANTS.BASE_SPEED) /
            (GAME_CONSTANTS.MAX_SPEED - GAME_CONSTANTS.BASE_SPEED),
          0,
          1,
        );

        // Higher speed => denser obstacle stream.
        return {
          min: Phaser.Math.Linear(1150, 560, t),
          max: Phaser.Math.Linear(1800, 980, t),
        };
      },
      (definition) => this.canSpawnDefinition(definition),
    );
    this.player.setStartPose();
    this.createStartOverlay();

    this.boundRestartHandler = () => this.scene.restart();
    this.game.events.on('ui:restart', this.boundRestartHandler);

    this.events.once('shutdown', () => {
      if (this.spawner) {
        this.spawner.destroy();
      }
      if (this.birdSpawnTimer) {
        this.birdSpawnTimer.remove(false);
        this.birdSpawnTimer = null;
      }
      if (this.boundSpaceKeyHandler) {
        this.input.keyboard.off('keydown-SPACE', this.boundSpaceKeyHandler);
        this.boundSpaceKeyHandler = null;
      }
      if (this.boundPointerDownHandler) {
        this.input.off('pointerdown', this.boundPointerDownHandler);
        this.boundPointerDownHandler = null;
      }
      if (this.boundPointerUpHandler) {
        this.input.off('pointerup', this.boundPointerUpHandler);
        this.boundPointerUpHandler = null;
      }
      if (this.boundGameOutHandler) {
        this.input.off('gameout', this.boundGameOutHandler);
        this.boundGameOutHandler = null;
      }
      this.game.events.off('ui:restart', this.boundRestartHandler);
    });
  }

  createWorld() {
    this.parallax = new Parallax(this, [
      {
        textureKey: 'bg_sky',
        x: 0,
        y: 0,
        width: GAME_CONSTANTS.BASE_WIDTH,
        height: GAME_CONSTANTS.BASE_HEIGHT,
        speedFactor: 0.08,
        depth: -30,
        alpha: 1,
      },
      {
        textureKey: 'bg_forest_far',
        x: 0,
        y: 0,
        width: GAME_CONSTANTS.BASE_WIDTH,
        height: GAME_CONSTANTS.BASE_HEIGHT,
        speedFactor: 0.16,
        depth: -20,
        alpha: 0.45,
      },
      {
        textureKey: 'bg_forest_mid',
        x: 0,
        y: 0,
        width: GAME_CONSTANTS.BASE_WIDTH,
        height: GAME_CONSTANTS.BASE_HEIGHT,
        speedFactor: 0.28,
        depth: -10,
        alpha: 0.62,
      },
    ]);

    this.groundLayer = this.add
      .tileSprite(
        0,
        GAME_CONSTANTS.GROUND_SURFACE_Y - GAME_CONSTANTS.GRASS_SURFACE_OFFSET,
        GAME_CONSTANTS.BASE_WIDTH,
        GAME_CONSTANTS.GRASS_LAYER_HEIGHT,
        'bg_grass',
      )
      .setOrigin(0, 0)
      .setDepth(18);

    this.groundLayer.tileScaleX = 1;
    this.groundLayer.tileScaleY = 1;
  }

  createPlayer() {
    const requestedSkin = this.registry.get('selectedSkin') ?? Storage.getSelectedSkin();
    const selectedSkin = resolveSkinId(this, requestedSkin);
    this.player = new Player(this, GAME_CONSTANTS.PLAYER_X, GAME_CONSTANTS.GROUND_SURFACE_Y, {
      displayWidth: GAME_CONSTANTS.PLAYER_DISPLAY_WIDTH,
      displayHeight: GAME_CONSTANTS.PLAYER_DISPLAY_HEIGHT,
      jumpVelocity: GAME_CONSTANTS.JUMP_VELOCITY,
      gravity: GAME_CONSTANTS.PLAYER_GRAVITY,
      skinId: selectedSkin,
    });

    this.player.setDepth(62);
  }

  createInput() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.hKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H);
    this.boundSpaceKeyHandler = () => {
      if (this.isFinished) return;
      this.pendingSpacePresses += 1;
    };
    this.input.keyboard.on('keydown-SPACE', this.boundSpaceKeyHandler);

    this.boundPointerDownHandler = (pointer) => {
      if (this.isFinished) return;
      if (this.mashState?.active) {
        this.registerMashClick();
        return;
      }

      const isTouchPointer = pointer.pointerType === 'touch' || pointer.wasTouch === true;
      const isRightHalf = pointer.x >= GAME_CONSTANTS.BASE_WIDTH / 2;
      if (isTouchPointer && isRightHalf) {
        this.touchSlideHeld = true;
        this.touchSlidePointerId = pointer.id;
        if (!this.runStarted) {
          this.beginRun();
        }
        return;
      }

      this.tryJump();
    };
    this.input.on('pointerdown', this.boundPointerDownHandler);

    this.boundPointerUpHandler = (pointer) => {
      if (pointer.id === this.touchSlidePointerId) {
        this.touchSlideHeld = false;
        this.touchSlidePointerId = null;
      }
    };
    this.input.on('pointerup', this.boundPointerUpHandler);

    this.boundGameOutHandler = () => {
      this.touchSlideHeld = false;
      this.touchSlidePointerId = null;
    };
    this.input.on('gameout', this.boundGameOutHandler);
  }

  createStartOverlay() {
    const centerX = GAME_CONSTANTS.BASE_WIDTH / 2;
    const centerY = GAME_CONSTANTS.BASE_HEIGHT / 2;
    const touchMode = useTouchInstructions(this);

    // Start gate is placed in world space at spawn and then scrolls away with the world.
    this.startStructure = this.add
      .image(
        GAME_CONSTANTS.PLAYER_X - 34,
        GAME_CONSTANTS.GROUND_SURFACE_Y + GAME_CONSTANTS.START_GATE_GROUND_OFFSET + 70,
        'start_start',
      )
      .setOrigin(0.5, 1)
      .setDepth(38);
    const ratio = this.startStructure.width / this.startStructure.height;
    this.startStructure.setDisplaySize(500 * ratio, 500);

    const hint = this.add
      .text(
        centerX,
        centerY + 220,
        touchMode ? 'DOTKNIJ EKRANU ABY ZACZAC | LEWA=SKOK, PRAWA(TRZYMAJ)=SLIDE' : 'SPACE/KLIK = START',
        {
        fontFamily: 'monospace',
        fontSize: touchMode ? '26px' : '36px',
        color: '#e2e8f0',
        stroke: '#0b1220',
        strokeThickness: 8,
        align: 'center',
        },
      )
      .setOrigin(0.5)
      .setDepth(252);

    this.startOverlay = this.add.container(0, 0, [hint]).setDepth(250);
  }

  createDebugOverlay() {
    this.debugGraphics = this.add.graphics().setDepth(300);
    this.debugHintText = this.add
      .text(18, 686, 'DEBUG HITBOX: H', {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#22c55e',
        stroke: '#0b1020',
        strokeThickness: 3,
      })
      .setDepth(301)
      .setVisible(this.debugEnabled);
  }

  spawnObstacle(definition) {
    const obstacle = new Obstacle(
      this,
      definition,
      GAME_CONSTANTS.BASE_WIDTH + 220,
      GAME_CONSTANTS.GROUND_SURFACE_Y,
      this.scrollSpeed,
    );

    if (definition.type.startsWith('bird_')) {
      this.lastBirdSpawnAt = this.time.now;
    }

    this.obstacles.push(obstacle);
  }

  getRequiredAction(defOrObstacle) {
    const behavior = defOrObstacle.behavior;
    if (behavior === 'jump') return 'jump';
    if (behavior === 'slide') return 'slide';
    return 'neutral';
  }

  isBirdHazard(defOrObstacle) {
    return (defOrObstacle.type ?? '').startsWith('bird_');
  }

  estimateTriggerX(defOrObstacle) {
    if (defOrObstacle.behavior === 'slow') {
      return this.player.x + GAME_CONSTANTS.SLOW_TRIGGER_X_OFFSET;
    }
    return this.player.x + GAME_CONSTANTS.COLLISION_TRIGGER_X_OFFSET;
  }

  estimateSpeed(defOrObstacle) {
    const multiplier = defOrObstacle.speedMultiplier ?? 1;
    return this.scrollSpeed * multiplier;
  }

  canSpawnDefinition(definition) {
    if (!this.runStarted || this.isFinished) {
      return false;
    }

    if (
      this.isBirdHazard(definition) &&
      this.time.now - this.lastBirdSpawnAt < this.getBirdCooldownMs()
    ) {
      return false;
    }

    const spawnX = GAME_CONSTANTS.BASE_WIDTH + 220;
    const triggerX = this.estimateTriggerX(definition);
    const speed = Math.max(120, this.estimateSpeed(definition));
    const etaNew = Math.max(0, (spawnX - triggerX) / speed);
    const actionNew = this.getRequiredAction(definition);

    for (const obstacle of this.obstacles) {
      if (!obstacle.active || obstacle.isResolved) continue;

      const obstacleTriggerX = this.estimateTriggerX(obstacle);
      const obstacleSpeed = Math.max(120, obstacle.speed);
      const etaExisting = (obstacle.x - obstacleTriggerX) / obstacleSpeed;
      if (etaExisting < -0.05) continue;

      const delta = Math.abs(etaNew - etaExisting);
      const newIsBird = this.isBirdHazard(definition);
      const existingIsBird = this.isBirdHazard(obstacle);
      const actionExisting = this.getRequiredAction(obstacle);

      // Bird + non-bird must stay fair-play: enough time for 2 separate reactions.
      if (newIsBird !== existingIsBird) {
        const oppositeActions =
          (actionNew === 'jump' && actionExisting === 'slide') ||
          (actionNew === 'slide' && actionExisting === 'jump');

        // Opposite reactions (jump then slide / slide then jump) need clearly separated windows.
        if (oppositeActions && delta < 1.05) {
          return false;
        }

        // Same reaction still needs spacing for a second input/read.
        if (!oppositeActions && delta < 0.62) {
          return false;
        }
        continue;
      }

      if (delta < GAME_CONSTANTS.MIN_TIME_GAP_SEC) {
        return false;
      }

      const oppositeActions =
        (actionNew === 'jump' && actionExisting === 'slide') ||
        (actionNew === 'slide' && actionExisting === 'jump');
      if (oppositeActions && delta < GAME_CONSTANTS.CONFLICT_GAP_SEC) {
        return false;
      }

      const birdMix = newIsBird && existingIsBird;
      if (birdMix && delta < GAME_CONSTANTS.BIRD_GAP_SEC) {
        return false;
      }
    }

    return true;
  }

  update(_, delta) {
    if (Phaser.Input.Keyboard.JustDown(this.hKey)) {
      this.debugEnabled = !this.debugEnabled;
      this.debugHintText.setVisible(this.debugEnabled);
      if (!this.debugEnabled) this.debugGraphics.clear();
    }

    if (this.isFinished) {
      this.renderDebugOverlay();
      this.emitHudUpdate();
      return;
    }

    if (this.mashState?.active) {
      while (this.pendingSpacePresses > 0) {
        this.pendingSpacePresses -= 1;
        this.registerMashClick();
      }
      this.emitHudUpdate();
      this.renderDebugOverlay();
      return;
    }

    this.handleInput();

    this.player.update(delta);
    if (!this.runStarted) {
      this.renderDebugOverlay();
      this.emitHudUpdate();
      return;
    }

    this.updateRunState(delta);
    this.updateWorld(delta);
    this.updateObstacles(delta);
    this.updateFinishGate(delta);

    this.renderDebugOverlay();
    this.emitHudUpdate();
  }

  handleInput() {
    if (this.pendingSpacePresses > 0) {
      this.pendingSpacePresses = 0;
      this.tryJump();
    }

    const slideHeld = this.shiftKey.isDown || this.sKey.isDown || this.cursors.down.isDown || this.touchSlideHeld;
    this.player.setSlideHeld(slideHeld);
  }

  tryJump() {
    if (!this.runStarted) {
      this.beginRun();
      return;
    }
    this.player.jump();
  }

  beginRun() {
    if (this.runStarted || this.isFinished) {
      return;
    }

    this.runStarted = true;
    this.player.startRunAnimation();
    this.spawner.start();
    this.startBirdTicker();

    if (this.startOverlay) {
      this.tweens.add({
        targets: this.startOverlay,
        alpha: 0,
        y: -18,
        duration: 240,
        ease: 'Quad.Out',
        onComplete: () => {
          this.startOverlay.destroy();
          this.startOverlay = null;
        },
      });
    }
  }

  startBirdTicker() {
    if (this.birdSpawnTimer) {
      this.birdSpawnTimer.remove(false);
      this.birdSpawnTimer = null;
    }

    const scheduleNext = () => {
      if (!this.runStarted || this.isFinished) return;

      const order = Phaser.Math.Between(0, 1) === 0 ? ['bird_jump', 'bird_slide'] : ['bird_slide', 'bird_jump'];
      for (const type of order) {
        const definition = BIRD_DEFINITIONS.find((entry) => entry.type === type);
        if (definition && this.canSpawnDefinition(definition)) {
          this.spawnObstacle(definition);
          break;
        }
      }

      this.birdSpawnTimer = this.time.delayedCall(this.getBirdSpawnDelayMs(), scheduleNext);
    };

    this.birdSpawnTimer = this.time.delayedCall(1200, scheduleNext);
  }

  getBirdSpawnDelayMs() {
    const t = Phaser.Math.Clamp((this.elapsedMs / 1000) / 75, 0, 1);
    return Math.floor(Phaser.Math.Linear(2600, 900, t));
  }

  getBirdCooldownMs() {
    const t = Phaser.Math.Clamp((this.elapsedMs / 1000) / 75, 0, 1);
    return Math.floor(Phaser.Math.Linear(GAME_CONSTANTS.BIRD_BASE_COOLDOWN_MS, GAME_CONSTANTS.BIRD_MIN_COOLDOWN_MS, t));
  }

  updateRunState(delta) {
    this.elapsedMs += delta;

    const elapsedSec = this.elapsedMs / 1000;
    const baseSpeed = Math.min(
      GAME_CONSTANTS.BASE_SPEED + GAME_CONSTANTS.SPEED_GROWTH_PER_SECOND * elapsedSec,
      GAME_CONSTANTS.MAX_SPEED,
    );

    if (this.time.now > this.slowUntilMs) {
      this.activeSlowMultiplier = 1;
    }

    this.scrollSpeed = baseSpeed * this.activeSlowMultiplier;

    this.score +=
      (delta / 1000) *
      (GAME_CONSTANTS.SCORE_PER_SECOND + this.scrollSpeed * GAME_CONSTANTS.SCORE_SPEED_MULTIPLIER);

    // Endless mode: no run timeout gate.
  }

  updateWorld(delta) {
    const dt = delta / 1000;
    this.parallax.update(this.scrollSpeed, delta);
    this.groundLayer.tilePositionX += this.scrollSpeed * dt;

    if (this.runStarted && this.startStructure?.active) {
      this.startStructure.x -= this.scrollSpeed * dt;
      if (this.startStructure.x + this.startStructure.displayWidth * 0.5 < -60) {
        this.startStructure.destroy();
        this.startStructure = null;
      }
    }
  }

  updateObstacles(delta) {
    this.obstacles = this.obstacles.filter((obstacle) => {
      obstacle.setSpeed(this.scrollSpeed);
      obstacle.update(delta);

      if (!obstacle.hasAwardedPassScore && obstacle.x + obstacle.displayWidth * 0.45 < this.player.x - 10) {
        obstacle.hasAwardedPassScore = true;
        this.score += GAME_CONSTANTS.SCORE_PER_PASSED_OBSTACLE;
      }

      // For jump-type hazards, keep them dangerous until player fully passes them.
      if (
        !obstacle.isResolved &&
        obstacle.behavior === 'jump' &&
        obstacle.x + obstacle.displayWidth * 0.28 < this.player.x - 10
      ) {
        obstacle.isResolved = true;
      }

      if (!obstacle.isResolved) {
        const triggerOffset =
          obstacle.behavior === 'slow'
            ? GAME_CONSTANTS.SLOW_TRIGGER_X_OFFSET
            : GAME_CONSTANTS.COLLISION_TRIGGER_X_OFFSET;
        const triggerX = this.player.x + triggerOffset;

        if (obstacle.x <= triggerX) {
          this.resolveObstacleHit(obstacle);
        }
      }

      if (obstacle.isOffscreen()) {
        obstacle.destroy();
        return false;
      }

      return obstacle.active;
    });
  }

  resolveObstacleHit(obstacle) {
    if (obstacle.isResolved || this.isFinished) {
      return;
    }

    switch (obstacle.behavior) {
      case 'jump': {
        const jumpClearHeight = this.player.groundY - GAME_CONSTANTS.JUMP_CLEAR_Y;
        const cleared = this.player.y <= jumpClearHeight;
        if (cleared) {
          // Do not resolve immediately; if player drops too early, collision should still fail.
          return;
        }
        this.endRun('lose', obstacle);
        break;
      }
      case 'slide': {
        if (this.player.isSliding) {
          obstacle.isResolved = true;
        } else {
          this.endRun('lose', obstacle);
        }
        break;
      }
      case 'mash': {
        this.startMashChallenge(obstacle);
        break;
      }
      case 'slow': {
        const overlapsPlayer = this.hitboxesOverlap(this.player.getHitbox(), obstacle.getHitbox());
        if (overlapsPlayer) {
          obstacle.isResolved = true;
          this.applySlowEffect(obstacle.effects);
        } else if (obstacle.x < this.player.x - 48) {
          // Player cleanly skipped the puddle; close the obstacle once it is behind.
          obstacle.isResolved = true;
        }
        break;
      }
      case 'dual': {
        const jumpClearHeight = this.player.groundY - 68;
        const jumped = this.player.y <= jumpClearHeight;
        const slided = this.player.isSliding;
        if (jumped || slided) {
          obstacle.isResolved = true;
        } else {
          this.endRun('lose', obstacle);
        }
        break;
      }
      default:
        break;
    }
  }

  startMashChallenge(obstacle) {
    obstacle.isResolved = true;

    this.mashState = {
      active: true,
      obstacle,
      clicks: 0,
      target: GAME_CONSTANTS.MASH_TARGET_CLICKS,
      timer: this.time.delayedCall(GAME_CONSTANTS.MASH_DURATION_MS, () => {
        if (!this.mashState) return;
        if (this.mashState.clicks >= this.mashState.target) {
          this.finishMashChallenge(true);
        } else {
          this.finishMashChallenge(false);
        }
      }),
    };

    this.game.events.emit('ui:mashStart', {
      clicks: 0,
      target: GAME_CONSTANTS.MASH_TARGET_CLICKS,
      durationMs: GAME_CONSTANTS.MASH_DURATION_MS,
    });
  }

  registerMashClick() {
    if (!this.mashState?.active || this.isFinished) return;

    this.mashState.clicks += 1;
    this.game.events.emit('ui:mashProgress', {
      clicks: this.mashState.clicks,
      target: this.mashState.target,
    });

    if (this.mashState.clicks >= this.mashState.target) {
      this.finishMashChallenge(true);
    }
  }

  finishMashChallenge(success) {
    if (!this.mashState) return;

    if (this.mashState.timer) this.mashState.timer.remove(false);

    if (success) {
      if (this.mashState.obstacle?.active) this.mashState.obstacle.isResolved = true;
      this.mashState = null;
      this.game.events.emit('ui:mashEnd');
      return;
    }

    const failedObstacle = this.mashState.obstacle ?? null;
    this.mashState = null;
    this.game.events.emit('ui:mashEnd');
    this.endRun('lose', failedObstacle);
  }

  applySlowEffect(effects) {
    this.slowUntilMs = Math.max(this.slowUntilMs, this.time.now + effects.slowDurationMs);
    this.activeSlowMultiplier = Math.min(this.activeSlowMultiplier, effects.slowMultiplier);

    if (effects.scorePenalty > 0) {
      this.score = Math.max(0, this.score - effects.scorePenalty);
      this.game.events.emit('ui:penalty', {
        amount: effects.scorePenalty,
      });
    }
  }

  hitboxesOverlap(a, b) {
    return !(
      a.x + a.width <= b.x ||
      b.x + b.width <= a.x ||
      a.y + a.height <= b.y ||
      b.y + b.height <= a.y
    );
  }

  spawnFinishGate() {
    this.finishGate = this.add
      .image(
        GAME_CONSTANTS.BASE_WIDTH + GAME_CONSTANTS.FINISH_GATE_OFFSET_X,
        GAME_CONSTANTS.GROUND_SURFACE_Y + GAME_CONSTANTS.FINISH_GATE_GROUND_OFFSET,
        'meta_finish_gate',
      )
      .setOrigin(0.5, 1)
      .setDepth(60);

    const ratio = this.finishGate.width / this.finishGate.height;
    this.finishGate.setDisplaySize(GAME_CONSTANTS.FINISH_GATE_HEIGHT * ratio, GAME_CONSTANTS.FINISH_GATE_HEIGHT);
  }

  updateFinishGate(delta) {
    if (!this.finishGate || this.isFinished) return;

    this.finishGate.x -= this.scrollSpeed * (delta / 1000);
    if (this.finishGate.x <= this.player.x + 40) {
      this.endRun('win');
    }
  }

  playLoseImpact(obstacle) {
    const centerX = GAME_CONSTANTS.BASE_WIDTH / 2;
    const centerY = GAME_CONSTANTS.BASE_HEIGHT / 2 + 36;
    const targetX = obstacle ? obstacle.x : centerX;
    const targetY = obstacle ? obstacle.y - 12 : centerY;

    const shock = this.add.circle(targetX, targetY, 14, 0xff7a18, 0.8).setDepth(220);
    const ring = this.add
      .circle(targetX, targetY, 18, 0xffd166, 0)
      .setStrokeStyle(4, 0xffd166, 0.95)
      .setDepth(220);

    this.tweens.add({
      targets: [shock, ring],
      scaleX: 2.4,
      scaleY: 2.4,
      alpha: 0,
      duration: 260,
      ease: 'Quad.Out',
      onComplete: () => {
        shock.destroy();
        ring.destroy();
      },
    });
  }

  emitHudUpdate() {
    const currentTimeMs = Math.min(this.elapsedMs, GAME_CONSTANTS.RUN_DURATION_MS);
    this.game.events.emit('ui:updateHUD', {
      time: currentTimeMs / 1000,
      score: Math.floor(this.score),
      speed: Math.floor(this.scrollSpeed),
    });
  }

  renderDebugOverlay() {
    if (!this.debugGraphics) return;

    this.debugGraphics.clear();
    if (!this.debugEnabled) return;

    const playerBox = this.player.getHitbox();
    this.debugGraphics.lineStyle(2, 0x22c55e, 1);
    this.debugGraphics.strokeRect(playerBox.x, playerBox.y, playerBox.width, playerBox.height);

    this.debugGraphics.lineStyle(1, 0xffffff, 0.7);
    this.debugGraphics.lineBetween(0, this.player.groundY, GAME_CONSTANTS.BASE_WIDTH, this.player.groundY);
    this.debugGraphics.lineStyle(2, 0x60a5fa, 0.8);
    this.debugGraphics.lineBetween(
      this.player.x + GAME_CONSTANTS.COLLISION_TRIGGER_X_OFFSET,
      this.player.groundY - 170,
      this.player.x + GAME_CONSTANTS.COLLISION_TRIGGER_X_OFFSET,
      this.player.groundY + 20,
    );

    this.obstacles.forEach((obstacle) => {
      const box = obstacle.getHitbox();
      const color =
        obstacle.behavior === 'slide'
          ? 0x38bdf8
          : obstacle.behavior === 'mash'
            ? 0xf59e0b
            : obstacle.behavior === 'slow'
              ? 0xeab308
              : 0xef4444;

      this.debugGraphics.lineStyle(2, color, 1);
      this.debugGraphics.strokeRect(box.x, box.y, box.width, box.height);

      this.debugGraphics.lineStyle(1, 0xffffff, 0.55);
      this.debugGraphics.strokeRect(
        obstacle.x - obstacle.displayWidth / 2,
        obstacle.y - obstacle.displayHeight,
        obstacle.displayWidth,
        obstacle.displayHeight,
      );
    });
  }

  endRun(result, obstacle = null) {
    if (this.isFinished) return;

    this.isFinished = true;

    if (this.spawner) this.spawner.stop();
    if (this.birdSpawnTimer) {
      this.birdSpawnTimer.remove(false);
      this.birdSpawnTimer = null;
    }

    if (result === 'lose') {
      this.playLoseImpact(obstacle);
      this.cameras.main.shake(140, 0.005);
    }

    if (this.player?.isSliding) this.player.endSlide();
    if (result === 'lose') {
      this.player?.showDeadPose?.();
    } else if (this.player?.anims?.isPlaying) {
      this.player.anims.pause();
    }

    if (result === 'lose') {
      this.playLoseGateReveal(() => this.finalizeRunResult(result));
      return;
    }

    this.finalizeRunResult(result);
  }

  playLoseGateReveal(onDone) {
    const centerX = GAME_CONSTANTS.BASE_WIDTH / 2;
    const gate = this.add
      .image(
        GAME_CONSTANTS.BASE_WIDTH + 240,
        GAME_CONSTANTS.GROUND_SURFACE_Y + GAME_CONSTANTS.FINISH_GATE_GROUND_OFFSET,
        'meta_finish_gate',
      )
      .setOrigin(0.5, 1)
      .setDepth(110)
      .setAlpha(0);

    const ratio = gate.width / gate.height;
    gate.setDisplaySize(GAME_CONSTANTS.LOSE_GATE_HEIGHT * ratio, GAME_CONSTANTS.LOSE_GATE_HEIGHT);

    this.tweens.add({
      targets: gate,
      alpha: 1,
      x: centerX,
      duration: 1500,
      ease: 'Cubic.Out',
      onComplete: () => {
        this.tweens.add({
          targets: gate,
          scaleX: 1.08,
          scaleY: 1.08,
          yoyo: true,
          duration: 700,
          onComplete: () => {
            onDone();
          },
        });
      },
    });
  }

  finalizeRunResult(result) {
    const finalScore = Math.floor(this.score);
    const { ranking, entryId } = Storage.addScore(finalScore);
    const highscore = ranking.length > 0 ? ranking[0].score : 0;

    this.game.events.emit('ui:runEnded', {
      result,
      score: finalScore,
      highscore,
      ranking,
      entryId,
    });
  }
}
