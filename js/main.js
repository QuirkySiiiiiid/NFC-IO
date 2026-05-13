/* main.js — init, scroll reveals, animated counters, page load */
(function () {

  // ── Page load screen ──
  const loader = document.getElementById('pageLoader');
  window.addEventListener('load', () => {
    setTimeout(() => loader?.classList.add('done'), 500);
  });

  // ── Scroll reveal with IntersectionObserver ──
  const revealOpts = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, revealOpts);

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    revealObserver.observe(el);
  });

  // ── Animated counter ──
  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1400;
    const start = performance.now();

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current + (el.dataset.suffix || '');
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => {
    counterObserver.observe(el);
  });

  // ── Marquee duplicate for seamless loop ──
  document.querySelectorAll('.marquee-track').forEach(track => {
    const clone = track.innerHTML;
    track.innerHTML = clone + clone; // duplicate for infinite scroll
  });

  // ── Contact form submit (placeholder) ──
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      const btn = form.querySelector('.submit-btn');
      const orig = btn.textContent;
      btn.textContent = 'SENDING...';
      btn.disabled = true;

      // Simulate — replace with real fetch/emailjs/formspree
      setTimeout(() => {
        btn.textContent = '✓ MESSAGE SENT';
        btn.style.background = 'var(--accent)';

        setTimeout(() => {
          btn.textContent = orig;
          btn.style.background = '';
          btn.disabled = false;
          form.reset();
        }, 3000);
      }, 1200);
    });
  }

  // ── Section entrance: add staggered child reveals ──
  // Any element inside .stagger gets reveal applied
  document.querySelectorAll('.stagger').forEach(parent => {
    Array.from(parent.children).forEach((child, i) => {
      child.classList.add('reveal');
      child.style.transitionDelay = `${i * 0.07}s`;
      revealObserver.observe(child);
    });
  });

})();