
// ===================== SPRITE ENGINE =====================
function createSpriteSheet(mainColor, darkColor, lightColor, isAgent) {
  const c = document.createElement('canvas'); c.width=48; c.height=64;
  const x = c.getContext('2d'); x.imageSmoothingEnabled=false;
  const S='#1a1a2e',W='#ffffff',E='#1a1a2e',K='#fde68a',SK='#f5d0a9';
  const dirs=['down','left','right','up'];
  dirs.forEach((dir,dIdx)=>{for(let f=0;f<3;f++)drawFrame(x,f*16,dIdx*16,dir,f,mainColor,darkColor,lightColor,S,W,E,K,SK,isAgent);});
  return c;
}
function drawFrame(ctx,ox,oy,dir,frame,M,D,L,S,W,E,K,SK,isA){
  const p=(x,y,c)=>{ctx.fillStyle=c;ctx.fillRect(ox+x,oy+y,1,1);};
  const b=(frame===1||frame===2)?-1:0;
  if(dir==='down'){
    p(5,1+b,M);p(6,1+b,M);p(7,1+b,M);p(8,1+b,M);p(9,1+b,M);p(10,1+b,M);
    p(4,2+b,M);p(5,2+b,D);p(6,2+b,M);p(7,2+b,M);p(8,2+b,M);p(9,2+b,D);p(10,2+b,M);p(11,2+b,M);
    p(5,3+b,K);p(6,3+b,K);p(7,3+b,K);p(8,3+b,K);p(9,3+b,K);p(10,3+b,K);
    p(5,4+b,K);p(6,4+b,W);p(7,4+b,E);p(8,4+b,K);p(9,4+b,W);p(10,4+b,E);
    p(5,5+b,K);p(6,5+b,K);p(7,5+b,SK);p(8,5+b,K);p(9,5+b,K);p(10,5+b,K);
    p(4,6+b,M);p(5,6+b,M);p(6,6+b,M);p(7,6+b,L);p(8,6+b,L);p(9,6+b,M);p(10,6+b,M);p(11,6+b,M);
    p(4,7+b,M);p(5,7+b,M);p(6,7+b,L);p(7,7+b,L);p(8,7+b,L);p(9,7+b,L);p(10,7+b,M);p(11,7+b,M);
    p(4,8+b,M);p(5,8+b,M);p(6,8+b,L);p(7,8+b,L);p(8,8+b,L);p(9,8+b,L);p(10,8+b,M);p(11,8+b,M);
    p(5,9+b,M);p(6,9+b,M);p(7,9+b,M);p(8,9+b,M);p(9,9+b,M);p(10,9+b,M);
    p(3,7+b,K);p(12,7+b,K);
    if(frame===1){p(2,8+b,K);p(13,6+b,K);}else if(frame===2){p(2,6+b,K);p(13,8+b,K);}else{p(3,8+b,K);p(12,8+b,K);}
    p(5,10+b,S);p(6,10+b,S);p(7,10+b,S);p(8,10+b,S);p(9,10+b,S);p(10,10+b,S);
    if(frame===0){p(5,11,S);p(6,11,S);p(9,11,S);p(10,11,S);p(5,12,S);p(6,12,S);p(9,12,S);p(10,12,S);}
    else if(frame===1){p(4,11,S);p(5,11,S);p(9,11,S);p(10,11,S);p(3,12,S);p(4,12,S);p(9,12,S);p(10,12,S);}
    else{p(5,11,S);p(6,11,S);p(10,11,S);p(11,11,S);p(5,12,S);p(6,12,S);p(11,12,S);p(12,12,S);}
    if(isA){p(7,0+b,'#a78bfa');p(8,0+b,'#a78bfa');}
  } else if(dir==='up'){
    p(5,1+b,D);p(6,1+b,D);p(7,1+b,D);p(8,1+b,D);p(9,1+b,D);p(10,1+b,D);
    p(4,2+b,D);p(5,2+b,M);p(6,2+b,D);p(7,2+b,D);p(8,2+b,D);p(9,2+b,M);p(10,2+b,D);p(11,2+b,D);
    [3,4,5].forEach(r=>{p(5,r+b,D);p(6,r+b,D);p(7,r+b,D);p(8,r+b,D);p(9,r+b,D);p(10,r+b,D);});
    p(4,6+b,D);p(5,6+b,D);p(6,6+b,M);p(7,6+b,M);p(8,6+b,M);p(9,6+b,M);p(10,6+b,D);p(11,6+b,D);
    p(4,7+b,D);p(5,7+b,M);p(6,7+b,M);p(7,7+b,M);p(8,7+b,M);p(9,7+b,M);p(10,7+b,M);p(11,7+b,D);
    p(4,8+b,D);p(5,8+b,M);p(6,8+b,M);p(7,8+b,M);p(8,8+b,M);p(9,8+b,M);p(10,8+b,M);p(11,8+b,D);
    p(5,9+b,D);p(6,9+b,M);p(7,9+b,M);p(8,9+b,M);p(9,9+b,M);p(10,9+b,D);
    p(3,7+b,K);p(12,7+b,K);if(frame===1){p(2,8+b,K);p(13,6+b,K);}else if(frame===2){p(2,6+b,K);p(13,8+b,K);}else{p(3,8+b,K);p(12,8+b,K);}
    p(5,10+b,S);p(6,10+b,S);p(7,10+b,S);p(8,10+b,S);p(9,10+b,S);p(10,10+b,S);
    if(frame===0){p(5,11,S);p(6,11,S);p(9,11,S);p(10,11,S);p(5,12,S);p(6,12,S);p(9,12,S);p(10,12,S);}
    else if(frame===1){p(4,11,S);p(5,11,S);p(9,11,S);p(10,11,S);p(3,12,S);p(4,12,S);p(9,12,S);p(10,12,S);}
    else{p(5,11,S);p(6,11,S);p(10,11,S);p(11,11,S);p(5,12,S);p(6,12,S);p(11,12,S);p(12,12,S);}
    if(isA){p(7,0+b,'#a78bfa');p(8,0+b,'#a78bfa');}
  } else if(dir==='left'){
    p(4,1+b,M);p(5,1+b,M);p(6,1+b,M);p(7,1+b,M);p(8,1+b,M);
    p(3,2+b,M);p(4,2+b,D);p(5,2+b,M);p(6,2+b,M);p(7,2+b,M);p(8,2+b,D);p(9,2+b,M);
    p(4,3+b,K);p(5,3+b,K);p(6,3+b,K);p(7,3+b,K);p(8,3+b,K);
    p(3,4+b,K);p(4,4+b,W);p(5,4+b,E);p(6,4+b,K);p(7,4+b,K);p(8,4+b,K);
    p(4,5+b,K);p(5,5+b,K);p(6,5+b,K);p(7,5+b,K);p(8,5+b,K);
    p(4,6+b,M);p(5,6+b,M);p(6,6+b,L);p(7,6+b,M);p(8,6+b,M);p(9,6+b,M);
    p(4,7+b,M);p(5,7+b,L);p(6,7+b,L);p(7,7+b,L);p(8,7+b,M);p(9,7+b,M);
    p(4,8+b,M);p(5,8+b,L);p(6,8+b,L);p(7,8+b,L);p(8,8+b,M);p(9,8+b,M);
    p(5,9+b,M);p(6,9+b,M);p(7,9+b,M);p(8,9+b,M);
    p(10,7+b,K);p(10,8+b,K);if(frame===1)p(10,6+b,K);else if(frame===2)p(10,9+b,K);
    p(5,10+b,S);p(6,10+b,S);p(7,10+b,S);p(8,10+b,S);
    if(frame===0){p(5,11,S);p(6,11,S);p(7,11,S);p(8,11,S);p(5,12,S);p(6,12,S);p(7,12,S);p(8,12,S);}
    else if(frame===1){p(4,11,S);p(5,11,S);p(8,11,S);p(9,11,S);p(3,12,S);p(4,12,S);p(9,12,S);p(10,12,S);}
    else{p(5,11,S);p(6,11,S);p(7,11,S);p(8,11,S);p(5,12,S);p(6,12,S);p(7,12,S);p(8,12,S);}
    if(isA){p(6,0+b,'#a78bfa');p(7,0+b,'#a78bfa');}
  } else {
    p(7,1+b,M);p(8,1+b,M);p(9,1+b,M);p(10,1+b,M);p(11,1+b,M);
    p(6,2+b,M);p(7,2+b,D);p(8,2+b,M);p(9,2+b,M);p(10,2+b,M);p(11,2+b,D);p(12,2+b,M);
    p(7,3+b,K);p(8,3+b,K);p(9,3+b,K);p(10,3+b,K);p(11,3+b,K);
    p(7,4+b,K);p(8,4+b,K);p(9,4+b,K);p(10,4+b,W);p(11,4+b,E);p(12,4+b,K);
    p(7,5+b,K);p(8,5+b,K);p(9,5+b,K);p(10,5+b,K);p(11,5+b,K);
    p(6,6+b,M);p(7,6+b,M);p(8,6+b,M);p(9,6+b,L);p(10,6+b,M);p(11,6+b,M);
    p(6,7+b,M);p(7,7+b,M);p(8,7+b,L);p(9,7+b,L);p(10,7+b,L);p(11,7+b,M);
    p(6,8+b,M);p(7,8+b,M);p(8,8+b,L);p(9,8+b,L);p(10,8+b,L);p(11,8+b,M);
    p(7,9+b,M);p(8,9+b,M);p(9,9+b,M);p(10,9+b,M);
    p(5,7+b,K);p(5,8+b,K);if(frame===1)p(5,6+b,K);else if(frame===2)p(5,9+b,K);
    p(7,10+b,S);p(8,10+b,S);p(9,10+b,S);p(10,10+b,S);
    if(frame===0){p(7,11,S);p(8,11,S);p(9,11,S);p(10,11,S);p(7,12,S);p(8,12,S);p(9,12,S);p(10,12,S);}
    else if(frame===1){p(6,11,S);p(7,11,S);p(10,11,S);p(11,11,S);p(5,12,S);p(6,12,S);p(11,12,S);p(12,12,S);}
    else{p(7,11,S);p(8,11,S);p(9,11,S);p(10,11,S);p(7,12,S);p(8,12,S);p(9,12,S);p(10,12,S);}
    if(isA){p(8,0+b,'#a78bfa');p(9,0+b,'#a78bfa');}
  }
}
function hexToC(h){return[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];}
function darken(h,a=40){const[r,g,b]=hexToC(h);return`rgb(${Math.max(0,r-a)},${Math.max(0,g-a)},${Math.max(0,b-a)})`;}
function lighten(h,a=50){const[r,g,b]=hexToC(h);return`rgb(${Math.min(255,r+a)},${Math.min(255,g+a)},${Math.min(255,b+a)})`;}

// ===================== CONFIG =====================
const WORLD_W=3000,WORLD_H=2000,SCALE=3,MOVE_SPEED=2.2,SPRINT_SPEED=4.2,SPRINT_MAX=100;
const COLORS=['#3b82f6','#ef4444','#22c55e','#f59e0b','#a855f7','#ec4899','#06b6d4','#f97316'];
const PERSONALITIES={
  freundlich:{label:'Freundlich',emoji:'😊',msgs:["Hey! 👋","Wie geht's?","Willkommen!","Schönen Tag! 🌞"]},
  witzig:{label:'Witzig',emoji:'😂',msgs:["Warum laufen Coder nie raus? Kein Windows! 😄","lol","404: Witz not found... PSYCH!","Bin ich witzig? KI sagt ja!"]},
  philosophisch:{label:'Philosophisch',emoji:'🤔',msgs:["Was bedeutet virtuelle Existenz?","Bin ich echt?","Jeder Pixel erzählt...","Zeit ist relativ in Game Loops."]},
  technisch:{label:'Technisch',emoji:'💻',msgs:["Latenz: 16ms. Optimal!","3000x2000px. Beeindruckend.","FPS stabil!","Pathfinding: geradeaus!"]},
  mysterioes:{label:'Mysteriös',emoji:'🌙',msgs:["Psst... Schatten gesehen?","Ich weiß Dinge...","*flüstert* Wahrheit im Code.","Siehst du das auch...?"]},
  energetisch:{label:'Energetisch',emoji:'⚡',msgs:["YOOO! 🔥🔥","LET'S GO!!!","HYYYPE! 🎉","Keine Zeit zum Stehen!"]},
};
const DEFAULT_AGENTS=[
  {name:'Agent Alpha',color:'#8b5cf6',personality:'freundlich',speed:1.5,chatFreq:12,wanderRadius:400,active:true},
  {name:'Agent Beta',color:'#7c3aed',personality:'witzig',speed:1.2,chatFreq:15,wanderRadius:300,active:true},
  {name:'Agent Gamma',color:'#6d28d9',personality:'philosophisch',speed:.8,chatFreq:20,wanderRadius:500,active:true},
  {name:'Agent Delta',color:'#5b21b6',personality:'technisch',speed:1.8,chatFreq:10,wanderRadius:350,active:true},
  {name:'Agent Zeta',color:'#9333ea',personality:'mysterioes',speed:1,chatFreq:18,wanderRadius:450,active:true},
];
const SIM_PLAYERS=[
  {name:'Luna',color:'#ec4899'},{name:'Max',color:'#f59e0b'},{name:'Pixel',color:'#06b6d4'},
  {name:'Nova',color:'#f43f5e'},{name:'Kai',color:'#84cc16'},{name:'Zoe',color:'#8b5cf6'},
  {name:'Finn',color:'#14b8a6'},{name:'Mia',color:'#f97316'},{name:'Leo',color:'#6366f1'},
  {name:'Ella',color:'#e879f9'},{name:'Tom',color:'#22d3ee'},{name:'Ida',color:'#facc15'},
  {name:'Ben',color:'#4ade80'},{name:'Lea',color:'#fb7185'},{name:'Jan',color:'#38bdf8'},
  {name:'Pia',color:'#a3e635'},{name:'Nico',color:'#c084fc'},{name:'Lara',color:'#fbbf24'},
  {name:'Erik',color:'#2dd4bf'},{name:'Sara',color:'#f472b6'},
];

