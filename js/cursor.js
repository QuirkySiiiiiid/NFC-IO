/* cursor.js — smooth magnetic custom cursor */
(function () {
  const isTouchDevice = () =>
    window.matchMedia('(hover: none)').matches || 'ontouchstart' in window;

  if (isTouchDevice()) return;

  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.className  = 'cursor-dot';
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mx = -100, my = -100;
  let rx = -100, ry = -100;
  let isHover = false;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
  });

  document.addEventListener('mousedown', () => ring.classList.add('click'));
  document.addEventListener('mouseup',   () => ring.classList.remove('click'));

  // hover detection for interactive elements
  const targets = 'a, button, [data-cursor], input, textarea, .nav-logo, .contact-line, .service-item, .social-btn, .nfc-action';

  document.addEventListener('mouseover', e => {
    if (e.target.closest(targets)) {
      ring.classList.add('hover');
      isHover = true;
    }
  });

  document.addEventListener('mouseout', e => {
    if (e.target.closest(targets)) {
      ring.classList.remove('hover');
      isHover = false;
    }
  });

  // smooth ring follow
  function loop() {
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';

    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';

    requestAnimationFrame(loop);
  }

  loop();
})();