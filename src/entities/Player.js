import Phaser from 'phaser';

export class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, x, groundY, config) {
    super(scene, x, groundY, 'runner_run_1');

    this.scene = scene;
    this.fixedX = x;
    this.groundY = groundY;

    this.jumpVelocity = config.jumpVelocity;
    this.gravity = config.gravity;
    this.velocityY = 0;
    this.isSliding = false;

    scene.add.existing(this);
    this.applyCharacterCrop();

    this.setOrigin(0.5, 1);
    this.setDisplaySize(config.displayWidth, config.displayHeight);
    this.baseScaleX = this.scaleX;
    this.baseScaleY = this.scaleY;
    this.play('runner-run');
  }

  applyCharacterCrop() {
    // Character source textures are large canvases with centered subject.
    const sourceWidth = this.width;
    const sourceHeight = this.height;
    const cropX = Math.floor(sourceWidth * 0.29);
    const cropY = Math.floor(sourceHeight * 0.16);
    const cropW = Math.floor(sourceWidth * 0.42);
    const cropH = Math.floor(sourceHeight * 0.7);
    this.setCrop(cropX, cropY, cropW, cropH);
  }

  update(delta) {
    const dt = delta / 1000;

    this.x = this.fixedX;

    if (!this.isGrounded() || this.velocityY !== 0) {
      this.velocityY += this.gravity * dt;
      this.y += this.velocityY * dt;

      if (this.y >= this.groundY) {
        this.y = this.groundY;
        this.velocityY = 0;
      }
    }

  }

  isGrounded() {
    return this.y >= this.groundY - 0.5;
  }

  jump() {
    if (!this.isGrounded() || this.isSliding) {
      return false;
    }

    this.velocityY = this.jumpVelocity;
    this.y = Math.min(this.y, this.groundY - 1);
    return true;
  }

  startSlide() {
    if (!this.isGrounded() || this.isSliding) {
      return false;
    }

    this.isSliding = true;
    this.setScale(this.baseScaleX * 0.92, this.baseScaleY * 0.6);
    return true;
  }

  endSlide() {
    if (!this.isSliding) {
      return;
    }

    this.isSliding = false;
    this.setScale(this.baseScaleX, this.baseScaleY);
  }

  setSlideHeld(isHeld) {
    if (isHeld) {
      this.startSlide();
      return;
    }

    this.endSlide();
  }

  setStartPose() {
    this.anims.stop();
    this.setTexture('runner_run_1');
    this.applyCharacterCrop();
    this.setScale(this.baseScaleX, this.baseScaleY);
    this.isSliding = false;
  }

  startRunAnimation() {
    this.setTexture('runner_run_1');
    this.applyCharacterCrop();
    this.play('runner-run', true);
  }

  getHitbox() {
    if (this.isSliding) {
      return {
        x: this.x - 30,
        y: this.y - 45,
        width: 60,
        height: 38,
      };
    }

    return {
      x: this.x - 23,
      y: this.y - 89,
      width: 46,
      height: 84,
    };
  }
}
