const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const spriteAtlas = new Image();
const spriteCells = {
    snakeBody: { x: 0, y: 0 },
    snakeHead: { x: 96, y: 0 },
    food: { x: 192, y: 0 },
    chrono: { x: 288, y: 0 },
    echo: { x: 384, y: 0 },
    risk: { x: 0, y: 96 },
    loop: { x: 96, y: 96 }
};
spriteAtlas.onload = () => draw();
spriteAtlas.onerror = error => console.error("Не удалось загрузить спрайты игры.", error);
spriteAtlas.src = "assets/game-sprites.svg";
const overlay = document.getElementById("gameOverlay");
const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");
const restartButton = document.getElementById("restartButton");
const settingsButton = document.getElementById("settingsButton");
const settingsDialog = document.getElementById("settingsDialog");
const restartDialog = document.getElementById("restartDialog");
const cancelRestartButton = document.getElementById("cancelRestartButton");
const confirmRestartButton = document.getElementById("confirmRestartButton");
const settingInputs = {
    sound: document.getElementById("settingSound"),
    effects: document.getElementById("settingEffects"),
    contrast: document.getElementById("settingContrast"),
    largeText: document.getElementById("settingLargeText"),
    swipe: document.getElementById("settingSwipe"),
    focusMode: document.getElementById("settingFocusMode"),
    fieldUpgrades: document.getElementById("settingFieldUpgrades"),
    allMechanics: document.getElementById("settingAllMechanics")
};
const gameTip = document.getElementById("gameTip");
const gameTipText = document.getElementById("gameTipText");
const dismissTipButton = document.getElementById("dismissTipButton");
const focusButton = document.getElementById("focusButton");
const scoreValue = document.getElementById("scoreValue");
const scoreCard = scoreValue.closest(".score-card");
const bestValue = document.getElementById("bestValue");
const streakValue = document.getElementById("streakValue");
const rewindLife = document.getElementById("rewindLife");
const rewindLifeStatus = document.getElementById("rewindLifeStatus");
const rewindEffect = document.getElementById("rewindEffect");
const boardWrap = document.getElementById("boardWrap");
const rhythmMeter = document.getElementById("rhythmMeter");
const rhythmProgress = document.getElementById("rhythmProgress");
const rhythmStatus = document.getElementById("rhythmStatus");
const levelLabel = document.getElementById("levelLabel");
const levelPill = levelLabel.closest(".level-pill");
const scoreCaption = document.getElementById("scoreCaption");
const focusButtonLabel = document.getElementById("focusButtonLabel");
const focusHint = document.getElementById("focusHint");
const focusChargesElements = document.querySelectorAll(".focus-charge");
const gameStatus = document.getElementById("gameStatus");
const overlayKicker = document.getElementById("overlayKicker");
const overlayTitle = document.getElementById("overlayTitle");
const overlayCopy = document.getElementById("overlayCopy");
const startButtonLabel = document.getElementById("startButtonLabel");
const overlayHint = document.querySelector(".overlay-hint");
const pauseLabel = document.getElementById("pauseLabel");
const pauseIcon = document.querySelector(".pause-icon");
const challengeProgress = document.getElementById("challengeProgress");
const challengeDescription = document.getElementById("challengeDescription");
const challengeBar = document.getElementById("challengeBar");
const routeComboStatus = document.getElementById("routeComboStatus");
const routeComboDescription = document.getElementById("routeComboDescription");
const routeComboDots = document.getElementById("routeComboDots");
const worldStatus = document.getElementById("worldStatus");
const worldStatusText = document.getElementById("worldStatusText");
const upgradePicker = document.getElementById("upgradePicker");
const upgradeButtons = document.querySelectorAll(".upgrade-option");
const hudScore = document.getElementById("hudScore");
const hudFlow = document.getElementById("hudFlow");
const hudFocusDots = document.querySelectorAll(".hud-focus i");
const hudPower = document.getElementById("hudPower");
const hudPace = document.getElementById("hudPace");
const tailCutButton = document.getElementById("tailCutButton");
const tailCutLabel = document.getElementById("tailCutLabel");
const summaryShareButton = document.getElementById("summaryShareButton");
const summaryStreak = document.getElementById("summaryStreak");
const resumeCount = document.getElementById("resumeCount");
const resultActions = document.getElementById("resultActions");
const summaryReplayButton = document.getElementById("summaryReplayButton");
const summaryModeButton = document.getElementById("summaryModeButton");
const summaryUnlock = document.getElementById("summaryUnlock");
const statCompleted = document.getElementById("statCompleted");
const statFavorite = document.getElementById("statFavorite");
const statBest = document.getElementById("statBest");
const biomeLabel = document.getElementById("biomeLabel");
const themeButtons = document.querySelectorAll(".theme-option");
const themeUnlockStatus = document.getElementById("themeUnlockStatus");
const roundSummary = document.getElementById("roundSummary");
const summaryScore = document.getElementById("summaryScore");
const summaryRecord = document.getElementById("summaryRecord");
const summaryPickups = document.getElementById("summaryPickups");
const summaryCombo = document.getElementById("summaryCombo");
const summaryTime = document.getElementById("summaryTime");
const summaryChallenge = document.getElementById("summaryChallenge");
const summaryMedal = document.getElementById("summaryMedal");
const summaryNextGoal = document.getElementById("summaryNextGoal");
const summaryProgress = document.querySelector(".summary-progress");
const summaryProgressBar = document.getElementById("summaryProgressBar");
const runSetup = document.getElementById("runSetup");
const modifierButtons = document.querySelectorAll(".run-modifier");
const selectedModeSummary = document.getElementById("selectedModeSummary");
const dailyRunButton = document.getElementById("dailyRunButton");
const dailyRunDetails = document.getElementById("dailyRunDetails");
const dailyBestScore = document.getElementById("dailyBestScore");
const challengeModeLabel = document.getElementById("challengeModeLabel");
const chainProgress = document.getElementById("chainProgress");
const chainDescription = document.getElementById("chainDescription");
const chainBar = document.getElementById("chainBar");
const achievementCount = document.getElementById("achievementCount");
const achievementList = document.getElementById("achievementList");
const portalControl = document.getElementById("portalControl");

const gridSize = 24;
const gameCanvasSize = canvas.width;
const tileCount = gameCanvasSize / gridSize;
let renderScale = 1;
const storageKey = "infinite-snake-best";
const preferencesStorageKey = storageKey + "-preferences";
const soundPreferenceStorageKey = preferencesStorageKey + "-sound-explicit";
const swipePreferenceStorageKey = preferencesStorageKey + "-swipe-explicit";
const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
// Запись в DOM только при реальном изменении текста — без лишних пересчётов вёрстки.
function setText(element, value) {
    if (element.__text === value) return;
    element.__text = value;
    element.textContent = value;
}
const bestTrailKey = storageKey + "-trail";
const rewindSteps = 8;
const timelineLimit = rewindSteps + 1;
const rhythmBeatLength = 1600;
const timeLoopLength = 7000;
const pickupZoomDuration = 440;
const pickupZoomStrength = 0.075;
const visualDurations = {
    comboFlash: 900,
    foodSpawn: 360,
    headPickup: 300,
    levelUp: 620,
    newRecord: 1100,
    portalTransit: 460,
    portalOpen: 720,
    nearMiss: 520
};
const biomes = [
    { name: "НЕОНОВЫЙ САД", kind: "garden", accent: "#c2ff00", wash: "rgba(194, 255, 0, .075)", grid: "rgba(184, 187, 207, .035)", majorGrid: "rgba(194, 255, 0, .075)" },
    { name: "КИБЕР-СИЯНИЕ", kind: "aurora", accent: "#56dcff", wash: "rgba(86, 220, 255, .075)", grid: "rgba(184, 187, 207, .035)", majorGrid: "rgba(86, 220, 255, .08)" },
    { name: "УЛЬТРАФИОЛЕТ", kind: "cosmos", accent: "#a88bff", wash: "rgba(168, 139, 255, .08)", grid: "rgba(184, 187, 207, .035)", majorGrid: "rgba(168, 139, 255, .08)" },
    { name: "НЕОНОВЫЙ ПУЛЬС", kind: "dusk", accent: "#ff5ac4", wash: "rgba(255, 90, 196, .075)", grid: "rgba(184, 187, 207, .035)", majorGrid: "rgba(255, 90, 196, .08)" }
];
const snakeThemes = [
    { id: "grove", name: "Неон", unlock: 0, hue: 0, accent: "#c2ff00", trail: "rgba(194, 255, 0, .42)" },
    { id: "mint", name: "Циан", unlock: 15, hue: 105, accent: "#56dcff", trail: "rgba(86, 220, 255, .42)" },
    { id: "ocean", name: "Магента", unlock: 35, hue: 238, accent: "#ff5ac4", trail: "rgba(255, 90, 196, .42)" },
    { id: "violet", name: "Ультрафиолет", unlock: 60, hue: 180, accent: "#a88bff", trail: "rgba(168, 139, 255, .42)" }
];
const themeStorageKey = storageKey + "-theme";
const runModifiers = {
    steady: { name: "ТОЧНОСТЬ", rhythmWindow: 320 },
    hunter: { name: "ОХОТА", rhythmWindow: 220 },
    tempo: { name: "ТЕМП", rhythmWindow: 220 }
};
const chainObjectives = [
    { id: "collect", description: "Соберите 3 объекта подряд", target: 3 },
    { id: "rhythm", description: "Поймайте объект точно в ритм", target: 1 },
    { id: "risk", description: "Рискните и подберите красный объект", target: 1 }
];
const achievements = [
    { id: "first", icon: "spark", title: "ПЕРВЫЙ ШАГ", description: "Подберите объект", check: stats => stats.pickups >= 1 },
    { id: "streak", icon: "flame", title: "НА ПОТОКЕ", description: "Серия ×5", check: stats => stats.bestCombo >= 5 },
    { id: "risk", icon: "target", title: "СМЕЛЫЙ ХОД", description: "Подберите риск-точку", check: stats => stats.riskPickups >= 1 },
    { id: "portal", icon: "portal", title: "СКВОЗЬ ПЕТЛЮ", description: "Получите бонус портального маршрута", check: stats => stats.portalRoutes >= 1 },
    { id: "daily", icon: "calendar", title: "РИТУАЛ", description: "Завершите ежедневный забег", check: stats => stats.dailyRuns >= 1 }
];
const directions = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 }
};
const contextTipsSeen = new Set();
const contextTips = {
    focus: isTouchDevice
        ? "Фокус заряжен: дважды коснитесь поля или нажмите «Фокус», чтобы ненадолго замедлить игру."
        : "Фокус заряжен: нажмите F или кнопку «Фокус», чтобы ненадолго замедлить игру.",
    upgradeField: "На поле появились три усиления. Заберите змейкой одно — остальные исчезнут. Набор каждый раз разный.",
    risk: "Риск-точка даёт больше очков, но исчезает через несколько секунд.",
    portal: isTouchDevice
        ? "Порталы переносят к паре. Пройдите через оба для награды. Касание поля двумя пальцами выключает и включает их."
        : "Порталы переносят к паре. Пройдите через оба для дополнительной награды.",
    hazard: "Красная клетка скоро станет опасной — освободите её до конца отсчёта.",
    pursuer: "Вражеская змея преследует вас. Столкновение с любой её секцией опасно.",
    tailCut: isTouchDevice
        ? "Змейка выросла: кнопка «Сбросить хвост» превратит половину сегментов в очки, но обнулит поток."
        : "Змейка выросла: клавиша Q превратит половину сегментов в очки, но обнулит поток.",
    resonance: "Резонанс! Поворачивайте в такт импульсу: с ×3 каждый подбор даёт +1, с ×6 — +2.",
    hunt: "Погоня! Охотник ускорился на 20 секунд. Продержитесь — получите +8 очков и полный фокус.",
    biomeAurora: "Кибер-сияние: лёд. Перед поворотом змейка проскальзывает ещё одну клетку — поворачивайте заранее.",
    biomeCosmos: "Ультрафиолет: тьма. Видно только область вокруг головы, еда слабо мерцает вдали.",
    biomeDusk: "Неоновый пульс: стены появляются через такт. Пунктир — стена скоро станет твёрдой."
};

let snake;
let direction;
let queuedDirection;
let pendingDirection = null;
let food;
let score;
let foodCount;
let nextRewindFoodAt;
let rewindCharges;
let timeline;
let ghostTrail;
let ghostRemaining;
let particles;
let pickupWaves;
let shakeRemaining;
let shakeStrength;
let cameraZoomRemaining;
let cameraZoomAnchor;
let headPickupRemaining;
let comboFlashRemaining;
let foodSpawnEffects;
let newRecordRemaining;
let portalTransit;
let levelUpRemaining;
let displayedLevel = 1;
let currentStagePalette = biomes[0];
let currentBiomeIndex = 0;
let biomeTransitionRemaining = 0;
let currentTheme = loadSelectedTheme();
let riskFood;
let riskRemaining;
let portals;
let portalRemaining;
let foodHistory;
let loopSequence;
let loopIndex;
let loopRemaining;
let rhythmClock;
let rhythmPerfectMessage;
let focusCharges;
let focusRemaining;
let combo;
let comboRemaining;
let echoRemaining;
let runPath;
let bestTrail = loadBestTrail();
let runStep;
let challenge;
let roundElapsed;
let bestCombo;
let bestScoreAtRoundStart;
let pickupMoodRemaining;
let portalOpenRemaining;
let nearMissRemaining;
let nearMissCooldown;
let selectedModifier = "steady";
let runModifier = runModifiers.steady;
let dailyRun = false;
let dailyDateKey = "";
let dailyScore = 0;
let dailyRngState = 1;
let chainIndex = 0;
let chainCount = 0;
let riskPickups = 0;
let portalRoutes = 0;
let dailyRuns = loadDailyRuns();
let portalActive = true;
let portalLastIndex = -1;
let portalRouteRemaining = 0;
let currentRunRecord = { score: 0, trail: [] };
let currentRunRecordKey = "";
let routeCombo;
let routeLastColor;
let hazards;
let hazardWarningAt;
let pursuer;
let pursuerSegments = [];
let pursuerStepCounter;
let nextUpgradeAt;
let activeUpgrade;
let shieldCharges;
let magnetRemaining;
let doubleScoreCharges;
let pendingUpgradeChoice;
let upgradeTokens = [];
let upgradeTokensRemaining = 0;
let resumeCountdown = 0;
let statusClock = 0;
let lastIdleDraw = 0;
let recordSaveDirty = false;
let recordSaveAt = 0;
let phaseCharges = 0;
let stasisRemaining = 0;
let echoBoostCharges = 0;
let rhythmBoostRemaining = 0;
let resonance = 0;
let resonanceRemaining = 0;
let resonanceBeatIndex = -1;
let iceSlideUsed = false;
let pulseWalls = [];
let huntRemaining = 0;
let nextHuntAt = 16;
let runPace = [];
let ghostPace = [];
let paceLead = null;
let lastRunSummary = null;
let resumeCountLabel = 0;
let bestScore = loadBestScore();
let gameState = "idle";
let stateBeforeRestartConfirmation = null;
let lastFrame = 0;
let timeSinceStep = 0;
let animationFrame;
let preferences = loadPreferences();
let audioContext = null;
let soundtrackVoices = [];
let soundtrackTimer = 0;
let soundtrackChordIndex = 0;
let soundtrackNoteIndex = 0;
let soundtrackBus = null;
let gameTipTimeout = 0;

function loadPreferences() {
    // На сенсорных экранах свайпы включены по умолчанию, пока игрок сам не выберет иначе.
    const defaults = { sound: true, effects: false, contrast: false, largeText: false, swipe: isTouchDevice, focusMode: false, fieldUpgrades: true, allMechanics: false };
    try {
        const stored = JSON.parse(localStorage.getItem(preferencesStorageKey) || "null");
        if (!stored || typeof stored !== "object") return defaults;
        return {
            ...Object.fromEntries(Object.keys(defaults).map(key =>
                [key, typeof stored[key] === "boolean" ? stored[key] : defaults[key]]
            )),
            sound: localStorage.getItem(soundPreferenceStorageKey) === "true"
                ? stored.sound === true
                : defaults.sound,
            swipe: localStorage.getItem(swipePreferenceStorageKey) === "true"
                ? stored.swipe === true
                : defaults.swipe
        };
    } catch (error) {
        console.warn("Не удалось загрузить настройки игры.", error);
        return defaults;
    }
}

function savePreferences(changedKey) {
    try {
        localStorage.setItem(preferencesStorageKey, JSON.stringify(preferences));
        if (changedKey === "sound") localStorage.setItem(soundPreferenceStorageKey, "true");
        if (changedKey === "swipe") localStorage.setItem(swipePreferenceStorageKey, "true");
    } catch (error) {
        console.warn("Не удалось сохранить настройки игры.", error);
    }
}

function applyPreferences() {
    document.body.classList.toggle("settings-effects", preferences.effects);
    document.body.classList.toggle("settings-high-contrast", preferences.contrast);
    document.body.classList.toggle("settings-large-text", preferences.largeText);
    document.body.classList.toggle("settings-swipe", preferences.swipe);
    document.body.classList.toggle("settings-focus", preferences.focusMode);
    Object.entries(settingInputs).forEach(([key, input]) => {
        input.checked = preferences[key];
    });
}

function updateThemeAccentVariables() {
    document.documentElement.style.setProperty("--theme-accent", currentTheme.accent);
    const channels = currentTheme.accent.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
    if (channels) {
        document.documentElement.style.setProperty(
            "--theme-accent-rgb",
            channels.slice(1).map(channel => parseInt(channel, 16)).join(", ")
        );
    }
}

function loadSelectedTheme() {
    try {
        const selectedId = localStorage.getItem(themeStorageKey);
        return snakeThemes.find(theme => theme.id === selectedId) || snakeThemes[0];
    } catch (error) {
        console.warn("Не удалось загрузить тему змейки из локального хранилища.", error);
        return snakeThemes[0];
    }
}

function saveSelectedTheme() {
    try {
        localStorage.setItem(themeStorageKey, currentTheme.id);
    } catch (error) {
        console.warn("Не удалось сохранить тему змейки в локальном хранилище.", error);
    }
}

function updateThemePicker() {
    themeButtons.forEach(button => {
        const theme = snakeThemes.find(option => option.id === button.dataset.theme);
        const unlocked = Boolean(theme && bestScore >= theme.unlock);
        const selected = Boolean(theme && currentTheme.id === theme.id);
        button.disabled = !unlocked;
        button.classList.toggle("is-selected", selected);
        button.classList.toggle("is-locked", !unlocked);
        button.setAttribute("aria-pressed", String(selected));
        button.title = unlocked ? theme.name : "Откроется при рекорде " + theme.unlock;
    });
    const nextTheme = snakeThemes.find(theme => theme.unlock > bestScore);
    themeUnlockStatus.textContent = nextTheme ? "СЛЕДУЮЩАЯ · " + nextTheme.unlock : "ВСЕ ОТКРЫТЫ";
    updateThemeAccentVariables();
}

function chooseTheme(id) {
    const theme = snakeThemes.find(option => option.id === id);
    if (!theme || bestScore < theme.unlock) return;
    currentTheme = theme;
    saveSelectedTheme();
    updateThemePicker();
    draw();
}

function showContextTip(id) {
    if (!contextTips[id] || contextTipsSeen.has(id)) return;
    contextTipsSeen.add(id);
    showTip(contextTips[id]);
}

function playSound(type) {
    if (!preferences.sound) return;
    try {
        const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextConstructor) return;
        audioContext = audioContext || new AudioContextConstructor();
        if (audioContext.state === "suspended") {
            audioContext.resume().catch(error => console.warn("Не удалось запустить аудиоконтекст.", error));
        }
        const presets = {
            pickup: { notes: [740, 988], spacing: 0.075, duration: 0.24, waveform: "sine", volume: 0.24 },
            riskPickup: { notes: [587, 880], spacing: 0.075, duration: 0.24, waveform: "triangle", volume: 0.22 },
            chronoPickup: { notes: [523, 784, 1047], spacing: 0.06, duration: 0.28, waveform: "sine", volume: 0.2 },
            portal: { notes: [420], spacing: 0, duration: 0.13, waveform: "triangle", volume: 0.12 },
            beat: { notes: [1175], spacing: 0, duration: 0.09, waveform: "sine", volume: 0.07 },
            danger: { notes: [190], spacing: 0, duration: 0.18, waveform: "sawtooth", volume: 0.12 },
            end: { notes: [130], spacing: 0, duration: 0.24, waveform: "triangle", volume: 0.12 }
        };
        const preset = presets[type] || presets.pickup;
        preset.notes.forEach((frequency, index) => {
            const startAt = audioContext.currentTime + index * preset.spacing;
            const oscillator = audioContext.createOscillator();
            const gain = audioContext.createGain();
            oscillator.type = preset.waveform;
            oscillator.frequency.setValueAtTime(frequency, startAt);
            gain.gain.setValueAtTime(0.0001, startAt);
            gain.gain.exponentialRampToValueAtTime(preset.volume, startAt + 0.012);
            gain.gain.exponentialRampToValueAtTime(0.0001, startAt + preset.duration);
            oscillator.connect(gain);
            gain.connect(audioContext.destination);
            oscillator.start(startAt);
            oscillator.stop(startAt + preset.duration);
        });
    } catch (error) {
        console.warn("Не удалось воспроизвести звуковой сигнал.", error);
    }
}

function updateSoundtrackChord() {
    if (!audioContext || soundtrackVoices.length === 0) return;
    const progression = [
        [130.81, 164.81, 196.00],
        [110.00, 146.83, 174.61],
        [146.83, 174.61, 220.00],
        [123.47, 155.56, 185.00]
    ];
    const chord = progression[soundtrackChordIndex % progression.length];
    soundtrackVoices.forEach((voice, index) => {
        voice.frequency.setTargetAtTime(chord[index], audioContext.currentTime, 1.8);
    });
    soundtrackChordIndex++;
}