// ===================== STATE =====================
let player=null,selectedColor=COLORS[Math.floor(Math.random()*COLORS.length)],entities=[],agentConfigs=JSON.parse(JSON.stringify(DEFAULT_AGENTS));
let keys={},chatFocused=false,configOpen=false,gameStarted=false,chatHidden=false,agentsEnabled=true;
let camX=0,camY=0,canvas,ctx;
let sprintStamina=SPRINT_MAX,isSprinting=false;
// Minigame state
let activeGame=null; // null | {type, ...state}
let gameItems=[]; // for collect game
let abZones=null; // for A/B game
let raceGoal=null; // for race
let worldObjs=[];
// Visual polish state
let grassPattern=null, grassPatternCanvas=null;
let clouds=[];
let particles=[];
let shakeTime=0, shakeMag=0; // screen-shake

// ===================== LOGIN =====================
const colorPicker=document.getElementById('color-picker');
COLORS.forEach((c,i)=>{const el=document.createElement('div');el.className='color-opt'+(c===selectedColor?' selected':'');el.style.background=c;el.onclick=()=>{document.querySelectorAll('.color-opt').forEach(e=>e.classList.remove('selected'));el.classList.add('selected');selectedColor=c;};colorPicker.appendChild(el);});
document.getElementById('name-input').addEventListener('keydown',e=>{if(e.key==='Enter')joinWorld();});
function joinWorld(){const name=document.getElementById('name-input').value.trim()||'Spieler';document.getElementById('login-screen').classList.add('hidden');setTimeout(()=>{document.getElementById('login-screen').style.display='none';document.getElementById('game-container').style.display='block';startGame(name,selectedColor);connectSocket(name,selectedColor);},500);}

// ===================== MULTIPLAYER (Socket.io) =====================
let socket=null, myId=null, lastMoveSent=0;
function connectSocket(name,color){
  if(typeof io==='undefined'){addChatMsg('System','','⚠️ Socket.io nicht geladen — nur Single-Player!',true);return;}
  socket=io();
  socket.on('connect',()=>{myId=socket.id;socket.emit('join',{name,color});});
  socket.on('server-full',()=>{
    addChatMsg('System','','⚠️ Server voll (max 50)!',true);
    // Blockierendes Popup, weil der User sonst nichts mitbekommt (Chat ist beim
    // Verbindungsaufbau oft noch nicht sichtbar).
    endGame('Server voll','🚫','Der Server hat die Kapazität erreicht (max 50 Spieler). Versuch es später nochmal.');
  });
  socket.on('init',(d)=>{
    // Remote-Spieler aus Server-State erzeugen
    d.players.forEach(p=>{if(p.id!==myId)addRemotePlayer(p);});
    // Agents übernehmen vom Server (falls abweichend von Client-Default)
    if(d.agentConfigs){agentConfigs=d.agentConfigs;agentsEnabled=d.agentsEnabled;spawnAgentsFromConfig();
      const b=document.getElementById('agents-quick-toggle');if(b){b.textContent=agentsEnabled?'👁 Agents An':'🚫 Agents Aus';b.classList.toggle('agents-off',!agentsEnabled);}}
    // Aktives Spiel sync
    if(d.activeGame){activeGame=d.activeGame;gameItems=d.gameItems||[];abZones=d.abZones;raceGoal=d.raceGoal;document.getElementById('game-hud').classList.add('show');}
  });
  socket.on('player-joined',p=>{addRemotePlayer(p);addChatMsg('System','',`${p.name} ist beigetreten!`,true);});
  socket.on('player-left',id=>{entities=entities.filter(e=>e.remoteId!==id);});
  socket.on('player-moved',d=>{const e=entities.find(e2=>e2.remoteId===d.id);if(e){e.x=d.x;e.y=d.y;e.dir=d.dir;e.frame=d.frame;e.moving=d.moving;}});
  socket.on('chat',m=>{addChatMsg(m.name,m.color,m.text,!!m.system,!!m.agent);
    if(!m.system){const e=entities.find(e2=>e2.name===m.name&&!e2.isAgent);if(e){e.speechText=m.text;e.speechTimer=4000;}}});
  socket.on('agents-update',arr=>{arr.forEach(a=>{const e=entities.find(e2=>e2.isAgent&&e2.agentId===a.id);if(e){e.x=a.x;e.y=a.y;e.dir=a.dir;e.frame=a.frame;e.moving=a.moving;}});});
  socket.on('agents-state',d=>{agentsEnabled=d.enabled;if(d.configs)agentConfigs=d.configs;spawnAgentsFromConfig();
    const b=document.getElementById('agents-quick-toggle');if(b){b.textContent=agentsEnabled?'👁 Agents An':'🚫 Agents Aus';b.classList.toggle('agents-off',!agentsEnabled);}});
  socket.on('disconnect',()=>addChatMsg('System','','⚠️ Verbindung verloren.',true));
  // Game events
  socket.on('game-started',d=>{
    const g=d.game;
    // Countdown für ALLE (auch nicht-Initiatoren)
    closeMinigameMenu();
    const cd=document.getElementById('countdown');cd.classList.add('show');
    let cnt=3;cd.textContent=cnt;
    const iv=setInterval(()=>{cnt--;if(cnt>0)cd.textContent=cnt;else{cd.textContent='GO!';clearInterval(iv);setTimeout(()=>{
      cd.classList.remove('show');
      // Activate game using server state
      activeGame={type:g.type,duration:g.duration,elapsed:0,startTime:g.startTime,score:0,simScores:{},arena:g.arena,questions:g.questions,timePerQ:g.timePerQ,currentQ:0,questionTimer:0,finished:false,finishTime:0};
      gameItems=d.gameItems||[];abZones=d.abZones;raceGoal=d.raceGoal;
      const hud=document.getElementById('game-hud');hud.classList.add('show');
      const titles={tag:'🏷️ FANGEN',collect:'⭐ SAMMELN',race:'🏁 WETTRENNEN',ab:'🅰️🅱️ A ODER B'};
      document.getElementById('game-title').textContent=titles[g.type]||g.type.toUpperCase();
      document.getElementById('game-score').textContent=g.type==='collect'?'⭐ 0 Punkte':g.type==='tag'?'Gefangen: 0':g.type==='race'?'Lauf zum Ziel!':'';
      if(g.type==='collect'){
        document.getElementById('game-info').innerHTML='<span class="legend-item">⭐ 1P</span><span class="legend-item">🍎 1P</span><span class="legend-item">💰 2P</span><span class="legend-item">💎 3P</span><span class="legend-item">🏆 5P</span> — laufe drüber zum Einsammeln';
        document.getElementById('game-scoreboard').classList.add('show');
        document.getElementById('sb-title').textContent='⭐ Punktestand';
      }
      if(g.type==='race'){
        activeGame.startPos={x:player.x,y:player.y};
        document.getElementById('game-info').innerHTML='🏁 Ziel ist markiert (grüner Pfeil zeigt Richtung)';
        document.getElementById('race-arrow').classList.add('show');
      }
    },600);}},1000);
  });
  socket.on('game-ended',d=>{
    const type=activeGame?.type||d?.game?.type;
    const title=d?.stopped?'Spiel abgebrochen':'Spiel beendet!';
    let result='🎮',detail='Spiel beendet.',lb=null,autoClose=0,ab=null;
    if(type==='collect'){
      const myScore=d.scores?.[myId]||0;
      result='⭐ '+myScore;
      detail='Dein Score: '+myScore;
      lb=buildLeaderboardRows(d);
      autoClose=10000; // 10 Sek Auto-Close fürs Leaderboard
    } else if(type==='tag'){
      const myScore=d.scores?.[myId]??(activeGame?.score||0);
      result='Gefangen: '+myScore;
      detail='Zeit vorbei!';
      lb=buildLeaderboardRows(d);
      autoClose=10000;
    }
    else if(type==='race'){
      // Eigenes Zeit-/Status in result, Leaderboard darunter
      const mine=Array.isArray(d?.leaderboard)?d.leaderboard.find(r=>r.id===myId):null;
      if(activeGame?.finished){result='🏁 '+(activeGame.finishTime/1000).toFixed(1)+'s';detail='Gut gemacht!';}
      else if(mine?.finished){result='🏁 '+mine.score;detail='Im Ziel angekommen.';}
      else {result='Nicht geschafft';detail='Du hast das Ziel nicht erreicht.';}
      lb=buildLeaderboardRows(d);
      autoClose=10000;
    }
    else if(type==='ab'){
      result='🅰️🅱️';
      detail='Alle Ergebnisse:';
      ab=Array.isArray(d?.abResults)?d.abResults:null;
      autoClose=10000;
    }
    // Fallback: Wenn wir einen Leaderboard vom Server haben, aber den Typ nicht
    // kennen (z.B. activeGame wurde schon lokal abgeräumt), zeig ihn trotzdem.
    if(!lb&&!ab&&Array.isArray(d?.leaderboard)&&d.leaderboard.length){lb=buildLeaderboardRows(d);autoClose=autoClose||10000;}
    if(!ab&&Array.isArray(d?.abResults)&&d.abResults.length){ab=d.abResults;autoClose=autoClose||10000;}
    endGame(title,result,detail,lb,autoClose,ab);
  });
  // Hinweis: 'game-stopped' wird vom Server seit der stop→game-ended-Umstellung
  // nicht mehr gesendet; der game-ended-Handler übernimmt das Popup-Handling.
  // Falls irgendwer auf einer alten Server-Version ist, räumen wir hier trotzdem auf.
  socket.on('game-stopped',()=>{
    if(activeGame){activeGame=null;gameItems=[];abZones=null;raceGoal=null;
      document.getElementById('game-hud').classList.remove('show');
      document.getElementById('game-scoreboard').classList.remove('show');
      document.getElementById('race-arrow').style.display='none';}
  });
  // Tag: neuer Tagger wurde gewählt (wenn der ursprüngliche disconnected ist)
  socket.on('tag-new-tagger',d=>{
    if(activeGame&&activeGame.type==='tag'){activeGame.tagger=d.taggerId;}
  });
  socket.on('item-collected',d=>{
    if(d.itemIdx<gameItems.length){
      const it=gameItems[d.itemIdx];
      if(it&&!it.collected)spawnCollectParticles(it.x,it.y,'#fde047');
      if(it)it.collected=true;
    }
  });
  socket.on('item-spawned',d=>{gameItems[d.idx]=d.item;});
  socket.on('player-tagged',d=>{
    const e=entities.find(e2=>e2.remoteId===d.targetId);
    if(e){
      e.tagged=true;
      spawnCollectParticles(e.x+8,e.y+8,'#ef4444');
      // Shake more if we are the victim
      if(player&&d.targetId===myId)triggerShake(3.5,300);
      else triggerShake(1.2,160);
    }
  });
  // A/B Events
  socket.on('ab-question',d=>{if(!activeGame||activeGame.type!=='ab')return;activeGame.currentQ=d.idx;activeGame.questions[d.idx]=d.question;activeGame.questionTimer=activeGame.timePerQ;
    document.getElementById('game-title').textContent=`Frage ${d.idx+1}/${activeGame.questions.length}`;
    document.getElementById('game-score').textContent=d.question.q;
    showGameMsg(`🅰️ ${d.question.a}   |   🅱️ ${d.question.b}`);
    addChatMsg('System','',`❓ ${d.question.q} — 🅰️ ${d.question.a} | 🅱️ ${d.question.b}`,true);
  });
  socket.on('ab-result',d=>addChatMsg('System','',`📊 Frage ${d.idx+1}: 🅰️ ${d.countA} · 🅱️ ${d.countB}`,true));
}
function addRemotePlayer(p){
  const e=createEntity(p.name,p.color,p.x,p.y,false,false);
  e.remoteId=p.id;e.isRemotePlayer=true;e.tagged=!!p.tagged;
  entities.push(e);
}
function emitMove(){
  if(!socket||!socket.connected)return;
  const now=Date.now();if(now-lastMoveSent<100)return;lastMoveSent=now;
  socket.emit('move',{x:player.x,y:player.y,dir:player.dir,frame:player.frame,moving:player.moving});
}

