'use strict';
/* ───────────── story/dictionary data API (loaded before the data files) ───────────── */
const BOOKS = [], LEX = {}, LEMMAS = {}, PHRASES = [];
const WORD_RE = /[\p{L}\p{M}]+/gu;

const Q = {
  comp: (q, o, ref, why) => ({ k: 'comp', q, o, ref, why }),
  vocab: (q, o, ref, why) => ({ k: 'vocab', q, o, ref, why }),
  sent: (q, o, ref, why) => ({ k: 'sent', q, o, ref, why }),
  match: pairs => ({ k: 'match', pairs }),
  fill: (q, a, ref, why, hint) => ({ k: 'fill', q, a, ref, why, hint }),
  tr: (q, a, ref, why) => ({ k: 'tr', q, a, ref, why }),
  short: (q, model) => ({ k: 'short', q, model })
};
const KIND_LABEL = { comp: 'Reading comprehension', vocab: 'Vocabulary', sent: 'Sentence meaning', match: 'Vocabulary matching', fill: 'Writing: complete the sentence', tr: 'Translation practice', short: 'Short writing' };

function parseChapter(c) {
  c.paras = c.text.trim().split(/\n\s*\n/).map(p => p.split('\n').filter(l => l.trim()).map(l => {
    const [es, en, note] = l.split('##').map(s => s.trim());
    return { es, en, note: note || '' };
  }));
  delete c.text;
  if (!c.quiz) c.quiz = autoQuiz(c);
}

/* Builds a full chapter quiz from the chapter's own sentences and the lexicon.
   Hand-written reading questions come from c.qs = [[question, correct, wrong1, wrong2, wrong3, 'text from the sentence that proves it']] */
function autoQuiz(c) {
  const S = c.paras.flat();
  let seed = 7; for (const ch of c.title) seed = (seed * 31 + ch.charCodeAt(0)) % 100003;
  const rnd = () => (seed = (seed * 48271) % 2147483647) / 2147483647;
  const pick = (arr, n, skip) => { const a = arr.filter(x => !skip || !skip.includes(x)).slice(); const out = []; while (a.length && out.length < n) out.push(a.splice(Math.floor(rnd() * a.length), 1)[0]); return out; };
  const wordsOf = s => (s.es.match(WORD_RE) || []);
  const content = new Set(['noun', 'verb', 'adjective', 'adverb']);
  const quiz = [];
  (c.qs || []).forEach(([q, ok, a, b, d, ref]) => {
    const s = S.find(x => x.es.includes(ref));
    if (!s) throw new Error('quiz ref not found: ' + ref);
    quiz.push(Q.comp(q, [ok, a, b, d], s.es, s.en));
  });
  // sentence meaning ×2
  const mids = S.filter(s => { const n = wordsOf(s).length; return n >= 5 && n <= 14; });
  pick(mids, 2).forEach(s => {
    const bad = pick(S.filter(x => x !== s && x.en.length > 12), 3).map(x => x.en);
    quiz.push(Q.sent(`Choose the correct English translation of: "${s.es}"`, [s.en, ...bad], s.es, s.note || 'Compare each Spanish word with the English line under the sentence.'));
  });
  // vocabulary candidates
  const cand = [], seen = new Set();
  S.forEach(s => wordsOf(s).forEach((w, i) => {
    const lw = w.toLowerCase(), e = LEX[lw];
    if (!e || !content.has(e.pos) || seen.has(e.lemma) || lw.length < 4 || i === 0 && /^[A-ZÁÉÍÓÚÑ]/.test(w) && e.pos === 'proper noun') return;
    if ((e.gloss || '').length > 26) return;
    seen.add(e.lemma); cand.push({ w: lw, e, s });
  }));
  const allGloss = pos => Object.values(LEX).filter(x => x.pos === pos && (x.gloss || '').length < 26).map(x => x.gloss);
  pick(cand, 2).forEach(({ w, e, s }) => {
    const lead = g => (g.match(/^(I|he\/she|we|they|you|to|a|an|the)\s/) || [])[1] || '';
    let pool = [...new Set(allGloss(e.pos))].filter(g => g !== e.gloss);
    const same = pool.filter(g => lead(g) === lead(e.gloss) && !/[?!\/]/.test(g.replace('he/she', '')));
    if (same.length >= 3) pool = same;
    const bad = pick(pool, 3);
    quiz.push(Q.vocab(`What does "${w}" mean?`, [e.gloss, ...bad], s.es, `"${w}" ${w === e.lemma ? 'is' : 'comes from'} "${e.lemma}": ${e.en}.`));
  });
  // matching ×4
  const m = pick(cand.filter(x => x.e.gloss.length < 20), 4);
  if (m.length === 4) quiz.push(Q.match(m.map(x => [x.w, x.e.gloss])));
  // fill in the blank
  const fillable = S.filter(s => { const n = wordsOf(s).length; return n >= 4 && n <= 10; }).map(s => ({ s, hit: cand.find(x => x.s === s) })).filter(x => x.hit);
  const f = pick(fillable, 1)[0];
  if (f) {
    const w = f.hit.w; let done = false;
    const blank = f.s.es.replace(WORD_RE, t => (!done && t.toLowerCase() === w) ? (done = true, '___') : t);
    quiz.push(Q.fill(`${blank} (${f.hit.e.gloss})`, [w], f.s.es, `"${w}" = ${f.hit.e.gloss}.`, `Starts with "${w[0]}"`));
  }
  quiz.push(Q.short(c.prompt || 'In one short sentence (Spanish or English), say what happens in this chapter.', c.summary));
  return quiz;
}
function registerBook(b) { b.chapters.forEach(parseChapter); BOOKS.push(b); }
function extendBook(id, chs) { const b = BOOKS.find(x => x.id === id); chs.forEach(parseChapter); b.chapters.push(...chs); }

