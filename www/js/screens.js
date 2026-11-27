'use strict';
/* ───────────── library, book page, progress, settings ───────────── */
const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const DESC_ES = {
  rosas: 'Un rey bondadoso y una reina dulce desean tener hijos. Un día, en el pueblo, la reina conoce a dos gemelos huérfanos, y un castillo lleno de rosas, secretos y risas tiene una nueva familia.',
  molino: 'La harina desaparece del viejo molino del abuelo. Clara decide quedarse despierta para encontrar al ladrón. Un misterio corto en tiempo presente.'
};
const Lib = {
  q: '', level: 'all', status: 'all', tab: 'shelf',
  bk: id => BOOKS.find(b => b.id === id),
  stats(b) {
    const pr = ST.progress[b.id] || { pages: {}, chapters: {} };
    const total = b.chapters.reduce((n, c, i) => n + Reader.pagesOf(b, i).length, 0);
    const read = Object.keys(pr.pages).length;
    const doneCh = b.chapters.filter((c, i) => (pr.chapters[i] || {}).done).length;
    const finished = doneCh === b.chapters.length;
    return { total, read, pct: finished ? 100 : Math.min(99, Math.round(read / total * 100)), doneCh, finished, started: read > 0 };
  }
};
const levelsOf = b => b.level.replace('–', ' ').split(/\s+/);

function coverHTML(b) { return `<div class="cover">${COVERS[b.cover] || COVERS.castle}</div>`; }
function bookCard(b) {
  const s = Lib.stats(b), saved = ST.saved[b.id];
  const resume = ST.progress[b.id] && s.started && !s.finished;
  return `<article class="bcard"><a class="bcover" href="#/book/${b.id}" aria-label="Open ${esc(b.title)}">${coverHTML(b)}${s.finished ? '<span class="badge done">Completed</span>' : ''}</a>
    <button class="heart${saved ? ' on' : ''}" data-act="toggleSaved" data-b="${b.id}" aria-label="${saved ? 'Remove from saved books' : 'Save this book'}" aria-pressed="${!!saved}"><svg viewBox="0 0 24 24" width="22" height="22"><path d="M12 21s-8-5.3-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.700-8 11-8 11z"/></svg></button>
    <div class="binfo"><span class="lvl">${esc(b.level)}</span><h3>${esc(b.title)}</h3><p class="en-title">${esc(b.titleEn)}</p>
      <p class="meta">${b.chapters.length} chapters · ~${b.minutes} min · ${esc(b.genre)}</p>
      <div class="bar"><i style="width:${s.pct}%"></i></div><p class="meta small">${s.pct}% read</p>
      <a class="btn ${resume ? 'primary' : 'gold'} sm" href="#/book/${b.id}">${resume ? 'Continue reading' : s.finished ? 'Read again' : 'Open book'}</a></div></article>`;
}