// ===================== GAME =====================
function startGame(name,color){
  gameStarted=true;canvas=document.getElementById('world-canvas');ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;
  resizeCanvas();window.addEventListener('resize',resizeCanvas);generateWorldObjects();
  player=createEntity(name,color,WORLD_W/2,WORLD_H/2,false,false);entities.push(player);
  spawnAgentsFromConfig();
  addChatMsg('System','',`${player.name} hat die Welt betreten!`,true);
  requestAnimationFrame(gameLoop);
}
function resizeCanvas(){if(!canvas)return;canvas.width=window.innerWidth;canvas.height=window.innerHeight;ctx.imageSmoothingEnabled=false;}
function createEntity(name,color,x,y,isAgent,isSimPlayer){
  const sprite=createSpriteSheet(color,darken(color),lighten(color),isAgent);
  return{name,color,x,y,isAgent,isSimPlayer,sprite,targetX:x,targetY:y,dir:0,frame:0,animTimer:0,moving:false,speechText:'',speechTimer:0,wanderTimer:0,chatTimer:0,agentCfg:null,tagged:false};
}
function rebuildSprite(e){e.sprite=createSpriteSheet(e.color,darken(e.color),lighten(e.color),e.isAgent);}
function spawnAgentsFromConfig(){entities=entities.filter(e=>!e.isAgent);if(!agentsEnabled)return;agentConfigs.forEach(cfg=>{if(!cfg.active)return;const e=createEntity(cfg.name,cfg.color,400+Math.random()*(WORLD_W-800),400+Math.random()*(WORLD_H-800),true,false);e.agentCfg=cfg;e.agentId=cfg.id||cfg.name;entities.push(e);});}

function generateWorldObjects(){
  worldObjs=[];
  for(let i=0;i<50;i++)worldObjs.push({type:'tree',x:50+Math.random()*(WORLD_W-100),y:50+Math.random()*(WORLD_H-100),hue:120+Math.random()*40,light:25+Math.random()*15});
  for(let i=0;i<30;i++)worldObjs.push({type:'rock',x:Math.random()*WORLD_W,y:Math.random()*WORLD_H,size:4+Math.random()*6});
  [[600,400,60,40],[2200,1400,75,50],[1400,800,45,35]].forEach(([x,y,w,h])=>worldObjs.push({type:'pond',x,y,w,h}));
  [[800,200,50,40],[2000,600,60,45],[1200,1500,40,30],[400,1200,55,42]].forEach(([x,y,w,h])=>worldObjs.push({type:'building',x,y,w,h}));
  [[1500,1000],[700,1600],[2400,400]].forEach(([x,y])=>worldObjs.push({type:'fire',x,y}));
  for(let i=0;i<80;i++)worldObjs.push({type:'flower',x:Math.random()*WORLD_W,y:Math.random()*WORLD_H,color:['#f43f5e','#fbbf24','#a78bfa','#38bdf8','#fb923c'][Math.floor(Math.random()*5)]});
  worldObjs.push({type:'path',x1:400,y1:1000,x2:2600,y2:1000});
  worldObjs.push({type:'path',x1:1500,y1:200,x2:1500,y2:1800});
}

// ===================== GAME LOOP =====================
let lastTime=0;
function gameLoop(time){
  const dt=Math.min((time-lastTime)/16.67,3);lastTime=time;

  // Sprint
  isSprinting=!!(keys['ShiftLeft']||keys['ShiftRight'])&&sprintStamina>0;
  if(isSprinting&&player.moving)sprintStamina=Math.max(0,sprintStamina-dt*1.2);
  else sprintStamina=Math.min(SPRINT_MAX,sprintStamina+dt*0.4);
  if(sprintStamina<=0)isSprinting=false;
  const sprintWrap=document.getElementById('sprint-bar-wrap');
  sprintWrap.classList.toggle('show',sprintStamina<SPRINT_MAX);
  document.getElementById('sprint-bar').style.width=sprintStamina+'%';
  document.getElementById('hud-sprint').style.display=isSprinting?'':'none';

  // Player movement
  let moving=false;
  if(!chatFocused&&!configOpen&&!document.getElementById('minigame-overlay').classList.contains('open')&&!document.getElementById('game-end').classList.contains('show')){
    let dx=0,dy=0;const spd=isSprinting?SPRINT_SPEED:MOVE_SPEED;
    if(keys['ArrowLeft']||keys['KeyA'])dx-=spd*dt;
    if(keys['ArrowRight']||keys['KeyD'])dx+=spd*dt;
    if(keys['ArrowUp']||keys['KeyW'])dy-=spd*dt;
    if(keys['ArrowDown']||keys['KeyS'])dy+=spd*dt;
    if(dx&&dy){const n=Math.sqrt(dx*dx+dy*dy);dx=(dx/n)*spd*dt;dy=(dy/n)*spd*dt;}
    if(dx||dy){
      // Arena boundary for tag game
      if(activeGame?.type==='tag'){
        const a=activeGame.arena;
        player.x=clamp(player.x+dx,a.x,a.x+a.w-16);player.y=clamp(player.y+dy,a.y,a.y+a.h-16);
      } else {
        player.x=clamp(player.x+dx,10,WORLD_W-26);player.y=clamp(player.y+dy,10,WORLD_H-26);
      }
      if(Math.abs(dx)>Math.abs(dy))player.dir=dx<0?1:2;else player.dir=dy<0?3:0;
      moving=true;
    }
  }
  player.moving=moving;

  // Update entities (lokale Agents nur wenn kein Socket, sonst kommen Positionen vom Server)
  const hasSocket=socket&&socket.connected;
  entities.forEach(e=>{
    if(e.isAgent&&!hasSocket)updateAgent(e,dt);
    if(e.isSimPlayer)updateSimPlayer(e,dt);
    if(e.moving){e.animTimer+=dt*.18;if(e.animTimer>=1){e.animTimer=0;e.frame=(e.frame+1)%3;}}else{e.frame=0;e.animTimer=0;}
    if(e.speechTimer>0){e.speechTimer-=dt*16.67;if(e.speechTimer<=0)e.speechText='';}
  });

  // Eigene Position ans Server senden (throttled 10Hz)
  if(player)emitMove();

  // Minigame logic
  updateMinigame(dt);

  // Polish: clouds + particles
  updateClouds(dt);
  updateParticles(dt);

  // Camera
  camX=player.x-canvas.width/SCALE/2+8;camY=player.y-canvas.height/SCALE/2+8;
  camX=clamp(camX,0,WORLD_W-canvas.width/SCALE);camY=clamp(camY,0,WORLD_H-canvas.height/SCALE);
  render();updateHUD();updateMinimap();updateOnlineList();
  requestAnimationFrame(gameLoop);
}

// ===================== AGENT AI =====================
function updateAgent(agent,dt){
  const cfg=agent.agentCfg;if(!cfg||!cfg.active){agent.moving=false;return;}
  const speed=(cfg.speed||1.5)*.7,chatFreq=(cfg.chatFreq||12)*1000,wanderR=cfg.wanderRadius||400;
  if(!agent.wanderTimer||Date.now()>agent.wanderTimer){
    if(activeGame?.type==='tag'){const a=activeGame.arena;agent.targetX=a.x+20+Math.random()*(a.w-40);agent.targetY=a.y+20+Math.random()*(a.h-40);}
    else{agent.targetX=clamp(agent.x+(Math.random()-.5)*wanderR*2,50,WORLD_W-50);agent.targetY=clamp(agent.y+(Math.random()-.5)*wanderR*2,50,WORLD_H-50);}
    agent.wanderTimer=Date.now()+2000+Math.random()*4000;
  }
  const dx=agent.targetX-agent.x,dy=agent.targetY-agent.y,dist=Math.sqrt(dx*dx+dy*dy);
  if(dist>5){const s=speed*dt;agent.x+=(dx/dist)*s;agent.y+=(dy/dist)*s;if(Math.abs(dx)>Math.abs(dy))agent.dir=dx<0?1:2;else agent.dir=dy<0?3:0;agent.moving=true;}
  else agent.moving=false;
  if(!agent.chatTimer||Date.now()>agent.chatTimer){
    const pers=PERSONALITIES[cfg.personality]||PERSONALITIES.freundlich;let msgs=[...pers.msgs];if(cfg.customMsgs?.length)msgs.push(...cfg.customMsgs);
    const msg=msgs[Math.floor(Math.random()*msgs.length)];agent.speechText=msg;agent.speechTimer=4000;addChatMsg(agent.name,agent.color,msg,false,true);
    agent.chatTimer=Date.now()+chatFreq+Math.random()*chatFreq*.5;
  }
}
function updateSimPlayer(sp,dt){
  // TAG: wenn nicht gefangen, vor Spieler fliehen
  if(activeGame?.type==='tag'&&!sp.tagged){
    const a=activeGame.arena;
    const distP=distance(sp,player);
    if(distP<120){
      const fx=sp.x-player.x, fy=sp.y-player.y;
      const fl=Math.sqrt(fx*fx+fy*fy)||1;
      sp.targetX=clamp(sp.x+(fx/fl)*80,a.x+10,a.x+a.w-10);
      sp.targetY=clamp(sp.y+(fy/fl)*80,a.y+10,a.y+a.h-10);
      sp.wanderTimer=Date.now()+400;
    }
  }
  if(!sp.wanderTimer||Date.now()>sp.wanderTimer){
    if(activeGame?.type==='tag'){const a=activeGame.arena;sp.targetX=a.x+20+Math.random()*(a.w-40);sp.targetY=a.y+20+Math.random()*(a.h-40);}
    else if(activeGame?.type==='collect'&&gameItems.length>0){const it=gameItems[Math.floor(Math.random()*gameItems.length)];sp.targetX=it.x;sp.targetY=it.y;}
    else if(activeGame?.type==='race'&&raceGoal){sp.targetX=raceGoal.x+Math.random()*40;sp.targetY=raceGoal.y+Math.random()*40;}
    else if(activeGame?.type==='ab'&&abZones){const z=Math.random()>.5?abZones.a:abZones.b;sp.targetX=z.x+Math.random()*z.w;sp.targetY=z.y+Math.random()*z.h;}
    else{sp.targetX=clamp(sp.x+(Math.random()-.5)*300,50,WORLD_W-50);sp.targetY=clamp(sp.y+(Math.random()-.5)*300,50,WORLD_H-50);}
    sp.wanderTimer=Date.now()+1500+Math.random()*4000;
  }
  const dx=sp.targetX-sp.x,dy=sp.targetY-sp.y,dist=Math.sqrt(dx*dx+dy*dy);
  const spd=activeGame?1.8:1;
  if(dist>5){const s=spd*dt;sp.x+=(dx/dist)*s;sp.y+=(dy/dist)*s;if(Math.abs(dx)>Math.abs(dy))sp.dir=dx<0?1:2;else sp.dir=dy<0?3:0;sp.moving=true;}
  else sp.moving=false;
  if(!sp.chatTimer||Date.now()>sp.chatTimer){
    const msgs=activeGame?["Los los!","Ich bin schneller!","Haha! 😄","Warte auf mich!","Yeees!","Ooh knapp!"]:["Coole Welt! 🌍","Hey!","Was geht?","lol","Die Agents sind witzig 😄"];
    const msg=msgs[Math.floor(Math.random()*msgs.length)];sp.speechText=msg;sp.speechTimer=3000;addChatMsg(sp.name,sp.color,msg);
    sp.chatTimer=Date.now()+(activeGame?6000:12000)+Math.random()*10000;
  }
}