function addLexicon(text) {
  for (const line of text.split('\n')) {
    const l = line.trim(); if (!l || l[0] === '#') continue;
    const [lem, pos, en, forms] = l.split('|');
    const key = lem.toLowerCase();
    if (!LEMMAS[key]) LEMMAS[key] = { lemma: key, pos, en };
    if (!LEX[key]) LEX[key] = { lemma: key, pos, en, gloss: en };
    if (forms) for (const f of forms.split(';')) {
      if (!f) continue;
      const [form, gl] = f.split('=');
      LEX[form.trim().toLowerCase()] = { lemma: key, pos, en, gloss: (gl || en).trim() };
    }
  }
}
function addPhrases(text) {
  for (const l of text.split('\n')) {
    if (!l.includes('=')) continue;
    const [p, g] = l.split('=');
    PHRASES.push({ toks: p.trim().toLowerCase().split(/\s+/), gloss: g.trim() });
  }
  PHRASES.sort((a, b) => b.toks.length - a.toks.length);
}

const SENT_BY_ID = {}, SENT_BY_ES = {}, SENTS_BY_LEMMA = {}, GENDER = {};
function finalizeBooks() {
  const art = { el: 'm', los: 'm', un: 'm', unos: 'm', la: 'f', las: 'f', una: 'f', unas: 'f' };
  for (const b of BOOKS) {
    let words = 0, sents = 0;
    b.chapters.forEach((c, ci) => {
      c.nSent = 0; c.nWords = 0;
      c.paras.forEach(p => p.forEach((s, si) => {
        s.id = `${b.id}.${ci}.${c.nSent}`; s.book = b.id; s.ch = ci;
        SENT_BY_ID[s.id] = s; SENT_BY_ES[s.es] = s;
        const tk = tokens(s.es);
        c.nWords += tk.length; c.nSent++;
        tk.forEach((t, i) => {
          const e = LEX[t.lw];
          if (e) { (SENTS_BY_LEMMA[e.lemma] = SENTS_BY_LEMMA[e.lemma] || []).length < 8 && SENTS_BY_LEMMA[e.lemma].push(s); }
          if (i > 0 && art[tk[i - 1].lw] && e && e.pos.startsWith('noun')) GENDER[t.lw] = art[tk[i - 1].lw];
        });
      }));
      words += c.nWords; sents += c.nSent;
    });
    b.nWords = words; b.nSents = sents;
    b.minutes = Math.max(5, Math.round(words / 45));   // learner pace incl. translations
  }
  Object.assign(GENDER, { casa: 'f', mano: 'f', día: 'm', mapa: 'm', problema: 'm', idea: 'f' });
}

