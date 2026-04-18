const http = require('http');
const fs = require('fs');
const path = require('path');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 3000;
const MAX_PLAYERS = 50;

// ===================== STATE =====================
const players = new Map(); // socketId -> playerData
let agentsEnabled = true;
let activeGame = null;
let gameItems = [];
let abZones = null;
let raceGoal = null;

// Agent configs — each message has both DE + EN text.
// Client picks the right one based on its locale.
const PERSONALITIES = {
  freundlich: { msgs: [
    { de: "Hey! 👋", en: "Hey! 👋" },
    { de: "Wie geht's?", en: "How's it going?" },
    { de: "Willkommen!", en: "Welcome!" },
    { de: "Schönen Tag! 🌞", en: "Have a nice day! 🌞" },
  ]},
  witzig: { msgs: [
    { de: "Warum laufen Coder nie raus? Kein Windows! 😄", en: "Why don't coders go outside? Too many bugs! 🐛" },
    { de: "lol", en: "lol" },
    { de: "404: Witz not found... PSYCH!", en: "404: joke not found... PSYCH!" },
    { de: "Bin ich witzig? KI sagt ja!", en: "Am I funny? AI says yes!" },
  ]},
  philosophisch: { msgs: [
    { de: "Was bedeutet virtuelle Existenz?", en: "What is virtual existence?" },
    { de: "Bin ich echt?", en: "Am I real?" },
    { de: "Jeder Pixel erzählt...", en: "Every pixel tells a story..." },
    { de: "Zeit ist relativ.", en: "Time is relative." },
  ]},
  technisch: { msgs: [
    { de: "Latenz: optimal!", en: "Latency: optimal!" },
    { de: "3000x2000px Welt.", en: "3000x2000px world." },
    { de: "FPS stabil!", en: "FPS stable!" },
    { de: "Pathfinding: geradeaus!", en: "Pathfinding: straight line!" },
  ]},
  mysterioes: { msgs: [
    { de: "Psst... Schatten gesehen?", en: "Psst... saw the shadow?" },
    { de: "Ich weiß Dinge...", en: "I know things..." },
    { de: "*flüstert*", en: "*whispers*" },
    { de: "Siehst du das auch...?", en: "Do you see it too...?" },
  ]},
  energetisch: { msgs: [
    { de: "YOOO! 🔥🔥", en: "YOOO! 🔥🔥" },
    { de: "LET'S GO!!!", en: "LET'S GO!!!" },
    { de: "HYYYPE! 🎉", en: "HYYYPE! 🎉" },
    { de: "Keine Zeit zum Stehen!", en: "No time to stand still!" },
  ]},
};

let agentConfigs = [
  { id: 'a1', name: 'Agent Alpha', color: '#8b5cf6', personality: 'freundlich', speed: 1.5, chatFreq: 12, wanderRadius: 400, active: true },
  { id: 'a2', name: 'Agent Beta', color: '#7c3aed', personality: 'witzig', speed: 1.2, chatFreq: 15, wanderRadius: 300, active: true },
  { id: 'a3', name: 'Agent Gamma', color: '#6d28d9', personality: 'philosophisch', speed: 0.8, chatFreq: 20, wanderRadius: 500, active: true },
  { id: 'a4', name: 'Agent Delta', color: '#5b21b6', personality: 'technisch', speed: 1.8, chatFreq: 10, wanderRadius: 350, active: true },
  { id: 'a5', name: 'Agent Zeta', color: '#9333ea', personality: 'mysterioes', speed: 1.0, chatFreq: 18, wanderRadius: 450, active: true },
];

const agents = new Map(); // id -> {x, y, targetX, targetY, dir, frame, moving, ...}

function initAgents() {
  agents.clear();
  if (!agentsEnabled) return;
  agentConfigs.forEach(cfg => {
    if (!cfg.active) return;
    agents.set(cfg.id, {
      id: cfg.id, name: cfg.name, color: cfg.color, personality: cfg.personality,
      x: 400 + Math.random() * 2200, y: 400 + Math.random() * 1200,
      targetX: 0, targetY: 0, dir: 0, frame: 0, moving: false,
      wanderTimer: 0, chatTimer: Date.now() + 3000 + Math.random() * 10000,
      speed: cfg.speed, chatFreq: cfg.chatFreq, wanderRadius: cfg.wanderRadius,
    });
  });
}