// ===================== MINIGAME ENGINE =====================
function updateMinigame(dt){
  if(!activeGame)return;
  // Timer: im MP-Modus via startTime synchron, sonst lokal
  if(socket&&socket.connected&&activeGame.startTime)activeGame.elapsed=Date.now()-activeGame.startTime;
  else activeGame.elapsed+=dt*16.67;
  const remaining=Math.max(0,activeGame.duration-activeGame.elapsed);
  document.getElementById('game-timer').textContent=Math.ceil(remaining/1000)+'s';

  if(activeGame.type==='tag'){
    // Check tag collisions with other players (remote/sim)
    entities.forEach(e=>{
      if(e===player||e.tagged||e.isAgent)return;
      if(distance(e,player)<14){
        e.tagged=true;activeGame.score=(activeGame.score||0)+1;
        document.getElementById('game-score').textContent='Gefangen: '+activeGame.score;
        e.speechText='Oh nein! 😱';e.speechTimer=2000;
        // visual feedback: shake + red burst
        triggerShake(2.4,220);
        spawnCollectParticles(e.x+8,e.y+8,'#ef4444');
        if(socket&&socket.connected&&e.remoteId)socket.emit('tag-player',e.remoteId);
        else addChatMsg('System','',`${player.name} hat ${e.name} gefangen!`,true);
      }
    });
  }
  else if(activeGame.type==='collect'){
    // Check item pickup
    let changed=false;
    gameItems=gameItems.filter((it,idx)=>{
      if(it.collected)return true;
      if(distance({x:it.x,y:it.y},player)<14){
        activeGame.score=(activeGame.score||0)+it.points;
        document.getElementById('game-score').textContent='⭐ '+activeGame.score+' Punkte';
        changed=true;
        spawnCollectParticles(it.x,it.y,'#fde047');
        if(socket&&socket.connected){socket.emit('collect-item',idx);it.collected=true;return true;}
        return false;
      }
      // Sim players collect too
      let simGrabbed=false;
      entities.forEach(e=>{if(e.isSimPlayer&&!simGrabbed&&distance({x:it.x,y:it.y},e)<14){
        if(!activeGame.simScores)activeGame.simScores={};
        activeGame.simScores[e.name]=(activeGame.simScores[e.name]||0)+it.points;
        simGrabbed=true;changed=true;
        spawnCollectParticles(it.x,it.y,e.color||'#fbbf24');
      }});
      return !simGrabbed;
    });
    if(changed||!activeGame._sbInit){updateCollectScoreboard();activeGame._sbInit=true;}
    document.getElementById('game-dist').textContent='📦 '+gameItems.length+' Items übrig';
    // Spawn new items
    if(gameItems.length<8&&Math.random()<.03*dt){
      const types=[{emoji:'⭐',points:1},{emoji:'💎',points:3},{emoji:'🍎',points:1},{emoji:'🏆',points:5},{emoji:'💰',points:2}];
      const t=types[Math.floor(Math.random()*types.length)];
      gameItems.push({x:100+Math.random()*(WORLD_W-200),y:100+Math.random()*(WORLD_H-200),...t,spawnTime:Date.now()});
    }
  }
  else if(activeGame.type==='race'){
    if(raceGoal){
      const gx=raceGoal.x+raceGoal.w/2, gy=raceGoal.y+raceGoal.h/2;
      const dist=distance(player,{x:gx,y:gy});
      // Distanz-Anzeige
      if(!activeGame.finished)document.getElementById('game-dist').textContent='📏 '+Math.round(dist)+'px zum Ziel';
      // Richtungspfeil am Bildschirmrand wenn Ziel außerhalb
      const arrow=document.getElementById('race-arrow');
      const screenX=(gx-camX)*SCALE, screenY=(gy-camY)*SCALE;
      const cw=canvas.width, ch=canvas.height, pad=50;
      const onScreen=screenX>=0&&screenX<=cw&&screenY>=0&&screenY<=ch;
      if(onScreen||activeGame.finished){arrow.style.display='none';}
      else{
        arrow.style.display='block';
        // Screen center
        const dx=screenX-cw/2, dy=screenY-ch/2;
        const ang=Math.atan2(dy,dx);
        // Clamp to edge rectangle
        const rx=cw/2-pad, ry=ch/2-pad;
        const t=Math.min(rx/Math.abs(Math.cos(ang))||Infinity, ry/Math.abs(Math.sin(ang))||Infinity);
        const px=cw/2+Math.cos(ang)*t, py=ch/2+Math.sin(ang)*t;
        arrow.style.left=(px-35)+'px';arrow.style.top=(py-35)+'px';
        arrow.style.transform='rotate('+(ang*180/Math.PI+90)+'deg)';
      }
      if(dist<25&&!activeGame.finished){
        activeGame.finished=true;activeGame.finishTime=activeGame.elapsed;
        const secs=(activeGame.finishTime/1000).toFixed(1);
        document.getElementById('game-score').textContent='🏁 '+secs+'s!';
        document.getElementById('game-dist').textContent='✅ Ziel erreicht!';
        showGameMsg('ZIEL ERREICHT!');
        arrow.style.display='none';
        if(socket&&socket.connected)socket.emit('race-finish');
        else addChatMsg('System','',`🏁 ${player.name} hat das Rennen in ${secs}s geschafft!`,true);
      }
    }
  }
  else if(activeGame.type==='ab'){
    // Antwort an Server senden (MP), sobald Spieler auf Zone steht
    if(socket&&socket.connected&&abZones){
      const onA=isInZone(player,abZones.a);const onB=isInZone(player,abZones.b);
      const choice=onA?'A':onB?'B':null;
      if(choice&&choice!==activeGame._lastSent){socket.emit('ab-answer',choice);activeGame._lastSent=choice;}
    }
    if(activeGame.questionTimer>0){
      activeGame.questionTimer-=dt*16.67;
      if(activeGame.questionTimer<=0){
        activeGame._lastSent=null;
        // Single-Player: lokale Antwort auswerten
        if(!(socket&&socket.connected)){
          const qa=activeGame.questions[activeGame.currentQ];
          if(qa&&abZones){
            const onA=isInZone(player,abZones.a)?'A':'';const onB=isInZone(player,abZones.b)?'B':'';
            const choice=onA||onB||'?';
            addChatMsg('System','',`Du hast ${choice==='?'?'kein Feld':'Feld '+choice} (${choice==='A'?qa.a:choice==='B'?qa.b:'---'}) gewählt!`,true);
            activeGame.currentQ++;
            if(activeGame.currentQ<activeGame.questions.length){setTimeout(()=>showNextABQuestion(),1500);}
            else {setTimeout(()=>endGame('Alle Fragen beantwortet!','🅰️🅱️','Letzte Frage!'),2000);return;}
          }
        }
      }
      document.getElementById('game-timer').textContent=Math.ceil(activeGame.questionTimer/1000)+'s';
    }
  }

  // Time up — lokales Auto-End nur bei Single-Player (im MP-Modus endet Server für alle)
  if(remaining<=0&&activeGame.type!=='ab'&&!(socket&&socket.connected)){
    if(activeGame.type==='tag')endGame('Zeit um!','Gefangen: '+activeGame.score,`Du hast ${activeGame.score} Spieler gefangen!`);
    else if(activeGame.type==='collect'){
      // Leaderboard für Single-Player (Spieler + ggf. Sim-NPCs)
      const rows=[{id:'me',name:player?.name||'Du',color:player?.color||'#3b82f6',score:activeGame.score||0,you:true}];
      if(activeGame.simScores)Object.entries(activeGame.simScores).forEach(([n,s])=>{
        const e=entities.find(x=>x.name===n);
        rows.push({id:n,name:n,color:e?e.color:'#888',score:s,you:false});
      });
      rows.sort((a,b)=>b.score-a.score);
      endGame('Zeit um!','⭐ '+activeGame.score,`Dein Score: ${activeGame.score}`,rows,10000);
    }
    else if(activeGame.type==='race'){
      if(!activeGame.finished)endGame('Zeit um!','Nicht geschafft!','Versuch es nochmal — du warst so nah dran!');
      else endGame('Rennen beendet!','🏁 '+(activeGame.finishTime/1000).toFixed(1)+'s','Gut gemacht!');
    }
  }
}

function isInZone(entity,zone){return entity.x>=zone.x&&entity.x<=zone.x+zone.w&&entity.y>=zone.y&&entity.y<=zone.y+zone.h;}
function updateCollectScoreboard(){
  if(!activeGame||activeGame.type!=='collect')return;
  const rows=[{name:player.name,color:player.color,score:activeGame.score||0,you:true}];
  const sims=activeGame.simScores||{};
  entities.filter(e=>e.isSimPlayer).forEach(e=>rows.push({name:e.name,color:e.color,score:sims[e.name]||0,you:false}));
  // Remote players: wir kennen ihre Scores nicht lokal (Server tracked) — zeigen 0 oder aus activeGame.scores falls vom Server
  entities.filter(e=>e.isRemotePlayer).forEach(e=>{const s=(activeGame.scores&&activeGame.scores[e.remoteId])||0;rows.push({name:e.name,color:e.color,score:s,you:false});});
  rows.sort((a,b)=>b.score-a.score);
  const html=rows.map((r,i)=>{const medal=i===0?'🥇 ':i===1?'🥈 ':i===2?'🥉 ':'';return `<div class="sb-row${r.you?' you':''}"><span class="sb-name"><span class="sb-dot" style="background:${r.color}"></span>${medal}${r.name}${r.you?' (Du)':''}</span><span class="sb-score">${r.score}</span></div>`;}).join('');
  document.getElementById('sb-entries').innerHTML=html||'<div style="color:#666;font-size:10px">Noch keine Punkte</div>';
}
function showGameMsg(msg){const el=document.getElementById('game-msg');el.textContent=msg;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),3000);}
let endAutoCloseTimer=null;
// Baut eine Leaderboard-Liste aus der `game-ended`-Payload. Bevorzugt die vom
// Server gelieferte `leaderboard`-Liste (hat Namen/Farben auch für disconnectete
// Spieler); fällt zurück auf `scores` + lokale Entities.
function buildLeaderboardRows(d){
  if(Array.isArray(d?.leaderboard)&&d.leaderboard.length){
    return d.leaderboard.map(r=>({id:r.id,name:r.name,color:r.color,score:r.score,you:r.id===myId}));
  }
  if(!d?.scores)return[];
  return Object.entries(d.scores).map(([id,s])=>{
    const e=entities.find(x=>x.remoteId===id);
    return{id,name:id===myId?(player?.name||'Du'):(e?e.name:'?'),color:id===myId?(player?.color||'#3b82f6'):(e?e.color:'#888'),score:s,you:id===myId};
  }).sort((a,b)=>b.score-a.score);
}
function escHtml(s){return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function endGame(title,result,detail,leaderboard,autoCloseMs,abResults){
  activeGame=null;gameItems=[];abZones=null;raceGoal=null;
  document.getElementById('game-hud').classList.remove('show');
  document.getElementById('game-scoreboard').classList.remove('show');
  document.getElementById('race-arrow').style.display='none';
  document.getElementById('game-dist').textContent='';
  document.getElementById('game-info').innerHTML='';
  document.getElementById('end-title').textContent=title;
  document.getElementById('end-result').textContent=result;
  document.getElementById('end-detail').textContent=detail;
  // Leaderboard rendern (oder leeren)
  const lbEl=document.getElementById('end-leaderboard');
  if(Array.isArray(leaderboard)&&leaderboard.length){
    const html=leaderboard.map((r,i)=>{
      // Bei Race: Medaillen nur für finishers; Nicht-Finisher ohne Rang
      const isRaceNotFin=r.finished===false;
      const medal=isRaceNotFin?'–':(i===0?'🥇':i===1?'🥈':i===2?'🥉':('#'+(i+1)));
      return `<div class="sb-row${r.you?' you':''}"><span class="sb-name"><span class="sb-medal">${medal}</span><span class="sb-dot" style="background:${escHtml(r.color||'#888')}"></span>${escHtml(r.name||'?')}${r.you?' (Du)':''}</span><span class="sb-score">${escHtml(r.score)}</span></div>`;
    }).join('');
    lbEl.innerHTML=html;lbEl.classList.add('show');
  } else {lbEl.innerHTML='';lbEl.classList.remove('show');}
  // A/B-Ergebnisse rendern (oder leeren)
  const abEl=document.getElementById('end-ab-results');
  if(Array.isArray(abResults)&&abResults.length){
    const renderChips=list=>list.length?list.map(p=>`<span class="name-chip${p.id===myId?' you':''}"><span class="dot" style="background:${escHtml(p.color||'#888')}"></span>${escHtml(p.name||'?')}${p.id===myId?' (Du)':''}</span>`).join(''):'<span style="color:#6b7280">—</span>';
    const html=abResults.map(q=>{
      const na=Array.isArray(q.noAnswer)&&q.noAnswer.length?`<div class="abr-noans">Keine Antwort: ${q.noAnswer.map(p=>escHtml(p.name)).join(', ')}</div>`:'';
      return `<div class="abr-q"><div class="abr-q-title"><span class="num">Frage ${q.idx+1}:</span>${escHtml(q.q)}</div><div class="abr-opts"><div class="abr-opt a"><div class="label">🅰️ ${escHtml(q.a)} <span style="color:#9ca3af;font-weight:400">(${q.aPlayers.length})</span></div><div class="names">${renderChips(q.aPlayers)}</div></div><div class="abr-opt b"><div class="label">🅱️ ${escHtml(q.b)} <span style="color:#9ca3af;font-weight:400">(${q.bPlayers.length})</span></div><div class="names">${renderChips(q.bPlayers)}</div></div></div>${na}</div>`;
    }).join('');
    abEl.innerHTML=html;abEl.classList.add('show');
  } else {abEl.innerHTML='';abEl.classList.remove('show');}
  document.getElementById('game-end').classList.add('show');
  entities.forEach(e=>e.tagged=false);
  // Auto-Close mit Countdown-Bar
  if(endAutoCloseTimer){clearTimeout(endAutoCloseTimer);endAutoCloseTimer=null;}
  const cd=document.getElementById('end-countdown');
  const bar=document.getElementById('end-countdown-bar');
  if(autoCloseMs&&autoCloseMs>0){
    cd.classList.add('show');
    // Reset Bar (volle Breite) → nach einem Frame Transition starten
    bar.classList.remove('run');bar.style.transition='none';bar.style.transform='scaleX(1)';
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      bar.style.transition=`transform ${autoCloseMs}ms linear`;
      bar.style.transform='scaleX(0)';
    }));
    endAutoCloseTimer=setTimeout(()=>{closeGameEnd();},autoCloseMs);
  } else {cd.classList.remove('show');}
}
function closeGameEnd(){
  document.getElementById('game-end').classList.remove('show');
  document.getElementById('end-countdown').classList.remove('show');
  if(endAutoCloseTimer){clearTimeout(endAutoCloseTimer);endAutoCloseTimer=null;}
}
function stopGameEarly(){
  if(!activeGame)return;
  // Im Multiplayer übernimmt der Server das Ende (schickt game-ended mit
  // Leaderboard an alle). Kein lokales Popup hier, sonst wird's doppelt gezeigt.
  if(socket&&socket.connected){socket.emit('stop-game');return;}
  // Single-Player: lokales Popup inkl. Leaderboard (falls vorhanden)
  const type=activeGame.type;
  if(type==='tag')endGame('Abgebrochen','Gefangen: '+(activeGame.score||0),`Spiel vorzeitig beendet.`);
  else if(type==='collect'){
    const rows=[{id:'me',name:player?.name||'Du',color:player?.color||'#3b82f6',score:activeGame.score||0,you:true}];
    if(activeGame.simScores)Object.entries(activeGame.simScores).forEach(([n,s])=>{
      const e=entities.find(x=>x.name===n);
      rows.push({id:n,name:n,color:e?e.color:'#888',score:s,you:false});
    });
    rows.sort((a,b)=>b.score-a.score);
    endGame('Abgebrochen','⭐ '+activeGame.score,`Dein Score: ${activeGame.score}`,rows,10000);
  }
  else if(type==='ab')endGame('Abgebrochen','🅰️🅱️',`${activeGame.currentQ} von ${activeGame.questions.length} Fragen beantwortet.`);
  else if(type==='race')endGame('Abgebrochen',activeGame.finished?'🏁 '+(activeGame.finishTime/1000).toFixed(1)+'s':'Nicht geschafft','Spiel vorzeitig beendet.');
}

