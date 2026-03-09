export class Parallax {
  constructor(scene, layerConfigs) {
    this.scene = scene;
    this.layers = layerConfigs.map((config) => {
      const layer = scene.add
        .tileSprite(config.x, config.y, config.width, config.height, config.textureKey)
        .setOrigin(config.originX ?? 0, config.originY ?? 0)
        .setScrollFactor(0)
        .setAlpha(config.alpha ?? 1)
        .setDepth(config.depth ?? 0);

      if (config.tint) {
        layer.setTint(config.tint);
      }

      if (config.tileScaleX) {
        layer.tileScaleX = config.tileScaleX;
      }

      if (config.tileScaleY) {
        layer.tileScaleY = config.tileScaleY;
      }

      return {
        tile: layer,
        speedFactor: config.speedFactor,
      };
    });
  }

  update(baseSpeed, delta) {
    const deltaSeconds = delta / 1000;
    
    this.layers.forEach((layer) => {
      layer.tile.tilePositionX += baseSpeed * layer.speedFactor * deltaSeconds;
    });
  }
}
