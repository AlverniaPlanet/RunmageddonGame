import Phaser from 'phaser';
import { GAME_CONSTANTS } from './GameScene';
import { Storage } from '../systems/Storage';

export class UIScene extends Phaser.Scene {
  constructor() {
    super('UIScene');

    this.hudText = null;
    this.introContainer = null;
    this.introTimer = null;

    this.mashContainer = null;
    this.mashText = null;
    this.penaltyText = null;

    this.endOverlay = null;
  }

  create() {
    this.createHud();
    this.createIntro();
    this.createMashOverlay();
    this.createPenaltyOverlay();

    this.bindEvents();
    this.resetRunUi();
  }

  bindEvents() {
    this.game.events.on('ui:updateHUD', this.onHudUpdate, this);
    this.game.events.on('ui:showIntro', this.showIntro, this);
    this.game.events.on('ui:hideIntro', this.hideIntro, this);
    this.game.events.on('ui:mashStart', this.showMash, this);
    this.game.events.on('ui:mashProgress', this.updateMash, this);
    this.game.events.on('ui:mashEnd', this.hideMash, this);
    this.game.events.on('ui:penalty', this.showPenalty, this);
    this.game.events.on('ui:runEnded', this.showEndOverlay, this);

    this.events.once('shutdown', () => {
      this.game.events.off('ui:updateHUD', this.onHudUpdate, this);
      this.game.events.off('ui:showIntro', this.showIntro, this);
      this.game.events.off('ui:hideIntro', this.hideIntro, this);
      this.game.events.off('ui:mashStart', this.showMash, this);
      this.game.events.off('ui:mashProgress', this.updateMash, this);
      this.game.events.off('ui:mashEnd', this.hideMash, this);
      this.game.events.off('ui:penalty', this.showPenalty, this);
      this.game.events.off('ui:runEnded', this.showEndOverlay, this);
    });
  }

  createHud() {
    this.hudText = this.add
      .text(24, 20, '', {
        fontFamily: 'monospace',
        fontSize: '28px',
        color: '#ffffff',
        stroke: '#111827',
        strokeThickness: 4,
      })
      .setDepth(200);
  }

  createIntro() {
    const bg = this.add
      .rectangle(GAME_CONSTANTS.BASE_WIDTH / 2, 95, 860, 100, 0x000000, 0.58)
      .setDepth(210);

    const text = this.add
      .text(
        GAME_CONSTANTS.BASE_WIDTH / 2,
        95,
        'SPACE / Klik = SKOK   |   SHIFT / S / strzalka w dol = KUCANIE',
        {
          fontFamily: 'monospace',
          fontSize: '26px',
          color: '#f9fafb',
        },
      )
      .setOrigin(0.5)
      .setDepth(211);

    this.introContainer = this.add.container(0, 0, [bg, text]).setDepth(210);
  }

  createMashOverlay() {
    const bg = this.add
      .rectangle(GAME_CONSTANTS.BASE_WIDTH / 2, 180, 400, 110, 0x7f1d1d, 0.85)
      .setDepth(230);

    this.mashText = this.add
      .text(GAME_CONSTANTS.BASE_WIDTH / 2, 180, 'KLIKAJ! 0 / 10', {
        fontFamily: 'monospace',
        fontSize: '34px',
        color: '#ffffff',
      })
      .setOrigin(0.5)
      .setDepth(231);

    this.mashContainer = this.add.container(0, 0, [bg, this.mashText]).setVisible(false).setDepth(230);
  }

  createPenaltyOverlay() {
    this.penaltyText = this.add
      .text(GAME_CONSTANTS.BASE_WIDTH / 2, GAME_CONSTANTS.BASE_HEIGHT / 2 - 20, '', {
        fontFamily: 'monospace',
        fontSize: '62px',
        color: '#ef4444',
        stroke: '#450a0a',
        strokeThickness: 8,
      })
      .setOrigin(0.5)
      .setDepth(240)
      .setVisible(false);
  }

  resetRunUi() {
    this.hideMash();
    this.hideEndOverlay();
    this.hideIntro();
  }

  onHudUpdate({ time, score, speed }) {
    this.hudText.setText(`Time: ${time.toFixed(1)}   Score: ${score}   Speed: ${speed}`);
  }

  showIntro() {
    this.introContainer.setVisible(true);

    if (this.introTimer) {
      this.introTimer.remove(false);
    }

    this.introTimer = this.time.delayedCall(3000, () => {
      this.hideIntro();
    });
  }

  hideIntro() {
    this.introContainer.setVisible(false);

    if (this.introTimer) {
      this.introTimer.remove(false);
      this.introTimer = null;
    }
  }

  showMash({ clicks, target }) {
    this.mashText.setText(`KLIKAJ! ${clicks} / ${target}`);
    this.mashContainer.setVisible(true);
  }

  updateMash({ clicks, target }) {
    this.mashText.setText(`KLIKAJ! ${clicks} / ${target}`);
  }

