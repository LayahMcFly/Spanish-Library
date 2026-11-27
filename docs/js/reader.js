'use strict';
/* ───────────── reading screen: pages, sentence + word selection, bookmarks ───────────── */
const Reader = (() => {
  const R = { book: null, ch: 0, page: 0, sel: null, ctxWord: null, revealed: new Set(), dir: 'next' };
  const PER_PAGE = 6;
  const pageCache = {};

  function pagesOf(b, ci) {
    const k = b.id + ci; if (pageCache[k]) return pageCache[k];
    const pages = []; let cur = [], n = 0;
    for (const p of b.chapters[ci].paras) {
      cur.push(p); n += p.length;
      if (n >= PER_PAGE) { pages.push(cur); cur = []; n = 0; }
    }
    if (cur.length) { if (pages.length && n < 3) pages[pages.length - 1].push(...cur); else pages.push(cur); }
    return (pageCache[k] = pages);
  }
  const prog = id => (ST.progress[id] = ST.progress[id] || { ch: 0, page: 0, last: 0, pages: {}, chapters: {} });
  const chInfo = (id, c) => (prog(id).chapters[c] = prog(id).chapters[c] || {});
  const unlocked = (b, c) => c === 0 || !!(chInfo(b.id, c - 1).done || chInfo(b.id, c - 1).skipped);
  const bookById = id => BOOKS.find(b => b.id === id);

  function hlClass(lw) {
    if (!S.vocabHL) return '';
    const w = ST.words[lw]; if (!w) return '';
    return w.learned ? 'hl-learned' : w.saved ? 'hl-saved' : 'hl-new';
  }
  function sentHTML(s) {
    let html = '', last = 0;
    for (const m of s.es.matchAll(WORD_RE)) {
      html += esc(s.es.slice(last, m.index));
      const lw = m[0].toLowerCase();
      html += `<span class="w ${hlClass(lw)}" data-w="${esc(lw)}">${esc(m[0])}</span>`;
      last = m.index + m[0].length;
    }
    html += esc(s.es.slice(last));
    const showEn = S.mode === 'beginner' || (S.mode === 'learning' && R.revealed.has(s.id));
    return `<div class="sent${R.sel === s.id ? ' sel' : ''}" data-id="${s.id}"><span class="es">${html}</span><button class="sbtn" aria-label="Show sentence help" title="Sentence help">✦</button><div class="en${showEn ? ' show' : ''}">${esc(s.en)}</div></div>`;
  }
  function keyWords(page) {
    const seen = new Map();
    for (const p of page) for (const s of p) for (const t of tokens(s.es)) {
      const e = LEX[t.lw];
      if (!e || !/^(noun|verb|adjective|adverb)/.test(e.pos) || e.pos === 'proper noun') continue;
      if (!seen.has(e.lemma)) seen.set(e.lemma, { form: t.lw, e });
    }
    return [...seen.values()].slice(0, 10);
  }

  function render(id, c, p) {
    const b = bookById(id); if (!b) return go('/library');
    c = clamp(parseInt(c || 0, 10) || 0, 0, b.chapters.length - 1);
    if (!unlocked(b, c)) { toast('Finish (or skip) the quiz for the previous chapter first.'); return go('/book/' + id); }
    const pages = pagesOf(b, c);
    p = clamp(parseInt(p ?? prog(id).page ?? 0, 10) || 0, 0, pages.length);
    if (R.book !== id || R.ch !== c) { R.revealed = new Set(); }
    R.book = id; R.ch = c; R.page = p; R.sel = null;
    const pr = prog(id); pr.ch = c; pr.page = p; pr.last = Date.now();
    ST.recent = [id, ...ST.recent.filter(x => x !== id)].slice(0, 8);
    if (p < pages.length) pr.pages[c + ':' + p] = 1;
    markDay(); save();
    draw();
  }

  function draw() {
    const b = bookById(R.book), ch = b.chapters[R.ch], pages = pagesOf(b, R.ch);
    const bm = ST.bookmarks.some(x => x.book === b.id && x.ch === R.ch && x.page === R.page);
    const atEnd = R.page >= pages.length;
    let body = '';
    if (!atEnd) {
      const pg = pages[R.page];
      if (R.page === 0) body += `<header class="chhead"><div class="label">Capítulo ${R.ch + 1}</div><h1>${esc(ch.title)}</h1><div class="sub">${esc(ch.titleEn)}</div>${ORNAMENT}</header>`;
      body += pg.map(par => `<div class="para">${par.map(sentHTML).join('')}</div>`).join('');
      if (S.mode === 'beginner') {
        const kw = keyWords(pg);
        if (kw.length) body += `<div class="kw"><div class="label">Words on this page</div>${kw.map(k => `<button class="chip kwchip" data-act="kwWord" data-w="${esc(k.form)}"><b>${esc(k.form)}</b> ${esc(k.e.gloss === k.e.en || LEX[k.form].gloss === k.e.en ? k.e.en : LEX[k.form].gloss)}</button>`).join('')}</div>`;
      }
      body += `<div class="pno">— ${R.page + 1} —</div>`;
    } else {
      const ci = chInfo(b.id, R.ch), last = b.chapters.length - 1 === R.ch;
      body += `<div class="endcard">${ORNAMENT}<h2>${last ? '¡Fin del libro!' : '¡Capítulo completo!'}</h2><p class="sub">${last ? 'You reached the end of the book. Take the last quiz to finish it.' : 'Chapter ' + (R.ch + 1) + ' is finished. Take the quiz to unlock the next chapter.'}</p>
      ${ci.done ? `<p class="okline">Quiz done · best score ${ci.best}%</p>` : ''}
      <div class="stack"><button class="btn primary big" data-act="startQuiz" data-b="${b.id}" data-c="${R.ch}">${ci.done ? 'Retake the quiz' : 'Take the quiz'}</button>
      ${(ci.done || ci.skipped) && !last ? `<button class="btn gold" data-act="nextChapter">Continue to chapter ${R.ch + 2} →</button>` : ''}
      ${!ci.done && !ci.skipped ? `<button class="btn ghost" data-act="skipQuiz">Skip the quiz for now</button>` : ''}
      <a class="btn ghost" href="#/book/${b.id}">Back to chapters</a></div></div>`;
    }
    const total = pages.length + 1, pct = Math.round((R.page / (total - 1 || 1)) * 100);
    setMain(`<div class="reader" data-mode="${S.mode}">
      <div class="rbar"><a class="iconbtn" href="#/book/${b.id}" aria-label="Back to book">‹</a><div class="rtitle"><b>${esc(b.title)}</b><span>${esc(ch.title)}</span></div>
        <button class="iconbtn" data-act="readSettings" aria-label="Reading settings">Aa</button></div>
      <div class="pagewrap"><article class="page flip-${R.dir}" id="page">
        ${atEnd ? '' : `<button class="ribbon${bm ? ' on' : ''}" data-act="toggleBookmark" aria-label="${bm ? 'Remove bookmark' : 'Bookmark this page'}" aria-pressed="${bm}"><svg viewBox="0 0 24 40" width="26" height="40"><path d="M2 0h20v38l-10-8-10 8z"/></svg></button>`}
        ${body}</article></div>
      <div class="rnav"><button class="btn ghost" data-act="prevPage" ${R.page === 0 && R.ch === 0 ? 'disabled' : ''}>‹ Back</button>
        <div class="rprog"><div class="bar"><i style="width:${pct}%"></i></div><small>Page ${Math.min(R.page + 1, pages.length)} of ${pages.length}</small></div>
        ${S.mode === 'learning' && !atEnd ? `<button class="btn ghost" data-act="revealPage" aria-label="Show English for this page">EN</button>` : ''}
        <button class="btn primary" data-act="nextPage" ${atEnd ? 'disabled' : ''}>Next ›</button></div></div>`);
    $('#page').addEventListener('click', onPageClick);
    bindSwipe($('.pagewrap'));
    R.dir = 'next';
  }

  function onPageClick(e) {
    const s = e.target.closest('.sent'); if (!s) return;
    const sb = e.target.closest('.sbtn'), w = e.target.closest('.w');
    if (sb || S.tapMode === 'sentences' || !w) selectSentence(s.dataset.id);
    else selectWord(w, s);
  }
  function markSel(id, word) {
    $$('.sent.sel,.sent.ctx').forEach(x => x.classList.remove('sel', 'ctx'));
    $$('.w.cur').forEach(x => x.classList.remove('cur'));
    R.sel = id;
    const el = $(`.sent[data-id="${id}"]`);
    if (el) { el.classList.add(word ? 'ctx' : 'sel'); if (word) word.classList.add('cur'); keepVisible(el); }
  }
  function keepVisible(el) {
    document.body.classList.add('sheetopen');
    const r = el.getBoundingClientRect(), limit = innerHeight * 0.42;
    if (r.bottom > limit || r.top < 60) window.scrollBy({ top: r.top - innerHeight * 0.14, behavior: S.anim ? 'smooth' : 'auto' });
  }

  function selectSentence(id) {
    const s = SENT_BY_ID[id]; if (!s) return;
    markSel(id, null); sfx('star');
    if (S.mode === 'learning') { R.revealed.add(id); const en = $(`.sent[data-id="${id}"] .en`); en && en.classList.add('show'); }
    sentenceSheet(s);
  }
  function sentenceSheet(s, showBreak) {
    const reveal = S.assist || R.revealed.has(s.id) || S.mode === 'beginner';
    const gt = (typeof Tutor !== 'undefined' ? Tutor.topicsFor(s.es) : []);
    const bd = breakdown(s.es);
    openSheet(`<div class="shead"><span class="label">Sentence</span><button class="x" data-act="closeSheet" aria-label="Close">✕</button></div>
      <p class="sbig">${esc(s.es)}</p>
      <div class="row wrap"><button class="btn gold" data-act="speakSent">🔊 Listen</button><button class="btn ghost" data-act="speakSlow">🐢 Slowly</button><button class="btn ghost" data-act="tutorSent">✦ Ask the tutor</button></div>
      ${reveal ? `<div class="enbox"><span class="label">English</span><p>${esc(s.en)}</p></div>` : `<button class="btn primary wide" data-act="revealSent">Show English translation</button>`}
      ${reveal && s.note ? `<div class="note"><span class="label">About this sentence</span><p>${esc(s.note)}</p></div>` : ''}
      ${gt.length && reveal ? `<div class="note"><span class="label">Grammar to notice</span>${gt.map(t => `<p><b>${esc(t.title)}.</b> ${esc(t.short)}</p>`).join('')}</div>` : ''}
      ${reveal ? `<details class="simple" ${showBreak ? 'open' : ''}><summary>Simple explanation: word by word</summary><div class="bd">${bd.map(x => `<div class="bdrow${x.phrase ? ' ph' : ''}"><b>${esc(x.text)}</b><span>${esc(x.gloss)}${x.lemma ? ` <em>(from ${esc(x.lemma)})</em>` : ''}</span></div>`).join('')}</div></details>` : ''}`, 'passive');
    Reader.curSent = s;
  }

  function selectWord(wEl, sEl) {
    const lw = wEl.dataset.w, s = SENT_BY_ID[sEl.dataset.id];
    markSel(sEl.dataset.id, wEl); sfx('star');
    R.ctxWord = { lw, s, idx: tokens(s.es).findIndex(t => t.lw === lw && t.w === wEl.textContent) };
    if (!ST.words[lw]) {
      const e = lookup(lw);
      ST.words[lw] = { form: lw, lemma: e ? e.lemma : lw, pos: e ? e.pos : '', en: e ? e.gloss : '', lemEn: e ? e.en : '', book: s.book, ch: s.ch, sid: s.id, saved: false, learned: false, review: false, streak: 0, ts: Date.now() };
      save(); refreshHL();
    }
    wordSheet(lw, s);
  }
  function contextExplain(e, lw, s, idx) {
    const parts = [];
    const ph = phraseContaining(s.es, idx);
    if (ph) parts.push(`Here it is part of the expression "${ph.text}", which means "${ph.gloss}". The words work together, so do not translate them one by one.`);
    if (e.lemma !== lw && e.pos.startsWith('verb')) parts.push(`"${lw}" is a form of the verb "${e.lemma}" (${e.en}). In this sentence it means "${e.gloss}".`);
    else if (e.gloss !== e.en && !ph) parts.push(`In this sentence it means "${e.gloss}".`);
    const hint = { noun: 'A noun names a person, place, thing or idea.', verb: 'A verb shows an action or a state. Its ending tells you who does it and when.', adjective: 'An adjective describes a noun. In Spanish it usually comes after the noun and matches it in gender and number.', adverb: 'An adverb adds detail to a verb or adjective (how, when, where).', preposition: 'A preposition links words and shows relationships such as place, direction or purpose.', article: 'Articles come before nouns. Spanish has masculine (el, un) and feminine (la, una) forms.', pronoun: 'A pronoun replaces or points to a noun.', 'proper noun': 'A name of a person or place.' }[e.pos.split(' / ')[0]];
    if (hint) parts.push(hint);
    const note = s.note && (s.note.toLowerCase().includes(`"${lw}"`) || s.note.toLowerCase().includes(`"${e.lemma}"`)) ? s.note : '';
    return { text: parts.join(' '), note };
  }
  function wordSheet(lw, s) {
    const e = lookup(lw), rec = ST.words[lw] || {};
    const w = R.ctxWord || { idx: 0 };
    if (!e) {
      openSheet(`<div class="shead"><span class="label">Word</span><button class="x" data-act="closeSheet">✕</button></div><h2 class="wword">${esc(lw)}</h2><p>This word is not in the offline dictionary yet.</p>`, 'passive'); return;
    }
    const ex = exampleFor(lw, s), cx = contextExplain(e, lw, s, w.idx);
    const st = rec.learned ? ['learned', 'Learned'] : rec.saved ? ['saved', 'Saved'] : ['new', 'New'];
    const book = rec.book ? bookById(rec.book) : null;
    openSheet(`<div class="shead"><span class="label">Word</span><button class="x" data-act="closeSheet" aria-label="Close">✕</button></div>
      <div class="whead"><h2 class="wword">${esc(lw)}</h2><button class="iconbtn" data-act="speakWord" aria-label="Pronounce">🔊</button><span class="stat st-${st[0]}">${st[1]}</span></div>
      <dl class="wdl">
        <div><dt>English</dt><dd>${esc(e.en)}</dd></div>
        <div><dt>In this sentence</dt><dd>${esc(e.gloss)}</dd></div>
        <div><dt>Part of speech</dt><dd>${esc(posLabel(e.pos))}</dd></div>
        ${e.lemma !== lw ? `<div><dt>Dictionary form</dt><dd>${esc(e.lemma)}${LEMMAS[e.lemma] ? ' — ' + esc(LEMMAS[e.lemma].en) : ''}</dd></div>` : ''}
      </dl>
      ${cx.text ? `<div class="note"><span class="label">Meaning in context</span><p>${esc(cx.text)}</p>${cx.note ? `<p class="small">${esc(cx.note)}</p>` : ''}</div>` : ''}
      ${ex ? `<div class="exbox"><span class="label">Example</span><p class="es">${esc(ex.es)}</p><p class="en">${esc(ex.en)}</p></div>` : ''}
      <div class="row wrap">
        <button class="btn ${rec.saved ? 'gold on' : 'primary'}" data-act="saveWord">${rec.saved ? '★ Saved to notebook' : '☆ Save to vocabulary'}</button>
        <button class="btn ${rec.learned ? 'green on' : 'ghost'}" data-act="learnWord">${rec.learned ? '✓ Learned' : 'Mark as learned'}</button>
      </div>
      <div class="row wrap small-row">
        <button class="btn ghost sm" data-act="wholeSent">Whole sentence</button>
        ${e.pos.startsWith('verb') ? `<button class="btn ghost sm" data-act="tutorVerb" data-v="${esc(e.lemma)}">Conjugation</button>` : ''}
        <button class="btn ghost sm" data-act="removeWord">${rec.saved ? 'Remove from notebook' : 'Remove highlight'}</button>
      </div>`, 'passive');
  }
  function refreshHL() { $$('.w').forEach(x => { x.classList.remove('hl-new', 'hl-saved', 'hl-learned'); const c = hlClass(x.dataset.w); if (c) x.classList.add(c); }); }

  function bindSwipe(el) {
    let x0 = 0, y0 = 0, t0 = 0;
    el.addEventListener('touchstart', e => { const t = e.changedTouches[0]; x0 = t.clientX; y0 = t.clientY; t0 = Date.now(); }, { passive: true });
    el.addEventListener('touchend', e => {
      const t = e.changedTouches[0], dx = t.clientX - x0, dy = t.clientY - y0;
      if (Math.abs(dx) > 70 && Math.abs(dy) < 45 && Date.now() - t0 < 600) dx < 0 ? ACT.nextPage() : ACT.prevPage();
    }, { passive: true });
  }

  /* ── actions ── */
  function turn(delta) {
    const b = bookById(R.book), pages = pagesOf(b, R.ch);
    let c = R.ch, p = R.page + delta;
    if (p < 0) { if (c === 0) return; c--; p = pagesOf(b, c).length; }
    if (p > pages.length) return;
    R.dir = delta > 0 ? 'next' : 'prev'; sfx('page');
    location.replace(`#/read/${b.id}/${c}/${p}`);
  }
  ACT.nextPage = () => turn(1);
  ACT.prevPage = () => turn(-1);
  ACT.nextChapter = () => { const b = bookById(R.book); R.dir = 'next'; go(`/read/${b.id}/${R.ch + 1}/0`); };
  ACT.revealPage = () => { const b = bookById(R.book); pagesOf(b, R.ch)[R.page].forEach(p => p.forEach(s => R.revealed.add(s.id))); $$('.sent .en').forEach(x => x.classList.add('show')); };
  ACT.skipQuiz = async () => {
    if (await confirmBox('Skip the quiz for now? You can still take it later from the chapter list.', 'Skip it', 'Not yet')) {
      chInfo(R.book, R.ch).skipped = true; save(); draw();
      const b = bookById(R.book); if (R.ch < b.chapters.length - 1) toast('Next chapter unlocked.');
    }
  };
  ACT.toggleBookmark = () => {
    const i = ST.bookmarks.findIndex(x => x.book === R.book && x.ch === R.ch && x.page === R.page);
    const rb = $('.ribbon');
    if (i >= 0) { ST.bookmarks.splice(i, 1); toast('Bookmark removed'); rb.classList.remove('on'); }
    else { ST.bookmarks.unshift({ book: R.book, ch: R.ch, page: R.page, ts: Date.now() }); toast('Page bookmarked'); sfx('star'); rb.classList.add('on'); rb.classList.add('pop'); setTimeout(() => rb.classList.remove('pop'), 600); }
    rb.setAttribute('aria-pressed', i < 0); save();
  };
  ACT.speakSent = () => speak(Reader.curSent.es);
  ACT.speakSlow = () => speak(Reader.curSent.es, true);
  ACT.revealSent = () => { const s = Reader.curSent; R.revealed.add(s.id); const en = $(`.sent[data-id="${s.id}"] .en`); S.mode === 'learning' && en && en.classList.add('show'); sentenceSheet(s); };
  ACT.speakWord = () => speak(R.ctxWord.lw);
  ACT.wholeSent = () => selectSentence(R.ctxWord.s.id);
  ACT.tutorSent = () => { Tutor.pending = { sentence: Reader.curSent.es }; go('/tutor'); };
  ACT.tutorVerb = (el) => { Tutor.pending = { verb: el.dataset.v }; go('/tutor'); };
  ACT.kwWord = (el) => { const lw = el.dataset.w; const s = SENTS_BY_LEMMA[LEX[lw].lemma]; R.ctxWord = { lw, s: s ? s[0] : null, idx: 0 }; const pg = pagesOf(bookById(R.book), R.ch)[R.page]; const first = pg.flat().find(x => tokens(x.es).some(t => t.lw === lw)) || (s && s[0]); R.ctxWord.s = first; R.ctxWord.idx = tokens(first.es).findIndex(t => t.lw === lw); markSel(first.id, $(`.sent[data-id="${first.id}"] .w[data-w="${lw}"]`)); if (!ST.words[lw]) { const e = lookup(lw); ST.words[lw] = { form: lw, lemma: e.lemma, pos: e.pos, en: e.gloss, lemEn: e.en, book: first.book, ch: first.ch, sid: first.id, saved: false, learned: false, review: false, streak: 0, ts: Date.now() }; save(); refreshHL(); } wordSheet(lw, first); };
  function mutateWord(fn) { const lw = R.ctxWord.lw; const w = ST.words[lw]; if (!w) return; fn(w, lw); save(); refreshHL(); wordSheet(lw, R.ctxWord.s); }
  ACT.saveWord = () => mutateWord(w => { w.saved = !w.saved; if (!w.saved) w.learned = false; else sfx('ok'); });
  ACT.learnWord = () => mutateWord(w => { w.learned = !w.learned; if (w.learned) { w.saved = true; w.review = false; sfx('ok'); } });
  ACT.removeWord = () => { const lw = R.ctxWord.lw; delete ST.words[lw]; save(); refreshHL(); closeSheet(); };
  ACT.readSettings = () => { openSheet(`<div class="shead"><span class="label">Reading settings</span><button class="x" data-act="closeSheet">✕</button></div>${Controls.html(['mode', 'assist', 'tapMode', 'esSize', 'enSize', 'lineH', 'width', 'sentHL', 'vocabHL'])}`, ''); };

  function onSheetClosed() {
    document.body.classList.remove('sheetopen');
    $$('.sent.sel,.sent.ctx,.w.cur').forEach(x => x.classList.remove('sel', 'ctx', 'cur'));
    R.sel = null;
  }
  document.addEventListener('keydown', e => {
    if (currentRoute !== 'read' || /INPUT|TEXTAREA/.test(document.activeElement.tagName)) return;
    if (e.key === 'ArrowRight') ACT.nextPage(); else if (e.key === 'ArrowLeft') ACT.prevPage(); else if (e.key === 'Escape') closeSheet();
  });
  return { render, onSheetClosed, pagesOf, prog, chInfo, unlocked, bookById, refreshHL, R, sentenceSheet, redraw: () => draw() };
})();
Routes.read = (id, c, p) => Reader.render(id, c, p);
