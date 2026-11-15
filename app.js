// Fallback game data in case games.json fails to load via fetch
const DEFAULT_GAMES = [
  {
    id: "lltq",
    title: "Long Live The Queen",
    category: "story",
    tags: ["Visual Novel", "RPG", "Стратегия"],
    desc: "Управляйте принцессой Элоди, балансируйте между интригами двора, учите науки и выживите до коронации.",
    path: "games/lltq/index.html",
    thumb: "games/lltq/web-presplash.jpg",
    size: "90 MB"
  },
  {
    id: "2048",
    title: "2048",
    category: "puzzle",
    tags: ["Головоломка", "Логика"],
    desc: "Сдвигайте плитки с одинаковыми числами, объединяйте их и попробуйте собрать число 2048.",
    path: "games/2048/index.html",
    thumb: "games/2048/meta/apple-touch-icon.png",
    size: "< 1 MB"
  },
  {
    id: "hextris",
    title: "Hextris",
    category: "arcade",
    tags: ["Аркада", "Реакция"],
    desc: "Шестиугольный Тетрис на реакцию. Вращайте платформу и собирайте блоки одного цвета по 3 в ряд.",
    path: "games/hextris/index.html",
    thumb: "games/hextris/images/icons/apple-touch-180.png",
    size: "1 MB"
  },
  {
    id: "tetris",
    title: "Tetris Classic",
    category: "retro",
    tags: ["Ретро", "Классика"],
    desc: "Классический Тетрис на HTML5 Canvas: чистая физика, таблица очков и максимальная производительность.",
    path: "games/tetris/index.html",
    thumb: "games/tetris/texture.jpg",
    size: "< 1 MB"
  },
  {
    id: "snake",
    title: "Retro Snake",
    category: "retro",
    tags: ["Ретро", "Аркада"],
    desc: "Минималистичная змейка с сохранением рекордов. Ничего лишнего, запускается мгновенно.",
    path: "games/snake/index.html",
    thumb: "",
    size: "50 KB"
  },
  {
    id: "flappy",
    title: "Floppy Bird",
    category: "arcade",
    tags: ["Аркада", "Хардкор"],
    desc: "Тот самый Flappy Bird без рекламы и с чистым откликом на клики и пробел.",
    path: "games/flappy/index.html",
    thumb: "games/flappy/assets/thumb.png",
    size: "< 1 MB"
  }
];

// Presets for Tab Cloaker
const CLOAK_PRESETS = {
  none: {
    title: "HW Hub — Unblocked Games",
    favicon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎮</text></svg>"
  },
  dnevnik: {
    title: "Дневник.ру — Вход в электронный дневник",
    favicon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%231976d2'/><text x='50' y='68' font-size='50' text-anchor='middle' fill='white' font-family='sans-serif' font-weight='bold'>Д</text></svg>"
  },
  yaklass: {
    title: "ЯКласс — Главная страница",
    favicon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23e65100'/><text x='50' y='68' font-size='50' text-anchor='middle' fill='white' font-family='sans-serif' font-weight='bold'>Я</text></svg>"
  },
  ege: {
    title: "Образовательный портал для подготовки к экзаменам",
    favicon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%232b5797'/><text x='50' y='66' font-size='45' text-anchor='middle' fill='white' font-family='sans-serif' font-weight='bold'>ЕГЭ</text></svg>"
  },
  gdocs: {
    title: "Документ без названия - Google Документы",
    favicon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='16' fill='%234285F4'/><path d='M25 35h50M25 50h50M25 65h35' stroke='white' stroke-width='8' stroke-linecap='round'/></svg>"
  },
  wiki: {
    title: "Информатика — Википедия",
    favicon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23f6f6f6'/><text x='50' y='72' font-size='60' text-anchor='middle' fill='%23333333' font-family='serif' font-weight='bold'>W</text></svg>"
  }
};

let allGames = [];
let currentCategory = 'all';
let searchQuery = '';
let activeGame = null;

// Preferences
let userConfig = {
  cloakPreset: localStorage.getItem('hwhub_cloak') || 'none',
  panicKey: localStorage.getItem('hwhub_panic_key') || '\\',
  panicAction: localStorage.getItem('hwhub_panic_action') || 'decoy',
  favorites: JSON.parse(localStorage.getItem('hwhub_favorites') || '[]')
};

// DOM Elements
const gamesContainer = document.getElementById('games-container');
const searchInput = document.getElementById('search-input');
const categoryPills = document.getElementById('category-pills');
const playerView = document.getElementById('player-view');
const gameFrame = document.getElementById('game-frame');
const playerGameName = document.getElementById('player-game-name');
const decoyScreen = document.getElementById('decoy-screen');
const panicKeyBadge = document.getElementById('panic-key-badge');

// Modal Elements
const settingsModal = document.getElementById('settings-modal');
const openSettingsBtn = document.getElementById('open-settings-btn');
const closeSettingsBtn = document.getElementById('close-settings-btn');
const saveSettingsBtn = document.getElementById('save-settings-btn');
const cloakSelect = document.getElementById('cloak-preset-select');
const panicKeySelect = document.getElementById('panic-key-select');
const panicActionSelect = document.getElementById('panic-action-select');

