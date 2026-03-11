import Phaser from 'phaser';
import { getSkinDefinition } from '../systems/Skins';

const CHARACTER_CROPS = {
  run: { x: 0.29, y: 0.16, w: 0.42, h: 0.7 },
  slide: { x: 0.23, y: 0.08, w: 0.54, h: 0.84 },
  jump: { x: 0.23, y: 0.08, w: 0.54, h: 0.84 },
  dead: { x: 0.23, y: 0.08, w: 0.54, h: 0.84 },
};

export class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, x, groundY, config) {
    const skin = getSkinDefinition(config.skinId);
    super(scene, x, groundY, skin.textureKeys.runStart);

    this.scene = scene;
    this.fixedX = x;
    this.groundY = groundY;

    this.jumpVelocity = config.jumpVelocity;
    this.gravity = config.gravity;
    this.skin = skin;
    this.runAnimKey = skin.animKeys.run;
    this.slideAnimKey = skin.animKeys.slide;
    this.jumpAnimKey = skin.animKeys.jump;
    this.runStartTexture = skin.textureKeys.runStart;
    this.deadTexture = skin.textureKeys.dead;
    this.deadYOffset = skin.deadYOffset ?? 0;
    this.velocityY = 0;
    this.isSliding = false;
    this.runAnimationEnabled = true;
    this.slideLift = config.slideLift ?? skin.slideLift ?? 14;

    scene.add.existing(this);
    this.applyCharacterCrop();

    this.setOrigin(0.5, 1);
    const gameplayScale = this.skin.gameplayScale ?? 1;
    this.setDisplaySize(config.displayWidth * gameplayScale, config.displayHeight * gameplayScale);
    this.baseScaleX = this.scaleX;
    this.baseScaleY = this.scaleY;
    this.play(this.runAnimKey);
  }

  applyCharacterCrop(preset = 'run') {
    // Character source textures are large canvases with centered subject.
    const skinCrops = this.skin?.crops ?? {};
    const crop = skinCrops[preset] ?? CHARACTER_CROPS[preset] ?? CHARACTER_CROPS.run;
    const sourceWidth = this.width;
    const sourceHeight = this.height;
    const cropX = Math.floor(sourceWidth * crop.x);
    const cropY = Math.floor(sourceHeight * crop.y);
    const cropW = Math.floor(sourceWidth * crop.w);
    const cropH = Math.floor(sourceHeight * crop.h);
    this.setCrop(cropX, cropY, cropW, cropH);
  }

  update(delta) {
    const dt = delta / 1000;

    this.x = this.fixedX;
    if (this.isSliding) {
      this.y = this.groundY - this.slideLift;
      this.velocityY = 0;
      this.syncAnimationState();
      return;
    }

    if (!this.isGrounded() || this.velocityY !== 0) {
      this.velocityY += this.gravity * dt;
      this.y += this.velocityY * dt;

      if (this.y >= this.groundY) {
        this.y = this.groundY;
        this.velocityY = 0;
      }
    }
    this.syncAnimationState();
  }

  isGrounded() {
    if (this.isSliding) {
      return this.y >= this.groundY - this.slideLift - 0.5;
    }
    return this.y >= this.groundY - 0.5;
  }

  jump() {
    if (!this.isGrounded() || this.isSliding) {
      return false;
    }

    this.velocityY = this.jumpVelocity;
    this.y = Math.min(this.y, this.groundY - 1);
    this.playJumpAnimation();
    return true;
  }

  startSlide() {
    if (!this.isGrounded() || this.isSliding) {
      return false;
    }

    this.isSliding = true;
    this.setScale(this.baseScaleX * 0.95, this.baseScaleY * 0.74);
    this.y = this.groundY - this.slideLift;
    this.playSlideAnimation();
    return true;
  }

  endSlide() {
    if (!this.isSliding) {
      return;
    }

    this.isSliding = false;
    this.setScale(this.baseScaleX, this.baseScaleY);
    this.y = this.groundY;
    this.syncAnimationState();
  }

  setSlideHeld(isHeld) {
    if (isHeld) {
      this.startSlide();
      return;
    }

    this.endSlide();
  }

  setStartPose() {
    this.runAnimationEnabled = false;
    this.anims.stop();
    this.setTexture(this.runStartTexture);
    this.applyCharacterCrop('run');
    this.setScale(this.baseScaleX, this.baseScaleY);
    this.isSliding = false;
    this.velocityY = 0;
    this.y = this.groundY;
  }

  startRunAnimation() {
    this.runAnimationEnabled = true;
    this.setTexture(this.runStartTexture);
    this.applyCharacterCrop('run');
    this.play(this.runAnimKey, true);
  }

  showDeadPose() {
    this.runAnimationEnabled = false;
    this.anims.stop();
    this.setTexture(this.deadTexture);
    this.applyCharacterCrop('dead');
    this.setScale(this.baseScaleX, this.baseScaleY);
    this.isSliding = false;
    this.velocityY = 0;
    this.y = this.groundY + this.deadYOffset;
  }

  playRunAnimation() {
    if (!this.runAnimationEnabled) return;
    this.applyCharacterCrop('run');
    if (this.anims.currentAnim?.key === this.runAnimKey && this.anims.isPlaying) return;
    this.play(this.runAnimKey, true);
  }

  playSlideAnimation() {
    if (!this.runAnimationEnabled) return;
    this.applyCharacterCrop('slide');
    if (this.anims.currentAnim?.key === this.slideAnimKey && this.anims.isPlaying) return;
    this.play(this.slideAnimKey, true);
  }

  playJumpAnimation() {
    if (!this.runAnimationEnabled) return;
    this.applyCharacterCrop('jump');
    if (this.anims.currentAnim?.key === this.jumpAnimKey && this.anims.isPlaying) return;
    this.play(this.jumpAnimKey, true);
  }

  syncAnimationState() {
    if (!this.runAnimationEnabled) return;
    if (this.isSliding) {
      this.playSlideAnimation();
      return;
    }
    if (!this.isGrounded()) {
      this.playJumpAnimation();
      return;
    }
    this.playRunAnimation();
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
