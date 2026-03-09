import Phaser from 'phaser';
import { GAME_CONSTANTS } from './GameScene';
import { Storage } from '../systems/Storage';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
    this.isArmed = false;
    this.menuContainer = null;
    this.instructionContainer = null;
    this.rankingContainer = null;
  }

  create() {
    const centerX = GAME_CONSTANTS.BASE_WIDTH / 2;
    const centerY = GAME_CONSTANTS.BASE_HEIGHT / 2;

    this.add.image(0, 0, 'menu_menu').setOrigin(0).setDisplaySize(GAME_CONSTANTS.BASE_WIDTH, GAME_CONSTANTS.BASE_HEIGHT);
    this.add.rectangle(centerX, centerY, GAME_CONSTANTS.BASE_WIDTH, GAME_CONSTANTS.BASE_HEIGHT, 0x020617, 0.32);

    const shadow = this.add.rectangle(centerX + 8, centerY + 8, 940, 560, 0x000000, 0.35);
    const card = this.add.rectangle(centerX, centerY, 940, 560, 0x03101d, 0.78).setStrokeStyle(3, 0x93c5fd, 0.6);

    const title = this.add
      .text(centerX, centerY - 205, 'RUNMAGEDDON RUNNER', {
        fontFamily: 'monospace',
        fontSize: '70px',
        color: '#f8fafc',
        stroke: '#0b1220',
        strokeThickness: 9,
      })
      .setOrigin(0.5);

    const subtitle = this.add
      .text(centerX, centerY - 126, 'Przebiegnij juz teraz Runmageddon z Alvernia Planet!', {
        fontFamily: 'monospace',
        fontSize: '25px',
        color: '#dbeafe',
      })
      .setOrigin(0.5);

    const teaser = this.add
      .text(centerX, centerY - 34, 'Tryb endless, rosnaca predkosc, ranking lokalny', {
        fontFamily: 'monospace',
        fontSize: '22px',
        color: '#bfdbfe',
      })
      .setOrigin(0.5);

    const startButton = this.add
      .text(centerX - 150, centerY + 126, 'START', {
        fontFamily: 'monospace',
        fontSize: '50px',
        color: '#dcfce7',
        backgroundColor: '#166534',
        padding: { x: 36, y: 14 },
        stroke: '#052e16',
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    const rankingButton = this.add
      .text(centerX + 170, centerY + 126, 'RANKING', {
        fontFamily: 'monospace',
        fontSize: '42px',
        color: '#dbeafe',
        backgroundColor: '#1e3a8a',
        padding: { x: 30, y: 16 },
        stroke: '#0f172a',
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    this.menuContainer = this.add.container(0, 0, [shadow, card, title, subtitle, teaser, startButton, rankingButton]);

    const instrCard = this.add.rectangle(centerX, centerY, 940, 500, 0x03101d, 0.86).setStrokeStyle(3, 0xa7f3d0, 0.58);
    const instrTitle = this.add
      .text(centerX, centerY - 204, 'INSTRUKCJA', {
        fontFamily: 'monospace',
        fontSize: '44px',
        color: '#e2e8f0',
      })
      .setOrigin(0.5);
    const instrControls = this.add
      .text(centerX, centerY - 154, 'SPACE/KLIK = SKOK   |   SHIFT/S/DOL = SLIDE', {
        fontFamily: 'monospace',
        fontSize: '24px',
        color: '#bfdbfe',
      })
      .setOrigin(0.5);

    const rows = [];
    const addIcon = (x, y, texture, crop) => {
      const icon = this.add.image(x, y, texture).setOrigin(0.5);
      if (crop) {
        const cx = Math.floor(icon.width * crop.x);
        const cy = Math.floor(icon.height * crop.y);
        const cw = Math.floor(icon.width * crop.w);
        const ch = Math.floor(icon.height * crop.h);
        icon.setCrop(cx, cy, cw, ch);
      }
      icon.setDisplaySize(100, 46);
      rows.push(icon);
    };

    const jumpY = centerY - 70;
    const jumpStartX = centerX - 300;
    const jumpGap = 110;
    addIcon(jumpStartX + jumpGap * 0, jumpY, 'obstacle_log', { x: 0.2, y: 0.34, w: 0.6, h: 0.28 });
    addIcon(jumpStartX + jumpGap * 1, jumpY, 'obstacle_tires', { x: 0.23, y: 0.3, w: 0.54, h: 0.34 });
    addIcon(jumpStartX + jumpGap * 2, jumpY, 'obstacle_barbed_wire', { x: 0.17, y: 0.28, w: 0.66, h: 0.3 });
    addIcon(jumpStartX + jumpGap * 3, jumpY, 'obstacle_pit', { x: 0.18, y: 0.38, w: 0.64, h: 0.24 });
    rows.push(
      this.add
        .text(centerX + 230, jumpY, 'PRZESKOCZ', {
          fontFamily: 'monospace',
          fontSize: '28px',
          color: '#f8fafc',
        })
        .setOrigin(0, 0.5),
    );

    const slideY = centerY + 8;
    addIcon(centerX - 90, slideY, 'obstacle_monkey_bars', { x: 0.14, y: 0.24, w: 0.72, h: 0.36 });
    rows.push(
      this.add
        .text(centerX + 120, slideY, 'ZROB SLIDE', {
          fontFamily: 'monospace',
          fontSize: '28px',
          color: '#f8fafc',
        })
        .setOrigin(0.5),
    );

    const slowY = centerY + 84;
    addIcon(centerX - 90, slowY, 'obstacle_mud', { x: 0.14, y: 0.33, w: 0.72, h: 0.33 });
    rows.push(
      this.add
        .text(centerX + 120, slowY, 'SPOWALNIA (-500 PKT)', {
          fontFamily: 'monospace',
          fontSize: '24px',
          color: '#f8fafc',
        })
        .setOrigin(0.5),
    );

    const instrStart = this.add
      .text(centerX, centerY + 176, 'Nacisnij SPACE / ENTER, aby wystartowac', {
        fontFamily: 'monospace',
        fontSize: '24px',
        color: '#e2e8f0',
      })
      .setOrigin(0.5);

    this.instructionContainer = this.add
      .container(0, 0, [instrCard, instrTitle, instrControls, ...rows, instrStart])
      .setVisible(false)
      .setAlpha(0)
      .setDepth(30);

    const rankCard = this.add.rectangle(centerX, centerY, 760, 460, 0x03101d, 0.9).setStrokeStyle(3, 0xfde68a, 0.6);
    const rankTitle = this.add
      .text(centerX, centerY - 180, 'RANKING TOP 10', {
        fontFamily: 'monospace',
        fontSize: '46px',
        color: '#fde68a',
      })
      .setOrigin(0.5);

    const rankingText = this.createRankingText(centerX, centerY - 118);

    const closeButton = this.add
      .text(centerX, centerY + 176, 'POWROT', {
        fontFamily: 'monospace',
        fontSize: '34px',
        color: '#e2e8f0',
        backgroundColor: '#334155',
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    this.rankingContainer = this.add
      .container(0, 0, [rankCard, rankTitle, rankingText, closeButton])
      .setVisible(false)
      .setAlpha(0)
      .setDepth(32);

    const startRun = () => {
      if (!this.isArmed) return;
      this.scene.start('GameScene');
      if (!this.scene.isActive('UIScene')) {
        this.scene.launch('UIScene');
      }
    };

    startButton.on('pointerdown', () => {
      this.isArmed = true;
      this.tweens.add({
        targets: this.menuContainer,
        alpha: 0,
        y: -20,
        duration: 240,
        ease: 'Quad.Out',
        onComplete: () => {
          this.menuContainer.setVisible(false);
          this.instructionContainer.setVisible(true);
          this.tweens.add({
            targets: this.instructionContainer,
            alpha: 1,
            y: '+=12',
            duration: 260,
            ease: 'Quad.Out',
          });
        },
      });
    });

    rankingButton.on('pointerdown', () => {
      this.menuContainer.setVisible(false);
      this.rankingContainer.setVisible(true);
      this.rankingContainer.alpha = 0;
      this.tweens.add({
        targets: this.rankingContainer,
        alpha: 1,
        duration: 220,
        ease: 'Quad.Out',
      });
    });

    closeButton.on('pointerdown', () => {
      this.rankingContainer.setVisible(false);
      this.menuContainer.setVisible(true);
      this.menuContainer.alpha = 1;
    });

    this.input.keyboard.on('keydown-SPACE', startRun);
    this.input.keyboard.on('keydown-ENTER', startRun);

    this.events.once('shutdown', () => {
      this.input.keyboard.off('keydown-SPACE', startRun);
      this.input.keyboard.off('keydown-ENTER', startRun);
    });
  }

  createRankingText(centerX, topY) {
    const ranking = Storage.getRanking().slice(0, 10);
    const lines = ranking.length
      ? ranking.map((entry, idx) => `${idx + 1}. ${entry.name}: ${entry.score}`)
      : ['Brak wynikow'];

    return this.add
      .text(centerX, topY, lines.join('\n'), {
        fontFamily: 'monospace',
        fontSize: '28px',
        color: '#f8fafc',
        lineSpacing: 8,
        align: 'center',
      })
      .setOrigin(0.5, 0);
  }
}
