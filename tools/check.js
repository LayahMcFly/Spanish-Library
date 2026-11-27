const fs=require('fs'),path=require('path');
const {BOOKS,sents}=require('./extract.js');
global.LEX={};global.LEMMAS={};global.PHRASES=[];
global.addLexicon=t=>{for(const line of t.split('\n')){const l=line.trim();if(!l||l[0]==='#')continue;const [lem,pos,en,forms]=l.split('|');const key=lem.toLowerCase();if(!LEMMAS[key])LEMMAS[key]={lemma:key,pos,en};if(!LEX[key])LEX[key]={lemma:key,pos,en,gloss:en};if(forms)for(const f of forms.split(';')){if(!f)continue;const [form,gl]=f.split('=');LEX[form.trim().toLowerCase()]={lemma:key,pos,en,gloss:(gl||en).trim()};}}};
global.addPhrases=t=>{for(const l of t.split('\n')){if(l.includes('='))PHRASES.push(l.trim())}};
for(const f of ['lexicon.js','lexicon2.js','lexicon3.js']){const fp=path.join(__dirname,'../www/data/'+f);if(fs.existsSync(fp))eval(fs.readFileSync(fp,'utf8'));}
const miss=new Set();
for(const s of sents)for(const m of s.es.matchAll(/[\p{L}\p{M}]+/gu)){const w=m[0].toLowerCase();if(!LEX[w])miss.add(w);}
console.log('missing forms:',[...miss].join(' ')||'none');
// verify refs exist
const all=new Set(sents.map(s=>s.es));let bad=0;
for(const b of BOOKS)b.chapters.forEach((c,ci)=>{for(const q of (c.quiz||[])){const ref=q.a.find(x=>typeof x==='string'&&x.length>25&&x===q.a[ q.k==='tr'||q.k==='fill'||q.k==='comp'||q.k==='vocab'||q.k==='sent'?2:99]);}});
for(const b of BOOKS)b.chapters.forEach((c,ci)=>{(c.quiz||[]).forEach((q,i)=>{let ref=null;if(['comp','vocab','sent'].includes(q.k))ref=q.a[2];if(q.k==='fill'||q.k==='tr')ref=q.a[2];if(ref&&!all.has(ref)){bad++;console.log('BAD REF',b.id,ci+1,i+1,ref);}
 if(q.k==='match')for(const [es] of q.a[0])if(!LEX[es]){console.log('match word not in lexicon',es);}});});
console.log('bad refs:',bad);