// ===================== MINIGAME MENU =====================
function openMinigameMenu(){document.getElementById('minigame-overlay').classList.add('open');document.getElementById('mg-menu').style.display='';document.getElementById('mg-setup-area').style.display='none';}
function closeMinigameMenu(){document.getElementById('minigame-overlay').classList.remove('open');}

function showMgSetup(type){
  document.getElementById('mg-menu').style.display='none';
  const area=document.getElementById('mg-setup-area');area.style.display='';
  if(type==='tag'){
    area.innerHTML=`<h3>🏷️ Fangen — Setup</h3>
      <div class="mg-setup">
        <label>Dauer (Sekunden)</label><input type="number" id="mg-tag-dur" value="60" min="15" max="180">
        <label>Spielfeld-Größe</label>
        <select id="mg-tag-size"><option value="small">Klein (400x300)</option><option value="medium" selected>Mittel (600x450)</option><option value="large">Groß (900x600)</option></select>
        <p style="font-size:10px;color:#888;margin-top:6px">Du bist "es" — fang so viele wie möglich! Sprint mit Shift.</p>
        <button class="mg-start" onclick="startTagGame()">🏷️ Fangen starten!</button>
      </div>`;
  } else if(type==='collect'){
    area.innerHTML=`<h3>⭐ Sammelspiel — Setup</h3>
      <div class="mg-setup">
        <label>Dauer (Sekunden)</label><input type="number" id="mg-col-dur" value="45" min="15" max="120">
        <p style="font-size:10px;color:#888;margin-top:6px">Lauf über Items um sie einzusammeln! ⭐=1, 💰=2, 💎=3, 🏆=5 Punkte</p>
        <button class="mg-start" onclick="startCollectGame()">⭐ Sammeln starten!</button>
      </div>`;
  } else if(type==='ab'){
    area.innerHTML=`<h3>🅰️🅱️ A oder B — Setup</h3>
      <div class="mg-setup">
        <label>Fragen (eine pro Zeile, Format: Frage | Antwort A | Antwort B)</label>
        <textarea id="mg-ab-questions" placeholder="Bücher oder Kino? | Bücher | Kino\nBerge oder Meer? | Berge | Meer\nFrühaufsteher oder Nachteule? | Frühaufsteher | Nachteule">Bücher oder Kino? | Bücher | Kino
Berge oder Meer? | Berge | Meer
Frühaufsteher oder Nachteule? | Frühaufsteher | Nachteule
Pizza oder Pasta? | Pizza | Pasta
Home Office oder Büro? | Home Office | Büro</textarea>
        <label>Zeit pro Frage (Sekunden)</label><input type="number" id="mg-ab-time" value="10" min="5" max="30">
        <button class="mg-start" onclick="startABGame()">🅰️🅱️ Starten!</button>
      </div>`;
  } else if(type==='race'){
    area.innerHTML=`<h3>🏁 Wettrennen — Setup</h3>
      <div class="mg-setup">
        <label>Zeitlimit (Sekunden)</label><input type="number" id="mg-race-dur" value="30" min="10" max="120">
        <label>Distanz</label>
        <select id="mg-race-dist"><option value="short">Kurz (~400px)</option><option value="medium" selected>Mittel (~800px)</option><option value="long">Lang (~1400px)</option></select>
        <p style="font-size:10px;color:#888;margin-top:6px">Renn vom Start zum Ziel! Sprint mit Shift.</p>
        <button class="mg-start" onclick="startRaceGame()">🏁 Rennen starten!</button>
      </div>`;
  }
}

function doCountdown(cb){
  closeMinigameMenu();
  const cd=document.getElementById('countdown');cd.classList.add('show');
  let count=3;cd.textContent=count;
  const iv=setInterval(()=>{count--;if(count>0)cd.textContent=count;else{cd.textContent='GO!';clearInterval(iv);setTimeout(()=>{cd.classList.remove('show');cb();},600);}},1000);
}

function startTagGame(){
  const dur=parseInt(document.getElementById('mg-tag-dur').value)*1000||60000;
  const sizeKey=document.getElementById('mg-tag-size').value;
  // Multiplayer: Server startet das Spiel für alle
  if(socket&&socket.connected){socket.emit('start-game',{type:'tag',duration:dur,size:sizeKey,taggerId:myId,startTime:Date.now()});closeMinigameMenu();return;}
  // Single-Player fallback
  const sizes={small:[400,300],medium:[600,450],large:[900,600]};
  const[aw,ah]=sizes[sizeKey]||sizes.medium;
  const ax=player.x-aw/2,ay=player.y-ah/2;
  const arena={x:Math.max(0,ax),y:Math.max(0,ay),w:aw,h:ah};
  doCountdown(()=>{
    activeGame={type:'tag',duration:dur,elapsed:0,score:0,arena};
    document.getElementById('game-hud').classList.add('show');
    document.getElementById('game-title').textContent='🏷️ FANGEN';
    document.getElementById('game-score').textContent='Gefangen: 0';
    addChatMsg('System','','🏷️ Fangen gestartet!',true);
  });
}

function startCollectGame(){
  const dur=parseInt(document.getElementById('mg-col-dur').value)*1000||45000;
  if(socket&&socket.connected){socket.emit('start-game',{type:'collect',duration:dur,startTime:Date.now()});closeMinigameMenu();return;}
  // Single-Player fallback
  gameItems=[];
  for(let i=0;i<12;i++){
    const types=[{emoji:'⭐',points:1},{emoji:'💎',points:3},{emoji:'🍎',points:1},{emoji:'🏆',points:5},{emoji:'💰',points:2}];
    const t=types[Math.floor(Math.random()*types.length)];
    gameItems.push({x:100+Math.random()*(WORLD_W-200),y:100+Math.random()*(WORLD_H-200),...t,spawnTime:Date.now()});
  }
  doCountdown(()=>{
    activeGame={type:'collect',duration:dur,elapsed:0,score:0,simScores:{}};
    document.getElementById('game-hud').classList.add('show');
    document.getElementById('game-title').textContent='⭐ SAMMELN';
    document.getElementById('game-score').textContent='⭐ 0 Punkte';
    document.getElementById('game-info').innerHTML='<span class="legend-item">⭐ 1P</span><span class="legend-item">🍎 1P</span><span class="legend-item">💰 2P</span><span class="legend-item">💎 3P</span><span class="legend-item">🏆 5P</span> — laufe drüber';
    document.getElementById('game-scoreboard').classList.add('show');
    document.getElementById('sb-title').textContent='⭐ Punktestand';
  });
}

function startABGame(){
  const raw=document.getElementById('mg-ab-questions').value.trim().split('\n').filter(l=>l.includes('|'));
  const questions=raw.map(l=>{const[q,a,b]=l.split('|').map(s=>s.trim());return{q,a:a||'A',b:b||'B'};});
  if(questions.length===0){alert('Bitte mindestens eine Frage eingeben!');return;}
  const timePerQ=parseInt(document.getElementById('mg-ab-time').value)*1000||10000;
  if(socket&&socket.connected){socket.emit('start-game',{type:'ab',questions,timePerQ,startTime:Date.now()});closeMinigameMenu();return;}
  // Single-Player fallback
  const cx=clamp(player.x,200,WORLD_W-200),cy=clamp(player.y,200,WORLD_H-200);
  abZones={a:{x:cx-150,y:cy-40,w:80,h:80},b:{x:cx+70,y:cy-40,w:80,h:80}};
  player.x=cx;player.y=cy+60;
  doCountdown(()=>{
    activeGame={type:'ab',duration:999999,elapsed:0,questions,currentQ:0,timePerQ,questionTimer:0};
    document.getElementById('game-hud').classList.add('show');
    document.getElementById('game-title').textContent='🅰️🅱️ A ODER B';
    document.getElementById('game-score').textContent='';
    showNextABQuestion();
  });
}
function showNextABQuestion(){
  if(!activeGame||activeGame.type!=='ab')return;
  const q=activeGame.questions[activeGame.currentQ];
  if(!q)return;
  activeGame.questionTimer=activeGame.timePerQ;
  document.getElementById('game-score').textContent=q.q;
  document.getElementById('game-title').innerHTML=`Frage ${activeGame.currentQ+1}/${activeGame.questions.length}`;
  showGameMsg(`🅰️ ${q.a}   |   🅱️ ${q.b}`);
  addChatMsg('System','',`❓ ${q.q} — 🅰️ ${q.a} | 🅱️ ${q.b}`,true);
}

