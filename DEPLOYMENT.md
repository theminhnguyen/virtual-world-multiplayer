# Deployment Guide: Virtual World Multiplayer auf Render.com

Kostenloses Hosting ohne Kreditkarte. Node.js + Socket.io + WebSockets werden voll unterstützt.

---

## Was wurde vorbereitet

- `package.json` → `engines` Feld hinzugefügt (Node 18+)
- `.gitignore` → schließt `node_modules`, Backups etc. aus
- `render.yaml` → Auto-Konfiguration für Render (optional, vereinfacht das Setup)
- `server.js` → nutzt bereits `process.env.PORT` (ready!)

---

## Voraussetzungen

1. GitHub-Account (kostenlos): https://github.com/signup
2. Git auf deinem Rechner installiert: https://git-scm.com/downloads
3. Render.com-Account (kostenlos, ohne Karte): https://render.com

---

## Schritt 1 — GitHub-Repository erstellen

1. Gehe auf https://github.com/new
2. **Repository name**: `virtual-world-multiplayer` (oder wie du willst)
3. **Public** lassen (für kostenlosen Render-Tier)
4. **NICHT** "Add README" anhaken (haben wir schon lokal)
5. Klick **"Create repository"**
6. Notiere dir die URL, die GitHub dir zeigt (z.B. `https://github.com/DEIN-NAME/virtual-world-multiplayer.git`)

---

## Schritt 2 — Code zu GitHub pushen

Öffne ein Terminal im Projektordner (`/Users/theminhnguyen/Downloads/outputs`):

```bash
cd ~/Downloads/outputs

# Optional: Backup-Dateien aufräumen (werden ohnehin durch .gitignore ignoriert)
# rm index.html.old-backup virtual-world.html.backup _check.js

# Git initialisieren
git init
git branch -M main

# Dateien hinzufügen
git add .
git commit -m "Initial commit: Virtual World Multiplayer"

# Mit deinem GitHub-Repo verbinden (URL anpassen!)
git remote add origin https://github.com/DEIN-NAME/virtual-world-multiplayer.git

# Pushen
git push -u origin main
```

Wenn nach Login gefragt: GitHub nutzt kein Passwort mehr — erstelle ein **Personal Access Token** unter https://github.com/settings/tokens (classic, mit `repo`-Scope) und nutze es anstelle des Passworts.

---

## Schritt 3 — Render.com Account anlegen

1. Gehe auf https://render.com
2. Klick **"Get Started"** oder **"Sign Up"**
3. Melde dich **mit GitHub** an (einfachster Weg — verbindet direkt dein Repo)
4. E-Mail bestätigen — **KEINE Kreditkarte nötig** für den Free Plan

---

## Schritt 4 — Web Service erstellen

1. Im Render Dashboard: Klick **"New +"** → **"Web Service"**
2. **"Connect a repository"** → wähle dein `virtual-world-multiplayer` Repo aus
   - Falls nicht sichtbar: **"Configure account"** klicken und Zugriff auf das Repo erlauben
3. Render erkennt `render.yaml` automatisch — aber falls du manuell konfigurierst:

   | Feld | Wert |
   |---|---|
   | **Name** | `virtual-world` (oder wie du willst) |
   | **Region** | `Frankfurt` (nächste zu DE) |
   | **Branch** | `main` |
   | **Runtime** | `Node` |
   | **Build Command** | `npm install` |
   | **Start Command** | `node server.js` |
   | **Instance Type** | **Free** |

4. Klick **"Create Web Service"**

---

## Schritt 5 — Warten aufs Deployment

Render baut und startet den Server jetzt. Das dauert ca. **2–5 Minuten**.

Im Log-Fenster siehst du u.a.:

```
==> Running 'npm install'
...
==> Running 'node server.js'

  🌍 Virtual World Server läuft!
  ➜ http://localhost:10000
  ➜ Max 20 Spieler

==> Your service is live 🎉
```

Oben auf der Seite siehst du jetzt deine URL, z.B.:

```
https://virtual-world.onrender.com
```

**Diese URL** gibst du deinen Freunden — das Spiel läuft direkt im Browser!

---

## Schritt 6 — Testen

1. Öffne die URL im Browser → Spiel sollte laden
2. Öffne die gleiche URL in einem zweiten Tab (oder auf dem Handy) → zweiter Spieler
3. Beide sollten sich sehen und chatten können

---

## Wichtig zu wissen (Free Tier Limits)

- **Einschlafen nach 15 Min**: Wenn 15 Minuten niemand auf die Seite zugreift, schläft der Server ein. Der erste Request danach braucht ~30 Sek zum Aufwachen. Danach läuft alles normal.
- **Lösung dagegen (optional)**: Richte einen kostenlosen Uptime-Monitor ein (z.B. https://uptimerobot.com), der alle 5 Min die URL pingt — dann schläft der Server nie ein.
- **750 Stunden/Monat**: Free Tier erlaubt ~31 Tage durchgehenden Betrieb pro Service. Für ein Mini-Spiel mehr als genug.
- **Keine Kreditkarte**: Render verlangt für den Free Plan wirklich keine Karte.

---

## Updates deployen

Wenn du später Änderungen machst:

```bash
cd ~/Downloads/outputs
git add .
git commit -m "Beschreibe deine Änderung"
git push
```

Render merkt automatisch, dass sich der Code geändert hat, und deployt neu. Kein manuelles Eingreifen nötig.

---

## Häufige Probleme

**"Application failed to respond"**  
→ Build lief durch, aber Server crasht. Schau in die **Logs** im Render Dashboard.

**Socket.io verbindet nicht**  
→ Nicht möglich auf Render – WebSockets sind standardmäßig aktiv. Falls doch: Prüfe im Browser-Devtools-Console auf Fehler.

**"Build failed"**  
→ `package.json` fehlerhaft oder Node-Version nicht kompatibel. `engines.node` ist auf `>=18.0.0` gesetzt, das passt.

**Server schläft zu oft ein**  
→ UptimeRobot (siehe oben) einrichten oder auf Paid Plan ($7/Monat) wechseln.

---

## Alternative: Glitch.com (noch einfacher, ohne GitHub)

Falls dir Git zu umständlich ist:

1. Gehe auf https://glitch.com
2. **New Project** → **glitch-hello-node**
3. Lösche die Default-Dateien und ziehe deine `server.js`, `package.json`, `index.html` etc. per Drag&Drop rein
4. Glitch installiert Dependencies und startet automatisch
5. URL findest du oben unter **"Share"** → **"Live App"**

Nachteile: Projekte schlafen nach 5 Min ein (statt 15), weniger Performance, 1000 Stunden/Monat.

---

Viel Spaß beim Zocken! 🎮
