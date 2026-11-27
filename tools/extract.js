// usage: node tools/extract.js [forms|check]
const fs=require('fs'),path=require('path');
global.BOOKS=[]; global.registerBook=b=>BOOKS.push(b);global.extendBook=(id,ch)=>BOOKS.find(b=>b.id===id).chapters.push(...ch);
const Q=new Proxy({}, {get:(t,k)=>(...a)=>({k,a})}); global.Q=Q;
for(const f of ['book1.js','book1b.js','book2.js','book3.js','book4.js','book5.js']){const fp=path.join(__dirname,'../www/data/'+f);if(fs.existsSync(fp))eval(fs.readFileSync(fp,'utf8'));}
const sents=[];
for(const b of BOOKS)b.chapters.forEach((c,ci)=>c.text.trim().split(/\n\s*\n/).forEach(p=>p.split('\n').filter(l=>l.trim()).forEach(l=>{const [es,en,note]=l.split('##').map(s=>s.trim());sents.push({b:b.id,ci,es,en,note});})));
module.exports={BOOKS,sents};
if(require.main===module){
 const forms={};
 for(const s of sents)for(const m of s.es.matchAll(/[\p{L}\p{M}]+/gu)){const w=m[0].toLowerCase();forms[w]=(forms[w]||0)+1;}
 console.log(sents.length,'sentences;',Object.keys(forms).length,'unique forms');
 console.log(Object.keys(forms).sort((a,b)=>a.localeCompare(b,'es')).join(' '));
}