function renderLibrary() {
  const q = stripAccents(Lib.q.toLowerCase());
  let books = BOOKS.filter(b => {
    if (S.level !== 'all' && !levelsOf(b).includes(S.level) && Lib.level === 'all' && false) return false;
    if (Lib.level !== 'all' && !levelsOf(b).includes(Lib.level)) return false;
    if (q && !stripAccents((b.title + ' ' + b.titleEn + ' ' + b.genre + ' ' + b.desc + ' ' + (DESC_ES[b.id] || '')).toLowerCase()).includes(q)) return false;
    const s = Lib.stats(b);
    if (Lib.status === 'saved' && !ST.saved[b.id]) return false;
    if (Lib.status === 'progress' && !(s.started && !s.finished)) return false;
    if (Lib.status === 'done' && !s.finished) return false;
    return true;
  });
  const last = ST.recent.map(Lib.bk).filter(b => b && Lib.stats(b).started && !Lib.stats(b).finished)[0];
  const recent = ST.recent.map(Lib.bk).filter(Boolean).slice(0, 4);
  const lastP = last && ST.progress[last.id];
  const bms = ST.bookmarks;
  let main = '';
  if (Lib.tab === 'shelf') {
    main = `${last && !Lib.q && Lib.status === 'all' && Lib.level === 'all' ? `<section class="hero"><div class="hcover">${coverHTML(last)}</div><div class="hinfo"><span class="label">Continue reading</span><h2>${esc(last.title)}</h2><p>Chapter ${lastP.ch + 1}: ${esc(last.chapters[lastP.ch].title)}</p><div class="bar"><i style="width:${Lib.stats(last).pct}%"></i></div><a class="btn primary" href="#/read/${last.id}/${lastP.ch}/${lastP.page}">Continue · page ${lastP.page + 1}</a></div></section>` : ''}
      ${recent.length && !Lib.q && Lib.status === 'all' && Lib.level === 'all' ? `<section><h2 class="h2">Recently opened</h2><div class="recent">${recent.map(b => `<a class="rcard" href="#/book/${b.id}"><div class="rc">${coverHTML(b)}</div><span>${esc(b.title)}</span></a>`).join('')}</div></section>` : ''}
      <section><h2 class="h2">The shelf</h2>${books.length ? `<div class="shelf">${books.map(bookCard).join('')}</div>` : `<div class="empty small">${ORNAMENT}<p>${Lib.level !== 'all' && BOOKS.every(b => !levelsOf(b).includes(Lib.level)) ? `There are no ${Lib.level} stories yet.` : 'No stories match your search.'}</p><button class="btn ghost" data-act="clearFilters">Clear filters</button></div>`}</section>`;
  } else {
    main = `<section><h2 class="h2">Bookmarks</h2>${bms.length ? `<div class="bmlist">${bms.map((m, i) => { const b = Lib.bk(m.book); if (!b) return ''; const pg = Reader.pagesOf(b, m.ch)[m.page]; const s = pg && pg[0][0]; return `<div class="bm"><a href="#/read/${m.book}/${m.ch}/${m.page}"><svg viewBox="0 0 24 40" width="18" height="30"><path d="M2 0h20v38l-10-8-10 8z"/></svg><div><b>${esc(b.title)}</b><span>Chapter ${m.ch + 1} · page ${m.page + 1}</span>${s ? `<em class="es">${esc(s.es)}</em>` : ''}</div></a><button class="iconbtn" data-act="delBm" data-i="${i}" aria-label="Delete bookmark">✕</button></div>`; }).join('')}</div>` : `<div class="empty small">${ORNAMENT}<p>No bookmarks yet. While reading, tap the ribbon in the corner of a page.</p></div>`}</section>`;
  }
  setMain(`<section class="library"><header class="mast"><div class="label">Bienvenida a tu</div><h1>${APP_NAME}</h1>${ORNAMENT}<p class="sub">Spanish stories, one page at a time, with English beside you.</p></header>
    <div class="seg"><button class="${Lib.tab === 'shelf' ? 'on' : ''}" data-act="libTab" data-t="shelf">Shelf</button><button class="${Lib.tab === 'marks' ? 'on' : ''}" data-act="libTab" data-t="marks">Bookmarks <small>${bms.length}</small></button></div>
    ${Lib.tab === 'shelf' ? `<div class="searchbar"><input class="field" id="libq" type="search" value="${esc(Lib.q)}" placeholder="Search stories…" aria-label="Search stories" autocomplete="off"></div>
    <div class="chips" aria-label="Level">${['all', ...LEVELS].map(l => `<button class="chip${Lib.level === l ? ' on' : ''}" data-act="libLevel" data-l="${l}">${l === 'all' ? 'All levels' : l}</button>`).join('')}</div>
    <div class="chips">${[['all', 'All'], ['saved', 'Saved ♥'], ['progress', 'In progress'], ['done', 'Completed']].map(([k, l]) => `<button class="chip alt${Lib.status === k ? ' on' : ''}" data-act="libStatus" data-k="${k}">${l}</button>`).join('')}</div>` : ''}
    ${main}</section>`);
  const qi = $('#libq'); if (qi) qi.addEventListener('input', () => { Lib.q = qi.value; const p = qi.selectionStart; renderLibrary(); const n = $('#libq'); n.focus(); n.setSelectionRange(p, p); });
}
ACT.libTab = el => { Lib.tab = el.dataset.t; renderLibrary(); };
ACT.libLevel = el => { Lib.level = el.dataset.l; renderLibrary(); };
ACT.libStatus = el => { Lib.status = el.dataset.k; renderLibrary(); };
ACT.clearFilters = () => { Lib.q = ''; Lib.level = 'all'; Lib.status = 'all'; renderLibrary(); };
ACT.toggleSaved = el => { const id = el.dataset.b; if (ST.saved[id]) delete ST.saved[id]; else { ST.saved[id] = true; sfx('star'); } save(); el.classList.toggle('on'); el.classList.add('pop'); setTimeout(() => el.classList.remove('pop'), 500); el.setAttribute('aria-pressed', !!ST.saved[id]); if (currentRoute === 'book') renderBook(el.dataset.b); };
ACT.delBm = el => { ST.bookmarks.splice(+el.dataset.i, 1); save(); renderLibrary(); };
Routes.library = renderLibrary;

