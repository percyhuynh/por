/**
 * nav.js — Per-dot horizontal progress bar
 *
 * Each .nav-dot has a .dot-fill div.
 * The active dot expands (CSS width transition: dot → bar).
 * Its .dot-fill width is set frame-by-frame via JS to match
 * that section's scroll progress (0 → 100%, left → right).
 *
 * When the section is fully scrolled past → dot shrinks back,
 * gets "visited" class (accent colour, no fill shown).
 * Next section's dot becomes active and starts filling.
 *
 * States on #nav:
 *   "dots"  → idle / scrolling
 *   "pill"  → hover (expanded menu)
 */

(() => {
  'use strict';

  /* ───────────────────────────────────────────
     DATA
  ─────────────────────────────────────────── */
  const SECTIONS = [
    { id: 's0', name: 'Visual System' },
    { id: 's1', name: 'Photography' },
    { id: 's2', name: 'Illustration' },
    { id: 's3', name: '3D' },
    { id: 's4', name: 'Website' },
    { id: 's5', name: 'Credits' },
  ];

  /* ───────────────────────────────────────────
     DOM
  ─────────────────────────────────────────── */
  const nav = document.getElementById('nav');
  const layerDots = document.getElementById('layerDots');
  const layerLinks = document.getElementById('layerLinks');

  /* ───────────────────────────────────────────
     BUILD DOTS
     Structure:  <div class="nav-dot">
                   <div class="dot-fill"></div>
                 </div>
  ─────────────────────────────────────────── */
  const dotEls = SECTIONS.map((sec, i) => {
    const dot = document.createElement('div');
    dot.className = 'nav-dot';
    dot.title = sec.name;

    const fill = document.createElement('div');
    fill.className = 'dot-fill';

    dot.appendChild(fill);
    layerDots.appendChild(dot);

    dot.addEventListener('click', () =>
      document.getElementById(sec.id)?.scrollIntoView({ behavior: 'smooth' })
    );

    return { dot, fill };
  });

  /* ───────────────────────────────────────────
     BUILD LINKS  (pill hover state)
  ─────────────────────────────────────────── */
  const linkEls = SECTIONS.map((sec, i) => {
    if (i > 0) {
      const div = document.createElement('span');
      div.className = 'nav-divider';
      div.setAttribute('aria-hidden', 'true');
      layerLinks.appendChild(div);
    }
    const btn = document.createElement('button');
    btn.className = 'nav-link';
    btn.textContent = sec.name;
    btn.setAttribute('role', 'listitem');
    btn.setAttribute('aria-label', `Go to ${sec.name}`);
    btn.addEventListener('click', () =>
      document.getElementById(sec.id)?.scrollIntoView({ behavior: 'smooth' })
    );
    layerLinks.appendChild(btn);
    return btn;
  });

  /* ───────────────────────────────────────────
     STATE
  ─────────────────────────────────────────── */
  let isHovered = false;
  let activeIdx = 0;
  let rafId = null;

  function applyState() {
    nav.dataset.state = isHovered ? 'pill' : 'dots';
  }

  nav.addEventListener('mouseenter', () => { isHovered = true; applyState(); });
  nav.addEventListener('mouseleave', () => { isHovered = false; applyState(); });

  /* ───────────────────────────────────────────
     SCROLL MATH

     Per-section progress (0 → 1):
       0%   = section top hits bottom of viewport  (just entering)
       100% = section bottom hits top of viewport  (just leaving)

     Total scroll window = sectionHeight + viewportHeight
     This guarantees a full 0→1 sweep for every section length.
  ─────────────────────────────────────────── */
  function getSectionProgress(el) {
    const { top } = el.getBoundingClientRect();
    const h = el.offsetHeight;
    // 0% = section top hits top of viewport
    // 100% = section bottom hits top of viewport
    return Math.min(1, Math.max(0, -top / h));
  }

  /* Active section = the one whose top is highest above mid-viewport */
  function getActiveSection() {
    const mid = window.innerHeight / 2;
    let best = 0, bestDist = Infinity;

    SECTIONS.forEach(({ id }, i) => {
      const el = document.getElementById(id);
      if (!el) return;
      const { top, bottom } = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (top < vh && bottom > 0) {
        // distance of section's top from viewport midpoint
        const dist = Math.abs(top - mid * 0.5);
        if (dist < bestDist) { bestDist = dist; best = i; }
      }
    });

    return best;
  }

  /* ───────────────────────────────────────────
     RENDER  (rAF-throttled, called each scroll event)
  ─────────────────────────────────────────── */
  function render() {
    rafId = null;

    const current = getActiveSection();

    SECTIONS.forEach(({ id }, i) => {
      const el = document.getElementById(id);
      const p = el ? getSectionProgress(el) : 0;
      const { dot, fill } = dotEls[i];

      const isActive = (i === current) && (p > 0.001);
      const isVisited = (p >= 0.999);

      /* ── Class states (drive CSS width morph) ── */
      dot.classList.toggle('is-active', isActive);
      dot.classList.toggle('is-visited', isVisited);

      /* ── Fill width: only meaningful on active dot ── */
      /*    JS sets it every frame with NO CSS transition
            so it's pixel-perfect with scroll position.   */
      if (isActive) {
        fill.style.width = (p * 100).toFixed(2) + '%';
      } else {
        // Instantly clear fill on non-active dots
        fill.style.width = isVisited ? '100%' : '0%';
      }
    });

    /* ── Sync pill link highlight ── */
    if (current !== activeIdx) {
      activeIdx = current;
      linkEls.forEach((lnk, i) => lnk.classList.toggle('is-active', i === current));
    }
  }

  function onScroll() {
    if (!rafId) rafId = requestAnimationFrame(render);
  }

  /* ───────────────────────────────────────────
     INIT
  ─────────────────────────────────────────── */
  window.addEventListener('scroll', onScroll, { passive: true });
  linkEls[0].classList.add('is-active');
  applyState();
  render();

})();


// JS SECTION 2
var typed = new Typed(".input", {
  strings: ["Frontend Developer", "UX Designer", "Web Developer"],
  typedSpeed: 70,
  backSpeed: 55,
  loop: true
})
