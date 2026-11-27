'use strict';
/* ───────────── gentle background (petals + stars) and desktop cursor sparkles ───────────── */
const FX = (() => {
  const bg = document.getElementById('bg'), tr = document.getElementById('trail');
  const bctx = bg.getContext('2d'), tctx = tr.getContext('2d');
  let W = 0, H = 0, parts = [], trail = [], raf = 0, last = 0, on = false, dpr = 1;
  const COLORS = () => document.documentElement.dataset.theme === 'dark'
    ? ['rgba(224,170,180,', 'rgba(214,190,240,', 'rgba(230,200,120,']
    : ['rgba(217,150,160,', 'rgba(185,165,215,', 'rgba(201,162,77,'];
  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    for (const c of [bg, tr]) { c.width = W * dpr; c.height = H * dpr; c.style.width = W + 'px'; c.style.height = H + 'px'; }
    bctx.setTransform(dpr, 0, 0, dpr, 0, 0); tctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function seed() {
    const n = W < 600 ? 14 : 22;     // deliberately few particles
    parts = Array.from({ length: n }, () => mk(true));
  }
  function mk(anywhere) {
    return { x: Math.random() * W, y: anywhere ? Math.random() * H : -20, r: 3 + Math.random() * 5, vy: 6 + Math.random() * 10, vx: -4 + Math.random() * 8, rot: Math.random() * 6.28, vr: (Math.random() - .5) * .6, c: Math.floor(Math.random() * 3), star: Math.random() < .35, tw: Math.random() * 6.28 };
  }
  function star(ctx, r) { ctx.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, rr = i % 2 ? r * .35 : r; ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } ctx.closePath(); ctx.fill(); }
  function frame(t) {
    raf = requestAnimationFrame(frame);
    if (t - last < 33) return;            // ~30 fps cap
    const dt = Math.min((t - last) / 1000, .1); last = t;
    const cols = COLORS();
    bctx.clearRect(0, 0, W, H);
    for (const p of parts) {
      p.y += p.vy * dt; p.x += (p.vx + Math.sin(t / 2500 + p.tw) * 6) * dt; p.rot += p.vr * dt; p.tw += dt;
      if (p.y > H + 20) Object.assign(p, mk(false));
      bctx.save(); bctx.translate(p.x, p.y); bctx.rotate(p.rot);
      if (p.star) { bctx.fillStyle = cols[2] + (0.25 + 0.2 * Math.sin(p.tw * 2)) + ')'; star(bctx, p.r); }
      else { bctx.fillStyle = cols[p.c] + '0.28)'; bctx.beginPath(); bctx.ellipse(0, 0, p.r, p.r * .6, 0, 0, 6.28); bctx.fill(); }
      bctx.restore();
    }
    tctx.clearRect(0, 0, W, H);
    for (let i = trail.length - 1; i >= 0; i--) {
      const s = trail[i]; s.life -= dt * 1.8; if (s.life <= 0) { trail.splice(i, 1); continue; }
      tctx.save(); tctx.translate(s.x, s.y + (1 - s.life) * 10); tctx.fillStyle = cols[2] + (s.life * .7) + ')'; star(tctx, 4 * s.life + 1); tctx.restore();
    }
  }
  function stop() { cancelAnimationFrame(raf); raf = 0; on = false; bctx.clearRect(0, 0, W, H); tctx.clearRect(0, 0, W, H); trail = []; }
  function start() { if (on) return; on = true; size(); seed(); last = performance.now(); raf = requestAnimationFrame(frame); }
  function refresh() { const off = document.body.classList.contains('noanim'); if (off) stop(); else start(); }
  addEventListener('resize', () => { if (on) { size(); seed(); } });
  document.addEventListener('visibilitychange', () => { if (document.hidden) { cancelAnimationFrame(raf); raf = 0; } else if (on && !raf) { last = performance.now(); raf = requestAnimationFrame(frame); } });
  let lastSpark = 0;
  addEventListener('pointermove', e => {
    if (!on || e.pointerType !== 'mouse') return;
    const n = performance.now(); if (n - lastSpark < 55) return; lastSpark = n;
    trail.push({ x: e.clientX, y: e.clientY, life: 1 }); if (trail.length > 14) trail.shift();
  }, { passive: true });
  return { refresh };
})();
