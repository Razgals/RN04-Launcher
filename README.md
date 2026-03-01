# RN04 Launcher

A small, focused launcher for RN04 - built by Akg.

This project is a lightweight Electron-based launcher that embeds the RN04 web client and a few handy tools (Notes, Capture, World Map, RN04 MArket, Quest & Skill Guides). It started as a port of LostKit-Electron and was narrowed down to the features we actually use.

Quick highlights
- Loads the RN04 game at startup (http://play.rn04.com).
- Notes, screenshot capture, world map, quest & skill guides available from the nav panel.
- Window placement, size, and zoom are persisted in the app settings.
- Minimal UI — chat, world switcher, stopwatch, and other extras were intentionally removed.

Getting started (dev)
1. Clone this repo.
2. Install dependencies:

```bash
npm install
```

3. Run locally:

```bash
npm start
```

Where settings are stored
- Windows: `%APPDATA%\.rn04-settings.json`
- Unix: `~/.rn04-settings.json`

What is saved
- `mainWindow` — window bounds (x, y, width, height)
- `zoomFactor`, `tabZoom`, `externalZoom` — zoom settings for main/tab/external views

Customizing app metadata
- To change the application identifier used by installers, edit `build.appId` in `package.json`.
- Version is set in `package.json` (now `1.0.0`). Update it there when making releases.