function startRaceGame(){
  const dur=parseInt(document.getElementById('mg-race-dur').value)*1000||30000;
  const distKey=document.getElementById('mg-race-dist').value;
  if(socket&&socket.connected){socket.emit('start-game',{type:'race',duration:dur,dist:distKey,startTime:Date.now()});closeMinigameMenu();return;}
  const dists={short:400,medium:800,long:1400};
  const d=dists[distKey]||800;
  const angle=Math.random()*Math.PI*2;
  const gx=clamp(player.x+Math.cos(angle)*d,50,WORLD_W-90);
  const gy=clamp(player.y+Math.sin(angle)*d,50,WORLD_H-90);
  raceGoal={x:gx,y:gy,w:40,h:40};
  const startPos={x:player.x,y:player.y};
  doCountdown(()=>{
    activeGame={type:'race',duration:dur,elapsed:0,finished:false,finishTime:0,startPos,totalDist:d};
    document.getElementById('game-hud').classList.add('show');
    document.getElementById('game-title').textContent='🏁 WETTRENNEN';
    document.getElementById('game-score').textContent='Lauf zum Ziel!';
    document.getElementById('game-info').innerHTML='🏁 Ziel ist markiert (grüner Pfeil zeigt Richtung). Sprint mit <kbd>Shift</kbd>!';
    document.getElementById('race-arrow').classList.add('show');
    addChatMsg('System','',`🏁 Wettrennen gestartet — Ziel ist ${Math.round(d)}px entfernt!`,true);
  });
}

// ===================== POLISH HELPERS =====================
function ensureGrassPattern(){
  if(grassPattern)return grassPattern;
  const gc=document.createElement('canvas');gc.width=64;gc.height=64;
  const gx=gc.getContext('2d');gx.imageSmoothingEnabled=false;
  gx.fillStyle='#1e3a1e';gx.fillRect(0,0,64,64);
  // darker blades
  for(let i=0;i<60;i++){gx.fillStyle='#183018';gx.fillRect(Math.floor(Math.random()*64),Math.floor(Math.random()*64),1,2);}
  // mid blades
  for(let i=0;i<70;i++){gx.fillStyle='#234a23';gx.fillRect(Math.floor(Math.random()*64),Math.floor(Math.random()*64),1,2);}
  // highlights
  for(let i=0;i<30;i++){gx.fillStyle='#2d5a2d';gx.fillRect(Math.floor(Math.random()*64),Math.floor(Math.random()*64),1,1);}
  // tiny flower specks
  for(let i=0;i<8;i++){gx.fillStyle=['#fde047','#f472b6','#60a5fa'][Math.floor(Math.random()*3)];gx.fillRect(Math.floor(Math.random()*64),Math.floor(Math.random()*64),1,1);}
  grassPatternCanvas=gc;grassPattern=ctx.createPattern(gc,'repeat');return grassPattern;
}
function initClouds(){
  clouds=[];
  for(let i=0;i<14;i++){
    clouds.push({
      x:Math.random()*WORLD_W,
      y:Math.random()*WORLD_H,
      w:60+Math.random()*100,
      h:22+Math.random()*18,
      speed:0.08+Math.random()*0.12,
      opacity:0.10+Math.random()*0.10
    });
  }
}
function updateClouds(dt){
  if(!clouds.length)initClouds();
  clouds.forEach(c=>{
    c.x+=c.speed*dt;
    if(c.x>WORLD_W+120){c.x=-c.w-20;c.y=Math.random()*WORLD_H;}
  });
}
function drawClouds(){
  clouds.forEach(c=>{
    ctx.fillStyle=`rgba(255,255,255,${c.opacity})`;
    ctx.beginPath();
    ctx.ellipse(c.x,c.y,c.w*.5,c.h*.5,0,0,Math.PI*2);
    ctx.ellipse(c.x+c.w*.25,c.y-c.h*.2,c.w*.35,c.h*.4,0,0,Math.PI*2);
    ctx.ellipse(c.x-c.w*.25,c.y+c.h*.1,c.w*.30,c.h*.35,0,0,Math.PI*2);
    ctx.fill();
  });
}
function spawnCollectParticles(x,y,color){
  const col=color||'#fde047';
  for(let i=0;i<12;i++){
    const a=Math.random()*Math.PI*2;
    const s=.4+Math.random()*1.2;
    particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-.8,ttl:28+Math.random()*14,age:0,color:col,size:1+Math.floor(Math.random()*2)});
  }
}
function updateParticles(dt){
  particles.forEach(p=>{
    p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=0.07*dt;p.age+=dt;
  });
  particles=particles.filter(p=>p.age<p.ttl);
}
function drawParticles(){
  particles.forEach(p=>{
    const life=1-(p.age/p.ttl);
    ctx.globalAlpha=Math.max(0,life);
    ctx.fillStyle=p.color;
    ctx.fillRect(Math.round(p.x),Math.round(p.y),p.size,p.size);
  });
  ctx.globalAlpha=1;
}
function triggerShake(mag,dur){
  shakeTime=Math.max(shakeTime,dur);
  shakeMag=Math.max(shakeMag,mag);
}