  hideMash() {
    this.mashContainer.setVisible(false);
  }

  showPenalty({ amount }) {
    if (!this.penaltyText) return;

    this.penaltyText.setText(`-${amount} PKT`).setAlpha(1).setScale(1).setVisible(true);
    this.penaltyText.y = GAME_CONSTANTS.BASE_HEIGHT / 2 - 20;

    this.tweens.killTweensOf(this.penaltyText);
    this.tweens.add({
      targets: this.penaltyText,
      y: this.penaltyText.y - 30,
      alpha: 0,
      scaleX: 1.08,
      scaleY: 1.08,
      duration: 900,
      ease: 'Quad.Out',
      onComplete: () => {
        this.penaltyText.setVisible(false);
      },
    });
  }

  hideEndOverlay() {
    if (this.endOverlay) {
      this.endOverlay.destroy(true);
      this.endOverlay = null;
    }
  }

  showEndOverlay({ result, score, highscore, ranking = [], entryId = null }) {
    this.hideEndOverlay();

    const title = result === 'win' ? 'META! WYGRANA' : 'GAME OVER';
    const panelShadow = this.add
      .rectangle(GAME_CONSTANTS.BASE_WIDTH / 2 + 8, GAME_CONSTANTS.BASE_HEIGHT / 2 + 8, 780, 560, 0x000000, 0.45)
      .setDepth(259);
    const box = this.add
      .rectangle(GAME_CONSTANTS.BASE_WIDTH / 2, GAME_CONSTANTS.BASE_HEIGHT / 2, 780, 560, 0x020617, 0.9)
      .setStrokeStyle(3, 0x93c5fd, 0.5)
      .setDepth(260);

    const titleText = this.add
      .text(GAME_CONSTANTS.BASE_WIDTH / 2, 228, title, {
        fontFamily: 'monospace',
        fontSize: '48px',
        color: '#f9fafb',
      })
      .setOrigin(0.5)
      .setDepth(261);

    const scoreText = this.add
      .text(GAME_CONSTANTS.BASE_WIDTH / 2, 292, `Wynik: ${score}`, {
        fontFamily: 'monospace',
        fontSize: '32px',
        color: '#e5e7eb',
      })
      .setOrigin(0.5)
      .setDepth(261);

    const highscoreText = this.add
      .text(GAME_CONSTANTS.BASE_WIDTH / 2, 336, `Highscore: ${highscore}`, {
        fontFamily: 'monospace',
        fontSize: '30px',
        color: '#fde68a',
      })
      .setOrigin(0.5)
      .setDepth(261);

    const restartButton = this.add
      .text(GAME_CONSTANTS.BASE_WIDTH / 2, 552, 'Restart', {
        fontFamily: 'monospace',
        fontSize: '34px',
        color: '#86efac',
        backgroundColor: '#14532d',
        padding: { x: 16, y: 8 },
      })
      .setOrigin(0.5)
      .setDepth(261)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.resetRunUi();
        this.game.events.emit('ui:restart');
      });

    const ctaButton = this.add
      .text(GAME_CONSTANTS.BASE_WIDTH / 2, 606, 'Zapisz sie', {
        fontFamily: 'monospace',
        fontSize: '30px',
        color: '#bfdbfe',
        backgroundColor: '#1e3a8a',
        padding: { x: 16, y: 8 },
      })
      .setOrigin(0.5)
      .setDepth(261)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        const typed = window.prompt('Podaj imie do rankingu (max 20 znakow):', '');
        if (typed === null) return;

        const updated = Storage.setEntryName(entryId, typed);
        const refreshed = updated.slice(0, 5).map((item, index) => `${index + 1}. ${item.name}: ${item.score}`).join('\n');
        rankingLine.setText(refreshed || 'Brak wynikow');
      });

    const rankingTitle = this.add
      .text(GAME_CONSTANTS.BASE_WIDTH / 2, 382, 'Ranking', {
        fontFamily: 'monospace',
        fontSize: '26px',
        color: '#93c5fd',
      })
      .setOrigin(0.5)
      .setDepth(261);

    const rankingText = ranking
      .slice(0, 5)
      .map((item, index) => `${index + 1}. ${item.name}: ${item.score}`)
      .join('\n');
    const rankingLine = this.add
      .text(GAME_CONSTANTS.BASE_WIDTH / 2, 410, rankingText || 'Brak wynikow', {
        fontFamily: 'monospace',
        fontSize: '20px',
        color: '#e2e8f0',
        align: 'center',
        lineSpacing: 4,
      })
      .setOrigin(0.5, 0)
      .setDepth(261);

    this.endOverlay = this.add.container(0, 0, [
      panelShadow,
      box,
      titleText,
      scoreText,
      highscoreText,
      rankingTitle,
      rankingLine,
      restartButton,
      ctaButton,
    ]);
  }
}
