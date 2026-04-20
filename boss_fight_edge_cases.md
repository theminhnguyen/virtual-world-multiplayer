# Boss-Kampf — Edge-Case- & Race-Condition-Review

Review aller nicht-trivialen Situationen im neuen Boss-Fight-Minigame, mit expliziter Erklärung, wie jeder Fall im Code aktuell behandelt wird. Pfade beziehen sich auf `server.js` und `index.html` im Projekt.

## 1. Edge Cases

### 1.1 Simultaner Treffer (Boss stirbt gleichzeitig wie letzter Spieler)

**Situation:** Im selben Tick erhält der Boss den letzten HP-Schaden **und** der letzte lebende Spieler bekommt einen tödlichen Treffer vom Boss ab.

**Behandlung:** In `bossTick()` kommt die End-Check-Reihenfolge explizit zuerst auf Victory, danach erst auf Defeat (server.js 849–853):

```js
if (boss.hp <= 0) { endBoss('victory'); return; }
// ...
if (!anyConnectedAlive) { endBoss('defeat'); return; }
```

Das heißt: Tötet der Spieler den Boss in demselben Substep, in dem er selbst stirbt, gewinnt das Team — **Victory hat immer Vorrang**. Das ist die fairere Interpretation (der letzte Schuss zählt) und verhindert auch einen Pattsituation-Doppel-Emit. Durch das `return;` nach `endBoss()` kann pro Tick nur ein Ergebnis geschickt werden.

### 1.2 Letzter Spieler schießt und stirbt **im selben Substep**

**Situation:** Ein Projektil des Spielers und ein Boss-Projektil kreuzen sich; im Substep wird zuerst das Spieler-Projektil gegen den Boss geprüft, dann erst das Boss-Projektil gegen den Spieler (oder umgekehrt, je nach Array-Order).

**Behandlung:** In jedem Substep wird **zuerst** Spieler→Boss-Kollision (server.js 813) und **danach** Boss→Spieler-Kollision (server.js 827) geprüft. Ein bereits gefallener Spieler bleibt aber in der `damageDealt`-Tabelle und der Schaden, den er noch im selben Tick dem Boss zugefügt hat, zählt voll. Da der Victory-Check erst am Tick-Ende läuft, kommen beide Ereignisse korrekt an, und Victory gewinnt (siehe 1.1).

### 1.3 Disconnect während des Kampfes

**Situation:** Ein Spieler schließt den Browser mitten im Fight.

**Behandlung:** `socket.on('disconnect')` in server.js 415–471 enthält einen speziellen Boss-Branch (428–430):

```js
if (activeGame.type === 'boss' && activeGame.players && activeGame.players[socket.id]) {
  const s = activeGame.players[socket.id];
  s.alive = false; s.spectator = true; s.disconnected = true;
}
```

Der Spieler wird nicht aus `activeGame.players` gelöscht (damit sein Name im finalen Damage-Leaderboard erhalten bleibt), sondern lediglich als `disconnected + spectator + !alive` markiert.

**Folgen:**
- Boss zielt ihn nicht mehr an: `aliveIds`-Filter in 756–759 filtert `!disconnected && players.has(id)`.
- Boss-Projektile treffen ihn nicht mehr: Collision-Guard in 830 schließt `disconnected` aus.
- Seine Projektile, die bereits in der Luft sind, fliegen zu Ende und können noch Schaden machen — der Damage wird ihm trotzdem gutgeschrieben (server.js 819–821: `st = g.players[pr.owner]; st.damageDealt += dmg;`). **Beabsichtigt**, da sonst ein schnell-schießender Spieler mit zufällig schlechtem WLAN bestraft würde.
- Beim nächsten End-Check fällt sein Eintrag bei `anyConnectedAlive` (852) raus. Wenn er der letzte war → sofort `defeat`.

### 1.4 Alle Spieler disconnecten (leerer Raum)

**Situation:** Während des Fights trennen sich alle Clients.

**Behandlung:** Nach dem letzten disconnect prüft der nächste `bossTick()`:
- 851: `if (entries.length === 0) { endBoss('stopped'); return; }` — nur falls das players-Dict wirklich leer ist (nie, weil Teilnehmer bleiben in activeGame.players erhalten).
- 852–853: `anyConnectedAlive` wird false → `endBoss('defeat')`.