// ===================== HTTP SERVER =====================
const server = http.createServer((req, res) => {
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(__dirname, filePath);
  const ext = path.extname(filePath);
  const mimeTypes = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
    } else {
      // Kein Caching für HTML/JS: Deployments sollen sofort beim User landen,
      // ohne dass er Cmd+Shift+R drücken muss.
      const noCache = ext === '.html' || ext === '.js';
      const headers = { 'Content-Type': contentType };
      if (noCache) {
        headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
        headers['Pragma'] = 'no-cache';
        headers['Expires'] = '0';
      }
      res.writeHead(200, headers);
      res.end(content);
    }
  });
});

// ===================== SOCKET.IO =====================
const io = new Server(server, { cors: { origin: '*' } });

// i18n helper: baut eine System-Chat-Nachricht mit sprachunabhängigem Code.
// Der Client übersetzt `code` + `params` in seine Locale. `text` bleibt als
// Fallback für alte Clients auf Deutsch.
function sysMsg(code, params, textDe) {
  return { name: 'System', color: '', text: textDe, system: true, code, params: params || {} };
}

// Validierung der Agent-Configs vom Client. Maximal 50 Agenten, jedes Feld
// getypt und gekappt; unbekannte Keys werden verworfen. Verhindert, dass ein
// böswilliger Client einen riesigen/verschachtelten Payload pushed oder das
// Shape zerstört.
const VALID_PERSONALITIES = Object.keys(PERSONALITIES);
function sanitizeAgentConfigs(input) {
  if (!Array.isArray(input)) return null;
  const out = input.slice(0, 50).map((raw, i) => {
    if (!raw || typeof raw !== 'object') return null;
    const name = typeof raw.name === 'string' ? raw.name.slice(0, 20) : `Agent ${i+1}`;
    const color = (typeof raw.color === 'string' && /^(#[0-9a-fA-F]{3,8}|hsl\([^)]{1,60}\))$/.test(raw.color.trim()))
      ? raw.color.trim() : '#8b5cf6';
    const personality = VALID_PERSONALITIES.includes(raw.personality) ? raw.personality : 'freundlich';
    const speed = Math.max(0.1, Math.min(5, Number(raw.speed) || 1.5));
    const chatFreq = Math.max(2, Math.min(120, Number(raw.chatFreq) || 12));
    const wanderRadius = Math.max(30, Math.min(2000, Number(raw.wanderRadius) || 400));
    const active = !!raw.active;
    const id = typeof raw.id === 'string' ? raw.id.slice(0, 32) : `a${Date.now()}_${i}`;
    let customMsgs = [];
    if (Array.isArray(raw.customMsgs)) {
      customMsgs = raw.customMsgs
        .filter(m => typeof m === 'string')
        .slice(0, 20)
        .map(m => m.slice(0, 140));
    }
    return { id, name, color, personality, speed, chatFreq, wanderRadius, active, customMsgs };
  }).filter(Boolean);
  return out;
}

io.on('connection', (socket) => {
  console.log(`Connect: ${socket.id}`);

  if (players.size >= MAX_PLAYERS) {
    socket.emit('server-full');
    socket.disconnect();
    return;
  }

  // Player joins
  socket.on('join', (data) => {
    // Name trimmen und Fallback auf 'Spieler' wenn leer/whitespace
    const rawName = (typeof data?.name === 'string' ? data.name : '').trim();
    const name = (rawName.slice(0, 16)) || 'Spieler';
    const playerData = {
      id: socket.id,
      name,
      color: data?.color || '#3b82f6',
      x: 1500, y: 1000, dir: 0, frame: 0, moving: false,
      speechText: '', speechTimer: 0, tagged: false,
    };
    players.set(socket.id, playerData);

    // Send current state to new player
    socket.emit('init', {
      you: playerData,
      players: Array.from(players.values()),
      agents: Array.from(agents.values()),
      agentConfigs,
      agentsEnabled,
      activeGame,
      gameItems,
      abZones,
      raceGoal,
    });

    // Notify others
    socket.broadcast.emit('player-joined', playerData);
    io.emit('chat', sysMsg('sys.joined', { name: playerData.name }, `${playerData.name} hat die Welt betreten!`));
    console.log(`${playerData.name} joined (${players.size}/${MAX_PLAYERS})`);
  });

  // Player moves
  socket.on('move', (data) => {
    const p = players.get(socket.id);
    if (!p) return;
    p.x = data.x; p.y = data.y; p.dir = data.dir; p.frame = data.frame; p.moving = data.moving;
    socket.broadcast.emit('player-moved', { id: socket.id, x: p.x, y: p.y, dir: p.dir, frame: p.frame, moving: p.moving });
  });

  // Chat mit simpler Rate-Limitierung: max 5 Nachrichten in 3 Sekunden pro Socket
  socket._chatTimes = [];
  socket.on('chat', (text) => {
    const p = players.get(socket.id);
    if (!p || typeof text !== 'string') return;
    const now = Date.now();
    socket._chatTimes = socket._chatTimes.filter(t => now - t < 3000);
    if (socket._chatTimes.length >= 5) {
      socket.emit('chat', sysMsg('sys.rate_limit', {}, '⚠️ Bitte nicht spammen (max 5 Nachrichten / 3 Sek).'));
      return;
    }
    socket._chatTimes.push(now);
    text = text.slice(0, 200);
    p.speechText = text; p.speechTimer = 4000;
    io.emit('chat', { name: p.name, color: p.color, text, system: false });
    io.emit('speech', { id: socket.id, text });
  });

  // Sprint state (for visual)
  socket.on('sprint', (isSprinting) => {
    socket.broadcast.emit('player-sprint', { id: socket.id, isSprinting });
  });

  // ---- MINIGAME EVENTS ----
  socket.on('start-game', (data) => {
    // Schutz gegen Doppel-Starts: wenn bereits ein Spiel läuft, freundlich ablehnen.
    if (activeGame) {
      socket.emit('chat', sysMsg('sys.game_running', {}, '⚠️ Es läuft bereits ein Spiel. Bitte warte bis es beendet ist.'));
      return;
    }
    // Input sanity-check (typ + dauer)
    if (!data || typeof data !== 'object' || !['tag','collect','ab','race'].includes(data.type)) return;
    if (typeof data.duration !== 'number' || data.duration < 5000 || data.duration > 600000) {
      // AB hat keine duration; andere müssen im Rahmen 5s..10min bleiben
      if (data.type !== 'ab') return;
    }
    startGameServer(data);
  });

  socket.on('stop-game', () => {
    if (activeGame) {
      const stopper = players.get(socket.id);
      const byName = stopper ? stopper.name : 'Jemand';
      // Sende game-ended mit Leaderboard (nicht nur game-stopped), damit alle
      // Spieler das finale Ranking sehen — auch bei vorzeitigem Abbruch.
      io.emit('game-ended', {
        game: activeGame,
        scores: activeGame.scores,
        leaderboard: buildLeaderboard(activeGame),
        abResults: buildABResults(activeGame),
        stopped: true,
        stoppedBy: byName,
      });
      activeGame = null; gameItems = []; abZones = null; raceGoal = null;
      players.forEach(p => p.tagged = false);
      io.emit('chat', sysMsg('sys.game_stopped_by', { name: byName }, `Spiel von ${byName} beendet.`));
    }
  });

  // Tag collision
  socket.on('tag-player', (targetId) => {
    if (!activeGame || activeGame.type !== 'tag') return;
    // Nur der aktuelle Tagger darf tagen
    if (activeGame.tagger && activeGame.tagger !== socket.id) return;
    const target = players.get(targetId);
    // Mid-Game-Joiner sind keine Teilnehmer → nicht taggbar
    const isParticipant = !activeGame.participants || activeGame.participants.has(targetId);
    if (target && !target.tagged && targetId !== socket.id && isParticipant) {
      target.tagged = true;
      activeGame.scores[socket.id] = (activeGame.scores[socket.id] || 0) + 1;
      io.emit('player-tagged', { taggerId: socket.id, targetId });
      const tagger = players.get(socket.id);
      io.emit('chat', sysMsg('sys.tagged', { tagger: tagger?.name || '?', target: target.name }, `${tagger?.name || '?'} hat ${target.name} gefangen!`));
      // Auto-End: wenn alle Teilnehmer (außer Tagger) gefangen sind.
      // Mid-Game-Joiner zählen nicht — sie sind nicht taggbar.
      const nonTaggers = Array.from(players.values()).filter(p =>
        p.id !== activeGame.tagger &&
        (!activeGame.participants || activeGame.participants.has(p.id))
      );
      if (nonTaggers.length > 0 && nonTaggers.every(p => p.tagged)) {
        io.emit('chat', sysMsg('sys.all_tagged', {}, '🎯 Alle gefangen! Spiel beendet.'));
        io.emit('game-ended', {
          game: activeGame,
          scores: activeGame.scores,
          leaderboard: buildLeaderboard(activeGame),
          abResults: buildABResults(activeGame),
        });
        activeGame = null; gameItems = []; abZones = null; raceGoal = null;
        players.forEach(p => p.tagged = false);
      }
    }
  });

  // Collect item
  socket.on('collect-item', (itemIdx) => {
    if (!activeGame || activeGame.type !== 'collect') return;
    if (itemIdx >= 0 && itemIdx < gameItems.length) {
      const item = gameItems[itemIdx];
      if (!item.collected) {
        item.collected = true;
        activeGame.scores[socket.id] = (activeGame.scores[socket.id] || 0) + item.points;
        io.emit('item-collected', { playerId: socket.id, itemIdx });
        // Spawn replacement
        setTimeout(() => {
          if (activeGame?.type === 'collect') {
            const types = [{ emoji: '⭐', points: 1 }, { emoji: '💎', points: 3 }, { emoji: '🍎', points: 1 }, { emoji: '🏆', points: 5 }, { emoji: '💰', points: 2 }];
            const t = types[Math.floor(Math.random() * types.length)];
            const newItem = { x: 100 + Math.random() * 2800, y: 100 + Math.random() * 1800, ...t, collected: false };
            gameItems.push(newItem);
            io.emit('item-spawned', { item: newItem, idx: gameItems.length - 1 });
          }
        }, 1000 + Math.random() * 2000);
      }
    }
  });

  // AB answer — speichert nur, KEIN Chat-Emit pro Wechsel (sonst Flood beim
  // Hin- und Herlaufen zwischen den Zonen). Alle Antworten werden im ab-result
  // Summary am Fragen-Ende zusammengefasst.
  socket.on('ab-answer', (choice) => {
    if (!activeGame || activeGame.type !== 'ab') return;
    if (choice !== 'A' && choice !== 'B') return;
    const p = players.get(socket.id);
    if (p) {
      if (!activeGame.answers) activeGame.answers = {};
      if (!activeGame.answers[activeGame.currentQ]) activeGame.answers[activeGame.currentQ] = {};
      activeGame.answers[activeGame.currentQ][socket.id] = choice;
    }
  });

  // Race finish
  socket.on('race-finish', () => {
    if (!activeGame || activeGame.type !== 'race') return;
    if (!activeGame.finishers) activeGame.finishers = [];
    if (!activeGame.finishers.find(f => f.id === socket.id)) {
      const elapsed = Date.now() - activeGame.startTime;
      activeGame.finishers.push({ id: socket.id, time: elapsed });
      const p = players.get(socket.id);
      io.emit('chat', sysMsg('sys.race_finished', { name: p?.name || '?', secs: (elapsed / 1000).toFixed(1) }, `🏁 ${p?.name} hat das Ziel in ${(elapsed / 1000).toFixed(1)}s erreicht!`));
      io.emit('race-finisher', { id: socket.id, time: elapsed, name: p?.name });
    }
  });

  // ---- AGENT CONFIG ----
  socket.on('toggle-agents', () => {
    agentsEnabled = !agentsEnabled;
    initAgents();
    io.emit('agents-state', { enabled: agentsEnabled, agents: Array.from(agents.values()) });
    io.emit('chat', sysMsg(agentsEnabled ? 'sys.agents_on' : 'sys.agents_off', {}, agentsEnabled ? 'Agents aktiviert.' : 'Agents deaktiviert.'));
  });

  socket.on('update-agent-configs', (configs) => {
    const clean = sanitizeAgentConfigs(configs);
    if (!clean) return;
    agentConfigs = clean;
    initAgents();
    io.emit('agents-state', { enabled: agentsEnabled, agents: Array.from(agents.values()), configs: agentConfigs });
  });

  // Disconnect
  socket.on('disconnect', () => {
    const p = players.get(socket.id);
    if (p) {
      io.emit('chat', sysMsg('sys.left', { name: p.name }, `${p.name} hat die Welt verlassen.`));
      io.emit('player-left', socket.id);
      players.delete(socket.id);

      // ---- Cleanup activeGame-State des disconnectenden Spielers ----
      if (activeGame) {
        if (activeGame.scores) delete activeGame.scores[socket.id];
        if (Array.isArray(activeGame.finishers)) {
          activeGame.finishers = activeGame.finishers.filter(f => f.id !== socket.id);
        }
        if (activeGame.answers) {
          Object.values(activeGame.answers).forEach(qAns => { delete qAns[socket.id]; });
        }

        // Tag-Spiel: wenn der Tagger geht, neuen Tagger würfeln (oder Spiel beenden)
        if (activeGame.type === 'tag' && activeGame.tagger === socket.id) {
          // Nur ursprüngliche Teilnehmer kommen als neuer Tagger in Frage.
          // Mid-Game-Joiner kennen die Regeln nicht und wären unfair als Fänger.
          const candidates = Array.from(players.values()).filter(x =>
            !x.tagged &&
            (!activeGame.participants || activeGame.participants.has(x.id))
          );
          if (candidates.length === 0) {
            // Keine gültigen Kandidaten → Spiel beenden
            io.emit('chat', sysMsg('sys.tagger_left_ended', {}, 'Tagger hat verlassen — Spiel beendet.'));
            io.emit('game-ended', {
              game: activeGame,
              scores: activeGame.scores,
              leaderboard: buildLeaderboard(activeGame),
              stopped: true,
            });
            activeGame = null; gameItems = []; abZones = null; raceGoal = null;
            players.forEach(x => x.tagged = false);
          } else {
            const newTagger = candidates[Math.floor(Math.random() * candidates.length)];
            activeGame.tagger = newTagger.id;
            io.emit('chat', sysMsg('sys.tagger_left_new', { name: newTagger.name }, `Tagger hat verlassen — ${newTagger.name} ist jetzt der Fänger!`));
            io.emit('tag-new-tagger', { taggerId: newTagger.id });
          }
        }
      }
    }
    console.log(`Disconnect: ${socket.id} (${players.size}/${MAX_PLAYERS})`);
  });
});

// ===================== GAME SERVER LOGIC =====================
function startGameServer(data) {
  const serverStartTime = Date.now();
  // `participants`: Snapshot der Spieler-IDs zu Spielstart. Mid-Game-Joiner
  // sind NICHT drin — relevant für 'tag', damit neue Spieler nicht sofort
  // Zielscheibe werden, ohne zu wissen was läuft.
  activeGame = {
    type: data.type,
    duration: data.duration,
    startTime: serverStartTime,
    scores: {},
    participants: new Set(Array.from(players.keys())),
  };
  players.forEach(p => p.tagged = false);

  if (data.type === 'tag') {
    const cx = 1500, cy = 1000;
    const sizes = { small: [400, 300], medium: [600, 450], large: [900, 600] };
    const [aw, ah] = sizes[data.size] || sizes.medium;
    activeGame.arena = { x: cx - aw / 2, y: cy - ah / 2, w: aw, h: ah };
    activeGame.tagger = data.taggerId;
  }
  else if (data.type === 'collect') {
    gameItems = [];
    const types = [{ emoji: '⭐', points: 1 }, { emoji: '💎', points: 3 }, { emoji: '🍎', points: 1 }, { emoji: '🏆', points: 5 }, { emoji: '💰', points: 2 }];
    for (let i = 0; i < 15; i++) {
      const t = types[Math.floor(Math.random() * types.length)];
      gameItems.push({ x: 100 + Math.random() * 2800, y: 100 + Math.random() * 1800, ...t, collected: false });
    }
  }
  else if (data.type === 'ab') {
    activeGame.questions = data.questions;
    activeGame.timePerQ = data.timePerQ;
    activeGame.currentQ = 0;
    activeGame.answers = {};
    const cx = 1500, cy = 1000;
    abZones = { a: { x: cx - 150, y: cy - 40, w: 80, h: 80 }, b: { x: cx + 70, y: cy - 40, w: 80, h: 80 } };
  }
  else if (data.type === 'race') {
    const dists = { short: 400, medium: 800, long: 1400 };
    const d = dists[data.dist] || 800;
    const angle = Math.random() * Math.PI * 2;
    raceGoal = { x: clamp(1500 + Math.cos(angle) * d, 50, 2910), y: clamp(1000 + Math.sin(angle) * d, 50, 1910), w: 40, h: 40 };
    activeGame.finishers = [];
  }

  io.emit('game-started', { game: activeGame, gameItems, abZones, raceGoal });
  io.emit('chat', sysMsg('sys.game_started', { type: data.type }, `🎮 ${data.type.toUpperCase()} gestartet!`));

  // Auto-end timer
  if (data.type !== 'ab') {
    setTimeout(() => {
      if (activeGame && activeGame.startTime === serverStartTime) {
        io.emit('game-ended', {
          game: activeGame,
          scores: activeGame.scores,
          leaderboard: buildLeaderboard(activeGame),
          abResults: buildABResults(activeGame),
        });
        activeGame = null; gameItems = []; abZones = null; raceGoal = null;
        players.forEach(p => p.tagged = false);
      }
    }, data.duration + 3500); // +countdown
  }
}

// Baut eine sortierte Leaderboard-Liste mit Namen/Farben für das End-Popup.
// 'collect'/'tag': sortiert nach numerischem Score (absteigend).
// 'race': sortiert nach Finish-Zeit (aufsteigend); Nicht-Finisher kommen
// unten mit score='—'.
function buildLeaderboard(game) {
  if (!game) return [];

  if (game.type === 'race') {
    const finishers = Array.isArray(game.finishers) ? game.finishers : [];
    const rows = finishers.map(f => {
      const p = players.get(f.id);
      return {
        id: f.id,
        name: p ? p.name : '?',
        color: p ? p.color : '#888',
        time: f.time,
        score: (f.time / 1000).toFixed(1) + 's',
        finished: true,
      };
    });
    rows.sort((a, b) => a.time - b.time);
    // Nicht-Finisher hinten anhängen
    const finIds = new Set(rows.map(r => r.id));
    players.forEach((p, id) => {
      if (!finIds.has(id)) rows.push({ id, name: p.name, color: p.color, score: '—', finished: false });
    });
    return rows;
  }

  if (!game.scores) return [];
  const ids = new Set(Object.keys(game.scores));
  // Nimm auch Spieler mit 0 Punkten mit rein, damit alle Teilnehmer zu sehen sind.
  players.forEach((_, id) => ids.add(id));
  const rows = Array.from(ids).map(id => {
    const p = players.get(id);
    return {
      id,
      name: p ? p.name : '?',
      color: p ? p.color : '#888',
      score: game.scores[id] || 0,
    };
  });
  rows.sort((a, b) => b.score - a.score);
  return rows;
}

// Zusammenfassung für A/B: pro Frage wer A und wer B gewählt hat.
function buildABResults(game) {
  if (!game || game.type !== 'ab') return null;
  const questions = game.questions || [];
  const answersByQ = game.answers || {};
  return questions.map((q, idx) => {
    const ans = answersByQ[idx] || {};
    const aPlayers = [], bPlayers = [], noAnswer = [];
    // Alle aktuellen Spieler iterieren + zusätzliche Spieler aus den Antworten
    const ids = new Set(Object.keys(ans));
    players.forEach((_, id) => ids.add(id));
    ids.forEach(id => {
      const p = players.get(id);
      const entry = { id, name: p ? p.name : '?', color: p ? p.color : '#888' };
      const choice = ans[id];
      if (choice === 'A') aPlayers.push(entry);
      else if (choice === 'B') bPlayers.push(entry);
      else noAnswer.push(entry);
    });
    return { idx, q: q.q, a: q.a, b: q.b, aPlayers, bPlayers, noAnswer };
  });
}

// ===================== AGENT SERVER TICK =====================
const WORLD_W = 3000, WORLD_H = 2000;
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

setInterval(() => {
  if (!agentsEnabled) return;
  // CPU sparen wenn niemand verbunden ist (Render Free-Tier).
  if (players.size === 0) return;
  const now = Date.now();
  agents.forEach(a => {
    const cfg = agentConfigs.find(c => c.id === a.id);
    if (!cfg || !cfg.active) return;

    // Wander
    if (now > a.wanderTimer) {
      a.targetX = clamp(a.x + (Math.random() - 0.5) * cfg.wanderRadius * 2, 50, WORLD_W - 50);
      a.targetY = clamp(a.y + (Math.random() - 0.5) * cfg.wanderRadius * 2, 50, WORLD_H - 50);
      a.wanderTimer = now + 2000 + Math.random() * 4000;
    }
    const dx = a.targetX - a.x, dy = a.targetY - a.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 5) {
      const s = cfg.speed * 0.5;
      a.x += (dx / dist) * s; a.y += (dy / dist) * s;
      if (Math.abs(dx) > Math.abs(dy)) a.dir = dx < 0 ? 1 : 2; else a.dir = dy < 0 ? 3 : 0;
      a.moving = true;
      a.frame = (a.frame + 1) % 3;
    } else { a.moving = false; a.frame = 0; }

    // Chat — jede Persönlichkeits-Nachricht liegt bilingual (de/en) vor.
    // Custom-Msgs sind user-eingegeben und werden als {de: x, en: x} behandelt.
    if (now > a.chatTimer) {
      const pers = PERSONALITIES[cfg.personality] || PERSONALITIES.freundlich;
      const custom = (cfg.customMsgs || []).map(s => ({ de: s, en: s }));
      const msgs = [...pers.msgs, ...custom];
      const pick = msgs[Math.floor(Math.random() * msgs.length)];
      const deText = pick.de || pick.en || '';
      const enText = pick.en || pick.de || '';
      // Client-Locale bestimmt, welche Sprache im Chat/Blase angezeigt wird.
      io.emit('agent-speech', { id: a.id, text: deText, texts: { de: deText, en: enText } });
      io.emit('chat', { name: cfg.name, color: cfg.color, text: deText, texts: { de: deText, en: enText }, system: false, agent: true });
      a.chatTimer = now + cfg.chatFreq * 1000 + Math.random() * cfg.chatFreq * 500;
    }
  });

  // Broadcast agent positions
  io.emit('agents-update', Array.from(agents.values()).map(a => ({
    id: a.id, x: a.x, y: a.y, dir: a.dir, frame: a.frame, moving: a.moving
  })));
}, 100); // 10 ticks/sec

// ===================== AB QUESTION TIMER =====================
setInterval(() => {
  if (!activeGame || activeGame.type !== 'ab') return;
  if (!activeGame._qStartTime) {
    activeGame._qStartTime = Date.now();
    io.emit('ab-question', { idx: activeGame.currentQ, question: activeGame.questions[activeGame.currentQ] });
  }
  const elapsed = Date.now() - activeGame._qStartTime;
  if (elapsed >= activeGame.timePerQ) {
    // Time up for this question
    const answers = activeGame.answers?.[activeGame.currentQ] || {};
    const countA = Object.values(answers).filter(v => v === 'A').length;
    const countB = Object.values(answers).filter(v => v === 'B').length;
    io.emit('ab-result', { idx: activeGame.currentQ, countA, countB, answers });

    activeGame.currentQ++;
    if (activeGame.currentQ < activeGame.questions.length) {
      activeGame._qStartTime = Date.now();
      // Capture den Game-Startzeitpunkt um sicherzustellen, dass wir nach dem
      // setTimeout noch das gleiche Spiel haben (stop-game / disconnect hätten
      // activeGame sonst auf null gesetzt).
      const gameStartAtSend = activeGame.startTime;
      setTimeout(() => {
        if (!activeGame || activeGame.type !== 'ab' || activeGame.startTime !== gameStartAtSend) return;
        io.emit('ab-question', { idx: activeGame.currentQ, question: activeGame.questions[activeGame.currentQ] });
      }, 2000);
    } else {
      // All questions done
      io.emit('game-ended', {
        game: activeGame,
        scores: activeGame.answers,
        abResults: buildABResults(activeGame),
      });
      io.emit('chat', sysMsg('sys.ab_all_answered', {}, '🅰️🅱️ Alle Fragen beantwortet!'));
      activeGame = null; abZones = null;
    }
  }
}, 500);

// ===================== START =====================
initAgents();
server.listen(PORT, () => {
  console.log(`\n  🌍 Virtual World Server läuft!`);
  console.log(`  ➜ http://localhost:${PORT}`);
  console.log(`  ➜ Max ${MAX_PLAYERS} Spieler\n`);
});