function playSoundtrackNote() {
    if (!audioContext || !soundtrackBus || soundtrackVoices.length === 0) return;
    const notes = [392, 493.88, 440, 587.33, 523.25, 440, 392, 329.63];
    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(notes[soundtrackNoteIndex % notes.length], now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.055, now + 0.035);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
    oscillator.connect(gain);
    gain.connect(soundtrackBus);
    oscillator.start(now);
    oscillator.stop(now + 0.95);
    // Резонанс добавляет в музыку новые слои.
    const baseNote = notes[soundtrackNoteIndex % notes.length];
    const layer = (frequency, delay, volume) => {
        const voice = audioContext.createOscillator();
        const voiceGain = audioContext.createGain();
        voice.type = "triangle";
        voice.frequency.setValueAtTime(frequency, now + delay);
        voiceGain.gain.setValueAtTime(0.0001, now + delay);
        voiceGain.gain.exponentialRampToValueAtTime(volume, now + delay + 0.03);
        voiceGain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.6);
        voice.connect(voiceGain);
        voiceGain.connect(soundtrackBus);
        voice.start(now + delay);
        voice.stop(now + delay + 0.65);
    };
    if (resonance >= 3) layer(baseNote * 1.5, 1.3, 0.04);
    if (resonance >= 6) {
        layer(baseNote * 2, 0.65, 0.032);
        layer(baseNote * 2.5, 1.95, 0.028);
    }
    soundtrackNoteIndex++;
}

function startSoundtrack() {
    if (!preferences.sound || gameState !== "running" || soundtrackVoices.length > 0) return;
    try {
        const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextConstructor) return;
        audioContext = audioContext || new AudioContextConstructor();
        if (audioContext.state === "suspended") {
            audioContext.resume().catch(error => console.warn("Не удалось запустить аудиоконтекст.", error));
        }
        soundtrackBus = audioContext.createGain();
        soundtrackBus.gain.setValueAtTime(1, audioContext.currentTime);
        soundtrackBus.connect(audioContext.destination);
        const chord = [130.81, 164.81, 196.00];
        soundtrackVoices = chord.map((frequency, index) => {
            const oscillator = audioContext.createOscillator();
            const gain = audioContext.createGain();
            oscillator.type = index === 1 ? "triangle" : "sine";
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(index === 1 ? 0.085 : 0.12, audioContext.currentTime + 2.5);
            oscillator.connect(gain);
            gain.connect(soundtrackBus);
            oscillator.start();
            return { oscillator, gain, frequency: oscillator.frequency };
        });
        soundtrackChordIndex = 1;
        soundtrackNoteIndex = 0;
        playSoundtrackNote();
        soundtrackTimer = window.setInterval(() => {
            updateSoundtrackChord();
            playSoundtrackNote();
        }, 2600);
    } catch (error) {
        soundtrackVoices = [];
        console.warn("Не удалось запустить фоновое звуковое сопровождение.", error);
    }
}

function stopSoundtrack() {
    window.clearInterval(soundtrackTimer);
    soundtrackTimer = 0;
    if (!audioContext || soundtrackVoices.length === 0) return;
    const voices = soundtrackVoices;
    soundtrackVoices = [];
    if (soundtrackBus) {
        soundtrackBus.gain.cancelScheduledValues(audioContext.currentTime);
        soundtrackBus.gain.setTargetAtTime(0.0001, audioContext.currentTime, 0.2);
        soundtrackBus = null;
    }
    const stopAt = audioContext.currentTime + 1.2;
    voices.forEach(({ oscillator, gain }) => {
        gain.gain.cancelScheduledValues(audioContext.currentTime);
        gain.gain.setTargetAtTime(0.0001, audioContext.currentTime, 0.2);
        oscillator.stop(stopAt);
    });
}

function duckSoundtrack(ducked) {
    if (!audioContext || !soundtrackBus) return;
    const now = audioContext.currentTime;
    soundtrackBus.gain.cancelScheduledValues(now);
    soundtrackBus.gain.setTargetAtTime(ducked ? 0.12 : 1, now, ducked ? 0.16 : 0.55);
}

function getLocalDateKey(date = new Date()) {
    return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0")
        + "-" + String(date.getDate()).padStart(2, "0");
}

function hashSeed(value) {
    let hash = 2166136261;
    for (let index = 0; index < value.length; index++) {
        hash ^= value.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0 || 1;
}

function gameRandom() {
    dailyRngState = (Math.imul(dailyRngState, 1664525) + 1013904223) >>> 0;
    return dailyRngState / 4294967296;
}

function getDailyModifier(dateKey = getLocalDateKey()) {
    const options = Object.keys(runModifiers);
    return options[hashSeed(dateKey) % options.length];
}

function loadDailyRecord(dateKey) {
    try {
        const stored = JSON.parse(localStorage.getItem(storageKey + "-daily-" + dateKey) || "null");
        return isValidRunRecord(stored) ? stored : { score: 0, trail: [] };
    } catch (error) {
        console.warn("Не удалось загрузить рекорд ежедневного забега.", error);
        return { score: 0, trail: [] };
    }
}

function isValidRunRecord(value) {
    return Boolean(value && Number.isFinite(value.score) && value.score >= 0 && Array.isArray(value.trail)
        && value.trail.length <= 1200 && value.trail.every(position =>
            Number.isInteger(position.x) && Number.isInteger(position.y)
            && position.x >= 0 && position.x < tileCount && position.y >= 0 && position.y < tileCount
        ));
}

function loadRunRecord(key) {
    try {
        const stored = JSON.parse(localStorage.getItem(key) || "null");
        return isValidRunRecord(stored) ? stored : { score: 0, trail: [] };
    } catch (error) {
        console.warn("Не удалось загрузить рекорд выбранного испытания.", error);
        return { score: 0, trail: [] };
    }
}

function saveCurrentRunRecord() {
    try {
        localStorage.setItem(currentRunRecordKey, JSON.stringify(currentRunRecord));
    } catch (error) {
        console.warn("Не удалось сохранить рекорд выбранного испытания.", error);
    }
}

// Запись рекорда (до 1200 точек маршрута) — тяжёлая синхронная операция, поэтому она
// выполняется не чаще раза в 4 секунды, а также на паузе, в конце забега и при уходе со страницы.
function flushRecordSaves() {
    if (!recordSaveDirty) return;
    recordSaveDirty = false;
    recordSaveAt = performance.now();
    saveCurrentRunRecord();
    saveBestScore();
    if (!dailyRun) saveBestTrail();
}

function recordScoreIfNeeded() {
    let updated = false;
    if (score > currentRunRecord.score) {
        currentRunRecord = { score, trail: runPath.slice(0, 1200), pace: runPace.slice() };
        bestTrail = currentRunRecord.trail;
        recordSaveDirty = true;
        updated = true;
    }
    if (score > bestScore) {
        bestScore = score;
        recordSaveDirty = true;
        if (!dailyRun) {
            bestTrail = runPath.slice(0, 1200);
            recordSaveDirty = true;
        }
        triggerNewRecord();
        updateThemePicker();
        updated = true;
    }
    if (recordSaveDirty && performance.now() - recordSaveAt > 4000) flushRecordSaves();
    return updated;
}

function loadUnlockedAchievements() {
    try {
        const stored = JSON.parse(localStorage.getItem(storageKey + "-achievements") || "[]");
        return new Set(Array.isArray(stored) ? stored.filter(id => achievements.some(item => item.id === id)) : []);
    } catch (error) {
        console.warn("Не удалось загрузить достижения.", error);
        return new Set();
    }
}

const unlockedAchievements = loadUnlockedAchievements();

function renderAchievements() {
    achievementList.replaceChildren();
    achievements.forEach(achievement => {
        const badge = document.createElement("span");
        const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
        const unlocked = unlockedAchievements.has(achievement.id);
        badge.className = "achievement-badge" + (unlocked ? " is-unlocked" : "");
        icon.classList.add("ui-icon");
        icon.setAttribute("viewBox", "0 0 24 24");
        icon.setAttribute("aria-hidden", "true");
        use.setAttribute("href", "#icon-" + achievement.icon);
        icon.append(use);
        badge.append(icon, document.createTextNode(unlocked ? achievement.title : "???"));
        badge.title = achievement.description;
        achievementList.append(badge);
    });
    achievementCount.textContent = unlockedAchievements.size + "/" + achievements.length;
}

function checkAchievements() {
    const stats = { pickups: foodCount, bestCombo, riskPickups, portalRoutes, dailyRuns };
    let newlyUnlocked = null;
    achievements.forEach(achievement => {
        if (!unlockedAchievements.has(achievement.id) && achievement.check(stats)) {
            unlockedAchievements.add(achievement.id);
            newlyUnlocked = achievement;
        }
    });
    if (newlyUnlocked) {
        try {
            localStorage.setItem(storageKey + "-achievements", JSON.stringify([...unlockedAchievements]));
        } catch (error) {
            console.warn("Не удалось сохранить достижение.", error);
        }
        announce("Новое достижение: " + newlyUnlocked.title + "!");
        renderAchievements();
    }
    return newlyUnlocked;
}

function updateDailyRunLabel() {
    const dateKey = getLocalDateKey();
    const record = loadDailyRecord(dateKey);
    const streakCount = currentDailyStreak();
    dailyRunDetails.textContent = "Сегодня · " + runModifiers[getDailyModifier(dateKey)].name.toLowerCase()
        + (streakCount > 0 ? " · " + pluralDays(streakCount) + " подряд" : " · отдельный рекорд");
    dailyBestScore.textContent = "РЕКОРД · " + String(record.score).padStart(2, "0");
}

function loadDailyRuns() {
    try {
        const stored = Number(localStorage.getItem(storageKey + "-daily-runs"));
        return Number.isInteger(stored) && stored >= 0 ? stored : 0;
    } catch (error) {
        console.warn("Не удалось загрузить число ежедневных забегов.", error);
        return 0;
    }
}

function chooseModifier(id) {
    if (!runModifiers[id]) return;
    dailyRun = false;
    selectedModifier = id;
    updateSelectedModeSummary();
}

function updateSelectedModeSummary() {
    const labels = { steady: "ТОЧНОСТЬ", hunter: "ОХОТА", tempo: "ТЕМП" };
    selectedModeSummary.firstChild.textContent = "ИСПЫТАНИЕ · " + (labels[selectedModifier] || labels.steady) + " ";
    modifierButtons.forEach(button => {
        const selected = button.dataset.modifier === selectedModifier;
        button.classList.toggle("is-selected", selected);
        button.setAttribute("aria-pressed", String(selected));
    });
}

function loadBestScore() {
    try {
        const storedScore = Number(localStorage.getItem(storageKey));
        return Number.isFinite(storedScore) && storedScore > 0 ? storedScore : 0;
    } catch (error) {
        console.warn("Не удалось загрузить рекорд из локального хранилища.", error);
        return 0;
    }
}

function loadBestTrail() {
    try {
        const storedTrail = JSON.parse(localStorage.getItem(bestTrailKey) || "[]");
        if (!Array.isArray(storedTrail) || storedTrail.some(position =>
            !Number.isInteger(position.x) || !Number.isInteger(position.y)
            || position.x < 0 || position.x >= tileCount || position.y < 0 || position.y >= tileCount
        )) {
            console.warn("Маршрут рекорда имеет неверный формат; призрак рекорда отключён.");
            return [];
        }
        return storedTrail.slice(0, 1200);
    } catch (error) {
        console.warn("Не удалось загрузить маршрут рекорда.", error);
        return [];
    }
}

function saveBestScore() {
    try {
        localStorage.setItem(storageKey, String(bestScore));
    } catch (error) {
        console.warn("Не удалось сохранить рекорд в локальном хранилище.", error);
    }
}

function saveBestTrail() {
    try {
        localStorage.setItem(bestTrailKey, JSON.stringify(bestTrail));
    } catch (error) {
        console.warn("Не удалось сохранить маршрут рекорда.", error);
    }
}

// Механики открываются постепенно: по одной ступени за каждый сыгранный забег.
const mechanicTiers = { echo: 1, risk: 1, upgrades: 2, resonance: 2, hazard: 3, chrono: 3, tailCut: 3, pursuer: 4, hunt: 4, portals: 5, loop: 5, colorCombo: 5, chain: 5, biomeRules: 5 };
const maxMechanicTier = 5;
const tierTips = {
    0: "Собирайте точки. Поймаете точку в такт импульсу «Ритм» — получите +1 очко.",
    1: "Новое в этом забеге: эхо-точки (+3, быстро исчезают) и риск-точки (+4, живут 5 секунд).",
    2: "Новое в этом забеге: усиления (каждые 5 подборов — три случайных на выбор) и резонанс: повороты в такт импульсу копят бонус к очкам.",
    3: "Новое в этом забеге: опасные клетки, хроно-осколок и сброс хвоста — половина змейки превращается в очки.",
    4: "Новое в этом забеге: преследователь. Иногда он устраивает погоню: продержитесь 20 секунд ради награды.",
    5: "Новое в этом забеге: порталы, петля времени, цветовое комбо, цепочка целей и особые правила биомов. Теперь открыто всё."
};
const tierNames = {
    1: "ЭХО И РИСК-ТОЧКИ", 2: "УСИЛЕНИЯ И РЕЗОНАНС", 3: "ЛОВУШКИ, ОТМОТКА И СБРОС ХВОСТА",
    4: "ПРЕСЛЕДОВАТЕЛЬ И ПОГОНЯ", 5: "ПОРТАЛЫ, ПЕТЛЯ ВРЕМЕНИ И ПРАВИЛА БИОМОВ"
};
const statsStorageKey = storageKey + "-stats";
let playerStats = loadPlayerStats();
let runTier = maxMechanicTier;

function loadPlayerStats() {
    try {
        const stored = JSON.parse(localStorage.getItem(statsStorageKey) || "null");
        if (stored && typeof stored === "object" && Number.isFinite(stored.completed) && Number.isFinite(stored.tier)) {
            return {
                completed: Math.max(0, Math.floor(stored.completed)),
                tier: Math.min(maxMechanicTier, Math.max(0, Math.floor(stored.tier))),
                tierSeen: Number.isFinite(stored.tierSeen) ? stored.tierSeen : -1,
                newsSeen: stored.newsSeen,
                modes: stored.modes && typeof stored.modes === "object" ? stored.modes : {}
            };
        }
    } catch (error) {
        console.warn("Не удалось загрузить статистику игрока.", error);
    }
    // Тем, кто уже играл раньше, все механики доступны сразу.
    const veteran = loadBestScore() >= 10;
    return { completed: 0, tier: veteran ? maxMechanicTier : 0, tierSeen: veteran ? maxMechanicTier : -1, modes: {} };
}

function savePlayerStats() {
    try {
        localStorage.setItem(statsStorageKey, JSON.stringify(playerStats));
    } catch (error) {
        console.warn("Не удалось сохранить статистику игрока.", error);
    }
}

function renderPlayerStats() {
    statCompleted.textContent = String(playerStats.completed);
    const favorite = Object.entries(playerStats.modes).sort((a, b) => b[1] - a[1])[0];
    statFavorite.textContent = favorite && runModifiers[favorite[0]] ? runModifiers[favorite[0]].name : "—";
    statBest.textContent = String(bestScore);
}

function mechanicUnlocked(name) {
    return runTier >= mechanicTiers[name];
}

function showTip(text, duration = 6500) {
    gameTipText.textContent = text;
    gameTip.hidden = false;
    window.clearTimeout(gameTipTimeout);
    gameTipTimeout = window.setTimeout(() => {
        gameTip.hidden = true;
    }, duration);
}

function resetRound() {
    window.clearTimeout(gameTipTimeout);
    runTier = dailyRun || preferences.allMechanics ? maxMechanicTier : playerStats.tier;
    document.body.classList.toggle("lock-advanced", runTier < maxMechanicTier);
    upgradeTokens = [];
    upgradeTokensRemaining = 0;
    phaseCharges = 0;
    stasisRemaining = 0;
    echoBoostCharges = 0;
    rhythmBoostRemaining = 0;
    resonance = 0;
    resonanceRemaining = 0;
    resonanceBeatIndex = -1;
    iceSlideUsed = false;
    pulseWalls = [];
    huntRemaining = 0;
    nextHuntAt = 16;
    runPace = [];
    paceLead = null;
    document.body.classList.toggle("lock-tailcut", !mechanicUnlocked("tailCut"));
    clearResumeCountdown();
    gameTip.hidden = true;
    runModifier = runModifiers[dailyRun ? getDailyModifier(dailyDateKey) : selectedModifier];
    dailyRngState = dailyRun ? hashSeed(dailyDateKey) : hashSeed(String(Date.now()) + String(Math.random()));
    currentRunRecordKey = dailyRun
        ? storageKey + "-daily-" + dailyDateKey
        : storageKey + "-run-" + (dailyRun ? "daily" : selectedModifier);
    currentRunRecord = dailyRun ? loadDailyRecord(dailyDateKey) : loadRunRecord(currentRunRecordKey);
    bestTrail = currentRunRecord.trail.length ? currentRunRecord.trail : loadBestTrail();
    ghostPace = Array.isArray(currentRunRecord.pace)
        ? currentRunRecord.pace.filter(value => Number.isFinite(value)).slice(0, 720)
        : [];
    portalActive = false;
    portalLastIndex = -1;
    portalRouteRemaining = 0;
    chainIndex = 0;
    chainCount = 0;
    riskPickups = 0;
    portalRoutes = 0;
    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: 0 };
    queuedDirection = direction;
    pendingDirection = null;
    food = null;
    score = 0;
    foodCount = 0;
    nextRewindFoodAt = 8;
    rewindCharges = 0;
    timeline = [];
    ghostTrail = [];
    ghostRemaining = 0;
    particles = [];
    pickupWaves = [];
    shakeRemaining = 0;
    shakeStrength = 0;
    cameraZoomRemaining = 0;
    cameraZoomAnchor = { x: gameCanvasSize / 2, y: gameCanvasSize / 2 };
    headPickupRemaining = 0;
    comboFlashRemaining = 0;
    foodSpawnEffects = [];
    newRecordRemaining = 0;
    portalTransit = null;
    levelUpRemaining = 0;
    biomeTransitionRemaining = 0;
    pickupMoodRemaining = 0;
    portalOpenRemaining = 0;
    nearMissRemaining = 0;
    nearMissCooldown = 0;
    riskFood = null;
    riskRemaining = 0;
    portals = [];
    portalRemaining = 0;
    foodHistory = [];
    loopSequence = [];
    loopIndex = 0;
    loopRemaining = 0;
    rhythmClock = 0;
    rhythmPerfectMessage = 0;
    focusCharges = 0;
    focusRemaining = 0;
    combo = 0;
    comboRemaining = 0;
    echoRemaining = 0;
    runPath = [{ x: snake[0].x, y: snake[0].y }];
    runStep = 0;
    challenge = createRoundChallenge();
    roundElapsed = 0;
    bestCombo = 0;
    bestScoreAtRoundStart = currentRunRecord.score;
    routeCombo = 0;
    routeLastColor = null;
    hazards = [];
    hazardWarningAt = runModifier === runModifiers.hunter ? 4 : 6;
    removePursuer();
    pursuerStepCounter = 0;
    nextUpgradeAt = 5;
    activeUpgrade = null;
    shieldCharges = 0;
    magnetRemaining = 0;
    doubleScoreCharges = 0;
    pendingUpgradeChoice = false;
    timeSinceStep = 0;
    displayedLevel = 1;
    currentStagePalette = biomes[0];
    currentBiomeIndex = 0;
    biomeLabel.textContent = currentStagePalette.name;
    boardWrap.classList.remove("is-combo", "is-new-record", "is-danger", "is-near-miss", "is-biome-change");
    scoreCard.classList.remove("is-new-record");
    levelPill.classList.remove("is-level-up");
    placeFood();
    challengeModeLabel.textContent = dailyRun
        ? "ЕЖЕДНЕВНЫЙ ЗАБЕГ · " + runModifier.name
        : "ИСПЫТАНИЕ · " + runModifier.name;
    updateDailyRunLabel();
    updateChainStatus();
    updateScore();
    updateThemePicker();
    updateFocus();
    updateRewindLife();
    updateRhythm();
    updateGameplayStatus();
    upgradePicker.hidden = true;
    boardWrap.classList.remove("is-time-loop");
}

function createRoundChallenge() {
    const challenges = [
        { id: "collect", target: 12, progress: 0, description: "Соберите 12 объектов", reward: "Награда: +5 очков и заряд фокуса" },
        { id: "rhythm", target: 4, progress: 0, description: "Поймайте 4 объекта в ритм", reward: "Награда: +5 очков и заряд фокуса" },
        { id: "survive", target: 45000, progress: 0, description: "Продержитесь 45 секунд", reward: "Награда: +5 очков и заряд фокуса" }
    ];
    if (dailyRun) return challenges[hashSeed(dailyDateKey + "-challenge") % challenges.length];
    return challenges[Math.floor(gameRandom() * challenges.length)];
}

function updateChallengeProgress(type, elapsed = 0) {
    if (!challenge || challenge.complete) return;
    if (challenge.id === type) {
        challenge.progress = Math.min(challenge.target, challenge.progress + (type === "survive" ? elapsed : 1));
    }
    if (challenge.progress >= challenge.target) {
        challenge.complete = true;
        score += 5;
        focusCharges = Math.min(3, focusCharges + 1);
        recordScoreIfNeeded();
        announce("Задание выполнено! +5 очков и заряд фокуса.");
        updateScore();
        updateFocus();
    }
    updateGameplayStatus();
}

function tileDistance(first, second) {
    const horizontal = Math.abs(first.x - second.x);
    const vertical = Math.abs(first.y - second.y);
    return Math.min(horizontal, tileCount - horizontal) + Math.min(vertical, tileCount - vertical);
}

