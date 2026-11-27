'use strict';
/* ───────────── offline Spanish tutor: sentence explainer, conjugator, grammar guide, writing check ───────────── */
const U = s => s; // readability marker
const GRAMMAR = [
  { id: 'serestar', title: 'ser and estar (to be)', auto: true,
    test: s => /\b(soy|eres|es|son|somos|era|eran|está|están|estás|estoy|estaba|estaban)\b/i.test(s),
    short: 'Spanish has two verbs for "to be": ser and estar.',
    long: 'Use SER for what something is: identity, description, origin, time ("Era una mañana soleada"). Use ESTAR for how something is right now or where it is: feelings, conditions, location ("Sus ojos estaban tristes"). A good memory trick: SER = who/what it is. ESTAR = how it is now / where it is.' },
  { id: 'hay', title: 'hay / había (there is, there was)', auto: true,
    test: s => /\b(hay|había)\b/i.test(s),
    short: '"Hay" means there is / there are. "Había" means there was / there were.',
    long: '"Hay" and "había" never change for singular or plural: "Hay una rosa" and "Hay diez rosas". In the past, use "había": "Había rosas rojas". To ask a question, use "¿Hay...?" (Is there / Are there...?).' },
  { id: 'imp', title: 'Imperfect past (was ...ing, used to)', auto: true,
    test: s => tokens(s).some(t => /(aba|aban|ía|ían|íamos)$/.test(t.lw) && LEX[t.lw] && LEX[t.lw].pos.startsWith('verb') && t.lw !== 'había'),
    short: 'The imperfect describes the past as it was happening, or what used to happen again and again.',
    long: 'Imperfect endings: -ar verbs end in -aba, -abas, -aba, -ábamos, -aban. -er and -ir verbs end in -ía, -ías, -ía, -íamos, -ían. Use it for descriptions in the past ("El sol brillaba"), actions in progress ("Emilia leía un libro"), and habits ("Siempre sonreía").' },
  { id: 'pret', title: 'Preterite past (finished actions)', auto: true,
    test: s => tokens(s).some(t => /(ó|aron|ieron|ió|é|í|aste|iste)$/.test(t.lw) && LEX[t.lw] && LEX[t.lw].pos.startsWith('verb') && /(ed|ed |was|went|said|took|saw|had|made|put|gave|came|ran|sat|found|felt|woke|slept|laughed|fell|cried|read|ate|left|knew)/.test(LEX[t.lw].gloss)),
    short: 'The preterite tells what happened once and finished.',
    long: 'Preterite endings: -ar verbs: -é, -aste, -ó, -amos, -aron. -er and -ir verbs: -í, -iste, -ió, -imos, -ieron. "Isabella abrió la ventana" (she opened it, one finished action). Compare with the imperfect, which paints the background: "Un pájaro cantaba" (a bird was singing).' },
  { id: 'ira', title: 'ir a + verb (going to)', auto: true,
    test: s => /\b(voy|vas|va|vamos|van) a \p{L}+/iu.test(s),
    short: '"Voy a" + verb = I am going to do something.',
    long: 'This is the easiest way to talk about the near future. Conjugate "ir" (voy, vas, va, vamos, van) and add "a" plus the verb in its basic form: "Voy a volver" (I am going to come back), "Vamos a descubrirlo" (we are going to find out).' },
  { id: 'tenerque', title: 'tener que + verb (have to)', auto: true,
    test: s => /\b(tengo|tienes|tiene|tenemos|tienen|tuvo|tenía|tenían) que\b/i.test(s),
    short: '"Tener que" + verb = to have to do something.',
    long: '"Tengo que irme" = I have to leave. "Tienen que preguntar" = they have to ask. Do not forget "que": "tener" alone means "to have".' },
  { id: 'reflexive', title: 'Reflexive verbs (se, me, te)', auto: true,
    test: s => /\b(se|me|te) (\p{L}+)/iu.test(s) && [...s.matchAll(/\b(se|me|te) (\p{L}+)/giu)].some(m => LEX[m[2].toLowerCase()] && LEX[m[2].toLowerCase()].pos.startsWith('verb')),
    short: 'A reflexive verb has "se / me / te": the action comes back to the person.',
    long: '"Isabella se despertó" literally means "Isabella woke herself up". Common reflexive verbs: despertarse, sentarse, llamarse, reírse, quedarse, ponerse. "Me llamo Lucas" = I call myself Lucas (my name is Lucas).' },
  { id: 'gustar', title: 'gustar (to like)', auto: true,
    test: s => /\b(me|te|le|nos|les) gust(a|an)\b/i.test(s),
    short: '"Me gusta" literally means "it pleases me".',
    long: 'With gustar, the thing you like is the subject: "Me gusta el pastel" (the cake pleases me). If you like several things, use "gustan": "Me gustan las rosas".' },
  { id: 'dim', title: 'Small and cute: -ito / -ita', auto: true,
    test: s => tokens(s).some(t => /it[oa]s?$/.test(t.lw) && t.lw.length > 5 && LEX[t.lw] && /(little|kitten)/.test(LEX[t.lw].en + LEX[t.lw].gloss)),
    short: 'The ending -ito / -ita makes something small or affectionate.',
    long: 'gato → gatito (kitten), pastel → pastelito (little cake). You also hear it in names and with kindness: "abuelito" (dear grandpa).' },
  { id: 'persa', title: 'The personal "a"', auto: true,
    test: s => /\b(miró|vio|vieron|abrazó|quieren|querían|conocer|escuchó|saludaba|saludaban|cuidaba|miraron|visitar|ayudó|encontró|quiero|llamó) (a|al)\b/i.test(s),
    short: 'Put "a" before a person who receives the action.',
    long: 'Spanish adds "a" before a person (or a loved pet) that is the object of a verb: "Miró a la reina" (she looked at the queen), but "Miró el jardín" (no "a" for a thing). "A + el" becomes "al": "Miró al rey".' },
  { id: 'dneg', title: 'Double negatives', auto: true,
    test: s => /\bno\b.*\b(nadie|nunca|nada|ninguno)\b|\b(nadie|nunca)\b.*\b(nada)\b/i.test(s) || /\b(nadie dijo nada|casi nunca)\b/i.test(s),
    short: 'Spanish uses two negative words together. This is correct.',
    long: '"No dijo nada" = he said nothing (literally "he did not say nothing"). If the negative word comes first, you do not need "no": "Nadie dijo nada".' },
  { id: 'hace', title: 'hace ... que (how long ago / for how long)', auto: true,
    test: s => /\bhace\b.*\b(años|días|semanas|meses|treinta|mucho)\b/i.test(s),
    short: '"Hace treinta años que..." = it has been thirty years since...',
    long: '"Hace" + a length of time tells how long ago something happened: "Hace años que nadie viene" (no one has come for years). "Una semana después" and "hace una semana" are different: "después" = later, "hace" = ago.' },
  { id: 'gerund', title: '-ando / -iendo (doing)', auto: true,
    test: s => tokens(s).some(t => /(ando|iendo)$/.test(t.lw) && LEX[t.lw] && LEX[t.lw].pos.startsWith('verb')),
    short: '-ando / -iendo is like "-ing" in English.',
    long: '"Llegó corriendo" = he arrived running. "Siguió caminando" = she kept walking. -ar verbs use -ando (caminar → caminando). -er and -ir verbs use -iendo (correr → corriendo).' },
  { id: 'comp', title: 'Comparing: más ... que', auto: true,
    test: s => /\bmás\b.*\bque\b|\bmejor que\b|\b(más|la más|el más) \p{L}+ (del|de la)\b/iu.test(s),
    short: '"más ... que" = more ... than. "el más ..." = the most / the -est.',
    long: '"El castillo era más grande que el orfanato" = the castle was bigger than the orphanage. "La idea más bonita del mundo" = the prettiest idea in the world. "Mejor" is the special word for "better".' },
  { id: 'quepres', title: 'quiero que + special verb form', auto: true,
    test: s => /\bquiero que\b|\bquieras\b|\bvivan\b/i.test(s),
    short: 'After "querer que", Spanish uses a special verb form (the subjunctive).',
    long: '"Quiero que sean nuestros hijos" = I want them to be our children. You will study this form later. For now, learn the whole expression "quiero que + verb".' },
  { id: 'dop', title: 'Little words before the verb: lo, la, los, las', auto: true,
    test: s => [...s.matchAll(/\b(lo|la|los|las|le|les) (\p{L}+)/giu)].some(m => LEX[m[2].toLowerCase()] && LEX[m[2].toLowerCase()].pos.startsWith('verb')),
    short: '"Lo, la, los, las" before a verb mean it / him / her / them.',
    long: '"La reina los llevó" = the queen took them. "La vamos a encontrar" = we are going to find her. These little words stand for a noun you already know. They can also attach to the end of a basic verb: "descubrirlo" = descubrir + lo.' },
  { id: 'adjpos', title: 'Adjectives come after the noun', auto: true,
    test: s => { const t = tokens(s); return t.some((x, i) => i > 0 && LEX[x.lw] && LEX[x.lw].pos.startsWith('adjective') && LEX[t[i - 1].lw] && LEX[t[i - 1].lw].pos.startsWith('noun')); },
    short: 'Most adjectives go after the noun and match its gender and number.',
    long: '"una casa vieja" (an old house), "rosas rojas" (red roses). The adjective ends in -o for masculine nouns and -a for feminine ones, and adds -s for plural. A few short adjectives go before: "gran sala", "primer rey".' },
  { id: 'punct', title: 'Spanish punctuation ¿? ¡!', auto: false,
    test: s => /[¿¡]/.test(s),
    short: 'Questions and exclamations open with ¿ or ¡ and close with ? or !.',
    long: 'Spanish marks the beginning of a question or exclamation, so you know the tone before you read it: "¿Cómo te llamas?" "¡Es enorme!" Always write both marks.' },
  { id: 'gender', title: 'Gender and articles: el / la, un / una', auto: false,
    test: () => false,
    short: 'Every Spanish noun is masculine or feminine.',
    long: 'Use el / un with masculine nouns (el rey, un barco) and la / una with feminine nouns (la reina, una casa). Plural: los / las, unos / unas. Many nouns ending in -o are masculine and many ending in -a are feminine, but learn each noun with its article.' }
];

