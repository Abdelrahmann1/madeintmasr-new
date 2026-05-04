/* =========================================================
   reveal.js — scroll reveals + header stuck state
   Native IntersectionObserver; respects prefers-reduced-motion
   ========================================================= */
(function(){
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header stuck shadow on scroll ---------- */
  const header = document.getElementById('header');
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 8) header.classList.add('is-stuck');
      else header.classList.remove('is-stuck');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Scroll reveal observer ---------- */
  const targets = document.querySelectorAll('[data-reveal], .section-title, .new-launch-section, .project-card');

  if (reduced || !('IntersectionObserver' in window)) {
    // Reveal everything immediately
    targets.forEach(el => el.classList.add('is-in'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;

      // Stagger siblings if requested via data-reveal-stagger on parent
      const parent = el.parentElement;
      const stagger = parent && parent.dataset.revealStagger
        ? parseInt(parent.dataset.revealStagger, 10) || 0
        : 0;

      if (stagger) {
        const idx = Array.from(parent.children).indexOf(el);
        el.style.transitionDelay = (idx * stagger) + 'ms';
      }

      el.classList.add('is-in');
      io.unobserve(el);
    });
  }, {
    threshold: 0.18,
    rootMargin: '0px 0px -8% 0px'
  });

  targets.forEach(el => io.observe(el));
})();
