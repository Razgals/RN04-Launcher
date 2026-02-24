/**
 * mousecam-worker.js
 *
 * Runs inside a Node.js Worker Thread, completely isolated from
 * Electron's main V8 context. uiohook-napi's native callbacks are
 * safe here because they only touch this worker's JS environment,
 * not Electron's. We forward raw mouse events to the main thread
 * via parentPort.postMessage(), which is thread-safe by design.
 *
 * Place this file in: src/mousecam-worker.js
 */

const { parentPort } = require('worker_threads');
const { uIOhook, UiohookMouseButton } = require('uiohook-napi');

// Throttle mousemove messages to ~60fps to avoid flooding IPC
let lastMoveTime = 0;
const MOVE_THROTTLE_MS = 16;

uIOhook.on('mousedown', (e) => {
  if (e.button !== UiohookMouseButton.Middle) return;
  parentPort.postMessage({ type: 'down', x: e.x, y: e.y });
});

uIOhook.on('mouseup', (e) => {
  if (e.button !== UiohookMouseButton.Middle) return;
  parentPort.postMessage({ type: 'up' });
});

uIOhook.on('mousemove', (e) => {
  const now = Date.now();
  if (now - lastMoveTime < MOVE_THROTTLE_MS) return;
  lastMoveTime = now;
  parentPort.postMessage({ type: 'move', x: e.x, y: e.y });
});

// Listen for stop signal from main thread
parentPort.on('message', (msg) => {
  if (msg === 'stop') {
    try { uIOhook.stop(); } catch (e) {}
    process.exit(0);
  }
});

try {
  uIOhook.start();
} catch (e) {
  parentPort.postMessage({ type: 'error', message: e.message });
}