Das `game-ended`-Event wird abgeschickt (an niemanden, aber das ist OK), der Tick wird gestoppt (`clearInterval(bossTickHandle)`), und `activeGame = null`. Ein neuer Spieler, der kurz danach joint, sieht keinen aktiven Kampf mehr.

### 1.5 Mid-Game-Joiner (neuer Spieler joint während Fight)

**Situation:** Bob joint während Alice und Carol schon am Boss kämpfen.

**Behandlung:** Beim Initial-Connect sendet der Server `bossSnapshot` (server.js 197–210). Der Client-`init`-Handler (index.html 929–945) baut daraus `bossState` und setzt `midJoin:true`.

- Bob sieht Arena, Boss, Hindernisse und alle bestehenden HP/Lives korrekt.
- Bob **kann nicht schießen**: 
  - Server-seitig: `shoot-projectile` prüft `pState = activeGame.players?.[socket.id]` — Bob ist nicht in dieser Liste, also kein Schuss (server.js 272–273).
  - Client-seitig: `updateMinigame` prüft `st && st.alive && !bossState.midJoin` bevor der Schuss abgeschickt wird (index.html 1374–1381). Doppelt abgesichert.
- Bob wird vom Boss nicht angegriffen (aus demselben Grund: er ist nicht in `g.players`).
- Bob erscheint als "👁️ Zuschauer" in seinem eigenen HUD (index.html 1750ff., `bossState.midJoin`).
- Bob kann sich in der Welt weiterbewegen, der Arena-Zaun ist für ihn aber kein Teleport-Blocker (nur Spieler im Fight bekommen das Movement-Clamp). Das ist OK: er ist nur Zuschauer.

### 1.6 Rejoin nach Disconnect mit **gleicher** Socket-ID

Nicht möglich — socket.io vergibt beim Reconnect eine neue socket.id. Der re-joinende Spieler ist deshalb aus Server-Sicht ein neuer Mid-Game-Joiner (siehe 1.5) und sieht den Fight nur noch als Zuschauer bis zum Ende. Seine alte `damageDealt`-Zeile bleibt im Leaderboard.

### 1.7 Spieler verliert letztes Leben

**Situation:** `lives` erreicht 0 durch Boss-Treffer.

**Behandlung:** server.js 834–837:
```js
st.lives = Math.max(0, st.lives - pr.dmg);
st.iFramesUntil = now + BOSS_IFRAMES_MS;
if (st.lives <= 0) { st.alive = false; st.spectator = true; }
io.emit('player-hit', { id: pid, lives: st.lives, alive: st.alive, spectator: st.spectator });
```

Der `player-hit`-Broadcast meldet alive=false. Clients zeigen den Spieler daraufhin mit „👁️ Zuschauer"-Tag. Der Boss zielt ihn nicht mehr an (wegen `alive`-Filter in 756). Seine Projektile in der Luft zählen weiter (wie bei disconnect).

Der Spieler kann sich weiterhin in der Arena bewegen (wird nicht teleportiert), aber kann nicht mehr schießen (Client-Guard auf `st.alive`).

### 1.8 i-Frames

**Situation:** Nach einem Treffer soll der Spieler 1s unverwundbar sein.

**Behandlung:** `st.iFramesUntil = now + BOSS_IFRAMES_MS` (1000ms). Der Kollisions-Check schließt `if (now < st.iFramesUntil) continue` in der Boss-Projektil-Schleife aus (server.js 831). Client zeigt dies nicht explizit (kein Blink), aber der Server ignoriert alle weiteren Treffer korrekt. Client bekommt optional über den Snapshot (`lives[id].iframes:true`) mit, welche Spieler gerade unverwundbar sind — ist derzeit im UI nicht gerendert, Raum für polish.

### 1.9 Mehrere Projektile auf denselben Spieler im selben Substep

**Situation:** Drei Boss-Projektile eines 8-way-Burst treffen synchron.

**Behandlung:** Pro Projektil wird einzeln iteriert und nach Treffer sofort `destroyed = true; break;` gesetzt. Nach dem ersten Treffer ist `iFramesUntil` um 1000ms in die Zukunft verschoben, alle folgenden Projektile derselben Salve werden durch `if (now < st.iFramesUntil) continue` ignoriert. **Perfekt**, kein Double-Damage durch Burst-Pattern.

### 1.10 Boss-Attacke während `aliveIds` leer ist

**Situation:** Der Boss will angreifen, aber alle Spieler sind in i-frames oder disconnected.