function updateGameplayStatus() {
    if (challenge) {
        setText(challengeProgress, challenge.complete
            ? "ГОТОВО"
            : challenge.id === "survive"
                ? Math.floor(challenge.progress / 1000) + "/" + Math.ceil(challenge.target / 1000) + "с"
                : Math.floor(challenge.progress) + "/" + challenge.target);
        setText(challengeDescription, challenge.complete ? challenge.reward : challenge.description);
        challengeBar.style.width = Math.min(100, challenge.progress / challenge.target * 100) + "%";
    }
    setText(routeComboStatus, "×" + routeCombo);
    portalControl.hidden = portals.length !== 2;
    portalControl.classList.toggle("is-active", portalActive);
    portalControl.setAttribute("aria-pressed", String(portalActive));
    setText(portalControl.querySelector("strong"), portalActive ? "ЗАКРЫТЬ ПОРТАЛЫ" : "ВКЛЮЧИТЬ ПОРТАЛЫ");
    setText(routeComboDescription, "Подберите 3 разных цвета подряд для +2 очков");
    [...routeComboDots.children].forEach((dot, index) => {
        dot.classList.toggle("is-lit", index < Math.min(routeCombo, 3));
    });
    const powers = [];
    if (shieldCharges > 0) powers.push("ЩИТ ×" + shieldCharges);
    if (phaseCharges > 0) powers.push("ФАЗА ×" + phaseCharges);
    if (magnetRemaining > 0) powers.push("МАГНИТ " + Math.ceil(magnetRemaining / 1000) + "с");
    if (stasisRemaining > 0) powers.push("СТАЗИС " + Math.ceil(stasisRemaining / 1000) + "с");
    if (doubleScoreCharges > 0) powers.push("×2 · " + doubleScoreCharges);
    if (echoBoostCharges > 0) powers.push("ЭХО · " + echoBoostCharges);
    if (rhythmBoostRemaining > 0) powers.push("МЕТРОНОМ " + Math.ceil(rhythmBoostRemaining / 1000) + "с");
    const power = powers.length ? powers.slice(0, 2).join(" · ") : "УСИЛЕНИЕ: НЕТ";
    const hunter = huntRemaining > 0 ? "ПОГОНЯ " + Math.ceil(huntRemaining / 1000) + "с"
        : pursuer ? "ОХОТНИК АКТИВЕН" : "ОХОТНИК: " + Math.max(0, 8 - foodCount) + " ДО ПОЯВЛЕНИЯ";
    setText(worldStatusText, mechanicUnlocked("pursuer") ? power + " · " + hunter : power);
    setText(hudPower, huntRemaining > 0 ? "ПОГОНЯ " + Math.ceil(huntRemaining / 1000) + "с"
        : upgradeTokens.length ? "ВЫБЕРИТЕ УСИЛЕНИЕ" : power === "УСИЛЕНИЕ: НЕТ" ? "" : power);
    hudPower.classList.toggle("is-call", upgradeTokens.length > 0 || huntRemaining > 0);
    boardWrap.classList.toggle("is-hunt", huntRemaining > 0);
    const hunterNear = pursuerSegments && pursuerSegments.some(segment => tileDistance(segment, snake[0]) <= 5);
    boardWrap.classList.toggle("is-danger", hazards.some(hazard => hazard.state === "warning") || hunterNear);
}

function updateChainStatus() {
    const objective = chainObjectives[chainIndex];
    chainProgress.textContent = "ЭТАП " + (chainIndex + 1) + "/" + chainObjectives.length;
    chainDescription.textContent = objective.description + " · " + chainCount + "/" + objective.target;
    chainBar.style.width = Math.min(100, chainCount / objective.target * 100) + "%";
}

function advanceObjectiveChain(type, perfectBeat) {
    const objective = chainObjectives[chainIndex];
    const completed = objective.id === "collect"
        || (objective.id === "rhythm" && perfectBeat)
        || (objective.id === "risk" && type === "risk");
    if (!completed) return false;
    chainCount++;
    if (chainCount < objective.target) {
        updateChainStatus();
        return false;
    }
    chainIndex = (chainIndex + 1) % chainObjectives.length;
    chainCount = 0;
    score += 2;
    focusCharges = Math.min(3, focusCharges + 1);
    updateChainStatus();
    recordScoreIfNeeded();
    return true;
}

function togglePortals() {
    if (gameState !== "running" || portals.length !== 2) return;
    portalActive = !portalActive;
    if (!portalActive) {
        portalLastIndex = -1;
        portalRouteRemaining = 0;
    }
    updateGameplayStatus();
    announce(portalActive ? "Порталы активированы. Пройдите через пару для бонуса." : "Порталы выключены.");
}

const upgradeTokenLifetime = 9000;
// Пул усилений: каждый раз предлагаются три случайных из доступных.
const upgradeDefs = {
    shield: { name: "ЩИТ", label: "ЩИТ", symbol: "◆", color: "#56dcff",
        description: "Один раз защитит от ловушки, стены или охотника",
        message: "Щит заряжен: он защитит от одного столкновения с опасностью.",
        apply: () => { shieldCharges++; } },
    magnet: { name: "МАГНИТ", label: "МАГНИТ", symbol: "∩", color: "#ff5ac4",
        description: "Притягивает еду 10 секунд",
        message: "Магнит активен на 10 секунд.",
        apply: () => { magnetRemaining = 10000; } },
    double: { name: "×2 ОЧКИ", label: "×2", symbol: "×2", color: "#ffc94d",
        description: "Удваивает очки за 5 подборов",
        message: "Следующие 5 подборов принесут двойные очки.",
        apply: () => { doubleScoreCharges += 5; } },
    phase: { name: "ФАЗА", label: "ФАЗА", symbol: "◌", color: "#a88bff",
        description: "Один раз пройдёте сквозь собственный хвост",
        message: "Фаза заряжена: одно столкновение с хвостом пройдёт насквозь.",
        apply: () => { phaseCharges++; } },
    stasis: { name: "СТАЗИС", label: "СТАЗИС", symbol: "II", color: "#8fd3ff",
        description: "Охотник замирает на 8 секунд",
        message: "Стазис: охотник замер на 8 секунд.",
        available: () => Boolean(pursuer),
        apply: () => { stasisRemaining = 8000; } },
    echoRain: { name: "ЭХО-ДОЖДЬ", label: "ЭХО", symbol: "+3", color: "#6ca9ff",
        description: "Следующие 3 точки дают по +3",
        message: "Эхо-дождь: следующие три точки принесут по +3.",
        apply: () => { echoBoostCharges = 3; } },
    clarity: { name: "ЯСНОСТЬ", label: "ЯСНОСТЬ", symbol: "◎", color: "#c2ff00",
        description: "Полный заряд «Фокуса»",
        message: "Ясность: «Фокус» заряжен полностью.",
        available: () => focusCharges < 3,
        apply: () => { focusCharges = 3; updateFocus(); } },
    trim: { name: "ЛЁГКОСТЬ", label: "−5", symbol: "−5", color: "#ff9c5a",
        description: "Змейка короче на 5 сегментов",
        message: "Лёгкость: змейка стала короче на пять сегментов.",
        available: () => snake.length >= 9,
        apply: () => { snake.splice(Math.max(3, snake.length - 5)); } },
    metronome: { name: "МЕТРОНОМ", label: "РИТМ", symbol: "♪", color: "#f2f2fa",
        description: "Окно ритма вдвое шире на 20 секунд",
        message: "Метроном: окно ритма расширено на 20 секунд.",
        apply: () => { rhythmBoostRemaining = 20000; } },
    chrono: { name: "ХРОНО", label: "ХРОНО", symbol: "↺", color: "#dabaff",
        description: "Одна отмотка времени при столкновении",
        message: "Хроно: одна отмотка времени готова.",
        available: () => mechanicUnlocked("chrono") && rewindCharges === 0,
        apply: () => { rewindCharges = 1; nextRewindFoodAt = foodCount + 8; updateRewindLife(); } }
};

function pickUpgradeOffer() {
    const pool = Object.keys(upgradeDefs).filter(id => !upgradeDefs[id].available || upgradeDefs[id].available());
    for (let index = pool.length - 1; index > 0; index--) {
        const other = Math.floor(gameRandom() * (index + 1));
        [pool[index], pool[other]] = [pool[other], pool[index]];
    }
    return pool.slice(0, 3);
}

function applyUpgrade(upgrade) {
    const def = upgradeDefs[upgrade];
    if (!def) return;
    activeUpgrade = upgrade;
    def.apply();
    announce(def.message);
    updateScore();
}

function chooseUpgrade(upgrade) {
    if (gameState !== "upgrade") return;
    applyUpgrade(upgrade);
    gameState = "running";
    duckSoundtrack(false);
    startSoundtrack();
    upgradePicker.hidden = true;
    overlay.classList.add("is-hidden");
    beginResumeCountdown(800);
    updateControls();
    updateGameplayStatus();
    draw();
}

// Усиления без остановки игры: три жетона появляются на поле неподалёку от головы.
function spawnUpgradeTokens() {
    upgradeTokens = [];
    const offer = pickUpgradeOffer();
    if (offer.length < 3) return false;
    const head = snake[0];
    const near = [];
    const far = [];
    for (let y = 0; y < tileCount; y++) {
        for (let x = 0; x < tileCount; x++) {
            if (!isTileAvailable(x, y)) continue;
            const distance = tileDistance({ x, y }, head);
            if (distance >= 3 && distance <= 8) near.push({ x, y });
            else if (distance > 8) far.push({ x, y });
        }
    }
    const shuffle = list => {
        for (let index = list.length - 1; index > 0; index--) {
            const other = Math.floor(gameRandom() * (index + 1));
            [list[index], list[other]] = [list[other], list[index]];
        }
        return list;
    };
    const picked = [];
    for (const tile of [...shuffle(near), ...shuffle(far)]) {
        if (picked.every(other => tileDistance(other, tile) >= 3)) picked.push(tile);
        if (picked.length === 3) break;
    }
    if (picked.length < 3) return false;
    upgradeTokens = picked.map((tile, index) => ({ ...tile, type: offer[index] }));
    upgradeTokensRemaining = upgradeTokenLifetime;
    upgradeTokens.forEach(token => emitPickupWave(token.x, token.y, upgradeDefs[token.type].color));
    announce("Усиления на поле: " + offer.map(id => upgradeDefs[id].name.toLowerCase()).join(", ") + ". Заберите одно.");
    showContextTip("upgradeField");
    return true;
}

function collectUpgradeToken(token) {
    const color = upgradeDefs[token.type].color;
    upgradeTokens = [];
    upgradeTokensRemaining = 0;
    applyUpgrade(token.type);
    emitPickupWave(token.x, token.y, color);
    emitParticles(token.x * gridSize + gridSize / 2, token.y * gridSize + gridSize / 2, color, 20, upgradeDefs[token.type].name);
    triggerImpact(3, 170);
    playSound("chronoPickup");
    updateGameplayStatus();
}

// Сброс хвоста: половина змейки превращается в очки, поток обнуляется.
const tailCutMinLength = 8;
function tailCutValue() {
    const cut = Math.floor(snake.length / 2);
    return { cut, points: Math.floor(cut / 2) };
}

function updateTailCut() {
    if (!snake) return;
    const ready = gameState === "running" && resumeCountdown === 0 && mechanicUnlocked("tailCut") && snake.length >= tailCutMinLength;
    tailCutButton.disabled = !ready;
    tailCutLabel.textContent = snake.length >= tailCutMinLength
        ? "Сбросить хвост · +" + tailCutValue().points
        : "Сброс хвоста · от " + tailCutMinLength + " сегментов";
    if (ready) showContextTip("tailCut");
}

function cutTail() {
    if (gameState !== "running" || resumeCountdown > 0 || !mechanicUnlocked("tailCut") || snake.length < tailCutMinLength) return;
    const { cut, points } = tailCutValue();
    const removed = snake.splice(snake.length - cut);
    removed.forEach((segment, index) => {
        if (index % 2 === 0) emitParticles(segment.x * gridSize + gridSize / 2, segment.y * gridSize + gridSize / 2, "#ff9c5a", 5);
    });
    score += points;
    combo = 0;
    comboRemaining = 0;
    emitParticles(snake[0].x * gridSize + gridSize / 2, snake[0].y * gridSize + gridSize / 2, "#ff9c5a", 10, "+" + points);
    triggerImpact(3, 170);
    playSound("riskPickup");
    recordScoreIfNeeded();
    updateScore();
    announce("Хвост сброшен: +" + points + " очков, поток обнулён.");
}

// Резонанс: повороты, сделанные в такт импульсу, копят бонус к очкам и слои в музыке.
function resonanceBonus() {
    return resonance >= 6 ? 2 : resonance >= 3 ? 1 : 0;
}

function registerTurnBeat() {
    if (!mechanicUnlocked("resonance") || (direction.x === 0 && direction.y === 0) || !isPerfectBeat()) return;
    const beatIndex = Math.floor(rhythmClock / rhythmBeatLength);
    if (beatIndex === resonanceBeatIndex) return;
    resonanceBeatIndex = beatIndex;
    const before = resonanceBonus();
    resonance = Math.min(8, resonance + 1);
    resonanceRemaining = 7000;
    playSound("beat");
    if (resonanceBonus() > before) {
        showContextTip("resonance");
        announce("Резонанс ×" + resonance + ": каждый подбор даёт +" + resonanceBonus() + ".");
        emitParticles(snake[0].x * gridSize + gridSize / 2, snake[0].y * gridSize + gridSize / 2, "#c2ff00", 10, "РЕЗОНАНС");
    }
    updateRhythm();
}

function rhythmWindow() {
    return runModifier.rhythmWindow * (rhythmBoostRemaining > 0 ? 2 : 1);
}

// Правила биомов: лёд, тьма и пульсирующие стены.
function biomeRule() {
    return mechanicUnlocked("biomeRules") ? biomes[currentBiomeIndex].kind : "garden";
}

function pulseWallsActive() {
    return pulseWalls.length > 0 && Math.floor(rhythmClock / rhythmBeatLength) % 2 === 1;
}

function generatePulseWalls() {
    const walls = [];
    for (let attempt = 0; attempt < 60 && walls.length < 12; attempt++) {
        const horizontal = gameRandom() < 0.5;
        const startX = Math.floor(gameRandom() * (tileCount - (horizontal ? 4 : 0)));
        const startY = Math.floor(gameRandom() * (tileCount - (horizontal ? 0 : 4)));
        const segment = [0, 1, 2, 3].map(offset => ({
            x: startX + (horizontal ? offset : 0),
            y: startY + (horizontal ? 0 : offset)
        }));
        const free = segment.every(tile => isTileAvailable(tile.x, tile.y)
            && tileDistance(tile, snake[0]) >= 5
            && walls.every(other => tileDistance(other, tile) >= 3));
        if (free) walls.push(...segment);
    }
    return walls;
}

function onBiomeChanged() {
    iceSlideUsed = false;
    const rule = biomeRule();
    pulseWalls = rule === "dusk" ? generatePulseWalls() : [];
    if (rule === "aurora") showContextTip("biomeAurora");
    else if (rule === "cosmos") showContextTip("biomeCosmos");
    else if (rule === "dusk") showContextTip("biomeDusk");
}

// Погоня: раз в несколько подборов охотник ускоряется на 20 секунд.
function startHunt() {
    huntRemaining = 20000;
    nextHuntAt = foodCount + 14;
    playSound("danger");
    showContextTip("hunt");
    announce("Погоня! Охотник ускорился на 20 секунд.");
}

function finishHunt() {
    huntRemaining = 0;
    score += 8;
    focusCharges = 3;
    emitParticles(snake[0].x * gridSize + gridSize / 2, snake[0].y * gridSize + gridSize / 2, "#ffc94d", 22, "+8 ВЫЖИЛИ");
    triggerImpact(4, 200);
    playSound("chronoPickup");
    recordScoreIfNeeded();
    updateScore();
    updateFocus();
    announce("Погоня окончена: +8 очков и полный фокус.");
}

// Гонка с призраком: счёт сверяется с рекордным забегом каждые 5 секунд.
function onPaceCheckpoint() {
    const index = runPace.length - 1;
    if (index >= ghostPace.length) {
        paceLead = null;
        updateScore();
        return;
    }
    paceLead = score - ghostPace[index];
    if (paceLead > 0 && (index + 1) % 3 === 0) {
        score += 2;
        paceLead += 2;
        emitParticles(snake[0].x * gridSize + gridSize / 2, snake[0].y * gridSize + gridSize / 2, "#56dcff", 12, "+2 ТЕМП");
        recordScoreIfNeeded();
        announce("Вы опережаете свой рекорд: +2 очка.");
    }
    updateScore();
}

// Серия ежедневных забегов.
const dailyStreakKey = storageKey + "-daily-streak";
function loadDailyStreak() {
    try {
        const stored = JSON.parse(localStorage.getItem(dailyStreakKey) || "null");
        if (stored && typeof stored.last === "string" && Number.isInteger(stored.count) && stored.count > 0) return stored;
    } catch (error) {
        console.warn("Не удалось загрузить серию ежедневных забегов.", error);
    }
    return { last: "", count: 0 };
}

function currentDailyStreak() {
    const streak = loadDailyStreak();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return streak.last === getLocalDateKey() || streak.last === getLocalDateKey(yesterday) ? streak.count : 0;
}

function registerDailyStreak() {
    const today = getLocalDateKey();
    const streak = loadDailyStreak();
    if (streak.last === today) return streak.count;
    const count = currentDailyStreak() + 1;
    try {
        localStorage.setItem(dailyStreakKey, JSON.stringify({ last: today, count }));
    } catch (error) {
        console.warn("Не удалось сохранить серию ежедневных забегов.", error);
    }
    return count;
}

function pluralDays(count) {
    const mod10 = count % 10;
    const mod100 = count % 100;
    if (mod10 === 1 && mod100 !== 11) return count + " день";
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return count + " дня";
    return count + " дней";
}

function shareResult() {
    if (!lastRunSummary) return;
    const summary = lastRunSummary;
    const lines = [
        "Змейка INFINITE — " + (summary.daily ? "ежедневный забег " + summary.date : "режим «" + summary.mode + "»"),
        "Очки: " + summary.score + " · лучшая серия ×" + summary.combo + " · время " + summary.time
    ];
    if (summary.streak > 1) lines.push("Дней подряд: " + summary.streak);
    if (/^https?:$/.test(location.protocol)) lines.push(location.origin + location.pathname);
    const text = lines.join("\n");
    const done = message => {
        summaryShareButton.classList.add("is-done");
        announce(message);
        window.setTimeout(() => summaryShareButton.classList.remove("is-done"), 1600);
    };
    const copy = () => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => done("Результат скопирован."), () => announce("Не удалось скопировать результат."));
        } else {
            const area = document.createElement("textarea");
            area.value = text;
            area.setAttribute("readonly", "");
            area.style.position = "fixed";
            area.style.opacity = "0";
            overlay.appendChild(area);
            area.select();
            const copied = document.execCommand("copy");
            area.remove();
            if (copied) done("Результат скопирован.");
            else announce("Не удалось скопировать результат.");
        }
    };
    if (navigator.share && isTouchDevice) {
        navigator.share({ text }).then(() => done("Результат отправлен."), error => {
            if (!error || error.name !== "AbortError") copy();
        });
    } else {
        copy();
    }
}

// Короткий отсчёт перед продолжением: змейка не срывается с места сразу после паузы.
function beginResumeCountdown(duration) {
    if (direction.x === 0 && direction.y === 0) return;
    resumeCountdown = duration;
    resumeCountLabel = 0;
    tickResumeCountdown(0);
}

function tickResumeCountdown(elapsed) {
    resumeCountdown = Math.max(0, resumeCountdown - elapsed);
    if (resumeCountdown === 0) {
        clearResumeCountdown();
        timeSinceStep = 0;
        return;
    }
    const label = Math.ceil(resumeCountdown / 400);
    if (label !== resumeCountLabel) {
        resumeCountLabel = label;
        resumeCount.textContent = String(label);
        resumeCount.hidden = false;
        resumeCount.classList.remove("is-tick");
        void resumeCount.offsetWidth;
        resumeCount.classList.add("is-tick");
    }
}

function clearResumeCountdown() {
    resumeCountdown = 0;
    resumeCountLabel = 0;
    resumeCount.hidden = true;
    updateTailCut();
}

// Выбор усиления с клавиатуры: ← щит, ↓ (или ↑) магнит, → ×2 очки; также 1 / 2 / 3.
const upgradeKeyCodes = {
    ArrowLeft: "shield", KeyA: "shield", Digit1: "shield", Numpad1: "shield",
    ArrowDown: "magnet", ArrowUp: "magnet", KeyS: "magnet", KeyW: "magnet", Digit2: "magnet", Numpad2: "magnet",
    ArrowRight: "double", KeyD: "double", Digit3: "double", Numpad3: "double"
};
const upgradeKeyGuard = 350;
let upgradeOpenedAt = 0;

function showUpgradeSelection() {
    gameState = "upgrade";
    upgradeOpenedAt = performance.now();
    duckSoundtrack(true);
    showOverlay("УСИЛЕНИЕ ДОСТУПНО", "Выберите силу", "Каждые пять подборов можно выбрать один бонус.", "Продолжить");
    const offer = pickUpgradeOffer();
    upgradeButtons.forEach((button, index) => {
        const def = upgradeDefs[offer[index]];
        button.hidden = !def;
        if (!def) return;
        button.dataset.upgrade = offer[index];
        button.style.setProperty("--glyph", def.color);
        button.innerHTML = '<span class="upgrade-glyph" aria-hidden="true">' + def.symbol + '</span>'
            + '<kbd class="upgrade-key" aria-hidden="true">' + ["←", "↓", "→"][index] + '</kbd>'
            + '<strong>' + def.name + '</strong><span>' + def.description + '</span>';
    });
    overlay.classList.add("is-upgrade");
    startButton.hidden = true;
    overlayHint.hidden = true;
    upgradePicker.hidden = false;
    updateControls();
}

