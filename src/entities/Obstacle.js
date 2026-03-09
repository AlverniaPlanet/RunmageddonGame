import Phaser from 'phaser';

export class Obstacle extends Phaser.GameObjects.Sprite {
  constructor(scene, definition, x, groundY, speed) {
    super(scene, x, groundY + (definition.yOffset ?? 0), definition.textureKey);

    this.scene = scene;
    this.definition = definition;
    this.type = definition.type;
    this.behavior = definition.behavior;
    this.effects = definition.effects;

    this.speed = speed;
    this.speedMultiplier = definition.speedMultiplier ?? 1;
    this.isResolved = false;
    this.hasAwardedPassScore = false;

    scene.add.existing(this);

    // Source obstacle renders are large canvases; crop to active center area.
    const sourceWidth = this.width;
    const sourceHeight = this.height;
    const crop = definition.crop ?? { x: 0.22, y: 0.2, w: 0.56, h: 0.6 };
    const cropX = Math.floor(sourceWidth * crop.x);
    const cropY = Math.floor(sourceHeight * crop.y);
    const cropW = Math.floor(sourceWidth * crop.w);
    const cropH = Math.floor(sourceHeight * crop.h);
    this.setCrop(cropX, cropY, cropW, cropH);

    this.setOrigin(0.5, 1);
    this.setDisplaySize(definition.displayWidth, definition.displayHeight);
    this.setAlpha(1);
    this.setDepth(58);
  }

  setSpeed(speed) {
    this.speed = speed * this.speedMultiplier;
  }

  update(delta) {
    this.x -= this.speed * (delta / 1000);
  }

  isOffscreen() {
    return this.x + this.displayWidth * 0.5 < -40;
  }

  getHitbox() {
    const hb = this.definition.hitbox;
    const width = hb.width;
    const height = hb.height;
    const centerX = this.x + (hb.offsetX ?? 0);
    const bottomY = this.y - (hb.bottomOffset ?? 0);

    return {
      x: centerX - width / 2,
      y: bottomY - height,
      width,
      height,
    };
  }
}
