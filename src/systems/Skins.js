export const DEFAULT_SKIN_ID = 'default';

const SKINS = {
  default: {
    id: 'default',
    label: 'PODSTAWOWY',
    textureKeys: {
      runStart: 'runner_run_1',
      dead: 'runner_dead',
      preview: 'runner_run_1',
    },
    animKeys: {
      idle: 'runner-idle',
      run: 'runner-run',
      slide: 'runner-slide',
      jump: 'runner-jump',
    },
    gameplayScale: 1,
    crops: {
      run: { x: 0.29, y: 0.16, w: 0.42, h: 0.7 },
      slide: { x: 0.23, y: 0.08, w: 0.54, h: 0.84 },
      jump: { x: 0.23, y: 0.08, w: 0.54, h: 0.84 },
      dead: { x: 0.23, y: 0.08, w: 0.54, h: 0.84 },
    },
  },
  o: {
    id: 'o',
    label: 'PANI OLIWIA',
    textureKeys: {
      runStart: 'runner_o_start',
      dead: 'runner_o_dead',
      preview: 'runner_o_idle_1',
    },
    animKeys: {
      idle: 'runner-o-idle',
      run: 'runner-o-run',
      slide: 'runner-o-slide',
      jump: 'runner-o-jump',
    },
    gameplayScale: 0.84,
    crops: {
      run: { x: 0.14, y: 0.03, w: 0.72, h: 0.94 },
      slide: { x: 0.18, y: 0.04, w: 0.64, h: 0.9 },
      jump: { x: 0.18, y: 0.04, w: 0.64, h: 0.9 },
      dead: { x: 0.18, y: 0.04, w: 0.64, h: 0.9 },
    },
  },
  michalina: {
    id: 'michalina',
    label: 'PANI MICHALINA',
    textureKeys: {
      runStart: 'runner_m_start',
      dead: 'runner_m_dead',
      preview: 'runner_m_idle_1',
    },
    animKeys: {
      idle: 'runner-m-idle',
      run: 'runner-m-run',
      slide: 'runner-m-slide',
      jump: 'runner-m-jump',
    },
    gameplayScale: 0.82,
    slideLift: 2,
    deadYOffset: 20,
    crops: {
      run: { x: 0.08, y: 0.01, w: 0.84, h: 0.98 },
      slide: { x: 0.08, y: 0.01, w: 0.84, h: 0.98 },
      jump: { x: 0.1, y: 0.01, w: 0.8, h: 0.97 },
      dead: { x: 0, y: 0.44, w: 1, h: 0.56 },
    },
  },
  paulina: {
    id: 'paulina',
    label: 'PANI PAULINA',
    textureKeys: {
      runStart: 'runner_p_run_1',
      dead: 'runner_p_dead',
      preview: 'runner_p_idle_1',
    },
    animKeys: {
      idle: 'runner-p-idle',
      run: 'runner-p-run',
      slide: 'runner-p-slide',
      jump: 'runner-p-jump',
    },
    gameplayScale: 0.82,
    crops: {
      run: { x: 0.14, y: 0.03, w: 0.72, h: 0.94 },
      slide: { x: 0.18, y: 0.04, w: 0.64, h: 0.9 },
      jump: { x: 0.18, y: 0.04, w: 0.64, h: 0.9 },
      dead: { x: 0.18, y: 0.04, w: 0.64, h: 0.9 },
    },
  },
};

export function getSkinDefinition(skinId) {
  return SKINS[skinId] ?? SKINS[DEFAULT_SKIN_ID];
}

export function getSkinOptions() {
  return [SKINS.default, SKINS.o, SKINS.michalina, SKINS.paulina];
}

export function isSkinReady(scene, skinId) {
  const skin = getSkinDefinition(skinId);
  if (!skin || skin.id === DEFAULT_SKIN_ID) return true;

  const runStartOk = scene.textures.exists(skin.textureKeys.runStart);
  const deadOk = scene.textures.exists(skin.textureKeys.dead);
  const previewOk = scene.textures.exists(skin.textureKeys.preview);
  const runAnimOk = scene.anims.exists(skin.animKeys.run);
  const slideAnimOk = scene.anims.exists(skin.animKeys.slide);
  const jumpAnimOk = scene.anims.exists(skin.animKeys.jump);
  const idleAnimOk = scene.anims.exists(skin.animKeys.idle);

  return runStartOk && deadOk && previewOk && runAnimOk && slideAnimOk && jumpAnimOk && idleAnimOk;
}

export function resolveSkinId(scene, requestedSkinId) {
  return isSkinReady(scene, requestedSkinId) ? requestedSkinId : DEFAULT_SKIN_ID;
}
