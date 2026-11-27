'use strict';
/* ───────────────────────── core: helpers, storage, settings, router ───────────────────────── */
const APP_VERSION = '1.1.0';
const APP_NAME = 'Biblioteca de las Rosas';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
const today = () => new Date().toISOString().slice(0, 10);
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const stripAccents = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '');

/* ── settings (localStorage, synchronous so the first paint is correct) ── */
const SETTINGS_DEFAULT = {
  theme: 'light', esSize: 21, enSize: 16, lineH: 1.75, width: 640,
  anim: true, sound: true, mode: 'beginner', assist: true,
  sentHL: true, vocabHL: true, rate: 0.8, tapMode: 'words', level: 'all'
};
let S = { ...SETTINGS_DEFAULT };
try { Object.assign(S, JSON.parse(localStorage.getItem('sl.settings') || '{}')); } catch (e) { /* ignore */ }
function saveSettings() { try { localStorage.setItem('sl.settings', JSON.stringify(S)); } catch (e) { /* ignore */ } }
function applySettings() {
  const r = document.documentElement;
  r.dataset.theme = S.theme;
  r.style.setProperty('--es-size', S.esSize + 'px');
  r.style.setProperty('--en-size', S.enSize + 'px');
  r.style.setProperty('--lh', S.lineH);
  r.style.setProperty('--width', S.width + 'px');
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.body.classList.toggle('nosenthl', !S.sentHL);
  document.body.classList.toggle('noanim', !S.anim || reduce);
  if (typeof FX !== 'undefined') FX.refresh();
}

/* ── persistent state (IndexedDB + localStorage mirror) ── */
const ST_DEFAULT = () => ({
  v: 1, ts: 0,
  progress: {},   // bookId -> {ch,page,last, pages:{"c:p":1}, chapters:{c:{done,skipped,best,last,total}}}
  bookmarks: [],  // {book,ch,page,ts}
  saved: {},      // bookId -> true
  recent: [],     // bookIds, most recent first
  words: {},      // form -> word record
  quizLog: [],    // {book,ch,pts,total,ts}
  kindStats: {},  // kind -> {ok,bad}
  mistakes: [],   // {b,c,i,ts}
  days: {},       // yyyy-mm-dd -> true
  writing: []     // {ts,text}
});
let ST = ST_DEFAULT();

const DB = {
  db: null,
  open() {
    return new Promise(res => {
      try {
        const r = indexedDB.open('bibliotecaRosas', 1);
        r.onupgradeneeded = () => r.result.createObjectStore('kv');
        r.onsuccess = () => { this.db = r.result; res(); };
        r.onerror = () => res();
        r.onblocked = () => res();
      } catch (e) { res(); }
    });
  },
  get(k) {
    return new Promise(res => {
      if (!this.db) return res(null);
      try { const q = this.db.transaction('kv').objectStore('kv').get(k); q.onsuccess = () => res(q.result ?? null); q.onerror = () => res(null); } catch (e) { res(null); }
    });
  },
  set(k, v) {
    return new Promise(res => {
      if (!this.db) return res(false);
      try { const t = this.db.transaction('kv', 'readwrite'); t.objectStore('kv').put(v, k); t.oncomplete = () => res(true); t.onerror = () => res(false); } catch (e) { res(false); }
    });
  }
};

async function loadState() {
  await DB.open();
  let a = await DB.get('state');
  let b = null;
  try { b = JSON.parse(localStorage.getItem('sl.state') || 'null'); } catch (e) { /* ignore */ }
  const pick = (a && b) ? (a.ts >= b.ts ? a : b) : (a || b);
  ST = Object.assign(ST_DEFAULT(), pick || {});
  // ask the browser not to evict our data
  try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch (e) { /* ignore */ }
}
let saveTimer = null;
function save(now) {
  ST.ts = Date.now();
  const write = () => {
    saveTimer = null;
    const json = JSON.stringify(ST);
    try { localStorage.setItem('sl.state', json); } catch (e) { /* quota */ }
    DB.set('state', JSON.parse(json));
  };
  if (now) { clearTimeout(saveTimer); write(); return; }
  clearTimeout(saveTimer); saveTimer = setTimeout(write, 250);
}
window.addEventListener('pagehide', () => save(true));
document.addEventListener('visibilitychange', () => { if (document.hidden) save(true); });