function startGame() {
    if (gameState === "upgrade") return;
    if (gameState === "paused") {
        gameState = "running";
        beginResumeCountdown(1200);
    } else {
        resetRound();
        gameState = "running";
        announce("Игра началась. Выберите направление.");
        if (!dailyRun && !preferences.allMechanics && runTier > playerStats.tierSeen) {
            playerStats.tierSeen = runTier;
            playerStats.newsSeen = 2;
            savePlayerStats();
            showTip(tierTips[runTier], 9000);
        } else if (runTier === maxMechanicTier && playerStats.newsSeen !== 2) {
            playerStats.newsSeen = 2;
            savePlayerStats();
            showTip("Новое в игре: десять усилений, сброс хвоста, резонанс за повороты в такт, правила биомов и погоня.", 10000);
        }
    }
    runSetup.hidden = true;
    overlay.classList.remove("is-setup");
    overlay.classList.add("is-hidden");
    lastFrame = 0;
    timeSinceStep = 0;
    updateScore();
    updateFocus();
    updateRhythm();
    updateControls();
    startSoundtrack();
    draw();
}

function restartRound() {
    duckSoundtrack(false);
    stopSoundtrack();
    resizeCanvas();
    dailyRun = false;
    resetRound();
    gameState = "idle";
    updateSelectedModeSummary();
    showOverlay("ТИШЕ. ТОЧНЕЕ. ДАЛЬШЕ.", "Готовы\nначать?", "Собирайте точки и не теряйте себя на поворотах.", "Начать игру");
    runSetup.hidden = false;
    overlay.classList.add("is-setup");
    updateControls();
    updateFocus();
    updateRhythm();
    draw();
    announce("Новый раунд готов.");
}

function cancelRestartConfirmation() {
    const previousState = stateBeforeRestartConfirmation;
    stateBeforeRestartConfirmation = null;
    restartDialog.close();
    if (previousState === "running") {
        startGame();
        announce("Игра продолжается.");
    }
}

function startDailyRun() {
    if (gameState === "upgrade" || gameState === "paused") return;
    dailyRun = true;
    dailyDateKey = getLocalDateKey();
    selectedModifier = getDailyModifier(dailyDateKey);
    updateSelectedModeSummary();
    startGame();
}

function pauseGame() {
    if (gameState === "running") {
        gameState = "paused";
        flushRecordSaves();
        stopSoundtrack();
        showOverlay("ПЕРЕДЫШКА", "Пауза", "Когда будете готовы — продолжим с того же места.", "Продолжить");
        announce("Пауза.");
        updateFocus();
        updateRhythm();
    } else if (gameState === "paused") {
        startGame();
        announce("Игра продолжается.");
        updateRhythm();
    }
    updateControls();
    draw();
}

function endGame() {
    if (gameState === "over") return;
    gameState = "over";
    flushRecordSaves();
    window.clearTimeout(gameTipTimeout);
    gameTip.hidden = true;
    stopSoundtrack();
    if (dailyRun) {
        dailyRuns++;
        try {
            localStorage.setItem(storageKey + "-daily-runs", String(dailyRuns));
        } catch (error) {
            console.warn("Не удалось сохранить число ежедневных забегов.", error);
        }
    }
    const newlyUnlocked = checkAchievements();
    emitParticles(snake[0].x * gridSize + gridSize / 2, snake[0].y * gridSize + gridSize / 2, "#ff5470", 24, "СТОЛКНОВЕНИЕ");
    triggerImpact(5, 260);
    updateFocus();
    updateRhythm();
    showOverlay("ЭТО БЫЛО ХОРОШО", "Ещё круг?", "Ваш счёт — " + score + ". Каждый новый раунд начинается с чистого листа.", "Играть снова");
    summaryScore.textContent = String(score).padStart(2, "0");
    summaryRecord.textContent = String(currentRunRecord.score).padStart(2, "0");
    summaryPickups.textContent = String(foodCount);
    summaryCombo.textContent = "×" + bestCombo;
    const elapsedSeconds = Math.floor(roundElapsed / 1000);
    summaryTime.textContent = "ВРЕМЯ · " + String(Math.floor(elapsedSeconds / 60)).padStart(2, "0")
        + ":" + String(elapsedSeconds % 60).padStart(2, "0");
    summaryChallenge.textContent = (dailyRun ? "ЕЖЕДНЕВНЫЙ ЗАБЕГ · " : "ЗАДАНИЕ · ")
        + (challenge && challenge.complete ? "ВЫПОЛНЕНО" : "НЕ ВЫПОЛНЕНО")
        + (score > bestScoreAtRoundStart ? " · НОВЫЙ РЕКОРД" : "");
    summaryMedal.textContent = "ДОСТИЖЕНИЕ · " + (newlyUnlocked ? newlyUnlocked.title : "—");
    const nextTheme = snakeThemes.find(theme => theme.unlock > score);
    if (nextTheme) {
        const previousTheme = [...snakeThemes].reverse().find(theme => theme.unlock <= score);
        const previousUnlock = previousTheme ? previousTheme.unlock : 0;
        const progress = Math.round(((score - previousUnlock) / (nextTheme.unlock - previousUnlock)) * 100);
        summaryNextGoal.textContent = "ЕЩЁ " + (nextTheme.unlock - score) + " ОЧК. ДО ТЕМЫ «" + nextTheme.name.toUpperCase() + "»";
        summaryProgress.setAttribute("aria-valuenow", String(progress));
        summaryProgress.setAttribute("aria-valuetext", progress + "% до темы «" + nextTheme.name + "»");
        summaryProgressBar.style.width = progress + "%";
    } else {
        summaryNextGoal.textContent = "ВСЕ ТЕМЫ ОТКРЫТЫ — ВЫ СОЗДАЛИ СВОЮ ПАЛИТРУ.";
        summaryProgress.setAttribute("aria-valuenow", "100");
        summaryProgress.setAttribute("aria-valuetext", "Все темы открыты");
        summaryProgressBar.style.width = "100%";
    }
    if (score > 0 && score > bestScoreAtRoundStart && score >= currentRunRecord.score) {
        currentRunRecord.pace = runPace.concat([score]);
        saveCurrentRunRecord();
    }
    const streakCount = dailyRun ? registerDailyStreak() : 0;
    summaryStreak.hidden = streakCount < 1;
    summaryStreak.textContent = streakCount >= 1 ? "ЕЖЕДНЕВНЫЕ ЗАБЕГИ ПОДРЯД · " + pluralDays(streakCount).toUpperCase() : "";
    lastRunSummary = {
        daily: dailyRun,
        date: dailyDateKey.split("-").reverse().slice(0, 2).join("."),
        mode: runModifier.name.charAt(0) + runModifier.name.slice(1).toLowerCase(),
        score,
        combo: bestCombo,
        time: String(Math.floor(elapsedSeconds / 60)).padStart(2, "0") + ":" + String(elapsedSeconds % 60).padStart(2, "0"),
        streak: streakCount
    };
    updateDailyRunLabel();
    const tierBefore = playerStats.tier;
    const modeKey = Object.keys(runModifiers).find(key => runModifiers[key] === runModifier);
    playerStats.completed++;
    if (modeKey) playerStats.modes[modeKey] = (playerStats.modes[modeKey] || 0) + 1;
    if (!dailyRun && !preferences.allMechanics && foodCount >= 1 && playerStats.tier < maxMechanicTier) playerStats.tier++;
    savePlayerStats();
    renderPlayerStats();
    summaryUnlock.hidden = playerStats.tier === tierBefore;
    summaryUnlock.textContent = playerStats.tier > tierBefore ? "В СЛЕДУЮЩЕМ ЗАБЕГЕ ОТКРОЕТСЯ: " + tierNames[playerStats.tier] : "";
    roundSummary.hidden = false;
    resultActions.hidden = false;
    startButton.hidden = true;
    overlay.classList.add("is-results");
    announce("Игра окончена. Ваш счёт: " + score + ".");
    playSound("end");
    updateControls();
}

function updateRewindLife() {
    const hasCharge = rewindCharges > 0;
    rewindLife.classList.toggle("has-charge", hasCharge);
    rewindLifeStatus.textContent = hasCharge ? "1 ОТМОТКА · 8 ХОДОВ" : "НАЙДИТЕ ХРОНО-ОСКОЛОК";
}

function updateRhythm() {
    const phase = rhythmClock % rhythmBeatLength;
    const isRunning = gameState === "running";
    const inBeat = isRunning && phase < rhythmWindow();
    rhythmMeter.classList.toggle("is-resonant", isRunning && resonance >= 3);
    // transform вместо width: полоса двигается без пересчёта вёрстки.
    const progressShare = isRunning ? Math.round(phase / rhythmBeatLength * 500) / 500 : 0;
    if (rhythmProgress.__share !== progressShare) {
        rhythmProgress.__share = progressShare;
        rhythmProgress.style.transform = "scaleX(" + progressShare + ")";
    }
    rhythmMeter.classList.toggle("is-beat", inBeat);
    rhythmMeter.classList.toggle("is-perfect", rhythmPerfectMessage > 0);
    if (!isRunning) {
        setText(rhythmStatus, gameState === "paused" ? "ПАУЗА" : "СТАРТУЙТЕ ДЛЯ РИТМА");
    } else if (loopRemaining > 0) {
        setText(rhythmStatus, "ПЕТЛЯ " + Math.ceil(loopRemaining / 1000) + "с");
    } else if (rhythmPerfectMessage > 0) {
        setText(rhythmStatus, "В ТАКТЕ +1");
    } else {
        setText(rhythmStatus, resonance > 0
            ? "РЕЗОНАНС ×" + resonance + (resonanceBonus() ? " · +" + resonanceBonus() : "")
            : inBeat ? "СЕЙЧАС!" : "ЛОВИТЕ ИМПУЛЬС");
    }
}

function isPerfectBeat() {
    return rhythmClock % rhythmBeatLength < rhythmWindow();
}

function startTimeLoop() {
    if (foodHistory.length === 0) return;
    loopSequence = foodHistory.slice(-6).reverse().map(position => ({ ...position }));
    loopIndex = 0;
    loopRemaining = timeLoopLength;
    boardWrap.classList.add("is-time-loop");
    return true;
}

function createRiskFood() {
    const tile = randomEmptyTile();
    riskFood = tile ? { ...tile, type: "risk" } : null;
    if (riskFood) addFoodSpawnEffect(riskFood);
    riskRemaining = riskFood ? 5200 : 0;
    if (riskFood) showContextTip("risk");
}

function createPortals() {
    const first = randomEmptyTile();
    if (!first) return false;
    const candidates = [];
    for (let y = 0; y < tileCount; y++) {
        for (let x = 0; x < tileCount; x++) {
            const distance = Math.abs(x - first.x) + Math.abs(y - first.y);
            if (distance >= tileCount / 2 && isTileAvailable(x, y)) candidates.push({ x, y });
        }
    }
    const second = candidates[Math.floor(gameRandom() * candidates.length)];
    if (!second) return false;
    portals = [first, second];
    portalActive = true;
    portalRemaining = 10000;
    portalOpenRemaining = reducedMotionQuery.matches
        ? 0
        : visualDurations.portalOpen;
    showContextTip("portal");
    return true;
}

function createHazard() {
    if (hazards.length > 0) return;
    const tile = randomEmptyTile();
    if (!tile) return;
    hazards = [{ ...tile, state: "warning", remaining: 1800 }];
    hazardWarningAt += runModifier === runModifiers.hunter ? 4 : 6;
    announce("Опасная клетка отмечена. Успейте уйти!");
    showContextTip("hazard");
}

function createPursuer() {
    if (pursuer) return;
    let farthest = null;
    let maxDistance = -1;
    for (let y = 0; y < tileCount; y++) {
        for (let x = 0; x < tileCount; x++) {
            if (!isTileAvailable(x, y)) continue;
            const distance = Math.abs(x - snake[0].x) + Math.abs(y - snake[0].y);
            if (distance > maxDistance) {
                farthest = { x, y };
                maxDistance = distance;
            }
        }
    }
    pursuer = farthest;
    pursuerSegments = pursuer ? [{ ...pursuer }] : [];
    const targetLength = getPursuerLength();
    while (pursuerSegments.length < targetLength) {
        const tail = pursuerSegments[pursuerSegments.length - 1];
        const options = [
            { x: tail.x + 1, y: tail.y },
            { x: tail.x - 1, y: tail.y },
            { x: tail.x, y: tail.y + 1 },
            { x: tail.x, y: tail.y - 1 }
        ].filter(position => isTileAvailable(position.x, position.y)
            && !pursuerSegments.some(segment => segment.x === position.x && segment.y === position.y))
            .sort((a, b) => tileDistance(b, snake[0]) - tileDistance(a, snake[0]));
        if (!options.length) break;
        pursuerSegments.push(options[0]);
    }
    pursuerStepCounter = 0;
    if (pursuer) {
        announce("На поле появился медленный преследователь!");
        showContextTip("pursuer");
    }
}

function movePursuer() {
    if (!pursuer) return false;
    pursuerStepCounter++;
    if (pursuerStepCounter < (huntRemaining > 0 ? 2 : runModifier === runModifiers.hunter ? 3 : 4)) return false;
    pursuerStepCounter = 0;

    const options = [
        { x: pursuer.x + 1, y: pursuer.y },
        { x: pursuer.x - 1, y: pursuer.y },
        { x: pursuer.x, y: pursuer.y + 1 },
        { x: pursuer.x, y: pursuer.y - 1 }
    ].filter(position =>
        position.x >= 0 && position.x < tileCount
        && position.y >= 0 && position.y < tileCount
        && !hazards.some(hazard => hazard.x === position.x && hazard.y === position.y && hazard.state === "active")
        && !portals.some(portal => portal.x === position.x && portal.y === position.y)
        && !pursuerSegments.slice(0, -1).some(segment => segment.x === position.x && segment.y === position.y)
        && !snake.slice(1).some(segment => segment.x === position.x && segment.y === position.y)
    ).sort((a, b) =>
        Math.abs(a.x - snake[0].x) + Math.abs(a.y - snake[0].y)
        - Math.abs(b.x - snake[0].x) - Math.abs(b.y - snake[0].y)
    );

    if (options.length === 0) return false;
    pursuerSegments.unshift(options[0]);
    const targetLength = getPursuerLength();
    if (pursuerSegments.length > targetLength) pursuerSegments.pop();
    pursuer = pursuerSegments[0];
    return snake[0].x === pursuer.x && snake[0].y === pursuer.y;
}

function removePursuer() {
    pursuer = null;
    pursuerSegments = [];
}

function getPursuerLength() {
    return Math.min(tileCount - 1, Math.max(2, Math.floor(score / 5) + 2));
}

function updateMagnet() {
    if (magnetRemaining <= 0 || !food || food.type === "chrono") return;
    const distance = Math.abs(food.x - snake[0].x) + Math.abs(food.y - snake[0].y);
    if (distance > 5) return;

    const candidates = [
        { x: food.x + Math.sign(snake[0].x - food.x), y: food.y },
        { x: food.x, y: food.y + Math.sign(snake[0].y - food.y) }
    ].filter((position, index, list) =>
        (position.x !== food.x || position.y !== food.y)
        && list.findIndex(other => other.x === position.x && other.y === position.y) === index
        && isTileAvailable(position.x, position.y)
    ).sort((a, b) =>
        Math.abs(a.x - snake[0].x) + Math.abs(a.y - snake[0].y)
        - Math.abs(b.x - snake[0].x) - Math.abs(b.y - snake[0].y)
    );

    if (candidates.length) food = { ...food, ...candidates[0] };
}

function updateTimedMechanics(elapsed) {
    roundElapsed += elapsed;
    updateChallengeProgress("survive", elapsed);
    if (magnetRemaining > 0) {
        magnetRemaining = Math.max(0, magnetRemaining - elapsed);
        if (magnetRemaining === 0) activeUpgrade = null;
    }
    hazards = hazards.filter(hazard => {
        hazard.remaining -= elapsed;
        if (hazard.remaining <= 0) {
            if (hazard.state === "warning") {
                hazard.state = "active";
                hazard.remaining = 4800;
                announce("Ловушка активна! Не наступайте на красную клетку.");
                return true;
            }
            return false;
        }
        return true;
    });
    if (ghostRemaining > 0) {
        ghostRemaining = Math.max(0, ghostRemaining - elapsed);
        if (ghostRemaining === 0) ghostTrail = [];
    }
    while (roundElapsed >= (runPace.length + 1) * 5000 && runPace.length < 720) {
        runPace.push(score);
        onPaceCheckpoint();
    }
    if (stasisRemaining > 0) stasisRemaining = Math.max(0, stasisRemaining - elapsed);
    if (rhythmBoostRemaining > 0) rhythmBoostRemaining = Math.max(0, rhythmBoostRemaining - elapsed);
    if (resonanceRemaining > 0) {
        resonanceRemaining = Math.max(0, resonanceRemaining - elapsed);
        if (resonanceRemaining === 0) resonance = 0;
    }
    if (huntRemaining > 0) {
        huntRemaining = Math.max(0, huntRemaining - elapsed);
        if (huntRemaining === 0 || !pursuer) finishHunt();
    }
    if (upgradeTokensRemaining > 0) {
        upgradeTokensRemaining = Math.max(0, upgradeTokensRemaining - elapsed);
        if (upgradeTokensRemaining === 0) {
            upgradeTokens = [];
            announce("Усиления исчезли.");
        }
    }
    if (riskRemaining > 0) {
        riskRemaining = Math.max(0, riskRemaining - elapsed);
        if (riskRemaining === 0) {
            riskFood = null;
            announce("Риск-точка исчезла.");
        }
    }
    if (portalRemaining > 0) {
        portalRemaining = Math.max(0, portalRemaining - elapsed);
        if (portalRemaining === 0) {
            portals = [];
            portalOpenRemaining = 0;
            announce("Порталы закрылись.");
        }
    }
    if (portalRouteRemaining > 0) {
        portalRouteRemaining = Math.max(0, portalRouteRemaining - elapsed);
        if (portalRouteRemaining === 0) portalLastIndex = -1;
    }
    if (loopRemaining > 0) {
        loopRemaining = Math.max(0, loopRemaining - elapsed);
        if (loopRemaining === 0) {
            loopSequence = [];
            loopIndex = 0;
            if (food && food.type === "loop") food = { ...food, type: "normal" };
            boardWrap.classList.remove("is-time-loop");
        }
    }
    if (rhythmPerfectMessage > 0) rhythmPerfectMessage = Math.max(0, rhythmPerfectMessage - elapsed);
    // Таймеры в статусе показывают секунды — восьми обновлений в секунду достаточно.
    statusClock += elapsed;
    if (statusClock >= 120) {
        statusClock = 0;
        updateGameplayStatus();
    }
    updateRhythm();
}

function updateVisualEffects(elapsed) {
    if (shakeRemaining > 0) {
        shakeRemaining = Math.max(0, shakeRemaining - elapsed);
        if (shakeRemaining === 0) shakeStrength = 0;
    }
    if (cameraZoomRemaining > 0) {
        cameraZoomRemaining = Math.max(0, cameraZoomRemaining - elapsed);
    }
    if (headPickupRemaining > 0) headPickupRemaining = Math.max(0, headPickupRemaining - elapsed);
    if (pickupMoodRemaining > 0) pickupMoodRemaining = Math.max(0, pickupMoodRemaining - elapsed);
    if (portalOpenRemaining > 0) portalOpenRemaining = Math.max(0, portalOpenRemaining - elapsed);
    if (nearMissRemaining > 0) {
        nearMissRemaining = Math.max(0, nearMissRemaining - elapsed);
        if (nearMissRemaining === 0) boardWrap.classList.remove("is-near-miss");
    }
    if (nearMissCooldown > 0) nearMissCooldown = Math.max(0, nearMissCooldown - elapsed);
    if (biomeTransitionRemaining > 0) {
        biomeTransitionRemaining = Math.max(0, biomeTransitionRemaining - elapsed);
        if (biomeTransitionRemaining === 0) boardWrap.classList.remove("is-biome-change");
    }
    if (comboFlashRemaining > 0) {
        comboFlashRemaining = Math.max(0, comboFlashRemaining - elapsed);
        if (comboFlashRemaining === 0) boardWrap.classList.remove("is-combo");
    }
    if (newRecordRemaining > 0) {
        newRecordRemaining = Math.max(0, newRecordRemaining - elapsed);
        if (newRecordRemaining === 0) {
            boardWrap.classList.remove("is-new-record");
            scoreCard.classList.remove("is-new-record");
        }
    }
    if (levelUpRemaining > 0) {
        levelUpRemaining = Math.max(0, levelUpRemaining - elapsed);
        if (levelUpRemaining === 0) levelPill.classList.remove("is-level-up");
    }
    foodSpawnEffects = foodSpawnEffects.filter(effect => {
        effect.remaining = Math.max(0, effect.remaining - elapsed);
        return effect.remaining > 0;
    });
    if (portalTransit) {
        portalTransit.remaining = Math.max(0, portalTransit.remaining - elapsed);
        if (portalTransit.remaining === 0) portalTransit = null;
    }
    pickupWaves = pickupWaves.filter(wave => {
        wave.age += elapsed;
        return wave.age < wave.duration;
    });
    particles = particles.filter(particle => {
        particle.life -= elapsed;
        if (particle.life <= 0) return false;
        particle.x += particle.vx * elapsed;
        particle.y += particle.vy * elapsed;
        particle.vx *= Math.pow(0.985, elapsed / 16);
        particle.vy = particle.vy * Math.pow(0.985, elapsed / 16) + (particle.text ? 0 : 0.000035 * elapsed);
        return true;
    });
}

