/* Chaos Over — ambient glass-blob parallax field, shared across websites-v3.
 * Layers ~10 large, heavily-blurred, semi-transparent blobs across the page background.
 * Each blob drifts on scroll at its own speed + responds to mouse for that subtle "alive" feel.
 *
 * Usage:
 *   <div class="ambient-field" id="ambient"></div>
 *   <link rel="stylesheet" href="ambient.css">  (styles below are inline-injected for portability)
 *   <script src="ambient.js"></script>
 *
 * The script injects its own CSS so each page just needs the <div> + <script src>.
 */
(function () {
  // ── Style inject ─────────────────────────────────────────────────────
  const css = `
    .ambient-field {
      position: fixed; inset: 0; pointer-events: none;
      z-index: 0; overflow: hidden;
    }
    .ambient-field .blob {
      position: absolute; will-change: transform;
      border-radius: 50%;
      filter: blur(60px);
      mix-blend-mode: normal;
      opacity: 0.85;
    }
    .ambient-field .blob.glass {
      filter: blur(40px);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      box-shadow:
        inset 1px 2px 4px rgba(255,255,255,0.4),
        inset -2px -3px 8px rgba(28,24,34,0.06);
      opacity: 0.78;
    }
    /* Parent stage above the ambient field */
    .stage { position: relative; z-index: 1; }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // ── Build blobs ──────────────────────────────────────────────────────
  // Palette pulled from the Soft Hue Studies (petal/sunrise/orchard).
  const PALETTE = [
    ['#ffd9c2', '#f3b694'],   // peach
    ['#e6dcf3', '#cbb7e6'],   // lavender
    ['#fbe2e9', '#f3b3c4'],   // blush
    ['#d9e6f3', '#b1c8e0'],   // sky
    ['#fbeede', '#ecd9b8'],   // champagne
  ];
  const rand = (a, b) => Math.random() * (b - a) + a;
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  function buildBlob(opts) {
    const [c1, c2] = opts.colors;
    const el = document.createElement('div');
    el.className = 'blob ' + (opts.glass ? 'glass' : '');
    el.style.width = opts.size + 'px';
    el.style.height = opts.size + 'px';
    el.style.left = opts.xVw + 'vw';
    el.style.top = opts.yVh + 'vh';
    el.style.background = `radial-gradient(circle at ${opts.gx}% ${opts.gy}%, ${c1} 0%, ${c1} 30%, ${c2} 70%, ${c2}00 100%)`;
    el.dataset.speed = opts.speed;
    el.dataset.driftX = opts.driftX;
    el.dataset.driftY = opts.driftY;
    el.dataset.rot = opts.rot;
    return el;
  }

  const field = document.getElementById('ambient');
  if (!field) return;

  // Define ~12 blobs across page (page is multi-screen high; spread Y over 0–700vh)
  const recipe = [
    { size: 540, xVw: -8,  yVh: 4,   speed: 0.08, glass: true,  driftX: 18, driftY: 22, gx: 35, gy: 35 },
    { size: 720, xVw: 65,  yVh: 12,  speed: 0.15, glass: false, driftX: 30, driftY: 24, gx: 40, gy: 30 },
    { size: 460, xVw: 20,  yVh: 38,  speed: 0.22, glass: true,  driftX: 24, driftY: 30, gx: 30, gy: 40 },
    { size: 600, xVw: 78,  yVh: 58,  speed: 0.32, glass: false, driftX: 36, driftY: 28, gx: 50, gy: 35 },
    { size: 420, xVw: -6,  yVh: 92,  speed: 0.28, glass: true,  driftX: 22, driftY: 18, gx: 60, gy: 60 },
    { size: 560, xVw: 50,  yVh: 130, speed: 0.18, glass: false, driftX: 30, driftY: 22, gx: 35, gy: 50 },
    { size: 660, xVw: 8,   yVh: 170, speed: 0.40, glass: true,  driftX: 28, driftY: 36, gx: 45, gy: 30 },
    { size: 500, xVw: 72,  yVh: 200, speed: 0.30, glass: false, driftX: 24, driftY: 28, gx: 30, gy: 40 },
    { size: 480, xVw: 28,  yVh: 245, speed: 0.20, glass: true,  driftX: 22, driftY: 20, gx: 55, gy: 35 },
    { size: 620, xVw: 80,  yVh: 280, speed: 0.36, glass: false, driftX: 32, driftY: 30, gx: 40, gy: 45 },
    { size: 540, xVw: -8,  yVh: 330, speed: 0.24, glass: true,  driftX: 28, driftY: 24, gx: 40, gy: 30 },
    { size: 700, xVw: 60,  yVh: 370, speed: 0.42, glass: false, driftX: 34, driftY: 30, gx: 50, gy: 50 },
  ];

  const blobs = [];
  recipe.forEach(b => {
    const colors = pick(PALETTE);
    const rot = rand(-12, 12);
    const el = buildBlob({ ...b, colors, rot });
    field.appendChild(el);
    blobs.push(el);
  });

  // ── Parallax engine ──────────────────────────────────────────────────
  let mx = 0, my = 0, sy = 0;
  let targetMx = 0, targetMy = 0;
  window.addEventListener('mousemove', e => {
    targetMx = e.clientX / window.innerWidth - 0.5;
    targetMy = e.clientY / window.innerHeight - 0.5;
  });
  window.addEventListener('scroll', () => { sy = window.scrollY; }, { passive: true });

  function tick() {
    // Smooth-follow the mouse for a slightly damped, fluid feel
    mx += (targetMx - mx) * 0.06;
    my += (targetMy - my) * 0.06;
    blobs.forEach(el => {
      const s = parseFloat(el.dataset.speed);
      const dx = parseFloat(el.dataset.driftX);
      const dy = parseFloat(el.dataset.driftY);
      const r = parseFloat(el.dataset.rot);
      const x = mx * dx * s * 2.4;
      const y = (-sy * s) + my * dy * s * 1.8;
      const rotNow = r + sy * s * 0.012;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rotNow}deg)`;
    });
    requestAnimationFrame(tick);
  }
  tick();

  // ── Reveal on scroll (shared) ────────────────────────────────────────
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.12 });
  document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
})();
