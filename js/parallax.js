/* parallax.js — multi-layer scroll parallax */
(function () {
  const isMobile = () => window.innerWidth < 768;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) return;

  /* ── Elements with data-parallax="speed" ── */
  // speed < 1  → moves slower than scroll (floats behind)
  // speed > 1  → moves faster (comes forward)
  // speed = negative → moves opposite direction

  function updateParallax() {
    const scrollY = window.scrollY;
    const speedMult = isMobile() ? 0.4 : 1;

    document.querySelectorAll('[data-parallax]').forEach(el => {
      const speed  = parseFloat(el.dataset.parallax) || 0.3;
      const rect   = el.closest('section')?.getBoundingClientRect() || el.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      const offset = center * speed * speedMult * -1;

      el.style.transform = `translateY(${offset}px)`;
    });

    /* ── Section BG slow-drift ── */
    document.querySelectorAll('[data-parallax-bg]').forEach(el => {
      const rect   = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      const speed  = parseFloat(el.dataset.parallaxBg) || 0.2;
      const offset = center * speed * speedMult * -1;

      el.style.backgroundPositionY = `calc(50% + ${offset}px)`;
    });

    /* ── Hero name slow float ── */
    const heroName = document.querySelector('.hero-name');
    if (heroName) {
      const offset = scrollY * 0.22 * speedMult;
      heroName.style.transform = `translateY(${offset}px)`;
    }

    /* ── Hero bg text parallax ── */
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
      const offset = scrollY * 0.08 * speedMult;
      heroBg.style.transform = `translateY(${offset}px)`;
    }

    /* ── Section title subtle shift ── */
    document.querySelectorAll('.section-title[data-parallax-title]').forEach(el => {
      const rect   = el.getBoundingClientRect();
      const dist   = (rect.top - window.innerHeight / 2);
      const offset = dist * 0.06 * speedMult;
      el.style.transform = `translateY(${offset}px)`;
    });
  }

  /* ── Marquee speed based on scroll velocity ── */
  let lastScroll = 0;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateParallax();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // initial paint
  updateParallax();

  // re-run on resize
  window.addEventListener('resize', updateParallax, { passive: true });
})();