function resizeCanvas() {
    const displaySize = canvas.getBoundingClientRect().width;
    if (!displaySize) return;

    const pixelRatio = Math.min(Math.max(window.devicePixelRatio || 1, 1), 2);
    const pixelSize = Math.round(displaySize * pixelRatio);
    if (canvas.width !== pixelSize || canvas.height !== pixelSize) {
        canvas.width = pixelSize;
        canvas.height = pixelSize;
    }
    renderScale = pixelSize / gameCanvasSize;
    ctx.setTransform(renderScale, 0, 0, renderScale, 0, 0);
}

function emitPickupWave(x, y, color) {
    const reducedMotion = reducedMotionQuery.matches;
    const farthestCell = Math.max(
        Math.hypot(x, y),
        Math.hypot(tileCount - 1 - x, y),
        Math.hypot(x, tileCount - 1 - y),
        Math.hypot(tileCount - 1 - x, tileCount - 1 - y)
    );
    pickupWaves.push({
        x,
        y,
        color,
        age: 0,
        maxRadius: farthestCell,
        duration: reducedMotion ? 280 : Math.max(520, farthestCell * 52),
        reducedMotion
    });
}

function emitParticles(x, y, color, count = 14, label = "") {
    const reducedMotion = reducedMotionQuery.matches;
    const particleCount = reducedMotion ? Math.min(count, 5) : count;
    for (let index = 0; index < particleCount; index++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.035 + Math.random() * 0.13;
        particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 360 + Math.random() * 360,
            maxLife: 720,
            size: 1.5 + Math.random() * 2.8,
            color
        });
    }
    if (label) {
        particles.push({
            x,
            y: y - 10,
            vx: 0,
            vy: -0.035,
            life: 850,
            maxLife: 850,
            size: 12,
            color,
            text: label
        });
    }
}

function triggerImpact(strength = 3, duration = 180) {
    if (reducedMotionQuery.matches) return;
    shakeStrength = Math.max(shakeStrength, strength);
    shakeRemaining = Math.max(shakeRemaining, duration);
}

function triggerPickupZoom(x, y) {
    if (cameraZoomRemaining > 0 || reducedMotionQuery.matches) return;
    cameraZoomAnchor = {
        x: x * gridSize + gridSize / 2,
        y: y * gridSize + gridSize / 2
    };
    cameraZoomRemaining = pickupZoomDuration;
}

function triggerHeadPickup() {
    if (reducedMotionQuery.matches) return;
    headPickupRemaining = visualDurations.headPickup;
    pickupMoodRemaining = 850;
}

function triggerRouteCombo(color) {
    if (reducedMotionQuery.matches) return;
    comboFlashRemaining = visualDurations.comboFlash;
    boardWrap.style.setProperty("--combo-accent", color);
    boardWrap.classList.remove("is-combo");
    void boardWrap.offsetWidth;
    boardWrap.classList.add("is-combo");
}

function pickupColorForType(type) {
    if (type === "risk") return "#ff5470";
    if (type === "chrono") return "#a88bff";
    if (type === "echo") return "#56dcff";
    if (type === "loop") return "#6ca9ff";
    return "#ffc94d";
}

function triggerNewRecord() {
    if (newRecordRemaining > 0 || reducedMotionQuery.matches) return;
    newRecordRemaining = visualDurations.newRecord;
    boardWrap.classList.add("is-new-record");
    scoreCard.classList.add("is-new-record");
    const centerX = snake[0].x * gridSize + gridSize / 2;
    const centerY = snake[0].y * gridSize + gridSize / 2;
    const recordPalette = biomes[currentBiomeIndex];
    emitParticles(centerX, centerY, recordPalette.accent, 24);
}

function saveTimelineFrame() {
    timeline.push({
        snake: snake.map(segment => ({ ...segment })),
        direction: { ...direction },
        queuedDirection: { ...queuedDirection },
        food: food ? { ...food } : null,
        riskFood: riskFood ? { ...riskFood } : null,
        riskRemaining,
        portals: portals.map(portal => ({ ...portal })),
        portalRemaining,
        portalActive,
        portalLastIndex,
        portalRouteRemaining,
        score,
        foodCount,
        nextRewindFoodAt,
        foodHistory: foodHistory.map(position => ({ ...position })),
        loopSequence: loopSequence.map(position => ({ ...position })),
        loopIndex,
        loopRemaining,
        rhythmClock,
        rhythmPerfectMessage,
        focusCharges,
        focusRemaining,
        combo,
        comboRemaining,
        echoRemaining,
        runPath: runPath.map(position => ({ ...position })),
        runStep,
        challenge: { ...challenge },
        roundElapsed,
        routeCombo,
        routeLastColor,
        chainIndex,
        chainCount,
        riskPickups,
        portalRoutes,
        hazards: hazards.map(hazard => ({ ...hazard })),
        hazardWarningAt,
        pursuer: pursuer ? { ...pursuer } : null,
        pursuerSegments: (pursuerSegments || []).map(segment => ({ ...segment })),
        pursuerStepCounter,
        nextUpgradeAt,
        activeUpgrade,
        shieldCharges,
        magnetRemaining,
        doubleScoreCharges,
        upgradeTokens: upgradeTokens.map(token => ({ ...token })),
        upgradeTokensRemaining,
        phaseCharges,
        stasisRemaining,
        echoBoostCharges,
        rhythmBoostRemaining,
        resonance,
        resonanceRemaining,
        pulseWalls: pulseWalls.map(tile => ({ ...tile })),
        huntRemaining,
        nextHuntAt
    });
    if (timeline.length > timelineLimit) timeline.shift();
}

function rewindTime() {
    if (rewindCharges === 0 || timeline.length === 0) return false;

    const frame = timeline[0];
    const rewoundSteps = Math.max(1, timeline.length - 1);
    ghostTrail = timeline
        .slice(1)
        .map(savedFrame => savedFrame.snake[0])
        .filter(Boolean)
        .reverse()
        .map(position => ({ ...position }));
    ghostRemaining = 2200;
    rewindCharges--;
    snake = frame.snake.map(segment => ({ ...segment }));
    direction = { ...frame.direction };
    queuedDirection = { ...frame.queuedDirection };
    pendingDirection = null;
    food = frame.food ? { ...frame.food } : null;
    riskFood = frame.riskFood ? { ...frame.riskFood } : null;
    riskRemaining = frame.riskRemaining;
    portals = frame.portals.map(portal => ({ ...portal }));
    portalRemaining = frame.portalRemaining;
    portalActive = frame.portalActive;
    portalLastIndex = frame.portalLastIndex;
    portalRouteRemaining = frame.portalRouteRemaining;
    score = frame.score;
    foodCount = frame.foodCount;
    nextRewindFoodAt = Math.max(frame.nextRewindFoodAt, foodCount + 8);
    foodHistory = frame.foodHistory.map(position => ({ ...position }));
    loopSequence = frame.loopSequence.map(position => ({ ...position }));
    loopIndex = frame.loopIndex;
    loopRemaining = frame.loopRemaining;
    rhythmClock = frame.rhythmClock;
    rhythmPerfectMessage = frame.rhythmPerfectMessage;
    focusCharges = frame.focusCharges;
    focusRemaining = frame.focusRemaining;
    combo = frame.combo;
    comboRemaining = frame.comboRemaining;
    echoRemaining = frame.echoRemaining;
    runPath = frame.runPath.map(position => ({ ...position }));
    runStep = frame.runStep;
    challenge = { ...frame.challenge };
    roundElapsed = frame.roundElapsed;
    routeCombo = frame.routeCombo;
    routeLastColor = frame.routeLastColor;
    chainIndex = frame.chainIndex;
    chainCount = frame.chainCount;
    riskPickups = frame.riskPickups;
    portalRoutes = frame.portalRoutes;
    hazards = frame.hazards.map(hazard => ({ ...hazard }));
    hazardWarningAt = frame.hazardWarningAt;
    pursuerSegments = frame.pursuerSegments
        ? frame.pursuerSegments.map(segment => ({ ...segment }))
        : frame.pursuer ? [{ ...frame.pursuer }] : [];
    pursuer = pursuerSegments[0] || (frame.pursuer ? { ...frame.pursuer } : null);
    pursuerStepCounter = frame.pursuerStepCounter;
    nextUpgradeAt = frame.nextUpgradeAt;
    activeUpgrade = frame.activeUpgrade;
    shieldCharges = frame.shieldCharges;
    magnetRemaining = frame.magnetRemaining;
    doubleScoreCharges = frame.doubleScoreCharges;
    upgradeTokens = (frame.upgradeTokens || []).map(token => ({ ...token }));
    upgradeTokensRemaining = frame.upgradeTokensRemaining || 0;
    phaseCharges = frame.phaseCharges || 0;
    stasisRemaining = frame.stasisRemaining || 0;
    echoBoostCharges = frame.echoBoostCharges || 0;
    rhythmBoostRemaining = frame.rhythmBoostRemaining || 0;
    resonance = frame.resonance || 0;
    resonanceRemaining = frame.resonanceRemaining || 0;
    pulseWalls = (frame.pulseWalls || []).map(tile => ({ ...tile }));
    huntRemaining = frame.huntRemaining || 0;
    nextHuntAt = frame.nextHuntAt || foodCount + 14;
    iceSlideUsed = false;

    if (food && food.type === "chrono") {
        food = { ...food, type: "normal" };
        echoRemaining = 0;
    }
    if (riskFood && snake.some(segment => segment.x === riskFood.x && segment.y === riskFood.y)) {
        riskFood = null;
        riskRemaining = 0;
    }

    gameState = "running";
    timeSinceStep = 0;
    timeline = [];
    saveTimelineFrame();
    updateScore();
    updateFocus();
    updateRewindLife();
    updateChainStatus();
    updateControls();
    boardWrap.classList.toggle("is-time-loop", loopRemaining > 0);
    showRewindEffect(rewoundSteps);
    emitParticles(snake[0].x * gridSize + gridSize / 2, snake[0].y * gridSize + gridSize / 2, "#a88bff", 26, "ОТМОТКА");
    triggerImpact(5, 250);
    announce("Время перемотано на " + rewoundSteps + " ходов. Жизнь использована.");
    return true;
}

function showRewindEffect(steps) {
    rewindEffect.querySelector("strong").textContent = steps + " ХОДОВ НАЗАД";
    rewindEffect.classList.remove("is-active");
    void rewindEffect.offsetWidth;
    rewindEffect.classList.add("is-active");
}

function showOverlay(kicker, title, copy, buttonLabel) {
    clearResumeCountdown();
    resultActions.hidden = true;
    overlay.classList.remove("is-upgrade");
    overlay.classList.remove("is-results");
    overlay.classList.remove("is-setup");
    roundSummary.hidden = true;
    runSetup.hidden = true;
    overlayKicker.textContent = kicker;
    overlayTitle.textContent = title;
    overlayCopy.textContent = copy;
    startButtonLabel.textContent = buttonLabel;
    startButton.hidden = false;
    overlayHint.hidden = false;
    upgradePicker.hidden = true;
    overlay.classList.remove("is-hidden");
}

function updateControls() {
    document.body.classList.toggle("is-running", gameState === "running");
    updateTailCut();
    pauseButton.disabled = gameState !== "running" && gameState !== "paused";
    pauseButton.setAttribute("aria-label", gameState === "paused" ? "Продолжить игру" : "Пауза");
    pauseLabel.textContent = gameState === "paused" ? "Продолжить" : "Пауза";
    pauseIcon.querySelector("use").setAttribute("href", gameState === "paused" ? "#icon-play" : "#icon-pause");
}

function updateFocus() {
    const active = focusRemaining > 0;
    boardWrap.classList.toggle("is-focused", active);
    focusButton.disabled = gameState !== "running" || focusCharges === 0 || active;
    focusButton.classList.toggle("is-active", active);
    focusButtonLabel.textContent = active ? "Фокус активен" : "Фокус";
    focusHint.textContent = active
        ? "ВРЕМЯ ЗАМЕДЛЕНО"
        : focusCharges === 0
            ? "СОБИРАЙТЕ ТОЧКИ, ЧТОБЫ ЗАРЯДИТЬ ФОКУС"
            : "ЗАРЯД " + focusCharges + "/3 · ЗАМЕДЛЕНИЕ НА 3,5 СЕКУНДЫ";
    focusChargesElements.forEach((element, index) => {
        element.classList.toggle("is-charged", index < focusCharges);
    });
    hudFocusDots.forEach((dot, index) => {
        dot.classList.toggle("is-charged", index < focusCharges);
    });
}

function activateFocus() {
    if (gameState !== "running" || focusCharges === 0 || focusRemaining > 0) return;
    focusCharges--;
    focusRemaining = 3500;
    updateFocus();
    announce("Фокус активирован. Время замедлено.");
    showContextTip("focus");
    playSound("pickup");
}

function announce(message) {
    gameStatus.textContent = message;
}

function updateScore() {
    scoreValue.textContent = String(score).padStart(2, "0");
    hudScore.textContent = String(score).padStart(2, "0");
    hudFlow.textContent = "×" + combo;
    hudFlow.classList.toggle("is-hot", combo >= 3);
    bestValue.textContent = String(currentRunRecord.score).padStart(2, "0");
    dailyBestScore.textContent = "РЕКОРД · " + String(loadDailyRecord(getLocalDateKey()).score).padStart(2, "0");
    const level = Math.floor(score / 5) + 1;
    levelLabel.textContent = "УРОВЕНЬ " + String(level).padStart(2, "0");
    if (level !== displayedLevel) {
        const leveledUp = level > displayedLevel;
        displayedLevel = level;
        if (leveledUp) {
            levelUpRemaining = visualDurations.levelUp;
            levelPill.classList.remove("is-level-up");
            void levelPill.offsetWidth;
            levelPill.classList.add("is-level-up");
        } else {
            levelUpRemaining = 0;
            levelPill.classList.remove("is-level-up");
        }
    }
    const nextBiomeIndex = Math.floor((level - 1) / 4) % biomes.length;
    if (nextBiomeIndex !== currentBiomeIndex) {
        currentBiomeIndex = nextBiomeIndex;
        biomeTransitionRemaining = reducedMotionQuery.matches
            ? 0
            : visualDurations.levelUp;
        biomeLabel.textContent = biomes[currentBiomeIndex].name;
        onBiomeChanged();
        boardWrap.classList.remove("is-biome-change");
        if (biomeTransitionRemaining > 0) {
            void boardWrap.offsetWidth;
            boardWrap.classList.add("is-biome-change");
        }
    }
    currentStagePalette = biomes[currentBiomeIndex];
    boardWrap.style.setProperty("--stage-accent", currentStagePalette.accent);
    boardWrap.style.setProperty("--stage-wash", currentStagePalette.wash);
    boardWrap.style.setProperty("--stage-grid", currentStagePalette.grid);
    boardWrap.style.setProperty("--stage-major-grid", currentStagePalette.majorGrid);
    streakValue.textContent = "×" + combo;
    document.body.classList.toggle("is-awaiting-move", gameState === "running" && direction.x === 0 && direction.y === 0);
    const racing = gameState === "running" && ghostPace.length > 0 && paceLead !== null;
    hudPace.textContent = racing ? (paceLead > 0 ? "+" + paceLead : paceLead < 0 ? "−" + Math.abs(paceLead) : "=") : "";
    hudPace.classList.toggle("is-behind", racing && paceLead < 0);
    updateTailCut();
    scoreCaption.textContent = racing
        ? (paceLead > 0 ? "Впереди своего рекорда на " + paceLead
            : paceLead < 0 ? "Позади своего рекорда на " + Math.abs(paceLead)
                : "Вровень со своим рекордом")
        : combo >= 3
        ? "Поток ×" + combo + " — серия приносит бонусы"
        : score > 0
            ? "Отличный темп. Так держать."
        : gameState === "running" && direction.x === 0 && direction.y === 0
            ? (preferences.swipe && isTouchDevice ? "Проведите по полю, чтобы начать движение" : "Выберите направление для первого хода")
            : "Каждый шаг имеет значение";
    updateThemePicker();
}

function placeFood(type = "normal") {
    let tile = null;
    if (type === "normal" && loopRemaining > 0 && loopSequence.length > 0) {
        for (let attempt = 0; attempt < loopSequence.length; attempt++) {
            const candidate = loopSequence[loopIndex % loopSequence.length];
            loopIndex++;
            if (isTileAvailable(candidate.x, candidate.y)) {
                tile = { ...candidate };
                type = "loop";
                break;
            }
        }
    }
    tile = tile || randomEmptyTile();
    food = tile ? { ...tile, type } : null;
    if (food) addFoodSpawnEffect(food);
    echoRemaining = type === "echo" ? 7000 : 0;
}

function addFoodSpawnEffect(targetFood) {
    if (reducedMotionQuery.matches) return;
    foodSpawnEffects.push({
        x: targetFood.x,
        y: targetFood.y,
        type: targetFood.type,
        remaining: visualDurations.foodSpawn
    });
}

function isTileAvailable(x, y) {
    return x >= 0 && x < tileCount && y >= 0 && y < tileCount
        && !snake.some(segment => segment.x === x && segment.y === y)
        && (!food || food.x !== x || food.y !== y)
        && (!riskFood || riskFood.x !== x || riskFood.y !== y)
        && !portals.some(portal => portal.x === x && portal.y === y)
        && !hazards.some(hazard => hazard.x === x && hazard.y === y)
        && !upgradeTokens.some(token => token.x === x && token.y === y)
        && !pulseWalls.some(tile => tile.x === x && tile.y === y)
        && !(pursuerSegments || []).some(segment => segment.x === x && segment.y === y);
}

function randomEmptyTile() {
    const emptyTiles = [];
    for (let y = 0; y < tileCount; y++) {
        for (let x = 0; x < tileCount; x++) {
            if (isTileAvailable(x, y)) emptyTiles.push({ x, y });
        }
    }
    return emptyTiles[Math.floor(gameRandom() * emptyTiles.length)] || null;
}

function nextFoodType() {
    if (mechanicUnlocked("chrono") && rewindCharges === 0 && foodCount >= nextRewindFoodAt) return "chrono";
    if (echoBoostCharges > 0) {
        echoBoostCharges--;
        return "echo";
    }
    return mechanicUnlocked("echo") && foodCount % 5 === 4 ? "echo" : "normal";
}

function setDirection(nextDirection) {
    if (gameState === "idle" || gameState === "over") {
        startGame();
    }
    if (gameState !== "running") return false;
    const turnQueued = queuedDirection.x !== direction.x || queuedDirection.y !== direction.y;
    if (turnQueued) {
        // Второй быстрый поворот (например, разворот двумя свайпами) запоминается на следующий ход.
        if (nextDirection.x === queuedDirection.x && nextDirection.y === queuedDirection.y) return false;
        if (nextDirection.x === -queuedDirection.x && nextDirection.y === -queuedDirection.y) return false;
        pendingDirection = nextDirection;
        registerTurnBeat();
        return true;
    }
    if (nextDirection.x === -direction.x && nextDirection.y === -direction.y) return false;
    if (nextDirection.x === direction.x && nextDirection.y === direction.y) return false;
    queuedDirection = nextDirection;
    registerTurnBeat();
    return true;
}

