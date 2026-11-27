'use strict';
/* ───────────── vocabulary notebook ───────────── */
const Notebook = (() => {
  const V = { q: '', filter: 'all', book: 'all', sort: 'az', open: null };
  const bookById = id => BOOKS.find(b => b.id === id);
  const statusOf = w => w.learned ? 'learned' : w.review ? 'review' : 'new';

  function list() {
    let ws = Object.values(ST.words).filter(w => w.saved);
    if (V.q) { const q = stripAccents(V.q.toLowerCase()); ws = ws.filter(w => stripAccents(w.form).includes(q) || w.en.toLowerCase().includes(q) || stripAccents(w.lemma).includes(q)); }
    if (V.book !== 'all') ws = ws.filter(w => w.book === V.book);
    if (V.filter === 'new') ws = ws.filter(w => !w.learned);
    if (V.filter === 'learned') ws = ws.filter(w => w.learned);
    if (V.filter === 'review') ws = ws.filter(w => w.review && !w.learned);
    ws.sort(V.sort === 'az' ? (a, b) => a.form.localeCompare(b.form, 'es') : (a, b) => b.ts - a.ts);
    return ws;
  }
  function card(w) {
    const s = SENT_BY_ID[w.sid], b = bookById(w.book), open = V.open === w.form;
    const ex = s ? exampleFor(w.form, s) : null;
    return `<article class="wcard st-${statusOf(w)}"><button class="wmain" data-act="nbOpen" data-w="${esc(w.form)}" aria-expanded="${open}">
      <span class="wf">${esc(w.form)}</span><span class="we">${esc(w.en)}</span><span class="stat st-${statusOf(w)}">${{ learned: 'Learned', review: 'Needs review', new: 'Not learned yet' }[statusOf(w)]}</span></button>
      ${open ? `<div class="wmore">
        <dl class="wdl"><div><dt>Dictionary form</dt><dd>${esc(w.lemma)}${LEMMAS[w.lemma] ? ' — ' + esc(LEMMAS[w.lemma].en) : ''}</dd></div><div><dt>Part of speech</dt><dd>${esc(posLabel(w.pos || ''))}</dd></div>
        ${b ? `<div><dt>Found in</dt><dd><a href="#/read/${b.id}/${w.ch}/0">${esc(b.title)} · chapter ${w.ch + 1}</a></dd></div>` : ''}</dl>
        ${ex ? `<div class="exbox"><span class="label">Example</span><p class="es">${esc(ex.es)}</p><p class="en">${esc(ex.en)}</p></div>` : ''}
        <div class="row wrap"><button class="btn ghost sm" data-act="nbSpeak" data-w="${esc(w.form)}">🔊 Listen</button>
          <button class="btn ${w.learned ? 'green on' : 'gold'} sm" data-act="nbLearn" data-w="${esc(w.form)}">${w.learned ? '✓ Learned (tap to undo)' : 'Mark as learned'}</button>
          <button class="btn ghost sm" data-act="nbRemove" data-w="${esc(w.form)}">Remove</button></div></div>` : ''}</article>`;
  }
  function render() {
    const all = Object.values(ST.words).filter(w => w.saved);
    const cnt = { all: all.length, new: all.filter(w => !w.learned).length, learned: all.filter(w => w.learned).length, review: all.filter(w => w.review && !w.learned).length };
    const bookIds = [...new Set(all.map(w => w.book))];
    const ws = list();
    setMain(`<section class="notebook"><header class="shead2"><div class="label">Mi cuaderno</div><h1>Vocabulary notebook</h1><p class="sub">${cnt.all} saved · ${cnt.learned} learned</p></header>
      <div class="searchbar"><input class="field" id="nbq" type="search" value="${esc(V.q)}" placeholder="Search Spanish or English…" aria-label="Search words" autocomplete="off"></div>
      <div class="chips">${[['all', 'All'], ['new', 'Not learned'], ['learned', 'Learned'], ['review', 'Needs review']].map(([k, l]) => `<button class="chip${V.filter === k ? ' on' : ''}" data-act="nbFilter" data-k="${k}">${l} <small>${cnt[k]}</small></button>`).join('')}</div>
      <div class="row wrap"><div class="selwrap grow"><select class="field select" id="nbbook" aria-label="Filter by story"><option value="all">All stories</option>${bookIds.map(id => `<option value="${id}"${V.book === id ? ' selected' : ''}>${esc(bookById(id) ? bookById(id).title : id)}</option>`).join('')}</select></div>
        <button class="btn ghost" data-act="nbSort">${V.sort === 'az' ? 'A → Z' : 'Newest first'}</button>
        <button class="btn primary" data-act="nbReview" ${cnt.new ? '' : 'disabled'}>Review quiz</button></div>
      ${ws.length ? `<div class="wlist">${ws.map(card).join('')}</div>` : `<div class="empty">${ORNAMENT}<h2>${all.length ? 'No words match' : 'Your notebook is empty'}</h2><p>${all.length ? 'Try another search or filter.' : 'While reading, tap any Spanish word and choose “Save to vocabulary”. It will appear here with its example sentence.'}</p><a class="btn primary" href="#/library">Go to the library</a></div>`}</section>`);
    const q = $('#nbq'); q.addEventListener('input', () => { V.q = q.value; const pos = q.selectionStart; render(); const n = $('#nbq'); n.focus(); n.setSelectionRange(pos, pos); });
    $('#nbbook').addEventListener('change', e => { V.book = e.target.value; render(); });
  }
  ACT.nbOpen = el => { V.open = V.open === el.dataset.w ? null : el.dataset.w; render(); };
  ACT.nbFilter = el => { V.filter = el.dataset.k; render(); };
  ACT.nbSort = () => { V.sort = V.sort === 'az' ? 'new' : 'az'; render(); };
  ACT.nbSpeak = el => speak(el.dataset.w);
  ACT.nbLearn = el => { const w = ST.words[el.dataset.w]; w.learned = !w.learned; if (w.learned) w.review = false; save(); render(); };
  ACT.nbRemove = async el => { if (await confirmBox(`Remove “${el.dataset.w}” from your notebook?`, 'Remove', 'Keep')) { delete ST.words[el.dataset.w]; save(); render(); } };
  ACT.nbReview = () => go('/review/vocab');
  return { render };
})();
Routes.notebook = () => Notebook.render();