/* ── book page ── */
function renderBook(id) {
  const b = Lib.bk(id); if (!b) return go('/library');
  const s = Lib.stats(b), pr = ST.progress[id] || { chapters: {}, pages: {} };
  ST.recent = [id, ...ST.recent.filter(x => x !== id)].slice(0, 8); save();
  const saved = ST.saved[id];
  const resume = s.started && !s.finished && ST.progress[id];
  setMain(`<section class="bookpage"><a class="back" href="#/library">‹ Library</a>
    <div class="bhero"><div class="bc">${coverHTML(b)}</div><div class="bt"><span class="lvl">${esc(b.level)}</span><h1>${esc(b.title)}</h1><p class="en-title">${esc(b.titleEn)}</p>
      <p class="meta">${b.chapters.length} chapters · ~${b.minutes} min · ${b.nWords.toLocaleString()} Spanish words · ${esc(b.genre)}</p></div></div>
    <p class="desc es">${esc(DESC_ES[id] || '')}</p><p class="desc en">${esc(b.desc)}</p>
    <div class="row wrap"><a class="btn primary big" href="#/read/${id}/${resume ? ST.progress[id].ch + '/' + ST.progress[id].page : '0/0'}">${resume ? `Continue · chapter ${ST.progress[id].ch + 1}` : s.finished ? 'Read again' : 'Start reading'}</a>
      <button class="btn ${saved ? 'gold on' : 'ghost'}" data-act="toggleSaved" data-b="${id}">${saved ? '♥ Saved' : '♡ Save book'}</button></div>
    <div class="bar"><i style="width:${s.pct}%"></i></div><p class="meta small">${s.pct}% read · ${s.doneCh} of ${b.chapters.length} chapters completed</p>
    <h2 class="h2">Chapters</h2><ol class="chapters">${b.chapters.map((c, i) => {
      const ci = (pr.chapters || {})[i] || {}, open = i === 0 || (pr.chapters[i - 1] || {}).done || (pr.chapters[i - 1] || {}).skipped;
      const status = ci.done ? `<span class="stat st-learned">Done · ${ci.best}%</span>` : ci.skipped ? '<span class="stat st-review">Quiz skipped</span>' : open ? '<span class="stat st-new">Open</span>' : '<span class="stat locked">🔒 Locked</span>';
      return `<li class="chap${open ? '' : ' lock'}"><a ${open ? `href="#/read/${id}/${i}/0"` : 'aria-disabled="true" data-act="lockedChap"'}><span class="num">${i + 1}</span><span class="ct"><b>${esc(c.title)}</b><i>${esc(c.titleEn)}</i><small>${esc(c.summary)} · ${c.nWords} words</small></span>${status}</a>${ci.done || ci.skipped || false ? `<button class="btn ghost sm" data-act="startQuiz" data-b="${id}" data-c="${i}">${ci.done ? 'Retake quiz' : 'Take quiz'}</button>` : ''}</li>`;
    }).join('')}</ol></section>`);
}
ACT.lockedChap = () => toast('Complete or skip the previous chapter\'s quiz to unlock this one.');
Routes.book = renderBook;