**Behandlung:** `if (aliveIds.length > 0)` (server.js 760) guardet den ganzen Attack-Block. Ist niemand lebend-connectet, schießt der Boss nicht und sein `attackTimer` wird **nicht** verlängert. Sobald wieder ein lebender Spieler da ist (z.B. weil das Timer-Fenster noch nicht abgelaufen war), schießt er sofort. Das ist OK und sogar hübsch — bestraft Spieler nicht, die nur in i-frames „überleben".

### 1.11 Simultaner Tod mehrerer Spieler im selben Tick

**Situation:** AoE-Pattern (z.B. 8-way-Burst) killt zwei Spieler im selben Tick.

**Behandlung:** Die Boss-Projektil-Kollisions-Schleife iteriert über alle `pids` für jedes Projektil. Jeder Tot-Fall setzt unabhängig `alive=false` und emittet `player-hit`. Am Ende des Ticks prüft 852 `anyConnectedAlive` — wenn beide der letzten beiden starben, ist das Ergebnis `defeat`.

**Wichtig:** `io.emit('player-hit', ...)` sendet für beide Spieler getrennt; der Client-Handler aktualisiert `bossState.lives[id]` pro Event, Render ist konsistent.

### 1.12 Geschoss tunnelt durch Hindernis oder Boss

**Situation:** Bei hoher Projektilgeschwindigkeit (bis ~12 px/tick @ 50ms) könnte ein einzelner Integrationsschritt über ein dünnes Hindernis springen.

**Behandlung:** `substeps = 2` in server.js 797. Jeder Tick-Schritt wird in zwei halbe Schritte zerlegt, zwischen denen Kollision geprüft wird. Für unsere Arena-Hindernisse (min 35px hoch) und max ~12px/tick reicht das. Bei einer Erweiterung auf schnellere Geschosse müsste `substeps` erhöht werden.

### 1.13 `stop-game` während Boss-Fight

**Situation:** Ein Spieler drückt ESC / Stop während des Fights.

**Behandlung:** `socket.on('stop-game')` (server.js 294–312) ist game-type-agnostisch und emittet `game-ended` mit `stopped:true, stoppedBy:name`. Danach `activeGame = null`. 

**Boss-spezifische Nachbereitung fehlt hier aktuell:** `bossTickHandle` wird **nicht** direkt im stop-game-Handler gestoppt. Das ist aber nicht kritisch, weil der nächste `bossTick()` den Interval selbst killt — siehe server.js 717–720:
```js
if (!activeGame || activeGame.type !== 'boss') {
  if (bossTickHandle) { clearInterval(bossTickHandle); bossTickHandle = null; }
  return;
}
```
Das läuft im nächsten Tick (max 50ms Verzögerung). Ein Extra-Broadcast in diesen 50ms wäre theoretisch noch möglich, ist aber harmlos (der Client-Handler für `boss-update` no-ops wenn `!bossState`).

Client-seitig räumt der `game-stopped`-Handler (index.html 1842, via `game-ended`) `bossState = null` auf und versteckt das HUD.

### 1.14 Spieler verlässt Arena während des Fights

**Situation:** Der Client-Movement-Clamp für Boss wird umgangen (z.B. Cheat).

**Behandlung:** Der Server vertraut dem Client bei der Position. Läuft der Spieler raus, bleibt er aus Boss-Sicht trotzdem ein gültiges Ziel (er ist ja noch `alive && connected`). Der Boss kann auf ihn zielen, seine Projektile werden aber an der Arena-Grenze zerstört (server.js 805). **Folge:** Cheater wird vom Boss außerhalb der Arena nicht mehr getroffen, aber kann auch nicht mehr schießen, weil seine eigenen Projektile an der Arena-Kante gelöscht werden. Faire Selbstbestrafung. 

Ehrliche Spieler werden Client-seitig am Verlassen gehindert (index.html 1159ff.). Ein Abuser-Szenario ist damit unattraktiv.

### 1.15 15-Minuten-Hard-Cap ausgelöst

**Situation:** Durch einen Bug kämpft niemand, niemand stirbt, der Boss wandert unschuldig.

**Behandlung:** server.js 728: `if (now - g.startTime > g.duration) { endBoss('stopped'); return; }`. Nach 15 Minuten endet der Fight mit Outcome `'stopped'`, Damage-Leaderboard wird normal geschickt. Verhindert Server-Memory-Leak durch ewig laufende Projektile.

