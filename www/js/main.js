'use strict';
/* ───────────── start-up ───────────── */
(async function init() {
  applySettings();
  await loadState();
  finalizeBooks();
  FX.refresh();
  window.addEventListener('online', checkVersion);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) checkVersion(); });
  setInterval(checkVersion, 10 * 60 * 1000);
  // restore the last reading position on a cold start with no explicit route
  if (!location.hash || location.hash === '#/' || location.hash === '#') {
    const last = ST.recent[0], pr = last && ST.progress[last];
    history.replaceState(null, '', '#/library');
    if (last && pr && Object.keys(pr.pages).length && sessionStorage.getItem('sl.opened') !== '1') { /* offer via Continue Reading on the library */ }
  }
  sessionStorage.setItem('sl.opened', '1');
  route();
  checkVersion();
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').then(reg => {
      reg.addEventListener('updatefound', () => { const nw = reg.installing; nw && nw.addEventListener('statechange', () => { if (nw.state === 'installed' && navigator.serviceWorker.controller) $('#updateBanner').hidden = false; }); });
    }).catch(() => { });
  }
  $('#splash').classList.add('gone'); setTimeout(() => $('#splash').remove(), 700);
})();
