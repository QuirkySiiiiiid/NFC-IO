/* nav.js — sticky nav, hamburger, active section, smooth scroll */
(function () {
  const nav         = document.querySelector('.nav');
  const hamburger   = document.querySelector('.hamburger');
  const mobileMenu  = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu a[href^="#"]');
  const navLinks    = document.querySelectorAll('.nav-links a[href^="#"]');

  // ── Scroll: add 'scrolled' class ──
  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 60);
    highlightActiveSection();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Hamburger toggle ──
  hamburger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // ── Close mobile menu on link click ──
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ── Smooth scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const offset = nav.offsetHeight + 8;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ── Active section highlight ──
  const sections = document.querySelectorAll('section[id]');

  function highlightActiveSection() {
    const scrollMid = window.scrollY + window.innerHeight / 2;

    sections.forEach(sec => {
      const top    = sec.offsetTop;
      const bottom = top + sec.offsetHeight;
      const id     = sec.id;

      if (scrollMid >= top && scrollMid < bottom) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }
})();