### 1.16 Start im Singleplayer

**Situation:** Nur ein Spieler ist in der Welt und klickt „Boss".

**Behandlung:** Client-seitig in `startBossGame()` (index.html 1699ff.) wird das explizit abgelehnt. Auf Server-Seite würde es funktionieren (ein Spieler wäre ausreichend), aber der Client-Guard verhindert es, um das MP-Erlebnis zu erhalten (Team-Up war die Kern-Anforderung).

### 1.17 Spieler drückt Space/Maus unaufhörlich

**Situation:** Turbo-Controller hält Space dauerhaft.

**Behandlung:** Rate-Limit auf **beiden** Seiten:
- Client: `lastBossShot` + 280ms-Guard in updateMinigame.
- Server: `socket._lastShot` + `BOSS_SHOOT_CD_MS = 280ms` in `shoot-projectile`.

Der Server ist authoritativ und throttelt unabhängig vom Client — selbst wenn ein Abuser die Client-Sperre umgeht, bleibt das effektive Limit bei 280ms pro Socket.

### 1.18 Zweiter `start-game` während Boss-Fight läuft

**Situation:** Jemand versucht, einen zweiten Kampf zu starten.

**Behandlung:** server.js 255–262: `if (activeGame) return;` blockt alle neuen Spielstarts während ein Spiel läuft. Kein Reentry möglich.

### 1.19 Damage-Overflow (pr.dmg > boss.hp)

**Situation:** Letzter Schuss trifft mit 10 Damage, Boss hat nur noch 3 HP.

**Behandlung:** `const dmg = Math.min(pr.dmg, boss.hp);` (server.js 816). Nur der tatsächlich angerichtete Schaden wird gutgeschrieben. Damage-Stats sind konsistent mit max_hp. (Bei BOSS_PROJ_DMG_PLAYER=1 faktisch nicht relevant, aber sauber.)

### 1.20 Client rendert Boss bevor Server-Snapshot kommt

**Situation:** Nach `game-started` aber vor dem ersten `boss-update`.

**Behandlung:** Der `game-started`-Handler (index.html 929ff.) baut `bossState.boss` direkt aus dem `game.boss`-Feld, das im `game-started`-Payload drin ist (wird über `io.emit('game-started', { game: activeGame, ... })` geschickt). `drawBoss` hat also sofort Daten — selbst wenn der erste 20Hz-Snapshot noch nicht angekommen ist. Flickern wird damit vermieden.

## 2. Race Conditions Client ↔ Server

### 2.1 Client-Schuss während Server-seitig schon dead

**Szenario:** Spieler feuert; im selben Frame killt der Boss ihn; das `player-hit`-Event ist aber noch nicht beim Client angekommen.

**Ablauf:** Client emittet `shoot-projectile`. Server bekommt das Event, prüft `!pState.alive` — **bereits auf false** (weil der Boss-Tick vorher lief). Schuss wird verworfen. Keine Geisterschüsse.

### 2.2 Server sendet `boss-update` nachdem der Fight beendet ist

**Szenario:** Server emittet `boss-update` im selben Tick in dem kurz darauf `endBoss()` aufgerufen wird — Ordering Garantie vorhanden (gleicher Call-Stack). Aber wenn der Client kurz davor `game-stopped` verarbeitet und danach ein altes `boss-update` reinkommt (Network-Reordering)?

**Ablauf:** socket.io über TCP/WebSocket garantiert Ordnung, d.h. das Reordering-Szenario kann nur auftreten, wenn dasselbe Event mit unterschiedlichen Latenzpfaden käme — passiert nicht. Aber als Defense-in-Depth: Der Client-Handler `socket.on('boss-update')` beginnt mit `if(!bossState) return;` (index.html 959). Nach `game-ended` wurde `bossState = null` gesetzt — Stale-Updates werden ignoriert.

### 2.3 Client-Position vs. Server-Collision

**Szenario:** Client rendert Spieler bei `(100,100)`, Server kennt ihn aber noch bei `(95,95)` (Latenz). Boss-Projektil trifft bei `(98,98)` — Client denkt, er sei weggelaufen; Server detektiert Treffer.

