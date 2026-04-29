(() => {
  'use strict';

  const SOURCES = ['CAM 1', 'CAM 2', 'CAM 3', 'CPU', 'GFX', 'M1', 'M2', 'ME1', 'BLK', 'BARS'];
  const KEY_MODES = ['SELF', 'LUMA', 'CHR'];
  const DSK_COUNT = 4;
  const DEFAULT_SOURCE_INDEX = 8;
  const DEFAULT_DVE_SIZE = 100;
  const DEFAULT_DVE_BORDER_WIDTH = 4;
  const DEFAULT_DVE_BORDER_COLOR = '#ffffff';
  const DEFAULT_DVE_CROP_H = 0;
  const DEFAULT_DVE_CROP_V = 0;
  const NUDGE_STEP = 3;
  const DISSOLVE_DURATION = 1000;
  const DSK_AUTO_DURATION = 400;
  const PHONE_WIDTH = 500;
  const DESKTOP_WIDTH = 1720;
  const DESKTOP_PANEL_MAX_WIDTH = 2240;
  const TABLET_LAYOUT_WIDTH = 1366;
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xdawpdkp';
  const SOURCE_IMAGE_STYLE = 'width:100%;height:100%;object-fit:cover;border-radius:2px;';
  const OVERLAY_IMAGE_STYLE = 'width:100%;height:100%;object-fit:cover;';
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const CHROMA_HEX = Object.freeze({
    green: '#00ff00',
    blue: '#0000ff',
  });
  const CHROMA_KEY_SETTINGS = Object.freeze({
    green: Object.freeze({ hardMin: 72, softMin: 44, hardRatio: 1.22, softRatio: 1.08, fadeScale: 880 }),
    blue: Object.freeze({ hardMin: 72, softMin: 44, hardRatio: 1.2, softRatio: 1.05, fadeScale: 900 }),
  });
  const CHROMA_FILTER_SETTINGS = Object.freeze({
    competingChannelWeight: 0.82,
    alphaExponent: 1.25,
    alphaAmplitude: 1,
  });
  const EXACT_BLACK_DISCRETE_TABLE = `0 ${Array.from({ length: 255 }, () => '1').join(' ')}`;
  const FULLSCREEN_LABEL = '⛶ FULLSCREEN';
  const EXIT_FULLSCREEN_LABEL = '⛶ EXIT FULL';
    const PREVIEW_KEY_LABELS = ['KEY 1', 'KEY 2', 'KEY 3', 'KEY 4'];
  const PREVIEW_SOURCE_KEY_MAP = Object.freeze({ '1': 0, '2': 1, '3': 2, '4': 3, '5': 4, '6': 5, '7': 6, '8': 7, '9': 8, '0': 9 });
  const PREVIEW_SOURCE_SHORTCUTS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  const KEY_MODE_INDEX = Object.freeze({ SELF: 0, LUMA: 1, CHR: 2 });
  const IS_APPLE_SAFARI = /Safari/i.test(navigator.userAgent) && !/Chrome|CriOS|Edg|OPR|Firefox|FxiOS/i.test(navigator.userAgent);
  const ME1_SOURCE_INDEX = SOURCES.indexOf('ME1');
  const SURFACE_DISPLAY_NAMES = Object.freeze({ ME_PP: 'ME P/P', ME1: 'ME 1' });
  const MACRO_SLOT_COUNT = 4;
  const MACRO_STORAGE_KEY = 'switchup_studio_macro_slots_v6517';
  const ME_MEMORY_SLOT_COUNT = 4;
  const LEGACY_MACRO_STORAGE_KEYS = Object.freeze(['virtual_switcher_macro_slots_v642', 'virtual_switcher_macro_slots_v641', 'virtual_switcher_macro_slots_v6218', 'virtual_switcher_macro_slots_v6217']);

  const SOURCE_IMAGES = Object.freeze({
    'CAM 1': 'assets/cam-1.png',
    'CAM 2': 'assets/cam-2.png',
    'CAM 3': 'assets/cam-3.png',
    CPU: 'assets/cpu.png',
    GFX: 'assets/gfx.png',
    M1: 'assets/m1.png',
    M2: 'assets/m2.png',
    BLK: 'assets/blk.png',
    BARS: 'assets/bars.png',
  });

  const SOURCE_IMAGES_ALPHA = Object.freeze({
    M1: 'assets/m1.alpha.png',
    M2: 'assets/m2.alpha.png',
  });

  function buildFrameSequence(folderName, prefix, frameCount) {
    return Array.from({ length: frameCount }, (_, index) => `assets/transitions/${folderName}/${prefix}_${String(index).padStart(5, '0')}.png`);
  }

  const MEDIA_LIBRARY = Object.freeze({
    'stock-m1': { name: 'Host', fill: 'assets/m1.png', alpha: 'assets/m1.alpha.png', keyType: 'SELF', keyLabel: 'Self key · alpha' },
    'stock-m2': { name: 'Guest', fill: 'assets/m2.png', alpha: 'assets/m2.alpha.png', keyType: 'SELF', keyLabel: 'Self key · alpha' },
    'live-bug': { name: 'Live Bug', fill: 'assets/media/live-on-air.png', keyType: 'CHR', chromaColor: 'blue', keyLabel: 'Chroma key · blue' },
    'ots': { name: 'OTS', fill: 'assets/media/ots.png', keyType: 'CHR', chromaColor: 'green', keyLabel: 'Chroma key · green' },
    'full-screen-graphic': { name: 'Full Screen Graphic', fill: 'assets/media/full-screen-graphic.png', keyType: 'LUMA', keyLabel: 'Luma key · black out' },
    'side-graphic-tips': { name: 'Side Graphic', fill: 'assets/media/side-graphic-tips.png', alpha: 'assets/media/side-graphic-tips.png', keyType: 'SELF', keyLabel: 'Self key · alpha gradient' },
  });

  const MEDIA_TRANSITIONS = Object.freeze({
    'down-right-to-left': {
      name: 'Down Right to Left',
      frames: buildFrameSequence('DOWN_RIGHT_TO_LEFT', 'DOWN_RIGHT_TO_LEFT', 35),
      cutFrame: 16,
      fps: 30,
      keyType: 'SELF',
      keyLabel: 'Alpha sequence · self',
    },
    'left-to-right': {
      name: 'Left to Right',
      frames: buildFrameSequence('LEFT_TO_RIGHT', 'LEFT_TO_RIGHT', 24),
      cutFrame: 10,
      fps: 30,
      keyType: 'SELF',
      keyLabel: 'Alpha sequence · self',
    },
  });

  const DEFAULT_MEDIA_BANKS = Object.freeze({
    M1: 'stock-m1',
    M2: 'stock-m2',
  });

  const DEFAULT_MEDIA_TRANSITION_SLOTS = Object.freeze({
    MT1: 'down-right-to-left',
  });

  const DEFAULT_ACTIVE_MEDIA_TRANSITION_SLOT = 'MT1';

  const PRELOAD_IMAGE_SOURCES = Array.from(new Set([
    ...Object.values(SOURCE_IMAGES),
    ...Object.values(SOURCE_IMAGES_ALPHA),
    ...Object.values(MEDIA_LIBRARY).flatMap((media) => [media.fill, media.alpha].filter(Boolean)),
    ...Object.values(DEFAULT_MEDIA_TRANSITION_SLOTS).flatMap((transitionId) => (MEDIA_TRANSITIONS[transitionId] ? MEDIA_TRANSITIONS[transitionId].frames : [])),
  ]));

  const imageAssetCache = new Map();
  const processedAssetCache = new Map();

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function loadImageAsset(src) {
    if (!src) return Promise.resolve(null);
    if (imageAssetCache.has(src)) return imageAssetCache.get(src);

    const promise = new Promise((resolve) => {
      const image = new Image();
      let settled = false;
      const finish = (result) => {
        if (settled) return;
        settled = true;
        resolve(result);
      };

      image.decoding = 'async';
      image.onload = async () => {
        try {
          if (typeof image.decode === 'function') await image.decode();
        } catch (error) {
          // Ignore decode failures and continue with the loaded asset.
        }
        finish(image);
      };
      image.onerror = () => finish(null);
      image.src = src;

      if (image.complete && image.naturalWidth > 0) {
        image.onload();
      }
    });

    imageAssetCache.set(src, promise);
    return promise;
  }

  function decodeImageSource(src) {
    return loadImageAsset(src).then(() => undefined);
  }

  function getProcessedAssetCacheKey(imageSrc, processor, color = '') {
    return `${processor}:${color}:${imageSrc}`;
  }

  async function createProcessedAssetUrl(imageSrc, processor, color = '') {
    const image = await loadImageAsset(imageSrc);
    if (!image) return '';

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) return '';

    canvas.width = image.naturalWidth || image.width;
    canvas.height = image.naturalHeight || image.height;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    if (processor === 'luma') applyLumaKey(imageData.data);
    else if (processor === 'chr') applyChromaKey(imageData.data, color || 'green');
    context.putImageData(imageData, 0, 0);

    return canvas.toDataURL('image/png');
  }

  function ensureProcessedAssetUrl(imageSrc, processor, color = '') {
    if (!imageSrc) return Promise.resolve('');
    const cacheKey = getProcessedAssetCacheKey(imageSrc, processor, color);
    if (processedAssetCache.has(cacheKey)) return processedAssetCache.get(cacheKey);

    const promise = createProcessedAssetUrl(imageSrc, processor, color).catch(() => '');
    processedAssetCache.set(cacheKey, promise);
    return promise;
  }

  function preloadImageAssets() {
    PRELOAD_IMAGE_SOURCES.forEach((src) => {
      decodeImageSource(src);
    });

    Object.values(MEDIA_LIBRARY).forEach((media) => {
      if (media.keyType === 'LUMA') ensureProcessedAssetUrl(media.fill, 'luma');
      if (media.keyType === 'CHR') ensureProcessedAssetUrl(media.fill, 'chr', media.chromaColor || 'green');
    });
  }

  async function ensureSourceReady(sourceName) {
    if (sourceName === 'ME1') {
      const me1Bus = getSurfaceSnapshot('ME1');
      const me1Base = getSourceName(me1Bus.pgmIndex);
      const pending = [ensureSourceReady(me1Base)];
      me1Bus.dskState.forEach((dsk) => {
        if (!dsk.active) return;
        pending.push(decodeImageSource(getSourceFillImage(getSourceName(dsk.sourceIndex))));
        pending.push(decodeImageSource(getSourceAlphaImage(getSourceName(dsk.sourceIndex))));
      });
      await Promise.all(pending);
      return;
    }

    await Promise.all([
      decodeImageSource(getSourceFillImage(sourceName)),
      decodeImageSource(getSourceAlphaImage(sourceName)),
    ]);
  }

  function setOpacityTransition(element, durationMs) {
    if (!element) return;
    element.style.transition = durationMs ? `opacity ${durationMs}ms linear` : 'none';
  }

  let layoutTimer = null;
  function scheduleLayout() {
    if (layoutTimer) cancelAnimationFrame(layoutTimer);
    layoutTimer = requestAnimationFrame(() => {
      layoutTimer = null;
      applyLayout();
    });
  }

  const $ = (id) => document.getElementById(id);
  const setPressed = (element, pressed) => element && element.setAttribute('aria-pressed', String(pressed));
  const showWhen = (element, shouldShow) => {
    if (element) element.hidden = !shouldShow;
  };
  const setPracticeQuizToggle = (pressed) => {
    if (!dom.quizPracticeToggle) return;
    const isPressed = !!pressed;
    dom.quizPracticeToggle.setAttribute('aria-pressed', String(isPressed));
    dom.quizPracticeToggle.classList.toggle('is-active', isPressed);
  };
  const getSourceName = (index) => SOURCES[index] || 'BLK';
  const currentDsk = () => state.dskState[state.activeDSK];
  const getSourceIndex = (sourceName) => SOURCES.indexOf(sourceName);
  const isFullscreenActive = () => !!(state.pseudoFullscreen || document.fullscreenElement || document.webkitFullscreenElement);
  const getSourceShortcutLabel = (index) => PREVIEW_SOURCE_SHORTCUTS[index] || '';


  function getSourceFillImage(sourceName) {
    if (sourceName === 'M1' || sourceName === 'M2') return getMediaOption(getBankMediaId(sourceName)).fill;
    return SOURCE_IMAGES[sourceName];
  }

  function getSourceAlphaImage(sourceName) {
    if (sourceName === 'M1' || sourceName === 'M2') return getMediaOption(getBankMediaId(sourceName)).alpha || getMediaOption(getBankMediaId(sourceName)).fill;
    return SOURCE_IMAGES_ALPHA[sourceName] || SOURCE_IMAGES[sourceName];
  }

  function getSourceMediaOption(sourceName) {
    if (sourceName !== 'M1' && sourceName !== 'M2') return null;
    return getMediaOption(getBankMediaId(sourceName));
  }

  function getPreferredSourceKeySettings(sourceName) {
    const media = getSourceMediaOption(sourceName);
    if (!media || !media.keyType || !Object.prototype.hasOwnProperty.call(KEY_MODE_INDEX, media.keyType)) return null;
    return {
      keyMode: KEY_MODE_INDEX[media.keyType],
      chrColor: media.chromaColor || null,
    };
  }

  function resetMediaResourcesToDefaults() {
    state.mediaBanks = { ...DEFAULT_MEDIA_BANKS };
    state.activeMediaBank = 'M1';
    state.mediaTransitionSlots = { ...DEFAULT_MEDIA_TRANSITION_SLOTS };
    state.activeMediaTransitionSlot = DEFAULT_ACTIVE_MEDIA_TRANSITION_SLOT;
  }

  function applyPreferredKeySettingsToDsk(dsk, sourceName) {
    const preferred = getPreferredSourceKeySettings(sourceName);
    if (!preferred || !dsk) return false;
    dsk.keyMode = preferred.keyMode;
    if (preferred.chrColor) dsk.chrColor = preferred.chrColor;
    return true;
  }

  function syncActiveDskState() {
    state.activeKeyMode = currentDsk().keyMode;
    state.activeDveEnabled = currentDsk().dveEnabled;
  }

  const createDefaultDskState = () => ({
    sourceIndex: DEFAULT_SOURCE_INDEX,
    active: false,
    keyMode: -1,
    dveEnabled: false,
    dveX: 50,
    dveY: 50,
    dveSize: DEFAULT_DVE_SIZE,
    dveBorderEnabled: false,
    dveBorderWidth: DEFAULT_DVE_BORDER_WIDTH,
    dveBorderColor: DEFAULT_DVE_BORDER_COLOR,
    dveCropH: DEFAULT_DVE_CROP_H,
    dveCropV: DEFAULT_DVE_CROP_V,
    chrColor: 'green',
    transitioning: false,
  });

  const state = {
    surfaceMode: 'ME_PP',
    surfaceStates: {
      ME_PP: null,
      ME1: null,
    },
    pgmIndex: DEFAULT_SOURCE_INDEX,
    pvwIndex: DEFAULT_SOURCE_INDEX,
    transitioning: false,
    activeKeyMode: -1,
    activeDveEnabled: false,
    activeDSK: 0,
    dskState: Array.from({ length: DSK_COUNT }, createDefaultDskState),
    previewKeyState: Array.from({ length: DSK_COUNT }, () => false),
    tieBackground: true,
    quizMode: false,
    quizName: '',
    quizClass: '',
    quizLevel: null,
    quizType: null,
    quizQuestions: [],
    quizCurrent: 0,
    quizScore: 0,
    quizResults: [],
    quizStartTime: 0,
    quizTimerInterval: null,
    quizAllCorrect: true,
    rtsStepMissed: false,
    practiceQuiz: false,
    pseudoFullscreen: false,
    lastBackgroundAction: null,
    lastDskActions: Array.from({ length: DSK_COUNT }, () => null),
    mediaBanks: { ...DEFAULT_MEDIA_BANKS },
    activeMediaBank: 'M1',
    mediaTransitionSlots: { ...DEFAULT_MEDIA_TRANSITION_SLOTS },
    activeMediaTransitionSlot: DEFAULT_ACTIVE_MEDIA_TRANSITION_SLOT,
    shortcutHintsVisible: false,
    macroSlots: Array.from({ length: MACRO_SLOT_COUNT }, () => null),
    meMemoryMode: null,
    meMemorySlots: {
      ME_PP: Array.from({ length: ME_MEMORY_SLOT_COUNT }, () => null),
      ME1: Array.from({ length: ME_MEMORY_SLOT_COUNT }, () => null),
    },
    dveMoreWindowOpen: false,
    dveUndoStack: [],
    actionUndoStack: [],
    bannersVisible: true,
  };



  function cloneDskState(dsk) {
    return { ...dsk };
  }

  function createDefaultBusState() {
    return {
      pgmIndex: DEFAULT_SOURCE_INDEX,
      pvwIndex: DEFAULT_SOURCE_INDEX,
      transitioning: false,
      activeKeyMode: -1,
      activeDveEnabled: false,
      activeDSK: 0,
      dskState: Array.from({ length: DSK_COUNT }, createDefaultDskState),
      previewKeyState: Array.from({ length: DSK_COUNT }, () => false),
      tieBackground: true,
      lastBackgroundAction: null,
      lastDskActions: Array.from({ length: DSK_COUNT }, () => null),
    };
  }

  function cloneBusState(bus) {
    return {
      pgmIndex: bus.pgmIndex,
      pvwIndex: bus.pvwIndex,
      transitioning: false,
      activeKeyMode: bus.activeKeyMode,
      activeDveEnabled: bus.activeDveEnabled,
      activeDSK: bus.activeDSK,
      dskState: bus.dskState.map(cloneDskState),
      previewKeyState: [...bus.previewKeyState],
      tieBackground: bus.tieBackground,
      lastBackgroundAction: bus.lastBackgroundAction ? { ...bus.lastBackgroundAction, previewKeys: [...bus.lastBackgroundAction.previewKeys] } : null,
      lastDskActions: bus.lastDskActions.map((action) => (action ? { ...action } : null)),
    };
  }

  function getCurrentBusSnapshot() {
    return cloneBusState({
      pgmIndex: state.pgmIndex,
      pvwIndex: state.pvwIndex,
      transitioning: false,
      activeKeyMode: state.activeKeyMode,
      activeDveEnabled: state.activeDveEnabled,
      activeDSK: state.activeDSK,
      dskState: state.dskState,
      previewKeyState: state.previewKeyState,
      tieBackground: state.tieBackground,
      lastBackgroundAction: state.lastBackgroundAction,
      lastDskActions: state.lastDskActions,
    });
  }

  function applyBusSnapshot(bus) {
    state.pgmIndex = bus.pgmIndex;
    state.pvwIndex = bus.pvwIndex;
    state.transitioning = false;
    state.activeKeyMode = bus.activeKeyMode;
    state.activeDveEnabled = bus.activeDveEnabled;
    state.activeDSK = bus.activeDSK;
    state.dskState = bus.dskState.map(cloneDskState);
    state.previewKeyState = [...bus.previewKeyState];
    state.tieBackground = bus.tieBackground;
    state.lastBackgroundAction = bus.lastBackgroundAction ? { ...bus.lastBackgroundAction, previewKeys: [...bus.lastBackgroundAction.previewKeys] } : null;
    state.lastDskActions = bus.lastDskActions.map((action) => (action ? { ...action } : null));
  }

  function normalizeBusState(bus, surfaceName) {
    const normalized = cloneBusState(bus);
    if (surfaceName === 'ME1') {
      if (normalized.pgmIndex === ME1_SOURCE_INDEX) normalized.pgmIndex = DEFAULT_SOURCE_INDEX;
      if (normalized.pvwIndex === ME1_SOURCE_INDEX) normalized.pvwIndex = DEFAULT_SOURCE_INDEX;
      normalized.dskState = normalized.dskState.map((dsk) => ({
        ...dsk,
        sourceIndex: dsk.sourceIndex === ME1_SOURCE_INDEX ? DEFAULT_SOURCE_INDEX : dsk.sourceIndex,
        transitioning: false,
      }));
    }
    normalized.transitioning = false;
    return normalized;
  }

  function getSurfaceSnapshot(surfaceName) {
    if (surfaceName === state.surfaceMode) return normalizeBusState(getCurrentBusSnapshot(), surfaceName);
    const stored = state.surfaceStates[surfaceName] || createDefaultBusState();
    return normalizeBusState(stored, surfaceName);
  }

  function persistCurrentSurfaceState() {
    state.surfaceStates[state.surfaceMode] = normalizeBusState(getCurrentBusSnapshot(), state.surfaceMode);
  }

  function cloneMEMemorySnapshot(snapshot) {
    if (!snapshot) return null;
    return { bus: cloneBusState(snapshot.bus) };
  }

  function buildMEMemorySnapshot(surfaceName) {
    return { bus: getSurfaceSnapshot(surfaceName) };
  }

  function updateMEMemoryUI() {
    Object.keys(dom.meMemorySlotButtons).forEach((surfaceName) => {
      const isActiveSurface = state.surfaceMode === surfaceName;
      const armedMode = state.meMemoryMode && state.meMemoryMode.surface === surfaceName ? state.meMemoryMode.action : null;
      const storeButton = dom.meMemoryStoreButtons[surfaceName];
      const recallButton = dom.meMemoryRecallButtons[surfaceName];
      if (storeButton) {
        storeButton.classList.toggle('me-memory-action-armed-store', armedMode === 'store');
        setPressed(storeButton, armedMode === 'store');
      }
      if (recallButton) {
        recallButton.classList.toggle('me-memory-action-armed-recall', armedMode === 'recall');
        setPressed(recallButton, armedMode === 'recall');
      }
      dom.meMemorySlotButtons[surfaceName].forEach((button, index) => {
        if (!button) return;
        const filled = !!state.meMemorySlots[surfaceName][index];
        button.classList.toggle('me-memory-slot-filled', filled);
        button.classList.toggle('me-memory-slot-active', isActiveSurface);
        button.classList.toggle('me-memory-slot-target-store', armedMode === 'store');
        button.classList.toggle('me-memory-slot-target-recall', armedMode === 'recall');
        button.title = `${SURFACE_DISPLAY_NAMES[surfaceName]} ${index + 1}${filled ? '' : ' · empty'}`;
        button.setAttribute('aria-label', `${SURFACE_DISPLAY_NAMES[surfaceName]} ${armedMode === 'store' ? 'store to' : armedMode === 'recall' ? 'recall from' : 'slot'} ${index + 1}${filled ? '' : ', empty'}`);
      });
    });
  }

  function armMEMemory(surfaceName, action) {
    if (!Object.prototype.hasOwnProperty.call(state.meMemorySlots, surfaceName) || state.quizMode) return;
    const sameMode = state.meMemoryMode && state.meMemoryMode.surface === surfaceName && state.meMemoryMode.action === action;
    state.meMemoryMode = sameMode ? null : { surface: surfaceName, action };
    updateMEMemoryUI();
  }

  function storeMEMemorySlot(surfaceName, index) {
    if (!Object.prototype.hasOwnProperty.call(state.meMemorySlots, surfaceName)) return;
    if (index < 0 || index >= ME_MEMORY_SLOT_COUNT) return;
    pushActionUndoState();
    state.meMemorySlots[surfaceName][index] = cloneMEMemorySnapshot(buildMEMemorySnapshot(surfaceName));
    state.meMemoryMode = null;
    updateMEMemoryUI();
    lessonCheckInteraction();
  }

  function recallMEMemorySlot(surfaceName, index) {
    if (!Object.prototype.hasOwnProperty.call(state.meMemorySlots, surfaceName)) return;
    if (index < 0 || index >= ME_MEMORY_SLOT_COUNT) return;
    const snapshot = cloneMEMemorySnapshot(state.meMemorySlots[surfaceName][index]);
    state.meMemoryMode = null;
    if (!snapshot) {
      updateMEMemoryUI();
      return;
    }
    pushActionUndoState();
    state.surfaceStates[surfaceName] = cloneBusState(snapshot.bus);
    if (state.surfaceMode === surfaceName) {
      applyBusSnapshot(cloneBusState(snapshot.bus));
      syncActiveDskState();
      clearTransitionOverlays();
      refreshAllUI();
      lessonCheckInteraction();
      return;
    }
    refreshAllUI();
    lessonCheckInteraction();
  }

  function handleMEMemorySlot(surfaceName, index) {
    const mode = state.meMemoryMode;
    if (!mode || mode.surface !== surfaceName) return;
    if (mode.action === 'store') {
      storeMEMemorySlot(surfaceName, index);
      return;
    }
    if (mode.action === 'recall') recallMEMemorySlot(surfaceName, index);
  }

  function isSourceSelectable(index) {
    return !(state.surfaceMode === 'ME1' && index === ME1_SOURCE_INDEX);
  }

  function canSwitchSurface() {
    return !state.transitioning && !state.dskState.some((dsk) => dsk.transitioning);
  }

  state.surfaceStates.ME_PP = getCurrentBusSnapshot();
  state.surfaceStates.ME1 = createDefaultBusState();

  const dom = {
    wrapper: $('wrapper'),
    panel: $('panel'),
    deviceBadge: $('device-badge'),
    hotkeySplash: $('hotkey-splash'),
    menuButton: $('menu-btn'),
    hotkeySplashCloseButton: $('hotkey-splash-close'),
    utilityMenu: $('utility-menu'),
    menuFullscreenAction: $('menu-action-fullscreen'),
    menuLessonsAction: $('menu-action-lessons'),
    menuModeAction: $('menu-action-mode'),
    menuSurfaceAction: $('menu-action-surface'),
    menuMediaAction: $('menu-action-media'),
    menuHotkeysAction: $('menu-action-hotkeys'),
    menuResetAction: $('menu-action-reset'),
    menuUndoDveAction: $('menu-action-undo-dve'),
    menuResetDveAction: $('menu-action-reset-dve'),
    menuBannersAction: $('menu-action-banners'),
    meMemoryStoreButtons: {
      ME_PP: $('me-pp-store'),
      ME1: $('me-1-store'),
    },
    meMemoryRecallButtons: {
      ME_PP: $('me-pp-recall'),
      ME1: $('me-1-recall'),
    },
    meMemorySlotButtons: {
      ME_PP: Array.from({ length: ME_MEMORY_SLOT_COUNT }, (_, index) => $(`me-pp-slot-${index + 1}`)),
      ME1: Array.from({ length: ME_MEMORY_SLOT_COUNT }, (_, index) => $(`me-1-slot-${index + 1}`)),
    },
    macroQuickBar: $('macro-quick-bar'),
    macroLabelEls: Array.from({ length: MACRO_SLOT_COUNT }, (_, index) => $(`macro-slot-label-${index + 1}`)),
    macroStatusEls: Array.from({ length: MACRO_SLOT_COUNT }, (_, index) => $(`macro-slot-status-${index + 1}`)),
    macroSummaryEls: Array.from({ length: MACRO_SLOT_COUNT }, (_, index) => $(`macro-slot-summary-${index + 1}`)),
    macroSaveButtons: Array.from({ length: MACRO_SLOT_COUNT }, (_, index) => $(`macro-save-${index + 1}`)),
    macroRunButtons: Array.from({ length: MACRO_SLOT_COUNT }, (_, index) => $(`macro-run-${index + 1}`)),
    macroRenameButtons: Array.from({ length: MACRO_SLOT_COUNT }, (_, index) => $(`macro-rename-${index + 1}`)),
    macroClearButtons: Array.from({ length: MACRO_SLOT_COUNT }, (_, index) => $(`macro-clear-${index + 1}`)),
    macroQuickRunButtons: Array.from({ length: MACRO_SLOT_COUNT }, (_, index) => $(`macro-quick-run-${index + 1}`)),
    welcomeOverlay: $('welcome-overlay'),
    welcomeDialog: $('welcome-dialog'),
    modeFreeplayButton: $('mode-freeplay'),
    modeQuizButton: $('mode-quiz'),
    freeplayResetButton: $('freeplay-reset-btn'),
    fullscreenButton: $('fullscreen-btn'),
    surfaceMeppButton: $('surface-mepp'),
    surfaceMe1Button: $('surface-me1'),
    surfaceTogglePanel: $('surface-toggle-panel'),
    surfaceSummaryPp: $('surface-summary-pp'),
    surfaceSummaryMe1: $('surface-summary-me1'),
    mvPgmLabel: $('mv-pgm-label'),
    mvPvwLabel: $('mv-pvw-label'),
    mediaModalOverlay: $('media-modal-overlay'),
    mediaModalDialog: $('media-modal-dialog'),
    mediaOptionsGrid: $('media-options-grid'),
    mediaBankStatus: $('media-bank-status'),
    mediaBankTargetStatus: $('media-bank-target-status'),
    mediaTargetBankM1: $('media-target-bank-m1'),
    mediaTargetBankM2: $('media-target-bank-m2'),
    mediaTransitionStatus: $('media-transition-status'),
    mediaTransitionSlots: $('media-transition-slots'),
    mediaTransitionOptionsGrid: $('media-transition-options-grid'),
    mediaBankButton: $('media-bank-btn'),
    mediaTransitionButton: $('btn-media'),
    quizBar: $('quiz-bar'),
    quizPrompt: $('quiz-prompt'),
    quizQuestionNum: $('quiz-question-num'),
    quizScoreDisplay: $('quiz-score-display'),
    quizTimer: $('quiz-timer'),
    quizStartButton: $('quiz-start-btn'),
    quizCheckButton: $('quiz-check-btn'),
    quizSkipButton: $('quiz-skip-btn'),
    quizNameOverlay: $('quiz-name-overlay'),
    quizNameDialog: $('quiz-name-dialog'),
    quizNameInput: $('quiz-name-input'),
    quizClassInput: $('quiz-class-input'),
    quizPracticeToggle: $('quiz-practice-toggle'),
    quizLevelOverlay: $('quiz-level-overlay'),
    quizLevelDialog: $('quiz-level-dialog'),
    quizResultsOverlay: $('quiz-results-overlay'),
    quizResultsDialog: $('quiz-results-dialog'),
    quizResultsName: $('quiz-results-name'),
    quizResultsScore: $('quiz-results-score'),
    quizResultsTime: $('quiz-results-time'),
    quizResultsCode: $('quiz-results-code'),
    quizResultsBreakdown: $('quiz-results-breakdown'),
    keyTypeButtons: KEY_MODES.map((_, index) => $(`key-type-${index}`)),
    dveToggleButton: $('dve-toggle'),
    chrControls: $('chr-controls'),
    chrGreenButton: $('chr-green-btn'),
    chrBlueButton: $('chr-blue-btn'),
    // DVE editor shell (new polished UI)
    dveEditorShell: $('dve-editor-shell'),
    dveEdClose: $('dve-ed-close'),
    dveEdBadge: $('dve-ed-badge'),
    dvePosReadout: $('dve-pos-readout'),
    dveSlot: $('dve-slot'),
    dveSlotMeta: $('dve-slot-meta'),
    // Legacy refs — kept for backwards compat with quiz/macro restore
    dveControls: $('dve-editor-shell'),
    dveMoreButton: null,
    dveMoreWindow: $('dve-more-window'),
    dveMoreCloseButton: null,
    dveMoreStatus: $('dve-ed-badge'),
    dveCoordLabelLarge: null,
    dveSizeSliderExtended: null,
    dveSizeLabelExtended: null,
    dveCoordLabel: $('dve-pos-readout'),
    dveSizeSlider: document.querySelector('[data-dve-slider="scale"] .dve-track') || { value: 100, setAttribute: () => {} },
    dveSizeLabel: $('dve-ed-scale-val'),
    dveBorderToggle: $('dve-border-toggle'),
    dveBorderWidthSlider: { value: 4, setAttribute: () => {} },
    dveBorderWidthLabel: $('dve-border-width-label'),
    dveCropHSlider: { value: 0, setAttribute: () => {} },
    dveCropHLabel: $('dve-crop-h-val'),
    dveCropVSlider: { value: 0, setAttribute: () => {} },
    dveCropVLabel: $('dve-crop-v-val'),
    dveBorderColorPicker: { value: '#ffffff' },
    dveBorderSwatches: Array.from(document.querySelectorAll('#dve-border-swatches .dve-sw-color')),
    mvGrid: $('mv-grid'),
    mvPgmName: $('mv-pgm-name'),
    mvPvwName: $('mv-pvw-name'),
    mvPgmDissolve: $('mv-pgm-dissolve'),
    mediaTransitionOverlay: $('media-transition-overlay'),
    pgmRow: $('pgm-row'),
    pvwRow: $('pvw-row'),
    dskSourceRow: $('dsk-source-row'),
    tieBackgroundButton: $('tie-bg'),
    tieKeyButtons: Array.from({ length: DSK_COUNT }, (_, index) => $(`tie-key-${index + 1}`)),
    dskSelectButtons: Array.from({ length: DSK_COUNT }, (_, index) => $(`dsk-sel-${index + 1}`)),
    dskInfoEls: Array.from({ length: DSK_COUNT }, (_, index) => $(`dsk-info-${index + 1}`)),
    dskCutButtons: Array.from({ length: DSK_COUNT }, (_, index) => $(`dsk-cut-${index + 1}`)),
    dskAutoButtons: Array.from({ length: DSK_COUNT }, (_, index) => $(`dsk-auto-${index + 1}`)),
    dskOverlayEls: Array.from({ length: DSK_COUNT }, (_, index) => $(`dsk-overlay-${index + 1}`)),
    pvwOverlayEls: Array.from({ length: DSK_COUNT }, (_, index) => $(`pvw-overlay-${index + 1}`)),
    dskTransitionOutEls: Array.from({ length: DSK_COUNT }, (_, index) => $(`dsk-transition-out-${index + 1}`)),
    dskTransitionInEls: Array.from({ length: DSK_COUNT }, (_, index) => $(`dsk-transition-in-${index + 1}`)),
  };


  function getMediaOption(mediaId) {
    return MEDIA_LIBRARY[mediaId] || MEDIA_LIBRARY[DEFAULT_MEDIA_BANKS.M1];
  }

  function getBankMediaId(bankName) {
    return state.mediaBanks[bankName] || DEFAULT_MEDIA_BANKS[bankName] || DEFAULT_MEDIA_BANKS.M1;
  }

  function getMediaTransitionOption(transitionId) {
    return MEDIA_TRANSITIONS[transitionId] || MEDIA_TRANSITIONS[DEFAULT_MEDIA_TRANSITION_SLOTS.MT1];
  }

  function getMediaTransitionSlotId(slotName) {
    return state.mediaTransitionSlots[slotName] || DEFAULT_MEDIA_TRANSITION_SLOTS[slotName] || DEFAULT_MEDIA_TRANSITION_SLOTS.MT1;
  }

  function getMediaBankStatusText() {
    return `M1: ${getMediaOption(getBankMediaId('M1')).name} · M2: ${getMediaOption(getBankMediaId('M2')).name}`;
  }

  function getActiveMediaBank() {
    return state.activeMediaBank === 'M2' ? 'M2' : 'M1';
  }

  function getMediaTargetStatusText() {
    const activeBank = getActiveMediaBank();
    return `Now loading to ${activeBank}`;
  }

  function cloneSerializable(value) {
    return value ? JSON.parse(JSON.stringify(value)) : value;
  }


  function buildActionUndoSnapshot() {
    persistCurrentSurfaceState();
    return cloneSerializable({
      surfaceMode: state.surfaceMode,
      surfaceStates: {
        ME_PP: getSurfaceSnapshot('ME_PP'),
        ME1: getSurfaceSnapshot('ME1'),
      },
      mediaBanks: { ...state.mediaBanks },
      activeMediaBank: getActiveMediaBank(),
      mediaTransitionSlots: { ...state.mediaTransitionSlots },
      activeMediaTransitionSlot: state.activeMediaTransitionSlot,
      macroSlots: state.macroSlots,
      meMemorySlots: state.meMemorySlots,
      shortcutHintsVisible: !!state.shortcutHintsVisible,
    });
  }

  function canRecordActionUndo() {
    return !state.transitioning && !(state.quizMode && isRunTheShow());
  }

  function pushActionUndoState() {
    if (!canRecordActionUndo()) return false;
    const snapshot = buildActionUndoSnapshot();
    const lastEntry = state.actionUndoStack[state.actionUndoStack.length - 1];
    const signature = JSON.stringify(snapshot);
    if (lastEntry && lastEntry.signature === signature) return false;
    state.actionUndoStack.push({ snapshot, signature });
    if (state.actionUndoStack.length > 100) state.actionUndoStack.shift();
    updateUtilityMenuActions();
    return true;
  }

  function applyActionUndoSnapshot(snapshot) {
    if (!snapshot) return false;
    state.surfaceMode = snapshot.surfaceMode === 'ME1' ? 'ME1' : 'ME_PP';
    state.surfaceStates.ME_PP = cloneBusState(normalizeBusState(snapshot.surfaceStates && snapshot.surfaceStates.ME_PP ? snapshot.surfaceStates.ME_PP : createDefaultBusState(), 'ME_PP'));
    state.surfaceStates.ME1 = cloneBusState(normalizeBusState(snapshot.surfaceStates && snapshot.surfaceStates.ME1 ? snapshot.surfaceStates.ME1 : createDefaultBusState(), 'ME1'));
    state.mediaBanks = { ...DEFAULT_MEDIA_BANKS, ...(snapshot.mediaBanks || {}) };
    state.activeMediaBank = snapshot.activeMediaBank === 'M2' ? 'M2' : 'M1';
    state.mediaTransitionSlots = { ...DEFAULT_MEDIA_TRANSITION_SLOTS, ...(snapshot.mediaTransitionSlots || {}) };
    state.activeMediaTransitionSlot = DEFAULT_ACTIVE_MEDIA_TRANSITION_SLOT;
    state.macroSlots = Array.from({ length: MACRO_SLOT_COUNT }, (_, index) => normalizeMacroSnapshot(snapshot.macroSlots && snapshot.macroSlots[index]));
    state.meMemorySlots = {
      ME_PP: Array.from({ length: ME_MEMORY_SLOT_COUNT }, (_, index) => cloneMEMemorySnapshot(snapshot.meMemorySlots && snapshot.meMemorySlots.ME_PP ? snapshot.meMemorySlots.ME_PP[index] : null)),
      ME1: Array.from({ length: ME_MEMORY_SLOT_COUNT }, (_, index) => cloneMEMemorySnapshot(snapshot.meMemorySlots && snapshot.meMemorySlots.ME1 ? snapshot.meMemorySlots.ME1[index] : null)),
    };
    applyBusSnapshot(cloneBusState(state.surfaceStates[state.surfaceMode]));
    syncActiveDskState();
    state.dveMoreWindowOpen = false;
    state.transitioning = false;
    closeMediaModal();
    clearTransitionOverlays();
    setShortcutHintState(!!snapshot.shortcutHintsVisible);
    persistMacroSlots();
    refreshAllUI();
    return true;
  }

  function undoLastAction() {
    if (state.quizMode && isRunTheShow()) {
      updateUtilityMenuActions();
      return false;
    }
    const entry = state.actionUndoStack.pop();
    if (!entry || !entry.snapshot) {
      updateUtilityMenuActions();
      return false;
    }
    const applied = applyActionUndoSnapshot(entry.snapshot);
    updateUtilityMenuActions();
    return applied;
  }

  function getStorage() {
    try {
      return window.localStorage;
    } catch {
      return null;
    }
  }

  function normalizeMacroSnapshot(snapshot) {
    if (!snapshot || typeof snapshot !== 'object') return null;
    const surfaceMode = Object.prototype.hasOwnProperty.call(SURFACE_DISPLAY_NAMES, snapshot.surfaceMode) ? snapshot.surfaceMode : 'ME_PP';
    return {
      version: typeof snapshot.version === 'string' ? snapshot.version : '6.4.5',
      savedAt: typeof snapshot.savedAt === 'string' ? snapshot.savedAt : '',
      name: typeof snapshot.name === 'string' ? snapshot.name.trim().slice(0, 24) : '',
      surfaceMode,
      surfaceStates: {
        ME_PP: normalizeBusState(snapshot.surfaceStates && snapshot.surfaceStates.ME_PP ? snapshot.surfaceStates.ME_PP : createDefaultBusState(), 'ME_PP'),
        ME1: normalizeBusState(snapshot.surfaceStates && snapshot.surfaceStates.ME1 ? snapshot.surfaceStates.ME1 : createDefaultBusState(), 'ME1'),
      },
      mediaBanks: { ...DEFAULT_MEDIA_BANKS, ...(snapshot.mediaBanks || {}) },
      activeMediaBank: snapshot.activeMediaBank === 'M2' ? 'M2' : 'M1',
      mediaTransitionSlots: { ...DEFAULT_MEDIA_TRANSITION_SLOTS, ...(snapshot.mediaTransitionSlots || {}) },
      activeMediaTransitionSlot: DEFAULT_ACTIVE_MEDIA_TRANSITION_SLOT,
    };
  }

  function loadMacroSlots() {
    const storage = getStorage();
    if (!storage) return;
    try {
      const candidateKeys = [MACRO_STORAGE_KEY, ...LEGACY_MACRO_STORAGE_KEYS];
      const raw = candidateKeys.map((key) => storage.getItem(key)).find(Boolean);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;
      state.macroSlots = Array.from({ length: MACRO_SLOT_COUNT }, (_, index) => normalizeMacroSnapshot(parsed[index]));
    } catch {
      state.macroSlots = Array.from({ length: MACRO_SLOT_COUNT }, () => null);
    }
  }

  function persistMacroSlots() {
    const storage = getStorage();
    if (!storage) return;
    try {
      storage.setItem(MACRO_STORAGE_KEY, JSON.stringify(state.macroSlots));
    } catch {
      // Ignore storage write failures in restricted preview environments.
    }
  }

  function buildMacroSnapshot() {
    persistCurrentSurfaceState();
    return normalizeMacroSnapshot({
      version: '6.4.5',
      savedAt: new Date().toISOString(),
      name: '',
      surfaceMode: state.surfaceMode,
      surfaceStates: {
        ME_PP: getSurfaceSnapshot('ME_PP'),
        ME1: getSurfaceSnapshot('ME1'),
      },
      mediaBanks: { ...state.mediaBanks },
      activeMediaBank: getActiveMediaBank(),
      mediaTransitionSlots: { ...state.mediaTransitionSlots },
      activeMediaTransitionSlot: state.activeMediaTransitionSlot,
    });
  }

  function formatMacroTimestamp(isoString) {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      if (Number.isNaN(date.getTime())) return '';
      return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    } catch {
      return '';
    }
  }

  function sanitizeMacroName(name) {
    if (typeof name !== 'string') return '';
    return name.replace(/\s+/g, ' ').trim().slice(0, 24);
  }

  function getMacroDisplayName(snapshot, index) {
    if (!snapshot) return `MACRO ${index + 1}`;
    return sanitizeMacroName(snapshot.name) || `MACRO ${index + 1}`;
  }

  function getMacroQuickButtonLabel(snapshot, index) {
    if (!snapshot) return `${index + 1}`;
    const name = sanitizeMacroName(snapshot.name);
    if (!name) return `${index + 1}`;
    return name.length > 10 ? `${name.slice(0, 10)}…` : name;
  }

  function getMacroSummary(snapshot) {
    if (!snapshot) return 'Save the current switcher state for instant recall.';
    const bus = snapshot.surfaceStates[snapshot.surfaceMode] || snapshot.surfaceStates.ME_PP;
    const liveKeys = bus.dskState.filter((dsk) => dsk.active).length;
    const tiedKeys = bus.previewKeyState.filter(Boolean).length;
    const timeText = formatMacroTimestamp(snapshot.savedAt);
    const detailParts = [`PGM ${getSourceName(bus.pgmIndex)}`, `PVW ${getSourceName(bus.pvwIndex)}`];
    if (liveKeys) detailParts.push(`${liveKeys} KEY LIVE`);
    if (tiedKeys) detailParts.push(`${tiedKeys} TIED`);
    if (timeText) detailParts.push(timeText);
    return `${SURFACE_DISPLAY_NAMES[snapshot.surfaceMode]} · ${detailParts.join(' · ')}`;
  }

  function updateMacroUI() {
    const actionsLocked = state.quizMode || !canSwitchSurface();
    const quickBarAvailable = state.macroSlots.some(Boolean) && !state.quizMode;
    showWhen(dom.macroQuickBar, quickBarAvailable);

    state.macroSlots.forEach((snapshot, index) => {
      const labelEl = dom.macroLabelEls[index];
      const statusEl = dom.macroStatusEls[index];
      const summaryEl = dom.macroSummaryEls[index];
      const saveButton = dom.macroSaveButtons[index];
      const runButton = dom.macroRunButtons[index];
      const renameButton = dom.macroRenameButtons[index];
      const clearButton = dom.macroClearButtons[index];
      const quickRunButton = dom.macroQuickRunButtons[index];
      const hasSnapshot = !!snapshot;
      const displayName = getMacroDisplayName(snapshot, index);
      const quickLabel = getMacroQuickButtonLabel(snapshot, index);

      if (labelEl) labelEl.textContent = displayName;

      if (statusEl) {
        statusEl.textContent = hasSnapshot ? 'SAVED' : 'EMPTY';
        statusEl.classList.toggle('macro-slot-status-empty', !hasSnapshot);
      }

      if (summaryEl) {
        summaryEl.textContent = state.quizMode
          ? 'Macro save and recall are disabled while quiz mode is active.'
          : getMacroSummary(snapshot);
      }

      if (saveButton) {
        saveButton.disabled = state.quizMode;
        saveButton.setAttribute('aria-label', `Save the current switcher state to ${displayName}`);
      }

      if (runButton) {
        runButton.disabled = !hasSnapshot || actionsLocked;
        runButton.setAttribute('aria-label', hasSnapshot ? `Run ${displayName}` : `Macro ${index + 1} is empty`);
      }

      if (renameButton) {
        renameButton.disabled = !hasSnapshot || state.quizMode;
        renameButton.setAttribute('aria-label', hasSnapshot ? `Rename ${displayName}` : `Macro ${index + 1} is empty`);
      }

      if (clearButton) {
        clearButton.disabled = !hasSnapshot || state.quizMode;
        clearButton.setAttribute('aria-label', hasSnapshot ? `Clear ${displayName}` : `Macro ${index + 1} is empty`);
      }

      if (quickRunButton) {
        quickRunButton.textContent = quickLabel;
        quickRunButton.disabled = !hasSnapshot || actionsLocked || state.quizMode;
        quickRunButton.title = hasSnapshot ? displayName : `Macro ${index + 1} empty`;
        quickRunButton.setAttribute('aria-label', hasSnapshot ? `Run ${displayName}` : `Macro ${index + 1} is empty`);
      }
    });
  }

  function saveMacroSlot(index) {
    if (state.quizMode || index < 0 || index >= MACRO_SLOT_COUNT) return;
    pushActionUndoState();
    const existingSnapshot = normalizeMacroSnapshot(state.macroSlots[index]);
    const nextSnapshot = cloneSerializable(buildMacroSnapshot());
    if (existingSnapshot && existingSnapshot.name) nextSnapshot.name = sanitizeMacroName(existingSnapshot.name);
    state.macroSlots[index] = nextSnapshot;
    persistMacroSlots();
    updateMacroUI();
  }

  function renameMacroSlot(index) {
    if (state.quizMode || index < 0 || index >= MACRO_SLOT_COUNT) return;
    const snapshot = normalizeMacroSnapshot(state.macroSlots[index]);
    if (!snapshot) return;
    const currentName = sanitizeMacroName(snapshot.name) || `Macro ${index + 1}`;
    const proposedName = window.prompt(`Rename Macro ${index + 1}`, currentName);
    if (proposedName === null) return;
    const nextName = sanitizeMacroName(proposedName);
    if (snapshot.name === nextName) return;
    pushActionUndoState();
    snapshot.name = nextName;
    state.macroSlots[index] = cloneSerializable(snapshot);
    persistMacroSlots();
    updateMacroUI();
  }

  function clearMacroSlot(index) {
    if (state.quizMode || index < 0 || index >= MACRO_SLOT_COUNT) return;
    if (!state.macroSlots[index]) return;
    const label = getMacroDisplayName(state.macroSlots[index], index);
    if (!window.confirm(`Clear ${label}?`)) return;
    pushActionUndoState();
    state.macroSlots[index] = null;
    persistMacroSlots();
    updateMacroUI();
  }

  function runMacroSlot(index) {
    if (state.quizMode || !canSwitchSurface() || index < 0 || index >= MACRO_SLOT_COUNT) return;
    const snapshot = normalizeMacroSnapshot(state.macroSlots[index]);
    if (!snapshot) return;

    pushActionUndoState();
    state.macroSlots[index] = cloneSerializable(snapshot);
    state.surfaceStates.ME_PP = cloneBusState(snapshot.surfaceStates.ME_PP);
    state.surfaceStates.ME1 = cloneBusState(snapshot.surfaceStates.ME1);
    state.mediaBanks = { ...DEFAULT_MEDIA_BANKS, ...snapshot.mediaBanks };
    state.activeMediaBank = snapshot.activeMediaBank === 'M2' ? 'M2' : 'M1';
    state.mediaTransitionSlots = { ...DEFAULT_MEDIA_TRANSITION_SLOTS, ...snapshot.mediaTransitionSlots };
    state.activeMediaTransitionSlot = DEFAULT_ACTIVE_MEDIA_TRANSITION_SLOT;
    state.surfaceMode = snapshot.surfaceMode;

    applyBusSnapshot(cloneBusState(snapshot.surfaceStates[state.surfaceMode]));
    syncActiveDskState();
    clearTransitionOverlays();
    closeMediaModal();
    persistMacroSlots();
    refreshAllUI();
    dismissHotkeySplash();
  }

  function getMediaTransitionStatusText() {
    const transition = getMediaTransitionOption(getMediaTransitionSlotId('MT1'));
    return `LIVE · ${transition.name}`;
  }

  function getMediaMetaLabel(media) {
    if (!media) return '';
    if (media.keyLabel) return media.keyLabel;
    if (media.keyType === 'CHR') return `Chroma key · ${media.chromaColor || 'user choice'}`;
    if (media.keyType === 'LUMA') return 'Luma key · black out';
    if (media.keyType === 'SELF') return 'Self key · alpha';
    return 'Graphic';
  }

  function getTransitionMetaLabel(transition) {
    if (!transition) return '';
    return `${transition.frames.length} frames · cut frame ${transition.cutFrame} · ${transition.keyLabel || 'Alpha sequence'}`;
  }



  function renderMediaModal() {
    if (!dom.mediaOptionsGrid) return;
    const m1MediaId = getBankMediaId('M1');
    const m2MediaId = getBankMediaId('M2');

    if (dom.mediaBankStatus) {
      dom.mediaBankStatus.innerHTML = `
        <div class="media-loaded-pill">
          <span class="media-loaded-pill-label">M1</span>
          <span class="media-loaded-pill-name">${escapeHtml(getMediaOption(m1MediaId).name)}</span>
        </div>
        <div class="media-loaded-pill">
          <span class="media-loaded-pill-label">M2</span>
          <span class="media-loaded-pill-name">${escapeHtml(getMediaOption(m2MediaId).name)}</span>
        </div>`;
    }

    if (dom.mediaBankTargetStatus) {
      dom.mediaBankTargetStatus.textContent = 'Choose M1 or M2 on any graphic card to replace that bank.';
    }

    if (dom.mediaTransitionSlots) {
      const transition = getMediaTransitionOption(getMediaTransitionSlotId('MT1'));
      dom.mediaTransitionSlots.innerHTML = `
        <div class="media-transition-summary-card">
          <div class="media-transition-summary-top">
            <span class="media-transition-summary-label">Live</span>
          </div>
          <div class="media-transition-summary-name">${escapeHtml(transition.name)}</div>
          <div class="media-transition-summary-meta">${escapeHtml(getTransitionMetaLabel(transition))}</div>
        </div>`;
    }

    dom.mediaOptionsGrid.innerHTML = Object.entries(MEDIA_LIBRARY).map(([mediaId, media]) => {
      const m1Loaded = m1MediaId === mediaId;
      const m2Loaded = m2MediaId === mediaId;
      const footerText = m1Loaded && m2Loaded
        ? 'Loaded in M1 & M2'
        : m1Loaded
          ? 'Loaded in M1'
          : m2Loaded
            ? 'Loaded in M2'
            : 'Not loaded';
      const isLoaded = m1Loaded || m2Loaded;
      return `
        <article class="media-option-card${isLoaded ? ' is-loaded' : ''}">
          <div class="media-option-preview"><img src="${media.fill}" alt="${escapeHtml(media.name)} preview"></div>
          <div class="media-option-body">
            <div class="media-option-copy">
              <div class="media-option-name">${escapeHtml(media.name)}</div>
              <div class="media-option-meta">${escapeHtml(getMediaMetaLabel(media))}</div>
            </div>
            <div class="media-option-bank-tags">
              <button type="button" class="media-bank-tag${m1Loaded ? ' media-bank-tag-live' : ''}" onclick="assignMediaToBank('${mediaId}','M1')">M1</button>
              <button type="button" class="media-bank-tag${m2Loaded ? ' media-bank-tag-live' : ''}" onclick="assignMediaToBank('${mediaId}','M2')">M2</button>
            </div>
          </div>
          <div class="media-option-footer${isLoaded ? ' is-loaded' : ''}">${footerText}</div>
        </article>`;
    }).join('');

    if (dom.mediaTransitionOptionsGrid) {
      dom.mediaTransitionOptionsGrid.innerHTML = Object.entries(MEDIA_TRANSITIONS).map(([transitionId, transition]) => {
        const isActive = getMediaTransitionSlotId('MT1') === transitionId;
        const previewClass = transitionId === 'down-right-to-left' ? 'preview-drl' : 'preview-lr';
        return `
          <button type="button" class="media-transition-compact-card${isActive ? ' is-active' : ''}" onclick="assignMediaTransitionToSlot('${transitionId}','MT1')">
            <span class="media-transition-preview ${previewClass}" aria-hidden="true"></span>
            <span class="media-transition-compact-copy">
              <span class="media-transition-compact-top">
                <span class="media-transition-compact-name">${escapeHtml(transition.name)}</span>
                ${isActive ? '<span class="media-transition-compact-chip">LIVE</span>' : ''}
              </span>
              <span class="media-transition-compact-meta">${escapeHtml(getTransitionMetaLabel(transition))}</span>
            </span>
            <span class="media-transition-check" aria-hidden="true">
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2.5 6l2.5 2.5L9.5 3.5"/>
              </svg>
            </span>
          </button>`;
      }).join('');
    }
  }

  function updateMediaTransitionButton() {
    if (!dom.mediaTransitionButton) return;
    const transition = getMediaTransitionOption(getMediaTransitionSlotId('MT1'));
    dom.mediaTransitionButton.setAttribute('aria-label', `Media: play ${transition.name}`);
  }

  function setMediaButtonState(isOpen) {
    if (!dom.mediaBankButton) return;
    dom.mediaBankButton.setAttribute('aria-pressed', isOpen ? 'true' : 'false');
  }

  function openMediaModal() {
    if (!dom.mediaModalOverlay) return;
    renderMediaModal();
    dom.mediaModalOverlay.classList.add('show');
    setMediaButtonState(true);
    setTimeout(() => dom.mediaModalDialog && dom.mediaModalDialog.focus(), 30);
  }

  function closeMediaModal() {
    if (!dom.mediaModalOverlay) return;
    dom.mediaModalOverlay.classList.remove('show');
    setMediaButtonState(false);
    if (dom.mediaBankButton) dom.mediaBankButton.focus();
  }

  function toggleMediaModal() {
    if (!dom.mediaModalOverlay) return;
    if (dom.mediaModalOverlay.classList.contains('show')) {
      closeMediaModal();
      return;
    }
    openMediaModal();
  }

  function setActiveMediaBank(bankName) {
    if (bankName !== 'M1' && bankName !== 'M2') return;
    state.activeMediaBank = bankName;
    renderMediaModal();
  }

  function assignMediaToBank(mediaId, bankName) {
    if (!MEDIA_LIBRARY[mediaId] || !Object.prototype.hasOwnProperty.call(DEFAULT_MEDIA_BANKS, bankName)) return;
    if (state.mediaBanks[bankName] === mediaId) return;
    pushActionUndoState();
    state.mediaBanks[bankName] = mediaId;
    state.activeMediaBank = bankName;

    state.dskState.forEach((dsk, index) => {
      if (getSourceName(dsk.sourceIndex) !== bankName) return;
      dsk.active = false;
      dsk.transitioning = false;
      dsk.keyMode = -1;
      dsk.dveEnabled = false;
      state.previewKeyState[index] = false;
      if (index === state.activeDSK) syncActiveDskState();
    });

    renderMediaModal();
    refreshAllUI();
  }

  function assignMediaTransitionToSlot(transitionId, slotName = 'MT1') {
    if (!MEDIA_TRANSITIONS[transitionId]) return;
    if (state.mediaTransitionSlots.MT1 === transitionId) return;
    pushActionUndoState();
    state.mediaTransitionSlots.MT1 = transitionId;
    state.activeMediaTransitionSlot = 'MT1';
    renderMediaModal();
    refreshAllUI();
  }

  function armMediaTransitionSlot(slotName = 'MT1') {
    if (slotName !== 'MT1') return;
    state.activeMediaTransitionSlot = 'MT1';
    renderMediaModal();
    updateMediaTransitionButton();
  }

  function escapeHtml(value = '') {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function sourceMarkup(sourceName, size = 14) {
    const image = getSourceFillImage(sourceName);
    if (image) {
      return `<img src="${image}" style="${SOURCE_IMAGE_STYLE}" alt="${sourceName}">`;
    }
    return `<span class="mv-fallback-label" style="font-size:${size}px;color:#555;">${escapeHtml(sourceName)}</span>`;
  }

  function processCanvasElement(canvas, imageSrc, processor) {
    if (!canvas || !imageSrc) return;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) return;
    const image = new Image();
    image.onload = () => {
      if (!document.body.contains(canvas)) return;
      canvas.width = image.naturalWidth || image.width;
      canvas.height = image.naturalHeight || image.height;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      processor(imageData.data);
      context.putImageData(imageData, 0, 0);
    };
    image.onerror = () => {};
    image.src = imageSrc;
  }

  function processDynamicCanvases(container) {
    if (!container) return;
    container.querySelectorAll('canvas[data-process]').forEach((canvas) => {
      const processor = canvas.dataset.process;
      const imageSrc = canvas.dataset.image;
      if (processor === 'luma') {
        processCanvasElement(canvas, imageSrc, applyLumaKey);
        return;
      }
      if (processor === 'chr') {
        processCanvasElement(canvas, imageSrc, (data) => applyChromaKey(data, canvas.dataset.color || 'green'));
      }
    });
  }

  function svgEscape(value = '') {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  function buildKeyedSvgMarkup(imageSrc, keyMode, chrColor, filterId, sourceName) {
    if (!imageSrc || !keyMode || !filterId) return '';

    const escapedHref = svgEscape(imageSrc);
    const escapedLabel = svgEscape(`${sourceName} ${keyMode === 'CHR' ? `${chrColor || 'green'} chroma` : 'luma'} key`);

    if (keyMode === 'LUMA') {
      return `
        <svg class="mv-keyed-svg" viewBox="0 0 1920 1080" preserveAspectRatio="none" role="img" aria-label="${escapedLabel}" xmlns:xlink="http://www.w3.org/1999/xlink">
          <defs>
            <filter id="${filterId}" x="0%" y="0%" width="100%" height="100%" color-interpolation-filters="sRGB">
              <feComponentTransfer in="SourceGraphic" result="binaryRgb">
                <feFuncR type="discrete" tableValues="${EXACT_BLACK_DISCRETE_TABLE}"></feFuncR>
                <feFuncG type="discrete" tableValues="${EXACT_BLACK_DISCRETE_TABLE}"></feFuncG>
                <feFuncB type="discrete" tableValues="${EXACT_BLACK_DISCRETE_TABLE}"></feFuncB>
                <feFuncA type="identity"></feFuncA>
              </feComponentTransfer>
              <feColorMatrix in="binaryRgb" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 1 1 0 0" result="binaryAlpha"></feColorMatrix>
              <feComposite in="binaryAlpha" in2="SourceAlpha" operator="in" result="alphaMatte"></feComposite>
              <feComposite in="SourceGraphic" in2="alphaMatte" operator="in"></feComposite>
            </filter>
          </defs>
          <image href="${escapedHref}" xlink:href="${escapedHref}" width="1920" height="1080" preserveAspectRatio="xMidYMid slice" filter="url(#${filterId})"></image>
        </svg>
      `;
    }

    if (keyMode === 'CHR') {
      const isBlue = chrColor === 'blue';
      const competingWeight = CHROMA_FILTER_SETTINGS.competingChannelWeight;
      const redComponentMatrix = `${competingWeight} 0 0 0 0  ${competingWeight} 0 0 0 0  ${competingWeight} 0 0 0 0  0 0 0 1 0`;
      const secondaryChannelMatrix = isBlue
        ? `0 ${competingWeight} 0 0 0  0 ${competingWeight} 0 0 0  0 ${competingWeight} 0 0 0  0 0 0 1 0`
        : `0 0 ${competingWeight} 0 0  0 0 ${competingWeight} 0 0  0 0 ${competingWeight} 0 0  0 0 0 1 0`;
      const inverseKeyMatrix = isBlue
        ? '0 0 -1 0 1  0 0 -1 0 1  0 0 -1 0 1  0 0 0 1 0'
        : '0 -1 0 0 1  0 -1 0 0 1  0 -1 0 0 1  0 0 0 1 0';

      return `
        <svg class="mv-keyed-svg" viewBox="0 0 1920 1080" preserveAspectRatio="none" role="img" aria-label="${escapedLabel}" xmlns:xlink="http://www.w3.org/1999/xlink">
          <defs>
            <filter id="${filterId}" x="0%" y="0%" width="100%" height="100%" color-interpolation-filters="sRGB">
              <feColorMatrix in="SourceGraphic" type="matrix" values="${redComponentMatrix}" result="redComponent"></feColorMatrix>
              <feColorMatrix in="SourceGraphic" type="matrix" values="${secondaryChannelMatrix}" result="secondaryComponent"></feColorMatrix>
              <feColorMatrix in="SourceGraphic" type="matrix" values="${inverseKeyMatrix}" result="inverseKeyComponent"></feColorMatrix>
              <feBlend in="redComponent" in2="secondaryComponent" mode="lighten" result="maxColorChannels"></feBlend>
              <feBlend in="maxColorChannels" in2="inverseKeyComponent" mode="lighten" result="rawMatte"></feBlend>
              <feColorMatrix in="rawMatte" type="luminanceToAlpha" result="alphaBase"></feColorMatrix>
              <feComponentTransfer in="alphaBase" result="alphaMatte">
                <feFuncA type="gamma" amplitude="${CHROMA_FILTER_SETTINGS.alphaAmplitude}" exponent="${CHROMA_FILTER_SETTINGS.alphaExponent}" offset="0"></feFuncA>
              </feComponentTransfer>
              <feComposite in="SourceGraphic" in2="alphaMatte" operator="in"></feComposite>
            </filter>
          </defs>
          <image href="${escapedHref}" xlink:href="${escapedHref}" width="1920" height="1080" preserveAspectRatio="xMidYMid slice" filter="url(#${filterId})"></image>
        </svg>
      `;
    }

    return '';
  }

  function buildOverlayMarkup(dsk, index, canvasPrefix) {
    const sourceName = getSourceName(dsk.sourceIndex);
    const keyMode = getEffectiveKeyMode(dsk);
    if (!keyMode) return '';

    const wrapStart = dsk.dveEnabled ? dveWrapperStart(dsk) : '';
    const wrapEnd = dsk.dveEnabled ? dveWrapperEnd(dsk) : '';

    if (sourceName === 'ME1') {
      return `${wrapStart}${buildBusCompositeMarkup(getSurfaceSnapshot('ME1'), 'pgm', `${canvasPrefix}-me1`, 14)}${wrapEnd}`;
    }

    const imageSrc = getSourceFillImage(sourceName);
    if (!imageSrc) return '';

    if (keyMode === 'SELF') {
      const image = getSourceAlphaImage(sourceName) || imageSrc;
      return `${wrapStart}<img src="${image}" style="${OVERLAY_IMAGE_STYLE}" alt="${sourceName}">${wrapEnd}`;
    }

    if (keyMode === 'DVE_FULL') {
      return `${wrapStart}<img src="${imageSrc}" style="${OVERLAY_IMAGE_STYLE}" alt="${sourceName}">${wrapEnd}`;
    }

    if (keyMode === 'LUMA') {
      return `${wrapStart}${buildKeyedSvgMarkup(imageSrc, 'LUMA', null, `${canvasPrefix}-luma-filter`, sourceName)}${wrapEnd}`;
    }

    if (keyMode === 'CHR') {
      return `${wrapStart}${buildKeyedSvgMarkup(imageSrc, 'CHR', dsk.chrColor, `${canvasPrefix}-${dsk.chrColor || 'green'}-filter`, sourceName)}${wrapEnd}`;
    }

    return '';
  }

  function buildBusCompositeMarkup(busSnapshot, viewType, canvasPrefix, size = 14) {
    const baseIndex = viewType === 'pvw' ? busSnapshot.pvwIndex : busSnapshot.pgmIndex;
    const activeStates = viewType === 'pvw' ? busSnapshot.previewKeyState : busSnapshot.dskState.map((dsk) => dsk.active);
    const overlays = busSnapshot.dskState
      .map((dsk, index) => activeStates[index]
        ? `<div class="mv-composite-overlay">${buildOverlayMarkup(dsk, index, `${canvasPrefix}-${viewType}-${index}`)}</div>`
        : '')
      .join('');

    return `<div class="mv-composite-scene"><div class="mv-composite-base">${buildSourceAssetMarkup(getSourceName(baseIndex), size, `${canvasPrefix}-base`)}</div>${overlays}</div>`;
  }

  function buildSourceAssetMarkup(sourceName, size = 14, contextPrefix = 'source') {
    if (sourceName === 'ME1') {
      return buildBusCompositeMarkup(getSurfaceSnapshot('ME1'), 'pgm', `${contextPrefix}-me1`, size);
    }
    return sourceMarkup(sourceName, size);
  }

  function renderSourceDisplay(element, sourceIndex, contextPrefix = 'source-display') {
    if (!element) return;

    // Keep the active surface snapshot current so ME1 can be treated as a proper
    // live source on ME P/P, including during AUTO transitions.
    persistCurrentSurfaceState();

    element.innerHTML = buildSourceAssetMarkup(getSourceName(sourceIndex), 34, contextPrefix);
    processDynamicCanvases(element);
  }

  function refreshSourceGridContent() {
    SOURCES.forEach((sourceName, index) => {
      const cell = $(`mv-cell-${index}`);
      const content = cell ? cell.querySelector('.mv-cell-content') : null;
      if (!content) return;
      content.innerHTML = sourceName === 'ME1'
        ? buildBusCompositeMarkup(getSurfaceSnapshot('ME1'), 'pgm', `mv-grid-${index}`, 14)
        : sourceMarkup(sourceName, 14);
      processDynamicCanvases(content);
    });
  }

  function updateSourceAvailabilityUI() {
    const hideMe1 = state.surfaceMode === 'ME1';
    ['pgm-btn', 'pvw-btn', 'dsk-src-btn'].forEach((prefix) => {
      const button = $(`${prefix}-${ME1_SOURCE_INDEX}`);
      if (!button) return;
      button.classList.toggle('source-btn-hidden', hideMe1);
      button.disabled = hideMe1;
      button.tabIndex = hideMe1 ? -1 : 0;
      button.setAttribute('aria-hidden', hideMe1 ? 'true' : 'false');
    });
  }

  function updateSurfaceUI() {
    const me1Active = state.surfaceMode === 'ME1';
    dom.surfaceMeppButton.className = `surface-btn${!me1Active ? ' surface-btn-active' : ''}`;
    dom.surfaceMe1Button.className = `surface-btn${me1Active ? ' surface-btn-active' : ''}`;
    setPressed(dom.surfaceMeppButton, !me1Active);
    setPressed(dom.surfaceMe1Button, me1Active);
    dom.panel.classList.toggle('surface-me1-active', me1Active);
    if (dom.surfaceTogglePanel) dom.surfaceTogglePanel.classList.toggle('surface-panel-me1', me1Active);
    dom.mvPgmLabel.textContent = me1Active ? 'ME 1 PROGRAM' : 'PROGRAM';
    dom.mvPvwLabel.textContent = me1Active ? 'ME 1 PREVIEW' : 'PREVIEW';
    dom.surfaceSummaryPp.textContent = `ME P/P OUT: ${getSourceName(getSurfaceSnapshot('ME_PP').pgmIndex)}`;
    dom.surfaceSummaryMe1.textContent = `ME 1 OUT: ${getSourceName(getSurfaceSnapshot('ME1').pgmIndex)}`;
    updateSourceAvailabilityUI();
  }

  function refreshAllUI() {
    refreshKeyTypeButtons();
    updateTieButtons();
    updateMainBusUI();
    updateDSKUI();
    updateDSKOverlays();
    updateDVEControlsVisibility();
    updateCHRControlsVisibility();
    updateSurfaceUI();
    updateMediaTransitionButton();
    updateUtilityMenuActions();
    updateMacroUI();
    updateMEMemoryUI();
  }

  function switchSurface(surfaceName) {
    if (!Object.prototype.hasOwnProperty.call(SURFACE_DISPLAY_NAMES, surfaceName)) return;
    if (surfaceName === state.surfaceMode || !canSwitchSurface()) return;

    pushActionUndoState();
    persistCurrentSurfaceState();
    const nextBus = getSurfaceSnapshot(surfaceName);
    state.surfaceMode = surfaceName;
    state.surfaceStates[surfaceName] = cloneBusState(nextBus);
    applyBusSnapshot(nextBus);
    clearTransitionOverlays();
    refreshAllUI();
    lessonCheckInteraction();
  }

  function formatElapsed(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function getElapsedQuizSeconds() {
    return Math.max(0, Math.floor((Date.now() - state.quizStartTime) / 1000));
  }

  function quizCodeFrom(timeString) {
    const level = state.quizLevel || 'unknown';
    return btoa(`${state.quizName}|${level}|${state.quizScore}|${timeString}|${new Date().toISOString()}`)
      .slice(0, 12)
      .toUpperCase();
  }

  function buildQuizBreakdownText() {
    return state.quizResults
      .map((result, index) => {
        const icon = result.result === 'CORRECT' ? '[CORRECT]' : result.result === 'SKIPPED' ? '[SKIPPED]' : '[INCORRECT]';
        return `${index + 1}. ${icon} ${result.prompt} (${result.category})`;
      })
      .join('\n');
  }

  function buildQuizBreakdownMarkup() {
    return state.quizResults
      .map((result, index) => {
        const icon = result.result === 'CORRECT' ? '✓' : result.result === 'SKIPPED' ? '—' : '✗';
        const statusClass = result.result === 'CORRECT'
          ? 'quiz-breakdown-correct'
          : result.result === 'SKIPPED'
            ? 'quiz-breakdown-skipped'
            : 'quiz-breakdown-incorrect';
        return `<div class="quiz-breakdown-item ${statusClass}">${index + 1}. ${icon} ${result.prompt} (${result.category})</div>`;
      })
      .join('');
  }

  function getQuizSummary() {
    const timeString = formatElapsed(getElapsedQuizSeconds());
    return {
      timeString,
      code: quizCodeFrom(timeString),
      breakdownText: buildQuizBreakdownText(),
      breakdownMarkup: buildQuizBreakdownMarkup(),
    };
  }

  function lastBackgroundMethodIs(method) {
    return !!(state.lastBackgroundAction && state.lastBackgroundAction.method === method);
  }

  function lastDskMethodIs(index, method, active = null) {
    const action = state.lastDskActions[index];
    if (!action || action.method !== method) return false;
    return active === null ? true : action.active === active;
  }

  function recordBackgroundAction(method) {
    state.lastBackgroundAction = {
      method,
      pgmIndex: state.pgmIndex,
      pvwIndex: state.pvwIndex,
      tieBackground: state.tieBackground,
      previewKeys: [...state.previewKeyState],
      timestamp: Date.now(),
    };
  }

  function recordDskAction(index, method) {
    state.lastDskActions[index] = {
      method,
      active: state.dskState[index].active,
      sourceIndex: state.dskState[index].sourceIndex,
      timestamp: Date.now(),
    };
  }

  function getEffectiveKeyMode(dsk) {
    const sourceName = getSourceName(dsk.sourceIndex);
    if (dsk.dveEnabled && (dsk.keyMode < 0 || (dsk.keyMode === KEY_MODE_INDEX.SELF && !getSourceAlphaImage(sourceName)))) return 'DVE_FULL';
    return KEY_MODES[dsk.keyMode] || null;
  }

  function keyModeMatches(dsk, expectedMode) {
    if (expectedMode === undefined || expectedMode === null) return true;
    if (expectedMode === 'DVE_FULL') return getEffectiveKeyMode(dsk) === 'DVE_FULL';
    if (typeof expectedMode === 'number') return dsk.keyMode === expectedMode;
    return KEY_MODES[dsk.keyMode] === expectedMode;
  }

  function dveZoneMatches(dsk, zone) {
    if (!dsk.dveEnabled) return false;
    const smallEnough = dsk.dveSize <= 60;
    if (zone === 'bottom-right') return smallEnough && dsk.dveX >= 60 && dsk.dveY >= 58;
    if (zone === 'bottom-left') return smallEnough && dsk.dveX <= 40 && dsk.dveY >= 58;
    if (zone === 'top-right') return smallEnough && dsk.dveX >= 60 && dsk.dveY <= 42;
    if (zone === 'top-left') return smallEnough && dsk.dveX <= 40 && dsk.dveY <= 42;
    if (zone === 'center') return smallEnough && Math.abs(dsk.dveX - 50) <= 10 && Math.abs(dsk.dveY - 50) <= 10;
    if (zone === 'right') return dsk.dveX >= 60 && Math.abs(dsk.dveY - 50) <= 18;
    if (zone === 'left') return dsk.dveX <= 40 && Math.abs(dsk.dveY - 50) <= 18;
    if (zone === 'left-large') return dsk.dveSize >= 60 && dsk.dveX <= 42 && Math.abs(dsk.dveY - 50) <= 18;
    if (zone === 'right-large') return dsk.dveSize >= 60 && dsk.dveX >= 58 && Math.abs(dsk.dveY - 50) <= 18;
    return false;
  }

  function dskMatches(index, options = {}) {
    const dsk = state.dskState[index];
    if (!dsk) return false;
    if (options.sourceIndex !== undefined && dsk.sourceIndex !== options.sourceIndex) return false;
    if (!keyModeMatches(dsk, options.keyMode)) return false;
    if (options.dveEnabled !== undefined && dsk.dveEnabled !== options.dveEnabled) return false;
    if (options.chrColor !== undefined && dsk.chrColor !== options.chrColor) return false;
    if (options.active !== undefined && dsk.active !== options.active) return false;
    if (options.preview !== undefined && state.previewKeyState[index] !== options.preview) return false;
    if (options.dveZone && !dveZoneMatches(dsk, options.dveZone)) return false;
    return true;
  }

  function backgroundTransitionCheck(sourceIndex, method) {
    return state.pgmIndex === sourceIndex && lastBackgroundMethodIs(method);
  }

  function keyTakeWithBackgroundCheck(sourceIndex, method, dskIndex, extra = {}) {
    return backgroundTransitionCheck(sourceIndex, method)
      && dskMatches(dskIndex, { active: true, preview: true, ...extra });
  }

  function runTheShowPassed(total) {
    if (!total) return false;
    return (state.quizScore / total) >= 0.9;
  }

  function buildTakeQuestion(sourceName) {
    const sourceIndex = getSourceIndex(sourceName);
    return {
      prompt: `Ready ${sourceName}. Take ${sourceName}.`,
      check: () => backgroundTransitionCheck(sourceIndex, 'cut'),
    };
  }

  function buildDissolveQuestion(sourceName) {
    const sourceIndex = getSourceIndex(sourceName);
    return {
      prompt: `Set ${sourceName}. Dissolve to ${sourceName}.`,
      check: () => backgroundTransitionCheck(sourceIndex, 'auto'),
    };
  }


  function buildSourceButton({ id, label, ariaLabel, onClick, shortcut = '' }) {
    const button = document.createElement('button');
    button.className = `src-btn${shortcut ? ' with-shortcut' : ''}`;
    button.id = id;
    button.setAttribute('aria-label', ariaLabel);
    if (shortcut) button.dataset.shortcut = shortcut;

    const copy = document.createElement('span');
    copy.className = 'btn-copy';
    copy.textContent = label;
    button.appendChild(copy);

    if (shortcut) {
      const chip = document.createElement('span');
      chip.className = 'shortcut-chip';
      chip.setAttribute('aria-hidden', 'true');
      chip.textContent = shortcut;
      button.appendChild(chip);
    }

    setPressed(button, false);
    button.addEventListener('click', onClick);
    return button;
  }

  function buildDynamicRows() {
    dom.mvGrid.innerHTML = '';
    SOURCES.forEach((sourceName, index) => {
      const cell = document.createElement('div');
      cell.className = 'mv-cell';
      cell.id = `mv-cell-${index}`;
      cell.setAttribute('aria-label', `${sourceName} source monitor`);
      cell.innerHTML = `
        <div class="mv-cell-content">${sourceMarkup(sourceName, 14)}</div>
        <div class="mv-cell-label" aria-hidden="true">${sourceName}</div>
      `;
      dom.mvGrid.appendChild(cell);
    });

    [
      { row: dom.pgmRow, prefix: 'pgm-btn', ariaPrefix: 'Set Program to', onClick: selectPgm, includeShortcut: false },
      { row: dom.pvwRow, prefix: 'pvw-btn', ariaPrefix: 'Set Preview to', onClick: selectPvw, includeShortcut: true },
      { row: dom.dskSourceRow, prefix: 'dsk-src-btn', ariaPrefix: 'Set key source to', onClick: selectDSKSource, includeShortcut: false },
    ].forEach(({ row, prefix, ariaPrefix, onClick, includeShortcut }) => {
      row.innerHTML = '';
      SOURCES.forEach((sourceName, index) => {
        row.appendChild(buildSourceButton({
          id: `${prefix}-${index}`,
          label: sourceName,
          ariaLabel: `${ariaPrefix} ${sourceName}`,
          onClick: () => onClick(index),
          shortcut: includeShortcut ? getSourceShortcutLabel(index) : '',
        }));
      });
    });
  }

  function updateRowStates(prefix, activeIndex, activeClass) {
    SOURCES.forEach((_, index) => {
      const button = $(`${prefix}-${index}`);
      if (!button) return;
      button.className = `src-btn${index === activeIndex ? ` ${activeClass}` : ''}`;
      setPressed(button, index === activeIndex);
    });
  }

  function updateMainBusUI() {
    updateRowStates('pgm-btn', state.pgmIndex, 'pgm-active');
    updateRowStates('pvw-btn', state.pvwIndex, 'pvw-active');

    renderSourceDisplay(dom.mvPgmName, state.pgmIndex, `active-${state.surfaceMode}-pgm`);
    renderSourceDisplay(dom.mvPvwName, state.pvwIndex, `active-${state.surfaceMode}-pvw`);
    refreshSourceGridContent();

    SOURCES.forEach((_, index) => {
      const cell = $(`mv-cell-${index}`);
      if (!cell) return;
      cell.className = 'mv-cell';
      if (index === state.pgmIndex) cell.classList.add('is-pgm');
      if (index === state.pvwIndex) cell.classList.add('is-pvw');
    });

    updateDSKOverlays();
    updateSurfaceUI();
  }

  function updateTieButtons() {
    dom.tieBackgroundButton.className = `tie-btn${state.tieBackground ? ' tie-btn-active' : ''}`;
    setPressed(dom.tieBackgroundButton, state.tieBackground);

    dom.tieKeyButtons.forEach((button, index) => {
      const isActive = state.previewKeyState[index];
      button.className = `tie-btn${isActive ? ' tie-btn-active' : ''}`;
      setPressed(button, isActive);
    });
  }

  function toggleBackgroundTie() {
    const activeCount = (state.tieBackground ? 1 : 0) + state.previewKeyState.filter(Boolean).length;
    pushActionUndoState();
    if (state.tieBackground && activeCount > 1) {
      state.tieBackground = true;
      state.previewKeyState = state.previewKeyState.map(() => false);
    } else {
      state.tieBackground = !state.tieBackground;
    }
    updateTieButtons();
    updateDSKOverlays();
    maybeResolveRunTheShow();
  }

  function togglePreviewKey(index) {
    const activeCount = (state.tieBackground ? 1 : 0) + state.previewKeyState.filter(Boolean).length;
    pushActionUndoState();
    if (state.previewKeyState[index] && activeCount > 1) {
      state.tieBackground = false;
      state.previewKeyState = state.previewKeyState.map((_, keyIndex) => keyIndex === index);
    } else {
      state.previewKeyState[index] = !state.previewKeyState[index];
    }
    updateTieButtons();
    updateDSKOverlays();
    maybeResolveRunTheShow();
  }

  function selectPgm(index) {
    if (state.transitioning || !isSourceSelectable(index) || state.pgmIndex === index) return;
    pushActionUndoState();
    state.pgmIndex = index;
    updateMainBusUI();
    maybeResolveRunTheShow();
    lessonCheckInteraction();
  }

  function selectPvw(index) {
    if (state.transitioning || !isSourceSelectable(index) || state.pvwIndex === index) return;
    pushActionUndoState();
    state.pvwIndex = index;
    updateMainBusUI();
    maybeResolveRunTheShow();
    lessonCheckInteraction();
  }

  function swapProgramAndPreview() {
    const nextProgram = state.pvwIndex;
    state.pvwIndex = state.pgmIndex;
    state.pgmIndex = nextProgram;
  }

  function applyKeyTiesDuringTransition() {
    state.dskState.forEach((dsk, index) => {
      if (!state.previewKeyState[index]) return;
      dsk.active = !dsk.active;
    });
  }

  function performTransitionSwap() {
    if (state.tieBackground) swapProgramAndPreview();
    applyKeyTiesDuringTransition();
    updateTieButtons();
  }

  const getMixLayerEls = () => [
    dom.mvPgmName,
    dom.mvPgmDissolve,
    ...dom.dskTransitionOutEls,
    ...dom.dskTransitionInEls,
  ].filter(Boolean);

  function clearTransitionOverlays() {
    [...dom.dskTransitionOutEls, ...dom.dskTransitionInEls].forEach((overlay) => {
      if (!overlay) return;
      overlay.style.opacity = '0';
      overlay.innerHTML = '';
    });
  }

  function setMixLayerTransitions(durationMs = 0) {
    getMixLayerEls().forEach((element) => setOpacityTransition(element, durationMs));
  }

  function getTiedKeyStates() {
    return state.dskState.map((dsk, index) => ({
      outgoing: dsk.active && state.previewKeyState[index],
      incoming: !dsk.active && state.previewKeyState[index],
    }));
  }

  function prepareOverlayTransitionLayers(keyStates) {
    renderOverlayStack(dom.dskTransitionOutEls, keyStates.map((key) => key.outgoing), 'pgm-out');
    renderOverlayStack(dom.dskTransitionInEls, keyStates.map((key) => key.incoming), 'pgm-in');

    keyStates.forEach((keyState, index) => {
      if (keyState.outgoing && dom.dskOverlayEls[index]) dom.dskOverlayEls[index].style.opacity = '0';
      if (dom.dskTransitionOutEls[index]) dom.dskTransitionOutEls[index].style.opacity = keyState.outgoing ? '1' : '0';
      if (dom.dskTransitionInEls[index]) dom.dskTransitionInEls[index].style.opacity = '0';
    });
  }

  function hasPendingMediaTransitionChange() {
    return (state.tieBackground && state.pvwIndex !== state.pgmIndex) || state.previewKeyState.some(Boolean);
  }

  function getPendingLiveSources() {
    const pending = new Set();
    if (state.tieBackground && state.pvwIndex !== state.pgmIndex) {
      pending.add(getSourceName(state.pvwIndex));
    }
    state.dskState.forEach((dsk, index) => {
      const willBeActive = state.previewKeyState[index] ? !dsk.active : dsk.active;
      if (willBeActive) pending.add(getSourceName(dsk.sourceIndex));
    });
    return Array.from(pending);
  }

  async function ensurePendingLiveSourcesReady() {
    await Promise.all(getPendingLiveSources().map((sourceName) => ensureSourceReady(sourceName)));
  }

  async function ensureMediaTransitionReady(transitionId) {
    const transition = getMediaTransitionOption(transitionId);
    return Promise.all(transition.frames.map((frame) => loadImageAsset(frame)));
  }

  function clearMediaTransitionOverlay() {
    if (!dom.mediaTransitionOverlay) return;
    dom.mediaTransitionOverlay.style.opacity = '0';
    dom.mediaTransitionOverlay.innerHTML = '';
  }

  function drawTransitionFrame(context, canvas, image) {
    if (!context || !canvas || !image) return;
    const width = image.naturalWidth || image.width || 1920;
    const height = image.naturalHeight || image.height || 1080;

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
  }

  async function doMediaTransition() {
    if (state.transitioning || !hasPendingMediaTransitionChange()) return;

    const transitionId = getMediaTransitionSlotId(state.activeMediaTransitionSlot);
    const transition = getMediaTransitionOption(transitionId);
    const mediaButton = dom.mediaTransitionButton;
    const overlay = dom.mediaTransitionOverlay;
    const frameDuration = 1000 / (transition.fps || 30);
    const cutFrameNumber = clamp(Number(transition.cutFrame) || 1, 1, transition.frames.length);
    let cutApplied = false;

    state.transitioning = true;
    if (mediaButton) mediaButton.classList.add('transitioning');

    try {
      const [frameImages] = await Promise.all([
        ensureMediaTransitionReady(transitionId),
        ensurePendingLiveSourcesReady(),
      ]);

      const playableFrames = frameImages.filter(Boolean);
      if (!playableFrames.length) throw new Error('No transition frames loaded');
      if (!overlay) throw new Error('Transition overlay unavailable');

      overlay.style.opacity = '1';
      overlay.innerHTML = '<canvas class="mv-media-transition-frame" aria-hidden="true"></canvas>';

      const transitionCanvas = overlay.querySelector('canvas');
      const transitionContext = transitionCanvas ? transitionCanvas.getContext('2d', { willReadFrequently: true }) : null;
      if (!transitionCanvas || !transitionContext) throw new Error('Transition canvas unavailable');

      for (let frameIndex = 0; frameIndex < playableFrames.length; frameIndex += 1) {
        drawTransitionFrame(transitionContext, transitionCanvas, playableFrames[frameIndex]);
        await nextPaint();

        const reachedCutFrame = !cutApplied && (frameIndex + 1) >= cutFrameNumber;

        await new Promise((resolve) => setTimeout(resolve, frameDuration));

        if (reachedCutFrame) {
          performTransitionSwap();
          cutApplied = true;
          updateMainBusUI();
          updateDSKUI();
          recordBackgroundAction('media');
          maybeResolveRunTheShow(true);
        }
      }

      if (!cutApplied) {
        performTransitionSwap();
        recordBackgroundAction('media');
        maybeResolveRunTheShow(true);
      }
    } catch (error) {
      console.error('Media transition failed', error);
    } finally {
      state.transitioning = false;
      if (mediaButton) mediaButton.classList.remove('transitioning');
      clearMediaTransitionOverlay();
      updateMainBusUI();
      updateDSKUI();
    }
  }

  function doCut() {
    if (state.transitioning) return;
    pushActionUndoState();
    performTransitionSwap();
    recordBackgroundAction('cut');
    updateMainBusUI();
    updateDSKUI();
    maybeResolveRunTheShow(true);
    lessonCheckInteraction();
  }

  function nextPaint() {
    return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  }

  function resetDissolveLayers() {
    dom.mvPgmName.style.opacity = '1';
    dom.mvPgmDissolve.style.opacity = '0';
    dom.mvPgmDissolve.innerHTML = '';
    setMixLayerTransitions(0);
    clearTransitionOverlays();
  }

  function runMixAnimation({ animateBackground, keyStates }) {
    return new Promise((resolve) => {
      const startTime = performance.now();

      function step(now) {
        const progress = Math.min((now - startTime) / DISSOLVE_DURATION, 1);

        dom.mvPgmName.style.opacity = animateBackground ? String(1 - progress) : '1';
        dom.mvPgmDissolve.style.opacity = animateBackground ? String(progress) : '0';

        keyStates.forEach((keyState, index) => {
          if (keyState.outgoing && dom.dskTransitionOutEls[index]) {
            dom.dskTransitionOutEls[index].style.opacity = String(1 - progress);
          }
          if (keyState.incoming && dom.dskTransitionInEls[index]) {
            dom.dskTransitionInEls[index].style.opacity = String(progress);
          }
        });

        if (progress < 1) {
          requestAnimationFrame(step);
          return;
        }

        resolve();
      }

      requestAnimationFrame(step);
    });
  }

  async function doDissolve() {
    if (state.transitioning) return;

    pushActionUndoState();
    state.transitioning = true;
    const autoButton = $('btn-auto');
    const animateBackground = state.tieBackground && state.pvwIndex !== state.pgmIndex;
    const incomingIndex = animateBackground ? state.pvwIndex : state.pgmIndex;
    const keyStates = getTiedKeyStates();

    persistCurrentSurfaceState();
    autoButton.classList.add('transitioning');

    try {
      if (animateBackground) {
        await ensureSourceReady(getSourceName(incomingIndex));
        renderSourceDisplay(dom.mvPgmName, state.pgmIndex, `mix-out-${state.surfaceMode}`);
        renderSourceDisplay(dom.mvPgmDissolve, incomingIndex, `mix-in-${state.surfaceMode}`);
      } else {
        dom.mvPgmDissolve.innerHTML = '';
      }

      prepareOverlayTransitionLayers(keyStates);
      setMixLayerTransitions(0);
      dom.mvPgmName.style.opacity = '1';
      dom.mvPgmDissolve.style.opacity = '0';

      await nextPaint();
      await runMixAnimation({ animateBackground, keyStates });

      performTransitionSwap();
      recordBackgroundAction('auto');
      maybeResolveRunTheShow(true);
    } catch (error) {
      console.error('Dissolve failed', error);
    } finally {
      state.transitioning = false;
      autoButton.classList.remove('transitioning');
      resetDissolveLayers();
      updateMainBusUI();
      updateDSKUI();
      lessonCheckInteraction();
    }
  }

  function refreshKeyTypeButtons() {
    dom.keyTypeButtons.forEach((button, index) => {
      button.className = `src-btn${index === state.activeKeyMode ? ' key-type-active' : ''}`;
      setPressed(button, index === state.activeKeyMode);
    });

    dom.dveToggleButton.className = `src-btn with-shortcut${state.activeDveEnabled ? ' dve-toggle-active' : ''}`;
    setPressed(dom.dveToggleButton, state.activeDveEnabled);
  }

  function updateCHRControlsVisibility() {
    const isChroma = KEY_MODES[state.activeKeyMode] === 'CHR';
    dom.chrControls.classList.toggle('chr-visible', !!isChroma);

    if (!isChroma) return;

    const dsk = currentDsk();
    dom.chrGreenButton.className = `dsk-btn${dsk.chrColor === 'green' ? ' chr-green-active' : ''}`;
    dom.chrBlueButton.className = `dsk-btn${dsk.chrColor === 'blue' ? ' chr-blue-active' : ''}`;
    setPressed(dom.chrGreenButton, dsk.chrColor === 'green');
    setPressed(dom.chrBlueButton, dsk.chrColor === 'blue');
  }


  function getCurrentDVEState() {
    const dsk = currentDsk();
    return {
      surfaceMode: state.surfaceMode,
      activeDSK: state.activeDSK,
      dveX: dsk.dveX,
      dveY: dsk.dveY,
      dveSize: dsk.dveSize,
      dveBorderEnabled: !!dsk.dveBorderEnabled,
      dveBorderWidth: dsk.dveBorderWidth,
      dveBorderColor: dsk.dveBorderColor || DEFAULT_DVE_BORDER_COLOR,
      dveCropH: dsk.dveCropH || DEFAULT_DVE_CROP_H,
      dveCropV: dsk.dveCropV || DEFAULT_DVE_CROP_V,
    };
  }

  function pushDVEUndoState() {
    if (!state.activeDveEnabled) return;
    pushActionUndoState();
    state.dveUndoStack.push(getCurrentDVEState());
    if (state.dveUndoStack.length > 50) state.dveUndoStack.shift();
    updateUtilityMenuActions();
  }

  function applyDVEStateSnapshot(snapshot) {
    if (!snapshot) return false;
    if (!state.surfaceStates[snapshot.surfaceMode]) return false;
    const targetBus = state.surfaceStates[snapshot.surfaceMode];
    if (!targetBus || !targetBus.dskState || !targetBus.dskState[snapshot.activeDSK]) return false;
    const dsk = targetBus.dskState[snapshot.activeDSK];
    dsk.dveX = clamp(parseInt(snapshot.dveX, 10) || 50, 0, 100);
    dsk.dveY = clamp(parseInt(snapshot.dveY, 10) || 50, 0, 100);
    dsk.dveSize = clamp(parseInt(snapshot.dveSize, 10) || DEFAULT_DVE_SIZE, 1, 100);
    dsk.dveBorderEnabled = !!snapshot.dveBorderEnabled;
    dsk.dveBorderWidth = clamp(parseInt(snapshot.dveBorderWidth, 10) || DEFAULT_DVE_BORDER_WIDTH, 1, 16);
    dsk.dveBorderColor = snapshot.dveBorderColor || DEFAULT_DVE_BORDER_COLOR;
    dsk.dveCropH = clamp(parseInt(snapshot.dveCropH, 10) || DEFAULT_DVE_CROP_H, 0, 100);
    dsk.dveCropV = clamp(parseInt(snapshot.dveCropV, 10) || DEFAULT_DVE_CROP_V, 0, 100);
    if (snapshot.surfaceMode === state.surfaceMode && snapshot.activeDSK === state.activeDSK) {
      updateDVEControlsVisibility();
      updateDSKUI();
    }
    updateDSKOverlays();
    maybeResolveRunTheShow();
    return true;
  }

  function undoLastDVEStep() {
    const snapshot = state.dveUndoStack.pop();
    if (!snapshot) {
      updateUtilityMenuActions();
      return false;
    }
    const applied = applyDVEStateSnapshot(snapshot);
    updateUtilityMenuActions();
    return applied;
  }

  // ─── DVE EDITOR SHELL — new polished UI ──────────────────────

  // Sync border swatches (works for both old .dve-border-swatch and new .dve-sw-color)
  function syncDVEBorderSwatches(color) {
    dom.dveBorderSwatches.forEach((button) => {
      const active = (button.dataset.color || '').toLowerCase() === String(color || '').toLowerCase();
      button.classList.toggle('is-active', active);
      button.classList.toggle('sel', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  // Update the slot representative in the right panel
  function updateDVESlot() {
    if (!dom.dveSlot) return;
    const dsk = currentDsk();
    const sourceName = getSourceName(dsk.sourceIndex);
    const isConfigured = !!state.activeDveEnabled;
    dom.dveSlot.classList.toggle('dve-slot-configured', isConfigured);
    if (dom.dveSlotMeta) {
      const cropH = dsk.dveCropH || DEFAULT_DVE_CROP_H;
      const cropV = dsk.dveCropV || DEFAULT_DVE_CROP_V;
      const cropPart = (cropH > 0 || cropV > 0) ? `  ·  H:${cropH}  V:${cropV}` : '';
      dom.dveSlotMeta.textContent = isConfigured
        ? `X:${dsk.dveX}  Y:${dsk.dveY}  ·  ${dsk.dveSize}%${cropPart}`
        : 'Not configured';
    }
    if (dom.dveEdBadge) {
      dom.dveEdBadge.textContent = `DSK ${state.activeDSK + 1} · ${sourceName}`;
    }
  }

  // Show/hide the DVE slot in the right panel
  function updateDVESlotVisibility() {
    if (!dom.dveSlot) return;
    dom.dveSlot.classList.toggle('dve-slot-visible', !!state.activeDveEnabled);
  }

  // Update the editor's position readout
  function updateDVEEditorCoords() {
    const dsk = currentDsk();
    const el = document.getElementById('dve-pos-readout');
    if (el) {
      el.innerHTML = `<span class="cl">X</span> ${dsk.dveX} &nbsp; <span class="cl">Y</span> ${dsk.dveY}`;
    }
  }

  // Sync the editor's custom drag sliders to match state
  function syncEditorSliders() {
    const dsk = currentDsk();

    // Scale: dveSize 0-100 maps directly to track pct
    const scalePct = clamp(dsk.dveSize, 0, 100);
    dveSetTrack('scale', scalePct);
    const scaleValEl = document.getElementById('dve-ed-scale-val');
    if (scaleValEl) scaleValEl.innerHTML = `${dsk.dveSize}<span class="u">%</span>`;

    // Crop H
    dveSetTrack('crop-h', dsk.dveCropH || DEFAULT_DVE_CROP_H);
    const chEl = document.getElementById('dve-crop-h-val');
    if (chEl) chEl.innerHTML = `${dsk.dveCropH || DEFAULT_DVE_CROP_H}<span class="u">%</span>`;

    // Crop V
    dveSetTrack('crop-v', dsk.dveCropV || DEFAULT_DVE_CROP_V);
    const cvEl = document.getElementById('dve-crop-v-val');
    if (cvEl) cvEl.innerHTML = `${dsk.dveCropV || DEFAULT_DVE_CROP_V}<span class="u">%</span>`;

    // Border width: map 1-16 to 0-100%
    const bdrPct = Math.round(((dsk.dveBorderWidth - 1) / 15) * 100);
    dveSetTrack('bdr-w', bdrPct);
    if (dom.dveBorderWidthLabel) dom.dveBorderWidthLabel.innerHTML = `${dsk.dveBorderWidth}<span class="u">px</span>`;

    // Border toggle
    if (dom.dveBorderToggle) dom.dveBorderToggle.checked = !!dsk.dveBorderEnabled;

    // Border swatches
    syncDVEBorderSwatches(dsk.dveBorderColor || DEFAULT_DVE_BORDER_COLOR);
  }

  // Helper: set a dve-track-wrap's CSS percentage
  function dveSetTrack(sliderName, pct) {
    const wrap = document.querySelector(`[data-dve-slider="${sliderName}"]`);
    if (!wrap) return;
    const track = wrap.querySelector('.dve-track');
    const thumb = wrap.querySelector('.dve-thumb');
    const p = Math.max(0, Math.min(100, pct)) + '%';
    if (track) track.style.setProperty('--p', p);
    if (thumb) thumb.style.setProperty('--p', p);
  }

  function openDVEEditor() {
    if (!state.activeDveEnabled) return;
    if (dom.dveEditorShell) {
      dom.dveEditorShell.classList.add('open');
      dom.dveEditorShell.setAttribute('aria-hidden', 'false');
    }
    syncEditorSliders();
    updateDVEEditorCoords();
    state.dveMoreWindowOpen = true;
  }

  function closeDVEEditor() {
    if (dom.dveEditorShell) {
      dom.dveEditorShell.classList.remove('open');
      dom.dveEditorShell.setAttribute('aria-hidden', 'true');
    }
    state.dveMoreWindowOpen = false;
    updateDVESlot();
  }

  function updateDVEControlsVisibility() {
    // Show/hide the slot rep
    if (dom.dveSlot) {
      dom.dveSlot.classList.toggle('dve-slot-visible', !!state.activeDveEnabled);
    }

    // If DVE just turned off, close the editor
    if (!state.activeDveEnabled) {
      if (dom.dveEditorShell) dom.dveEditorShell.classList.remove('open');
      state.dveMoreWindowOpen = false;
    }

    // Legacy more-window: keep hidden (replaced by editor shell)
    if (dom.dveMoreWindow) dom.dveMoreWindow.style.display = 'none';

    updateDVESlot();

    if (!state.activeDveEnabled) return;

    // Sync editor content to current DSK state
    syncEditorSliders();
    updateDVEEditorCoords();
    const dsk = currentDsk();
    const sourceName = getSourceName(dsk.sourceIndex);
    if (dom.dveEdBadge) dom.dveEdBadge.textContent = `DSK ${state.activeDSK + 1} · ${sourceName}`;
  }

  function selectKeyMode(index) {
    const nextMode = state.activeKeyMode === index ? -1 : index;
    if (currentDsk().keyMode === nextMode && state.activeKeyMode === nextMode) return;
    pushActionUndoState();
    if (state.activeKeyMode === index) {
      state.activeKeyMode = -1;
      currentDsk().keyMode = -1;
    } else {
      state.activeKeyMode = index;
      currentDsk().keyMode = index;
    }
    refreshKeyTypeButtons();
    updateCHRControlsVisibility();
    updateDSKUI();
    updateDSKOverlays();
    lessonCheckInteraction();
    scheduleLayout();
    maybeResolveRunTheShow();
  }

  function toggleDVE() {
    pushActionUndoState();
    state.activeDveEnabled = !state.activeDveEnabled;
    currentDsk().dveEnabled = state.activeDveEnabled;
    if (!state.activeDveEnabled) state.dveMoreWindowOpen = false;
    refreshKeyTypeButtons();
    updateDVEControlsVisibility();
    updateCHRControlsVisibility();
    updateDSKUI();
    updateDSKOverlays();
    scheduleLayout();
    maybeResolveRunTheShow();
    lessonCheckInteraction();
  }

  function openDVEMoreWindow() { openDVEEditor(); }
  function closeDVEMoreWindow() { closeDVEEditor(); }


  function triggerDVEHotkey() {
    if (state.dveMoreWindowOpen) {
      closeDVEMoreWindow();
      return;
    }
    if (!state.activeDveEnabled) {
      pushActionUndoState();
      state.activeDveEnabled = true;
      currentDsk().dveEnabled = true;
      refreshKeyTypeButtons();
      updateDVEControlsVisibility();
      updateCHRControlsVisibility();
      updateDSKUI();
      updateDSKOverlays();
      scheduleLayout();
    }
    openDVEMoreWindow();
    maybeResolveRunTheShow();
  }

  function setChrColor(color) {
    if (currentDsk().chrColor === color) return;
    pushActionUndoState();
    currentDsk().chrColor = color;
    updateCHRControlsVisibility();
    updateDSKOverlays();
    maybeResolveRunTheShow();
  }

  function updateDVECoordLabel() {
    updateDVEEditorCoords();
    updateDVESlot();
  }

  function nudgeToNextStop(current, forward) {
    const stops = [0, 25, 50, 75, 100];
    if (forward) {
      const next = stops.find(s => s > current + 1);
      return next !== undefined ? next : current;
    }
    const below = stops.filter(s => s < current - 1);
    return below.length ? below[below.length - 1] : current;
  }

  function nudgeDVE(direction) {
    const dsk = currentDsk();
    pushDVEUndoState();

    if (direction === 'up') dsk.dveY = nudgeToNextStop(dsk.dveY, false);
    if (direction === 'down') dsk.dveY = nudgeToNextStop(dsk.dveY, true);
    if (direction === 'left') dsk.dveX = nudgeToNextStop(dsk.dveX, false);
    if (direction === 'right') dsk.dveX = nudgeToNextStop(dsk.dveX, true);
    if (direction === 'center') {
      dsk.dveX = 50;
      dsk.dveY = 50;
    }

    updateDVECoordLabel();
    updateDSKOverlays();
    maybeResolveRunTheShow();
  }

  function resetDVE() {
    const dsk = currentDsk();
    pushDVEUndoState();
    dsk.dveX = 50;
    dsk.dveY = 50;
    dsk.dveSize = DEFAULT_DVE_SIZE;
    dsk.dveBorderEnabled = false;
    dsk.dveBorderWidth = DEFAULT_DVE_BORDER_WIDTH;
    dsk.dveBorderColor = DEFAULT_DVE_BORDER_COLOR;
    dsk.dveCropH = DEFAULT_DVE_CROP_H;
    dsk.dveCropV = DEFAULT_DVE_CROP_V;
    syncEditorSliders();
    updateDVECoordLabel();
    updateDSKOverlays();
    maybeResolveRunTheShow();
  }

  function setDVESize(value) {
    const size = clamp(parseInt(value, 10) || 0, 1, 100);
    if (size === currentDsk().dveSize) return;
    pushDVEUndoState();
    currentDsk().dveSize = size;
    dveSetTrack('scale', size);
    const scaleEl = document.getElementById('dve-ed-scale-val');
    if (scaleEl) scaleEl.innerHTML = `${size}<span class="u">%</span>`;
    updateDVESlot();
    updateDSKOverlays();
    maybeResolveRunTheShow();
  }

  function setDVEBorderEnabled(enabled) {
    if (currentDsk().dveBorderEnabled === !!enabled) return;
    pushDVEUndoState();
    currentDsk().dveBorderEnabled = !!enabled;
    updateDSKOverlays();
    maybeResolveRunTheShow();
  }

  function setDVEBorderWidth(value) {
    const width = clamp(parseInt(value, 10) || DEFAULT_DVE_BORDER_WIDTH, 1, 16);
    if (width === currentDsk().dveBorderWidth) return;
    pushDVEUndoState();
    currentDsk().dveBorderWidth = width;
    const bdrPct = Math.round(((width - 1) / 15) * 100);
    dveSetTrack('bdr-w', bdrPct);
    if (dom.dveBorderWidthLabel) dom.dveBorderWidthLabel.innerHTML = `${width}<span class="u">px</span>`;
    updateDSKOverlays();
    maybeResolveRunTheShow();
  }

  function setDVEBorderColor(value) {
    const color = value || DEFAULT_DVE_BORDER_COLOR;
    if ((currentDsk().dveBorderColor || DEFAULT_DVE_BORDER_COLOR).toLowerCase() === color.toLowerCase()) return;
    pushDVEUndoState();
    currentDsk().dveBorderColor = color;
    dom.dveBorderColorPicker.value = color;
    syncDVEBorderSwatches(color);
    updateDSKOverlays();
    maybeResolveRunTheShow();
  }

  function setDVECropH(value) {
    const crop = clamp(parseInt(value, 10) || DEFAULT_DVE_CROP_H, 0, 100);
    if (crop === (currentDsk().dveCropH || DEFAULT_DVE_CROP_H)) return;
    pushDVEUndoState();
    currentDsk().dveCropH = crop;
    dveSetTrack('crop-h', crop);
    if (dom.dveCropHLabel) dom.dveCropHLabel.innerHTML = `${crop}<span class="u">%</span>`;
    updateDSKOverlays();
    maybeResolveRunTheShow();
  }

  function setDVECropV(value) {
    const crop = clamp(parseInt(value, 10) || DEFAULT_DVE_CROP_V, 0, 100);
    if (crop === (currentDsk().dveCropV || DEFAULT_DVE_CROP_V)) return;
    pushDVEUndoState();
    currentDsk().dveCropV = crop;
    dveSetTrack('crop-v', crop);
    if (dom.dveCropVLabel) dom.dveCropVLabel.innerHTML = `${crop}<span class="u">%</span>`;
    updateDSKOverlays();
    maybeResolveRunTheShow();
  }

  function adjustDVESize(delta) {
    const min = 1;
    const max = 100;
    const nextSize = Math.max(min, Math.min(max, currentDsk().dveSize + delta));
    if (nextSize === currentDsk().dveSize) return;
    dom.dveSizeSlider.value = nextSize;
    setDVESize(nextSize);
  }

  function selectDSK(index) {
    state.activeDSK = index;
    syncActiveDskState();
    refreshKeyTypeButtons();
    updateDVEControlsVisibility();
    updateCHRControlsVisibility();
    updateDSKUI();
    scheduleLayout();
    maybeResolveRunTheShow();
    lessonCheckInteraction();
  }

  function selectDSKSource(sourceIndex) {
    if (!isSourceSelectable(sourceIndex) || currentDsk().sourceIndex === sourceIndex) return;
    pushActionUndoState();
    currentDsk().sourceIndex = sourceIndex;
    const sourceName = getSourceName(sourceIndex);
    if (sourceName === 'M1' || sourceName === 'M2') {
      currentDsk().active = false;
      currentDsk().transitioning = false;
      currentDsk().keyMode = -1;
      currentDsk().dveEnabled = false;
      state.previewKeyState[state.activeDSK] = false;
    } else {
      applyPreferredKeySettingsToDsk(currentDsk(), sourceName);
    }
    syncActiveDskState();
    updateDVEControlsVisibility();
    updateCHRControlsVisibility();
    updateDSKUI();
    updateDSKOverlays();
    maybeResolveRunTheShow();
    lessonCheckInteraction();
  }

  function dskCutChannel(index) {
    pushActionUndoState();
    state.dskState[index].active = !state.dskState[index].active;
    recordDskAction(index, 'cut');
    updateDSKUI();
    updateDSKOverlays();
    maybeResolveRunTheShow(true);
    lessonCheckInteraction();
  }

  function dskAutoChannel(index) {
    const dsk = state.dskState[index];
    if (dsk.transitioning) return;

    pushActionUndoState();
    dsk.transitioning = true;
    const targetOpacity = dsk.active ? 0 : 1;
    const startOpacity = dsk.active ? 1 : 0;
    const overlay = dom.dskOverlayEls[index];
    const autoButton = dom.dskAutoButtons[index];

    if (autoButton) autoButton.classList.add('dsk-transitioning');

    if (!dsk.active) {
      dsk.active = true;
      updateDSKOverlays();
      dsk.active = false;
      overlay.style.opacity = 0;
    }

    const startTime = performance.now();
    const animate = (now) => {
      const progress = Math.min((now - startTime) / DSK_AUTO_DURATION, 1);
      overlay.style.opacity = startOpacity + (targetOpacity - startOpacity) * progress;

      if (progress < 1) {
        requestAnimationFrame(animate);
        return;
      }

      dsk.active = !dsk.active;
      dsk.transitioning = false;
      recordDskAction(index, 'auto');
      if (autoButton) autoButton.classList.remove('dsk-transitioning');
      updateDSKUI();
      updateDSKOverlays();
      maybeResolveRunTheShow(true);
      lessonCheckInteraction();
    };

    requestAnimationFrame(animate);
  }

  function getDveCropMetrics(dsk) {
    const cropH = clamp(parseInt(dsk.dveCropH, 10) || DEFAULT_DVE_CROP_H, 0, 100);
    const cropV = clamp(parseInt(dsk.dveCropV, 10) || DEFAULT_DVE_CROP_V, 0, 100);
    const insetX = (cropH / 2).toFixed(2);
    const insetY = (cropV / 2).toFixed(2);
    return { cropH, cropV, insetX, insetY };
  }

  function dveWrapperStart(dsk) {
    const { insetX, insetY } = getDveCropMetrics(dsk);
    const borderEnabled = !!dsk.dveBorderEnabled;
    const borderWidth = clamp(parseInt(dsk.dveBorderWidth, 10) || DEFAULT_DVE_BORDER_WIDTH, 1, 16);
    const borderColor = svgEscape(dsk.dveBorderColor || DEFAULT_DVE_BORDER_COLOR);
    const cropInset = `inset(${insetY}% ${insetX}% ${insetY}% ${insetX}%)`;
    const outerStyles = [
      'position:absolute',
      `width:${dsk.dveSize}%`,
      'aspect-ratio:16/9',
      `left:${dsk.dveX}%`,
      `top:${dsk.dveY}%`,
      'transform:translate(-50%,-50%)',
      'overflow:visible',
    ].join(';');
    const frameStyles = [
      'position:absolute',
      'inset:0',
      'overflow:hidden',
    ].join(';');
    const maskStyles = [
      'position:absolute',
      'inset:0',
      `clip-path:${cropInset}`,
      `-webkit-clip-path:${cropInset}`,
      'overflow:hidden',
    ].join(';');
    const contentStyles = [
      'position:absolute',
      'inset:0',
      'transform:none',
    ].join(';');
    return `<div style="${outerStyles}"><div class="dve-crop-frame" style="${frameStyles}"><div class="dve-crop-mask" style="${maskStyles}"><div class="dve-crop-content" style="${contentStyles}">`;
  }

  function dveWrapperEnd(dsk) {
    const { insetX, insetY } = getDveCropMetrics(dsk);
    const borderEnabled = !!dsk.dveBorderEnabled;
    const borderWidth = clamp(parseInt(dsk.dveBorderWidth, 10) || DEFAULT_DVE_BORDER_WIDTH, 1, 16);
    const borderColor = svgEscape(dsk.dveBorderColor || DEFAULT_DVE_BORDER_COLOR);
    const cropInset = `inset(${insetY}% ${insetX}% ${insetY}% ${insetX}%)`;
    const borderMarkup = borderEnabled
      ? `<div aria-hidden="true" style="position:absolute;inset:0;clip-path:${cropInset};-webkit-clip-path:${cropInset};box-sizing:border-box;border:${borderWidth}px solid ${borderColor};pointer-events:none;"></div>`
      : '';
    const hasCrop = parseFloat(insetX) > 0 || parseFloat(insetY) > 0;
    const cropBorderMarkup = hasCrop
      ? `<div aria-hidden="true" style="position:absolute;top:${insetY}%;left:${insetX}%;right:${insetX}%;bottom:${insetY}%;border:2px dashed rgba(255,200,0,0.75);pointer-events:none;z-index:10;box-sizing:border-box;"></div>`
      : '';
    return `</div>${borderMarkup}${cropBorderMarkup}</div></div>`;
  }

  function applyLumaKey(data) {
    for (let p = 0; p < data.length; p += 4) {
      const r = data[p];
      const g = data[p + 1];
      const b = data[p + 2];
      if (r === 0 && g === 0 && b === 0) data[p + 3] = 0;
    }
  }

  function applyChromaKey(data, color) {
    const settings = CHROMA_KEY_SETTINGS[color] || CHROMA_KEY_SETTINGS.green;
    const keyIndex = color === 'blue' ? 2 : 1;
    const compareIndexA = color === 'blue' ? 0 : 0;
    const compareIndexB = color === 'blue' ? 1 : 2;

    for (let p = 0; p < data.length; p += 4) {
      const keyValue = data[p + keyIndex];
      const compareA = data[p + compareIndexA];
      const compareB = data[p + compareIndexB];
      const maxCompeting = Math.max(compareA, compareB);

      if (keyValue >= settings.hardMin && keyValue >= maxCompeting * settings.hardRatio) {
        data[p + 3] = 0;
        continue;
      }

      if (keyValue >= settings.softMin && keyValue >= maxCompeting * settings.softRatio) {
        const dominance = Math.max(0, keyValue - maxCompeting) / 255;
        const matteStrength = dominance * settings.fadeScale;
        data[p + 3] = Math.max(0, Math.round(255 - matteStrength));
      }
    }
  }

  function drawProcessedOverlay(canvasId, imageSrc, processor) {
    const canvas = $(canvasId);
    processCanvasElement(canvas, imageSrc, processor);
  }

  function renderOverlayStack(overlayElements, activeStates, canvasPrefix) {
    state.dskState.forEach((dsk, index) => {
      const overlay = overlayElements[index];

      if (!overlay || !activeStates[index]) {
        if (overlay) {
          overlay.style.opacity = 0;
          overlay.innerHTML = '';
        }
        return;
      }

      const markup = buildOverlayMarkup(dsk, index, canvasPrefix);
      if (!markup) {
        overlay.style.opacity = 0;
        overlay.innerHTML = '';
        return;
      }

      overlay.innerHTML = markup;
      overlay.style.opacity = 1;
      processDynamicCanvases(overlay);
    });
  }

  function updateDSKOverlays() {
    renderOverlayStack(dom.dskOverlayEls, state.dskState.map((dsk) => dsk.active), 'pgm');
    renderOverlayStack(dom.pvwOverlayEls, state.previewKeyState, 'pvw');
    if (state.surfaceMode === 'ME1') refreshSourceGridContent();
  }

  function updateDSKUI() {
    dom.dskSelectButtons.forEach((button, index) => {
      button.className = `dsk-btn${index === state.activeDSK ? ' dsk-sel-active' : ''}`;
      setPressed(button, index === state.activeDSK);
    });

    updateRowStates('dsk-src-btn', currentDsk().sourceIndex, 'dsk-src-active');

    state.dskState.forEach((dsk, index) => {
      const sourceName = getSourceName(dsk.sourceIndex);
      const modeName = getEffectiveKeyMode(dsk) === 'DVE_FULL' ? 'DVE' : (KEY_MODES[dsk.keyMode] || 'OFF');
      const dveSuffix = dsk.dveEnabled && getEffectiveKeyMode(dsk) !== 'DVE_FULL' ? '+DVE' : '';
      const previewSuffix = state.previewKeyState[index] ? ' · PVW' : '';
      const info = dom.dskInfoEls[index];
      const cutButton = dom.dskCutButtons[index];

      info.innerHTML = `<span class="dsk-info-source">${sourceName}</span><span class="dsk-info-mode">${modeName}${dveSuffix}${previewSuffix}</span>`;
      info.className = `dsk-info${dsk.active ? ' dsk-info-active' : ''}`;

      cutButton.className = `dsk-btn${dsk.active ? ' dsk-key-on' : ''}`;
      setPressed(cutButton, dsk.active);
    });

    updateSourceAvailabilityUI();
  }

  function requestFullscreen(target) {
    const request = target.requestFullscreen || target.webkitRequestFullscreen || target.mozRequestFullScreen || target.msRequestFullscreen;
    if (!request) {
      if (IS_APPLE_SAFARI) {
        state.pseudoFullscreen = true;
        document.body.classList.add('pseudo-fullscreen');
        updateFullscreenButton();
      }
      return Promise.resolve();
    }

    try {
      const result = request.call(target);
      if (result && typeof result.then === 'function') {
        return result.catch(() => {
          if (IS_APPLE_SAFARI) {
            state.pseudoFullscreen = true;
            document.body.classList.add('pseudo-fullscreen');
            updateFullscreenButton();
          }
        });
      }
      return Promise.resolve();
    } catch {
      if (IS_APPLE_SAFARI) {
        state.pseudoFullscreen = true;
        document.body.classList.add('pseudo-fullscreen');
        updateFullscreenButton();
      }
      return Promise.resolve();
    }
  }

  function exitFullscreen() {
    if (state.pseudoFullscreen) {
      state.pseudoFullscreen = false;
      document.body.classList.remove('pseudo-fullscreen');
      updateFullscreenButton();
      return Promise.resolve();
    }

    const exit = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
    if (!exit) return Promise.resolve();
    try {
      const result = exit.call(document);
      return result && typeof result.catch === 'function' ? result.catch(() => {}) : Promise.resolve();
    } catch {
      return Promise.resolve();
    }
  }

  function setHotkeyMenuState(isOpen) {
    if (dom.menuButton) dom.menuButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    if (dom.hotkeySplash) dom.hotkeySplash.classList.toggle('show', isOpen);
  }

  function setShortcutHintState(isVisible) {
    state.shortcutHintsVisible = !!isVisible;
    document.body.classList.toggle('shortcut-hints-visible', state.shortcutHintsVisible);
    updateUtilityMenuActions();
  }

  function toggleBannerVisibility() {
    state.bannersVisible = !state.bannersVisible;
    document.body.classList.toggle('banners-hidden', !state.bannersVisible);
    updateUtilityMenuActions();
  }

  function toggleShortcutHintState() {
    pushActionUndoState();
    setShortcutHintState(!state.shortcutHintsVisible);
  }

  function updateFullscreenButton() {

    const active = isFullscreenActive();
    dom.fullscreenButton.textContent = active ? EXIT_FULLSCREEN_LABEL : FULLSCREEN_LABEL;
    document.body.classList.toggle('hotkey-fullscreen-active', active);
    updateUtilityMenuActions();
    scheduleLayout();
  }

  function setMenuActionCopy(button, title, meta, shortcut = '', options = {}) {
    if (!button) return;
    const { toggle = false, on = false } = options;
    button.classList.toggle('menu-action-btn-toggle', !!toggle);
    if (toggle) {
      button.dataset.switchState = on ? 'on' : 'off';
    } else {
      delete button.dataset.switchState;
    }

    const shortcutMarkup = (!toggle && shortcut) ? `<span class="menu-action-key" aria-hidden="true">${escapeHtml(shortcut)}</span>` : '';
    const switchMarkup = toggle ? '<span class="menu-switch" aria-hidden="true"><span class="menu-switch-knob"></span></span>' : '';
    button.innerHTML = `<span class="menu-action-copy-wrap"><span class="menu-action-title">${escapeHtml(title)}</span><span class="menu-action-meta">${escapeHtml(meta)}</span></span>${shortcutMarkup}${switchMarkup}`;
    button.setAttribute('aria-label', `${title}${shortcut && !toggle ? ` (${shortcut})` : ''} — ${meta}`);
  }

  function updateUtilityMenuActions() {
    if (dom.menuFullscreenAction) {
      const fullscreenActive = isFullscreenActive();
      setMenuActionCopy(dom.menuFullscreenAction, fullscreenActive ? 'Exit Fullscreen' : 'Enter Fullscreen', fullscreenActive ? 'Return to the standard window size' : 'Use the full screen for cleaner operation', '', { toggle: true, on: fullscreenActive });
      setPressed(dom.menuFullscreenAction, fullscreenActive);
    }

    if (dom.menuLessonsAction) {
      setMenuActionCopy(dom.menuLessonsAction, 'Open Lessons', 'Step-by-step guided training with Watch and Drive modes');
      setPressed(dom.menuLessonsAction, false);
    }

    if (dom.menuModeAction) {
      setMenuActionCopy(dom.menuModeAction, state.quizMode ? 'Return to Freeplay' : 'Open Quiz Mode', state.quizMode ? 'Leave the active quiz workflow' : 'Switch from practice mode into scoring', '', { toggle: true, on: state.quizMode });
      setPressed(dom.menuModeAction, state.quizMode);
    }

    if (dom.menuSurfaceAction) {
      const canSwitch = canSwitchSurface();
      const nextSurfaceLabel = state.surfaceMode === 'ME_PP' ? 'ME 1' : 'ME P/P';
      setMenuActionCopy(dom.menuSurfaceAction, `Switch to ${nextSurfaceLabel}`, canSwitch ? 'Change the active switcher surface' : 'Unavailable while a transition is running');
      dom.menuSurfaceAction.disabled = !canSwitch;
      setPressed(dom.menuSurfaceAction, state.surfaceMode === 'ME1');
    }

    if (dom.menuMediaAction) {
      setMenuActionCopy(dom.menuMediaAction, 'Open Media Resources', 'Assign graphics to M1/M2 and load the media transition', 'B');
      dom.menuMediaAction.disabled = false;
      setPressed(dom.menuMediaAction, dom.mediaModalOverlay ? dom.mediaModalOverlay.classList.contains('show') : false);
    }

    if (dom.menuHotkeysAction) {
      setMenuActionCopy(dom.menuHotkeysAction, state.shortcutHintsVisible ? 'Hide Hot Keys on Controls' : 'Show Hot Keys on Controls', state.shortcutHintsVisible ? 'Remove shortcut markers from the switcher buttons' : 'Display shortcut markers directly on the switcher buttons', '', { toggle: true, on: state.shortcutHintsVisible });
      dom.menuHotkeysAction.disabled = false;
      setPressed(dom.menuHotkeysAction, state.shortcutHintsVisible);
    }


    if (dom.menuUndoDveAction) {
      const undoDisabled = (state.quizMode && isRunTheShow()) || !state.actionUndoStack.length;
      setMenuActionCopy(dom.menuUndoDveAction, undoDisabled ? 'Undo Unavailable' : 'Undo Last Action', undoDisabled ? (state.quizMode && isRunTheShow() ? 'Undo is locked during run the show' : 'No action is ready to reverse') : 'Reverse the most recent switcher change', '⌘Z');
      dom.menuUndoDveAction.disabled = undoDisabled;
      setPressed(dom.menuUndoDveAction, false);
    }

    if (dom.menuResetDveAction) {
      const resetDveDisabled = state.quizMode || !state.activeDveEnabled;
      setMenuActionCopy(dom.menuResetDveAction, resetDveDisabled ? 'Reset DVE Unavailable' : 'Reset Active DVE', resetDveDisabled ? 'Enable DVE in freeplay to reset this channel' : 'Restore the active DVE to its defaults');
      dom.menuResetDveAction.disabled = resetDveDisabled;
      setPressed(dom.menuResetDveAction, false);
    }

    if (dom.menuResetAction) {
      const resetDisabled = state.quizMode;
      setMenuActionCopy(dom.menuResetAction, resetDisabled ? 'Reset Disabled in Quiz' : 'Reset Freeplay', resetDisabled ? 'Resets stay locked while a quiz is active' : 'Return the switcher to a clean practice state');
      dom.menuResetAction.disabled = resetDisabled;
      setPressed(dom.menuResetAction, false);
    }

    if (dom.menuBannersAction) {
      setMenuActionCopy(dom.menuBannersAction, state.bannersVisible ? 'Hide PGM/PVW Labels' : 'Show PGM/PVW Labels', state.bannersVisible ? 'Hide the PROGRAM and PREVIEW banners from the multiviewer' : 'Show the PROGRAM and PREVIEW banners on the multiviewer', '', { toggle: true, on: !state.bannersVisible });
      setPressed(dom.menuBannersAction, !state.bannersVisible);
    }
  }

  function dismissHotkeySplash() {
    setHotkeyMenuState(false);
  }

  function showHotkeySplash() {
    updateUtilityMenuActions();
    setHotkeyMenuState(true);
  }

  function toggleHotkeySplash() {
    if (!dom.hotkeySplash) return;
    if (dom.hotkeySplash.classList.contains('show')) {
      dismissHotkeySplash();
      return;
    }
    showHotkeySplash();
  }

  function handleUtilityMenuAction(action) {
    switch (action) {
      case 'fullscreen':
        toggleFullscreen();
        dismissHotkeySplash();
        break;
      case 'lessons':
        dismissHotkeySplash();
        enterLessonMode();
        break;
      case 'mode':
        dismissHotkeySplash();
        setMode(state.quizMode ? 'freeplay' : 'quiz');
        break;
      case 'surface':
        if (!canSwitchSurface()) return;
        switchSurface(state.surfaceMode === 'ME_PP' ? 'ME1' : 'ME_PP');
        dismissHotkeySplash();
        break;
      case 'media':
        dismissHotkeySplash();
        openMediaModal();
        break;
      case 'hotkeys':
        dismissHotkeySplash();
        toggleShortcutHintState();
        break;
      case 'hints':
        dismissHotkeySplash();
        break;
      case 'undo-dve':
        if (state.quizMode && isRunTheShow()) return;
        undoLastAction();
        dismissHotkeySplash();
        break;
      case 'reset-dve':
        if (state.quizMode || !state.activeDveEnabled) return;
        resetDVE();
        dismissHotkeySplash();
        break;
      case 'reset':
        if (state.quizMode) return;
        dismissHotkeySplash();
        resetFreeplay();
        break;
      case 'banners':
        dismissHotkeySplash();
        toggleBannerVisibility();
        break;
      default:
        break;
    }
  }

  function enterFullscreenAndStart() {
    requestFullscreen(document.documentElement);
    dismissWelcome();
  }

  function dismissWelcome() {
    dom.welcomeOverlay.classList.remove('welcome-show');
    dom.modeFreeplayButton.focus();
    scheduleLayout();
  }

  function toggleFullscreen() {
    if (isFullscreenActive()) exitFullscreen();
    else requestFullscreen(document.documentElement);
  }

  function detectDevice() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const touch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    const portrait = height > width;
    const ua = navigator.userAgent.toLowerCase();
    const isMobile = /iphone|ipod|android.*mobile|windows phone/i.test(ua);
    const isTablet = /ipad|android(?!.*mobile)/i.test(ua) || (touch && Math.min(width, height) >= 600);

    let device = 'desktop';
    if (isMobile || (touch && Math.min(width, height) < 600)) device = 'phone';
    else if (isTablet) device = 'tablet';

    return { device, portrait, width, height };
  }

  function applyLayout() {
    const info = detectDevice();

    dom.wrapper.className = '';
    dom.panel.className = '';
    dom.wrapper.classList.add(`layout-${info.device}`);
    if (info.portrait) dom.wrapper.classList.add('portrait');

    if (dom.deviceBadge) {
      dom.deviceBadge.textContent = `${info.device.toUpperCase()}${info.portrait ? ' · Portrait' : ' · Landscape'} · ${info.width}×${info.height}`;
    }

    const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
    const viewportHeight = document.documentElement.clientHeight || window.innerHeight;
    const horizontalPadding = 12;
    const verticalPadding = 12;

    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';
    dom.wrapper.style.transformOrigin = 'top center';
    dom.wrapper.style.transform = 'none';
    dom.panel.style.maxHeight = 'none';

    if (info.device === 'phone') {
      dom.wrapper.style.width = `${PHONE_WIDTH}px`;
      dom.wrapper.style.minWidth = '0';
      dom.wrapper.style.maxWidth = 'none';
      const baseHeight = dom.wrapper.scrollHeight;
      const scale = Math.min((viewportWidth - horizontalPadding) / PHONE_WIDTH, (viewportHeight - verticalPadding) / baseHeight, 1);
      dom.wrapper.style.transform = `scale(${scale})`;
      document.body.style.height = `${Math.round(baseHeight * scale)}px`;
      updateSurfaceUI();
      return;
    }

    if (info.device === 'tablet') {
      const portraitTablet = info.portrait;
      const tabletWidth = portraitTablet ? Math.max(760, viewportWidth - horizontalPadding) : TABLET_LAYOUT_WIDTH;
      dom.wrapper.style.width = `${tabletWidth}px`;
      dom.wrapper.style.minWidth = '0';
      dom.wrapper.style.maxWidth = 'none';
      const baseHeight = dom.wrapper.scrollHeight;
      const scale = portraitTablet
        ? Math.min((viewportWidth - horizontalPadding) / tabletWidth, 1)
        : Math.min((viewportWidth - horizontalPadding) / TABLET_LAYOUT_WIDTH, (viewportHeight - verticalPadding) / baseHeight, 1);
      dom.wrapper.style.transform = scale < 0.999 ? `scale(${scale})` : 'none';
      document.body.style.height = `${Math.round(baseHeight * scale)}px`;
      updateSurfaceUI();
      return;
    }

    const maxWidth = Math.max(1080, viewportWidth - horizontalPadding);
    const maxHeight = Math.max(640, viewportHeight - verticalPadding);

    const targetWidth = Math.min(maxWidth, DESKTOP_PANEL_MAX_WIDTH);
    dom.wrapper.style.width = `${targetWidth}px`;
    dom.wrapper.style.minWidth = '0';
    dom.wrapper.style.maxWidth = 'none';

    const finalHeight = dom.wrapper.scrollHeight;
    const finalWidth = Math.max(targetWidth, dom.wrapper.scrollWidth);
    const scaleByHeight = finalHeight > maxHeight ? (maxHeight / finalHeight) : 1;
    const scaleByWidth = finalWidth > (viewportWidth - horizontalPadding)
      ? ((viewportWidth - horizontalPadding) / finalWidth)
      : 1;
    const finalScale = Math.min(scaleByHeight, scaleByWidth, 1);

    dom.wrapper.style.transform = finalScale < 0.999 ? `scale(${finalScale})` : 'none';
    document.body.style.height = `${Math.round(finalHeight * finalScale)}px`;
    updateSurfaceUI();
  }

  function setQuizButtonVisibility({ start = false, check = false, skip = false } = {}) {
    showWhen(dom.quizStartButton, start);
    showWhen(dom.quizCheckButton, check);
    showWhen(dom.quizSkipButton, skip);
  }

  function resetSingleDsk(dsk) {
    Object.assign(dsk, createDefaultDskState());
  }

  function resetFreeplay() {
    if (state.quizMode) return;
    pushActionUndoState();
    state.macroSlots = Array.from({ length: MACRO_SLOT_COUNT }, () => null);
    persistMacroSlots();
    state.meMemorySlots = {
      ME_PP: Array.from({ length: ME_MEMORY_SLOT_COUNT }, () => null),
      ME1: Array.from({ length: ME_MEMORY_SLOT_COUNT }, () => null),
    };
    state.meMemoryMode = null;
    resetSwitcherState();
    scheduleLayout();
  }

  function resetSwitcherState() {
    resetMediaResourcesToDefaults();
    const freshMain = createDefaultBusState();
    const freshMe1 = createDefaultBusState();
    if (state.quizMode && !isRunTheShow()) {
      state.meMemorySlots = {
        ME_PP: Array.from({ length: ME_MEMORY_SLOT_COUNT }, () => null),
        ME1: Array.from({ length: ME_MEMORY_SLOT_COUNT }, () => null),
      };
      state.meMemoryMode = null;
    }
    state.surfaceStates.ME_PP = cloneBusState(freshMain);
    state.surfaceStates.ME1 = cloneBusState(freshMe1);
    applyBusSnapshot(state.surfaceMode === 'ME1' ? freshMe1 : freshMain);
    clearTransitionOverlays();
    refreshAllUI();
  }

  function resetQuiz() {
    state.quizQuestions = [];
    state.quizCurrent = 0;
    state.quizScore = 0;
    state.quizResults = [];
    state.quizLevel = null;
    state.quizType = null;
    state.quizAllCorrect = true;
    state.rtsStepMissed = false;
    state.practiceQuiz = false;
    setPracticeQuizToggle(false);
    dom.quizQuestionNum.textContent = '1/10';
    dom.quizScoreDisplay.textContent = 'Score: 0';
    dom.quizTimer.textContent = '0:00';
    dom.quizPrompt.textContent = 'Press START to begin the quiz';
    dom.quizPrompt.style.color = '#f5a623';
    setQuizButtonVisibility({ start: true, check: false, skip: false });
  }

  const LEVEL_LABELS = {
    'bank-1': 'Level 1 — Basic',
    'bank-2': 'Level 2 — Intermediate',
    'bank-3': 'Level 3 — Advanced',
    'bank-4': 'Level 4 — Expert',
    'rts-1': 'Run the Show — Basic',
    'rts-2': 'Run the Show — Intermediate',
    'rts-3': 'Run the Show — Advanced',
    'rts-4': 'Run the Show — Expert',
  };

  const idx = (name) => getSourceIndex(name);

  function previewSourceCheck(source) {
    const sourceIndex = typeof source === 'number' ? source : idx(source);
    return state.pvwIndex === sourceIndex;
  }

  function keyPreparedCheck(dskIndex, options = {}) {
    return dskMatches(dskIndex, { active: false, preview: false, ...options });
  }

  function keyPreviewCheck(dskIndex, options = {}) {
    return dskMatches(dskIndex, { preview: true, ...options });
  }

  function keyLiveNoTieCheck(dskIndex, options = {}) {
    return dskMatches(dskIndex, { active: true, preview: false, ...options });
  }

  function keyOffCheck(dskIndex, method = 'cut') {
    return dskMatches(dskIndex, { active: false, preview: false }) && lastDskMethodIs(dskIndex, method, false);
  }

  function mediaBankLoadedCheck(bankName, mediaId) {
    return getBankMediaId(bankName) === mediaId;
  }

  function mediaKeyPreparedCheck(dskIndex, bankName, mediaId, options = {}) {
    return mediaBankLoadedCheck(bankName, mediaId) && keyPreparedCheck(dskIndex, { sourceIndex: idx(bankName), ...options });
  }

  function mediaKeyPreviewCheck(dskIndex, bankName, mediaId, options = {}) {
    return mediaBankLoadedCheck(bankName, mediaId) && keyPreviewCheck(dskIndex, { sourceIndex: idx(bankName), ...options });
  }

  function mediaKeyLiveNoTieCheck(dskIndex, bankName, mediaId, options = {}) {
    return mediaBankLoadedCheck(bankName, mediaId) && keyLiveNoTieCheck(dskIndex, { sourceIndex: idx(bankName), ...options });
  }

  function mediaDskMatches(dskIndex, bankName, mediaId, options = {}) {
    return mediaBankLoadedCheck(bankName, mediaId) && dskMatches(dskIndex, { sourceIndex: idx(bankName), ...options });
  }

  function mediaKeyTakeWithBackgroundCheck(sourceName, method, dskIndex, bankName, mediaId, extra = {}) {
    return mediaBankLoadedCheck(bankName, mediaId) && keyTakeWithBackgroundCheck(idx(sourceName), method, dskIndex, { sourceIndex: idx(bankName), ...extra });
  }

  /* ============================================================
     QUIZ BANK — 20 questions per level, 10 drawn at random
     ============================================================ */

const QUIZ_BANK = {
  'bank-1': [
    buildTakeQuestion('GFX'),
    buildDissolveQuestion('GFX'),
    buildTakeQuestion('CPU'),
    buildDissolveQuestion('CPU'),
    buildTakeQuestion('CAM 1'),
    buildDissolveQuestion('CAM 1'),
    buildTakeQuestion('CAM 2'),
    buildDissolveQuestion('CAM 2'),
    buildTakeQuestion('CAM 3'),
    buildDissolveQuestion('CAM 3'),
    buildTakeQuestion('BLK'),
    buildDissolveQuestion('BLK'),
    { prompt: 'Ready CAM 1. Take CAM 1. Ready CAM 2. Take CAM 2.', check: () => backgroundTransitionCheck(idx('CAM 2'), 'cut') },
    { prompt: 'Set CPU. Dissolve to CPU. Set CAM 1. Dissolve to CAM 1.', check: () => backgroundTransitionCheck(idx('CAM 1'), 'auto') },
    { prompt: 'Ready CAM 3. Take CAM 3. Ready CPU. Take CPU.', check: () => backgroundTransitionCheck(idx('CPU'), 'cut') },
    { prompt: 'Set GFX. Dissolve to GFX. Set CAM 1. Dissolve to CAM 1.', check: () => backgroundTransitionCheck(idx('CAM 1'), 'auto') },
    { prompt: 'Ready CAM 2. Take CAM 2. Ready CAM 3. Take CAM 3.', check: () => backgroundTransitionCheck(idx('CAM 3'), 'cut') },
    { prompt: 'Set CAM 2. Dissolve to CAM 2. Set CPU. Dissolve to CPU.', check: () => backgroundTransitionCheck(idx('CPU'), 'auto') },
    { prompt: 'Ready GFX. Take GFX. Ready BLK. Take BLK.', check: () => backgroundTransitionCheck(idx('BLK'), 'cut') },
    { prompt: 'Set CAM 3. Dissolve to CAM 3. Set BLK. Dissolve to BLK.', check: () => backgroundTransitionCheck(idx('BLK'), 'auto') },
  ],

  'bank-2': [
    { prompt: 'Load Side Graphic to M1. Set Key 1 with M1, self key. Preview Key 1. Set CAM 1. Dissolve to CAM 1 with Key 1.', check: () => mediaKeyTakeWithBackgroundCheck('CAM 1', 'auto', 0, 'M1', 'side-graphic-tips', { keyMode: 'SELF' }) },
    { prompt: 'Load Side Graphic to M2. Set Key 1 with M2, self key. Preview Key 1. Ready CAM 3. Take CAM 3 with Key 1.', check: () => mediaKeyTakeWithBackgroundCheck('CAM 3', 'cut', 0, 'M2', 'side-graphic-tips', { keyMode: 'SELF' }) },
    { prompt: 'Load Live Bug to M1. Set Key 1 with M1, chroma blue. Preview Key 1. Set CPU. Dissolve to CPU with Key 1.', check: () => mediaKeyTakeWithBackgroundCheck('CPU', 'auto', 0, 'M1', 'live-bug', { keyMode: 'CHR', chrColor: 'blue' }) },
    { prompt: 'Ready CAM 1. Take CAM 1. Set Key 1 with M1, self key. Take Key 1.', check: () => backgroundTransitionCheck(idx('CAM 1'), 'cut') && dskMatches(0, { sourceIndex: idx('M1'), keyMode: 'SELF', active: true }) && lastDskMethodIs(0, 'cut', true) },
    { prompt: 'Ready CAM 3. Take CAM 3. Set Key 1 with M2, self key. Auto Key 1 on.', check: () => backgroundTransitionCheck(idx('CAM 3'), 'cut') && dskMatches(0, { sourceIndex: idx('M2'), keyMode: 'SELF', active: true }) && lastDskMethodIs(0, 'auto', true) },
    { prompt: 'Ready CPU. Take CPU. Load OTS to M2. Set Key 1 with M2, chroma green. Take Key 1.', check: () => backgroundTransitionCheck(idx('CPU'), 'cut') && mediaDskMatches(0, 'M2', 'ots', { keyMode: 'CHR', chrColor: 'green', active: true }) && lastDskMethodIs(0, 'cut', true) },
    { prompt: 'Ready CAM 1. Take CAM 1. Set Key 1 with M1, self key. Take Key 1. Ready CAM 2. Take CAM 2 under Key 1.', check: () => backgroundTransitionCheck(idx('CAM 2'), 'cut') && dskMatches(0, { sourceIndex: idx('M1'), keyMode: 'SELF', active: true }) },
    { prompt: 'Ready CAM 3. Take CAM 3. Set Key 1 with M2, self key. Auto Key 1 on. Set CAM 2. Dissolve to CAM 2 under Key 1.', check: () => backgroundTransitionCheck(idx('CAM 2'), 'auto') && dskMatches(0, { sourceIndex: idx('M2'), keyMode: 'SELF', active: true }) },
    { prompt: 'Ready CPU. Take CPU. Load Full Screen Graphic to M1. Set Key 1 with M1, luma key. Take Key 1. Ready CAM 1. Take CAM 1 under Key 1.', check: () => backgroundTransitionCheck(idx('CAM 1'), 'cut') && mediaDskMatches(0, 'M1', 'full-screen-graphic', { keyMode: 'LUMA', active: true }) },
    { prompt: 'Set Key 1 with M1, self key. Preview Key 1. Set CAM 1. Dissolve to CAM 1 with Key 1. Lose Key 1 tie. Ready CAM 2. Take CAM 2 under Key 1.', check: () => backgroundTransitionCheck(idx('CAM 2'), 'cut') && keyLiveNoTieCheck(0, { sourceIndex: idx('M1'), keyMode: 'SELF' }) },
    { prompt: 'Set Key 1 with M2, self key. Preview Key 1. Ready CAM 3. Take CAM 3 with Key 1. Lose Key 1 tie. Set CAM 2. Dissolve to CAM 2 under Key 1.', check: () => backgroundTransitionCheck(idx('CAM 2'), 'auto') && keyLiveNoTieCheck(0, { sourceIndex: idx('M2'), keyMode: 'SELF' }) },
    { prompt: 'Load Live Bug to M1. Set Key 1 with M1, chroma blue. Preview Key 1. Ready CPU. Take CPU with Key 1. Lose Key 1 tie. Ready CAM 2. Take CAM 2 under Key 1.', check: () => backgroundTransitionCheck(idx('CAM 2'), 'cut') && mediaKeyLiveNoTieCheck(0, 'M1', 'live-bug', { keyMode: 'CHR', chrColor: 'blue' }) },
    { prompt: 'Ready CAM 1. Take CAM 1. Set Key 1 with M1, self key. Take Key 1. Take Key 1 off.', check: () => backgroundTransitionCheck(idx('CAM 1'), 'cut') && dskMatches(0, { sourceIndex: idx('M1'), keyMode: 'SELF', active: false }) && lastDskMethodIs(0, 'cut', false) },
    { prompt: 'Ready CAM 3. Take CAM 3. Set Key 1 with M2, self key. Auto Key 1 on. Auto Key 1 off.', check: () => backgroundTransitionCheck(idx('CAM 3'), 'cut') && dskMatches(0, { sourceIndex: idx('M2'), keyMode: 'SELF', active: false }) && lastDskMethodIs(0, 'auto', false) },
    { prompt: 'Ready CPU. Take CPU. Load OTS to M2. Set Key 1 with M2, chroma green. Auto Key 1 on. Take Key 1 off.', check: () => backgroundTransitionCheck(idx('CPU'), 'cut') && mediaDskMatches(0, 'M2', 'ots', { keyMode: 'CHR', chrColor: 'green', active: false }) && lastDskMethodIs(0, 'cut', false) },
    { prompt: 'Set Key 1 with M1, self key. Preview Key 1. Ready CAM 1. Take CAM 1 with Key 1. Auto Key 1 off.', check: () => backgroundTransitionCheck(idx('CAM 1'), 'cut') && dskMatches(0, { sourceIndex: idx('M1'), keyMode: 'SELF', active: false, preview: true }) && lastDskMethodIs(0, 'auto', false) },
    { prompt: 'Set Key 1 with M2, self key. Preview Key 1. Set CAM 3. Dissolve to CAM 3 with Key 1. Take Key 1 off.', check: () => backgroundTransitionCheck(idx('CAM 3'), 'auto') && dskMatches(0, { sourceIndex: idx('M2'), keyMode: 'SELF', active: false, preview: true }) && lastDskMethodIs(0, 'cut', false) },
    { prompt: 'Load Full Screen Graphic to M1. Set Key 1 with M1, luma key. Preview Key 1. Ready CPU. Take CPU with Key 1. Auto Key 1 off.', check: () => backgroundTransitionCheck(idx('CPU'), 'cut') && mediaDskMatches(0, 'M1', 'full-screen-graphic', { keyMode: 'LUMA', active: false, preview: true }) && lastDskMethodIs(0, 'auto', false) },
    { prompt: 'Ready CAM 2. Take CAM 2. Set Key 1 with M1, self key. Take Key 1. Set CPU. Dissolve to CPU under Key 1.', check: () => backgroundTransitionCheck(idx('CPU'), 'auto') && dskMatches(0, { sourceIndex: idx('M1'), keyMode: 'SELF', active: true }) },
    { prompt: 'Ready CPU. Take CPU. Load Live Bug to M1. Set Key 1 with M1, chroma blue. Take Key 1. Set BLK. Dissolve to BLK under Key 1.', check: () => backgroundTransitionCheck(idx('BLK'), 'auto') && mediaDskMatches(0, 'M1', 'live-bug', { keyMode: 'CHR', chrColor: 'blue', active: true }) },
  ],

  'bank-3': [
    { prompt: 'Set Key 1 with CPU. DVE Key 1 on. Size down and move bottom right. Preview Key 1. Set CAM 1. Dissolve to CAM 1 with Key 1.', check: () => keyTakeWithBackgroundCheck(idx('CAM 1'), 'auto', 0, { sourceIndex: idx('CPU'), dveEnabled: true, dveZone: 'bottom-right' }) },
    { prompt: 'Set Key 1 with CPU. DVE Key 1 on. Size down and move top left. Preview Key 1. Ready CAM 2. Take CAM 2 with Key 1.', check: () => keyTakeWithBackgroundCheck(idx('CAM 2'), 'cut', 0, { sourceIndex: idx('CPU'), dveEnabled: true, dveZone: 'top-left' }) },
    { prompt: 'Set Key 1 with CPU. DVE Key 1 on. Size down and move top right. Preview Key 1. Ready CAM 3. Take CAM 3 with Key 1.', check: () => keyTakeWithBackgroundCheck(idx('CAM 3'), 'cut', 0, { sourceIndex: idx('CPU'), dveEnabled: true, dveZone: 'top-right' }) },
    { prompt: 'Set Key 1 with M1, self key. Preview Key 1. Set CAM 1. Dissolve to CAM 1 with Key 1. Lose Key 1 tie. Ready CAM 2. Take CAM 2 under Key 1.', check: () => backgroundTransitionCheck(idx('CAM 2'), 'cut') && keyLiveNoTieCheck(0, { sourceIndex: idx('M1'), keyMode: 'SELF' }) },
    { prompt: 'Set Key 1 with M2, self key. DVE Key 1 on. Move it right. Preview Key 1. Set CAM 3. Dissolve to CAM 3 with Key 1.', check: () => keyTakeWithBackgroundCheck(idx('CAM 3'), 'auto', 0, { sourceIndex: idx('M2'), keyMode: 'SELF', dveEnabled: true, dveZone: 'right' }) },
    { prompt: 'Load Live Bug to M1. Set Key 1 with M1, chroma blue. Preview Key 1. Ready CPU. Take CPU with Key 1. Lose Key 1 tie. Ready CAM 2. Take CAM 2 under Key 1.', check: () => backgroundTransitionCheck(idx('CAM 2'), 'cut') && mediaKeyLiveNoTieCheck(0, 'M1', 'live-bug', { keyMode: 'CHR', chrColor: 'blue' }) },
    { prompt: 'Ready CAM 1. Take CAM 1. Set Key 2 with CPU. DVE Key 2 on. Size down and move bottom left. Take Key 2.', check: () => backgroundTransitionCheck(idx('CAM 1'), 'cut') && dskMatches(1, { sourceIndex: idx('CPU'), dveEnabled: true, dveZone: 'bottom-left', active: true }) && lastDskMethodIs(1, 'cut', true) },
    { prompt: 'Ready CAM 3. Take CAM 3. Set Key 2 with M2, self key. DVE Key 2 on. Move it right. Auto Key 2 on.', check: () => backgroundTransitionCheck(idx('CAM 3'), 'cut') && dskMatches(1, { sourceIndex: idx('M2'), keyMode: 'SELF', dveEnabled: true, dveZone: 'right', active: true }) && lastDskMethodIs(1, 'auto', true) },
    { prompt: 'Ready CPU. Take CPU. Load Live Bug to M2. Set Key 2 with M2, chroma blue. Take Key 2. Ready CAM 1. Take CAM 1 under Key 2.', check: () => backgroundTransitionCheck(idx('CAM 1'), 'cut') && mediaDskMatches(1, 'M2', 'live-bug', { keyMode: 'CHR', chrColor: 'blue', active: true }) },
    { prompt: 'Set Key 1 with CPU. DVE Key 1 on. Scale up and move left. Preview Key 1. Ready CAM 2. Take CAM 2 with Key 1.', check: () => keyTakeWithBackgroundCheck(idx('CAM 2'), 'cut', 0, { sourceIndex: idx('CPU'), dveEnabled: true, dveZone: 'left-large' }) },
    { prompt: 'Set Key 1 with M1, self key. Preview Key 1. Ready CAM 1. Take CAM 1 with Key 1. Auto Key 1 off.', check: () => backgroundTransitionCheck(idx('CAM 1'), 'cut') && dskMatches(0, { sourceIndex: idx('M1'), keyMode: 'SELF', active: false, preview: true }) && lastDskMethodIs(0, 'auto', false) },
    { prompt: 'Set Key 1 with M2, self key. DVE Key 1 on. Move it right. Preview Key 1. Ready CAM 3. Take CAM 3 with Key 1. Take Key 1 off.', check: () => backgroundTransitionCheck(idx('CAM 3'), 'cut') && dskMatches(0, { sourceIndex: idx('M2'), keyMode: 'SELF', dveEnabled: true, dveZone: 'right', active: false, preview: true }) && lastDskMethodIs(0, 'cut', false) },
    { prompt: 'Set Key 1 with CPU. DVE Key 1 on. Size down and move center. Preview Key 1. Set CAM 2. Dissolve to CAM 2 with Key 1. Auto Key 1 off.', check: () => backgroundTransitionCheck(idx('CAM 2'), 'auto') && dskMatches(0, { sourceIndex: idx('CPU'), dveEnabled: true, dveZone: 'center', active: false, preview: true }) && lastDskMethodIs(0, 'auto', false) },
    { prompt: 'Ready CAM 2. Take CAM 2. Set Key 3 with CPU. DVE Key 3 on. Scale up and move left. Take Key 3.', check: () => backgroundTransitionCheck(idx('CAM 2'), 'cut') && dskMatches(2, { sourceIndex: idx('CPU'), dveEnabled: true, dveZone: 'left-large', active: true }) && lastDskMethodIs(2, 'cut', true) },
    { prompt: 'Ready CAM 1. Take CAM 1. Load Full Screen Graphic to M1. Set Key 3 with M1, luma key. Auto Key 3 on. Ready CPU. Take CPU under Key 3.', check: () => backgroundTransitionCheck(idx('CPU'), 'cut') && mediaDskMatches(2, 'M1', 'full-screen-graphic', { keyMode: 'LUMA', active: true }) },
    { prompt: 'Set Key 2 with CPU. DVE Key 2 on. Size down and move bottom right. Preview Key 2. Set CAM 1. Dissolve to CAM 1 with Key 2. Lose Key 2 tie. Ready CPU. Take CPU under Key 2.', check: () => backgroundTransitionCheck(idx('CPU'), 'cut') && keyLiveNoTieCheck(1, { sourceIndex: idx('CPU'), dveEnabled: true, dveZone: 'bottom-right' }) },
    { prompt: 'Set Key 2 with M1, self key. Preview Key 2. Set CAM 1. Dissolve to CAM 1 with Key 2. Lose Key 2 tie. Set CAM 2. Dissolve to CAM 2 under Key 2.', check: () => backgroundTransitionCheck(idx('CAM 2'), 'auto') && keyLiveNoTieCheck(1, { sourceIndex: idx('M1'), keyMode: 'SELF' }) },
    { prompt: 'Set Key 2 with M2, self key. DVE Key 2 on. Move it right. Preview Key 2. Ready CAM 3. Take CAM 3 with Key 2. Lose Key 2 tie. Ready CAM 2. Take CAM 2 under Key 2.', check: () => backgroundTransitionCheck(idx('CAM 2'), 'cut') && keyLiveNoTieCheck(1, { sourceIndex: idx('M2'), keyMode: 'SELF', dveEnabled: true, dveZone: 'right' }) },
    { prompt: 'Ready CPU. Take CPU. Set Key 3 with CPU. DVE Key 3 on. Scale up and move left. Auto Key 3 on. Auto Key 3 off.', check: () => backgroundTransitionCheck(idx('CPU'), 'cut') && dskMatches(2, { sourceIndex: idx('CPU'), dveEnabled: true, dveZone: 'left-large', active: false }) && lastDskMethodIs(2, 'auto', false) },
    { prompt: 'Load OTS to M2. Set Key 1 with M2, chroma green. Preview Key 1. Set BLK. Dissolve to BLK with Key 1.', check: () => mediaKeyTakeWithBackgroundCheck('BLK', 'auto', 0, 'M2', 'ots', { keyMode: 'CHR', chrColor: 'green' }) },
  ],
};


  /* ============================================================
     RUN THE SHOW — fixed sequences, state carries forward
     ============================================================ */

const RUN_THE_SHOW = {
  'rts-1': [
    { prompt: 'Set GFX. Dissolve to GFX.', check: () => backgroundTransitionCheck(idx('GFX'), 'auto') },
    { prompt: 'Ready CPU. Take CPU.', check: () => backgroundTransitionCheck(idx('CPU'), 'cut') },
    { prompt: 'Set CAM 1. Dissolve to CAM 1.', check: () => backgroundTransitionCheck(idx('CAM 1'), 'auto') },
    { prompt: 'Ready CAM 2. Take CAM 2.', check: () => backgroundTransitionCheck(idx('CAM 2'), 'cut') },
    { prompt: 'Set CAM 3. Dissolve to CAM 3.', check: () => backgroundTransitionCheck(idx('CAM 3'), 'auto') },
    { prompt: 'Ready CPU. Take CPU.', check: () => backgroundTransitionCheck(idx('CPU'), 'cut') },
    { prompt: 'Set CAM 1. Dissolve to CAM 1.', check: () => backgroundTransitionCheck(idx('CAM 1'), 'auto') },
    { prompt: 'Ready CAM 2. Take CAM 2.', check: () => backgroundTransitionCheck(idx('CAM 2'), 'cut') },
    { prompt: 'Set CAM 3. Dissolve to CAM 3.', check: () => backgroundTransitionCheck(idx('CAM 3'), 'auto') },
    { prompt: 'Set BLK. Dissolve to BLK.', check: () => backgroundTransitionCheck(idx('BLK'), 'auto') },
  ],

  'rts-2': [
    { prompt: 'Set GFX. Dissolve to GFX.', check: () => backgroundTransitionCheck(idx('GFX'), 'auto') },
    { prompt: 'Ready CAM 1. Take CAM 1.', check: () => backgroundTransitionCheck(idx('CAM 1'), 'cut') },
    { prompt: 'Load Side Graphic to M1. Set Key 1 with M1, self key.', check: () => mediaKeyPreparedCheck(0, 'M1', 'side-graphic-tips', { keyMode: 'SELF' }) },
    { prompt: 'Preview Key 1.', check: () => mediaKeyPreviewCheck(0, 'M1', 'side-graphic-tips', { keyMode: 'SELF' }) },
    { prompt: 'Set CAM 1. Dissolve to CAM 1 with Key 1.', check: () => mediaKeyTakeWithBackgroundCheck('CAM 1', 'auto', 0, 'M1', 'side-graphic-tips', { keyMode: 'SELF' }) },
    { prompt: 'Lose Key 1 tie.', check: () => mediaKeyLiveNoTieCheck(0, 'M1', 'side-graphic-tips', { keyMode: 'SELF' }) },
    { prompt: 'Ready CAM 2. Take CAM 2 under Key 1.', check: () => backgroundTransitionCheck(idx('CAM 2'), 'cut') && mediaKeyLiveNoTieCheck(0, 'M1', 'side-graphic-tips', { keyMode: 'SELF' }) },
    { prompt: 'Take Key 1 off.', check: () => keyOffCheck(0, 'cut') },
    { prompt: 'Load Live Bug to M1. Set Key 1 with M1, chroma blue.', check: () => mediaKeyPreparedCheck(0, 'M1', 'live-bug', { keyMode: 'CHR', chrColor: 'blue' }) },
    { prompt: 'Preview Key 1.', check: () => mediaKeyPreviewCheck(0, 'M1', 'live-bug', { keyMode: 'CHR', chrColor: 'blue' }) },
    { prompt: 'Set CPU. Dissolve to CPU with Key 1.', check: () => mediaKeyTakeWithBackgroundCheck('CPU', 'auto', 0, 'M1', 'live-bug', { keyMode: 'CHR', chrColor: 'blue' }) },
    { prompt: 'Lose Key 1 tie.', check: () => mediaKeyLiveNoTieCheck(0, 'M1', 'live-bug', { keyMode: 'CHR', chrColor: 'blue' }) },
    { prompt: 'Ready CAM 3. Take CAM 3 under Key 1.', check: () => backgroundTransitionCheck(idx('CAM 3'), 'cut') && mediaKeyLiveNoTieCheck(0, 'M1', 'live-bug', { keyMode: 'CHR', chrColor: 'blue' }) },
    { prompt: 'Auto Key 1 off.', check: () => keyOffCheck(0, 'auto') },
    { prompt: 'Set BLK. Dissolve to BLK.', check: () => backgroundTransitionCheck(idx('BLK'), 'auto') },
  ],

  'rts-3': [
    { prompt: 'Set CPU. Dissolve to CPU.', check: () => backgroundTransitionCheck(idx('CPU'), 'auto') },
    { prompt: 'Load Side Graphic to M1. Set Key 1 with M1, self key.', check: () => mediaKeyPreparedCheck(0, 'M1', 'side-graphic-tips', { keyMode: 'SELF' }) },
    { prompt: 'Preview Key 1.', check: () => mediaKeyPreviewCheck(0, 'M1', 'side-graphic-tips', { keyMode: 'SELF' }) },
    { prompt: 'Set CAM 1. Dissolve to CAM 1 with Key 1.', check: () => mediaKeyTakeWithBackgroundCheck('CAM 1', 'auto', 0, 'M1', 'side-graphic-tips', { keyMode: 'SELF' }) },
    { prompt: 'Lose Key 1 tie.', check: () => mediaKeyLiveNoTieCheck(0, 'M1', 'side-graphic-tips', { keyMode: 'SELF' }) },
    { prompt: 'Ready CAM 3.', check: () => previewSourceCheck('CAM 3') },
    { prompt: 'Set Key 2 with M2, self key.', check: () => keyPreparedCheck(1, { sourceIndex: idx('M2'), keyMode: 'SELF' }) },
    { prompt: 'DVE Key 2 on. Move it right.', check: () => keyPreparedCheck(1, { sourceIndex: idx('M2'), keyMode: 'SELF', dveEnabled: true, dveZone: 'right' }) },
    { prompt: 'Preview Key 2.', check: () => keyPreviewCheck(1, { sourceIndex: idx('M2'), keyMode: 'SELF', dveEnabled: true, dveZone: 'right' }) },
    { prompt: 'Set CAM 3. Dissolve to CAM 3 with Key 2.', check: () => keyTakeWithBackgroundCheck(idx('CAM 3'), 'auto', 1, { sourceIndex: idx('M2'), keyMode: 'SELF', dveEnabled: true, dveZone: 'right' }) },
    { prompt: 'Take Key 2 off and lose its tie.', check: () => keyOffCheck(1, 'cut') },
    { prompt: 'Ready CAM 2.', check: () => previewSourceCheck('CAM 2') },
    { prompt: 'Set Key 3 with CPU.', check: () => keyPreparedCheck(2, { sourceIndex: idx('CPU') }) },
    { prompt: 'DVE Key 3 on. Scale up and move left.', check: () => keyPreparedCheck(2, { sourceIndex: idx('CPU'), dveEnabled: true, dveZone: 'left-large' }) },
    { prompt: 'Preview Key 3.', check: () => keyPreviewCheck(2, { sourceIndex: idx('CPU'), dveEnabled: true, dveZone: 'left-large' }) },
    { prompt: 'Ready CAM 2. Take CAM 2 with Key 3.', check: () => keyTakeWithBackgroundCheck(idx('CAM 2'), 'cut', 2, { sourceIndex: idx('CPU'), dveEnabled: true, dveZone: 'left-large' }) },
    { prompt: 'Ready CPU.', check: () => previewSourceCheck('CPU') },
    { prompt: 'Lose Key 3 tie.', check: () => keyLiveNoTieCheck(2, { sourceIndex: idx('CPU'), dveEnabled: true, dveZone: 'left-large' }) },
    { prompt: 'Take CPU under Key 3.', check: () => backgroundTransitionCheck(idx('CPU'), 'cut') && keyLiveNoTieCheck(2, { sourceIndex: idx('CPU'), dveEnabled: true, dveZone: 'left-large' }) },
    { prompt: 'Auto Key 3 off.', check: () => keyOffCheck(2, 'auto') },
    { prompt: 'Set BLK. Dissolve to BLK.', check: () => backgroundTransitionCheck(idx('BLK'), 'auto') },
  ],
};


  function getBusStateForSurface(surfaceName) {
    if (surfaceName === state.surfaceMode) {
      return {
        pgmIndex: state.pgmIndex,
        pvwIndex: state.pvwIndex,
        dskState: state.dskState,
        previewKeyState: state.previewKeyState,
        tieBackground: state.tieBackground,
        lastBackgroundAction: state.lastBackgroundAction,
        lastDskActions: state.lastDskActions,
      };
    }
    return getSurfaceSnapshot(surfaceName);
  }

  function dskMatchesOnBus(bus, index, options = {}) {
    if (!bus || !bus.dskState || !bus.dskState[index]) return false;
    const dsk = bus.dskState[index];
    if (options.sourceIndex !== undefined && dsk.sourceIndex !== options.sourceIndex) return false;
    if (!keyModeMatches(dsk, options.keyMode)) return false;
    if (options.dveEnabled !== undefined && dsk.dveEnabled !== options.dveEnabled) return false;
    if (options.chrColor !== undefined && dsk.chrColor !== options.chrColor) return false;
    if (options.active !== undefined && dsk.active !== options.active) return false;
    if (options.preview !== undefined && (!!bus.previewKeyState && bus.previewKeyState[index]) !== options.preview) return false;
    if (options.dveZone && !dveZoneMatches(dsk, options.dveZone)) return false;
    return true;
  }

  function lastBackgroundMethodIsOnBus(bus, method) {
    return !!(bus && bus.lastBackgroundAction && bus.lastBackgroundAction.method === method);
  }

  function backgroundTransitionCheckOnSurface(surfaceName, sourceIndex, method) {
    const bus = getBusStateForSurface(surfaceName);
    return !!bus && bus.pgmIndex === sourceIndex && lastBackgroundMethodIsOnBus(bus, method);
  }

  function previewSourceCheckOnSurface(surfaceName, sourceName) {
    const bus = getBusStateForSurface(surfaceName);
    return !!bus && bus.pvwIndex === idx(sourceName);
  }

  function keyPreparedCheckOnSurface(surfaceName, dskIndex, options = {}) {
    const bus = getBusStateForSurface(surfaceName);
    return dskMatchesOnBus(bus, dskIndex, { active: false, preview: false, ...options });
  }

  function keyPreviewCheckOnSurface(surfaceName, dskIndex, options = {}) {
    const bus = getBusStateForSurface(surfaceName);
    return dskMatchesOnBus(bus, dskIndex, { preview: true, ...options });
  }

  function keyTakeWithBackgroundCheckOnSurface(surfaceName, sourceIndex, method, dskIndex, extra = {}) {
    const bus = getBusStateForSurface(surfaceName);
    return !!bus && bus.pgmIndex === sourceIndex && lastBackgroundMethodIsOnBus(bus, method)
      && dskMatchesOnBus(bus, dskIndex, { active: true, preview: true, ...extra });
  }

  function slotBusMatches(surfaceName, slotIndex, predicate) {
    const slots = state.meMemorySlots && state.meMemorySlots[surfaceName];
    const snapshot = slots ? slots[slotIndex] : null;
    return !!(snapshot && snapshot.bus && predicate(cloneBusState(snapshot.bus)));
  }

  function getDskCropHValue(dsk) {
    return clamp(parseInt(dsk.dveCropH, 10) || 0, 0, 100);
  }

  function getDskCropVValue(dsk) {
    return clamp(parseInt(dsk.dveCropV, 10) || 0, 0, 100);
  }

  function dskHasCrop(dsk) {
    return getDskCropHValue(dsk) > 0 || getDskCropVValue(dsk) > 0;
  }

  function sideBySideCompositeMatches(bus, leftSource = 'CAM 3', rightSource = 'CAM 1') {
    if (!bus || bus.pgmIndex !== idx('BLK')) return false;
    const leftMatch = bus.dskState.some((dsk) => dsk.active
      && dsk.sourceIndex === idx(leftSource)
      && dsk.dveEnabled
      && dsk.dveBorderEnabled
      && dsk.dveSize >= 92
      && dsk.dveX <= 30
      && Math.abs(dsk.dveY - 50) <= 18
      && getDskCropHValue(dsk) >= 35
      && dskHasCrop(dsk));
    const rightMatch = bus.dskState.some((dsk) => dsk.active
      && dsk.sourceIndex === idx(rightSource)
      && dsk.dveEnabled
      && dsk.dveBorderEnabled
      && dsk.dveSize >= 92
      && dsk.dveX >= 70
      && Math.abs(dsk.dveY - 50) <= 18
      && getDskCropHValue(dsk) >= 35
      && dskHasCrop(dsk));
    return leftMatch && rightMatch;
  }

  function classifyQuadDsk(dsk) {
    if (!dsk || !dsk.active || !dsk.dveEnabled || !dsk.dveBorderEnabled) return null;
    if (dsk.dveSize < 40 || dsk.dveSize > 68) return null;
    const left = dsk.dveX <= 42;
    const right = dsk.dveX >= 58;
    const top = dsk.dveY <= 42;
    const bottom = dsk.dveY >= 58;
    if (left && top) return 'top-left';
    if (right && top) return 'top-right';
    if (left && bottom) return 'bottom-left';
    if (right && bottom) return 'bottom-right';
    return null;
  }

  function quadCompositeMatches(bus) {
    if (!bus || bus.pgmIndex !== idx('BLK')) return false;
    const requiredSources = new Set(['CAM 1', 'CAM 2', 'CAM 3', 'CPU']);
    const seenSources = new Set();
    const seenQuadrants = new Set();
    let hasCropH = false;
    let hasCropV = false;

    bus.dskState.forEach((dsk) => {
      const sourceName = getSourceName(dsk.sourceIndex);
      if (!requiredSources.has(sourceName)) return;
      const quadrant = classifyQuadDsk(dsk);
      if (!quadrant || seenSources.has(sourceName) || seenQuadrants.has(quadrant)) return;
      seenSources.add(sourceName);
      seenQuadrants.add(quadrant);
      if (getDskCropHValue(dsk) > 0) hasCropH = true;
      if (getDskCropVValue(dsk) > 0) hasCropV = true;
    });

    return seenSources.size === 4 && seenQuadrants.size === 4 && hasCropH && hasCropV;
  }

  function me1CompositeMatches(kind) {
    const bus = getBusStateForSurface('ME1');
    return kind === 'quad' ? quadCompositeMatches(bus) : sideBySideCompositeMatches(bus);
  }

  function me1SlotMatches(slotIndex, kind) {
    return slotBusMatches('ME1', slotIndex, (bus) => (kind === 'quad' ? quadCompositeMatches(bus) : sideBySideCompositeMatches(bus)));
  }

  function getTransitionVerb(method) {
    return method === 'auto' ? 'Dissolve' : 'Take';
  }

  function getPreviewVerb(method) {
    return method === 'auto' ? 'Set' : 'Ready';
  }

  function getZonePrompt(zone) {
    const map = {
      'bottom-right': 'Size it down and move it bottom right',
      'bottom-left': 'Size it down and move it bottom left',
      'top-right': 'Size it down and move it top right',
      'top-left': 'Size it down and move it top left',
      center: 'Size it down and keep it centered',
      right: 'Move it right',
      left: 'Move it left',
      'left-large': 'Scale it up and move it left',
      'right-large': 'Scale it up and move it right',
    };
    return map[zone] || 'Adjust the DVE';
  }

  function buildAdvancedTakeQuestion(kind, method) {
    const prompt = `${kind === 'quad' ? 'On ME 1, take BLK. Build a quad of CAM 1, CAM 2, CAM 3, and CPU with DVE, crop, and borders.' : 'On ME 1, take BLK. Build a CAM 3 | CAM 1 side-by-side with DVE, crop, and borders.'} Switch back to ME P/P. ${getPreviewVerb(method)} ME1. ${getTransitionVerb(method)} ME1.`;
    return {
      prompt,
      check: () => state.surfaceMode === 'ME_PP'
        && me1CompositeMatches(kind)
        && backgroundTransitionCheck(idx('ME1'), method),
    };
  }

  function buildAdvancedKeyQuestion(kind, dskIndex, zone, backgroundSource, method) {
    const prompt = `${kind === 'quad' ? 'On ME 1, take BLK. Build a quad of CAM 1, CAM 2, CAM 3, and CPU with DVE, crop, and borders.' : 'On ME 1, take BLK. Build a CAM 3 | CAM 1 side-by-side with DVE, crop, and borders.'} Switch back to ME P/P. Set Key ${dskIndex + 1} with ME1. DVE Key ${dskIndex + 1} on. ${getZonePrompt(zone)}. Preview Key ${dskIndex + 1}. ${getPreviewVerb(method)} ${backgroundSource}. ${getTransitionVerb(method)} ${backgroundSource} with Key ${dskIndex + 1}.`;
    return {
      prompt,
      check: () => state.surfaceMode === 'ME_PP'
        && me1CompositeMatches(kind)
        && keyTakeWithBackgroundCheck(idx(backgroundSource), method, dskIndex, {
          sourceIndex: idx('ME1'),
          keyMode: 'DVE_FULL',
          dveEnabled: true,
          dveZone: zone,
        }),
    };
  }

  function buildAdvancedBankQuestions() {
    const questions = [
      buildAdvancedTakeQuestion('side', 'cut'),
      buildAdvancedTakeQuestion('side', 'auto'),
      buildAdvancedTakeQuestion('quad', 'cut'),
      buildAdvancedTakeQuestion('quad', 'auto'),
    ];

    const configs = [
      ['side', 0, 'bottom-right', 'CAM 2', 'cut'],
      ['side', 0, 'bottom-right', 'CAM 1', 'auto'],
      ['side', 1, 'top-right', 'CPU', 'cut'],
      ['side', 1, 'top-left', 'CAM 3', 'auto'],
      ['side', 2, 'right', 'CAM 1', 'cut'],
      ['side', 2, 'left-large', 'CPU', 'auto'],
      ['side', 3, 'bottom-left', 'CAM 2', 'cut'],
      ['side', 3, 'center', 'CAM 3', 'auto'],
      ['quad', 0, 'bottom-right', 'CAM 2', 'cut'],
      ['quad', 0, 'top-right', 'CAM 1', 'auto'],
      ['quad', 1, 'bottom-left', 'CPU', 'cut'],
      ['quad', 1, 'right', 'CAM 3', 'auto'],
      ['quad', 2, 'top-left', 'CAM 1', 'cut'],
      ['quad', 2, 'left-large', 'CPU', 'auto'],
      ['quad', 3, 'center', 'CAM 2', 'cut'],
      ['quad', 3, 'bottom-right', 'CAM 3', 'auto'],
    ];

    configs.forEach((config) => questions.push(buildAdvancedKeyQuestion(...config)));
    return questions;
  }

  function buildExpertTakeQuestion(recallSlot, kind, method) {
    const prompt = `On ME 1, take BLK. Build a CAM 3 | CAM 1 side-by-side with DVE, crop, and borders. Store it to ME 1 Macro 1. Stay on ME 1, clear it and build a quad of CAM 1, CAM 2, CAM 3, and CPU with DVE, crop, and borders. Store it to ME 1 Macro 2. Recall ME 1 Macro ${recallSlot + 1}. Switch to ME P/P. ${getPreviewVerb(method)} ME1. ${getTransitionVerb(method)} ME1.`;
    return {
      prompt,
      check: () => state.surfaceMode === 'ME_PP'
        && me1SlotMatches(0, 'side')
        && me1SlotMatches(1, 'quad')
        && me1CompositeMatches(kind)
        && backgroundTransitionCheck(idx('ME1'), method),
    };
  }

  function buildExpertKeyQuestion(recallSlot, kind, dskIndex, zone, backgroundSource, method) {
    const prompt = `On ME 1, take BLK. Build a CAM 3 | CAM 1 side-by-side with DVE, crop, and borders. Store it to ME 1 Macro 1. Stay on ME 1, clear it and build a quad of CAM 1, CAM 2, CAM 3, and CPU with DVE, crop, and borders. Store it to ME 1 Macro 2. Recall ME 1 Macro ${recallSlot + 1}. Switch to ME P/P. Set Key ${dskIndex + 1} with ME1. DVE Key ${dskIndex + 1} on. ${getZonePrompt(zone)}. Preview Key ${dskIndex + 1}. ${getPreviewVerb(method)} ${backgroundSource}. ${getTransitionVerb(method)} ${backgroundSource} with Key ${dskIndex + 1}.`;
    return {
      prompt,
      check: () => state.surfaceMode === 'ME_PP'
        && me1SlotMatches(0, 'side')
        && me1SlotMatches(1, 'quad')
        && me1CompositeMatches(kind)
        && keyTakeWithBackgroundCheck(idx(backgroundSource), method, dskIndex, {
          sourceIndex: idx('ME1'),
          keyMode: 'DVE_FULL',
          dveEnabled: true,
          dveZone: zone,
        }),
    };
  }

  function buildExpertBankQuestions() {
    const questions = [
      buildExpertTakeQuestion(0, 'side', 'cut'),
      buildExpertTakeQuestion(0, 'side', 'auto'),
      buildExpertTakeQuestion(1, 'quad', 'cut'),
      buildExpertTakeQuestion(1, 'quad', 'auto'),
    ];

    const configs = [
      [0, 'side', 0, 'bottom-right', 'CAM 2', 'cut'],
      [0, 'side', 1, 'top-right', 'CAM 1', 'auto'],
      [0, 'side', 2, 'left-large', 'CPU', 'cut'],
      [0, 'side', 3, 'center', 'CAM 3', 'auto'],
      [1, 'quad', 0, 'bottom-left', 'CAM 1', 'cut'],
      [1, 'quad', 1, 'right', 'CPU', 'auto'],
      [1, 'quad', 2, 'top-left', 'CAM 2', 'cut'],
      [1, 'quad', 3, 'bottom-right', 'CAM 3', 'auto'],
      [0, 'side', 0, 'top-left', 'CAM 3', 'auto'],
      [1, 'quad', 1, 'bottom-right', 'CAM 2', 'cut'],
      [0, 'side', 2, 'right', 'CAM 1', 'auto'],
      [1, 'quad', 3, 'center', 'CPU', 'cut'],
    ];

    configs.forEach((config) => questions.push(buildExpertKeyQuestion(...config)));
    return questions;
  }

  function buildAdvancedRunTheShow() {
    return [
      { prompt: 'Switch to ME 1.', check: () => state.surfaceMode === 'ME1' },
      { prompt: 'Take BLK on ME 1.', check: () => state.surfaceMode === 'ME1' && backgroundTransitionCheck(idx('BLK'), 'cut') },
      { prompt: 'Build a CAM 3 | CAM 1 side-by-side with DVE, crop, and borders on ME 1.', check: () => state.surfaceMode === 'ME1' && me1CompositeMatches('side') },
      { prompt: 'Switch to ME P/P.', check: () => state.surfaceMode === 'ME_PP' },
      { prompt: 'Ready ME1. Take ME1.', check: () => state.surfaceMode === 'ME_PP' && backgroundTransitionCheck(idx('ME1'), 'cut') },
      { prompt: 'Ready CAM 2. Take CAM 2.', check: () => backgroundTransitionCheck(idx('CAM 2'), 'cut') },
      { prompt: 'Set Key 1 with ME1.', check: () => keyPreparedCheck(0, { sourceIndex: idx('ME1') }) },
      { prompt: 'DVE Key 1 on. Size it down and move it bottom right.', check: () => keyPreparedCheck(0, { sourceIndex: idx('ME1'), dveEnabled: true, dveZone: 'bottom-right' }) },
      { prompt: 'Preview Key 1.', check: () => keyPreviewCheck(0, { sourceIndex: idx('ME1'), dveEnabled: true, dveZone: 'bottom-right' }) },
      { prompt: 'Set CAM 1. Dissolve to CAM 1 with Key 1.', check: () => keyTakeWithBackgroundCheck(idx('CAM 1'), 'auto', 0, { sourceIndex: idx('ME1'), keyMode: 'DVE_FULL', dveEnabled: true, dveZone: 'bottom-right' }) },
      { prompt: 'Auto Key 1 off.', check: () => keyOffCheck(0, 'auto') },
      { prompt: 'Switch to ME 1.', check: () => state.surfaceMode === 'ME1' },
      { prompt: 'Take BLK on ME 1.', check: () => state.surfaceMode === 'ME1' && backgroundTransitionCheck(idx('BLK'), 'cut') },
      { prompt: 'Build a quad of CAM 1, CAM 2, CAM 3, and CPU with DVE, crop, and borders on ME 1.', check: () => state.surfaceMode === 'ME1' && me1CompositeMatches('quad') },
      { prompt: 'Switch to ME P/P.', check: () => state.surfaceMode === 'ME_PP' },
      { prompt: 'Set ME1. Dissolve to ME1.', check: () => backgroundTransitionCheck(idx('ME1'), 'auto') },
      { prompt: 'Set BLK. Dissolve to BLK.', check: () => backgroundTransitionCheck(idx('BLK'), 'auto') },
    ];
  }

  function buildExpertRunTheShow() {
    return [
      { prompt: 'Switch to ME 1.', check: () => state.surfaceMode === 'ME1' },
      { prompt: 'Take BLK on ME 1.', check: () => state.surfaceMode === 'ME1' && backgroundTransitionCheck(idx('BLK'), 'cut') },
      { prompt: 'Build a CAM 3 | CAM 1 side-by-side with DVE, crop, and borders on ME 1.', check: () => state.surfaceMode === 'ME1' && me1CompositeMatches('side') },
      { prompt: 'Store that side-by-side to ME 1 Macro 1.', check: () => me1SlotMatches(0, 'side') },
      { prompt: 'Take BLK on ME 1 again.', check: () => state.surfaceMode === 'ME1' && backgroundTransitionCheck(idx('BLK'), 'cut') },
      { prompt: 'Build a quad of CAM 1, CAM 2, CAM 3, and CPU with DVE, crop, and borders on ME 1.', check: () => state.surfaceMode === 'ME1' && me1CompositeMatches('quad') },
      { prompt: 'Store that quad to ME 1 Macro 2.', check: () => me1SlotMatches(1, 'quad') },
      { prompt: 'Recall ME 1 Macro 1.', check: () => state.surfaceMode === 'ME1' && me1CompositeMatches('side') && me1SlotMatches(0, 'side') && me1SlotMatches(1, 'quad') },
      { prompt: 'Switch to ME P/P.', check: () => state.surfaceMode === 'ME_PP' },
      { prompt: 'Ready ME1. Take ME1.', check: () => backgroundTransitionCheck(idx('ME1'), 'cut') && me1CompositeMatches('side') },
      { prompt: 'Ready CAM 2. Take CAM 2.', check: () => backgroundTransitionCheck(idx('CAM 2'), 'cut') },
      { prompt: 'Set Key 1 with ME1. DVE Key 1 on. Size it down and move it bottom right.', check: () => keyPreparedCheck(0, { sourceIndex: idx('ME1'), dveEnabled: true, dveZone: 'bottom-right' }) },
      { prompt: 'Preview Key 1.', check: () => keyPreviewCheck(0, { sourceIndex: idx('ME1'), dveEnabled: true, dveZone: 'bottom-right' }) },
      { prompt: 'Set CAM 1. Dissolve to CAM 1 with Key 1.', check: () => keyTakeWithBackgroundCheck(idx('CAM 1'), 'auto', 0, { sourceIndex: idx('ME1'), keyMode: 'DVE_FULL', dveEnabled: true, dveZone: 'bottom-right' }) },
      { prompt: 'Auto Key 1 off.', check: () => keyOffCheck(0, 'auto') },
      { prompt: 'Switch to ME 1 and recall ME 1 Macro 2.', check: () => state.surfaceMode === 'ME1' && me1CompositeMatches('quad') && me1SlotMatches(1, 'quad') },
      { prompt: 'Switch back to ME P/P.', check: () => state.surfaceMode === 'ME_PP' },
      { prompt: 'Set ME1. Dissolve to ME1.', check: () => backgroundTransitionCheck(idx('ME1'), 'auto') && me1CompositeMatches('quad') },
    ];
  }

  LEVEL_LABELS['bank-3'] = 'Level 3 — Advanced';
  LEVEL_LABELS['bank-4'] = 'Level 4 — Expert';
  LEVEL_LABELS['rts-3'] = 'Run the Show — Advanced';
  LEVEL_LABELS['rts-4'] = 'Run the Show — Expert';
  QUIZ_BANK['bank-3'] = buildAdvancedBankQuestions();
  QUIZ_BANK['bank-4'] = buildExpertBankQuestions();
  RUN_THE_SHOW['rts-3'] = buildAdvancedRunTheShow();
  RUN_THE_SHOW['rts-4'] = buildExpertRunTheShow();


  function resolveRunTheShowStep() {
    const question = state.quizQuestions[state.quizCurrent];
    if (!question) return;

    const level = LEVEL_LABELS[state.quizLevel] || state.quizLevel;
    const result = state.rtsStepMissed ? 'INCORRECT' : 'CORRECT';
    if (!state.rtsStepMissed) state.quizScore += 1;
    else state.quizAllCorrect = false;

    state.quizResults.push({ prompt: question.prompt, category: level, result });
    state.rtsStepMissed = false;
    state.quizCurrent += 1;

    if (state.quizCurrent >= state.quizQuestions.length) {
      endQuiz();
      return;
    }

    showQuestion();
  }

  function maybeResolveRunTheShow(markAttempt = false) {
    if (!isRunTheShow() || state.quizCurrent >= state.quizQuestions.length) return;

    const question = state.quizQuestions[state.quizCurrent];
    if (!question) return;

    if (question.check()) {
      resolveRunTheShowStep();
      return;
    }

    if (markAttempt) {
      state.rtsStepMissed = true;
      state.quizAllCorrect = false;
      dom.quizScoreDisplay.textContent = 'NEEDS REVIEW';
    }
  }

  function isRunTheShow() {
    return state.quizType === 'rts';
  }

  function setMode(mode) {
    if (mode === 'quiz' && lessonState.active) {
      showConfirm(
        'LEAVE LESSON?',
        'You\'re in an active lesson. Leaving now will lose your progress.',
        'LEAVE LESSON',
        () => { _teardownLesson(); setMode('quiz'); }
      );
      return;
    }
    if (mode === 'freeplay' && lessonState.active) {
      showConfirm(
        'LEAVE LESSON?',
        'You\'re in an active lesson. Leaving now will lose your progress.',
        'LEAVE LESSON',
        () => { _teardownLesson(); setMode('freeplay'); }
      );
      return;
    }
    state.quizMode = mode === 'quiz';

    dom.modeFreeplayButton.className = `mode-btn${!state.quizMode ? ' mode-active' : ''}`;
    dom.modeQuizButton.className = `mode-btn${state.quizMode ? ' mode-active' : ''}`;
    setPressed(dom.modeFreeplayButton, !state.quizMode);
    setPressed(dom.modeQuizButton, state.quizMode);

    if (state.quizMode) {
      dismissHotkeySplash();
      showWhen(dom.freeplayResetButton, false);
      dom.quizBar.classList.add('quiz-visible');
      resetSwitcherState();
      dom.quizNameOverlay.classList.add('show');
      updateUtilityMenuActions();
      scheduleLayout();
      if (!isFullscreenActive()) setTimeout(() => dom.quizNameInput.focus(), 50);
      return;
    }

    showWhen(dom.freeplayResetButton, true);
    dom.quizBar.classList.remove('quiz-visible');
    dom.quizNameOverlay.classList.remove('show');
    dom.quizLevelOverlay.classList.remove('show');
    dom.quizResultsOverlay.classList.remove('show');
    stopQuizTimer();
    resetQuiz();
    updateUtilityMenuActions();
    scheduleLayout();
    setTimeout(() => dom.modeFreeplayButton.focus(), 50);
  }

  function submitQuizName() {
    const name = dom.quizNameInput.value.trim();
    const className = dom.quizClassInput.value.trim();
    const practiceQuiz = !!(dom.quizPracticeToggle && dom.quizPracticeToggle.getAttribute('aria-pressed') === 'true');

    const missingName = !name;
    const missingClass = !className;

    dom.quizNameInput.classList.toggle('input-error', !practiceQuiz && missingName);
    dom.quizClassInput.classList.toggle('input-error', !practiceQuiz && missingClass);

    if (!practiceQuiz && (missingName || missingClass)) {
      if (missingName) dom.quizNameInput.focus();
      else dom.quizClassInput.focus();
      return;
    }

    state.quizName = practiceQuiz ? (name || 'Quick Practice') : name;
    state.quizClass = practiceQuiz ? className : className;
    state.practiceQuiz = practiceQuiz;
    dom.quizNameOverlay.classList.remove('show');
    dom.quizLevelOverlay.classList.add('show');
    setTimeout(() => dom.quizLevelDialog.focus(), 50);
  }

  function backToNameEntry() {
    dom.quizLevelOverlay.classList.remove('show');
    dom.quizNameOverlay.classList.add('show');
    if (!isFullscreenActive()) setTimeout(() => dom.quizNameInput.focus(), 50);
  }

  function selectQuizLevel(level) {
    state.quizLevel = level;
    state.quizType = level.startsWith('rts') ? 'rts' : 'bank';
    dom.quizLevelOverlay.classList.remove('show');

    const label = LEVEL_LABELS[level] || level;
    dom.quizPrompt.textContent = `${label} — Press START`;
    dom.quizPrompt.style.color = '#f5a623';
    setQuizButtonVisibility({ start: true, check: false, skip: false });
  }

  function promptLoadsBank(prompt, bankName) {
    return new RegExp(String.raw`Load\s+[^.]+\s+to\s+${bankName}\b`, 'i').test(prompt);
  }

  function addDefaultMediaLoadInstructions(prompt) {
    if (typeof prompt !== 'string' || !prompt.trim()) return prompt;
    const prefix = [];
    if (/\bM1\b/.test(prompt) && !promptLoadsBank(prompt, 'M1')) prefix.push('Load Host to M1.');
    if (/\bM2\b/.test(prompt) && !promptLoadsBank(prompt, 'M2')) prefix.push('Load Guest to M2.');
    return prefix.length ? `${prefix.join(' ')} ${prompt}` : prompt;
  }

  function getQuizPromptText(question) {
    if (!question) return '';
    const basePrompt = question.prompt || '';
    if ((question.skipCount || 0) === 1) return `${basePrompt} — skipped once. It will return at the end. Skip it again for no credit.`;
    return basePrompt;
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function buildQuizQuestions() {
    if (isRunTheShow()) {
      return RUN_THE_SHOW[state.quizLevel].map((q) => ({ ...q, prompt: addDefaultMediaLoadInstructions(q.prompt), skipCount: 0 }));
    }

    const pool = QUIZ_BANK[state.quizLevel].map((q) => ({ ...q, prompt: addDefaultMediaLoadInstructions(q.prompt), skipCount: 0 }));
    shuffleArray(pool);
    return pool.slice(0, 10);
  }

  function startQuiz() {
    resetSwitcherState();
    state.quizQuestions = buildQuizQuestions();
    state.quizCurrent = 0;
    state.quizScore = 0;
    state.quizResults = [];
    state.quizAllCorrect = true;
    state.rtsStepMissed = false;
    state.quizStartTime = Date.now();

    const showSkip = true;
    setQuizButtonVisibility({ start: false, check: !isRunTheShow(), skip: showSkip });
    startQuizTimer();
    showQuestion();
  }

  function showQuestion() {
    if (state.quizCurrent >= state.quizQuestions.length) {
      endQuiz();
      return;
    }

    const total = state.quizQuestions.length;
    const question = state.quizQuestions[state.quizCurrent];
    dom.quizQuestionNum.textContent = `${state.quizCurrent + 1}/${total}`;

    if (isRunTheShow()) {
      dom.quizScoreDisplay.textContent = state.rtsStepMissed || !state.quizAllCorrect ? 'NEEDS REVIEW' : 'ON TRACK';
    } else {
      dom.quizScoreDisplay.textContent = `Score: ${state.quizScore}`;
    }

    dom.quizPrompt.textContent = getQuizPromptText(question);
    dom.quizPrompt.style.color = '#f5a623';
  }

  function checkAnswer() {
    if (state.quizCurrent >= state.quizQuestions.length || isRunTheShow()) return;

    const question = state.quizQuestions[state.quizCurrent];
    const correct = question.check();
    const level = LEVEL_LABELS[state.quizLevel] || state.quizLevel;

    if (correct) {
      state.quizScore += 1;
      state.quizResults.push({ prompt: question.prompt, category: level, result: 'CORRECT' });
      dom.panel.classList.add('quiz-correct');
      dom.quizPrompt.textContent = '✓ CORRECT!';
      dom.quizPrompt.style.color = '#00cc00';
    } else {
      state.quizAllCorrect = false;
      state.quizResults.push({ prompt: question.prompt, category: level, result: 'INCORRECT' });
      dom.panel.classList.add('quiz-wrong');
      dom.quizPrompt.textContent = '✗ INCORRECT';
      dom.quizPrompt.style.color = '#ff4444';
    }

    dom.quizScoreDisplay.textContent = `Score: ${state.quizScore}`;

    setTimeout(() => {
      dom.panel.classList.remove('quiz-correct', 'quiz-wrong');
      state.quizCurrent += 1;
      resetSwitcherState();
      showQuestion();
    }, 1200);
  }

  function skipQuestion() {
    if (state.quizCurrent >= state.quizQuestions.length) return;

    const question = state.quizQuestions[state.quizCurrent];
    const level = LEVEL_LABELS[state.quizLevel] || state.quizLevel;
    question.skipCount = (question.skipCount || 0) + 1;

    if (question.skipCount === 1) {
      state.quizQuestions.splice(state.quizCurrent, 1);
      state.quizQuestions.push(question);
      dom.panel.classList.add('quiz-skip');
      dom.quizPrompt.textContent = '↺ SKIPPED — RETURNING AT THE END';
      dom.quizPrompt.style.color = '#ffd343';

      setTimeout(() => {
        dom.panel.classList.remove('quiz-skip');
        if (!isRunTheShow()) resetSwitcherState();
        showQuestion();
      }, 900);
      return;
    }

    state.quizAllCorrect = false;
    if (isRunTheShow()) state.rtsStepMissed = true;
    state.quizResults.push({ prompt: question.prompt, category: level, result: 'SKIPPED TWICE — NO CREDIT' });
    dom.panel.classList.add('quiz-wrong');
    dom.quizPrompt.textContent = '✗ SKIPPED TWICE — NO CREDIT';
    dom.quizPrompt.style.color = '#ff5d57';

    setTimeout(() => {
      dom.panel.classList.remove('quiz-wrong');
      state.quizCurrent += 1;
      if (!isRunTheShow()) resetSwitcherState();
      showQuestion();
    }, 1000);
  }

  function startQuizTimer() {
    stopQuizTimer();
    state.quizTimerInterval = setInterval(() => {
      dom.quizTimer.textContent = formatElapsed(getElapsedQuizSeconds());
    }, 1000);
  }

  function stopQuizTimer() {
    if (!state.quizTimerInterval) return;
    clearInterval(state.quizTimerInterval);
    state.quizTimerInterval = null;
  }

  function emailResults() {
    const summary = getQuizSummary();
    const total = state.quizQuestions.length;
    const level = LEVEL_LABELS[state.quizLevel] || state.quizLevel;
    const scoreText = isRunTheShow()
      ? (runTheShowPassed(total) ? 'PASS' : 'NEEDS REVIEW') + ` (${state.quizScore}/${total})`
      : `${state.quizScore}/${total}`;

    const formData = {
      _subject: `SwitchUp Studio — ${state.practiceQuiz ? 'Practice ' : ''}${level} — ${state.quizName}${state.quizClass ? ` — ${state.quizClass}` : ''} — ${scoreText}`,
      student_name: state.quizName,
      class_name: state.quizClass || 'Not provided',
      quiz_level: level,
      score: scoreText,
      time: summary.timeString,
      date: new Date().toLocaleString(),
      confirmation_code: summary.code,
      breakdown: summary.breakdownText,
    };

    fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.ok) console.log('Quiz results sent successfully via Formspree');
        else console.error('Formspree submission failed:', response.status);
      })
      .catch((error) => {
        console.error('Formspree error:', error);
      });
  }

  function endQuiz() {
    stopQuizTimer();
    const summary = getQuizSummary();
    const total = state.quizQuestions.length;
    const level = LEVEL_LABELS[state.quizLevel] || state.quizLevel;

    setQuizButtonVisibility({ start: false, check: false, skip: false });

    if (isRunTheShow()) {
      const passed = runTheShowPassed(total);
      dom.quizPrompt.textContent = passed ? '✓ PASS — Show Complete!' : '• NEEDS REVIEW — Show Complete';
      dom.quizPrompt.style.color = passed ? '#00cc00' : '#f5a623';
      dom.quizResultsScore.textContent = passed ? `PASS (${state.quizScore}/${total})` : `NEEDS REVIEW (${state.quizScore}/${total})`;
    } else {
      dom.quizPrompt.textContent = `${state.practiceQuiz ? 'Practice Quiz Complete!' : 'Quiz Complete!'} ${state.quizScore}/${total}`;
      dom.quizResultsScore.textContent = `${state.quizScore} / ${total}`;
    }

    dom.quizResultsName.textContent = `${state.practiceQuiz ? 'PRACTICE — ' : ''}${state.quizName}${state.quizClass ? ` — ${state.quizClass}` : ''} — ${level}`;
    dom.quizResultsTime.textContent = `Time: ${summary.timeString}`;
    dom.quizResultsCode.innerHTML = `Confirmation Code: <strong>${summary.code}</strong>`;
    dom.quizResultsBreakdown.innerHTML = summary.breakdownMarkup;

    if (!state.practiceQuiz) emailResults();
    dom.quizResultsOverlay.classList.add('show');
    setTimeout(() => dom.quizResultsDialog.focus(), 50);
  }

  function isTextEntryTarget(target) {
    return !!(target && (target.closest('input, textarea, [contenteditable="true"]') || target.isContentEditable));
  }

  function isBlockingModalOpen() {
    return dom.welcomeOverlay.classList.contains('welcome-show')
      || dom.quizNameOverlay.classList.contains('show')
      || dom.quizLevelOverlay.classList.contains('show')
      || dom.quizResultsOverlay.classList.contains('show')
      || (dom.mediaModalOverlay && dom.mediaModalOverlay.classList.contains('show'));
  }

  function handleKeyboardShortcuts(event) {
    const key = event.key.toLowerCase();
    if ((event.metaKey || event.ctrlKey) && !event.altKey && key === 'z') {
      if (isTextEntryTarget(event.target) || isBlockingModalOpen()) return;
      event.preventDefault();
      undoLastAction();
      return;
    }
    if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey) return;
    if (key === 'escape' && state.dveMoreWindowOpen) {
      event.preventDefault();
      closeDVEMoreWindow();
      return;
    }
    if (key === 'escape' && dom.mediaModalOverlay && dom.mediaModalOverlay.classList.contains('show')) {
      event.preventDefault();
      closeMediaModal();
      return;
    }

    if (key === 'escape' && dom.hotkeySplash && dom.hotkeySplash.classList.contains('show')) {
      event.preventDefault();
      dismissHotkeySplash();
      return;
    }

    if (key === 'b' && dom.mediaModalOverlay && dom.mediaModalOverlay.classList.contains('show')) {
      event.preventDefault();
      toggleMediaModal();
      return;
    }

    if (isTextEntryTarget(event.target) || isBlockingModalOpen()) return;

    if (event.shiftKey && /^[1-4]$/.test(event.key)) {
      event.preventDefault();
      runMacroSlot(Number(event.key) - 1);
      return;
    }

    if (Object.prototype.hasOwnProperty.call(PREVIEW_SOURCE_KEY_MAP, event.key)) {
      event.preventDefault();
      selectPvw(PREVIEW_SOURCE_KEY_MAP[event.key]);
      return;
    }

    if (currentDsk().dveEnabled) {
      if (key === 'arrowup') {
        event.preventDefault();
        nudgeDVE('up');
        return;
      }

      if (key === 'arrowdown') {
        event.preventDefault();
        nudgeDVE('down');
        return;
      }

      if (key === 'arrowleft') {
        event.preventDefault();
        nudgeDVE('left');
        return;
      }

      if (key === 'arrowright') {
        event.preventDefault();
        nudgeDVE('right');
        return;
      }

      if (key === '-' || key === '_' || event.code === 'NumpadSubtract') {
        event.preventDefault();
        adjustDVESize(-NUDGE_STEP);
        return;
      }

      if (key === '=' || key === '+' || event.code === 'NumpadAdd') {
        event.preventDefault();
        adjustDVESize(NUDGE_STEP);
        return;
      }
    }

    if (key === ',' || key === '<' || key === 'c') {
      event.preventDefault();
      doCut();
      return;
    }

    if (key === '.' || key === '>' || key === 'v') {
      event.preventDefault();
      doDissolve();
      return;
    }

    if (key === 'd') {
      event.preventDefault();
      triggerDVEHotkey();
      return;
    }

    if (key === 'm') {
      event.preventDefault();
      switchSurface(state.surfaceMode === 'ME_PP' ? 'ME1' : 'ME_PP');
      return;
    }

    if (key === 'b') {
      event.preventDefault();
      toggleMediaModal();
      return;
    }

    if (key === 'h') {
      event.preventDefault();
      toggleShortcutHintState();
      return;
    }
  }

// --- v6.1.2 FIXES ---
function trapFocusInContainer(event, container) {
  if (!container || event.key !== 'Tab') return;
  const focusable = Array.from(
    container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
  ).filter((el) => !el.disabled && el.offsetParent !== null);

  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement;

  if (event.shiftKey) {
    if (active === first || !container.contains(active)) {
      event.preventDefault();
      last.focus();
    }
    return;
  }

  if (active === last) {
    event.preventDefault();
    first.focus();
  }
}

function getActiveFocusTrapContainer() {
  if (dom.mediaModalOverlay && dom.mediaModalOverlay.classList.contains('show')) return dom.mediaModalDialog || dom.mediaModalOverlay;
  if (dom.quizResultsOverlay && dom.quizResultsOverlay.classList.contains('show')) return dom.quizResultsDialog || dom.quizResultsOverlay;
  if (dom.quizLevelOverlay && dom.quizLevelOverlay.classList.contains('show')) return dom.quizLevelDialog || dom.quizLevelOverlay;
  if (dom.quizNameOverlay && dom.quizNameOverlay.classList.contains('show')) return dom.quizNameDialog || dom.quizNameOverlay;
  if (dom.welcomeOverlay && dom.welcomeOverlay.classList.contains('welcome-show')) return dom.welcomeDialog || dom.welcomeOverlay;
  return null;
}
// --- END v6.1.2 FIXES ---



function bindQuizDialogFocusLoop() {
  const dialog = dom.quizNameDialog || dom.quizNameOverlay;
  const nameInput = dom.quizNameInput;
  const classInput = dom.quizClassInput;
  const continueBtn = document.getElementById('quiz-name-btn');
  const backBtn = document.getElementById('quiz-name-back-btn');

  if (!dialog || !nameInput || !classInput || !continueBtn || !backBtn) return;

  const focusOrder = [nameInput, classInput, continueBtn, backBtn];

  const moveQuizDialogFocus = (event) => {
    if (event.key !== 'Tab') return;
    event.preventDefault();
    event.stopPropagation();

    const currentIndex = Math.max(0, focusOrder.indexOf(document.activeElement));
    const nextIndex = event.shiftKey
      ? (currentIndex <= 0 ? focusOrder.length - 1 : currentIndex - 1)
      : (currentIndex >= focusOrder.length - 1 ? 0 : currentIndex + 1);

    focusOrder[nextIndex].focus();
  };

  focusOrder.forEach((el) => {
    el.addEventListener('keydown', moveQuizDialogFocus, true);
  });

  nameInput.addEventListener('keydown', (event) => {
    event.stopPropagation();
    if (event.key === 'Enter') {
      event.preventDefault();
      classInput.focus();
    }
  }, true);

  classInput.addEventListener('keydown', (event) => {
    event.stopPropagation();
    if (event.key === 'Enter') {
      event.preventDefault();
      submitQuizName();
    }
  }, true);

  continueBtn.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      submitQuizName();
    }
  }, true);

  backBtn.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setMode('freeplay');
    }
  }, true);
}

  function bindEvents() {
    if (dom.menuButton) {
      dom.menuButton.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleHotkeySplash();
      });
    }

    if (dom.hotkeySplashCloseButton) {
      dom.hotkeySplashCloseButton.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        dismissHotkeySplash();
      });
    }

    [
      [dom.menuFullscreenAction, 'fullscreen'],
      [dom.menuLessonsAction, 'lessons'],
      [dom.menuModeAction, 'mode'],
      [dom.menuSurfaceAction, 'surface'],
      [dom.menuMediaAction, 'media'],
      [dom.menuHotkeysAction, 'hotkeys'],
      [dom.menuUndoDveAction, 'undo-dve'],
      [dom.menuResetDveAction, 'reset-dve'],
      [dom.menuResetAction, 'reset'],
      [dom.menuBannersAction, 'banners'],
    ].forEach(([button, action]) => {
      if (!button) return;
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        handleUtilityMenuAction(action);
      });
    });

    dom.macroSaveButtons.forEach((button, index) => {
      if (!button) return;
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        saveMacroSlot(index);
      });
    });

    dom.macroRunButtons.forEach((button, index) => {
      if (!button) return;
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        runMacroSlot(index);
      });
    });

    dom.macroRenameButtons.forEach((button, index) => {
      if (!button) return;
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        renameMacroSlot(index);
      });
    });

    dom.macroClearButtons.forEach((button, index) => {
      if (!button) return;
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        clearMacroSlot(index);
      });
    });

    Object.entries(dom.meMemoryStoreButtons).forEach(([surfaceName, button]) => {
      if (!button) return;
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        armMEMemory(surfaceName, 'store');
      });
    });

    Object.entries(dom.meMemoryRecallButtons).forEach(([surfaceName, button]) => {
      if (!button) return;
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        armMEMemory(surfaceName, 'recall');
      });
    });

    Object.entries(dom.meMemorySlotButtons).forEach(([surfaceName, buttons]) => {
      buttons.forEach((button, index) => {
        if (!button) return;
        button.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          handleMEMemorySlot(surfaceName, index);
        });
      });
    });

    dom.macroQuickRunButtons.forEach((button, index) => {
      if (!button) return;
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        runMacroSlot(index);
      });
    });

    document.addEventListener('fullscreenchange', updateFullscreenButton);
    document.addEventListener('webkitfullscreenchange', updateFullscreenButton);
    document.addEventListener('keydown', handleKeyboardShortcuts);
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && dom.hotkeySplash && dom.hotkeySplash.classList.contains('show')) {
        dismissHotkeySplash();
      }
    });
    document.addEventListener('keydown', (event) => {
      const activeTrap = getActiveFocusTrapContainer();
      if (!activeTrap) return;
      trapFocusInContainer(event, activeTrap);
    }, true);

    document.addEventListener('focusin', (event) => {
      const activeTrap = getActiveFocusTrapContainer();
      if (!activeTrap) return;
      if (activeTrap.contains(event.target)) return;
      const focusable = Array.from(
        activeTrap.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
      ).filter((el) => !el.disabled && el.offsetParent !== null);
      if (focusable.length) {
        focusable[0].focus();
      } else if (typeof activeTrap.focus === 'function') {
        activeTrap.focus();
      }
    }, true);
    bindQuizDialogFocusLoop();
    window.addEventListener('resize', scheduleLayout);
    window.addEventListener('focus', updateUtilityMenuActions);
    window.addEventListener('orientationchange', () => scheduleLayout());
    window.addEventListener('load', () => {
      applyLayout();
      dom.welcomeOverlay.classList.add('welcome-show');
      setTimeout(() => dom.welcomeDialog.focus(), 100);
    });

    document.addEventListener('click', (event) => {
      if (!dom.utilityMenu || !dom.hotkeySplash.classList.contains('show')) return;
      if (dom.utilityMenu.contains(event.target)) return;
      dismissHotkeySplash();
    });

    dom.quizNameInput.addEventListener('input', () => {
      dom.quizNameInput.classList.remove('input-error');
    });


    dom.quizClassInput.addEventListener('input', () => {
      dom.quizClassInput.classList.remove('input-error');
    });

    if (dom.quizPracticeToggle) {
      dom.quizPracticeToggle.addEventListener('click', () => {
        const nextPressed = dom.quizPracticeToggle.getAttribute('aria-pressed') !== 'true';
        setPracticeQuizToggle(nextPressed);
        dom.quizNameInput.classList.remove('input-error');
        dom.quizClassInput.classList.remove('input-error');
      });
    }


    // ── DVE editor shell wiring ─────────────────────────────────

    // Slot click opens editor
    if (dom.dveSlot) {
      dom.dveSlot.addEventListener('click', () => { if (state.activeDveEnabled) openDVEEditor(); });
      dom.dveSlot.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (state.activeDveEnabled) openDVEEditor(); } });
    }

    // Close button
    if (dom.dveEdClose) {
      dom.dveEdClose.addEventListener('click', closeDVEEditor);
    }

    // Tab switching
    document.querySelectorAll('.dve-ed-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.dve-ed-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.dve-ed-panel').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const panel = document.getElementById(`dve-panel-${tab.dataset.tab}`);
        if (panel) panel.classList.add('active');
      });
    });

    // Click-to-type value inputs for DVE
    function makeDveValueEditable(elId, min, max, onSet) {
      const el = document.getElementById(elId);
      if (!el) return;
      el.style.cursor = 'text';
      el.title = 'Click to type a value';
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        if (el.querySelector('input')) return;
        const cur = parseInt(el.textContent, 10) || 0;
        const inp = document.createElement('input');
        inp.type = 'number';
        inp.min = min;
        inp.max = max;
        inp.value = cur;
        inp.className = 'dve-inline-input';
        el.innerHTML = '';
        el.appendChild(inp);
        inp.focus();
        inp.select();
        const commit = () => {
          const v = clamp(parseInt(inp.value, 10) || cur, min, max);
          onSet(v);
        };
        inp.addEventListener('blur', commit);
        inp.addEventListener('keydown', (ke) => {
          ke.stopPropagation();
          if (ke.key === 'Enter') { commit(); inp.blur(); }
          if (ke.key === 'Escape') { onSet(cur); inp.blur(); }
        });
      });
    }

    makeDveValueEditable('dve-ed-scale-val', 1, 100, setDVESize);
    makeDveValueEditable('dve-crop-h-val', 0, 100, setDVECropH);
    makeDveValueEditable('dve-crop-v-val', 0, 100, setDVECropV);

    // Pos X / Y type-in via pos readout
    const posReadout = document.getElementById('dve-pos-readout');
    if (posReadout) {
      posReadout.style.cursor = 'text';
      posReadout.title = 'Click to type X Y values';
      posReadout.addEventListener('click', (e) => {
        e.stopPropagation();
        if (posReadout.querySelector('input')) return;
        const dsk = currentDsk();
        posReadout.innerHTML = '';
        const mkInp = (lbl, val, onSet) => {
          const wrap = document.createElement('span');
          wrap.style.cssText = 'display:inline-flex;align-items:center;gap:2px;';
          const l = document.createElement('span');
          l.className = 'cl';
          l.textContent = lbl;
          const inp = document.createElement('input');
          inp.type = 'number';
          inp.min = 0;
          inp.max = 100;
          inp.value = val;
          inp.className = 'dve-inline-input dve-inline-input-pos';
          inp.addEventListener('keydown', (ke) => {
            ke.stopPropagation();
            if (ke.key === 'Enter') { onSet(clamp(parseInt(inp.value, 10) || val, 0, 100)); }
            if (ke.key === 'Escape') { updateDVEEditorCoords(); }
          });
          inp.addEventListener('blur', () => { onSet(clamp(parseInt(inp.value, 10) || val, 0, 100)); });
          wrap.appendChild(l);
          wrap.appendChild(inp);
          return wrap;
        };
        posReadout.appendChild(mkInp('X', dsk.dveX, v => { currentDsk().dveX = v; updateDVECoordLabel(); updateDSKOverlays(); }));
        posReadout.appendChild(document.createTextNode('\u00a0'));
        posReadout.appendChild(mkInp('Y', dsk.dveY, v => { currentDsk().dveY = v; updateDVECoordLabel(); updateDSKOverlays(); }));
      });
    }

    // Custom drag sliders
    function setupDveSlider(sliderName, onValue) {
      const wrap = document.querySelector(`[data-dve-slider="${sliderName}"]`);
      if (!wrap) return;
      let dragging = false;
      function update(e) {
        const rect = wrap.getBoundingClientRect();
        const clientX = e.clientX ?? e.touches?.[0]?.clientX;
        if (clientX === undefined) return;
        const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
        dveSetTrack(sliderName, pct);
        onValue(pct);
      }
      wrap.addEventListener('mousedown', e => { dragging = true; update(e); e.preventDefault(); });
      window.addEventListener('mousemove', e => { if (dragging) update(e); });
      window.addEventListener('mouseup', () => { dragging = false; });
      wrap.addEventListener('touchstart', e => { dragging = true; update(e); }, { passive: true });
      window.addEventListener('touchmove', e => { if (dragging) update(e); }, { passive: true });
      window.addEventListener('touchend', () => { dragging = false; });
    }

    // Scale: pct 0-100 maps directly to dveSize 1-100
    setupDveSlider('scale', pct => {
      const size = Math.max(1, Math.round(pct));
      const scaleEl = document.getElementById('dve-ed-scale-val');
      if (scaleEl) scaleEl.innerHTML = `${size}<span class="u">%</span>`;
      if (currentDsk().dveSize !== size) { currentDsk().dveSize = size; updateDVESlot(); updateDSKOverlays(); }
    });

    function snapCropToStop(raw) {
      const stops = [0, 25, 50, 75, 100];
      const SNAP = 5;
      for (const s of stops) { if (Math.abs(raw - s) <= SNAP) return s; }
      return Math.round(raw);
    }

    // Crop H: pct 0-100 maps directly, snaps to stops
    setupDveSlider('crop-h', pct => {
      const v = snapCropToStop(pct);
      const el = document.getElementById('dve-crop-h-val');
      if (el) el.innerHTML = `${v}<span class="u">%</span>`;
      if ((currentDsk().dveCropH || 0) !== v) { currentDsk().dveCropH = v; updateDSKOverlays(); }
    });

    // Crop V
    setupDveSlider('crop-v', pct => {
      const v = snapCropToStop(pct);
      const el = document.getElementById('dve-crop-v-val');
      if (el) el.innerHTML = `${v}<span class="u">%</span>`;
      if ((currentDsk().dveCropV || 0) !== v) { currentDsk().dveCropV = v; updateDSKOverlays(); }
    });

    // Border width: pct maps to 1-16px
    setupDveSlider('bdr-w', pct => {
      const w = Math.round(1 + (pct / 100) * 15);
      if (dom.dveBorderWidthLabel) dom.dveBorderWidthLabel.innerHTML = `${w}<span class="u">px</span>`;
      if (currentDsk().dveBorderWidth !== w) { currentDsk().dveBorderWidth = w; updateDSKOverlays(); }
    });

    // Border toggle
    if (dom.dveBorderToggle) {
      dom.dveBorderToggle.addEventListener('change', (e) => setDVEBorderEnabled(e.target.checked));
    }

    // Border swatches (new .dve-sw-color elements)
    document.querySelectorAll('#dve-border-swatches .dve-sw-color').forEach(sw => {
      sw.addEventListener('click', () => setDVEBorderColor(sw.dataset.color));
    });

    // Escape key closes editor
    // (handled in existing keydown listener — openDVEMoreWindow/close mapped below)

    if (dom.mediaModalOverlay) {
      dom.mediaModalOverlay.addEventListener('click', (event) => {
        if (event.target === dom.mediaModalOverlay) closeMediaModal();
      });
    }
  }

  function init() {
    preloadImageAssets();
    loadMacroSlots();
    buildDynamicRows();
    refreshAllUI();
    resetQuiz();
    showWhen(dom.freeplayResetButton, true);
    setShortcutHintState(state.shortcutHintsVisible);
    applyLayout();
    updateUtilityMenuActions();
    updateMacroUI();
    bindEvents();
  }

  // ============================================================
  //  LESSON ENGINE — SwitchUp Studio
  // ============================================================

  const LESSON_STEPS = {
    1: [

      // ── WATCH — Interface overview ──────────────────────────────

      {
        id: 'welcome',
        watchOnly: true,
        instruction: 'Welcome to Lesson 1. You\'ll learn the switcher layout, how to ready sources, cut and dissolve between cameras, use hotkeys to work faster, and take the show to black.',
        highlight: [],
        delay: 5500,
      },
      {
        id: 'multiviewer',
        watchOnly: true,
        instruction: 'At the top is the MULTIVIEWER. PREVIEW (green border) is what\'s ready next. PROGRAM (red border) is what\'s live on air right now. Nothing goes to air until you take action.',
        highlight: ['multiviewer'],
        delay: 5500,
      },
      {
        id: 'thumbnails',
        watchOnly: true,
        instruction: 'Below the multiviewer are source thumbnails — CAM 1, CAM 2, CAM 3, CPU, GFX, M1, M2, ME1, BLK, and BARS. These give you a visual reference of every source available to the switcher.',
        highlight: ['mv-grid'],
        delay: 5000,
      },

      // ── WATCH — PVW and PGM live demo ──────────────────────────

      {
        id: 'pvw-explained',
        watchOnly: true,
        instruction: 'The PREVIEW row (PVW) is where you select your next shot. Watch — CAM 1 is being readied in Preview. The green highlight shows what\'s on deck.',
        highlight: ['pvw-row'],
        delay: 5000,
        demo: () => { selectPvw(0); },
      },
      {
        id: 'pgm-explained',
        watchOnly: true,
        instruction: 'The PROGRAM row (PGM) shows what is live right now — highlighted in red. Watch — CAM 1 cuts from Preview to Program. The switcher is live.',
        highlight: ['pgm-row'],
        delay: 5000,
        demo: () => { doCut(); },
      },

      // ── WATCH — CUT live demo ───────────────────────────────────

      {
        id: 'cut-explained',
        watchOnly: true,
        instruction: 'CUT is an instant switch — no blend, just a hard take. Watch: CAM 2 is readied in Preview, then CUT takes it live immediately.',
        highlight: ['btn-cut'],
        delay: 6000,
        demo: () => {
          selectPvw(1);
          setTimeout(() => { doCut(); }, 1800);
        },
      },

      // ── WATCH — AUTO live demo ──────────────────────────────────

      {
        id: 'auto-explained',
        watchOnly: true,
        instruction: 'AUTO performs a smooth dissolve between sources. Watch: CAM 3 is readied in Preview, then AUTO blends it onto Program. Use this for elegant transitions.',
        highlight: ['btn-auto'],
        delay: 6500,
        demo: () => {
          selectPvw(2);
          setTimeout(() => { doDissolve(); }, 1800);
        },
      },

      // ── WATCH — Hotkeys ─────────────────────────────────────────

      {
        id: 'hotkeys-intro',
        watchOnly: true,
        instruction: 'Pro operators use keyboard hotkeys to work without reaching for the mouse. SwitchUp Studio has shortcuts for every major action — learn them and your speed doubles.',
        highlight: [],
        delay: 5000,
      },
      {
        id: 'hotkey-cut-auto',
        watchOnly: true,
        instruction: 'The two most important hotkeys: press  <  (left angle bracket) to CUT instantly. Press  >  (right angle bracket) to AUTO dissolve. These are your bread-and-butter moves.',
        highlight: ['btn-cut', 'btn-auto'],
        delay: 6000,
      },
      {
        id: 'hotkey-surface',
        watchOnly: true,
        instruction: 'Press  M  to switch between the ME P/P bus and ME 1 bus. The Surface panel shows which mix bus you\'re controlling at any time.',
        highlight: ['surface-mepp', 'surface-me1'],
        delay: 5500,
      },
      {
        id: 'hotkey-dve-media',
        watchOnly: true,
        instruction: 'Press  D  to toggle the DVE (picture-in-picture). Press  B  to open the Media Bank for loading graphics. Use  ⌘Z  to undo your last action.',
        highlight: ['dve-toggle', 'media-bank-btn'],
        delay: 5500,
      },

      // ── WATCH — Going to black live demo ────────────────────────

      {
        id: 'black-intro',
        watchOnly: true,
        instruction: 'Every show starts and ends on BLACK. Select BLK in the Preview row before fading up at the top of the show — or when wrapping. Watch — BLK is being readied in Preview.',
        highlight: ['pvw-btn-8'],
        delay: 5500,
        demo: () => { selectPvw(8); },
      },
      {
        id: 'black-dissolve',
        watchOnly: true,
        instruction: 'Watch — dissolving to BLACK fades the show clean. This is your show-ender. AUTO or the > hotkey does the job. Drive mode is next — your turn to take the wheel.',
        highlight: ['btn-auto'],
        delay: 6000,
        demo: () => { setTimeout(() => { doDissolve(); }, 1200); },
      },

      // ── DRIVE — Student operates the switcher ───────────────────

      {
        id: 'drive-intro-cam1-pvw',
        instruction: 'DRIVE MODE — you\'re in control. Start by readying CAM 1 on Preview. Select CAM 1 in the PVW row.',
        highlight: ['pvw-btn-0'],
        check: () => state.pvwIndex === 0,
        hint: 'Look at the PREVIEW row and tap CAM 1.',
      },
      {
        id: 'drive-cut-cam1',
        instruction: 'CAM 1 is on Preview. Take it live with a CUT. Press the CUT button — or use the  <  hotkey on your keyboard.',
        highlight: ['btn-cut'],
        check: () => state.pgmIndex === 0,
        hint: 'Press the CUT button, or hit the < key on your keyboard.',
      },
      {
        id: 'drive-cam2-pvw',
        instruction: 'Good cut! Now ready CAM 2 on Preview for your next shot.',
        highlight: ['pvw-btn-1'],
        check: () => state.pvwIndex === 1,
        hint: 'Select CAM 2 in the Preview row.',
      },
      {
        id: 'drive-dissolve-cam2',
        instruction: 'CAM 2 is on Preview. Dissolve to it smoothly using AUTO — or press the  >  hotkey.',
        highlight: ['btn-auto'],
        check: () => state.pgmIndex === 1,
        hint: 'Press AUTO, or hit the > key on your keyboard.',
      },
      {
        id: 'drive-cam3-pvw',
        instruction: 'Nice dissolve. Now ready CAM 3 on Preview.',
        highlight: ['pvw-btn-2'],
        check: () => state.pvwIndex === 2,
        hint: 'Select CAM 3 in the Preview row.',
      },
      {
        id: 'drive-cut-cam3',
        instruction: 'CUT to CAM 3. Hard take — no dissolve. CUT button or  <  key.',
        highlight: ['btn-cut'],
        check: () => state.pgmIndex === 2,
        hint: 'Press CUT, or hit the < key.',
      },
      {
        id: 'drive-blk-pvw',
        instruction: 'Time to wrap the segment. Ready BLACK on Preview — select BLK in the PVW row.',
        highlight: ['pvw-btn-8'],
        check: () => state.pvwIndex === 8,
        hint: 'Select BLK in the Preview row.',
      },
      {
        id: 'drive-dissolve-blk',
        instruction: 'Fade to black. Use AUTO — or the  >  hotkey — to dissolve the show to black.',
        highlight: ['btn-auto'],
        check: () => state.pgmIndex === 8,
        hint: 'Press AUTO or hit > to fade to black.',
      },
      {
        id: 'complete',
        watchOnly: true,
        instruction: '🎉 Lesson 1 complete! You know the layout, CUT and AUTO transitions, the key hotkeys, and how to fade to black. You\'re ready to run a show.',
        highlight: [],
        delay: 0,
      },
    ],

    // ──────────────────────────────────────────────────────────
    //  LESSON 2 — Keying & Graphics
    // ──────────────────────────────────────────────────────────
    2: [
      // ── WATCH: Orientation ──
      {
        id: 'l2-intro',
        watchOnly: true,
        instruction: 'Lesson 2 covers keying and graphics. You\'ll load media, set a key type, preview it on the transition, and bring it on air — with and without the background.',
        highlight: [],
        delay: 4500,
      },
      {
        id: 'l2-media-explained',
        watchOnly: true,
        instruction: 'MEDIA SEL opens the media resource panel. This is where you load a graphic into M1 or M2 before keying it.',
        highlight: ['media-bank-btn'],
        delay: 4000,
      },
      {
        id: 'l2-key-type-explained',
        watchOnly: true,
        instruction: 'The Type of Key row lets you choose SELF, LUMA, or CHR. The right key type depends on how the graphic was made.',
        highlight: ['key-type-row'],
        delay: 4000,
      },
      {
        id: 'l2-key-source-explained',
        watchOnly: true,
        instruction: 'The Key Source row is where you select which source feeds into DSK 1. You\'ll typically assign M1 or M2 here.',
        highlight: ['dsk-source-row'],
        delay: 4000,
      },
      {
        id: 'l2-tie-explained',
        watchOnly: true,
        instruction: 'Pressing KEY 1 in the Preview/Tie row arms the key to transition with the background. It will ride along when you cut or dissolve.',
        highlight: ['tie-key-1'],
        delay: 4000,
      },
      {
        id: 'l2-dsk-cut-explained',
        watchOnly: true,
        instruction: 'DSK CUT drops the key on or off instantly — independent of the background. DSK AUTO dissolves it on or off smoothly.',
        highlight: ['dsk-cut-1', 'dsk-auto-1'],
        delay: 4000,
      },
      // ── DRIVE: Self key with a tied transition ──
      {
        id: 'l2-take-cam1',
        instruction: 'First, take CAM 1 to Program. Ready it on Preview, then CUT.',
        highlight: ['pvw-btn-0'],
        check: () => state.pgmIndex === 0,
        hint: 'Select CAM 1 in Preview, then press CUT.',
      },
      {
        id: 'l2-open-media',
        instruction: 'Open Media Resources using the MEDIA SEL button.',
        highlight: ['media-bank-btn'],
        check: () => {
          const el = document.getElementById('media-modal-overlay');
          return el && (el.classList.contains('show') || el.style.display === 'flex' || (el.style.display !== 'none' && el.style.display !== ''));
        },
        hint: 'Press the MEDIA SEL button.',
      },
      {
        id: 'l2-close-media',
        watchOnly: true,
        instruction: 'Good. The Side Graphic should already be loaded in M1. Close the media panel when you\'re ready.',
        highlight: ['media-modal-close'],
        delay: 0,
      },
      {
        id: 'l2-select-dsk1',
        instruction: 'Select DSK channel 1 using the SEL 1 button.',
        highlight: ['dsk-sel-1'],
        check: () => state.activeDSK === 0,
        hint: 'Press SEL 1 in the DSK section.',
      },
      {
        id: 'l2-set-key-source-m1',
        instruction: 'Set the Key Source to M1.',
        highlight: ['dsk-src-btn-5'],
        check: () => state.dskState[0].sourceIndex === SOURCES.indexOf('M1'),
        hint: 'Find M1 in the Key Source row and tap it.',
      },
      {
        id: 'l2-set-self-key',
        instruction: 'Set the key type to SELF.',
        highlight: ['key-type-0'],
        check: () => state.dskState[0].keyMode === 0,
        hint: 'Press SELF in the Type of Key row.',
      },
      {
        id: 'l2-preview-key',
        instruction: 'Arm KEY 1 in the Preview/Tie row so it will ride with the next transition.',
        highlight: ['tie-key-1'],
        check: () => state.previewKeyState[0] === true,
        hint: 'Press KEY 1 in the Preview / Tie row.',
      },
      {
        id: 'l2-ready-cam1-again',
        instruction: 'Now ready CAM 1 on Preview (it\'s already on Program — this sets up the dissolve with the key).',
        highlight: ['pvw-btn-0'],
        check: () => state.pvwIndex === 0,
        hint: 'Select CAM 1 in the Preview row.',
      },
      {
        id: 'l2-dissolve-cam1-with-key',
        instruction: 'Dissolve to CAM 1 with Key 1 using AUTO. The graphic rides onto air with the background.',
        highlight: ['btn-auto'],
        check: () => state.pgmIndex === 0 && state.dskState[0].active === true && state.previewKeyState[0] === true,
        hint: 'Press AUTO. Both the background and Key 1 will come on together.',
      },
      // ── DRIVE: Lose the tie, switch background under the key ──
      {
        id: 'l2-lose-tie',
        instruction: 'Now lose the KEY 1 tie by pressing KEY 1 in the Preview/Tie row again. The key stays live but will no longer ride with the next transition.',
        highlight: ['tie-key-1'],
        check: () => state.dskState[0].active === true && state.previewKeyState[0] === false,
        hint: 'Press KEY 1 in the Preview/Tie row to toggle the tie off.',
      },
      {
        id: 'l2-ready-cam2',
        instruction: 'Ready CAM 2 on Preview.',
        highlight: ['pvw-btn-1'],
        check: () => state.pvwIndex === 1,
        hint: 'Select CAM 2 in the Preview row.',
      },
      {
        id: 'l2-cut-cam2-under-key',
        instruction: 'CUT to CAM 2. The background switches but the key stays on — that\'s "under the key."',
        highlight: ['btn-cut'],
        check: () => state.pgmIndex === 1 && state.dskState[0].active === true,
        hint: 'Press CUT. The background changes but Key 1 remains on air.',
      },
      // ── DRIVE: Cut key off, then auto off ──
      {
        id: 'l2-cut-key-off',
        instruction: 'Take Key 1 off using DSK CUT 1.',
        highlight: ['dsk-cut-1'],
        check: () => state.dskState[0].active === false,
        hint: 'Press CUT in the DSK 1 row to take the key off.',
      },
      {
        id: 'l2-dsk-auto-intro',
        watchOnly: true,
        instruction: 'Good. Now let\'s practice dissolving a key on and off using DSK AUTO.',
        highlight: ['dsk-auto-1'],
        delay: 3500,
      },
      {
        id: 'l2-auto-key-on',
        instruction: 'Dissolve Key 1 back on using DSK AUTO 1.',
        highlight: ['dsk-auto-1'],
        check: () => state.dskState[0].active === true,
        hint: 'Press AUTO in the DSK 1 row.',
      },
      {
        id: 'l2-auto-key-off',
        instruction: 'Now dissolve Key 1 off using DSK AUTO 1.',
        highlight: ['dsk-auto-1'],
        check: () => state.dskState[0].active === false,
        hint: 'Press AUTO in the DSK 1 row again to dissolve the key off.',
      },
      // ── DRIVE: Chroma key ──
      {
        id: 'l2-chroma-intro',
        watchOnly: true,
        instruction: 'Now let\'s try a chroma key. Open MEDIA SEL and load Live Bug into M1.',
        highlight: ['media-bank-btn'],
        delay: 0,
      },
      {
        id: 'l2-chroma-open-media',
        instruction: 'Open Media Resources.',
        highlight: ['media-bank-btn'],
        check: () => {
          const el = document.getElementById('media-modal-overlay');
          return el && (el.classList.contains('show') || el.style.display === 'flex' || (el.style.display !== 'none' && el.style.display !== ''));
        },
        hint: 'Press MEDIA SEL.',
      },
      {
        id: 'l2-chroma-close-media',
        watchOnly: true,
        instruction: 'Load Live Bug to M1, then close the panel.',
        highlight: ['media-modal-close'],
        delay: 0,
      },
      {
        id: 'l2-set-chr-key',
        instruction: 'Set the key type to CHR (chroma key).',
        highlight: ['key-type-2'],
        check: () => state.dskState[0].keyMode === 2,
        hint: 'Press CHR in the Type of Key row.',
      },
      {
        id: 'l2-set-chr-blue',
        instruction: 'Set the chroma color to BLUE (Live Bug uses a blue screen).',
        highlight: ['chr-blue-btn'],
        check: () => state.dskState[0].chrColor === 'blue',
        hint: 'Press BLUE in the CHR Color selector.',
      },
      {
        id: 'l2-preview-chr-key',
        instruction: 'Arm KEY 1 in the Preview/Tie row.',
        highlight: ['tie-key-1'],
        check: () => state.previewKeyState[0] === true,
        hint: 'Press KEY 1 in the Preview/Tie row.',
      },
      {
        id: 'l2-ready-cpu',
        instruction: 'Ready CPU on Preview.',
        highlight: ['pvw-btn-3'],
        check: () => state.pvwIndex === 3,
        hint: 'Select CPU in the Preview row.',
      },
      {
        id: 'l2-dissolve-cpu-with-bug',
        instruction: 'Dissolve to CPU with the Live Bug chroma key riding on.',
        highlight: ['btn-auto'],
        check: () => state.pgmIndex === 3 && state.dskState[0].active === true && state.previewKeyState[0] === true,
        hint: 'Press AUTO.',
      },
      {
        id: 'l2-complete',
        watchOnly: true,
        instruction: '🎉 Lesson 2 complete! You can now load media, set key types, tie keys to transitions, switch under a live key, and remove keys cleanly. Ready for Lesson 3?',
        highlight: [],
        delay: 0,
      },
    ],

    // ──────────────────────────────────────────────────────────
    //  LESSON 3 — M/Es & DSK Ties
    // ──────────────────────────────────────────────────────────
    3: [
      // ── WATCH: Orientation ──
      {
        id: 'l3-intro',
        watchOnly: true,
        instruction: 'Lesson 3 is about Mix/Effects and DVE keys. You\'ll build composites on ME 1 and use them as a key source on ME P/P.',
        highlight: [],
        delay: 4500,
      },
      {
        id: 'l3-surface-explained',
        watchOnly: true,
        instruction: 'The Surface selector switches you between ME P/P (main output) and ME 1 (a separate bus you use to build composites). The ME P/P row stays in the switcher output at all times.',
        highlight: ['surface-toggle-panel'],
        delay: 4500,
      },
      {
        id: 'l3-me1-explained',
        watchOnly: true,
        instruction: 'When you switch to ME 1, you\'re now controlling that separate bus. Anything you build here can be recalled as a source called "ME1" on ME P/P.',
        highlight: ['surface-me1'],
        delay: 4000,
      },
      {
        id: 'l3-dve-toggle-explained',
        watchOnly: true,
        instruction: 'The DVE button enables a Picture-in-Picture effect on a key. Once on, tap the DVE slot to open the editor and reposition or resize the source.',
        highlight: ['dve-toggle'],
        delay: 4000,
      },
      {
        id: 'l3-key2-key3-explained',
        watchOnly: true,
        instruction: 'You can run up to 4 keys at once using SEL 1–4. In Quiz Level 3 you\'ll often be working with Key 2 and Key 3 — not just Key 1.',
        highlight: ['dsk-sel-2', 'dsk-sel-3'],
        delay: 4000,
      },
      // ── DRIVE: DVE key on a single channel ──
      {
        id: 'l3-take-cam1',
        instruction: 'Take CAM 1 to Program.',
        highlight: ['pvw-btn-0'],
        check: () => state.pgmIndex === 0,
        hint: 'Ready CAM 1 on Preview then CUT.',
      },
      {
        id: 'l3-select-dsk1',
        instruction: 'Select DSK 1.',
        highlight: ['dsk-sel-1'],
        check: () => state.activeDSK === 0,
        hint: 'Press SEL 1.',
      },
      {
        id: 'l3-set-cpu-source',
        instruction: 'Set the Key Source to CPU.',
        highlight: ['dsk-src-btn-3'],
        check: () => state.dskState[0].sourceIndex === SOURCES.indexOf('CPU'),
        hint: 'Find CPU in the Key Source row.',
      },
      {
        id: 'l3-enable-dve',
        instruction: 'Enable DVE on this key using the DVE button.',
        highlight: ['dve-toggle'],
        check: () => state.dskState[0].dveEnabled === true,
        hint: 'Press DVE in the Type of Key row.',
      },
      {
        id: 'l3-open-dve-editor',
        watchOnly: true,
        instruction: 'The DVE slot will now show "tap to configure." Tap it and use the Scale slider and D-pad to size it down and move it to the bottom-right corner.',
        highlight: ['dve-slot'],
        delay: 0,
      },
      {
        id: 'l3-preview-dve-key',
        instruction: 'When positioned, arm KEY 1 in the Preview/Tie row.',
        highlight: ['tie-key-1'],
        check: () => state.previewKeyState[0] === true,
        hint: 'Press KEY 1 in the Preview/Tie row.',
      },
      {
        id: 'l3-ready-cam2',
        instruction: 'Ready CAM 2 on Preview.',
        highlight: ['pvw-btn-1'],
        check: () => state.pvwIndex === 1,
        hint: 'Select CAM 2 in the Preview row.',
      },
      {
        id: 'l3-take-cam2-with-dve',
        instruction: 'Take CAM 2 to Program with the DVE key riding on.',
        highlight: ['btn-cut'],
        check: () => state.pgmIndex === 1 && state.dskState[0].active === true && state.previewKeyState[0] === true,
        hint: 'Press CUT.',
      },
      {
        id: 'l3-lose-tie-dve',
        instruction: 'Lose the KEY 1 tie.',
        highlight: ['tie-key-1'],
        check: () => state.dskState[0].active === true && state.previewKeyState[0] === false,
        hint: 'Press KEY 1 in the Preview/Tie row to toggle the tie off.',
      },
      {
        id: 'l3-ready-cpu-bg',
        instruction: 'Ready CPU on Preview.',
        highlight: ['pvw-btn-3'],
        check: () => state.pvwIndex === 3,
        hint: 'Select CPU in the Preview row.',
      },
      {
        id: 'l3-cut-cpu-under-key',
        instruction: 'CUT to CPU under the live DVE key.',
        highlight: ['btn-cut'],
        check: () => state.pgmIndex === 3 && state.dskState[0].active === true,
        hint: 'Press CUT.',
      },
      {
        id: 'l3-auto-key-off',
        instruction: 'Auto Key 1 off using DSK AUTO 1.',
        highlight: ['dsk-auto-1'],
        check: () => state.dskState[0].active === false,
        hint: 'Press AUTO in the DSK 1 row.',
      },
      // ── DRIVE: ME 1 composite ──
      {
        id: 'l3-me1-intro',
        watchOnly: true,
        instruction: 'Now let\'s build a composite on ME 1. First, switch the surface to ME 1.',
        highlight: ['surface-me1'],
        delay: 0,
      },
      {
        id: 'l3-switch-to-me1',
        instruction: 'Switch the active surface to ME 1.',
        highlight: ['surface-me1'],
        check: () => state.surfaceMode === 'ME1',
        hint: 'Press ME 1 in the Surface selector.',
      },
      {
        id: 'l3-take-blk-me1',
        instruction: 'Take BLK on ME 1 — this gives us a clean black canvas to build on.',
        highlight: ['pvw-btn-8', 'btn-cut'],
        check: () => state.surfaceMode === 'ME1' && state.pgmIndex === 8,
        hint: 'Ready BLK on Preview then press CUT.',
      },
      {
        id: 'l3-me1-build-intro',
        watchOnly: true,
        instruction: 'Now build a side-by-side composite: two sources in DVE PIP boxes, side by side with borders and crop. Use Key 1 for one source and Key 2 for the other.',
        highlight: [],
        delay: 0,
      },
      {
        id: 'l3-switch-back-mepp',
        instruction: 'When your side-by-side composite is complete, switch back to ME P/P.',
        highlight: ['surface-mepp'],
        check: () => state.surfaceMode === 'ME_PP',
        hint: 'Press ME P/P in the Surface selector.',
      },
      {
        id: 'l3-ready-me1',
        instruction: 'Ready ME1 as a source on Preview.',
        highlight: ['pvw-btn-7'],
        check: () => state.pvwIndex === 7,
        hint: 'Find ME1 in the Preview row and select it.',
      },
      {
        id: 'l3-take-me1',
        instruction: 'CUT ME1 to Program.',
        highlight: ['btn-cut'],
        check: () => state.pgmIndex === 7,
        hint: 'Press CUT.',
      },
      {
        id: 'l3-ready-cam2-from-me1',
        instruction: 'Ready CAM 2 on Preview.',
        highlight: ['pvw-btn-1'],
        check: () => state.pvwIndex === 1,
        hint: 'Select CAM 2 in the Preview row.',
      },
      {
        id: 'l3-take-cam2-from-me1',
        instruction: 'CUT to CAM 2.',
        highlight: ['btn-cut'],
        check: () => state.pgmIndex === 1,
        hint: 'Press CUT.',
      },
      // ── DRIVE: ME1 as key source ──
      {
        id: 'l3-me1-as-key-intro',
        watchOnly: true,
        instruction: 'Great. Now we\'ll use that ME 1 composite as a DVE key source — like a picture-in-picture of the whole composite.',
        highlight: [],
        delay: 3500,
      },
      {
        id: 'l3-sel-dsk1-for-me1',
        instruction: 'Select DSK 1.',
        highlight: ['dsk-sel-1'],
        check: () => state.activeDSK === 0,
        hint: 'Press SEL 1.',
      },
      {
        id: 'l3-set-me1-source',
        instruction: 'Set the Key Source to ME1.',
        highlight: ['dsk-src-btn-7'],
        check: () => state.dskState[0].sourceIndex === SOURCES.indexOf('ME1'),
        hint: 'Find ME1 in the Key Source row.',
      },
      {
        id: 'l3-enable-dve-me1',
        instruction: 'Enable DVE for this key.',
        highlight: ['dve-toggle'],
        check: () => state.dskState[0].dveEnabled === true,
        hint: 'Press DVE in the Type of Key row.',
      },
      {
        id: 'l3-position-dve-me1',
        watchOnly: true,
        instruction: 'Open the DVE editor and size it down and move it to the bottom-right corner, then close the editor.',
        highlight: ['dve-slot'],
        delay: 0,
      },
      {
        id: 'l3-preview-me1-key',
        instruction: 'Arm KEY 1 in the Preview/Tie row.',
        highlight: ['tie-key-1'],
        check: () => state.previewKeyState[0] === true,
        hint: 'Press KEY 1 in the Preview/Tie row.',
      },
      {
        id: 'l3-ready-cam1-for-me1-key',
        instruction: 'Ready CAM 1 on Preview.',
        highlight: ['pvw-btn-0'],
        check: () => state.pvwIndex === 0,
        hint: 'Select CAM 1 in the Preview row.',
      },
      {
        id: 'l3-dissolve-cam1-me1-key',
        instruction: 'Dissolve to CAM 1 with the ME1 DVE key riding on.',
        highlight: ['btn-auto'],
        check: () => state.pgmIndex === 0 && state.dskState[0].active === true,
        hint: 'Press AUTO.',
      },
      {
        id: 'l3-auto-key1-off',
        instruction: 'Dissolve Key 1 off.',
        highlight: ['dsk-auto-1'],
        check: () => state.dskState[0].active === false,
        hint: 'Press AUTO in the DSK 1 row.',
      },
      {
        id: 'l3-complete',
        watchOnly: true,
        instruction: '🎉 Lesson 3 complete! You can now work with DVE keys, multiple DSK channels, build ME 1 composites, and use ME 1 as a key source. Ready for Lesson 4?',
        highlight: [],
        delay: 0,
      },
    ],

    // ──────────────────────────────────────────────────────────
    //  LESSON 4 — Advanced & Review
    // ──────────────────────────────────────────────────────────
    4: [
      // ── WATCH: Orientation ──
      {
        id: 'l4-intro',
        watchOnly: true,
        instruction: 'Lesson 4 is the advanced and review lesson. You\'ll build ME 1 precomps, store them to ME 1 macros, recall them, and use them as live key sources — the full expert workflow.',
        highlight: [],
        delay: 5000,
      },
      {
        id: 'l4-memory-explained',
        watchOnly: true,
        instruction: 'The Macro row at the top of the panel has STORE and RECALL for both ME P/P and ME 1. Storing a macro saves the entire bus state — sources, keys, DVE positions, everything.',
        highlight: ['me-memory-bar'],
        delay: 4500,
      },
      {
        id: 'l4-workflow-explained',
        watchOnly: true,
        instruction: 'The expert workflow is: build composite → store to ME 1 macro → clear and build a second composite → store that → then recall either one on demand during a show.',
        highlight: ['me-memory-bar'],
        delay: 5000,
      },
      // ── DRIVE: Build side-by-side, store to ME 1 Macro 1 ──
      {
        id: 'l4-switch-to-me1-build1',
        instruction: 'Switch to ME 1.',
        highlight: ['surface-me1'],
        check: () => state.surfaceMode === 'ME1',
        hint: 'Press ME 1 in the Surface selector.',
      },
      {
        id: 'l4-blk-me1-build1',
        instruction: 'Take BLK on ME 1.',
        highlight: ['btn-cut', 'pvw-btn-8'],
        check: () => state.surfaceMode === 'ME1' && state.pgmIndex === 8,
        hint: 'Ready BLK then CUT.',
      },
      {
        id: 'l4-build-side-by-side',
        watchOnly: true,
        instruction: 'Build a CAM 3 | CAM 1 side-by-side: two DVE keys, each ~95% scale, H crop ~40%, bordered, CAM 3 left and CAM 1 right. This step won\'t advance until you store it.',
        highlight: [],
        delay: 0,
      },
      {
        id: 'l4-store-macro1',
        instruction: 'Store this side-by-side to ME 1 Macro 1 — press STORE next to the ME1 memory bank, then press slot 1.',
        highlight: ['me-1-store', 'me-1-slot-1'],
        check: () => {
          const slots = state.meMemorySlots && state.meMemorySlots['ME1'];
          return !!(slots && slots[0] && slots[0].bus);
        },
        hint: 'Press STORE in the ME1 memory row, then press slot button 1.',
      },
      // ── DRIVE: Clear ME 1, build quad, store to Macro 2 ──
      {
        id: 'l4-blk-me1-build2',
        instruction: 'Take BLK on ME 1 again to clear the canvas.',
        highlight: ['pvw-btn-8', 'btn-cut'],
        check: () => state.surfaceMode === 'ME1' && state.pgmIndex === 8,
        hint: 'Ready BLK then CUT.',
      },
      {
        id: 'l4-build-quad',
        watchOnly: true,
        instruction: 'Now build a quad: four DVE keys (CAM 1, CAM 2, CAM 3, CPU), each at 50% scale, sized into the four corners with H and V crop and borders.',
        highlight: [],
        delay: 0,
      },
      {
        id: 'l4-store-macro2',
        instruction: 'Store the quad to ME 1 Macro 2.',
        highlight: ['me-1-store', 'me-1-slot-2'],
        check: () => {
          const slots = state.meMemorySlots && state.meMemorySlots['ME1'];
          return !!(slots && slots[1] && slots[1].bus);
        },
        hint: 'Press STORE in the ME1 row, then press slot 2.',
      },
      // ── DRIVE: Recall workflow ──
      {
        id: 'l4-recall-intro',
        watchOnly: true,
        instruction: 'Both composites are stored. Now practice recalling them on demand — like you would live during a show.',
        highlight: [],
        delay: 3500,
      },
      {
        id: 'l4-recall-macro1',
        instruction: 'Recall ME 1 Macro 1 to load the side-by-side back onto ME 1.',
        highlight: ['me-1-recall', 'me-1-slot-1'],
        check: () => {
          const slots = state.meMemorySlots && state.meMemorySlots['ME1'];
          if (!slots || !slots[0] || !slots[0].bus) return false;
          const snap = state.surfaceStates['ME1'];
          return snap && snap.dskState && snap.dskState.some(d => d.active && d.dveEnabled);
        },
        hint: 'Press RECALL then slot 1 in the ME1 memory row.',
      },
      // ── DRIVE: Switch to MEPP, take ME1, then use it as a key ──
      {
        id: 'l4-switch-to-mepp',
        instruction: 'Switch back to ME P/P.',
        highlight: ['surface-mepp'],
        check: () => state.surfaceMode === 'ME_PP',
        hint: 'Press ME P/P in the Surface selector.',
      },
      {
        id: 'l4-ready-me1',
        instruction: 'Ready ME1 on Preview.',
        highlight: ['pvw-btn-7'],
        check: () => state.pvwIndex === 7,
        hint: 'Select ME1 in the Preview row.',
      },
      {
        id: 'l4-cut-me1',
        instruction: 'CUT ME1 to Program.',
        highlight: ['btn-cut'],
        check: () => state.pgmIndex === 7,
        hint: 'Press CUT.',
      },
      {
        id: 'l4-ready-cam2-after-me1',
        instruction: 'Ready CAM 2 on Preview.',
        highlight: ['pvw-btn-1'],
        check: () => state.pvwIndex === 1,
        hint: 'Select CAM 2 in the Preview row.',
      },
      {
        id: 'l4-cut-cam2',
        instruction: 'CUT to CAM 2.',
        highlight: ['btn-cut'],
        check: () => state.pgmIndex === 1,
        hint: 'Press CUT.',
      },
      // ── DRIVE: ME1 as DVE key, placed bottom-right ──
      {
        id: 'l4-sel-dsk1',
        instruction: 'Select DSK 1.',
        highlight: ['dsk-sel-1'],
        check: () => state.activeDSK === 0,
        hint: 'Press SEL 1.',
      },
      {
        id: 'l4-set-me1-key-source',
        instruction: 'Set the Key Source to ME1.',
        highlight: ['dsk-src-btn-7'],
        check: () => state.dskState[0].sourceIndex === SOURCES.indexOf('ME1'),
        hint: 'Find ME1 in the Key Source row.',
      },
      {
        id: 'l4-enable-dve-key',
        instruction: 'Enable DVE for Key 1.',
        highlight: ['dve-toggle'],
        check: () => state.dskState[0].dveEnabled === true,
        hint: 'Press DVE in the Type of Key row.',
      },
      {
        id: 'l4-position-dve-bottom-right',
        watchOnly: true,
        instruction: 'Open the DVE editor, size it down, and move it to the bottom-right corner. Close when done.',
        highlight: ['dve-slot'],
        delay: 0,
      },
      {
        id: 'l4-preview-key1-me1',
        instruction: 'Arm KEY 1 in the Preview/Tie row.',
        highlight: ['tie-key-1'],
        check: () => state.previewKeyState[0] === true,
        hint: 'Press KEY 1 in the Preview/Tie row.',
      },
      {
        id: 'l4-ready-cam1-for-key',
        instruction: 'Ready CAM 1 on Preview.',
        highlight: ['pvw-btn-0'],
        check: () => state.pvwIndex === 0,
        hint: 'Select CAM 1 in the Preview row.',
      },
      {
        id: 'l4-dissolve-cam1-with-me1-key',
        instruction: 'Dissolve to CAM 1 with the ME1 DVE key.',
        highlight: ['btn-auto'],
        check: () => state.pgmIndex === 0 && state.dskState[0].active === true,
        hint: 'Press AUTO.',
      },
      {
        id: 'l4-auto-off-final',
        instruction: 'Dissolve Key 1 off.',
        highlight: ['dsk-auto-1'],
        check: () => state.dskState[0].active === false,
        hint: 'Press AUTO in the DSK 1 row.',
      },
      // ── DRIVE: Recall Macro 2 and dissolve it to air ──
      {
        id: 'l4-recall-macro2-prep',
        watchOnly: true,
        instruction: 'Final challenge: recall the quad composite from ME 1 Macro 2 and dissolve it to air.',
        highlight: [],
        delay: 3500,
      },
      {
        id: 'l4-switch-to-me1-recall2',
        instruction: 'Switch to ME 1.',
        highlight: ['surface-me1'],
        check: () => state.surfaceMode === 'ME1',
        hint: 'Press ME 1.',
      },
      {
        id: 'l4-recall-macro2',
        instruction: 'Recall ME 1 Macro 2.',
        highlight: ['me-1-recall', 'me-1-slot-2'],
        check: () => {
          const slots = state.meMemorySlots && state.meMemorySlots['ME1'];
          if (!slots || !slots[1] || !slots[1].bus) return false;
          const snap = state.surfaceStates['ME1'];
          return snap && snap.dskState && snap.dskState.filter(d => d.active && d.dveEnabled).length >= 4;
        },
        hint: 'Press RECALL then slot 2 in the ME1 row.',
      },
      {
        id: 'l4-switch-to-mepp-final',
        instruction: 'Switch back to ME P/P.',
        highlight: ['surface-mepp'],
        check: () => state.surfaceMode === 'ME_PP',
        hint: 'Press ME P/P.',
      },
      {
        id: 'l4-ready-me1-quad',
        instruction: 'Set ME1 on Preview.',
        highlight: ['pvw-btn-7'],
        check: () => state.pvwIndex === 7,
        hint: 'Select ME1 in the Preview row.',
      },
      {
        id: 'l4-dissolve-me1-quad',
        instruction: 'Dissolve ME1 to Program.',
        highlight: ['btn-auto'],
        check: () => state.pgmIndex === 7,
        hint: 'Press AUTO.',
      },
      {
        id: 'l4-ready-blk-final',
        instruction: 'Set BLK on Preview.',
        highlight: ['pvw-btn-8'],
        check: () => state.pvwIndex === 8,
        hint: 'Select BLK in the Preview row.',
      },
      {
        id: 'l4-dissolve-to-black',
        instruction: 'Dissolve to black.',
        highlight: ['btn-auto'],
        check: () => state.pgmIndex === 8,
        hint: 'Press AUTO.',
      },
      {
        id: 'l4-complete',
        watchOnly: true,
        instruction: '🎉 Lesson 4 complete! You can now build ME 1 composites, store and recall them as macros, and use them as live key sources. You\'re ready for the Expert quiz.',
        highlight: [],
        delay: 0,
      },
    ],
  };

  const lessonState = {
    active: false,
    lessonId: null,
    stepIndex: 0,
    watchMode: true,
    watchTimer: null,
    steps: [],
    overlayVisible: false,
    // Progress tracking
    watchCompleted: false,   // true once user has finished Watch
    driveStarted: false,     // true once Drive mode has been entered at least once
    nameCollected: false,    // true once name overlay was submitted/skipped (session-wide)
    lessonStartTime: null,   // Date.now() when lesson begins (Watch start)
    driveStartTime: null,    // Date.now() when Drive begins (for per-step timing)
    submitResults: false,    // true if student filled in name (wants to submit)
    studentName: '',
    studentClass: '',
    stepLog: [],             // [{ id, attempts, timeMs }] per drive step
    _driveStepStart: null,   // timestamp of current drive step start
    _driveMistakes: {},      // { stepId: count }
    _advancing: false,       // true while waiting for the 600ms advance delay
  };

  function getLessonSteps(id) {
    return LESSON_STEPS[id] || [];
  }

  function currentLessonStep() {
    return lessonState.steps[lessonState.stepIndex] || null;
  }

  function lessonHighlightElements(ids) {
    document.querySelectorAll('.lesson-highlight').forEach((el) => {
      el.classList.remove('lesson-highlight');
    });
    if (!ids || !ids.length) return;
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.classList.add('lesson-highlight');
      if (id === 'pvw-row' || id === 'pgm-row') {
        const row = document.getElementById(id);
        if (row) row.classList.add('lesson-highlight-row');
      }
    });
  }

  function lessonClearHighlights() {
    document.querySelectorAll('.lesson-highlight, .lesson-highlight-row').forEach((el) => {
      el.classList.remove('lesson-highlight', 'lesson-highlight-row');
    });
  }

  function lessonWiggle(el) {
    if (!el) return;
    el.classList.remove('lesson-wiggle');
    void el.offsetWidth;
    el.classList.add('lesson-wiggle');
    el.addEventListener('animationend', () => el.classList.remove('lesson-wiggle'), { once: true });
  }

  function updateLessonBar() {
    const step = currentLessonStep();
    const bar = document.getElementById('lesson-bar');
    const instruction = document.getElementById('lesson-instruction');
    const progress = document.getElementById('lesson-progress');
    const nextBtn = document.getElementById('lesson-next-btn');
    const hintBtn = document.getElementById('lesson-hint-btn');
    const watchBtn = document.getElementById('lesson-watch-btn');
    const driveBtn = document.getElementById('lesson-drive-btn');

    if (!bar || !step) return;

    const total = lessonState.steps.length;
    const current = lessonState.stepIndex + 1;
    const isComplete = step.id === 'complete';

    instruction.textContent = step.instruction;
    progress.textContent = `STEP ${current} OF ${total}`;

    // Bar colour classes
    bar.classList.toggle('lesson-drive-mode', !lessonState.watchMode);
    bar.classList.toggle('lesson-complete-step', isComplete);

    // Submode toggle state
    if (watchBtn) {
      watchBtn.classList.toggle('lesson-submode-active', lessonState.watchMode);
      watchBtn.setAttribute('aria-pressed', String(lessonState.watchMode));
    }
    if (driveBtn) {
      driveBtn.classList.toggle('lesson-submode-active', !lessonState.watchMode);
      driveBtn.setAttribute('aria-pressed', String(!lessonState.watchMode));
    }

    // Drive button: dim/lock it until Watch is complete
    if (driveBtn) {
      driveBtn.disabled = !lessonState.watchCompleted;
      driveBtn.style.opacity = lessonState.watchCompleted ? '' : '0.35';
      driveBtn.title = lessonState.watchCompleted ? '' : 'Complete Watch mode first';
    }

    // Action buttons
    if (isComplete) {
      nextBtn.textContent = '🎉 FINISH';
      nextBtn.style.display = 'inline-flex';
      hintBtn.style.display = 'none';
    } else if (lessonState.watchMode && step.watchOnly) {
      nextBtn.textContent = 'NEXT ›';
      nextBtn.style.display = 'inline-flex';
      hintBtn.style.display = 'none';
    } else if (!lessonState.watchMode && !step.watchOnly) {
      nextBtn.style.display = 'none';
      hintBtn.style.display = step.hint ? 'inline-flex' : 'none';
    } else {
      nextBtn.textContent = 'NEXT ›';
      nextBtn.style.display = 'inline-flex';
      hintBtn.style.display = 'none';
    }

    lessonHighlightElements(step.highlight || []);
  }

  function clearLessonTimer() {
    if (lessonState.watchTimer) {
      clearTimeout(lessonState.watchTimer);
      lessonState.watchTimer = null;
    }
  }

  function scheduleWatchAutoAdvance() {
    clearLessonTimer();
    const step = currentLessonStep();
    if (!step || !lessonState.watchMode || !step.watchOnly) return;

    // Fire the demo action after a short pause so the instruction is read first.
    // No auto-advance — user controls pace with NEXT.
    if (typeof step.demo === 'function') {
      lessonState.watchTimer = setTimeout(() => {
        if (lessonState.active && lessonState.watchMode) step.demo();
      }, 1200);
    }
  }

  function lessonNextStep() {
    clearLessonTimer();
    const step = currentLessonStep();
    if (!step) return;

    if (step.id === 'complete') {
      endLesson();
      return;
    }

    // Check if this is the last Watch step — gate to Drive
    const nextIndex = lessonState.stepIndex + 1;
    const nextStep = lessonState.steps[nextIndex];
    if (
      lessonState.watchMode &&
      step.watchOnly &&
      nextStep &&
      !nextStep.watchOnly
    ) {
      // Watch is done — mark complete and show the Watch→Drive transition
      lessonState.watchCompleted = true;
      showWatchTransition();
      return;
    }

    lessonState.stepIndex += 1;

    if (lessonState.stepIndex >= lessonState.steps.length) {
      endLesson();
      return;
    }

    updateLessonBar();

    if (lessonState.watchMode) {
      scheduleWatchAutoAdvance();
    }
  }

  function showWatchTransition() {
    clearLessonTimer();
    lessonClearHighlights();

    const bar = document.getElementById('lesson-bar');
    const instruction = document.getElementById('lesson-instruction');
    const nextBtn = document.getElementById('lesson-next-btn');
    const hintBtn = document.getElementById('lesson-hint-btn');
    const driveBtn = document.getElementById('lesson-drive-btn');

    if (instruction) instruction.textContent = '✅ Watch complete! Now switch to DRIVE mode to practice hands-on.';
    if (nextBtn) nextBtn.style.display = 'none';
    if (hintBtn) hintBtn.style.display = 'none';

    // Pulse the DRIVE button to draw attention
    if (driveBtn) {
      driveBtn.disabled = false;
      driveBtn.style.opacity = '';
      driveBtn.title = '';
      driveBtn.classList.add('lesson-highlight');
      // Remove pulse after a few seconds
      setTimeout(() => driveBtn.classList.remove('lesson-highlight'), 4000);
    }

    if (bar) {
      bar.classList.remove('lesson-feedback-correct', 'lesson-feedback-wrong');
      void bar.offsetWidth;
      bar.classList.add('lesson-feedback-correct');
      bar.addEventListener('animationend', () => bar.classList.remove('lesson-feedback-correct'), { once: true });
    }
  }

  function lessonCheckInteraction() {
    if (!lessonState.active || lessonState.watchMode) return;
    if (lessonState._advancing) return;  // already waiting to advance
    const step = currentLessonStep();
    if (!step || step.watchOnly) return;
    if (!step.check) return;

    if (step.check()) {
      // ✅ Correct — lock out further checks until stepIndex updates
      lessonState._advancing = true;
      showLessonFeedback(true);

      // Log this step
      const now = Date.now();
      const elapsed = lessonState._driveStepStart ? now - lessonState._driveStepStart : 0;
      lessonState.stepLog.push({
        id: step.id,
        instruction: step.instruction,
        attempts: 1 + (lessonState._driveMistakes[step.id] || 0),
        mistakes: lessonState._driveMistakes[step.id] || 0,
        timeMs: elapsed,
      });
      lessonState._driveStepStart = now;

      setTimeout(() => {
        lessonState._advancing = false;
        lessonState.stepIndex += 1;
        while (
          lessonState.stepIndex < lessonState.steps.length &&
          lessonState.steps[lessonState.stepIndex].watchOnly
        ) {
          lessonState.stepIndex += 1;
        }
        if (lessonState.stepIndex >= lessonState.steps.length) {
          completeLessonDrive();
        } else {
          updateLessonBar();
        }
      }, 600);
    } else {
      // ❌ Wrong — track mistake
      if (!lessonState._driveMistakes[step.id]) lessonState._driveMistakes[step.id] = 0;
      lessonState._driveMistakes[step.id] += 1;
      showLessonFeedback(false);
      lessonWiggle(document.getElementById('lesson-bar'));
    }
  }

  function showLessonFeedback(correct) {
    const bar = document.getElementById('lesson-bar');
    if (!bar) return;
    bar.classList.remove('lesson-feedback-correct', 'lesson-feedback-wrong');
    void bar.offsetWidth;
    bar.classList.add(correct ? 'lesson-feedback-correct' : 'lesson-feedback-wrong');
    bar.addEventListener('animationend', () => {
      bar.classList.remove('lesson-feedback-correct', 'lesson-feedback-wrong');
    }, { once: true });
  }

  function lessonShowHint() {
    const step = currentLessonStep();
    if (!step || !step.hint) return;
    const instruction = document.getElementById('lesson-instruction');
    if (instruction) {
      instruction.textContent = `💡 ${step.hint}`;
    }
    (step.highlight || []).forEach((id) => {
      lessonWiggle(document.getElementById(id));
    });
  }

  function setLessonSubMode(watchMode) {
    // Drive is locked until Watch is complete
    if (!watchMode && !lessonState.watchCompleted) return;

    clearLessonTimer();

    if (watchMode) {
      lessonState.watchMode = true;
      lessonState.stepIndex = 0;
      updateLessonBar();
      scheduleWatchAutoAdvance();
    } else {
      // Name already collected at lesson entry — go straight to Drive
      if (!lessonState.driveStarted) lessonState.driveStarted = true;
      _startDriveMode();
    }
  }

  function _startDriveMode() {
    lessonState.watchMode = false;
    lessonState.driveStartTime = Date.now();
    lessonState._driveStepStart = Date.now();
    lessonState._driveMistakes = {};
    lessonState._advancing = false;

    // Jump to first non-watchOnly step
    lessonState.stepIndex = 0;
    while (
      lessonState.stepIndex < lessonState.steps.length &&
      lessonState.steps[lessonState.stepIndex].watchOnly
    ) {
      lessonState.stepIndex += 1;
    }

    resetSwitcherState();
    updateLessonBar();
  }

  // Called when user submits name from the upfront form (shown on LESSONS click)
  function submitLessonName() {
    const nameEl  = document.getElementById('lesson-name-input');
    const classEl = document.getElementById('lesson-class-input');
    const name = nameEl  ? nameEl.value.trim()  : '';
    const cls  = classEl ? classEl.value.trim() : '';

    // Both fields filled → track and submit results; either blank → practice only
    lessonState.studentName   = name;
    lessonState.studentClass  = cls;
    lessonState.submitResults = !!(name && cls);
    lessonState.nameCollected = true;

    const ol = document.getElementById('lesson-name-overlay');
    if (ol) ol.classList.remove('show');

    const select = document.getElementById('lesson-select-overlay');
    if (select) select.classList.add('show');
  }

  function completeLessonDrive() {
    clearLessonTimer();
    lessonClearHighlights();
    lessonState.active = false;

    const bar = document.getElementById('lesson-bar');
    if (bar) bar.classList.remove('lesson-visible');
    scheduleLayout();

    showLessonResults();
  }

  function showLessonResults() {
    const totalMs = lessonState.lessonStartTime ? Date.now() - lessonState.lessonStartTime : 0;
    const totalSec = Math.round(totalMs / 1000);
    const totalMistakes = Object.values(lessonState._driveMistakes).reduce((a, b) => a + b, 0);
    const lessonName = lessonState.lessonId === 1 ? 'Lesson 1 — Introduction' : `Lesson ${lessonState.lessonId}`;

    // Subtitle
    const sub = document.getElementById('lesson-results-subtitle');
    if (sub) {
      sub.textContent = lessonState.studentName
        ? `Great work, ${lessonState.studentName}!`
        : 'Drive complete — great work!';
    }

    // Stats row
    const stats = document.getElementById('lesson-results-stats');
    if (stats) {
      stats.innerHTML = `
        <div class="lesson-results-stat">
          <span class="lesson-results-stat-val">${Math.floor(totalSec / 60)}:${String(totalSec % 60).padStart(2, '0')}</span>
          <span class="lesson-results-stat-label">Time</span>
        </div>
        <div class="lesson-results-stat">
          <span class="lesson-results-stat-val">${lessonState.stepLog.length}</span>
          <span class="lesson-results-stat-label">Steps</span>
        </div>
        <div class="lesson-results-stat">
          <span class="lesson-results-stat-val">${totalMistakes}</span>
          <span class="lesson-results-stat-label">Mistakes</span>
        </div>
      `;
    }

    // Breakdown table
    const breakdown = document.getElementById('lesson-results-breakdown');
    if (breakdown && lessonState.stepLog.length) {
      const rows = lessonState.stepLog.map((s) => {
        const tSec = Math.round(s.timeMs / 1000);
        const ok = s.mistakes === 0;
        return `<div class="lesson-results-row ${ok ? '' : 'lesson-results-row-miss'}">
          <span class="lesson-results-row-label">${s.instruction}</span>
          <span class="lesson-results-row-meta">${ok ? '✅' : `❌ ${s.mistakes}`}  ${tSec}s</span>
        </div>`;
      }).join('');
      breakdown.innerHTML = rows;
    }

    const sentMsg = document.getElementById('lesson-results-sent-msg');
    if (sentMsg) sentMsg.style.display = 'none';

    const ol = document.getElementById('lesson-results-overlay');
    if (ol) {
      ol.classList.add('show');
      const dlg = document.getElementById('lesson-results-dialog');
      if (dlg) dlg.focus();
    }

    // Auto-submit if student provided their name (same pattern as quiz)
    if (lessonState.submitResults) lessonEmailResults();
  }

  function lessonEmailResults() {
    const totalMs = lessonState.lessonStartTime ? Date.now() - lessonState.lessonStartTime : 0;
    const totalSec = Math.round(totalMs / 1000);
    const totalMistakes = Object.values(lessonState._driveMistakes).reduce((a, b) => a + b, 0);
    const lessonName = lessonState.lessonId === 1 ? 'Lesson 1 — Introduction' : `Lesson ${lessonState.lessonId}`;
    const mm = Math.floor(totalSec / 60);
    const ss = String(totalSec % 60).padStart(2, '0');

    const breakdown = lessonState.stepLog.map((s) => {
      const tSec = Math.round(s.timeMs / 1000);
      return `${s.instruction}: ${s.mistakes} mistake(s), ${tSec}s`;
    }).join('\n');

    const body = {
      _subject: `SwitchUp Lesson Results — ${lessonState.studentName || 'Student'} — ${lessonName}`,
      student_name: lessonState.studentName || 'Anonymous',
      class_name: lessonState.studentClass || '—',
      lesson: lessonName,
      time: `${mm}:${ss}`,
      total_mistakes: String(totalMistakes),
      steps_completed: String(lessonState.stepLog.length),
      breakdown,
    };

    fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    })
      .then((r) => {
        if (!r.ok) throw new Error('Network error');
        const sentMsg = document.getElementById('lesson-results-sent-msg');
        if (sentMsg) {
          sentMsg.textContent = '✅ Results sent to instructor';
          sentMsg.style.display = 'block';
        }
      })
      .catch(() => {
        const sentMsg = document.getElementById('lesson-results-sent-msg');
        if (sentMsg) {
          sentMsg.textContent = '⚠️ Could not send results — check your connection';
          sentMsg.style.display = 'block';
          sentMsg.style.color = '#ff6b6b';
        }
      });
  }

  function retryLessonDrive() {
    // Close results, reset drive state, re-enter Drive mode
    const ol = document.getElementById('lesson-results-overlay');
    if (ol) ol.classList.remove('show');

    lessonState.stepLog = [];
    lessonState._driveMistakes = {};
    lessonState.lessonStartTime = Date.now(); // restart total timer on retry
    lessonState.driveStartTime = null;

    const bar = document.getElementById('lesson-bar');
    if (bar) bar.classList.add('lesson-visible');
    scheduleLayout();

    lessonState.active = true;
    _startDriveMode();
  }

  function startLesson(lessonId) {
    clearLessonTimer();
    lessonState.lessonId = lessonId;
    lessonState.steps = getLessonSteps(lessonId);
    lessonState.stepIndex = 0;
    lessonState.watchMode = true;
    lessonState.active = true;
    // Reset lesson-specific flags (keep name/class from session-wide collection)
    lessonState.watchCompleted = false;
    lessonState.driveStarted = false;
    lessonState.stepLog = [];
    lessonState._driveMistakes = {};
    lessonState.lessonStartTime = Date.now();   // total time includes Watch
    lessonState.driveStartTime = null;
    lessonState._driveStepStart = null;

    const overlay = document.getElementById('lesson-select-overlay');
    if (overlay) overlay.classList.remove('show');

    const bar = document.getElementById('lesson-bar');
    if (bar) bar.classList.add('lesson-visible');
    scheduleLayout();

    resetSwitcherState();
    updateLessonBar();
    scheduleWatchAutoAdvance();
  }

  function endLesson() {
    clearLessonTimer();
    lessonClearHighlights();
    lessonState.active = false;

    const bar = document.getElementById('lesson-bar');
    if (bar) bar.classList.remove('lesson-visible');
    scheduleLayout();

    setMode('freeplay');
  }

  function enterLessonMode() {
    if (state.quizMode) {
      showConfirm(
        'LEAVE QUIZ?',
        'You\'re in an active quiz. Leaving now will lose your score and progress.',
        'LEAVE QUIZ',
        () => { setMode('freeplay'); enterLessonMode(); }
      );
      return;
    }
    // First time this session: collect student info before showing lesson list
    if (!lessonState.nameCollected) {
      const ol = document.getElementById('lesson-name-overlay');
      if (ol) {
        ol.classList.add('show');
        setTimeout(() => {
          const inp = document.getElementById('lesson-name-input');
          if (inp) inp.focus();
        }, 50);
      }
    } else {
      const overlay = document.getElementById('lesson-select-overlay');
      if (overlay) overlay.classList.add('show');
    }
  }

  function _teardownLesson() {
    clearLessonTimer();
    lessonClearHighlights();
    lessonState.active = false;
    const bar = document.getElementById('lesson-bar');
    if (bar) bar.classList.remove('lesson-visible');
    scheduleLayout();
    ['lesson-select-overlay', 'lesson-name-overlay', 'lesson-results-overlay'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('show');
    });
  }

  function exitLessonMode() {
    _teardownLesson();
    setMode('freeplay');
  }

  function showConfirm(heading, copy, leaveLabel, onLeave) {
    document.getElementById('confirm-heading').textContent = heading;
    document.getElementById('confirm-copy').textContent = copy;
    const leaveBtn = document.getElementById('confirm-leave-btn');
    leaveBtn.textContent = leaveLabel;
    leaveBtn.onclick = () => { hideConfirm(); onLeave(); };
    document.getElementById('confirm-overlay').classList.add('show');
    setTimeout(() => document.getElementById('confirm-stay-btn').focus(), 50);
  }

  function hideConfirm() {
    document.getElementById('confirm-overlay').classList.remove('show');
  }

  // ============================================================
  // END LESSON ENGINE
  // ============================================================

  Object.assign(window, {
    selectPgm,
    selectPvw,
    toggleBackgroundTie,
    togglePreviewKey,
    doCut,
    doDissolve,
    doMediaTransition,
    dismissHotkeySplash,
    toggleHotkeySplash,
    selectKeyMode,
    toggleDVE,
    setChrColor,
    selectDSK,
    selectDSKSource,
    dskCutChannel,
    dskAutoChannel,
    nudgeDVE,
    resetDVE,
    setDVECropH,
    setDVECropV,
    setDVESize,
    setDVEBorderEnabled,
    setDVEBorderWidth,
    setDVEBorderColor,
    undoLastDVEStep,
    openDVEMoreWindow,
    closeDVEMoreWindow,
    enterFullscreenAndStart,
    dismissWelcome,
    toggleFullscreen,
    resetFreeplay,
    switchSurface,
    openMediaModal,
    closeMediaModal,
    toggleMediaModal,
    saveMacroSlot,
    renameMacroSlot,
    clearMacroSlot,
    runMacroSlot,
    setActiveMediaBank,
    assignMediaToBank,
    assignMediaTransitionToSlot,
    armMediaTransitionSlot,
    setMode,
    toggleBannerVisibility,
    submitQuizName,
    backToNameEntry,
    selectQuizLevel,
    startQuiz,
    checkAnswer,
    skipQuestion,
    enterLessonMode,
    exitLessonMode,
    startLesson,
    endLesson,
    lessonNextStep,
    lessonShowHint,
    setLessonSubMode,
    submitLessonName,
    retryLessonDrive,
    hideConfirm,
  });

  init();
})();
