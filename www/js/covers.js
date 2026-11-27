'use strict';
/* ───────────── illustrated storybook covers (inline SVG, no external images) ───────────── */
const COVERS = {
  castle: `<svg viewBox="0 0 300 420" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Castle among roses">
  <defs><linearGradient id="c1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a1630"/><stop offset=".6" stop-color="#8a3550"/><stop offset="1" stop-color="#d89aa6"/></linearGradient></defs>
  <rect width="300" height="420" fill="url(#c1)"/>
  <g fill="#f4d98a"><path d="M60 70l4 9 10 1-8 6 3 10-9-6-9 6 3-10-8-6 10-1z" opacity=".9"/><circle cx="230" cy="60" r="2.5"/><circle cx="120" cy="40" r="2"/><circle cx="250" cy="110" r="2"/><circle cx="40" cy="140" r="2"/><circle cx="200" cy="30" r="1.6"/><path d="M240 90l3 6 7 1-5 5 2 7-7-4-6 4 2-7-5-5 7-1z" opacity=".8"/></g>
  <circle cx="215" cy="150" r="30" fill="#fbe9b7" opacity=".9"/>
  <g fill="#3a1226"><rect x="95" y="190" width="110" height="110"/><rect x="80" y="160" width="36" height="140"/><rect x="184" y="160" width="36" height="140"/><rect x="128" y="150" width="44" height="150"/>
  <path d="M80 160l18-34 18 34zM184 160l18-34 18 34zM128 150l22-44 22 44z"/>
  <path d="M95 190h12v-10h12v10h12v-10h12v10h12v-10h12v10h12v-10h12v10h12v-10h12v10" fill="none"/></g>
  <g fill="#f4d98a"><rect x="141" y="190" width="18" height="26" rx="9"/><rect x="92" y="196" width="10" height="18" rx="5"/><rect x="198" y="196" width="10" height="18" rx="5"/><rect x="144" y="258" width="12" height="42" rx="6"/></g>
  <path d="M150 106v-22" stroke="#f4d98a" stroke-width="3"/><path d="M150 84l22 6-22 7z" fill="#e8b4bc"/>
  <path d="M0 330q75-30 150-8t150-12v110H0z" fill="#2b0f1f"/>
  <g>${[[30,360],[70,380],[110,365],[190,372],[235,360],[270,382],[150,392]].map(([x,y],i)=>`<g transform="translate(${x} ${y})"><circle r="${10+(i%3)*2}" fill="${i%2?'#e8a3b0':'#c9546f'}"/><circle r="5" fill="#fbe9b7" opacity=".5"/><path d="M-12 6q-8 0-10 8q8 0 10-8" fill="#4b7a56"/></g>`).join('')}</g>
  <rect x="10" y="10" width="280" height="400" fill="none" stroke="#f4d98a" stroke-width="2" rx="6"/><rect x="18" y="18" width="264" height="384" fill="none" stroke="#f4d98a" stroke-width=".8" rx="4" opacity=".7"/></svg>`,
  mill: `<svg viewBox="0 0 300 420" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Old mill with a cat under the moon">
  <defs><linearGradient id="m1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2c2150"/><stop offset=".7" stop-color="#6e5a9c"/><stop offset="1" stop-color="#d7b5c8"/></linearGradient></defs>
  <rect width="300" height="420" fill="url(#m1)"/>
  <circle cx="225" cy="95" r="38" fill="#fbf0cf"/><circle cx="212" cy="86" r="6" fill="#efe0b0" opacity=".7"/><circle cx="238" cy="106" r="4" fill="#efe0b0" opacity=".7"/>
  <g fill="#fbf0cf"><circle cx="50" cy="60" r="2"/><circle cx="110" cy="35" r="2.4"/><circle cx="160" cy="70" r="1.6"/><circle cx="270" cy="40" r="2"/><circle cx="30" cy="130" r="1.6"/></g>
  <path d="M0 330q80-40 160-10t140-5v105H0z" fill="#241a3d"/>
  <g transform="translate(95 150)"><path d="M10 180L30 40h60l20 140z" fill="#4a3a6e"/><path d="M20 40l40-40 40 40z" fill="#8a3550"/><rect x="50" y="110" width="22" height="70" rx="11" fill="#f4d98a"/><rect x="44" y="64" width="14" height="22" rx="7" fill="#f4d98a"/><rect x="66" y="64" width="14" height="22" rx="7" fill="#f4d98a"/>
  <g transform="translate(60 40)"><g id="bl" fill="#e9d9f0" stroke="#3a2a5a" stroke-width="2"><rect x="-6" y="-92" width="12" height="92"/><rect x="-6" y="0" width="12" height="92"/><rect x="-92" y="-6" width="92" height="12"/><rect x="0" y="-6" width="92" height="12"/></g><circle r="9" fill="#8a3550"/></g></g>
  <g transform="translate(200 335)"><ellipse cx="0" cy="10" rx="30" ry="22" fill="#1b1330"/><circle cx="-10" cy="-18" r="16" fill="#1b1330"/><path d="M-22-28l4-14 10 9zM2-28l-4-14-10 9z" fill="#1b1330"/><circle cx="-16" cy="-19" r="3" fill="#f4d98a"/><circle cx="-4" cy="-19" r="3" fill="#f4d98a"/><path d="M28 12q24 0 14-28" stroke="#1b1330" stroke-width="7" fill="none" stroke-linecap="round"/></g>
  <rect x="10" y="10" width="280" height="400" fill="none" stroke="#f4d98a" stroke-width="2" rx="6"/><rect x="18" y="18" width="264" height="384" fill="none" stroke="#f4d98a" stroke-width=".8" rx="4" opacity=".7"/></svg>`
};
/* generic storybook cover: sky gradient + one motif + gold frame */
const MOTIFS = {
  sun: '<circle cx="150" cy="170" r="52" fill="#fbe9b7"/><g stroke="#fbe9b7" stroke-width="5" stroke-linecap="round">' + [0,45,90,135,180,225,270,315].map(a => `<path d="M150 170 m${Math.round(66*Math.cos(a*Math.PI/180))} ${Math.round(66*Math.sin(a*Math.PI/180))} l${Math.round(22*Math.cos(a*Math.PI/180))} ${Math.round(22*Math.sin(a*Math.PI/180))}"/>`).join('') + '</g><path d="M0 330q80-40 150-10t150-10v110H0z" fill="#00000033"/>',
  moon: '<circle cx="200" cy="130" r="48" fill="#fbf0cf"/><circle cx="222" cy="116" r="42" fill="var(--c1)"/><path d="M0 320q75-30 150-8t150-12v120H0z" fill="#00000040"/><rect x="60" y="250" width="180" height="14" rx="4" fill="#00000055"/><rect x="80" y="214" width="34" height="38" fill="#00000055"/><rect x="190" y="200" width="34" height="52" fill="#00000055"/>',
  sea: '<circle cx="215" cy="110" r="34" fill="#fbe9b7"/><path d="M0 250q38-18 75 0t75 0 75 0 75 0v170H0z" fill="#00000030"/><path d="M0 285q38-18 75 0t75 0 75 0 75 0v135H0z" fill="#00000045"/><rect x="138" y="130" width="24" height="120" fill="#f6ecd8"/><path d="M132 130h36l-6-20h-24z" fill="#8a3550"/><rect x="144" y="150" width="12" height="16" fill="#f4d98a"/>',
  tree: '<circle cx="150" cy="170" r="78" fill="#00000040"/><circle cx="110" cy="190" r="48" fill="#00000038"/><circle cx="195" cy="195" r="46" fill="#00000038"/><rect x="141" y="230" width="18" height="110" fill="#2b0f1f"/><g fill="#f4d98a">' + [[110,150],[160,120],[200,170],[135,190],[175,215],[95,205]].map(([x,y]) => `<circle cx="${x}" cy="${y}" r="5"/>`).join('') + '</g>',
  key: '<g fill="none" stroke="#f4d98a" stroke-width="10" stroke-linecap="round"><circle cx="150" cy="140" r="38"/><path d="M150 178v140M150 270h30M150 300h22"/></g><circle cx="150" cy="140" r="12" fill="#f4d98a"/>',
  lantern: '<path d="M150 60v40" stroke="#f4d98a" stroke-width="4"/><path d="M115 100h70l10 20v90q0 30-45 30t-45-30v-90z" fill="#2b0f1f"/><path d="M125 125h50v85q0 18-25 18t-25-18z" fill="#fbe9b7"/><circle cx="150" cy="190" r="70" fill="#fbe9b7" opacity=".18"/><path d="M0 330q75-30 150-8t150-12v110H0z" fill="#00000050"/>',
  mountain: '<path d="M0 330L90 170l50 70 50-110 110 200z" fill="#00000040"/><path d="M-10 350L110 200l60 80 40-60 100 130z" fill="#00000055"/><path d="M190 130l-24 40 16-8 8 12 8-12 16 8z" fill="#fbf0cf"/><circle cx="70" cy="90" r="22" fill="#fbe9b7"/>',
  bird: '<path d="M70 190q40-70 80-10 40-60 80 10-40-20-80 20-40-40-80-20z" fill="#f4d98a"/><path d="M0 330q75-30 150-8t150-12v110H0z" fill="#00000045"/><g fill="#fbf0cf"><circle cx="60" cy="90" r="2.4"/><circle cx="240" cy="70" r="2"/><circle cx="120" cy="60" r="1.8"/></g>',
  book: '<path d="M60 190q45-24 90 0v110q-45-24-90 0zM240 190q-45-24-90 0v110q45-24 90 0z" fill="#fbf0cf"/><path d="M150 190v110" stroke="#8a3550" stroke-width="3"/><path d="M150 120l7 16 17 2-13 11 4 17-15-9-15 9 4-17-13-11 17-2z" fill="#f4d98a"/>',
  rose: '<g transform="translate(150 190)"><circle r="56" fill="#e8a3b0"/><circle r="40" fill="#c9546f"/><circle r="24" fill="#e8a3b0"/><circle r="10" fill="#fbe9b7"/></g><path d="M150 250v90" stroke="#2b0f1f" stroke-width="6"/><path d="M150 300q30-30 50-10-20 24-50 10z" fill="#2b0f1f"/>',
  train: '<path d="M0 320h300" stroke="#f4d98a" stroke-width="3"/><rect x="60" y="230" width="150" height="70" rx="10" fill="#2b0f1f"/><rect x="210" y="200" width="46" height="100" rx="8" fill="#2b0f1f"/><rect x="74" y="244" width="22" height="22" rx="4" fill="#f4d98a"/><rect x="108" y="244" width="22" height="22" rx="4" fill="#f4d98a"/><rect x="142" y="244" width="22" height="22" rx="4" fill="#f4d98a"/><circle cx="100" cy="304" r="12" fill="#f4d98a"/><circle cx="170" cy="304" r="12" fill="#f4d98a"/><circle cx="220" cy="140" r="16" fill="#fbf0cf" opacity=".7"/><circle cx="240" cy="110" r="12" fill="#fbf0cf" opacity=".5"/>',
  basket: '<path d="M70 210h160l-18 100H88z" fill="#2b0f1f"/><path d="M95 210q55-100 110 0" fill="none" stroke="#2b0f1f" stroke-width="8"/><g><circle cx="115" cy="198" r="20" fill="#e8a3b0"/><circle cx="150" cy="190" r="22" fill="#f4d98a"/><circle cx="188" cy="198" r="20" fill="#c9546f"/></g>',
  compass: '<circle cx="150" cy="190" r="84" fill="none" stroke="#f4d98a" stroke-width="8"/><circle cx="150" cy="190" r="68" fill="#00000030"/><path d="M150 120l16 70-16 70-16-70z" fill="#f4d98a"/><path d="M150 120l16 70h-32z" fill="#c9546f"/><circle cx="150" cy="190" r="7" fill="#fbf0cf"/>'
};
function makeCover(motif, c1, c2, label) {
  const id = 'g' + Math.abs([...motif + c1].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) | 0, 7));
  return `<svg viewBox="0 0 300 420" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}" style="--c1:${c1}">
  <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>
  <rect width="300" height="420" fill="url(#${id})"/>
  <g fill="#f4d98a" opacity=".85"><path d="M60 62l4 9 10 1-8 6 3 10-9-6-9 6 3-10-8-6 10-1z"/><circle cx="240" cy="52" r="2.4"/><circle cx="110" cy="34" r="2"/><circle cx="262" cy="104" r="2"/><circle cx="34" cy="128" r="2"/></g>
  ${MOTIFS[motif] || MOTIFS.book}
  <rect x="10" y="10" width="280" height="400" fill="none" stroke="#f4d98a" stroke-width="2" rx="6"/><rect x="18" y="18" width="264" height="384" fill="none" stroke="#f4d98a" stroke-width=".8" rx="4" opacity=".7"/></svg>`;
}
const COVER_SPECS = {
  sun: ['#e08a6b', '#f6d9a8'], moon: ['#2c2150', '#8b6fae'], sea: ['#23506e', '#9cc7d4'], tree: ['#2f5a45', '#b9d3a7'],
  key: ['#4a1630', '#b5546c'], lantern: ['#1f2b52', '#7f8fc4'], mountain: ['#3a3f6e', '#d9a3b6'], bird: ['#5a3a6e', '#e2b7c9'],
  book: ['#6e2840', '#e9c3a8'], rose: ['#7a2a45', '#f0c4cc'], train: ['#1d2a44', '#c68a6e'], basket: ['#b2603f', '#f1d2a0'], compass: ['#2d3b4f', '#c9a96e']
};
Object.keys(COVER_SPECS).forEach(k => { if (!COVERS[k]) COVERS[k] = makeCover(k, COVER_SPECS[k][0], COVER_SPECS[k][1], k + ' storybook cover'); });
const ORNAMENT = `<svg class="orn" viewBox="0 0 220 24" aria-hidden="true"><path d="M10 12h80M130 12h80" stroke="currentColor" stroke-width="1" opacity=".6"/><g fill="currentColor"><path d="M110 3l2.6 6 6.4.6-4.8 4.2 1.5 6.2-5.7-3.4-5.7 3.4 1.5-6.2L101 9.6l6.4-.6z"/><circle cx="95" cy="12" r="2"/><circle cx="125" cy="12" r="2"/></g></svg>`;