function markDay() { const d = today(); if (!ST.days[d]) { ST.days[d] = true; } }

/* ── toasts, sheets, errors ── */
function toast(msg, ms = 2800) {
  const t = document.createElement('div');
  t.className = 'toast'; t.textContent = msg;
  $('#toasts').appendChild(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 400); }, ms);
}
function openSheet(html, cls = '') {
  const w = $('#sheetWrap'); const s = $('#sheet');
  s.className = 'sheet ' + cls; s.innerHTML = html;
  w.classList.toggle('passive', cls.includes('passive'));
  w.hidden = false; requestAnimationFrame(() => w.classList.add('open'));
}
function closeSheet() {
  const w = $('#sheetWrap'); w.classList.remove('open');
  setTimeout(() => { if (!w.classList.contains('open')) w.hidden = true; }, 220);
  if (typeof Reader !== 'undefined') Reader.onSheetClosed();
}
function confirmBox(msg, yes = 'Yes', no = 'Cancel') {
  return new Promise(res => {
    openSheet(`<div class="confirm"><p>${esc(msg)}</p><div class="row end"><button class="btn ghost" data-act="cfNo">${esc(no)}</button><button class="btn danger" data-act="cfYes">${esc(yes)}</button></div></div>`, 'small');
    ACT.cfYes = () => { closeSheet(); res(true); };
    ACT.cfNo = () => { closeSheet(); res(false); };
  });
}
function showError(err) {
  const msg = (err && err.stack) ? err.stack : String(err);
  if (/ResizeObserver/.test(msg)) return;
  const box = $('#errBox'); if (!box) return;
  $('#errText').value = `${APP_NAME} v${APP_VERSION}\n${new Date().toISOString()}\n${navigator.userAgent}\n\n${msg}`;
  box.hidden = false;
}
window.addEventListener('error', e => showError(e.error || e.message));
window.addEventListener('unhandledrejection', e => showError(e.reason));

/* ── actions: one delegated click handler for every [data-act] ── */
const ACT = {};
document.addEventListener('click', e => {
  const t = e.target.closest('[data-act]');
  if (!t) return;
  const fn = ACT[t.dataset.act];
  if (fn) { sfx('tap'); fn(t, e); }
});
ACT.copyErr = () => {
  const ta = $('#errText'); ta.select();
  (navigator.clipboard ? navigator.clipboard.writeText(ta.value) : Promise.reject()).then(() => toast('Error text copied'), () => { document.execCommand('copy'); toast('Error text copied'); });
};
ACT.closeErr = () => { $('#errBox').hidden = true; };
ACT.closeSheet = () => closeSheet();

/* ── sound (synthesized, no files) ── */
let actx = null;
function sfx(name) {
  if (!S.sound) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    if (actx.state === 'suspended') actx.resume();
    const t0 = actx.currentTime;
    const note = (f, d, type = 'sine', v = 0.05, at = 0) => {
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = type; o.frequency.value = f; o.connect(g); g.connect(actx.destination);
      g.gain.setValueAtTime(0.0001, t0 + at); g.gain.exponentialRampToValueAtTime(v, t0 + at + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t0 + at + d);
      o.start(t0 + at); o.stop(t0 + at + d + 0.02);
    };
    if (name === 'tap') note(660, 0.07, 'sine', 0.025);
    else if (name === 'page') { note(300, 0.12, 'triangle', 0.03); note(220, 0.14, 'triangle', 0.02, 0.05); }
    else if (name === 'ok') { note(660, 0.15, 'sine', 0.05); note(880, 0.25, 'sine', 0.05, 0.1); }
    else if (name === 'bad') { note(260, 0.22, 'triangle', 0.05); }
    else if (name === 'star') { note(1046, 0.2, 'sine', 0.04); note(1318, 0.3, 'sine', 0.04, 0.1); }
  } catch (e) { /* audio not available */ }
}