/* ── tokenising & lookup ── */
function tokens(es) { return [...es.matchAll(WORD_RE)].map(m => ({ w: m[0], lw: m[0].toLowerCase(), i: m.index })); }
function lookup(w) { return LEX[w.toLowerCase()] || null; }
function phraseAt(lws, i) {
  for (const p of PHRASES) {
    if (p.toks.every((t, k) => lws[i + k] === t)) return p;
  }
  return null;
}
/* word-by-word breakdown, merging known expressions */
function breakdown(es) {
  const tk = tokens(es), lws = tk.map(t => t.lw), out = [];
  for (let i = 0; i < tk.length;) {
    const p = phraseAt(lws, i);
    if (p) { out.push({ text: tk.slice(i, i + p.toks.length).map(t => t.w).join(' '), gloss: p.gloss, phrase: true }); i += p.toks.length; continue; }
    const e = LEX[tk[i].lw];
    out.push({ text: tk[i].w, gloss: e ? e.gloss : '?', lemma: e && e.lemma !== tk[i].lw ? e.lemma : '' });
    i++;
  }
  return out;
}
/* expression in this sentence that contains token index i, if any */
function phraseContaining(es, idx) {
  const tk = tokens(es), lws = tk.map(t => t.lw);
  for (let i = 0; i < tk.length; i++) {
    const p = phraseAt(lws, i);
    if (p && idx >= i && idx < i + p.toks.length) return { text: tk.slice(i, i + p.toks.length).map(t => t.w).join(' '), gloss: p.gloss };
  }
  return null;
}
const POS_LABEL = { noun: 'Noun', verb: 'Verb', adjective: 'Adjective', adverb: 'Adverb', preposition: 'Preposition', conjunction: 'Conjunction', article: 'Article', pronoun: 'Pronoun', possessive: 'Possessive', demonstrative: 'Demonstrative', number: 'Number', interjection: 'Interjection', 'proper noun': 'Proper noun', 'question word': 'Question word' };
function posLabel(p) { return p.split(' / ').map(x => POS_LABEL[x] || x[0].toUpperCase() + x.slice(1)).join(' / '); }

/* example sentence for a word: another sentence using the same dictionary word, else the given one */
function exampleFor(form, current) {
  const e = lookup(form); if (!e) return current;
  const list = SENTS_BY_LEMMA[e.lemma] || [];
  return list.find(s => s !== current && s.es !== (current && current.es)) || current;
}

