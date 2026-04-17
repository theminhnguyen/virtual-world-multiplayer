const http = require('http');
const fs = require('fs');
const path = require('path');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 3000;
const MAX_PLAYERS = 20;

// ===================== STATE =====================
const players = new Map(); // socketId -> playerData
let agentsEnabled = true;
let activeGame = null;
let gameItems = [];
let abZones = null;
let raceGoal = null;

// Agent configs
const PERSONALITIES = {
  freundlich: { msgs: ["Hey! 👋", "Wie geht's?", "Willkommen!", "Schönen Tag! 🌞"] },
  witzig: { msgs: ["Warum laufen Coder nie raus? Kein Windows! 😄", "lol", "404: Witz not found... PSYCH!", "Bin ich witzig? KI sagt ja!"] },
  philosophisch: { msgs: ["Was bedeutet virtuelle Existenz?", "Bin ich echt?", "Jeder Pixel erzählt...", "Zeit ist relativ."] },
  technisch: { msgs: ["Latenz: optimal!", "3000x2000px Welt.", "FPS stabil!", "Pathfinding: geradeaus!"] },
  mysterioes: { msgs: ["Psst... Schatten gesehen?", "Ich weiß Dinge...", "*flüstert*", "Siehst du das auch...?"] },
  energetisch: { msgs: ["YOOO! 🔥🔥", "LET'S GO!!!", "HYYYPE! 🎉", "Keine Zeit zum Stehen!"] },
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
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

// ===================== SOCKET.IO =====================
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  console.log(`Connect: ${socket.id}`);

  if (players.size >= MAX_PLAYERS) {
    socket.emit('server-full');
    socket.disconnect();
    return;
  }

  // Player joins
  socket.on('join', (data) => {
    const playerData = {
      id: socket.id,
      name: data.name.slice(0, 16) || 'Spieler',
      color: data.color || '#3b82f6',
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
    io.emit('chat', { name: 'System', color: '', text: `${playerData.name} hat die Welt betreten!`, system: true });
    console.log(`${playerData.name} joined (${players.size}/${MAX_PLAYERS})`);
  });

  // Player moves
  socket.on('move', (data) => {
    const p = players.get(socket.id);
    if (!p) return;
    p.x = data.x; p.y = data.y; p.dir = data.dir; p.frame = data.frame; p.moving = data.moving;
    socket.broadcast.emit('player-moved', { id: socket.id, x: p.x, y: p.y, dir: p.dir, frame: p.frame, moving: p.moving });
  });

  // Chat
  socket.on('chat', (text) => {
    const p = players.get(socket.id);
    if (!p) return;
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
    startGameServer(data);
  });

  socket.on('stop-game', () => {
    if (activeGame) {
      // Sende game-ended mit Leaderboard (nicht nur game-stopped), damit alle
      // Spieler das finale Ranking sehen — auch bei vorzeitigem Abbruch.
      io.emit('game-ended', {
        game: activeGame,
        scores: activeGame.scores,
        leaderboard: buildLeaderboard(activeGame),
        stopped: true,
      });
      activeGame = null; gameItems = []; abZones = null; raceGoal = null;
      players.forEach(p => p.tagged = false);
      io.emit('chat', { name: 'System', color: '', text: 'Spiel wurde beendet.', system: true });
    }
  });

  // Tag collision
  socket.on('tag-player', (targetId) => {
    if (!activeGame || activeGame.type !== 'tag') return;
    const target = players.get(targetId);
    if (target && !target.tagged) {
      target.tagged = true;
      activeGame.scores[socket.id] = (activeGame.scores[socket.id] || 0) + 1;
      io.emit('player-tagged', { taggerId: socket.id, targetId });
      const tagger = players.get(socket.id);
      io.emit('chat', { name: 'System', color: '', text: `${tagger?.name || '?'} hat ${target.name} gefangen!`, system: true });
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

  // AB answer
  socket.on('ab-answer', (choice) => {
    if (!activeGame || activeGame.type !== 'ab') return;
    const p = players.get(socket.id);
    if (p) {
      if (!activeGame.answers) activeGame.answers = {};
      if (!activeGame.answers[activeGame.currentQ]) activeGame.answers[activeGame.currentQ] = {};
      activeGame.answers[activeGame.currentQ][socket.id] = choice;
      io.emit('chat', { name: 'System', color: '', text: `${p.name} wählt ${choice}`, system: true });
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
      io.emit('chat', { name: 'System', color: '', text: `🏁 ${p?.name} hat das Ziel in ${(elapsed / 1000).toFixed(1)}s erreicht!`, system: true });
      io.emit('race-finisher', { id: socket.id, time: elapsed, name: p?.name });
    }
  });

  // ---- AGENT CONFIG ----
  socket.on('toggle-agents', () => {
    agentsEnabled = !agentsEnabled;
    initAgents();
    io.emit('agents-state', { enabled: agentsEnabled, agents: Array.from(agents.values()) });
    io.emit('chat', { name: 'System', color: '', text: agentsEnabled ? 'Agents aktiviert.' : 'Agents deaktiviert.', system: true });
  });

  socket.on('update-agent-configs', (configs) => {
    agentConfigs = configs;
    initAgents();
    io.emit('agents-state', { enabled: agentsEnabled, agents: Array.from(agents.values()), configs: agentConfigs });
  });

  // Disconnect
  socket.on('disconnect', () => {
    const p = players.get(socket.id);
    if (p) {
      io.emit('chat', { name: 'System', color: '', text: `${p.name} hat die Welt verlassen.`, system: true });
      io.emit('player-left', socket.id);
      players.delete(socket.id);
    }
    console.log(`Disconnect: ${socket.id} (${players.size}/${MAX_PLAYERS})`);
  });
});

// ===================== GAME SERVER LOGIC =====================
function startGameServer(data) {
  const serverStartTime = Date.now();
  activeGame = { type: data.type, duration: data.duration, startTime: serverStartTime, scores: {} };
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
  io.emit('chat', { name: 'System', color: '', text: `🎮 ${data.type.toUpperCase()} gestartet!`, system: true });

  // Auto-end timer
  if (data.type !== 'ab') {
    setTimeout(() => {
      if (activeGame && activeGame.startTime === serverStartTime) {
        io.emit('game-ended', {
          game: activeGame,
          scores: activeGame.scores,
          leaderboard: buildLeaderboard(activeGame),
        });
        activeGame = null; gameItems = []; abZones = null; raceGoal = null;
        players.forEach(p => p.tagged = false);
      }
    }, data.duration + 3500); // +countdown
  }
}

// Baut eine sortierte Leaderboard-Liste mit Namen/Farben für das End-Popup.
// Funktioniert für 'collect' (scores als Punkte) und 'tag' (scores = Anzahl
// gefangene). Unbekannte/disconnectete Spieler-IDs werden als '?' angezeigt.
function buildLeaderboard(game) {
  if (!game || !game.scores) return [];
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

// ===================== AGENT SERVER TICK =====================
const WORLD_W = 3000, WORLD_H = 2000;
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

setInterval(() => {
  if (!agentsEnabled) return;
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

    // Chat
    if (now > a.chatTimer) {
      const pers = PERSONALITIES[cfg.personality] || PERSONALITIES.freundlich;
      const msgs = [...pers.msgs, ...(cfg.customMsgs || [])];
      const msg = msgs[Math.floor(Math.random() * msgs.length)];
      io.emit('agent-speech', { id: a.id, text: msg });
      io.emit('chat', { name: cfg.name, color: cfg.color, text: msg, system: false, agent: true });
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
      setTimeout(() => {
        io.emit('ab-question', { idx: activeGame.currentQ, question: activeGame.questions[activeGame.currentQ] });
      }, 2000);
    } else {
      // All questions done
      io.emit('game-ended', { game: activeGame, scores: activeGame.answers });
      io.emit('chat', { name: 'System', color: '', text: '🅰️🅱️ Alle Fragen beantwortet!', system: true });
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
