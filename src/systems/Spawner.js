import Phaser from 'phaser';

export const SPAWNER_CONSTANTS = {
  INITIAL_DELAY_MS: 1800,
  MIN_DELAY_MS: 950,
  MAX_DELAY_MS: 1450,
};

export class Spawner {
  constructor(scene, definitions, onSpawn, getDelayRange = null, canSpawn = null) {
    this.scene = scene;
    this.definitions = definitions;
    this.onSpawn = onSpawn;
    this.getDelayRange = getDelayRange;
    this.canSpawn = canSpawn;

    this.isActive = false;
    this.lastType = null;
    this.timer = null;
  }

  start() {
    if (this.isActive) return;

    this.isActive = true;
    this.timer = this.scene.time.delayedCall(SPAWNER_CONSTANTS.INITIAL_DELAY_MS, () => {
      if (!this.isActive) return;
      const next = this.pickNextSpawnable();
      if (next) {
        this.lastType = next.type;
        this.onSpawn(next);
      }
      this.schedule();
    });
  }

  stop() {
    this.isActive = false;

    if (this.timer) {
      this.timer.remove(false);
      this.timer = null;
    }
  }

  destroy() {
    this.stop();
  }

  schedule() {
    if (!this.isActive) return;

    const dynamicRange = this.getDelayRange ? this.getDelayRange() : null;
    const minDelay = dynamicRange?.min ?? SPAWNER_CONSTANTS.MIN_DELAY_MS;
    const maxDelay = dynamicRange?.max ?? SPAWNER_CONSTANTS.MAX_DELAY_MS;
    const safeMin = Math.max(280, Math.floor(Math.min(minDelay, maxDelay)));
    const safeMax = Math.max(safeMin + 20, Math.floor(Math.max(minDelay, maxDelay)));
    const delay = Phaser.Math.Between(safeMin, safeMax);

    this.timer = this.scene.time.delayedCall(delay, () => {
      const next = this.pickNextSpawnable();
      if (next) {
        this.lastType = next.type;
        this.onSpawn(next);
      }
      this.schedule();
    });
  }

  pickNext() {
    const pool = this.definitions.filter((d) => d.type !== this.lastType);
    const list = pool.length > 0 ? pool : this.definitions;
    return Phaser.Utils.Array.GetRandom(list);
  }

  pickNextSpawnable() {
    const tries = 30;
    for (let i = 0; i < tries; i += 1) {
      const candidate = this.pickNext();
      if (!this.canSpawn || this.canSpawn(candidate)) {
        return candidate;
      }
    }
    return null;
  }
}
