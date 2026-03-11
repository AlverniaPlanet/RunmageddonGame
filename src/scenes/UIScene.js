import Phaser from 'phaser';
import { GAME_CONSTANTS } from './GameScene';
import { Storage } from '../systems/Storage';
import { useTouchInstructions } from '../systems/Device';

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
    this.hudTopBand = null;
    this.hudStatsPlate = null;
    this.hudLogoPlate = null;
    this.hudLogo = null;
  }

  create() {
    this.createHud();
    this.createHudLogo();
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
    this.hudStatsPlate = this.add
      .rectangle(262, 28, 500, 36, 0x000000, 0.58)
      .setStrokeStyle(1, 0x93c5fd, 0.34)
      .setDepth(199);

    this.hudText = this.add
      .text(26, 13, '', {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#ffffff',
        stroke: '#020617',
        strokeThickness: 3,
      })
      .setDepth(200);
  }

  createHudLogo() {
    const x = GAME_CONSTANTS.BASE_WIDTH / 2;
    const y = 33;

    if (this.textures.exists('logo_logo_hud')) {
      this.hudLogo = this.add
        .image(x, y, 'logo_logo_hud')
        .setOrigin(0.5)
        .setDepth(215)
        .setAlpha(1);
    }
  }

  createIntro() {
    const touchMode = useTouchInstructions(this);
    const bg = this.add
      .rectangle(GAME_CONSTANTS.BASE_WIDTH / 2, 95, 860, 100, 0x000000, 0.58)
      .setDepth(210);

    const text = this.add
      .text(
        GAME_CONSTANTS.BASE_WIDTH / 2,
        95,
        touchMode
          ? 'LEWA STRONA = SKOK | PRAWA STRONA (TRZYMAJ) = KUCANIE'
          : 'SPACE/KLIK = SKOK | SHIFT/S/DOL = KUCANIE',
        {
          fontFamily: 'monospace',
          fontSize: '24px',
          color: '#f9fafb',
          align: 'center',
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
    this.hudText.setText(`Predkosc: ${speed}   Punkty: ${score}   Czas: ${time.toFixed(1)} s`);
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
      .rectangle(GAME_CONSTANTS.BASE_WIDTH / 2 + 8, GAME_CONSTANTS.BASE_HEIGHT / 2 + 40, 780, 620, 0x000000, 0.45)
      .setDepth(259);
    const box = this.add
      .rectangle(GAME_CONSTANTS.BASE_WIDTH / 2, GAME_CONSTANTS.BASE_HEIGHT / 2 + 32, 780, 620, 0x020617, 0.9)
      .setStrokeStyle(3, 0x93c5fd, 0.5)
      .setDepth(260);

    let endLogo = null;
    if (this.textures.exists('logo_logo_end')) {
      endLogo = this.add
        .image(GAME_CONSTANTS.BASE_WIDTH / 2, 160, 'logo_logo_end')
        .setOrigin(0.5)
        .setDepth(262);
    }

    const titleText = this.add
      .text(GAME_CONSTANTS.BASE_WIDTH / 2, 284, title, {
        fontFamily: 'monospace',
        fontSize: '48px',
        color: '#f9fafb',
      })
      .setOrigin(0.5)
      .setDepth(261);

    const scoreText = this.add
      .text(GAME_CONSTANTS.BASE_WIDTH / 2, 342, `Wynik: ${score}`, {
        fontFamily: 'monospace',
        fontSize: '32px',
        color: '#e5e7eb',
      })
      .setOrigin(0.5)
      .setDepth(261);

    const highscoreText = this.add
      .text(GAME_CONSTANTS.BASE_WIDTH / 2, 384, `Najlepszy wynik: ${highscore}`, {
        fontFamily: 'monospace',
        fontSize: '30px',
        color: '#fde68a',
      })
      .setOrigin(0.5)
      .setDepth(261);

    const formatRankingLines = (items) =>
      items
        .slice(0, 4)
        .map((item, index) => {
          const safeName = String(item.name ?? 'Anon').trim() || 'Anon';
          const shortName = safeName.length > 14 ? `${safeName.slice(0, 13)}.` : safeName;
          return `${index + 1}. ${shortName}: ${item.score}`;
        })
        .join('\n');

    const rankingTitle = this.add
      .text(GAME_CONSTANTS.BASE_WIDTH / 2, 422, 'Ranking', {
        fontFamily: 'monospace',
        fontSize: '26px',
        color: '#93c5fd',
      })
      .setOrigin(0.5)
      .setDepth(261);

    const rankingText = formatRankingLines(ranking);
    const rankingLine = this.add
      .text(GAME_CONSTANTS.BASE_WIDTH / 2, 448, rankingText || 'Brak wynikow', {
        fontFamily: 'monospace',
        fontSize: '20px',
        color: '#e2e8f0',
        align: 'center',
        lineSpacing: 4,
      })
      .setOrigin(0.5, 0)
      .setDepth(261);

    const restartButton = this.add
      .text(GAME_CONSTANTS.BASE_WIDTH / 2, 552, 'Zagraj ponownie', {
        fontFamily: 'monospace',
        fontSize: '28px',
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
      .text(GAME_CONSTANTS.BASE_WIDTH / 2, 600, 'Zapisz wynik', {
        fontFamily: 'monospace',
        fontSize: '28px',
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
        const refreshed = formatRankingLines(updated);
        rankingLine.setText(refreshed || 'Brak wynikow');
      });

    const menuButton = this.add
      .text(GAME_CONSTANTS.BASE_WIDTH / 2, 646, 'Menu', {
        fontFamily: 'monospace',
        fontSize: '24px',
        color: '#e2e8f0',
        backgroundColor: '#334155',
        padding: { x: 14, y: 8 },
      })
      .setOrigin(0.5)
      .setDepth(261)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.resetRunUi();
        if (this.scene.isActive('GameScene')) {
          this.scene.stop('GameScene');
        }
        this.scene.start('MenuScene');
        this.scene.stop('UIScene');
      });

    this.endOverlay = this.add.container(0, 0, [
      panelShadow,
      box,
      endLogo,
      titleText,
      scoreText,
      highscoreText,
      rankingTitle,
      rankingLine,
      restartButton,
      ctaButton,
      menuButton,
    ].filter(Boolean));
  }

}