// Initialization
async function init() {
  applyCloak(userConfig.cloakPreset);
  updatePanicBadge();

  try {
    const res = await fetch('games.json');
    if (res.ok) {
      allGames = await res.json();
    } else {
      allGames = DEFAULT_GAMES;
    }
  } catch (e) {
    allGames = DEFAULT_GAMES;
  }

  renderGames();
  setupEventListeners();
}

// Render Games Grid
function renderGames() {
  gamesContainer.innerHTML = '';

  const filtered = allGames.filter(game => {
    const matchesCat = (currentCategory === 'all')
      ? true
      : (currentCategory === 'fav')
        ? userConfig.favorites.includes(game.id)
        : game.category === currentCategory;

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q
      || game.title.toLowerCase().includes(q)
      || game.desc.toLowerCase().includes(q)
      || (game.tags && game.tags.some(t => t.toLowerCase().includes(q)));

    return matchesCat && matchesSearch;
  });

  if (filtered.length === 0) {
    gamesContainer.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
        <p style="font-size: 16px; margin-bottom: 8px;">Игры не найдены</p>
        <p style="font-size: 13px;">Попробуйте изменить поисковый запрос или выбрать другую категорию.</p>
      </div>
    `;
    return;
  }

  filtered.forEach(game => {
    const isFav = userConfig.favorites.includes(game.id);
    const card = document.createElement('div');
    card.className = 'game-card';

    const tagsHtml = (game.tags || []).map(t => `<span class="tag">${t}</span>`).join('');
    
    // Thumbnail or initials
    let mediaContent = '';
    if (game.thumb) {
      mediaContent = `<img class="card-thumb" src="${game.thumb}" alt="${game.title}" loading="lazy">`;
    } else {
      const initials = game.title.split(' ').map(w => w[0]).join('').slice(0, 3);
      mediaContent = `<div class="card-placeholder">${initials}</div>`;
    }

    card.innerHTML = `
      <div class="card-media">
        ${mediaContent}
        <span class="card-badge-size">${game.size || 'Web'}</span>
      </div>
      <div class="card-body">
        <div class="card-header">
          <h3 class="card-title">${game.title}</h3>
          <button class="card-fav-btn ${isFav ? 'active' : ''}" data-id="${game.id}" title="${isFav ? 'Удалить из избранного' : 'Добавить в избранное'}">
            ${isFav ? '★' : '☆'}
          </button>
        </div>
        <div class="card-tags">${tagsHtml}</div>
        <p class="card-desc">${game.desc}</p>
        <div class="card-actions">
          <button class="btn btn-primary play-btn" data-id="${game.id}">Играть</button>
          <button class="btn btn-stealth aboutblank-btn" data-id="${game.id}" title="Запустить в чистой вкладке about:blank">🕶️ Скрыто</button>
        </div>
      </div>
    `;

    gamesContainer.appendChild(card);
  });
}

// Launch Game in Embedded Runner
function launchGame(gameId) {
  const game = allGames.find(g => g.id === gameId);
  if (!game) return;

  activeGame = game;
  playerGameName.textContent = game.title;
  gameFrame.src = game.path;
  playerView.style.display = 'flex';

  // Attach panic listener to iframe if possible
  gameFrame.onload = () => {
    try {
      gameFrame.contentWindow.addEventListener('keydown', handleGlobalKeydown);
    } catch (e) {
      // Cross-origin restriction ignored if any
    }
  };
}

// Close Game Runner
function closePlayer() {
  playerView.style.display = 'none';
  gameFrame.src = 'about:blank';
  activeGame = null;
}

// Launch in about:blank (Stealth Mode)
function launchAboutBlank(gameId) {
  const game = allGames.find(g => g.id === gameId);
  if (!game) return;

  const win = window.open('about:blank', '_blank');
  if (!win) {
    alert('Браузер заблокировал всплывающее окно. Разрешите всплывающие окна для работы скрытого режима.');
    return;
  }

  const gameUrl = new URL(game.path, window.location.href).href;
  const cloak = CLOAK_PRESETS[userConfig.cloakPreset] || CLOAK_PRESETS.none;

  win.document.title = cloak.title;

  const link = win.document.createElement('link');
  link.rel = 'icon';
  link.href = cloak.favicon;
  win.document.head.appendChild(link);

  const style = win.document.createElement('style');
  style.textContent = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: hidden; background: #000; }
    iframe { width: 100vw; height: 100vh; border: none; display: block; }
  `;
  win.document.head.appendChild(style);

  const iframe = win.document.createElement('iframe');
  iframe.src = gameUrl;
  iframe.allow = 'autoplay; fullscreen; gamepad; focus-without-user-activation *';
  iframe.allowFullscreen = true;
  win.document.body.appendChild(iframe);

  // Bind panic key inside new tab
  win.addEventListener('keydown', (e) => {
    if (e.key === userConfig.panicKey) {
      win.location.replace('https://dnevnik.ru');
    }
  });
}

// Trigger Panic Action
function triggerPanic() {
  if (userConfig.panicAction === 'decoy') {
    // Show Decoy Screen
    decoyScreen.style.display = 'flex';
  } else if (userConfig.panicAction === 'dnevnik') {
    window.location.replace('https://dnevnik.ru');
  } else if (userConfig.panicAction === 'wiki') {
    window.location.replace('https://ru.wikipedia.org/wiki/Информатика');
  } else if (userConfig.panicAction === 'ege') {
    window.location.replace('https://inf-ege.sdamgia.ru/');
  }
}

// Tab Cloak Handler
function applyCloak(presetKey) {
  const preset = CLOAK_PRESETS[presetKey] || CLOAK_PRESETS.none;
  document.title = preset.title;

  let faviconEl = document.getElementById('favicon');
  if (!faviconEl) {
    faviconEl = document.createElement('link');
    faviconEl.id = 'favicon';
    faviconEl.rel = 'icon';
    document.head.appendChild(faviconEl);
  }
  faviconEl.href = preset.favicon;
}

function updatePanicBadge() {
  if (panicKeyBadge) {
    panicKeyBadge.textContent = userConfig.panicKey;
  }
}

// Global Keydown Handler (Panic Key)
function handleGlobalKeydown(e) {
  if (e.key === userConfig.panicKey) {
    e.preventDefault();
    if (decoyScreen.style.display === 'flex') {
      decoyScreen.style.display = 'none';
    } else {
      triggerPanic();
    }
  } else if (e.key === 'Escape' && userConfig.panicKey !== 'Escape') {
    if (decoyScreen.style.display === 'flex') {
      decoyScreen.style.display = 'none';
    }
  }
}

// Setup Event Listeners
function setupEventListeners() {
  // Global Panic Key Listener
  window.addEventListener('keydown', handleGlobalKeydown);

  // Search input
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderGames();
  });

  // Category filter pills
  categoryPills.addEventListener('click', (e) => {
    const pill = e.target.closest('.pill');
    if (!pill) return;

    categoryPills.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');

    currentCategory = pill.dataset.category;
    renderGames();
  });

  // Card clicks (Delegation)
  gamesContainer.addEventListener('click', (e) => {
    const favBtn = e.target.closest('.card-fav-btn');
    if (favBtn) {
      const id = favBtn.dataset.id;
      if (userConfig.favorites.includes(id)) {
        userConfig.favorites = userConfig.favorites.filter(f => f !== id);
      } else {
        userConfig.favorites.push(id);
      }
      localStorage.setItem('hwhub_favorites', JSON.stringify(userConfig.favorites));
      renderGames();
      return;
    }

    const playBtn = e.target.closest('.play-btn');
    if (playBtn) {
      launchGame(playBtn.dataset.id);
      return;
    }

    const aboutBlankBtn = e.target.closest('.aboutblank-btn');
    if (aboutBlankBtn) {
      launchAboutBlank(aboutBlankBtn.dataset.id);
      return;
    }
  });

  // Player view buttons
  document.getElementById('player-back-btn').addEventListener('click', closePlayer);
  document.getElementById('player-reload-btn').addEventListener('click', () => {
    if (activeGame) gameFrame.src = activeGame.path;
  });
  document.getElementById('player-aboutblank-btn').addEventListener('click', () => {
    if (activeGame) {
      const id = activeGame.id;
      closePlayer();
      launchAboutBlank(id);
    }
  });
  document.getElementById('player-fullscreen-btn').addEventListener('click', () => {
    if (!document.fullscreenElement) {
      playerView.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  });
  document.getElementById('player-panic-btn').addEventListener('click', triggerPanic);
  document.getElementById('panic-btn').addEventListener('click', triggerPanic);

  // Decoy screen exit
  document.getElementById('decoy-exit-btn').addEventListener('click', () => {
    decoyScreen.style.display = 'none';
  });

  // Settings Modal Handlers
  openSettingsBtn.addEventListener('click', () => {
    cloakSelect.value = userConfig.cloakPreset;
    panicKeySelect.value = userConfig.panicKey;
    panicActionSelect.value = userConfig.panicAction;
    settingsModal.style.display = 'flex';
  });

  closeSettingsBtn.addEventListener('click', () => {
    settingsModal.style.display = 'none';
  });

  settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
      settingsModal.style.display = 'none';
    }
  });

  saveSettingsBtn.addEventListener('click', () => {
    userConfig.cloakPreset = cloakSelect.value;
    userConfig.panicKey = panicKeySelect.value;
    userConfig.panicAction = panicActionSelect.value;

    localStorage.setItem('hwhub_cloak', userConfig.cloakPreset);
    localStorage.setItem('hwhub_panic_key', userConfig.panicKey);
    localStorage.setItem('hwhub_panic_action', userConfig.panicAction);

    applyCloak(userConfig.cloakPreset);
    updatePanicBadge();
    settingsModal.style.display = 'none';
  });
}

// Start
init();