**Ablauf:** Server ist authoritativ. Treffer wird registriert, `player-hit` emittet. Client sieht plötzlich „ich habe ein Leben verloren, obwohl ich nicht getroffen wurde". Das ist das normale Verhalten in autoritativen Setups und bei unseren geringen Geschwindigkeiten (30ms Round-Trip @ Player-Speed ~2px/frame = ~1px Diff) kaum spürbar. Optional-Lösung wäre Client-Side-Prediction mit Reconciliation, aus Scope ausgenommen.

### 2.4 Zwei Spieler schießen "denselben letzten Schuss"

**Szenario:** Alice und Bob schießen gleichzeitig; beide Projektile treffen im selben Tick den Boss mit je 1 HP — Boss-HP war 1.

**Ablauf:** Boss-Projektil-Liste wird sequenziell in `bossTick()` durchlaufen (server.js 799). Das in der Liste zuerst einsortierte Projektil trifft zuerst, `boss.hp` geht auf 0, `destroyed=true` wird gesetzt. Das zweite Projektil im selben Tick prüft `if (pr.kind === 'player' && boss.hp > 0)` — der `boss.hp > 0` Guard greift — der zweite Schuss wird **nicht** mehr als Boss-Treffer gewertet, fliegt weiter bis zur Arena-Kante oder einem Hindernis. Damage-Gutschrift: nur Alice (oder nur Bob), je nachdem wer im Array vorher kam. Reihenfolge ist Eingangsreihenfolge der `shoot-projectile`-Events, d.h. fair. **Top-Damage wird deterministisch** auch bei Ties vergeben (stabiler Array-Order).

Endergebnis: `boss.hp <= 0` → `endBoss('victory')` am Tick-Ende.

### 2.5 Start-Message kommt vor dem Difficulty-Payload (nur theoretisch)

socket.io garantiert Event-Ordnung pro Socket. Nicht relevant.

### 2.6 bossTickHandle-Leak bei schnellem Re-Start

**Szenario:** Boss-Fight endet (Victory), im nächsten Tick startet jemand einen neuen Boss-Fight, bevor `bossTickHandle` geclearet war.

**Ablauf:** In `startGameServer` unter dem boss-Block: `if (bossTickHandle) clearInterval(bossTickHandle); bossTickHandle = setInterval(bossTick, BOSS_TICK_MS);` (server.js 567–568). Alter Handle wird sicher gekillt, bevor ein neuer angelegt wird. `endBoss()` nullt ihn auch nochmal. Doppel-Tick unmöglich.

### 2.7 Concurrent mutation von `activeGame.players`

**Szenario:** socket.io callbacks sind single-threaded (Node.js event loop), aber es gibt Events mit `setTimeout`-Payload.

**Ablauf:** Der einzige `setTimeout` im Boss-Code ist der AB-Question-Timer (nicht Boss-bezogen) und der Auto-End-Timer (wird für Boss bewusst übersprungen, server.js 578). Keine async-Rennen. Der 20Hz-Interval ist synchron und läuft nicht überlappend, solange `bossTick` selbst nicht blockiert — was bei ~50 Projektilen und wenigen Spielern niemals der Fall sein wird.

### 2.8 Client emittiert `shoot-projectile` mit `dx=0,dy=0`

**Szenario:** Spieler bewegt die Maus nicht und hat auch keine Blickrichtung.

**Ablauf:** server.js 279: `let dx = Number(data?.dx) || 0, dy = Number(data?.dy) || 1;`. Bei dx=0,dy=0 wird dy=1 (Default). `mag = sqrt(0+1) = 1`. Projektil fliegt nach unten. **Kein NaN, kein Division-by-Zero.**

### 2.9 Client-seitige Bewegung vor Server-Teleport zu Arena

**Szenario:** Nach `start-game` teleportiert der Server alle Spieler an den unteren Rand der Arena. Der Client hat noch keinen `player-update` mit der neuen Position — er rendert kurz noch an der alten Welt-Position.

**Ablauf:** Das `game-started`-Event enthält nur das Game-Objekt, nicht die neuen Player-Positionen. Die kommen über den normalen 10Hz-Player-Broadcast. Es gibt also bis zu 100ms Verzögerung, in der der Client den Spieler noch „außerhalb der Arena" rendert. Ist bei Fade-In/Countdown nicht sichtbar, weil der Countdown 3s läuft und Snap innerhalb dieser Zeit passiert.

### 2.10 `boss-hit` kommt vor dem `boss-update`, der den HP-Wert mit Flash synchronisiert