function step() {
    const waitingForFirstMove = direction.x === 0 && direction.y === 0;
    const turning = !waitingForFirstMove && (queuedDirection.x !== direction.x || queuedDirection.y !== direction.y);
    if (turning && biomeRule() === "aurora" && !iceSlideUsed) {
        // Лёд: перед поворотом змейка проскальзывает ещё одну клетку.
        iceSlideUsed = true;
    } else {
        iceSlideUsed = false;
        direction = queuedDirection;
        if (pendingDirection) {
            queuedDirection = pendingDirection;
            pendingDirection = null;
        }
    }
    if (direction.x === 0 && direction.y === 0) return;
    if (waitingForFirstMove) updateScore();
    let head = {
        x: (snake[0].x + direction.x + tileCount) % tileCount,
        y: (snake[0].y + direction.y + tileCount) % tileCount
    };
    const enteredPortal = portalActive ? portals.find(portal => portal.x === head.x && portal.y === head.y) : null;
    const enteredPortalIndex = enteredPortal ? portals.indexOf(enteredPortal) : -1;
    const portalExit = enteredPortal ? portals.find(portal => portal !== enteredPortal) : null;
    const completedPortalRoute = Boolean(enteredPortal && portalLastIndex !== enteredPortalIndex && portalRouteRemaining > 0);
    if (enteredPortal) {
        if (portalExit) head = { x: portalExit.x, y: portalExit.y };
        if (completedPortalRoute) {
            portalLastIndex = -1;
            portalRouteRemaining = 0;
        } else {
            portalLastIndex = enteredPortalIndex;
            portalRouteRemaining = 7000;
        }
    }

    const eatingPrimary = food && head.x === food.x && head.y === food.y;
    const eatingRisk = riskFood && head.x === riskFood.x && head.y === riskFood.y;
    const eating = eatingPrimary || eatingRisk;
    const bodyToCheck = eating ? snake : snake.slice(0, -1);
    const hitSnake = bodyToCheck.some(segment => segment.x === head.x && segment.y === head.y);
    const hitHazard = hazards.some(hazard => hazard.state === "active" && hazard.x === head.x && hazard.y === head.y)
        || (pulseWallsActive() && pulseWalls.some(tile => tile.x === head.x && tile.y === head.y));
    const hitPursuer = (pursuerSegments || []).some(segment => segment.x === head.x && segment.y === head.y);
    if (!hitHazard && !hitPursuer && nearMissCooldown === 0) {
        const closeToHazard = hazards.some(hazard => hazard.state === "active"
            && tileDistance(hazard, head) <= 2);
        const closeToPursuer = (pursuerSegments || []).some(segment => tileDistance(segment, head) <= 2);
        if (closeToHazard || closeToPursuer) {
            nearMissRemaining = visualDurations.nearMiss;
            nearMissCooldown = 1800;
            boardWrap.classList.add("is-near-miss");
            triggerImpact(1.2, 100);
        }
    }
    if ((hitHazard || hitPursuer) && shieldCharges > 0) {
        shieldCharges--;
        if (hitHazard) hazards = hazards.filter(hazard => hazard.x !== head.x || hazard.y !== head.y);
        if (hitPursuer) removePursuer();
        announce("Щит поглотил столкновение с опасностью.");
        updateGameplayStatus();
    } else if (hitHazard || hitPursuer) {
        if (rewindTime()) return true;
        endGame();
        return false;
    }

    if (hitSnake && phaseCharges > 0) {
        phaseCharges--;
        emitParticles(head.x * gridSize + gridSize / 2, head.y * gridSize + gridSize / 2, "#a88bff", 14, "ФАЗА");
        announce("Фаза: змейка прошла сквозь собственный хвост.");
    } else if (hitSnake) {
        if (rewindTime()) return true;
        endGame();
        return false;
    }

    snake.unshift(head);
    runPath.push({ ...head });
    runStep++;
    if (runPath.length > 1200) {
        runPath.shift();
        runStep = Math.min(runStep, 1200);
    }
    if (stasisRemaining <= 0 && movePursuer()) {
        if (shieldCharges > 0) {
            shieldCharges--;
            removePursuer();
            announce("Щит поглотил столкновение с охотником.");
            updateGameplayStatus();
        } else {
            if (rewindTime()) return true;
            endGame();
            return false;
        }
    }
    const collectedToken = upgradeTokens.find(token => token.x === head.x && token.y === head.y);
    if (collectedToken) collectUpgradeToken(collectedToken);
    if (completedPortalRoute) {
        score += 4;
        focusCharges = Math.min(3, focusCharges + 1);
        portalRoutes++;
        recordScoreIfNeeded();
        updateScore();
        updateFocus();
        checkAchievements();
    }
    if (eating) {
        const caughtEcho = eatingPrimary && food.type === "echo";
        const caughtChrono = eatingPrimary && food.type === "chrono";
        const caughtRisk = eatingRisk;
        const caughtLoopFood = eatingPrimary && food.type === "loop";
        const perfectBeat = isPerfectBeat();
        const comboWasActive = comboRemaining > 0;
        combo = comboWasActive ? combo + 1 : 1;
        bestCombo = Math.max(bestCombo, combo);
        comboRemaining = 5000;
        const streakBonus = combo >= 3 && combo % 3 === 0 ? 1 : 0;
        const basePointValue = caughtRisk ? (runModifier === runModifiers.hunter ? 6 : 4) : caughtEcho ? 3 : 1;
        const doubled = doubleScoreCharges > 0;
        if (doubled) doubleScoreCharges--;
        const pickedColor = caughtRisk ? "risk" : eatingPrimary ? food.type : "risk";
        if (!mechanicUnlocked("colorCombo")) routeCombo = 0;
        else if (routeLastColor !== pickedColor) routeCombo++;
        else routeCombo = 1;
        routeLastColor = pickedColor;
        const routeBonus = routeCombo >= 3 ? 2 : 0;
        if (routeCombo >= 3) {
            routeCombo = 0;
            routeLastColor = null;
            triggerRouteCombo(pickupColorForType(pickedColor));
            announce("Цветовое комбо! +2 очка.");
        }
        const modifierBonus = runModifier === runModifiers.tempo ? 1 : 0;
        const pickupPoints = (basePointValue + streakBonus + (perfectBeat ? 1 : 0) + routeBonus + modifierBonus + resonanceBonus())
            * (doubled ? 2 : 1);
        score += pickupPoints;
        const pickupColor = caughtRisk ? "#ff5470"
            : caughtChrono ? "#a88bff"
                : caughtEcho ? "#56dcff"
                    : caughtLoopFood ? "#6ca9ff"
                        : "#ffc94d";
        const pickupLabel = "+" + pickupPoints;
        triggerHeadPickup();
        triggerPickupZoom(head.x, head.y);
        emitPickupWave(head.x, head.y, pickupColor);
        emitParticles(head.x * gridSize + gridSize / 2, head.y * gridSize + gridSize / 2, pickupColor, caughtRisk ? 22 : 14, pickupLabel);
        triggerImpact(caughtRisk || caughtChrono ? 4 : 2, 170);
        playSound(caughtRisk ? "riskPickup" : caughtChrono ? "chronoPickup" : "pickup");
        scoreValue.classList.remove("is-popping");
        void scoreValue.offsetWidth;
        scoreValue.classList.add("is-popping");
        foodCount++;
        if (caughtRisk) riskPickups++;
        const chainCompleted = mechanicUnlocked("chain") && advanceObjectiveChain(caughtRisk ? "risk" : "normal", perfectBeat);
        updateChallengeProgress("collect");
        if (perfectBeat) updateChallengeProgress("rhythm");
        foodHistory.push({ x: head.x, y: head.y });
        if (foodHistory.length > 12) foodHistory.shift();
        if (caughtChrono) {
            rewindCharges = 1;
            nextRewindFoodAt = foodCount + 8;
        }
        focusCharges = Math.min(3, focusCharges + 1);
        if (perfectBeat) focusCharges = Math.min(3, focusCharges + 1);
        recordScoreIfNeeded();
        const newlyUnlocked = checkAchievements();
        if (caughtRisk) {
            riskFood = null;
            riskRemaining = 0;
        }
        const startedTimeLoop = mechanicUnlocked("loop") && foodCount > 0 && foodCount % 10 === 0 && startTimeLoop();
        const openedPortals = mechanicUnlocked("portals") && foodCount > 0 && foodCount % 7 === 0 && portals.length === 0 && createPortals();
        const riskSpawnInterval = runModifier === runModifiers.hunter ? 2 : 3;
        if (mechanicUnlocked("risk") && !riskFood && foodCount > 0 && foodCount % riskSpawnInterval === 0 && !caughtRisk) createRiskFood();
        if (mechanicUnlocked("hazard") && foodCount >= hazardWarningAt && hazards.length === 0) createHazard();
        if (mechanicUnlocked("pursuer") && foodCount >= 8) createPursuer();
        if (mechanicUnlocked("hunt") && pursuer && huntRemaining === 0 && foodCount >= nextHuntAt) startHunt();
        if (mechanicUnlocked("upgrades") && foodCount >= nextUpgradeAt) {
            nextUpgradeAt += 5;
            pendingUpgradeChoice = true;
        }
        updateScore();
        updateDailyRunLabel();
        updateChainStatus();
        updateFocus();
        updateRewindLife();
        if (perfectBeat) {
            rhythmPerfectMessage = 800;
            updateRhythm();
        }
        if (eatingPrimary) {
            placeFood(nextFoodType());
            if (food === null) {
                endGame();
                return false;
            }
        }
        if (startedTimeLoop) announce("Петля времени: еда повторяет ваш прошлый маршрут.");
        else if (openedPortals) announce("Порталы активны. Войдите в любой круг, чтобы мгновенно переместиться.");
        else if (completedPortalRoute) announce("Портальный маршрут! +4 очка и заряд фокуса.");
        else if (chainCompleted) announce("Цепочка целей пройдена! +2 очка и заряд фокуса.");
        else if (newlyUnlocked) announce("Новое достижение: " + newlyUnlocked.title + "!");
        else if (perfectBeat) announce("Точно в ритм: +1 очко и заряд фокуса.");
        else if (caughtRisk) announce("Риск оправдан: +" + basePointValue + " очков.");
        else if (caughtEcho) announce("Эхо поймано: +3 очка.");
        else if (caughtChrono) announce("Хроно-осколок найден. Одна отмотка готова.");
        else if (caughtLoopFood) announce("Петля времени повторила ваш маршрут.");
        else if (streakBonus) announce("Поток ×" + combo + ": бонусное очко.");
        if (portals.length && enteredPortal && !completedPortalRoute) announce("Портал перенёс змейку.");
    } else if (completedPortalRoute) {
        announce("Портальный маршрут! +4 очка и заряд фокуса.");
    } else if (enteredPortal) {
        announce("Портал перенёс змейку.");
    }

    if (!eating) {
        snake.pop();
    } else if (eatingRisk && !eatingPrimary) {
        snake.pop();
    }

    if (enteredPortal && portalExit && !reducedMotionQuery.matches) {
        portalTransit = {
            from: { ...enteredPortal },
            to: { ...portalExit },
            remaining: visualDurations.portalTransit
        };
        pickupMoodRemaining = Math.max(pickupMoodRemaining, 460);
        emitParticles(enteredPortal.x * gridSize + gridSize / 2, enteredPortal.y * gridSize + gridSize / 2, "#56dcff", 9);
        emitParticles(portalExit.x * gridSize + gridSize / 2, portalExit.y * gridSize + gridSize / 2, "#ff5ac4", 9);
        triggerImpact(2.5, 150);
    }
    if (enteredPortal) playSound("portal");

    if (gameState === "running") {
        saveTimelineFrame();
        updateRhythm();
    }
    updateMagnet();
    updateGameplayStatus();
    if (pendingUpgradeChoice && gameState === "running") {
        pendingUpgradeChoice = false;
        if (!preferences.fieldUpgrades || !spawnUpgradeTokens()) {
            showUpgradeSelection();
            return true;
        }
    }
    return false;
}

function draw() {
    ctx.clearRect(0, 0, gameCanvasSize, gameCanvasSize);
    ctx.fillStyle = "#080a14";
    ctx.fillRect(0, 0, gameCanvasSize, gameCanvasSize);
    ctx.save();
    if (cameraZoomRemaining > 0) {
        const progress = 1 - cameraZoomRemaining / pickupZoomDuration;
        const zoomProgress = progress < 0.24
            ? progress / 0.24
            : 1 - (progress - 0.24) / 0.76;
        const easedProgress = zoomProgress * zoomProgress * (3 - 2 * zoomProgress);
        const scale = 1 + easedProgress * pickupZoomStrength;
        ctx.translate(cameraZoomAnchor.x * (1 - scale), cameraZoomAnchor.y * (1 - scale));
        ctx.scale(scale, scale);
    }
    if (shakeRemaining > 0) {
        const intensity = shakeStrength * (shakeRemaining / 180);
        const offsetX = Math.round((Math.random() - 0.5) * intensity * renderScale) / renderScale;
        const offsetY = Math.round((Math.random() - 0.5) * intensity * renderScale) / renderScale;
        ctx.translate(offsetX, offsetY);
    }
    ctx.fillStyle = "#080a14";
    ctx.fillRect(-6, -6, gameCanvasSize + 12, gameCanvasSize + 12);
    const stageGlow = ctx.createRadialGradient(
        gameCanvasSize / 2, gameCanvasSize / 2, gameCanvasSize * 0.06,
        gameCanvasSize / 2, gameCanvasSize / 2, gameCanvasSize * 0.72
    );
    stageGlow.addColorStop(0, currentStagePalette.wash);
    stageGlow.addColorStop(1, "rgba(8, 10, 20, 0)");
    ctx.fillStyle = stageGlow;
    ctx.fillRect(0, 0, gameCanvasSize, gameCanvasSize);
    if (!preferences.effects) drawBiomeAtmosphere();

    const gridLineSize = 1 / renderScale;
    for (let i = 1; i < tileCount; i++) {
        const position = (Math.round(i * gridSize * renderScale) + 0.5) / renderScale;
        ctx.fillStyle = i % 5 === 0 ? currentStagePalette.majorGrid : currentStagePalette.grid;
        ctx.fillRect(position - gridLineSize / 2, 0, gridLineSize, gameCanvasSize);
        ctx.fillRect(0, position - gridLineSize / 2, gameCanvasSize, gridLineSize);
    }

    if (!preferences.effects) {
        drawLoopPath();
        drawPickupWaves();
        drawNewRecordEffect();
        drawGhostTrail();
        drawBestTrailGhost();
    }
    drawPortals();
    if (!preferences.effects) drawPortalTransit();
    drawHazards();
    drawPulseWalls();
    drawPursuer();
    if (!preferences.effects) drawSnakeTrail();
    if (food) drawFood(food);
    if (riskFood) drawFood(riskFood);
    drawUpgradeTokens();
    snake.forEach((segment, index) => drawSegment(segment, index));
    drawBiomeDarkness();
    if (!preferences.effects) {
        drawStreakGauge();
        drawParticles();
    }
    ctx.restore();
    drawSnakeStripe();
}

function drawSnakeStripe() {
    if (snake.length < 2) return;
    ctx.save();
    ctx.strokeStyle = currentTheme.accent;
    ctx.globalAlpha = 0.9;
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.setLineDash([1, 5]);
    ctx.shadowColor = currentTheme.accent;
    ctx.shadowBlur = 4;
    ctx.beginPath();

    let pathOpen = false;
    for (let index = snake.length - 1; index >= 2; index--) {
        const segment = snake[index];
        const next = snake[index - 1];
        const wrapped = Math.abs(segment.x - next.x) + Math.abs(segment.y - next.y) !== 1;
        if (wrapped) {
            if (pathOpen) ctx.stroke();
            ctx.beginPath();
            pathOpen = false;
            continue;
        }

        const x = segment.x * gridSize + gridSize / 2;
        const y = segment.y * gridSize + gridSize / 2;
        const nextX = next.x * gridSize + gridSize / 2;
        const nextY = next.y * gridSize + gridSize / 2;
        if (!pathOpen) {
            ctx.moveTo(x, y);
            pathOpen = true;
        }
        ctx.lineTo(nextX, nextY);
    }

    if (pathOpen) ctx.stroke();
    ctx.restore();
}

// Волны: один стиль лент и для поля, и для фона страницы.
const biomeWaveStyles = {
    garden: { bands: 3, spacing: 64, amplitude: 15, speed: 0.28, frequency: 0.012, width: 18, alpha: 0.07, colors: ["#9aff62", "#5affc8", "#d5ff9a"] },
    aurora: { bands: 4, spacing: 45, amplitude: 23, speed: 0.34, frequency: 0.009, width: 24, alpha: 0.09, colors: ["#57edff", "#a56bff", "#f44bd1"] },
    cosmos: { bands: 4, spacing: 50, amplitude: 20, speed: 0.2, frequency: 0.008, width: 22, alpha: 0.07, colors: ["#a88bff", "#6ca9ff", "#ff5ac4"] },
    dusk: { bands: 5, spacing: 41, amplitude: 17, speed: -0.24, frequency: 0.01, width: 20, alpha: 0.065, colors: ["#ff7bce", "#a46bff", "#ffc56b"] }
};

function drawWaveRibbons(context, time, style, layout) {
    const { width, top, spacing, amplitude, frequency, lineWidth, alpha, glow, step, bands } = layout;
    context.save();
    context.lineCap = "round";
    context.lineJoin = "round";
    const flow = time * style.speed;
    for (let band = 0; band < bands; band++) {
        const baseY = top + band * spacing;
        const phase = flow + band * 0.78;
        const waveY = x => baseY
            + Math.sin(x * frequency + phase) * amplitude
            + Math.sin(x * frequency * 0.48 - phase * 0.72) * amplitude * 0.48
            + Math.cos(x * frequency * 0.27 + phase * 0.52) * amplitude * 0.32;
        const gradient = context.createLinearGradient(0, baseY - amplitude, width, baseY + amplitude);
        gradient.addColorStop(0, style.colors[band % 3]);
        gradient.addColorStop(0.52, style.colors[(band + 1) % 3]);
        gradient.addColorStop(1, style.colors[(band + 2) % 3]);
        const strokeWave = (strokeWidth, opacity) => {
            context.globalAlpha = Math.min(1, opacity);
            context.strokeStyle = gradient;
            context.lineWidth = strokeWidth;
            context.beginPath();
            for (let x = -step; x <= width + step; x += step) {
                const y = waveY(x);
                if (x === -step) context.moveTo(x, y);
                else context.lineTo(x, y);
            }
            context.stroke();
        };
        // Свечение — широкие полупрозрачные мазки: выглядит так же мягко, но в разы дешевле тени.
        strokeWave(lineWidth * (glow ? 2.2 : 2.6), alpha * 0.22);
        strokeWave(lineWidth, alpha * 0.5);
        strokeWave(Math.max(1.8, lineWidth * 0.2), alpha * 2.1);
    }
    context.restore();
}

function drawBiomeAtmosphere() {
    const kind = currentStagePalette.kind;
    const reducedMotion = reducedMotionQuery.matches;
    const time = reducedMotion ? 0 : performance.now() / 1000;
    ctx.save();
    ctx.strokeStyle = currentStagePalette.accent;
    ctx.fillStyle = currentStagePalette.accent;

    if (kind === "cosmos") {
        for (let index = 0; index < 24; index++) {
            const x = (index * 97 + 31 + Math.sin(time * 0.16 + index) * 9 + gameCanvasSize) % gameCanvasSize;
            const y = (index * 151 + 57 + Math.cos(time * 0.13 + index * 0.7) * 7 + gameCanvasSize) % gameCanvasSize;
            ctx.globalAlpha = (index % 4 === 0 ? 0.44 : 0.18)
                * (reducedMotion ? 1 : 0.72 + Math.sin(time * 1.4 + index) * 0.28);
            ctx.beginPath();
            ctx.arc(x, y, index % 4 === 0 ? 1.35 : 0.75, 0, Math.PI * 2);
            ctx.fill();
        }
    } else {
        const style = biomeWaveStyles[kind] || biomeWaveStyles.garden;
        const pulse = wavePulse();
        drawWaveRibbons(ctx, time, style, {
            width: gameCanvasSize, top: 108, spacing: style.spacing, bands: style.bands,
            amplitude: style.amplitude * pulse, frequency: style.frequency,
            lineWidth: style.width, alpha: style.alpha * pulse, glow: true, step: 10
        });
    }
    ctx.restore();
}

// Волны слегка «вздыхают» на каждый импульс ритма, пока идёт игра.
function wavePulse() {
    if (gameState !== "running") return 1;
    const phase = rhythmClock % rhythmBeatLength;
    return 1 + Math.max(0, 1 - phase / 420) * 0.16;
}

// Фон страницы: те же ленты, что и на поле, в цветах текущего биома.
const ambientCanvas = document.getElementById("ambientCanvas");
const ambientContext = ambientCanvas ? ambientCanvas.getContext("2d") : null;
let ambientLastFrame = 0;
let ambientStaticKey = "";
let ambientTime = 0;

function resizeAmbientCanvas() {
    if (!ambientCanvas) return;
    // Мягкой картинке не нужно полное разрешение: половина — и быстрее, и чуть размытее.
    const scale = isTouchDevice || window.innerWidth <= 900 ? 0.35 : 0.5;
    ambientCanvas.width = Math.max(1, Math.round(window.innerWidth * scale));
    ambientCanvas.height = Math.max(1, Math.round(window.innerHeight * scale));
    ambientStaticKey = "";
}

function drawAmbientBackground(timestamp) {
    if (!ambientContext) return;
    const still = preferences.effects || reducedMotionQuery.matches;
    const kind = currentStagePalette.kind;
    if (still) {
        const key = kind + ":" + ambientCanvas.width + "x" + ambientCanvas.height;
        if (key === ambientStaticKey) return;
        ambientStaticKey = key;
    } else {
        if (timestamp - ambientLastFrame < (isTouchDevice || window.innerWidth <= 900 ? 66 : 41)) return;
        // Во время игры волны текут быстрее, в меню и на паузе — спокойнее.
        const delta = Math.min(100, timestamp - ambientLastFrame) / 1000;
        ambientTime += delta * (gameState === "running" ? (focusRemaining > 0 ? 0.5 : 1.35) : 0.7);
        ambientStaticKey = "";
    }
    ambientLastFrame = timestamp;
    const width = ambientCanvas.width;
    const height = ambientCanvas.height;
    const style = biomeWaveStyles[kind] || biomeWaveStyles.garden;
    const unit = height / 480;
    const pulse = still ? 1 : wavePulse();
    ambientContext.clearRect(0, 0, width, height);
    drawWaveRibbons(ambientContext, still ? 0 : ambientTime, style, {
        width, top: height * 0.3, spacing: height * 0.12, bands: style.bands + 2,
        amplitude: style.amplitude * unit * 1.5 * pulse,
        frequency: style.frequency * 480 / width * 1.7,
        lineWidth: style.width * unit * 1.15, alpha: style.alpha * 1.45 * pulse,
        glow: false, step: Math.max(8, Math.round(width / 90))
    });
    // Плавное затухание к верху и низу рисуется здесь же — это дешевле CSS-маски поверх канваса.
    const fade = ambientContext.createLinearGradient(0, 0, 0, height);
    fade.addColorStop(0.08, "rgba(0, 0, 0, 0)");
    fade.addColorStop(0.34, "rgba(0, 0, 0, 1)");
    fade.addColorStop(0.88, "rgba(0, 0, 0, 1)");
    fade.addColorStop(1, "rgba(0, 0, 0, 0)");
    ambientContext.save();
    ambientContext.globalCompositeOperation = "destination-in";
    ambientContext.fillStyle = fade;
    ambientContext.fillRect(0, 0, width, height);
    ambientContext.restore();
}

function drawBestTrailGhost() {
    if (!bestTrail.length || runStep >= bestTrail.length) return;
    const position = bestTrail[runStep];
    if (!position || snake.some(segment => segment.x === position.x && segment.y === position.y)) return;
    const inset = gridSize * 0.22;
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.strokeStyle = "#a88bff";
    ctx.fillStyle = "rgba(168, 139, 255, .16)";
    ctx.lineWidth = Math.max(1.5, gridSize * 0.08);
    ctx.beginPath();
    ctx.roundRect(position.x * gridSize + inset, position.y * gridSize + inset,
        gridSize - inset * 2, gridSize - inset * 2, gridSize * 0.3);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}