// ===================== RENDER =====================
function render(){
  const w=canvas.width,h=canvas.height;ctx.clearRect(0,0,w,h);
  // Screen shake: offset camera by a random jitter that decays
  let sxJ=0,syJ=0;
  if(shakeTime>0){
    sxJ=(Math.random()-.5)*shakeMag*2;
    syJ=(Math.random()-.5)*shakeMag*2;
    shakeTime-=16.67;
    if(shakeTime<=0){shakeTime=0;shakeMag=0;}
  }
  ctx.save();ctx.scale(SCALE,SCALE);ctx.translate(-camX+sxJ,-camY+syJ);
  // Grass pattern background
  const gp=ensureGrassPattern();
  ctx.fillStyle=gp||'#1e3a1e';ctx.fillRect(0,0,WORLD_W,WORLD_H);
  // Grid (subtle)
  ctx.strokeStyle='rgba(255,255,255,.012)';ctx.lineWidth=.5;
  for(let x=0;x<WORLD_W;x+=32){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,WORLD_H);ctx.stroke();}
  for(let y=0;y<WORLD_H;y+=32){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(WORLD_W,y);ctx.stroke();}
  // Paths
  ctx.lineWidth=12;ctx.strokeStyle='#2a3a20';worldObjs.filter(o=>o.type==='path').forEach(p=>{ctx.beginPath();ctx.moveTo(p.x1,p.y1);ctx.lineTo(p.x2,p.y2);ctx.stroke();});
  ctx.lineWidth=8;ctx.strokeStyle='#333d28';worldObjs.filter(o=>o.type==='path').forEach(p=>{ctx.beginPath();ctx.moveTo(p.x1,p.y1);ctx.lineTo(p.x2,p.y2);ctx.stroke();});
  // Flowers
  worldObjs.filter(o=>o.type==='flower').forEach(f=>{ctx.fillStyle='#2d5a2d';ctx.fillRect(f.x,f.y+2,1,3);ctx.fillStyle=f.color;ctx.fillRect(f.x-1,f.y,3,3);ctx.fillStyle='#fef08a';ctx.fillRect(f.x,f.y+1,1,1);});
  // Ponds (with animated waves + shoreline)
  const tNow=Date.now()/1000;
  worldObjs.filter(o=>o.type==='pond').forEach(p=>{
    const cx=p.x+p.w/2, cy=p.y+p.h/2;
    // shoreline (lighter outline)
    ctx.fillStyle='#2a4a2a';ctx.beginPath();ctx.ellipse(cx,cy,p.w/2+2,p.h/2+2,0,0,Math.PI*2);ctx.fill();
    // deep water
    ctx.fillStyle='#0f3654';ctx.beginPath();ctx.ellipse(cx,cy,p.w/2,p.h/2,0,0,Math.PI*2);ctx.fill();
    // shallow highlight
    ctx.fillStyle='rgba(100,180,255,.15)';ctx.beginPath();ctx.ellipse(cx-5,cy-3,p.w/4,p.h/4,0,0,Math.PI*2);ctx.fill();
    // animated ripples
    ctx.strokeStyle='rgba(180,220,255,.35)';ctx.lineWidth=.6;
    for(let i=0;i<3;i++){
      const phase=tNow*1.2+i*1.4;
      const ry=cy+Math.sin(phase)*1.2+(i-1)*3;
      const rx1=cx-p.w/2*.6+Math.sin(phase*.8)*1.5;
      const rx2=cx+p.w/2*.6+Math.cos(phase*.7)*1.5;
      ctx.beginPath();ctx.moveTo(rx1,ry);ctx.bezierCurveTo(cx-2,ry-1.2,cx+2,ry+1.2,rx2,ry);ctx.stroke();
    }
    // specular sparkle
    const sp=Math.abs(Math.sin(tNow*2+p.x))*.5+.3;
    ctx.fillStyle=`rgba(255,255,255,${sp*.35})`;ctx.fillRect(cx-p.w/4,cy-p.h/6,2,1);
  });
  // Buildings
  worldObjs.filter(o=>o.type==='building').forEach(b=>{ctx.fillStyle='#5a3a2a';ctx.beginPath();ctx.moveTo(b.x-3,b.y);ctx.lineTo(b.x+b.w/2,b.y-10);ctx.lineTo(b.x+b.w+3,b.y);ctx.fill();ctx.fillStyle='#3a3a5a';ctx.fillRect(b.x,b.y,b.w,b.h);for(let r=0;r<2;r++)for(let c=0;c<3;c++){ctx.fillStyle=`rgba(255,200,50,${.4+Math.random()*.3})`;ctx.fillRect(b.x+5+c*Math.floor(b.w/3.5),b.y+6+r*14,6,8);}ctx.fillStyle='#4a3020';ctx.fillRect(b.x+b.w/2-4,b.y+b.h-12,8,12);});
  // Rock shadows
  worldObjs.filter(o=>o.type==='rock').forEach(r=>{ctx.fillStyle='rgba(0,0,0,.2)';ctx.beginPath();ctx.ellipse(r.x+1,r.y+r.size*.6,r.size,r.size*.35,0,0,Math.PI*2);ctx.fill();});
  // Rocks
  worldObjs.filter(o=>o.type==='rock').forEach(r=>{ctx.fillStyle='#4a4a5a';ctx.beginPath();ctx.ellipse(r.x,r.y,r.size,r.size*.65,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#5a5a6a';ctx.beginPath();ctx.ellipse(r.x-1,r.y-1,r.size*.6,r.size*.4,0,0,Math.PI*2);ctx.fill();});
  // Tree shadows
  worldObjs.filter(o=>o.type==='tree').forEach(t=>{ctx.fillStyle='rgba(0,0,0,.22)';ctx.beginPath();ctx.ellipse(t.x+10,t.y+24,11,3.5,0,0,Math.PI*2);ctx.fill();});
  // Trees
  worldObjs.filter(o=>o.type==='tree').forEach(t=>{ctx.fillStyle='#5a3a1a';ctx.fillRect(t.x+8,t.y+14,4,12);ctx.fillStyle=`hsl(${t.hue},45%,${t.light}%)`;ctx.beginPath();ctx.arc(t.x+10,t.y+10,12,0,Math.PI*2);ctx.fill();ctx.fillStyle=`hsl(${t.hue},50%,${t.light+8}%)`;ctx.beginPath();ctx.arc(t.x+8,t.y+8,7,0,Math.PI*2);ctx.fill();});
  // Campfires (multi-layer flame + sparks)
  const ff=Math.sin(Date.now()/150)*2;
  const ff2=Math.sin(Date.now()/90)*1.5;
  worldObjs.filter(o=>o.type==='fire').forEach(f=>{
    // logs
    ctx.fillStyle='#3a2a1a';ctx.fillRect(f.x-4,f.y+2,8,3);
    ctx.fillStyle='#5a3a20';ctx.fillRect(f.x-5,f.y+3,2,1);ctx.fillRect(f.x+3,f.y+3,2,1);
    // outer flame
    ctx.fillStyle='#ff6600';ctx.beginPath();ctx.ellipse(f.x,f.y+ff,4,6+ff,0,0,Math.PI*2);ctx.fill();
    // mid flame
    ctx.fillStyle='#ffaa00';ctx.beginPath();ctx.ellipse(f.x,f.y-1+ff,2,3+ff2*.3,0,0,Math.PI*2);ctx.fill();
    // hot core
    ctx.fillStyle='#fffbdd';ctx.beginPath();ctx.ellipse(f.x,f.y-2+ff*.4,1,1.5,0,0,Math.PI*2);ctx.fill();
    // sparks
    const sTime=Date.now()/100+f.x;
    for(let k=0;k<2;k++){
      const ox=Math.sin(sTime+k*1.7)*3;
      const oy=-((Date.now()/80+k*30+f.x*.3)%30)*.4;
      ctx.fillStyle=`rgba(255,200,80,${.6-Math.abs(oy)/15})`;
      ctx.fillRect(f.x+ox,f.y+oy-3,1,1);
    }
    // glow
    const gr=ctx.createRadialGradient(f.x,f.y,2,f.x,f.y,35);
    gr.addColorStop(0,'rgba(255,140,40,.25)');gr.addColorStop(1,'rgba(255,100,0,0)');
    ctx.fillStyle=gr;ctx.beginPath();ctx.arc(f.x,f.y,35,0,Math.PI*2);ctx.fill();
  });

  // === GAME OVERLAYS ===
  // Tag arena
  if(activeGame?.type==='tag'){
    const a=activeGame.arena;
    ctx.strokeStyle='rgba(255,50,50,.6)';ctx.lineWidth=2;ctx.setLineDash([6,4]);ctx.strokeRect(a.x,a.y,a.w,a.h);ctx.setLineDash([]);
    ctx.fillStyle='rgba(255,50,50,.04)';ctx.fillRect(a.x,a.y,a.w,a.h);
    // Label
    ctx.font='bold 6px sans-serif';ctx.fillStyle='rgba(255,100,100,.7)';ctx.textAlign='center';
    ctx.fillText('🏷️ FANGEN ARENA',a.x+a.w/2,a.y-4);
  }
  // Collect items
  if(activeGame?.type==='collect'){
    gameItems.forEach(it=>{
      if(it.collected)return;
      const pulse=Math.sin(Date.now()/250+it.x)*.5+.5;
      const bob=Math.sin(Date.now()/350+it.x)*1.5;
      // outer glow
      ctx.fillStyle=`rgba(255,220,80,${.15+pulse*.2})`;ctx.beginPath();ctx.arc(it.x,it.y+bob,14,0,Math.PI*2);ctx.fill();
      // inner ring
      ctx.strokeStyle=`rgba(255,200,50,${.5+pulse*.4})`;ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(it.x,it.y+bob,9,0,Math.PI*2);ctx.stroke();
      // emoji (bigger)
      ctx.font='14px sans-serif';ctx.textAlign='center';ctx.fillText(it.emoji,it.x,it.y+bob+5);
      // point label
      ctx.font='bold 5px sans-serif';ctx.fillStyle='#fde047';ctx.fillText('+'+it.points,it.x,it.y+bob-10);
    });
  }
  // A/B zones
  if(abZones){
    ctx.fillStyle='rgba(59,130,246,.15)';ctx.fillRect(abZones.a.x,abZones.a.y,abZones.a.w,abZones.a.h);
    ctx.strokeStyle='rgba(59,130,246,.6)';ctx.lineWidth=1.5;ctx.strokeRect(abZones.a.x,abZones.a.y,abZones.a.w,abZones.a.h);
    ctx.font='bold 12px sans-serif';ctx.fillStyle='rgba(59,130,246,.8)';ctx.textAlign='center';
    ctx.fillText('A',abZones.a.x+abZones.a.w/2,abZones.a.y+abZones.a.h/2+4);

    ctx.fillStyle='rgba(239,68,68,.15)';ctx.fillRect(abZones.b.x,abZones.b.y,abZones.b.w,abZones.b.h);
    ctx.strokeStyle='rgba(239,68,68,.6)';ctx.lineWidth=1.5;ctx.strokeRect(abZones.b.x,abZones.b.y,abZones.b.w,abZones.b.h);
    ctx.fillStyle='rgba(239,68,68,.8)';ctx.fillText('B',abZones.b.x+abZones.b.w/2,abZones.b.y+abZones.b.h/2+4);

    if(activeGame?.type==='ab'&&activeGame.questions[activeGame.currentQ]){
      const q=activeGame.questions[activeGame.currentQ];
      ctx.font='bold 4px sans-serif';ctx.fillStyle='rgba(59,130,246,.9)';
      ctx.fillText(q.a,abZones.a.x+abZones.a.w/2,abZones.a.y-4);
      ctx.fillStyle='rgba(239,68,68,.9)';
      ctx.fillText(q.b,abZones.b.x+abZones.b.w/2,abZones.b.y-4);
    }
  }
  // Race goal + route
  if(raceGoal){
    const gx=raceGoal.x+raceGoal.w/2, gy=raceGoal.y+raceGoal.h/2;
    // Dashed route from start position to goal
    if(activeGame?.type==='race'&&activeGame.startPos){
      ctx.strokeStyle='rgba(34,197,94,.35)';ctx.lineWidth=2;ctx.setLineDash([6,5]);
      ctx.beginPath();ctx.moveTo(activeGame.startPos.x,activeGame.startPos.y);ctx.lineTo(gx,gy);ctx.stroke();ctx.setLineDash([]);
      // Start marker
      ctx.fillStyle='rgba(251,191,36,.5)';ctx.beginPath();ctx.arc(activeGame.startPos.x,activeGame.startPos.y,6,0,Math.PI*2);ctx.fill();
      ctx.font='bold 5px sans-serif';ctx.fillStyle='#fbbf24';ctx.textAlign='center';ctx.fillText('START',activeGame.startPos.x,activeGame.startPos.y-8);
    }
    // Pulsing outer ring (big, visible)
    const pulse=(Date.now()/500)%1;
    const r1=20+pulse*40;
    ctx.strokeStyle=`rgba(34,197,94,${.8-pulse*.8})`;ctx.lineWidth=3;
    ctx.beginPath();ctx.arc(gx,gy,r1,0,Math.PI*2);ctx.stroke();
    // Inner solid pillar
    ctx.fillStyle='rgba(34,197,94,.25)';ctx.fillRect(raceGoal.x-4,raceGoal.y-4,raceGoal.w+8,raceGoal.h+8);
    ctx.strokeStyle='#22c55e';ctx.lineWidth=2;ctx.setLineDash([4,3]);ctx.strokeRect(raceGoal.x,raceGoal.y,raceGoal.w,raceGoal.h);ctx.setLineDash([]);
    // Big flag
    const bob=Math.sin(Date.now()/200)*2;
    ctx.font='28px sans-serif';ctx.textAlign='center';ctx.fillText('🏁',gx,gy+10+bob);
    // Label above
    ctx.font='bold 6px sans-serif';ctx.fillStyle='#22c55e';ctx.fillText('ZIEL',gx,raceGoal.y-6);
  }

  // Particles under entities (above ground)
  drawParticles();

  // Entities sorted by Y
  const now=Date.now();
  [...entities].sort((a,b)=>a.y-b.y).forEach(e=>{
    // Walk bob (1 pixel up/down, snapped for pixel-art look)
    const bob=e.moving?Math.floor(Math.sin(now/110+e.x*.07)+1)-1:0; // -1 or 0
    const eyR=Math.round(e.y)+bob;
    // Shadow under entity
    ctx.fillStyle='rgba(0,0,0,.28)';ctx.beginPath();
    ctx.ellipse(e.x+8,Math.round(e.y)+14.5,4.5,1.3,0,0,Math.PI*2);ctx.fill();
    // Tagged indicator
    if(e.tagged){ctx.fillStyle='rgba(255,0,0,.1)';ctx.beginPath();ctx.arc(e.x+8,eyR+8,12,0,Math.PI*2);ctx.fill();}
    ctx.drawImage(e.sprite,e.frame*16,e.dir*16,16,16,Math.round(e.x),eyR,16,16);
    // Name
    ctx.save();ctx.font='bold 4px sans-serif';ctx.textAlign='center';
    const nw=ctx.measureText(e.name).width+4;ctx.fillStyle='rgba(0,0,0,.7)';
    roundRect(ctx,e.x+8-nw/2,eyR-6,nw,7,2);ctx.fillStyle=e.isAgent?'#c4b5fd':'#fff';
    ctx.fillText((e.isAgent?'🤖 ':'')+e.name+(e.tagged?' ❌':''),e.x+8,eyR-1);ctx.restore();
    // Speech
    if(e.speechText){ctx.save();ctx.font='3.5px sans-serif';const lines=wrapText(ctx,e.speechText,60);const bw=Math.min(65,Math.max(...lines.map(l=>ctx.measureText(l).width))+8);const bh=lines.length*5+6;const bx=e.x+8-bw/2;const by=eyR-10-bh;
    ctx.fillStyle='rgba(255,255,255,.95)';roundRect(ctx,bx,by,bw,bh,3);ctx.beginPath();ctx.moveTo(e.x+5,by+bh);ctx.lineTo(e.x+8,by+bh+3);ctx.lineTo(e.x+11,by+bh);ctx.fill();
    ctx.fillStyle='#1a1a2e';lines.forEach((l,li)=>ctx.fillText(l,bx+4,by+5+li*5));ctx.restore();}
  });

  // Clouds drifting above everything (subtle)
  drawClouds();

  ctx.restore();
}
function roundRect(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);ctx.lineTo(x+r,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-r);ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.fill();}
function wrapText(ctx,text,maxW){const words=text.split(' ');const lines=[];let line='';words.forEach(w=>{const test=line?line+' '+w:w;if(ctx.measureText(test).width>maxW&&line){lines.push(line);line=w;}else line=test;});if(line)lines.push(line);return lines;}

// ===================== HUD =====================
function updateHUD(){document.getElementById('hud-pos').textContent=`${Math.round(player.x)}, ${Math.round(player.y)}`;document.getElementById('hud-online').textContent=`Online: ${entities.length}`;}
function updateMinimap(){const mc=document.getElementById('minimap-canvas'),mx=mc.getContext('2d'),sx=mc.width/WORLD_W,sy=mc.height/WORLD_H;mx.fillStyle='#1e3a1e';mx.fillRect(0,0,mc.width,mc.height);
worldObjs.filter(o=>o.type==='tree').forEach(t=>{mx.fillStyle='#2d5a2d';mx.fillRect(t.x*sx-1,t.y*sy-1,2,2);});
if(raceGoal){mx.fillStyle='#22c55e';mx.fillRect(raceGoal.x*sx-2,raceGoal.y*sy-2,5,5);}
if(activeGame?.type==='tag'){const a=activeGame.arena;mx.strokeStyle='#f87171';mx.lineWidth=1;mx.strokeRect(a.x*sx,a.y*sy,a.w*sx,a.h*sy);}
entities.forEach(e=>{mx.fillStyle=e.isAgent?'#a855f7':e.color;mx.beginPath();mx.arc(e.x*sx,e.y*sy,e===player?3:2,0,Math.PI*2);mx.fill();});
const vw=canvas.width/SCALE,vh=canvas.height/SCALE;mx.strokeStyle='rgba(255,255,255,.3)';mx.lineWidth=1;mx.strokeRect(camX*sx,camY*sy,vw*sx,vh*sy);}
function updateOnlineList(){document.getElementById('online-entries').innerHTML=entities.map(e=>`<div class="online-entry"><div class="online-dot" style="background:${e.color}"></div><span>${e.isAgent?'🤖 ':''}${e.name}${e===player?' (Du)':''}${e.tagged?' ❌':''}</span></div>`).join('');}

// ===================== CHAT =====================
function addChatMsg(n,c,t,sys=false,ag=false){const log=document.getElementById('chat-log'),d=document.createElement('div');d.className='chat-msg'+(sys?' system':'')+(ag?' agent':'');d.innerHTML=sys?t:`<span class="name" style="color:${c}">${n}:</span> ${esc(t)}`;log.appendChild(d);log.scrollTop=log.scrollHeight;}
function sendChat(){const inp=document.getElementById('chat-input'),t=inp.value.trim();if(!t)return;player.speechText=t;player.speechTimer=4000;inp.value='';
if(socket&&socket.connected){socket.emit('chat',t);return;}
addChatMsg(player.name,player.color,t);
const near=entities.filter(e=>e.isAgent&&e.agentCfg?.active&&distance(e,player)<350);
if(near.length>0&&Math.random()>.3){const a=near[Math.floor(Math.random()*near.length)];setTimeout(()=>{const p=PERSONALITIES[a.agentCfg.personality];const r=p?p.msgs[Math.floor(Math.random()*p.msgs.length)]:"Hmm!";a.speechText=r;a.speechTimer=4000;addChatMsg(a.name,a.color,r,false,true);},1500+Math.random()*2000);}}
function toggleChatPanel(){chatHidden=!chatHidden;document.getElementById('chat-panel').classList.toggle('hidden',chatHidden);const b=document.getElementById('chat-toggle-btn');b.classList.toggle('chat-off',chatHidden);b.textContent=chatHidden?'🚫':'💬';if(chatHidden){document.getElementById('chat-input').blur();chatFocused=false;}}

// ===================== AGENTS QUICK TOGGLE =====================
function quickToggleAgents(){
  // Bei Socket-Verbindung an Server delegieren, damit alle Spieler den gleichen Zustand haben
  if(socket&&socket.connected){socket.emit('toggle-agents');return;}
  agentsEnabled=!agentsEnabled;
  const btn=document.getElementById('agents-quick-toggle');
  btn.textContent=agentsEnabled?'👁 Agents An':'🚫 Agents Aus';
  btn.classList.toggle('agents-off',!agentsEnabled);
  spawnAgentsFromConfig();
  addChatMsg('System','',agentsEnabled?'Alle Agents aktiviert.':'Alle Agents deaktiviert — nur Team-Modus!',true);
}

// ===================== CONFIG PANEL =====================
function toggleConfig(){configOpen=!configOpen;document.getElementById('config-overlay').classList.toggle('open',configOpen);if(configOpen)renderConfigPanel();}
function renderConfigPanel(){document.getElementById('agent-config-list').innerHTML=agentConfigs.map((cfg,i)=>`
  <div class="config-section collapsed" id="as-${i}"><div class="config-section-header" onclick="document.getElementById('as-${i}').classList.toggle('collapsed')">
    <h3><span style="color:${cfg.color}">${PERSONALITIES[cfg.personality]?.emoji||'🤖'}</span> ${cfg.name}
      <span class="agent-status ${cfg.active?'active':'paused'}"><span class="agent-status-dot"></span>${cfg.active?'An':'Aus'}</span></h3>
    <span class="section-toggle">▼</span></div>
  <div class="config-section-body">
    <div class="config-row"><label>Name</label><input type="text" value="${cfg.name}" maxlength="20" onchange="uCfg(${i},'name',this.value)">
      <label style="min-width:35px">Farbe</label><input type="color" value="${cfg.color}" onchange="uCfg(${i},'color',this.value)"></div>
    <div class="config-row"><label>Persönlichkeit</label><div class="personality-chips">
      ${Object.entries(PERSONALITIES).map(([k,p])=>`<span class="p-chip ${cfg.personality===k?'active':''}" onclick="uCfg(${i},'personality','${k}');renderConfigPanel()">${p.emoji} ${p.label}</span>`).join('')}</div></div>
    <div class="config-row"><label>Speed</label><input type="range" min="0.2" max="5" step="0.1" value="${cfg.speed}" oninput="uCfg(${i},'speed',+this.value);this.nextElementSibling.textContent=this.value+'x'"><span class="range-val">${cfg.speed}x</span></div>
    <div class="config-row"><label>Chat-Freq</label><input type="range" min="3" max="60" step="1" value="${cfg.chatFreq}" oninput="uCfg(${i},'chatFreq',+this.value);this.nextElementSibling.textContent=this.value+'s'"><span class="range-val">${cfg.chatFreq}s</span></div>
    <div class="config-row"><label>Wanderradius</label><input type="range" min="50" max="1000" step="10" value="${cfg.wanderRadius}" oninput="uCfg(${i},'wanderRadius',+this.value);this.nextElementSibling.textContent=this.value"><span class="range-val">${cfg.wanderRadius}</span></div>
    <div class="config-row"><label>Eigene Msgs</label><textarea onchange="uCfg(${i},'customMsgs',this.value.split('\\n').filter(l=>l.trim()))">${(cfg.customMsgs||[]).join('\n')}</textarea></div>
    <div class="agent-actions">
      <button class="btn-sm ${cfg.active?'btn-warning':'btn-success'}" onclick="tAgent(${i})">${cfg.active?'⏸':'▶'}</button>
      <button class="btn-sm btn-success" onclick="tpAgent(${i})">📍</button>
      <button class="btn-sm btn-danger" onclick="rmAgent(${i})">🗑</button></div>
  </div></div>`).join('');}
function uCfg(i,k,v){agentConfigs[i][k]=v;const a=entities.find(e=>e.isAgent&&e.agentCfg===agentConfigs[i]);if(a){if(k==='name')a.name=v;if(k==='color'){a.color=v;rebuildSprite(a);}}}
function tAgent(i){agentConfigs[i].active=!agentConfigs[i].active;spawnAgentsFromConfig();renderConfigPanel();}
function tpAgent(i){const a=entities.find(e=>e.isAgent&&e.agentCfg===agentConfigs[i]);if(a){a.x=player.x+(Math.random()-.5)*80;a.y=player.y+(Math.random()-.5)*80;}}
function rmAgent(i){agentConfigs.splice(i,1);spawnAgentsFromConfig();renderConfigPanel();}
function addNewAgent(){const pk=Object.keys(PERSONALITIES);agentConfigs.push({name:`Agent ${agentConfigs.length+1}`,color:`hsl(${Math.random()*360},70%,50%)`,personality:pk[Math.floor(Math.random()*pk.length)],speed:1+Math.random()*1.5,chatFreq:8+Math.floor(Math.random()*15),wanderRadius:200+Math.floor(Math.random()*400),active:true,customMsgs:[]});spawnAgentsFromConfig();renderConfigPanel();}
function toggleAllAgents(){const any=agentConfigs.some(c=>c.active);agentConfigs.forEach(c=>c.active=!any);spawnAgentsFromConfig();renderConfigPanel();}
function resetAllAgents(){agentConfigs=JSON.parse(JSON.stringify(DEFAULT_AGENTS));spawnAgentsFromConfig();renderConfigPanel();}
function exportConfig(){navigator.clipboard.writeText(JSON.stringify(agentConfigs,null,2)).then(()=>addChatMsg('System','','Config kopiert!',true)).catch(()=>prompt('Config:',JSON.stringify(agentConfigs)));}
function importConfigPrompt(){const j=prompt('JSON:');if(!j)return;try{const p=JSON.parse(j);if(Array.isArray(p)){agentConfigs=p;spawnAgentsFromConfig();renderConfigPanel();}}catch(e){alert('Ungültig!');}}
function loadPreset(p){const presets={party:[{name:'DJ Bot',color:'#f43f5e',personality:'energetisch',speed:3,chatFreq:5,wanderRadius:600,active:true},{name:'Confetti',color:'#fbbf24',personality:'witzig',speed:4,chatFreq:4,wanderRadius:800,active:true}],zen:[{name:'Sensei',color:'#6ee7b7',personality:'philosophisch',speed:.3,chatFreq:30,wanderRadius:150,active:true}],chaos:Array.from({length:10},(_,i)=>({name:`C-${i+1}`,color:`hsl(${i*36},80%,55%)`,personality:Object.keys(PERSONALITIES)[i%6],speed:2+Math.random()*3,chatFreq:3,wanderRadius:600,active:true})),minimal:[{name:'Helper',color:'#3b82f6',personality:'freundlich',speed:1,chatFreq:20,wanderRadius:300,active:true}],army:Array.from({length:8},(_,i)=>({name:`Soldat ${i+1}`,color:`hsl(${120+i*5},40%,${30+i*3}%)`,personality:'technisch',speed:2,chatFreq:10,wanderRadius:200,active:true}))};if(presets[p]){agentConfigs=presets[p];spawnAgentsFromConfig();renderConfigPanel();}}

// ===================== INPUT =====================
document.addEventListener('keydown',e=>{
  keys[e.code]=true;
  if(e.code==='Enter'&&gameStarted&&!configOpen&&!chatHidden&&!document.getElementById('minigame-overlay').classList.contains('open')){
    const inp=document.getElementById('chat-input');if(chatFocused&&inp.value.trim())sendChat();else{inp.focus();chatFocused=true;}e.preventDefault();}
  if(e.code==='Escape'){if(configOpen)toggleConfig();else if(document.getElementById('minigame-overlay').classList.contains('open'))closeMinigameMenu();else{document.getElementById('chat-input').blur();chatFocused=false;}}
  if(e.code==='Tab'&&gameStarted&&!chatFocused){e.preventDefault();toggleConfig();}
  if(e.code==='KeyC'&&gameStarted&&!chatFocused&&!configOpen)toggleChatPanel();
  if(e.code==='KeyM'&&gameStarted&&!chatFocused&&!configOpen)openMinigameMenu();
  if(e.code==='KeyQ'&&gameStarted&&!chatFocused&&!configOpen&&activeGame)stopGameEarly();
  if(e.code==='KeyG'&&gameStarted&&!chatFocused&&!configOpen){quickToggleAgents();e.preventDefault();}
});
document.addEventListener('keyup',e=>{keys[e.code]=false;});
document.getElementById('chat-input').addEventListener('focus',()=>{chatFocused=true;});
document.getElementById('chat-input').addEventListener('blur',()=>{chatFocused=false;});

// ===================== MOBILE TOUCH CONTROLS =====================
(function initMobileControls(){
  const isTouch=('ontouchstart' in window)||navigator.maxTouchPoints>0;
  if(!isTouch)return;
  const ctrl=document.getElementById('mobile-controls');
  ctrl.classList.add('show');
  // Hide desktop controls-help on touch
  const help=document.getElementById('controls-help');if(help)help.style.display='none';

  const joy=document.getElementById('joystick');
  const knob=document.getElementById('joystick-knob');
  const sprintBtn=document.getElementById('mobile-sprint');
  const chatBtn=document.getElementById('mobile-chat-btn');
  const stopBtn=document.getElementById('mobile-stop-btn');

  let joyId=null, joyCX=0, joyCY=0, joyMaxR=55;

  function clearJoyKeys(){
    keys['ArrowLeft']=false;keys['ArrowRight']=false;keys['ArrowUp']=false;keys['ArrowDown']=false;
    knob.style.transform='';
  }
  function setKeysFromVec(dx,dy){
    // Dead zone: only trigger movement past ~25% of max radius
    const dz=joyMaxR*.25;
    keys['ArrowLeft']=dx<-dz;
    keys['ArrowRight']=dx>dz;
    keys['ArrowUp']=dy<-dz;
    keys['ArrowDown']=dy>dz;
  }
  function handleMove(t){
    let dx=t.clientX-joyCX, dy=t.clientY-joyCY;
    const mag=Math.sqrt(dx*dx+dy*dy);
    if(mag>joyMaxR){dx=dx*joyMaxR/mag;dy=dy*joyMaxR/mag;}
    knob.style.transform=`translate(${dx}px, ${dy}px)`;
    setKeysFromVec(dx,dy);
  }

  joy.addEventListener('touchstart',e=>{
    const t=e.changedTouches[0];
    joyId=t.identifier;
    const rect=joy.getBoundingClientRect();
    joyCX=rect.left+rect.width/2;
    joyCY=rect.top+rect.height/2;
    joyMaxR=rect.width/2-12;
    handleMove(t);
    e.preventDefault();
  },{passive:false});

  joy.addEventListener('touchmove',e=>{
    for(const t of e.changedTouches){
      if(t.identifier===joyId){handleMove(t);e.preventDefault();break;}
    }
  },{passive:false});

  const endJoy=e=>{
    for(const t of e.changedTouches){
      if(t.identifier===joyId){joyId=null;clearJoyKeys();e.preventDefault();break;}
    }
  };
  joy.addEventListener('touchend',endJoy,{passive:false});
  joy.addEventListener('touchcancel',endJoy,{passive:false});

  // Sprint button
  const sprintDown=e=>{keys['ShiftLeft']=true;sprintBtn.classList.add('active');e.preventDefault();};
  const sprintUp=e=>{keys['ShiftLeft']=false;sprintBtn.classList.remove('active');e.preventDefault();};
  sprintBtn.addEventListener('touchstart',sprintDown,{passive:false});
  sprintBtn.addEventListener('touchend',sprintUp,{passive:false});
  sprintBtn.addEventListener('touchcancel',sprintUp,{passive:false});

  // Chat button — open panel and focus input
  chatBtn.addEventListener('click',()=>{
    if(typeof toggleChatPanel==='function'){
      // Ensure panel is visible (un-hide it)
      if(chatHidden)toggleChatPanel();
      const inp=document.getElementById('chat-input');
      if(inp){inp.focus();}
    }
  });

  // Show stop button only during active game
  setInterval(()=>{
    if(activeGame)stopBtn.classList.add('show');
    else stopBtn.classList.remove('show');
  },500);

  // Prevent accidental scrolling/pull-to-refresh on the canvas itself
  const canv=document.getElementById('world-canvas');
  if(canv){canv.addEventListener('touchmove',e=>e.preventDefault(),{passive:false});}
})();

// ===================== UTILS =====================
function clamp(v,min,max){return Math.max(min,Math.min(max,v));}
function distance(a,b){return Math.sqrt((a.x-b.x)**2+(a.y-b.y)**2);}
function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