**Szenario:** Server emittet `boss-hit` (direkt im Kollisions-Code) und kurz danach im selben Tick `boss-update` mit aktualisierter HP.

**Ablauf:** Beide Events werden über denselben Socket in Reihenfolge gesendet. Client-Handler für `boss-hit` setzt HP + flash=true mit `setTimeout(...,180)` zum Zurücksetzen. Kurz darauf überschreibt `boss-update` HP mit dem gleichen Wert — **identisch, kein Konflikt**. Der `flash`-Wert wird vom Server ebenfalls als `now < boss.damageFlashUntil` mitgeschickt (server.js 859), aber der Client verwendet sein eigenes Timer-Flash. Beides konvergiert nach max 180ms.

### 2.11 `player-hit` vs. `boss-update`-Lives

**Szenario:** Server sendet `player-hit` mit alive=false, aber im gleichen Tick danach `boss-update.lives[id].alive=false`.

**Ablauf:** Beide Events führen unabhängig zum selben Endzustand. Kein Konflikt, kein Desync.

### 2.12 Disconnect exakt während `shoot-projectile`-Callback

**Szenario:** Socket.io-Runtime: disconnect-Event und ein pending `shoot-projectile`-Event.

**Ablauf:** Node.js EventLoop verarbeitet sie sequenziell. Entweder disconnect kommt zuerst (socket.id wird aus `players` entfernt → `shoot-projectile` guardet `if (!p) return` via `players.get(socket.id)`) oder `shoot-projectile` kommt zuerst (Schuss wird erzeugt, danach disconnect und `s.alive=false`). Beide Reihenfolgen sind safe; kein Crash.

### 2.13 `computeAimVector` ohne Mausposition

**Szenario:** Mobile Spieler hat nie `mousemove` getriggert.

**Ablauf:** `mousePos = {x:0, y:0}` als Default. `computeAimVector()` erkennt das (index.html 1547ff.) und fällt auf die Blickrichtung des Spielers zurück. Schuss geht in die letzte Bewegungsrichtung. **Kein NaN, keine Division-by-Zero** dank Fallback.

## 3. Nicht kritische, aber bewusste Design-Entscheidungen

- **Kein Friendly-Fire:** Spieler-Projektile prüfen nur Boss-Hitbox, keine Spieler-Kollision untereinander. Vermeidet Troll-Dynamiken.
- **Obstacles regenerieren pro Match:** `generateBossObstacles(arena, cfg.obstacles)` bei jedem `start-game`. Identische Runs sind unwahrscheinlich.
- **Boss-HP skaliert linear mit Spielerzahl:** `hpBase + hpPerPlayer * (n-1)`. Damit bleibt die Rundenzeit ~konstant egal ob 2 oder 10 Spieler mitmachen.
- **Damage-Leaderboard zählt auch Disconnected:** bewusst — wer zu 80% den Boss runtergeschossen hat und dann die Verbindung verliert, verdient die Top-Spot-Würdigung im Victory-Popup.
- **Tick-Rate 20Hz** ist bewusst niedrig. Bei 60Hz wäre die Projektil-Physik flüssiger, aber der Render-Interpolations-Aufwand deutlich größer. 20Hz + Client-Side-Glätte ist der Goldlöckchen-Punkt für ein Web-MMO-Indie-Minispiel.

## 4. Bekannte Limitierungen (explizit außerhalb des Scopes)

- Keine Client-Side-Prediction für Projektile — wenn die Latenz > 100ms ist, wirken die eigenen Schüsse „verzögert". Trade-off gegen Implementierungs-Komplexität.
- Kein Input-Sequencing: Spieler kann den Schuss nicht „queuen" während i-frame/cooldown.
- i-Frame-Indicator visuell nicht dargestellt (Daten liegen im Snapshot vor).
- Boss hat keine Phasen/Enrage — einfache Wandering-AI, 4 Patterns je nach Schwierigkeit.

---

**Fazit:** Das System ist defensiv gegen Disconnects, Mid-Joins, Simultan-Events und Race-Conditions abgesichert. Alle End-Bedingungen sind idempotent (Doppel-Emit möglich, aber nur eines hat Effekt dank `if(!activeGame || type!=='boss') return`). Die wenigen verbleibenden Edge Cases sind bewusst so designt (Damage-Zählung für disconnecte Schützen, Victory-vor-Defeat-Priorität).