function drawHazards() {
    hazards.forEach(hazard => {
        const x = hazard.x * gridSize;
        const y = hazard.y * gridSize;
        const inset = gridSize * 0.16;
        ctx.save();
        if (hazard.state === "warning") {
            const reducedMotion = reducedMotionQuery.matches;
            ctx.globalAlpha = reducedMotion ? 0.68 : 0.58 + Math.sin(performance.now() / 90) * 0.22;
            ctx.strokeStyle = "#ffc94d";
            ctx.fillStyle = "rgba(255, 164, 87, .1)";
            ctx.setLineDash([gridSize * 0.18, gridSize * 0.12]);
        } else {
            ctx.globalAlpha = 0.85;
            ctx.strokeStyle = "#ff806e";
            ctx.fillStyle = "rgba(255, 98, 82, .22)";
            ctx.setLineDash([]);
        }
        ctx.lineWidth = Math.max(1, gridSize * 0.08);
        ctx.fillRect(x + inset, y + inset, gridSize - inset * 2, gridSize - inset * 2);
        ctx.strokeRect(x + inset, y + inset, gridSize - inset * 2, gridSize - inset * 2);
        ctx.setLineDash([]);
        ctx.strokeStyle = hazard.state === "warning" ? "#ffd28c" : "#ff9c8b";
        ctx.beginPath();
        ctx.moveTo(x + gridSize * 0.36, y + gridSize * 0.36);
        ctx.lineTo(x + gridSize * 0.64, y + gridSize * 0.64);
        ctx.moveTo(x + gridSize * 0.64, y + gridSize * 0.36);
        ctx.lineTo(x + gridSize * 0.36, y + gridSize * 0.64);
        ctx.stroke();
        ctx.restore();
    });
}

function drawPursuer() {
    if (!pursuer || !pursuerSegments.length) return;
    const centerX = pursuer.x * gridSize + gridSize / 2;
    const centerY = pursuer.y * gridSize + gridSize / 2;
    const horizontalDistance = Math.abs(pursuer.x - snake[0].x);
    const verticalDistance = Math.abs(pursuer.y - snake[0].y);
    const distance = Math.min(horizontalDistance, tileCount - horizontalDistance)
        + Math.min(verticalDistance, tileCount - verticalDistance);
    ctx.save();
    if (distance <= 5) {
        ctx.strokeStyle = "hsla(" + getPursuerHue() + ", 100%, 70%, .42)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(centerX, centerY, gridSize * (0.48 + Math.min(distance, 5) * 0.035), 0, Math.PI * 2);
        ctx.stroke();
    }
    const hue = getPursuerHue();
    ctx.shadowColor = "hsl(" + hue + ", 100%, 62%)";
    ctx.shadowBlur = 7;
    for (let index = pursuerSegments.length - 1; index > 0; index--) {
        const segment = pursuerSegments[index];
        const x = segment.x * gridSize + gridSize / 2;
        const y = segment.y * gridSize + gridSize / 2;
        drawPursuerSegment(x, y, hue);
    }
    drawPursuerStripe(hue);
    const headRotation = getPursuerRotation(0);
    const headDrawn = drawSprite("snakeHead", centerX, centerY, gridSize, gridSize, headRotation, hue);
    if (!headDrawn) drawPursuerFallback(centerX, centerY, true, headRotation, hue);
    ctx.restore();
}

function drawPursuerSegment(centerX, centerY, hue) {
    const inset = gridSize * 0.1;
    const size = gridSize - inset * 2;
    ctx.save();
    ctx.fillStyle = "#11131e";
    ctx.strokeStyle = "hsla(" + hue + ", 100%, 68%, .82)";
    ctx.lineWidth = Math.max(1, gridSize * 0.07);
    ctx.beginPath();
    ctx.roundRect(centerX - size / 2, centerY - size / 2, size, size, gridSize * 0.32);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}