const Tutor = (() => {
  const T = { tab: 'explain', sentence: '', verb: '', prompt: 0 };
  const bookById = id => BOOKS.find(b => b.id === id);
  const PROMPTS = ['Describe your family. Who lives in your house?', 'Write about your morning. What did you do today?', 'Describe a place you love (a garden, a castle, a kitchen).', 'Write three sentences about your favorite character in the story.', 'Ask a question to a friend using ¿Cómo...? or ¿Dónde...?', 'Tell what you are going to do tomorrow (use "voy a").'];

  function topicsFor(es) { return GRAMMAR.filter(g => g.auto && g.test(es)).slice(0, 3); }

  /* ── offline writing checker ── */
  const LEXKEYS = () => Object.keys(LEX);
  function edit1(a, b) {
    if (Math.abs(a.length - b.length) > 1) return false;
    let i = 0; while (i < a.length && a[i] === b[i]) i++;
    if (a.length === b.length) return a.slice(i + 1) === b.slice(i + 1) || (a[i] === b[i + 1] && a[i + 1] === b[i] && a.slice(i + 2) === b.slice(i + 2));
    return a.length > b.length ? a.slice(i + 1) === b.slice(i) : b.slice(i + 1) === a.slice(i);
  }
  function suggest(w) {
    const s = stripAccents(w); const keys = LEXKEYS();
    const acc = keys.find(k => k !== w && stripAccents(k) === s); if (acc) return { word: acc, why: 'accent' };
    const near = keys.find(k => k.length > 3 && edit1(w, k)); if (near) return { word: near, why: 'spelling' };
    return null;
  }
  const PRON = { yo: /^(soy|estoy|tengo|voy|quiero|puedo|sé|hago|digo|veo|doy|llamo)$/, tú: /^(eres|estás|tienes|vas|quieres|puedes|sabes|haces|dices|ves|das|llamas|lees)$/, nosotros: /^(somos|estamos|tenemos|vamos|queremos|podemos|hacemos|decimos|vemos|damos|sabemos)$/ };
  const SING_ART = { el: 'm', un: 'm', la: 'f', una: 'f' }, PL_ART = { los: 'm', unos: 'm', las: 'f', unas: 'f' };
  function typedCheck(text) {
    const msgs = [];
    const sents = (text.match(/[^.!?]+[.!?]*/g) || []).map(s => s.trim()).filter(Boolean);
    sents.forEach((s, si) => {
      const tag = sents.length > 1 ? `Sentence ${si + 1}: ` : '';
      const first = s.replace(/^[¿¡"«\s]+/, '')[0];
      if (first && first !== first.toUpperCase()) msgs.push(tag + 'Start the sentence with a capital letter.');
      if (!/[.!?]["»]?$/.test(s)) msgs.push(tag + 'End the sentence with . or ? or !.');
      if ((/¿/.test(s)) !== (/\?/.test(s))) msgs.push(tag + 'Spanish questions use both ¿ at the start and ? at the end.');
      if ((/¡/.test(s)) !== (/!/.test(s))) msgs.push(tag + 'Spanish exclamations use both ¡ at the start and ! at the end.');
      const tk = tokens(s);
      tk.forEach((t, i) => {
        if (!LEX[t.lw] && !/^\d+$/.test(t.lw) && t.w[0] === t.w[0].toLowerCase() || (!LEX[t.lw] && i > 0 && t.w[0] === t.w[0].toUpperCase())) {
          if (LEX[t.lw]) return;
          const sg = suggest(t.lw);
          if (sg) msgs.push(`${tag}"${t.w}" → did you mean "${sg.word}"? (${sg.why === 'accent' ? 'check the accent' : 'check the spelling'})`);
          else if (t.w[0] === t.w[0].toLowerCase()) msgs.push(`${tag}"${t.w}" is not in the offline dictionary. It may still be correct; check it in a bigger dictionary.`);
        }
        const nx = tk[i + 1], g = nx && GENDER[nx.lw];
        if (nx && g && LEX[nx.lw] && LEX[nx.lw].pos.startsWith('noun')) {
          const pl = PL_ART[t.lw], sgl = SING_ART[t.lw];
          if ((sgl && sgl !== g) || (pl && pl !== g)) {
            const fix = { m: { la: 'el', una: 'un', las: 'los', unas: 'unos' }, f: { el: 'la', un: 'una', los: 'las', unos: 'unas' } }[g][t.lw];
            msgs.push(`${tag}"${nx.w}" is ${g === 'm' ? 'masculine' : 'feminine'}: say "${fix} ${nx.w}", not "${t.lw} ${nx.w}".`);
          }
        }
        const ad = tk[i + 1], e2 = ad && LEX[ad.lw], gn = GENDER[t.lw];
        if (gn && ad && e2 && e2.pos.startsWith('adjective') && LEX[t.lw] && LEX[t.lw].pos.startsWith('noun') && /^[\p{L}]+(o|a|os|as)$/u.test(ad.lw) && !/^(grande|grandes|gran)$/.test(ad.lw)) {
          const endsO = /o(s?)$/.test(ad.lw);
          if (gn === 'f' && endsO) msgs.push(`${tag}"${t.w}" is feminine, so the adjective should end in -a: "${ad.w.replace(/o(s?)$/, 'a$1')}".`);
          if (gn === 'm' && !endsO) msgs.push(`${tag}"${t.w}" is masculine, so the adjective should end in -o: "${ad.w.replace(/a(s?)$/, 'o$1')}".`);
        }
        if (PRON[t.lw] === undefined && ['yo', 'tú', 'nosotros'].includes(t.lw)) return;
        if (PRON[t.lw] && nx && LEX[nx.lw] && LEX[nx.lw].pos.startsWith('verb') && !PRON[t.lw].test(nx.lw) && /^(es|son|está|están|soy|eres|somos|estoy|estás|estamos|tiene|tienen|tengo|tienes|tenemos)$/.test(nx.lw)) {
          msgs.push(`${tag}After "${t.lw}", the verb needs a different ending: "${t.lw} ${{ yo: 'soy / estoy / tengo', tú: 'eres / estás / tienes', nosotros: 'somos / estamos / tenemos' }[t.lw]}".`);
        }
      });
    });
    return [...new Set(msgs)];
  }
  window.typedCheck = typedCheck;

  /* ── screens ── */
  function render() {
    const tabs = [['explain', 'Explain'], ['verbs', 'Verbs'], ['grammar', 'Grammar'], ['write', 'Write']];
    if (Tutor.pending) { const p = Tutor.pending; Tutor.pending = null; if (p.sentence) { T.tab = 'explain'; T.sentence = p.sentence; } if (p.verb) { T.tab = 'verbs'; T.verb = p.verb; } }
    setMain(`<section class="tutor"><header class="shead2"><div class="label">Tu tutor</div><h1>Spanish Tutor</h1><p class="sub">Works fully offline. It explains the story's Spanish, grammar and verbs step by step.</p></header>
      <div class="seg" role="tablist">${tabs.map(([id, l]) => `<button class="${T.tab === id ? 'on' : ''}" role="tab" data-act="tutTab" data-t="${id}">${l}</button>`).join('')}</div>
      <div id="tbody">${body()}</div></section>`);
    wire();
  }
  function body() { return { explain: explainHTML, verbs: verbsHTML, grammar: grammarHTML, write: writeHTML }[T.tab](); }

  function explainHTML() {
    const bookOpts = BOOKS.flatMap(b => b.chapters.map((c, i) => `<option value="${b.id}|${i}">${esc(b.title)} · ${i + 1}. ${esc(c.title)}</option>`)).join('');
    return `<div class="card"><label class="label" for="tsent">Type or paste a Spanish sentence</label>
      <textarea class="field" id="tsent" rows="2" spellcheck="false" placeholder="La reina abrió las puertas del castillo.">${esc(T.sentence)}</textarea>
      <div class="row wrap"><button class="btn primary" data-act="tExplain">Explain this sentence</button></div>
      <label class="label" for="tchap">…or pick one from a story</label>
      <div class="selwrap"><select class="field select" id="tchap" aria-label="Choose a chapter"><option value="">Choose a chapter…</option>${bookOpts}</select></div>
      <div id="tpick" class="picklist"></div></div><div id="texp">${T.sentence ? explanation(T.sentence) : ''}</div>`;
  }
  function explanation(es) {
    es = es.trim(); if (!es) return '';
    const known = SENT_BY_ES[es] || Object.values(SENT_BY_ID).find(s => normQ(s.es) === normQ(es));
    const bd = breakdown(es), tk = tokens(es);
    const verbs = [...new Set(tk.map(t => LEX[t.lw]).filter(e => e && e.pos.startsWith('verb')).map(e => e.lemma))];
    const unknown = tk.filter(t => !LEX[t.lw]).map(t => t.w);
    const tp = GRAMMAR.filter(g => g.test(es)).slice(0, 5);
    const clauses = es.split(/(?<=[,;:])\s+|\s+(?=(?:pero|porque|y|que|cuando|para|con)\s)/i).filter(x => x.trim());
    return `<div class="card result"><span class="label">Sentence</span><p class="sbig">${esc(es)}</p>
      <div class="row wrap"><button class="btn gold" data-act="tSpeak" data-s="${esc(es)}">🔊 Listen</button></div>
      ${known ? `<div class="enbox"><span class="label">English</span><p>${esc(known.en)}</p></div>${known.note ? `<div class="note"><span class="label">About this sentence</span><p>${esc(known.note)}</p></div>` : ''}` : `<div class="note"><span class="label">English</span><p>This sentence is not one of the story sentences, so there is no stored translation. Use the word-by-word meanings below to build the meaning yourself.</p></div>`}
      ${clauses.length > 1 ? `<div class="note"><span class="label">Read it in small pieces</span>${clauses.map(c => `<p class="es">${esc(c)}</p><p class="small">${esc(breakdown(c).map(x => x.gloss).join(' · '))}</p>`).join('')}</div>` : ''}
      <div class="note"><span class="label">Word by word</span><div class="bd">${bd.map(x => `<div class="bdrow${x.phrase ? ' ph' : ''}"><b>${esc(x.text)}</b><span>${esc(x.gloss)}${x.lemma ? ` <em>(from ${esc(x.lemma)})</em>` : ''}</span></div>`).join('')}</div>${unknown.length ? `<p class="small">Not in the offline dictionary: ${esc(unknown.join(', '))}</p>` : ''}</div>
      ${verbs.length ? `<div class="note"><span class="label">Verbs in this sentence</span><div class="chips">${verbs.map(v => `<button class="chip" data-act="tVerbGo" data-v="${esc(v)}"><b>${esc(v)}</b> ${esc(LEMMAS[v] ? LEMMAS[v].en : '')} · conjugate ›</button>`).join('')}</div></div>` : ''}
      ${tp.length ? `<div class="note"><span class="label">Grammar to notice</span>${tp.map(g => `<p><b>${esc(g.title)}.</b> ${esc(g.long)}</p>`).join('')}</div>` : ''}</div>`;
  }
  const normQ = s => stripAccents(s.toLowerCase()).replace(/[^\p{L}\s]/gu, '').replace(/\s+/g, ' ').trim();

  function verbList() {
    return Object.values(LEMMAS).filter(l => l.pos.startsWith('verb') && /(ar|er|ir|ír|se)$/.test(l.lemma) && conjugate(l.lemma)).map(l => l.lemma).sort((a, b) => a.localeCompare(b, 'es'));
  }
  function verbsHTML() {
    const vs = verbList();
    return `<div class="card"><label class="label" for="vinp">Type a verb in its basic form</label>
      <div class="row"><input class="field" id="vinp" value="${esc(T.verb)}" placeholder="hablar, comer, vivir, ser…" autocomplete="off" autocapitalize="off" spellcheck="false"><button class="btn primary" data-act="vGo">Conjugate</button></div>
      <p class="label">Verbs from the stories</p><div class="chips scroll">${vs.map(v => `<button class="chip" data-act="vPick" data-v="${esc(v)}">${esc(v)}</button>`).join('')}</div></div>
      <div id="vout">${T.verb ? verbOut(T.verb) : ''}</div>`;
  }
  function verbOut(v) {
    v = v.trim().toLowerCase(); if (!v) return '';
    const c = conjugate(v);
    if (!c) return `<div class="card note"><p>I could not conjugate "${esc(v)}". Type the verb ending in -ar, -er or -ir (for example "hablar").</p></div>`;
    const base = baseVerb(v), e = LEMMAS[v] || LEMMAS[base];
    const found = Object.entries(LEX).filter(([, x]) => x.lemma === v || x.lemma === base).map(([f, x]) => `${f} (${x.gloss})`).filter(x => !x.startsWith(v + ' '));
    return `<div class="card result"><div class="whead"><h2 class="wword">${esc(base)}</h2><button class="iconbtn" data-act="tSpeak" data-s="${esc(base)}">🔊</button></div><p>${e ? esc(e.en) : ''}${c.irregular ? ' · <b>irregular or stem-changing</b>' : ' · regular verb'}</p>
      ${v.endsWith('se') ? '<p class="small">This verb is reflexive: add me / te / se / nos / se before each form (for example "me despierto").</p>' : ''}
      ${['pres', 'pret', 'imp', 'fut'].map(t => `<div class="tense"><span class="label">${esc(TENSE_LABEL[t])}</span><table>${PERSONS.map((p, i) => `<tr><th>${p}</th><td>${esc(c.forms[t][i])}</td></tr>`).join('')}</table></div>`).join('')}
      <p class="small">Forms for "vosotros" are left out because the stories use "ustedes".</p>
      ${found.length ? `<div class="note"><span class="label">Forms found in the stories</span><p>${esc(found.join(', '))}</p></div>` : ''}</div>`;
  }

  function grammarHTML() {
    return `<div class="card"><p>Tap a topic. Each one shows a short rule and examples from the stories.</p></div>` + GRAMMAR.map(g => {
      const ex = Object.values(SENT_BY_ID).filter(s => g.test(s.es)).slice(0, 2);
      return `<details class="gtopic"><summary>${esc(g.title)}</summary><p>${esc(g.long)}</p>${ex.map(s => `<div class="exbox"><p class="es">${esc(s.es)}</p><p class="en">${esc(s.en)}</p></div>`).join('')}</details>`;
    }).join('');
  }

  function writeHTML() {
    return `<div class="card"><span class="label">Writing practice</span><p class="prompt">${esc(PROMPTS[T.prompt])}</p><div class="row wrap"><button class="btn ghost sm" data-act="wPrompt">New prompt</button></div>
      <textarea class="field" id="wtxt" rows="5" spellcheck="false" placeholder="Escribe aquí en español…"></textarea>
      <div class="row wrap"><button class="btn primary" data-act="wCheck">Check my writing</button>${['á', 'é', 'í', 'ó', 'ú', 'ñ', '¿', '¡'].map(c => `<button class="btn ghost sm" data-act="wChar" data-ch="${c}">${c}</button>`).join('')}</div>
      <p class="small">This checker works offline. It looks for capitals, punctuation, accents, spelling of words in the offline dictionary, and basic gender and verb agreement. It cannot judge style or meaning, so treat it as a helper.</p></div><div id="wout"></div>
      ${ST.writing.length ? `<div class="card"><span class="label">Your recent writing</span>${ST.writing.slice(0, 3).map(w => `<p class="es">${esc(w.text)}</p>`).join('')}</div>` : ''}`;
  }

  function wire() {
    const sel = $('#tchap');
    if (sel) sel.addEventListener('change', () => {
      const [bid, ci] = sel.value.split('|'); const p = $('#tpick'); if (!bid) { p.innerHTML = ''; return; }
      const ch = bookById(bid).chapters[+ci];
      p.innerHTML = ch.paras.flat().map(s => `<button class="pick" data-act="tPickS" data-id="${s.id}">${esc(s.es)}</button>`).join('');
    });
    const vi = $('#vinp'); if (vi) vi.addEventListener('keydown', e => { if (e.key === 'Enter') ACT.vGo(); });
  }
  ACT.tutTab = el => { T.tab = el.dataset.t; render(); };
  ACT.tExplain = () => { T.sentence = $('#tsent').value; $('#texp').innerHTML = explanation(T.sentence) || '<div class="card note"><p>Type a sentence first.</p></div>'; $('#texp').scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  ACT.tPickS = el => { T.sentence = SENT_BY_ID[el.dataset.id].es; $('#tsent').value = T.sentence; ACT.tExplain(); };
  ACT.tSpeak = el => speak(el.dataset.s);
  ACT.tVerbGo = el => { T.tab = 'verbs'; T.verb = el.dataset.v; render(); };
  ACT.vPick = el => { T.verb = el.dataset.v; $('#vinp').value = T.verb; $('#vout').innerHTML = verbOut(T.verb); $('#vout').scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  ACT.vGo = () => { T.verb = $('#vinp').value; $('#vout').innerHTML = verbOut(T.verb); };
  ACT.wPrompt = () => { T.prompt = (T.prompt + 1) % PROMPTS.length; render(); };
  ACT.wChar = el => { const a = $('#wtxt'); const p = a.selectionStart; a.value = a.value.slice(0, p) + el.dataset.ch + a.value.slice(p); a.focus(); a.setSelectionRange(p + 1, p + 1); };
  ACT.wCheck = () => {
    const t = $('#wtxt').value.trim(); if (!t) { toast('Write a sentence first.'); return; }
    const m = typedCheck(t), tk = tokens(t), known = tk.filter(x => LEX[x.lw]).length;
    ST.writing.unshift({ ts: Date.now(), text: t }); ST.writing = ST.writing.slice(0, 20); markDay(); save();
    $('#wout').innerHTML = `<div class="card result"><span class="label">Feedback</span>${m.length ? `<ul class="fixlist">${m.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : '<p class="okline">¡Muy bien! I did not find anything to fix with the offline checks.</p>'}<p class="small">${known} of ${tk.length} words were recognized by the dictionary.</p></div>`;
    sfx(m.length ? 'tap' : 'ok');
  };
  return { render, topicsFor, pending: null };
})();
Routes.tutor = () => Tutor.render();
