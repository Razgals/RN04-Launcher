/**
 * mousecam-child.js
 *
 * Runs via Electron's utilityProcess.fork() — completely separate V8/Node.js
 * instance from Electron main. uiohook-napi is safe here.
 *
 * Communication: process.parentPort (Electron's built-in IPC for utilityProcess)
 * Place in: src/mousecam-child.js
 */

const { uIOhook, UiohookMouseButton } = require('uiohook-napi');

// Throttle mousemove to ~60fps
let lastMove = 0;
const THROTTLE = 16;

function send(obj) {
  process.parentPort.postMessage(obj);
}

uIOhook.on('mousedown', (e) => {
  if (e.button !== UiohookMouseButton.Middle) return;
  send({ type: 'down', x: e.x, y: e.y });
});

uIOhook.on('mouseup', (e) => {
  if (e.button !== UiohookMouseButton.Middle) return;
  send({ type: 'up' });
});

uIOhook.on('mousemove', (e) => {
  const now = Date.now();
  if (now - lastMove < THROTTLE) return;
  lastMove = now;
  send({ type: 'move', x: e.x, y: e.y });
});

// Listen for stop signal from parent
process.parentPort.on('message', (e) => {
  if (e.data === 'stop') {
    try { uIOhook.stop(); } catch (_) {}
    process.exit(0);
  }
});

try {
  uIOhook.start();
  send({ type: 'started' });
} catch (e) {
  send({ type: 'error', message: e.message });
}