/* ───────────── conjugation (regular rules + common irregulars) ───────────── */
const PERSONS = ['yo', 'tú', 'él / ella / usted', 'nosotros', 'ellos / ustedes'];
const IRR = {
  ser: { pres: 'soy eres es somos son', pret: 'fui fuiste fue fuimos fueron', imp: 'era eras era éramos eran', fut: 'seré serás será seremos serán' },
  estar: { pres: 'estoy estás está estamos están', pret: 'estuve estuviste estuvo estuvimos estuvieron', imp: 'estaba estabas estaba estábamos estaban', fut: 'estaré estarás estará estaremos estarán' },
  ir: { pres: 'voy vas va vamos van', pret: 'fui fuiste fue fuimos fueron', imp: 'iba ibas iba íbamos iban', fut: 'iré irás irá iremos irán' },
  tener: { pres: 'tengo tienes tiene tenemos tienen', pret: 'tuve tuviste tuvo tuvimos tuvieron', imp: 'tenía tenías tenía teníamos tenían', fut: 'tendré tendrás tendrá tendremos tendrán' },
  hacer: { pres: 'hago haces hace hacemos hacen', pret: 'hice hiciste hizo hicimos hicieron', imp: 'hacía hacías hacía hacíamos hacían', fut: 'haré harás hará haremos harán' },
  poder: { pres: 'puedo puedes puede podemos pueden', pret: 'pude pudiste pudo pudimos pudieron', imp: 'podía podías podía podíamos podían', fut: 'podré podrás podrá podremos podrán' },
  querer: { pres: 'quiero quieres quiere queremos quieren', pret: 'quise quisiste quiso quisimos quisieron', imp: 'quería querías quería queríamos querían', fut: 'querré querrás querrá querremos querrán' },
  decir: { pres: 'digo dices dice decimos dicen', pret: 'dije dijiste dijo dijimos dijeron', imp: 'decía decías decía decíamos decían', fut: 'diré dirás dirá diremos dirán' },
  ver: { pres: 'veo ves ve vemos ven', pret: 'vi viste vio vimos vieron', imp: 'veía veías veía veíamos veían', fut: 'veré verás verá veremos verán' },
  dar: { pres: 'doy das da damos dan', pret: 'di diste dio dimos dieron', imp: 'daba dabas daba dábamos daban', fut: 'daré darás dará daremos darán' },
  saber: { pres: 'sé sabes sabe sabemos saben', pret: 'supe supiste supo supimos supieron', imp: 'sabía sabías sabía sabíamos sabían', fut: 'sabré sabrás sabrá sabremos sabrán' },
  venir: { pres: 'vengo vienes viene venimos vienen', pret: 'vine viniste vino vinimos vinieron', imp: 'venía venías venía veníamos venían', fut: 'vendré vendrás vendrá vendremos vendrán' },
  poner: { pres: 'pongo pones pone ponemos ponen', pret: 'puse pusiste puso pusimos pusieron', imp: 'ponía ponías ponía poníamos ponían', fut: 'pondré pondrás pondrá pondremos pondrán' },
  salir: { pres: 'salgo sales sale salimos salen', pret: 'salí saliste salió salimos salieron', imp: 'salía salías salía salíamos salían', fut: 'saldré saldrás saldrá saldremos saldrán' },
  oler: { pres: 'huelo hueles huele olemos huelen', pret: 'olí oliste olió olimos olieron', imp: 'olía olías olía olíamos olían', fut: 'oleré olerás olerá oleremos olerán' },
  reír: { pres: 'río ríes ríe reímos ríen', pret: 'reí reíste rió reímos rieron', imp: 'reía reías reía reíamos reían', fut: 'reiré reirás reirá reiremos reirán' },
  sonreír: { pres: 'sonrío sonríes sonríe sonreímos sonríen', pret: 'sonreí sonreíste sonrió sonreímos sonrieron', imp: 'sonreía sonreías sonreía sonreíamos sonreían', fut: 'sonreiré sonreirás sonreirá sonreiremos sonreirán' },
  leer: { pres: 'leo lees lee leemos leen', pret: 'leí leíste leyó leímos leyeron', imp: 'leía leías leía leíamos leían', fut: 'leeré leerás leerá leeremos leerán' },
  seguir: { pres: 'sigo sigues sigue seguimos siguen', pret: 'seguí seguiste siguió seguimos siguieron', imp: 'seguía seguías seguía seguíamos seguían', fut: 'seguiré seguirás seguirá seguiremos seguirán' },
  caer: { pres: 'caigo caes cae caemos caen', pret: 'caí caíste cayó caímos cayeron', imp: 'caía caías caía caíamos caían', fut: 'caeré caerás caerá caeremos caerán' }
};
const STEM = { pensar: ['e', 'ie'], empezar: ['e', 'ie'], sentir: ['e', 'ie'], volver: ['o', 'ue'], dormir: ['o', 'ue'], encontrar: ['o', 'ue'], contar: ['o', 'ue'], jugar: ['u', 'ue'], mover: ['o', 'ue'], probar: ['o', 'ue'], recordar: ['o', 'ue'], mostrar: ['o', 'ue'], pedir: ['e', 'i'], repetir: ['e', 'i'], seguir: ['e', 'i'], demostrar: ['o', 'ue'], cerrar: ['e', 'ie'], entender: ['e', 'ie'], encender: ['e', 'ie'], morir: ['o', 'ue'], apretar: ['e', 'ie'], temblar: ['e', 'ie'], despertar: ['e', 'ie'], mentir: ['e', 'ie'], perder: ['e', 'ie'], costar: ['o', 'ue'], llover: ['o', 'ue'], acostar: ['o', 'ue'] };
function baseVerb(v) { return v.endsWith('se') ? v.slice(0, -2) : v; }
function conjugate(inf) {
  inf = baseVerb(inf.toLowerCase());
  const irr = IRR[inf];
  if (irr) { const o = {}; for (const t in irr) o[t] = irr[t].split(' '); return { irregular: true, forms: o }; }
  const end = inf.slice(-2), stem = inf.slice(0, -2);
  if (!['ar', 'er', 'ir'].includes(end)) return null;
  const sc = STEM[inf];
  const stemOf = (i) => {   // i: person index 0..4; present stem change for 0,1,2,4
    if (!sc || i === 3) return stem;
    const idx = stem.lastIndexOf(sc[0]);
    return idx < 0 ? stem : stem.slice(0, idx) + sc[1] + stem.slice(idx + sc[0].length);
  };
  const E = { ar: { pres: ['o', 'as', 'a', 'amos', 'an'], pret: ['é', 'aste', 'ó', 'amos', 'aron'], imp: ['aba', 'abas', 'aba', 'ábamos', 'aban'] }, er: { pres: ['o', 'es', 'e', 'emos', 'en'], pret: ['í', 'iste', 'ió', 'imos', 'ieron'], imp: ['ía', 'ías', 'ía', 'íamos', 'ían'] }, ir: { pres: ['o', 'es', 'e', 'imos', 'en'], pret: ['í', 'iste', 'ió', 'imos', 'ieron'], imp: ['ía', 'ías', 'ía', 'íamos', 'ían'] } };
  const e = E[end];
  const forms = { pres: [], pret: [], imp: [], fut: [] };
  for (let i = 0; i < 5; i++) forms.pres.push(stemOf(i) + e.pres[i]);
  for (let i = 0; i < 5; i++) {
    let st = stem, suf = e.pret[i];
    if (end === 'ar' && i === 0) { if (stem.endsWith('c')) st = stem.slice(0, -1) + 'qu'; else if (stem.endsWith('g')) st = stem + 'u'; else if (stem.endsWith('z')) st = stem.slice(0, -1) + 'c'; }
    if (end === 'ir' && sc && (i === 2 || i === 4)) { const idx = stem.lastIndexOf(sc[0]); const rep = sc[1] === 'ue' ? 'u' : 'i'; if (idx >= 0) st = stem.slice(0, idx) + rep + stem.slice(idx + 1); }
    forms.pret.push(st + suf);
  }
  for (let i = 0; i < 5; i++) forms.imp.push(stem + e.imp[i]);
  const fe = ['é', 'ás', 'á', 'emos', 'án'];
  for (let i = 0; i < 5; i++) forms.fut.push(inf + fe[i]);
  return { irregular: !!sc, forms };
}
const TENSE_LABEL = { pres: 'Present (what happens now)', pret: 'Preterite (finished past action)', imp: 'Imperfect (past, ongoing or repeated)', fut: 'Future (what will happen)' };