function drawPursuerStripe(hue) {
    if (pursuerSegments.length < 2) return;
    ctx.save();
    ctx.beginPath();
    for (let index = pursuerSegments.length - 1; index >= 0; index--) {
        const segment = pursuerSegments[index];
        const x = segment.x * gridSize + gridSize / 2;
        const y = segment.y * gridSize + gridSize / 2;
        if (index === pursuerSegments.length - 1) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "hsla(" + ((hue + 48) % 360) + ", 100%, 72%, .95)";
    ctx.lineWidth = Math.max(2, gridSize * 0.14);
    ctx.shadowColor = "hsla(" + ((hue + 48) % 360) + ", 100%, 68%, .8)";
    ctx.shadowBlur = 6;
    ctx.stroke();
    ctx.restore();
}

function drawPursuerFallback(centerX, centerY, isHead, rotation, hue) {
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);
    ctx.fillStyle = "hsl(" + hue + ", 100%, 56%)";
    ctx.strokeStyle = "hsl(" + hue + ", 100%, 82%)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(-gridSize * 0.43, -gridSize * 0.43, gridSize * 0.86, gridSize * 0.86, gridSize * (isHead ? 0.35 : 0.28));
    ctx.fill();
    ctx.stroke();
    if (isHead) {
        ctx.fillStyle = "#080a14";
        ctx.beginPath();
        ctx.arc(gridSize * 0.15, -gridSize * 0.16, gridSize * 0.06, 0, Math.PI * 2);
        ctx.arc(gridSize * 0.15, gridSize * 0.16, gridSize * 0.06, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
}

function getPursuerHue() {
    return ((Math.floor(score / 5) + 1) * 53 + performance.now() / 48) % 360;
}

function getPursuerRotation(index) {
    const segment = pursuerSegments[index];
    const neighbor = index === 0 ? pursuerSegments[1] : pursuerSegments[index + 1] || pursuerSegments[index - 1];
    if (!neighbor) return 0;
    const dx = segment.x - neighbor.x;
    const dy = segment.y - neighbor.y;
    if (index === 0) {
        if (dx > 0) return 0;
        if (dx < 0) return Math.PI;
        if (dy > 0) return Math.PI / 2;
        if (dy < 0) return -Math.PI / 2;
    }
    return dx === 0 ? Math.PI / 2 : 0;
}

function drawPortalTransit() {
    if (!portalTransit) return;
    const progress = 1 - portalTransit.remaining / visualDurations.portalTransit;
    const fromX = portalTransit.from.x * gridSize + gridSize / 2;
    const fromY = portalTransit.from.y * gridSize + gridSize / 2;
    const toX = portalTransit.to.x * gridSize + gridSize / 2;
    const toY = portalTransit.to.y * gridSize + gridSize / 2;
    const controlX = (fromX + toX) / 2;
    const controlY = (fromY + toY) / 2 - Math.min(42, Math.abs(toX - fromX) * 0.12 + Math.abs(toY - fromY) * 0.12);
    ctx.save();
    ctx.globalAlpha = Math.sin(Math.PI * progress) * 0.72;
    ctx.strokeStyle = "#56dcff";
    ctx.lineWidth = 2.5;
    ctx.setLineDash([5, 6]);
    ctx.lineDashOffset = -progress * 24;
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.quadraticCurveTo(controlX, controlY, toX, toY);
    ctx.stroke();
    ctx.restore();
}

function drawNewRecordEffect() {
    if (newRecordRemaining <= 0) return;
    const progress = 1 - newRecordRemaining / visualDurations.newRecord;
    const alpha = Math.sin(Math.PI * progress);
    const centerX = snake[0].x * gridSize + gridSize / 2;
    const centerY = snake[0].y * gridSize + gridSize / 2;
    ctx.save();
    ctx.globalAlpha = alpha * 0.8;
    ctx.strokeStyle = currentStagePalette.accent;
    ctx.lineWidth = 1.5;
    for (let index = 0; index < 12; index++) {
        const angle = index * Math.PI / 6 + progress * 0.35;
        const innerRadius = 14 + progress * 13;
        const outerRadius = innerRadius + 6 + (index % 3) * 3;
        ctx.beginPath();
        ctx.moveTo(centerX + Math.cos(angle) * innerRadius, centerY + Math.sin(angle) * innerRadius);
        ctx.lineTo(centerX + Math.cos(angle) * outerRadius, centerY + Math.sin(angle) * outerRadius);
        ctx.stroke();
    }
    ctx.globalAlpha = alpha * 0.94;
    ctx.fillStyle = "rgba(12, 14, 11, .86)";
    ctx.strokeStyle = currentStagePalette.accent;
    ctx.lineWidth = 1;
    roundedRect(ctx, centerX - 49, centerY - 43, 98, 18, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = currentStagePalette.accent;
    ctx.font = "700 8px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("НОВЫЙ РЕКОРД", centerX, centerY - 34);
    ctx.restore();
}

function drawPickupWaves() {
    pickupWaves.forEach(wave => {
        const progress = wave.age / wave.duration;
        const radius = wave.reducedMotion ? Math.min(2, wave.maxRadius) : progress * wave.maxRadius;
        const motionScale = wave.reducedMotion ? 0.55 : 1;
        const centerX = wave.x * gridSize + gridSize / 2;
        const centerY = wave.y * gridSize + gridSize / 2;
        const firstX = Math.max(0, Math.floor(wave.x - radius - 1));
        const lastX = Math.min(tileCount - 1, Math.ceil(wave.x + radius + 1));
        const firstY = Math.max(0, Math.floor(wave.y - radius - 1));
        const lastY = Math.min(tileCount - 1, Math.ceil(wave.y + radius + 1));

        ctx.save();
        for (let cellY = firstY; cellY <= lastY; cellY++) {
            for (let cellX = firstX; cellX <= lastX; cellX++) {
                const distance = Math.hypot(cellX - wave.x, cellY - wave.y);
                const intensity = Math.max(0, 1 - Math.abs(distance - radius) / 1.15) * (1 - progress) * motionScale;
                if (intensity <= 0) continue;

                ctx.globalAlpha = intensity * 0.15;
                ctx.fillStyle = wave.color;
                ctx.fillRect(cellX * gridSize + 1, cellY * gridSize + 1, gridSize - 2, gridSize - 2);
            }
        }

        ctx.globalAlpha = (1 - progress) * 0.48;
        ctx.strokeStyle = wave.color;
        ctx.lineWidth = 6;
        ctx.globalAlpha = (1 - progress) * 0.12;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * gridSize, 0, Math.PI * 2);
        ctx.stroke();
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = (1 - progress) * 0.48;
        ctx.stroke();
        ctx.restore();
    });
}

function drawSnakeTrail() {
    if (snake.length < 2) return;
    const powerTrail = shieldCharges > 0 ? "rgba(86, 220, 255, .48)"
        : magnetRemaining > 0 ? "rgba(168, 139, 255, .48)"
            : doubleScoreCharges > 0 ? "rgba(255, 201, 77, .5)"
                : null;
    const comboTrail = combo >= 3;
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = Math.max(3, gridSize * 0.28);
    const gradient = ctx.createLinearGradient(
        snake[snake.length - 1].x * gridSize,
        snake[snake.length - 1].y * gridSize,
        snake[0].x * gridSize,
        snake[0].y * gridSize
    );
    gradient.addColorStop(0, "rgba(194, 255, 0, 0)");
    gradient.addColorStop(1, powerTrail || (comboTrail ? "rgba(255, 201, 77, .52)" : currentTheme.trail));
    ctx.strokeStyle = gradient;
    ctx.shadowColor = shieldCharges > 0 ? "#56dcff"
        : magnetRemaining > 0 ? "#a88bff"
            : doubleScoreCharges > 0 ? "#ffc94d"
                : comboTrail ? "#ffc94d" : currentTheme.accent;
    ctx.shadowBlur = 0;
    ctx.beginPath();
    snake.forEach((segment, index) => {
        const x = segment.x * gridSize + gridSize / 2;
        const y = segment.y * gridSize + gridSize / 2;
        if (index === 0) ctx.moveTo(x, y);
        else {
            const previous = snake[index - 1];
            if (Math.abs(segment.x - previous.x) + Math.abs(segment.y - previous.y) === 1) {
                ctx.lineTo(x, y);
            } else {
                ctx.moveTo(x, y);
            }
        }
    });
    ctx.stroke();
    ctx.restore();
}

function drawStreakGauge() {
    if (combo <= 0 || !snake.length) return;
    const centerX = snake[0].x * gridSize + gridSize / 2;
    const centerY = snake[0].y * gridSize + gridSize / 2;
    const progress = combo % 3 === 0 ? 1 : (combo % 3) / 3;
    ctx.save();
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = "rgba(221, 225, 246, .32)";
    ctx.beginPath();
    ctx.arc(centerX, centerY, gridSize * 0.58, -Math.PI / 2, Math.PI * 1.5);
    ctx.stroke();
    ctx.strokeStyle = currentTheme.accent;
    ctx.beginPath();
    ctx.arc(centerX, centerY, gridSize * 0.58, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
    ctx.stroke();
    ctx.restore();
}

function drawHeadMood(centerX, centerY) {
    const mood = nearMissRemaining > 0 ? "danger" : portalTransit ? "portal" : pickupMoodRemaining > 0 ? "happy" : "";
    if (!mood) return;
    const symbol = mood === "danger" ? "!" : mood === "portal" ? "✦" : "+";
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(getHeadRotation());
    ctx.strokeStyle = mood === "danger" ? "#ff5470" : currentTheme.accent;
    ctx.lineWidth = 1.15;
    ctx.lineCap = "round";
    ctx.beginPath();
    if (mood === "happy") {
        ctx.moveTo(2.4, -4.1);
        ctx.quadraticCurveTo(4.2, -2.2, 6, -4.1);
        ctx.moveTo(2.4, 4.1);
        ctx.quadraticCurveTo(4.2, 2.2, 6, 4.1);
        ctx.moveTo(7, -1.2);
        ctx.quadraticCurveTo(8.5, 0, 7, 1.2);
    } else if (mood === "danger") {
        ctx.moveTo(2.2, -5.3);
        ctx.lineTo(6.2, -3.8);
        ctx.moveTo(2.2, 5.3);
        ctx.lineTo(6.2, 3.8);
    } else {
        ctx.moveTo(2.2, -5);
        ctx.quadraticCurveTo(4.2, -6.5, 6.2, -5);
        ctx.moveTo(2.2, 5);
        ctx.quadraticCurveTo(4.2, 6.5, 6.2, 5);
    }
    ctx.stroke();
    ctx.restore();

    const perpendicular = { x: -direction.y, y: direction.x };
    const badgeX = centerX - direction.x * 7 + perpendicular.x * 8;
    const badgeY = centerY - direction.y * 7 + perpendicular.y * 8;
    ctx.save();
    ctx.fillStyle = mood === "danger" ? "#ff5470" : currentTheme.accent;
    ctx.beginPath();
    ctx.arc(badgeX, badgeY, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#090a10";
    ctx.font = "bold 7px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(symbol, badgeX, badgeY + 0.4);
    ctx.restore();
}

function drawParticles() {
    particles.forEach(particle => {
        const alpha = Math.min(1, particle.life / particle.maxLife);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = particle.color;
        if (particle.text) {
            ctx.font = "500 " + particle.size + "px monospace";
            ctx.textAlign = "center";
            ctx.fillText(particle.text, particle.x, particle.y);
        } else {
            // Ореол — второй, более крупный и прозрачный круг вместо размытой тени.
            ctx.globalAlpha = alpha * 0.22;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size * alpha * 2.6, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    });
}

function drawGhostTrail() {
    if (ghostRemaining <= 0 || ghostTrail.length === 0) return;
    ctx.save();
    ctx.globalAlpha = Math.min(0.55, ghostRemaining / 2200 * 0.55);
    ctx.strokeStyle = "#a88bff";
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 6]);
    ctx.beginPath();
    ghostTrail.forEach((position, index) => {
        const x = position.x * gridSize + gridSize / 2;
        const y = position.y * gridSize + gridSize / 2;
        if (index === 0) ctx.moveTo(x, y);
        else {
            const previous = ghostTrail[index - 1];
            if (Math.abs(position.x - previous.x) + Math.abs(position.y - previous.y) === 1) {
                ctx.lineTo(x, y);
            } else {
                ctx.moveTo(x, y);
            }
        }
    });
    ctx.stroke();
    ctx.setLineDash([]);
    ghostTrail.forEach(position => {
        ctx.fillStyle = "#a88bff";
        ctx.beginPath();
        ctx.arc(position.x * gridSize + gridSize / 2, position.y * gridSize + gridSize / 2, 3, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.restore();
}

function drawLoopPath() {
    if (loopRemaining <= 0 || loopSequence.length === 0) return;
    ctx.save();
    ctx.globalAlpha = 0.24;
    ctx.strokeStyle = "#56dcff";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 5]);
    ctx.beginPath();
    loopSequence.forEach((position, index) => {
        const x = position.x * gridSize + gridSize / 2;
        const y = position.y * gridSize + gridSize / 2;
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.restore();
}

function drawPulseWalls() {
    if (!pulseWalls.length) return;
    const active = pulseWallsActive();
    // Доля такта до смены состояния: пунктир «наливается» перед тем, как стена станет твёрдой.
    const share = (rhythmClock % rhythmBeatLength) / rhythmBeatLength;
    const inset = gridSize * 0.1;
    ctx.save();
    pulseWalls.forEach(tile => {
        const x = tile.x * gridSize + inset;
        const y = tile.y * gridSize + inset;
        const size = gridSize - inset * 2;
        if (active) {
            ctx.globalAlpha = 0.92;
            ctx.fillStyle = "rgba(255, 90, 196, .34)";
            ctx.strokeStyle = "#ff5ac4";
            ctx.setLineDash([]);
        } else {
            ctx.globalAlpha = 0.3 + share * 0.5;
            ctx.fillStyle = "rgba(255, 90, 196, " + (0.04 + share * 0.12) + ")";
            ctx.strokeStyle = "#ff8fe3";
            ctx.setLineDash([gridSize * 0.18, gridSize * 0.12]);
        }
        ctx.lineWidth = Math.max(1, gridSize * 0.08);
        if (active) {
            const alphaBefore = ctx.globalAlpha;
            ctx.globalAlpha = 0.16;
            ctx.fillRect(x - 3, y - 3, size + 6, size + 6);
            ctx.globalAlpha = alphaBefore;
        }
        ctx.fillRect(x, y, size, size);
        ctx.strokeRect(x, y, size, size);
    });
    ctx.restore();
}

function drawBiomeDarkness() {
    if (biomeRule() !== "cosmos" || gameState === "idle") return;
    const headX = snake[0].x * gridSize + gridSize / 2;
    const headY = snake[0].y * gridSize + gridSize / 2;
    const darkness = ctx.createRadialGradient(headX, headY, gridSize * 4, headX, headY, gridSize * 9);
    darkness.addColorStop(0, "rgba(5, 6, 10, 0)");
    darkness.addColorStop(1, "rgba(5, 6, 10, .88)");
    ctx.save();
    ctx.fillStyle = darkness;
    ctx.fillRect(-6, -6, gameCanvasSize + 12, gameCanvasSize + 12);
    // Еда слабо мерцает в темноте, чтобы было понятно, куда двигаться.
    [food, riskFood].forEach(target => {
        if (!target) return;
        ctx.globalAlpha = 0.28 + Math.sin(performance.now() / 300) * 0.12;
        ctx.fillStyle = pickupColorForType(target.type);
        ctx.beginPath();
        ctx.arc(target.x * gridSize + gridSize / 2, target.y * gridSize + gridSize / 2, 3, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.restore();
}

function drawUpgradeTokens() {
    if (!upgradeTokens.length) return;
    const now = performance.now();
    const blink = upgradeTokensRemaining < 2200 ? 0.45 + 0.55 * Math.abs(Math.sin(now / 110)) : 1;
    const lifeShare = Math.max(0, upgradeTokensRemaining / upgradeTokenLifetime);
    upgradeTokens.forEach((token, index) => {
        const style = upgradeDefs[token.type];
        const centerX = token.x * gridSize + gridSize / 2;
        const centerY = token.y * gridSize + gridSize / 2;
        const radius = 10.5 * (preferences.effects ? 1 : 1 + Math.sin(now / 260 + index * 2.1) * 0.07);
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.globalAlpha = blink;
        ctx.shadowColor = style.color;
        ctx.shadowBlur = 10;
        ctx.fillStyle = "rgba(8, 10, 20, .94)";
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = style.color;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.globalAlpha = blink * 0.3;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.stroke();
        // Дуга показывает, сколько времени жетон ещё пролежит.
        ctx.globalAlpha = blink;
        ctx.beginPath();
        ctx.arc(0, 0, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * lifeShare);
        ctx.stroke();
        ctx.fillStyle = style.color;
        if (token.type === "shield") {
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            ctx.moveTo(0, -6);
            ctx.lineTo(4.8, -3.8);
            ctx.lineTo(4.8, 0.6);
            ctx.quadraticCurveTo(4.2, 4.6, 0, 6.4);
            ctx.quadraticCurveTo(-4.2, 4.6, -4.8, 0.6);
            ctx.lineTo(-4.8, -3.8);
            ctx.closePath();
            ctx.stroke();
        } else if (token.type === "magnet") {
            ctx.lineWidth = 2.6;
            ctx.lineCap = "butt";
            ctx.beginPath();
            ctx.moveTo(-4, -5.5);
            ctx.lineTo(-4, 0.5);
            ctx.arc(0, 0.5, 4, Math.PI, 0, true);
            ctx.lineTo(4, -5.5);
            ctx.stroke();
        } else {
            ctx.font = "700 10px 'IBM Plex Mono', 'SFMono-Regular', Consolas, monospace";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(style.symbol, 0, 0.5);
        }
        ctx.font = "700 8px 'IBM Plex Mono', 'SFMono-Regular', Consolas, monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "rgba(0, 0, 0, .9)";
        ctx.shadowBlur = 4;
        ctx.fillText(style.label, 0, token.y >= tileCount - 1 ? -18 : 18);
        ctx.restore();
    });
}

function drawPortals() {
    if (portals.length !== 2) return;
    const pulse = 1 + Math.sin(performance.now() / 190) * 0.12;
    const openingProgress = portalOpenRemaining > 0
        ? 1 - portalOpenRemaining / visualDurations.portalOpen
        : 1;
    const openingEase = openingProgress * openingProgress * (3 - 2 * openingProgress);
    portals.forEach((portal, index) => {
        const centerX = portal.x * gridSize + gridSize / 2;
        const centerY = portal.y * gridSize + gridSize / 2;
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(performance.now() / 700 * (index === 0 ? 1 : -1));
        ctx.globalAlpha = (portalActive ? 0.35 + openingEase * 0.65 : 0.2);
        ctx.scale(0.35 + openingEase * 0.65, 0.35 + openingEase * 0.65);
        ctx.shadowColor = "#56dcff";
        ctx.shadowBlur = 2;
        ctx.strokeStyle = index === 0 ? "#56dcff" : "#a88bff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(0, 0, (8 + openingEase * 2) * pulse, (10 + openingEase * 2) * pulse, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.globalAlpha *= openingEase * 0.65;
        ctx.beginPath();
        ctx.ellipse(0, 0, 4, 6, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    });
}

function drawFood(targetFood) {
    const centerX = targetFood.x * gridSize + gridSize / 2;
    const centerY = targetFood.y * gridSize + gridSize / 2;
    const spawnEffect = foodSpawnEffects.find(effect =>
        effect.x === targetFood.x && effect.y === targetFood.y && effect.type === targetFood.type
    );
    if (spawnEffect) {
        const progress = 1 - spawnEffect.remaining / visualDurations.foodSpawn;
        const easedProgress = progress * progress * (3 - 2 * progress);
        const scale = 0.62 + easedProgress * 0.38;
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.scale(scale, scale);
        ctx.translate(-centerX, -centerY);
        ctx.globalAlpha *= 0.45 + easedProgress * 0.55;
    } else {
        ctx.save();
    }
    const spriteName = targetFood.type === "risk" || targetFood.type === "chrono"
        || targetFood.type === "echo" || targetFood.type === "loop"
        ? targetFood.type
        : "food";
    if (drawSprite(spriteName, centerX, centerY, gridSize, gridSize)) {
        ctx.save();
        ctx.textAlign = "center";
        ctx.font = "7px monospace";
        if (targetFood.type === "echo") {
            ctx.fillStyle = "#56dcff";
            ctx.fillText("ЭХО " + Math.ceil(echoRemaining / 1000) + "с", centerX, centerY - 12);
        } else if (targetFood.type === "risk") {
            ctx.fillStyle = "#ffd1b6";
            ctx.fillText("РИСК +" + Math.ceil(riskRemaining / 1000), centerX, centerY - 12);
        }
        ctx.restore();
        ctx.restore();
        return;
    }

    const type = targetFood.type || "normal";
    const color = type === "chrono" ? "#a88bff"
        : type === "echo" ? "#56dcff"
            : type === "risk" ? "#ff5470"
                : type === "loop" ? "#6ca9ff" : "#ffc94d";
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 1.4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.shadowColor = color;
    ctx.shadowBlur = 6;

    if (type === "chrono") {
        ctx.beginPath();
        ctx.moveTo(0, -8);
        ctx.lineTo(7, -4);
        ctx.lineTo(7, 4);
        ctx.lineTo(0, 8);
        ctx.lineTo(-7, 4);
        ctx.lineTo(-7, -4);
        ctx.closePath();
        ctx.globalAlpha = 0.18;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, 4.5, -2.4, 1.8);
        ctx.moveTo(-5.3, -2.9);
        ctx.lineTo(-4.3, 0.5);
        ctx.lineTo(-1.3, -0.5);
        ctx.moveTo(0, -2);
        ctx.lineTo(0, 0);
        ctx.lineTo(2, 1.5);
        ctx.stroke();
    } else if (type === "echo") {
        ctx.globalAlpha = 0.12;
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(0, 0, 6.2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.arc(0, 0, 3.2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(0, 0, 1, 0, Math.PI * 2);
        ctx.fill();
    } else if (type === "risk") {
        ctx.beginPath();
        ctx.moveTo(0, -8);
        ctx.lineTo(7, -4);
        ctx.lineTo(6, 4);
        ctx.lineTo(0, 8);
        ctx.lineTo(-6, 4);
        ctx.lineTo(-7, -4);
        ctx.closePath();
        ctx.globalAlpha = 0.18;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(1, -5);
        ctx.lineTo(-2, 0);
        ctx.lineTo(1, 1);
        ctx.lineTo(-1, 5);
        ctx.stroke();
    } else if (type === "loop") {
        ctx.globalAlpha = 0.12;
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(0, 0, 6.2, -2.3, 1.4);
        ctx.moveTo(-5.1, -3.2);
        ctx.lineTo(-5.2, 0);
        ctx.lineTo(-2.3, -1.1);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, 1, 0, Math.PI * 2);
        ctx.fill();
    } else {
        ctx.beginPath();
        ctx.moveTo(0, -8);
        ctx.lineTo(7, 0);
        ctx.lineTo(0, 8);
        ctx.lineTo(-7, 0);
        ctx.closePath();
        ctx.globalAlpha = 0.16;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, -4);
        ctx.lineTo(4, 0);
        ctx.lineTo(0, 4);
        ctx.lineTo(-4, 0);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, 1, 0, Math.PI * 2);
        ctx.fill();
    }

    if (type === "echo" || type === "risk") {
        ctx.shadowBlur = 0;
        ctx.fillStyle = type === "risk" ? "#ffd8e4" : "#c8faff";
        ctx.font = "6px monospace";
        ctx.textAlign = "center";
        ctx.fillText(type === "risk"
            ? "РИСК +" + Math.ceil(riskRemaining / 1000)
            : "ЭХО " + Math.ceil(echoRemaining / 1000) + "с", 0, -11);
    }

    ctx.restore();
    ctx.restore();
    ctx.restore();
}

function drawSegment(segment, index) {
    const centerX = segment.x * gridSize + gridSize / 2;
    const centerY = segment.y * gridSize + gridSize / 2;
    const headPulseProgress = index === 0 && headPickupRemaining > 0
        ? 1 - headPickupRemaining / visualDurations.headPickup
        : 0;
    const headScale = 1 + Math.sin(Math.PI * headPulseProgress) * 0.14;
    if (index === 0) {
        ctx.save();
        if (headScale > 1) {
            ctx.translate(centerX, centerY);
            ctx.scale(headScale, headScale);
            ctx.translate(-centerX, -centerY);
            ctx.globalAlpha = 0.82;
            ctx.fillStyle = "rgba(194, 255, 0, .18)";
            ctx.beginPath();
            ctx.arc(centerX, centerY, gridSize * 0.58, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }
    const rotation = index === 0 ? getHeadRotation() : getBodyRotation(index);
    if (drawSprite(index === 0 ? "snakeHead" : "snakeBody", centerX, centerY, gridSize, gridSize, rotation)) {
        if (index === 0) {
            drawSnakeTongue(centerX, centerY);
            drawHeadMood(centerX, centerY);
        }
        if (index === 0) ctx.restore();
        return;
    }

    const inset = index === 0 ? 2 : 3;
    const left = snapToDevicePixel(segment.x * gridSize + inset);
    const top = snapToDevicePixel(segment.y * gridSize + inset);
    const right = snapToDevicePixel(segment.x * gridSize + gridSize - inset);
    const bottom = snapToDevicePixel(segment.y * gridSize + gridSize - inset);
    ctx.save();
    if (index === 0) {
        ctx.fillStyle = "#05060a";
    } else {
        ctx.fillStyle = "#05060a";
    }
    ctx.fillRect(left, top, right - left, bottom - top);
    const edge = 2 / renderScale;
    ctx.fillStyle = currentTheme.accent;
    ctx.fillRect(left + edge, top + edge, right - left - edge * 2, bottom - top - edge * 2);
    ctx.fillStyle = "#171a28";
    ctx.fillRect(left + edge * 2, top + edge * 2, right - left - edge * 4, bottom - top - edge * 4);
    ctx.restore();
    if (index === 0) {
        drawEyes(segment);
        drawSnakeTongue(centerX, centerY);
        drawHeadMood(centerX, centerY);
        ctx.restore();
    }
}

function drawSnakeTongue(centerX, centerY) {
    if (direction.x === 0 && direction.y === 0) return;

    const phase = (performance.now() % 1700) / 1700;
    if (phase > 0.24) return;

    const flick = Math.sin(Math.PI * phase / 0.24);
    const tip = 10 + flick * 5;
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(getHeadRotation());
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#7b193c";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(8, 0);
    ctx.quadraticCurveTo(10, 0, tip, 0);
    ctx.stroke();
    ctx.strokeStyle = "#ff5470";
    ctx.lineWidth = 1.15;
    ctx.beginPath();
    ctx.moveTo(8, 0);
    ctx.quadraticCurveTo(10, 0, tip, 0);
    ctx.moveTo(tip - 2, 0);
    ctx.lineTo(tip + 1.5, -1.7);
    ctx.moveTo(tip - 2, 0);
    ctx.lineTo(tip + 1.5, 1.7);
    ctx.stroke();
    ctx.restore();
}

function drawSprite(name, centerX, centerY, width, height, rotation = 0, hueOverride = null) {
    const source = spriteCells[name];
    if (!source || !spriteAtlas.complete || !spriteAtlas.naturalWidth) return false;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);
    if (name === "snakeHead" || name === "snakeBody") {
        const hue = hueOverride === null ? currentTheme.hue : hueOverride;
        ctx.filter = hue ? "hue-rotate(" + hue + "deg) saturate(1.15)" : "none";
    }
    ctx.drawImage(spriteAtlas, source.x + 2, source.y + 2, 92, 92, -width / 2, -height / 2, width, height);
    ctx.restore();
    return true;
}

function getHeadRotation() {
    if (direction.x > 0) return 0;
    if (direction.x < 0) return Math.PI;
    if (direction.y > 0) return Math.PI / 2;
    if (direction.y < 0) return -Math.PI / 2;
    return 0;
}

function getBodyRotation(index) {
    const segment = snake[index];
    const tailNeighbor = snake[index + 1];
    if (tailNeighbor && Math.abs(segment.x - tailNeighbor.x) + Math.abs(segment.y - tailNeighbor.y) === 1) {
        return tailNeighbor.x === segment.x ? Math.PI / 2 : 0;
    }

    const headNeighbor = snake[index - 1];
    if (headNeighbor && Math.abs(segment.x - headNeighbor.x) + Math.abs(segment.y - headNeighbor.y) === 1) {
        return headNeighbor.x === segment.x ? Math.PI / 2 : 0;
    }
    return 0;
}

function snapToDevicePixel(value) {
    return Math.round(value * renderScale) / renderScale;
}

function drawEyes(head) {
    const centerX = head.x * gridSize + gridSize / 2;
    const centerY = head.y * gridSize + gridSize / 2;
    const forward = 4;
    const side = 4;
    const perpendicular = { x: -direction.y, y: direction.x };
    ctx.fillStyle = "#080a14";
    for (const sign of [-1, 1]) {
        const x = centerX + direction.x * forward + perpendicular.x * side * sign;
        const y = centerY + direction.y * forward + perpendicular.y * side * sign;
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fill();
    }
}

function roundedRect(context, x, y, width, height, radius) {
    context.beginPath();
    context.roundRect(x, y, width, height, radius);
}

function gameLoop(timestamp) {
    const elapsed = lastFrame ? Math.min(timestamp - lastFrame, 100) : 0;
    lastFrame = timestamp;
    updateVisualEffects(elapsed);
    if (gameState === "running" && resumeCountdown > 0) {
        tickResumeCountdown(elapsed);
    } else if (gameState === "running") {
        const wasFocused = focusRemaining > 0;
        const gameElapsed = elapsed * (wasFocused ? 0.55 : 1);
        rhythmClock += gameElapsed;
        updateTimedMechanics(gameElapsed);
        if (wasFocused) {
            focusRemaining = Math.max(0, focusRemaining - elapsed);
            if (focusRemaining === 0) updateFocus();
        }
        if (comboRemaining > 0) {
            comboRemaining = Math.max(0, comboRemaining - gameElapsed);
            if (comboRemaining === 0) {
                combo = 0;
                updateScore();
            }
        }
        if (echoRemaining > 0) {
            echoRemaining = Math.max(0, echoRemaining - gameElapsed);
            if (echoRemaining === 0 && food && food.type === "echo") {
                placeFood("normal");
                announce("Эхо исчезло. Появилась обычная точка.");
            }
        }
        const baseInterval = Math.max(72, 145 - Math.floor(score / 5) * 9);
        const modeSpeed = runModifier === runModifiers.tempo ? 0.85 : runModifier === runModifiers.hunter ? 0.96 : 1;
        const interval = baseInterval * modeSpeed * (wasFocused ? 1.8 : 1) * (nearMissRemaining > 0 ? 1.4 : 1);
        if (queuedDirection.x === 0 && queuedDirection.y === 0) {
            timeSinceStep = 0;
        } else {
            timeSinceStep += gameElapsed;
        }
        while (timeSinceStep >= interval && gameState === "running") {
            if (step()) {
                timeSinceStep = 0;
                break;
            }
            timeSinceStep -= interval;
        }
    }
    // Вне забега поле почти целиком закрыто оверлеем — 12 кадров в секунду достаточно.
    if (gameState === "running" || timestamp - lastIdleDraw >= 80) {
        lastIdleDraw = timestamp;
        draw();
    }
    drawAmbientBackground(timestamp);
    animationFrame = requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", event => {
    if (settingsDialog.open || restartDialog.open) return;

    if (gameState === "upgrade") {
        const slotButton = upgradeButtons[{ shield: 0, magnet: 1, double: 2 }[upgradeKeyCodes[event.code]]];
        const upgrade = slotButton && !slotButton.hidden ? slotButton.dataset.upgrade : undefined;
        if (upgrade && !event.ctrlKey && !event.metaKey && !event.altKey) {
            event.preventDefault();
            // Короткая защита: клавиша поворота, нажатая в момент появления окна, не выбирает усиление случайно.
            if (!event.repeat && performance.now() - upgradeOpenedAt >= upgradeKeyGuard) chooseUpgrade(upgrade);
            return;
        }
    }

    const keyDirections = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
        w: "up",
        W: "up",
        s: "down",
        S: "down",
        a: "left",
        A: "left",
        d: "right",
        D: "right"
    };

    const codeDirections = { KeyW: "up", KeyS: "down", KeyA: "left", KeyD: "right" };
    const keyDirection = keyDirections[event.key]
        || (!event.ctrlKey && !event.metaKey && !event.altKey ? codeDirections[event.code] : undefined);
    if (keyDirection) {
        event.preventDefault();
        setDirection(directions[keyDirection]);
    } else if (event.code === "Space") {
        event.preventDefault();
        if (gameState === "running" || gameState === "paused") pauseGame();
        else startGame();
    } else if (event.key.toLowerCase() === "f" || event.code === "KeyF") {
        event.preventDefault();
        activateFocus();
    } else if (event.code === "KeyQ" && !event.ctrlKey && !event.metaKey && !event.altKey) {
        event.preventDefault();
        cutTail();
    } else if (event.key.toLowerCase() === "e" || event.code === "KeyE") {
        event.preventDefault();
        togglePortals();
    } else if (event.key === "Escape" && gameState === "running") {
        pauseGame();
    }
});

document.querySelectorAll(".direction-button").forEach(button => {
    button.addEventListener("click", () => setDirection(directions[button.dataset.direction]));
});
upgradeButtons.forEach(button => {
    button.addEventListener("click", () => chooseUpgrade(button.dataset.upgrade));
});
themeButtons.forEach(button => {
    button.addEventListener("click", () => chooseTheme(button.dataset.theme));
});
modifierButtons.forEach(button => {
    button.addEventListener("click", () => chooseModifier(button.dataset.modifier));
});

// Свайпы по игровому полю: поворот срабатывает во время движения пальца,
// не дожидаясь отпускания, а точка отсчёта переносится — можно рисовать
// «змейку» одним непрерывным жестом.
let swipeGesture = null;
function swipeEnabled(event) {
    return preferences.swipe && event.pointerType !== "mouse" && gameState === "running";
}
function swipeThreshold() {
    return Math.max(14, Math.min(26, boardWrap.clientWidth * 0.045));
}
function showSwipePing(x, y, name) {
    if (preferences.effects || reducedMotionQuery.matches) return;
    const bounds = boardWrap.getBoundingClientRect();
    const ping = document.createElement("span");
    ping.className = "swipe-ping swipe-ping--" + name;
    ping.style.left = (x - bounds.left) + "px";
    ping.style.top = (y - bounds.top) + "px";
    ping.addEventListener("animationend", () => ping.remove());
    boardWrap.appendChild(ping);
}
let lastFieldTapAt = 0;
boardWrap.addEventListener("pointerdown", event => {
    if (!swipeEnabled(event)) return;
    if (swipeGesture) {
        // Второй палец на поле — выключить или включить порталы.
        if (event.pointerId !== swipeGesture.pointerId && !swipeGesture.multi) {
            swipeGesture.multi = true;
            if (portals.length === 2) {
                togglePortals();
                if (navigator.vibrate) navigator.vibrate(14);
            }
        }
        return;
    }
    swipeGesture = { x: event.clientX, y: event.clientY, pointerId: event.pointerId, startedAt: performance.now(), moved: false, multi: false };
    try { boardWrap.setPointerCapture(event.pointerId); } catch (error) { /* захват недоступен — не критично */ }
});
boardWrap.addEventListener("pointermove", event => {
    if (!swipeGesture || event.pointerId !== swipeGesture.pointerId) return;
    if (gameState !== "running") { swipeGesture = null; return; }
    const deltaX = event.clientX - swipeGesture.x;
    const deltaY = event.clientY - swipeGesture.y;
    if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < swipeThreshold()) return;
    const name = Math.abs(deltaX) > Math.abs(deltaY)
        ? (deltaX > 0 ? "right" : "left")
        : (deltaY > 0 ? "down" : "up");
    swipeGesture.x = event.clientX;
    swipeGesture.y = event.clientY;
    swipeGesture.moved = true;
    if (setDirection(directions[name])) {
        showSwipePing(event.clientX, event.clientY, name);
        if (navigator.vibrate) navigator.vibrate(8);
    }
});
function endSwipe(event) {
    if (!swipeGesture || event.pointerId !== swipeGesture.pointerId) return;
    const gesture = swipeGesture;
    swipeGesture = null;
    const now = performance.now();
    // Двойное касание поля — «Фокус».
    if (event.type !== "pointerup" || gesture.moved || gesture.multi || now - gesture.startedAt > 300) return;
    if (now - lastFieldTapAt < 340) {
        lastFieldTapAt = 0;
        if (gameState === "running" && focusCharges > 0 && focusRemaining === 0) {
            activateFocus();
            if (navigator.vibrate) navigator.vibrate([10, 40, 10]);
        }
    } else {
        lastFieldTapAt = now;
    }
}
boardWrap.addEventListener("pointerup", endSwipe);
boardWrap.addEventListener("pointercancel", endSwipe);
boardWrap.addEventListener("lostpointercapture", endSwipe);
// Пока идёт игра, жест по полю не должен прокручивать страницу.
boardWrap.addEventListener("touchmove", event => {
    if (preferences.swipe && gameState === "running" && event.cancelable) event.preventDefault();
}, { passive: false });

window.addEventListener("resize", resizeCanvas);
window.addEventListener("resize", resizeAmbientCanvas);
window.addEventListener("pagehide", flushRecordSaves);
document.addEventListener("visibilitychange", () => {
    if (document.hidden) flushRecordSaves();
});
resizeAmbientCanvas();
if (ambientCanvas) document.body.classList.add("has-ambient-canvas");
new ResizeObserver(resizeCanvas).observe(boardWrap);
startButton.addEventListener("click", startGame);
settingsButton.addEventListener("click", () => settingsDialog.showModal());
Object.entries(settingInputs).forEach(([key, input]) => {
    input.addEventListener("change", () => {
        preferences[key] = input.checked;
        savePreferences(key);
        applyPreferences();
        draw();
        if (key === "sound") {
            if (preferences.sound && gameState === "running") startSoundtrack();
            else stopSoundtrack();
            if (preferences.sound) playSound("pickup");
        }
    });
});
dismissTipButton.addEventListener("click", () => {
    gameTip.hidden = true;
    window.clearTimeout(gameTipTimeout);
});
summaryReplayButton.addEventListener("click", startGame);
summaryShareButton.addEventListener("click", shareResult);
tailCutButton.addEventListener("click", cutTail);
summaryModeButton.addEventListener("click", restartRound);
pauseButton.addEventListener("click", pauseGame);
focusButton.addEventListener("click", activateFocus);
dailyRunButton.addEventListener("click", startDailyRun);
portalControl.addEventListener("click", togglePortals);
restartButton.addEventListener("click", () => {
    if (gameState === "running" || gameState === "paused" || gameState === "upgrade") {
        stateBeforeRestartConfirmation = gameState;
        if (gameState === "running") pauseGame();
        restartDialog.showModal();
        return;
    }
    restartRound();
});
cancelRestartButton.addEventListener("click", cancelRestartConfirmation);
confirmRestartButton.addEventListener("click", () => {
    stateBeforeRestartConfirmation = null;
    restartDialog.close();
    restartRound();
});
restartDialog.addEventListener("cancel", event => {
    event.preventDefault();
    cancelRestartConfirmation();
});
restartDialog.addEventListener("close", () => {
    if (stateBeforeRestartConfirmation === "running") {
        stateBeforeRestartConfirmation = null;
        startGame();
        announce("Игра продолжается.");
    } else {
        stateBeforeRestartConfirmation = null;
    }
});

resetRound();
renderPlayerStats();
renderAchievements();
updateDailyRunLabel();
updateSelectedModeSummary();
applyPreferences();
runSetup.hidden = false;
overlay.classList.add("is-setup");
updateControls();
updateRewindLife();
draw();
animationFrame = requestAnimationFrame(gameLoop);

// Установка на телефон: service worker работает только по http(s), не при открытии файла с диска.
if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("sw.js").catch(error => {
            console.warn("Не удалось включить офлайн-режим.", error);
        });
    });
}
