'use strict';
/* ───────────── chapter quizzes, mistake practice and vocabulary review ───────────── */
const Quiz = (() => {
  let run = null;
  const normAns = s => stripAccents(s.toLowerCase()).replace(/[«»¿?¡!.,;:"“”'’]/g, '').replace(/\s+/g, ' ').trim();
  const rawAns = s => s.toLowerCase().replace(/[«»¿?¡!.,;:"“”'’]/g, '').replace(/\s+/g, ' ').trim();
  const bookById = id => BOOKS.find(b => b.id === id);

  function prepare(q, extra) {
    const it = { ...q, ...extra };
    if (['comp', 'vocab', 'sent'].includes(q.k)) {
      const correct = q.o[0]; it.opts = shuffle(q.o); it.correct = it.opts.indexOf(correct);
    }
    if (q.k === 'match') { it.left = shuffle(q.pairs.map((p, i) => ({ t: p[0], i }))); it.right = shuffle(q.pairs.map((p, i) => ({ t: p[1], i }))); it.pts = q.pairs.length; }
    return it;
  }
  function start(opts) {
    run = { ...opts, i: 0, pts: 0, total: 0, log: [], wordsOk: [], wordsBad: [] };
    run.total = run.items.reduce((n, it) => n + (it.k === 'match' ? it.pairs.length : 1), 0);
    run.chName = opts.title;
    ask();
  }

  function frame(inner, step) {
    const r = run, n = r.items.length;
    setMain(`<div class="quiz"><div class="qtop"><a class="iconbtn" href="${r.back}" aria-label="Leave quiz" data-act="leaveQuiz">‹</a><div class="qtitle"><b>${esc(r.title)}</b><span>${esc(r.sub || '')}</span></div><div class="qcount">${Math.min(r.i + 1, n)}/${n}</div></div>
      <div class="bar"><i style="width:${Math.round((r.i + (step ? 1 : 0)) / n * 100)}%"></i></div>${inner}</div>`);
  }
  function ask() {
    const r = run, it = r.items[r.i]; if (!it) return finish();
    let body = `<div class="qcard"><span class="kind">${esc(KIND_LABEL[it.k] || it.kind || '')}</span>`;
    if (['comp', 'vocab', 'sent'].includes(it.k)) {
      body += `<h2 class="qq">${esc(it.q)}</h2><div class="opts">${it.opts.map((o, i) => `<button class="opt" data-act="pick" data-i="${i}">${esc(o)}</button>`).join('')}</div>`;
    } else if (it.k === 'match') {
      body += `<h2 class="qq">Match each Spanish word with its English meaning.</h2><p class="small">Tap a Spanish word, then its English meaning.</p><div class="match"><div class="col" id="mL">${it.left.map(x => `<button class="opt m" data-act="mPick" data-side="L" data-i="${x.i}">${esc(x.t)}</button>`).join('')}</div><div class="col" id="mR">${it.right.map(x => `<button class="opt m" data-act="mPick" data-side="R" data-i="${x.i}">${esc(x.t)}</button>`).join('')}</div></div>`;
      it.sel = null; it.done = 0; it.err = 0;
    } else if (it.k === 'fill' || it.k === 'tr') {
      body += `<h2 class="qq">${it.k === 'tr' ? 'Translate into Spanish:' : 'Complete the sentence:'}</h2><p class="prompt">${esc(it.q)}</p>${it.hint ? `<p class="small hint">Hint: ${esc(it.hint)}</p>` : ''}
        <input class="field" id="ans" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Escribe aquí…" aria-label="Your answer"><div class="row"><button class="btn primary" data-act="check">Check answer</button><button class="btn ghost sm" data-act="accent" data-ch="á">á</button><button class="btn ghost sm" data-act="accent" data-ch="é">é</button><button class="btn ghost sm" data-act="accent" data-ch="í">í</button><button class="btn ghost sm" data-act="accent" data-ch="ó">ó</button><button class="btn ghost sm" data-act="accent" data-ch="ú">ú</button><button class="btn ghost sm" data-act="accent" data-ch="ñ">ñ</button><button class="btn ghost sm" data-act="accent" data-ch="¿">¿</button></div>`;
    } else if (it.k === 'short') {
      body += `<h2 class="qq">${esc(it.q)}</h2><textarea class="field" id="ans" rows="3" autocomplete="off" spellcheck="false" placeholder="Escribe una oración…"></textarea><div class="row"><button class="btn primary" data-act="check">Check my writing</button></div>`;
    }
    body += `</div>`;
    frame(body);
    const a = $('#ans'); if (a) { a.focus({ preventScroll: true }); a.addEventListener('keydown', e => { if (e.key === 'Enter' && a.tagName === 'INPUT') ACT.check(); }); }
  }

  function feedback(ok, html, ref, extra = {}) {
    const r = run, it = r.items[r.i];
    const refS = ref && SENT_BY_ES[ref];
    r.log.push({ k: it.k, ok, q: it.q || 'Match the words', i0: it.i0, ref });
    ST.kindStats[it.k] = ST.kindStats[it.k] || { ok: 0, bad: 0 }; ST.kindStats[it.k][ok ? 'ok' : 'bad']++;
    if (it.mode === 'chapter') {
      const idx = ST.mistakes.findIndex(m => m.b === it.b && m.c === it.c && m.i === it.i0);
      if (!ok && idx < 0) ST.mistakes.push({ b: it.b, c: it.c, i: it.i0, ts: Date.now() });
    }
    if (it.mode === 'practice' && ok) { const idx = ST.mistakes.findIndex(m => m.b === it.b && m.c === it.c && m.i === it.i0); if (idx >= 0) ST.mistakes.splice(idx, 1); }
    if (it.onAnswer) it.onAnswer(ok);
    save(); sfx(ok ? 'ok' : 'bad');
    const last = r.i >= r.items.length - 1;
    const fb = `<div class="fb ${ok ? 'good' : 'bad'}"><h3>${ok ? '¡Muy bien! ✓' : 'Not quite. Let\'s look at it together.'}</h3>${html}
      ${refS ? `<div class="refs"><span class="label">From the story</span><p class="es">${esc(refS.es)}</p><p class="en">${esc(refS.en)}</p></div>` : ''}
      <button class="btn primary big" data-act="qNext">${last ? 'See my results' : 'Next question ›'}</button></div>`;
    const card = $('.qcard'); card.insertAdjacentHTML('beforeend', fb);
    $$('.qcard button.opt, .qcard #ans, .qcard [data-act="check"], .qcard [data-act="accent"]').forEach(x => x.disabled = true);
    $('.fb').scrollIntoView({ behavior: S.anim ? 'smooth' : 'auto', block: 'nearest' });
  }

  ACT.pick = el => {
    const r = run, it = r.items[r.i]; const i = +el.dataset.i; if (it.answered) return; it.answered = true;
    const ok = i === it.correct; if (ok) r.pts++;
    $$('.opt').forEach((b, k) => { if (k === it.correct) b.classList.add('right'); else if (k === i) b.classList.add('wrong'); });
    if (it.k === 'vocab') (ok ? r.wordsOk : r.wordsBad).push(...(it.words || []));
    feedback(ok, ok ? `<p>${esc(it.why || '')}</p>` : `<p>The correct answer is <b>${esc(it.opts[it.correct])}</b>.</p><p>${esc(it.why || '')}</p>`, it.ref);
  };
  ACT.mPick = el => {
    const it = run.items[run.i]; if (el.disabled) return;
    const side = el.dataset.side, i = +el.dataset.i;
    if (side === 'L') { $$('#mL .opt').forEach(b => b.classList.remove('sel')); el.classList.add('sel'); it.sel = i; return; }
    if (it.sel === null) { toast('Tap a Spanish word first.'); return; }
    if (it.sel === i) {
      $(`#mL .opt[data-i="${i}"]`).classList.remove('sel'); $(`#mL .opt[data-i="${i}"]`).classList.add('right'); $(`#mL .opt[data-i="${i}"]`).disabled = true; el.classList.add('right'); el.disabled = true;
      sfx('ok'); run.wordsOk.push(it.pairs[i][0]); it.sel = null; it.done++;
      if (it.done === it.pairs.length) {
        const pts = Math.max(0, it.pairs.length - it.err); run.pts += pts;
        feedback(it.err === 0, it.err === 0 ? '<p>You matched every word.</p>' : `<p>You matched all the words, with ${it.err} wrong ${it.err === 1 ? 'try' : 'tries'}. Words to remember:</p><ul>${it.pairs.map(p => `<li><b>${esc(p[0])}</b> = ${esc(p[1])}</li>`).join('')}</ul>`, null);
      }
    } else {
      it.err++; const l = $(`#mL .opt[data-i="${it.sel}"]`); el.classList.add('shake'); l.classList.add('shake'); sfx('bad');
      setTimeout(() => { el.classList.remove('shake'); l.classList.remove('shake'); }, 500);
      if (!run.wordsBad.includes(it.pairs[it.sel][0])) run.wordsBad.push(it.pairs[it.sel][0]);
    }
  };
  ACT.accent = el => { const a = $('#ans'); if (!a || a.disabled) return; const p = a.selectionStart ?? a.value.length; a.value = a.value.slice(0, p) + el.dataset.ch + a.value.slice(p); a.focus(); a.setSelectionRange(p + 1, p + 1); };
  ACT.check = () => {
    const r = run, it = r.items[r.i], a = $('#ans'); if (!a || it.answered) return;
    const val = a.value.trim(); if (!val) { toast('Write your answer first.'); return; }
    it.answered = true;
    if (it.k === 'short') {
      const words = val.split(/\s+/).length, ok = words >= 2; if (ok) r.pts++;
      const bad = typedCheck(val);
      feedback(ok, ok ? `<p>Nice effort. Compare with a sample answer:</p><p class="es"><b>${esc(it.model)}</b></p>${bad.length ? `<div class="note"><span class="label">Small things to check</span>${bad.map(x => `<p>${esc(x)}</p>`).join('')}</div>` : ''}` : `<p>Try to write at least a short sentence (two words or more). A sample answer:</p><p class="es"><b>${esc(it.model)}</b></p>`, null);
      return;
    }
    const nu = normAns(val), hit = it.a.find(x => normAns(x) === nu);
    const ok = !!hit; if (ok) r.pts++;
    let html;
    if (ok) {
      const accentOff = rawAns(val) !== rawAns(hit);
      html = `<p>${esc(it.why || '')}</p>${accentOff ? `<p class="note">Watch the accents: it is written <b>${esc(hit)}</b>.</p>` : ''}`;
    } else html = `<p>A correct answer is <b>${esc(it.a[0])}</b>.</p><p>${esc(it.why || '')}</p><p class="small">You wrote: ${esc(val)}</p>`;
    feedback(ok, html, it.ref);
  };
  ACT.qNext = () => { run.i++; run.items[run.i] ? ask() : finish(); };
  ACT.leaveQuiz = async (el, e) => {
    if (run && run.i < run.items.length && !run.finished) { e.preventDefault(); if (await confirmBox('Leave this quiz? Your answers so far will not be saved.', 'Leave', 'Keep going')) { location.hash = run.back.slice(1); } }
  };

  function finish() {
    const r = run; r.finished = true;
    const pct = r.total ? Math.round(r.pts / r.total * 100) : 0;
    let msg = pct >= 85 ? '¡Excelente!' : pct >= 60 ? '¡Muy bien!' : '¡Buen intento!';
    let completion = '';
    if (r.mode === 'chapter') {
      const ci = Reader.chInfo(r.b, r.c);
      ci.done = true; ci.last = pct; ci.best = Math.max(ci.best || 0, pct); ci.attempts = (ci.attempts || 0) + 1;
      ST.quizLog.push({ book: r.b, ch: r.c, pts: r.pts, total: r.total, pct, ts: Date.now() });
      markDay(); save();
      completion = `<p class="okline">Chapter ${r.c + 1} complete ✓${r.c < bookById(r.b).chapters.length - 1 ? ' · the next chapter is unlocked' : ' · you finished the book!'}</p>`;
    } else { markDay(); save(); }
    if (pct >= 60) sfx('star');
    const bad = {}; r.log.filter(x => !x.ok).forEach(x => bad[x.k] = (bad[x.k] || 0) + 1);
    const tips = { comp: 'Re-read the chapter and look for who, what and where.', vocab: 'Save the new words in your notebook and review them.', sent: 'Tap sentences in the story and read the word-by-word breakdown.', match: 'Review the words in your notebook.', fill: 'Practice the verb forms in the Tutor.', tr: 'Try the Writing practice in the Tutor.', short: 'Write short sentences about the story in the Tutor.' };
    const uniq = [...new Set(r.wordsOk.concat(r.wordsBad))].filter(w => lookup(w));
    const wrongList = r.log.filter(x => !x.ok);
    setMain(`<div class="quiz results"><div class="qcard center">${ORNAMENT}<span class="label">${esc(r.title)}</span><h1>${msg}</h1>
      <div class="score"><b>${r.pts}</b><span>/ ${r.total}</span><em>${pct}%</em></div>${completion}
      <div class="grid2"><div class="note"><span class="label">Correct answers</span><p>${r.log.filter(x => x.ok).length} of ${r.log.length} questions</p></div>
      <div class="note"><span class="label">Areas to practice</span>${Object.keys(bad).length ? Object.keys(bad).map(k => `<p><b>${esc(KIND_LABEL[k])}</b>: ${esc(tips[k])}</p>`).join('') : '<p>Nothing! Everything went well.</p>'}</div></div>
      ${wrongList.length ? `<div class="note left"><span class="label">Questions to review</span>${wrongList.map(x => `<p>• ${esc(x.q)}</p>`).join('')}</div>` : ''}
      ${uniq.length ? `<div class="note left"><span class="label">Words in this quiz</span><div class="chips">${uniq.map(w => { const e = lookup(w); return `<span class="chip"><b>${esc(w)}</b> ${esc(e.gloss)}</span>`; }).join('')}</div><button class="btn gold" data-act="saveQuizWords">Save these words to my notebook</button></div>` : ''}
      <div class="stack">
      ${r.mode === 'chapter' && r.c < bookById(r.b).chapters.length - 1 ? `<a class="btn primary big" href="#/read/${r.b}/${r.c + 1}/0">Continue to chapter ${r.c + 2} →</a>` : ''}
      ${r.mode === 'chapter' ? `<button class="btn ghost" data-act="retryQuiz">Retake the quiz</button>` : ''}
      <a class="btn ghost" href="${r.back}">Back</a></div></div></div>`);
    r.uniq = uniq;
  }
  ACT.saveQuizWords = el => {
    let n = 0;
    for (const w of run.uniq) {
      const e = lookup(w); const s = (SENTS_BY_LEMMA[e.lemma] || [])[0];
      if (!ST.words[w]) ST.words[w] = { form: w, lemma: e.lemma, pos: e.pos, en: e.gloss, lemEn: e.en, book: s ? s.book : run.b, ch: s ? s.ch : run.c, sid: s ? s.id : '', saved: true, learned: false, review: false, streak: 0, ts: Date.now() };
      else if (!ST.words[w].saved) ST.words[w].saved = true; else continue;
      n++;
    }
    save(); el.disabled = true; el.textContent = n ? `Saved ${n} words ✓` : 'Already in your notebook ✓'; toast(n ? `${n} words saved to your notebook` : 'Those words are already saved');
  };
  ACT.retryQuiz = () => chapter(run.b, run.c);

  /* ── entry points ── */
  function chapter(bid, c) {
    const b = bookById(bid); c = +c;
    if (!b || !b.chapters[c]) return go('/library');
    const items = b.chapters[c].quiz.map((q, i) => {
      const words = q.k === 'vocab' ? (q.q.match(/"([^"]+)"/g) || []).map(x => x.replace(/"/g, '').toLowerCase()).filter(w => !w.includes(' ')) : [];
      return prepare(q, { mode: 'chapter', b: bid, c, i0: i, words });
    });
    start({ items, mode: 'chapter', b: bid, c, title: `Quiz · Chapter ${c + 1}`, sub: b.chapters[c].title, back: `#/book/${bid}` });
  }
  function mistakes() {
    const items = [];
    for (const m of ST.mistakes.slice(0, 10)) { const b = bookById(m.b); const q = b && b.chapters[m.c] && b.chapters[m.c].quiz[m.i]; if (q) items.push(prepare(q, { mode: 'practice', b: m.b, c: m.c, i0: m.i })); }
    if (!items.length) { setMain(`<div class="empty">${ORNAMENT}<h2>No mistakes to review</h2><p>Questions you miss in chapter quizzes will appear here so you can practice them again.</p><a class="btn primary" href="#/progress">Back to progress</a></div>`); return; }
    start({ items, mode: 'practice', title: 'Review your mistakes', sub: items.length + ' questions', back: '#/progress' });
  }
  function vocabReview() {
    const pool = Object.values(ST.words).filter(w => w.saved && !w.learned);
    if (pool.length < 1) { setMain(`<div class="empty">${ORNAMENT}<h2>Nothing to review yet</h2><p>Save some words from the stories first. Tap a word while reading, then choose “Save to vocabulary”.</p><a class="btn primary" href="#/notebook">Back to notebook</a></div>`); return; }
    const picked = shuffle(pool.sort((a, b) => (b.review - a.review) || (a.streak - b.streak))).slice(0, 10);
    const allGl = [...new Set(Object.values(LEX).map(e => e.gloss))];
    const items = picked.map((w, n) => {
      const upd = ok => { const rec = ST.words[w.form]; if (!rec) return; if (ok) { rec.streak = (rec.streak || 0) + 1; if (rec.streak >= 3) { rec.learned = true; rec.review = false; } } else { rec.streak = 0; rec.review = true; } };
      const sent = SENT_BY_ID[w.sid];
      if (n % 2 === 0 || pool.length < 1) {
        const wrong = shuffle(allGl.filter(g => g !== w.en && !g.includes(w.en) && g.length < 28)).slice(0, 3);
        return prepare(Q.vocab(`What does "${w.form}" mean?`, [w.en, ...wrong], sent ? sent.es : null, `"${w.form}" = ${w.en}.`), { mode: 'review', onAnswer: upd, kind: 'Vocabulary review' });
      }
      return prepare(Q.fill(`Write the Spanish word for: ${w.en}`, [w.form], sent ? sent.es : null, `In the story: "${w.form}" = ${w.en}.`, w.form[0] + ' ' + '_ '.repeat(w.form.length - 1)), { mode: 'review', onAnswer: upd, kind: 'Vocabulary review' });
    });
    start({ items, mode: 'review', title: 'Vocabulary review', sub: 'Three correct answers in a row mark a word as learned', back: '#/notebook' });
  }
  return { chapter, mistakes, vocabReview };
})();
ACT.startQuiz = el => go(`/quiz/${el.dataset.b}/${el.dataset.c}`);
Routes.quiz = (b, c) => Quiz.chapter(b, c);
Routes.review = kind => kind === 'vocab' ? Quiz.vocabReview() : Quiz.mistakes();