/* ── text-to-speech ── */
let VOICES = [], warnedVoice = false;
function loadVoices() { try { VOICES = speechSynthesis.getVoices(); } catch (e) { VOICES = []; } }
if ('speechSynthesis' in window) { loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }
function spanishVoice() {
  return VOICES.find(v => /^es[-_](MX|US|419)/i.test(v.lang)) || VOICES.find(v => /^es/i.test(v.lang)) || null;
}
function speak(text, slow) {
  if (!('speechSynthesis' in window)) { toast('Audio is not available in this browser. The text still works.'); return; }
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const v = spanishVoice();
    if (v) { u.voice = v; u.lang = v.lang; }
    else {
      u.lang = 'es-ES';
      if (!warnedVoice) { warnedVoice = true; toast('No Spanish voice found on this device. You can install one in your phone\'s text-to-speech settings.', 5000); }
    }
    u.rate = slow ? Math.max(0.4, S.rate - 0.25) : S.rate;
    speechSynthesis.speak(u);
  } catch (e) { toast('Audio could not play on this device.'); }
}

/* ── router (hash based, works with the Android back button) ── */
const Routes = {};
let currentRoute = '';
function go(path) { if (location.hash === '#' + path) route(); else location.hash = path; }
function route() {
  const path = location.hash.slice(1) || '/library';
  const parts = path.split('/').filter(Boolean);
  const name = parts[0] || 'library';
  currentRoute = name;
  closeSheetNow();
  const fn = Routes[name] || Routes.library;
  const main = $('#main');
  main.classList.remove('enter'); void main.offsetWidth;
  try { fn(...parts.slice(1)); } catch (e) { showError(e); }
  main.classList.add('enter');
  main.scrollTop = 0; window.scrollTo(0, 0);
  renderTabs(name);
  $('#app').dataset.view = name;
}
function closeSheetNow() { const w = $('#sheetWrap'); w.classList.remove('open'); w.hidden = true; }
window.addEventListener('hashchange', route);

const TABS = [
  ['library', 'Library', 'M4 5h6a3 3 0 0 1 2 1 3 3 0 0 1 2-1h6v13h-6a3 3 0 0 0-2 1 3 3 0 0 0-2-1H4z'],
  ['notebook', 'Words', 'M6 3h12v18H6zM9 8h6M9 12h6M9 16h4'],
  ['tutor', 'Tutor', 'M12 3l2.5 5.5L20 9.3l-4 4 1 5.7-5-2.8L7 19l1-5.7-4-4 5.5-.8z'],
  ['progress', 'Progress', 'M4 20V10M10 20V4M16 20v-8M22 20H2'],
  ['settings', 'Settings', 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2']
];
function renderTabs(active) {
  const hide = ['read', 'quiz', 'review'].includes(active);
  const nav = $('#tabs'); nav.hidden = hide;
  nav.innerHTML = TABS.map(([id, label, d]) => `<a href="#/${id}" class="tab ${id === active || (active === 'book' && id === 'library') ? 'on' : ''}" aria-label="${label}"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg><span>${label}</span></a>`).join('');
}
function footerHTML() {
  return `<footer class="foot"><span class="deco">✦</span> ${APP_NAME} · <span id="verTxt">v${APP_VERSION}</span> <span class="deco">✦</span></footer>`;
}
function setMain(html) { $('#main').innerHTML = html + footerHTML(); }

/* ── update banner ── */
async function checkVersion() {
  if (!navigator.onLine) return;
  try {
    const r = await fetch('version.json?t=' + Date.now(), { cache: 'no-store' });
    if (!r.ok) return;
    const j = await r.json();
    if (j.version && j.version !== APP_VERSION) $('#updateBanner').hidden = false;
  } catch (e) { /* offline or file:// */ }
}
ACT.reloadApp = async () => {
  try {
    if ('serviceWorker' in navigator) { const regs = await navigator.serviceWorker.getRegistrations(); await Promise.all(regs.map(r => r.unregister())); }
    if (window.caches) { const ks = await caches.keys(); await Promise.all(ks.map(k => caches.delete(k))); }
  } catch (e) { /* ignore */ }
  save(true);
  location.replace(location.pathname + '?r=' + Date.now() + location.hash);
};
ACT.dismissUpdate = () => { $('#updateBanner').hidden = true; };