/* ── progress dashboard ── */
function streak() {
  const days = ST.days; let n = 0; const d = new Date();
  if (!days[d.toISOString().slice(0, 10)]) d.setDate(d.getDate() - 1);
  while (days[d.toISOString().slice(0, 10)]) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
function renderProgress() {
  const stats = BOOKS.map(b => ({ b, s: Lib.stats(b) }));
  const started = stats.filter(x => x.s.started).length, completed = stats.filter(x => x.s.finished).length;
  const chapters = stats.reduce((n, x) => n + x.s.doneCh, 0);
  const pages = stats.reduce((n, x) => n + x.s.read, 0);
  const words = Object.values(ST.words), saved = words.filter(w => w.saved).length, learned = words.filter(w => w.learned).length;
  const latest = {}; ST.quizLog.forEach(q => latest[q.book + ':' + q.ch] = q.pct);
  const vals = Object.values(latest), avg = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null;
  const ks = Object.entries(ST.kindStats).filter(([, v]) => v.bad > 0).map(([k, v]) => ({ k, bad: v.bad, ok: v.ok, rate: Math.round(v.ok / (v.ok + v.bad) * 100) })).sort((a, b) => a.rate - b.rate);
  const tile = (n, l) => `<div class="tile"><b>${n}</b><span>${l}</span></div>`;
  setMain(`<section class="progress"><header class="shead2"><div class="label">Tu camino</div><h1>Your progress</h1><p class="sub">Everything here is counted from what you actually did.</p></header>
    <div class="tiles">${tile(started, 'Books started')}${tile(completed, 'Books completed')}${tile(chapters, 'Chapters completed')}${tile(pages, 'Pages read')}${tile(saved, 'Words saved')}${tile(learned, 'Words learned')}${tile(avg === null ? '—' : avg + '%', 'Quiz average')}${tile(streak() + (streak() === 1 ? ' day' : ' days'), 'Reading streak')}</div>
    <h2 class="h2">Books</h2>${stats.map(({ b, s }) => `<a class="prow" href="#/book/${b.id}"><b>${esc(b.title)}</b><div class="bar"><i style="width:${s.pct}%"></i></div><small>${s.pct}% · ${s.doneCh}/${b.chapters.length} chapters</small></a>`).join('')}
    <h2 class="h2">Areas that need practice</h2>${ks.length ? ks.map(x => `<div class="prow"><b>${esc(KIND_LABEL[x.k])}</b><div class="bar warn"><i style="width:${x.rate}%"></i></div><small>${x.rate}% correct (${x.bad} missed)</small></div>`).join('') : '<p class="muted">Take a chapter quiz and your weaker areas will show up here.</p>'}
    <div class="row wrap"><a class="btn primary" href="#/review/mistakes">Review my mistakes${ST.mistakes.length ? ` (${ST.mistakes.length})` : ''}</a><a class="btn ghost" href="#/notebook">Vocabulary notebook</a></div>
    <h2 class="h2">Quiz history</h2>${ST.quizLog.length ? `<ul class="hist">${ST.quizLog.slice(-8).reverse().map(q => { const b = Lib.bk(q.book); return `<li><span>${esc(b ? b.title : q.book)} · ch. ${q.ch + 1}</span><b>${q.pts}/${q.total} · ${q.pct}%</b><small>${new Date(q.ts).toLocaleDateString()}</small></li>`; }).join('')}</ul>` : '<p class="muted">No quizzes taken yet.</p>'}</section>`);
}
Routes.progress = renderProgress;

/* ── settings controls (shared with the reader's quick settings) ── */
const Controls = {
  defs: {
    mode: { type: 'seg', label: 'Reading mode', opts: [['beginner', 'Beginner', 'Spanish + English under every sentence + word help'], ['learning', 'Learning', 'English appears when you tap a sentence'], ['immersion', 'Immersion', 'Spanish only; English in the help panel']] },
    assist: { type: 'toggle', label: 'English help opens automatically', sub: 'Show translations and explanations as soon as you tap. When off, you reveal them yourself.' },
    tapMode: { type: 'seg', label: 'Tap a word to…', opts: [['words', 'See the word'], ['sentences', 'Select the sentence']], sub: 'The ✦ button after each sentence always selects the whole sentence.' },
    esSize: { type: 'range', label: 'Spanish text size', min: 16, max: 32, step: 1, unit: 'px' },
    enSize: { type: 'range', label: 'English text size', min: 12, max: 26, step: 1, unit: 'px' },
    lineH: { type: 'range', label: 'Line spacing', min: 1.3, max: 2.3, step: 0.05, unit: '' },
    width: { type: 'range', label: 'Reading width', min: 460, max: 900, step: 20, unit: 'px' },
    theme: { type: 'seg', label: 'Reading theme', opts: [['light', 'Light'], ['dark', 'Dark']] },
    sentHL: { type: 'toggle', label: 'Highlight selected sentence' },
    vocabHL: { type: 'toggle', label: 'Highlight saved and new words', sub: 'Yellow = new, blue = saved, green = learned.' },
    anim: { type: 'toggle', label: 'Animations', sub: 'Floating petals, page turns and sparkles. Also off automatically if your device asks for reduced motion.' },
    sound: { type: 'toggle', label: 'Sound effects' },
    rate: { type: 'range', label: 'Spanish audio speed', min: 0.4, max: 1.2, step: 0.05, unit: '×' },
    level: { type: 'seg', label: 'My Spanish level', opts: [['all', 'All'], ...LEVELS.map(l => [l, l])], sub: 'Shown as a hint on the library. Only A1 and A2 stories exist so far.' }
  },
  html(keys) {
    return keys.map(k => {
      const d = this.defs[k], v = S[k];
      if (d.type === 'toggle') return `<div class="ctl"><label class="switch"><input type="checkbox" data-set="${k}" ${v ? 'checked' : ''}><span class="knob"></span><span class="ctltxt"><b>${d.label}</b>${d.sub ? `<small>${d.sub}</small>` : ''}</span></label></div>`;
      if (d.type === 'range') return `<div class="ctl"><label for="r_${k}"><b>${d.label}</b> <output id="o_${k}">${v}${d.unit}</output></label><input class="range" id="r_${k}" type="range" min="${d.min}" max="${d.max}" step="${d.step}" value="${v}" data-set="${k}" data-unit="${d.unit}"></div>`;
      return `<div class="ctl"><b>${d.label}</b>${d.sub ? `<small>${d.sub}</small>` : ''}<div class="seg wrapseg">${d.opts.map(o => `<button class="${v === o[0] ? 'on' : ''}" data-act="setSeg" data-k="${k}" data-v="${o[0]}" ${o[2] ? `title="${esc(o[2])}"` : ''}>${o[1]}${o[2] ? `<small>${o[2]}</small>` : ''}</button>`).join('')}</div></div>`;
    }).join('');
  }
};
function applyChange(k) {
  saveSettings(); applySettings();
  if (k === 'mode' && currentRoute === 'read') { S.assist = S.mode !== 'immersion'; saveSettings(); }
  if (currentRoute === 'read') { Reader.redraw(); const sh = $('#sheetWrap'); if (!sh.hidden && $('#sheet').querySelector('.seg,.range')) { /* quick settings stay open */ } }
}
document.addEventListener('input', e => {
  const t = e.target; if (!t.dataset || !t.dataset.set) return;
  const k = t.dataset.set;
  if (t.type === 'checkbox') S[k] = t.checked; else { S[k] = parseFloat(t.value); const o = $('#o_' + k); if (o) o.textContent = t.value + (t.dataset.unit || ''); }
  if (k === 'anim' || k === 'sound') { if (k === 'sound' && S.sound) sfx('ok'); }
  if (k === 'esSize' || k === 'enSize' || k === 'lineH' || k === 'width') { saveSettings(); applySettings(); return; }   // live, no redraw while dragging
  applyChange(k);
});
ACT.setSeg = el => {
  const k = el.dataset.k; S[k] = el.dataset.v;
  if (k === 'mode') S.assist = S.mode !== 'immersion';
  saveSettings(); applySettings();
  if (currentRoute === 'read') { Reader.redraw(); ACT.readSettings(); }
  else renderSettings();
};

function renderSettings() {
  setMain(`<section class="settings"><header class="shead2"><div class="label">Ajustes</div><h1>Settings</h1><p class="sub">Make the pages comfortable for long reading sessions.</p></header>
    <div class="card"><h2 class="h3">Reading</h2>${Controls.html(['mode', 'assist', 'tapMode', 'esSize', 'enSize', 'lineH', 'width', 'theme', 'sentHL', 'vocabHL'])}
      <div class="preview" aria-label="Preview"><p class="es">La reina abrió las puertas del castillo.</p><p class="en">The queen opened the doors of the castle.</p></div></div>
    <div class="card"><h2 class="h3">Sound and motion</h2>${Controls.html(['anim', 'sound', 'rate'])}<button class="btn ghost" data-act="testVoice">🔊 Test the Spanish voice</button></div>
    <div class="card"><h2 class="h3">Learning level</h2>${Controls.html(['level'])}</div>
    <div class="card"><h2 class="h3">Your data</h2><p class="small">Everything is stored on this device only (IndexedDB with a copy in local storage). Export a backup before clearing your browser data or changing phones.</p>
      <div class="row wrap"><button class="btn primary" data-act="exportData">Export backup</button><label class="btn ghost filebtn">Import backup<input type="file" id="impfile" accept="application/json,.json" hidden></label><button class="btn danger" data-act="resetData">Erase all progress</button></div>
      <p class="small" id="storeInfo"></p></div>
    <div class="card"><h2 class="h3">About</h2><p class="small">${APP_NAME} · version ${APP_VERSION}<br>Works offline. No accounts, no tracking, no external services.</p><button class="btn ghost" data-act="checkUpdate">Check for a new version</button></div></section>`);
  $('#impfile').addEventListener('change', importData);
  if (navigator.storage && navigator.storage.estimate) navigator.storage.estimate().then(e => { const el = $('#storeInfo'); if (el) el.textContent = `Storage used by this app: about ${(e.usage / 1024).toFixed(0)} KB.`; }).catch(() => { });
}
ACT.testVoice = () => speak('Hola, me llamo Emilia. Esta es mi casa.');
ACT.checkUpdate = async () => { toast('Checking…'); await checkVersion(); if ($('#updateBanner').hidden) toast('You have the latest version.'); };
ACT.exportData = () => {
  const blob = new Blob([JSON.stringify({ app: APP_NAME, version: APP_VERSION, exported: new Date().toISOString(), settings: S, state: ST }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `biblioteca-rosas-backup-${today()}.json`; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1500);
  toast('Backup file created');
};
async function importData(e) {
  const f = e.target.files[0]; if (!f) return;
  try {
    const j = JSON.parse(await f.text());
    if (!j.state || typeof j.state !== 'object') throw new Error('This file is not a Biblioteca backup.');
    if (!(await confirmBox('Replace your current progress with this backup?', 'Replace', 'Cancel'))) return;
    ST = Object.assign(ST_DEFAULT(), j.state); Object.assign(S, SETTINGS_DEFAULT, j.settings || {});
    save(true); saveSettings(); applySettings(); toast('Backup restored'); renderSettings();
  } catch (err) { showError(err); }
}
ACT.resetData = async () => {
  if (await confirmBox('Erase all reading progress, bookmarks, quiz results and saved words on this device? This cannot be undone.', 'Erase everything', 'Keep my data')) {
    ST = ST_DEFAULT(); save(true); toast('Progress erased'); renderSettings();
  }
};
Routes.settings = renderSettings;
