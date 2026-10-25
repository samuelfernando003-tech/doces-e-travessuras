/* =========================================================
   CINEFLIX · MAIN
   Interações, reveals, contadores, tilt, menu, FAQ
   ========================================================= */

(() => {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─────── 1. PROGRESS BAR ─────── */
  const progressBar = document.getElementById('progress');
  const updateProgress = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
    progressBar.style.width = (scrolled * 100) + '%';
  };
  window.addEventListener('scroll', updateProgress, { passive: true });

  /* ─────── 2. HEADER SCROLL STATE ─────── */
  const header = document.getElementById('header');
  const onScrollHeader = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 30);
  };
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* ─────── 3. MOBILE MENU ─────── */
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');

  const closeMenu = () => {
    burger.classList.remove('is-open');
    mobileMenu.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
    burger.setAttribute('aria-expanded', 'false');
  };

  burger?.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('is-open');
    burger.classList.toggle('is-open', isOpen);
    document.body.classList.toggle('no-scroll', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
  });

  mobileMenu?.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', closeMenu)
  );

  /* ─────── 4. REVEAL ON SCROLL ─────── */
  const revealEls = document.querySelectorAll('.reveal');
  if (prefersReduced || !('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('is-visible'));
  } else {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });
    revealEls.forEach(el => revealObs.observe(el));
  }

  /* ─────── 5. COUNTERS ─────── */
  const fmt = n => n.toLocaleString('pt-BR');
  const counters = document.querySelectorAll('[data-count]');

  const animateCounter = (el) => {
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();

    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      el.textContent = fmt(Math.floor(target * eased)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = fmt(target) + suffix;
    };
    requestAnimationFrame(tick);
  };

  if (prefersReduced || !('IntersectionObserver' in window)) {
    counters.forEach(el => {
      el.textContent = fmt(+el.dataset.count) + (el.dataset.suffix || '');
    });
  } else {
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => counterObs.observe(el));
  }

  /* ─────── 6. HERO TILT ─────── */
  if (!prefersReduced && window.matchMedia('(hover: hover)').matches) {
    const tiltEl = document.querySelector('[data-tilt]');
    if (tiltEl) {
      const maxDeg = 6;
      tiltEl.addEventListener('mousemove', (e) => {
        const r = tiltEl.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        tiltEl.style.transform =
          `perspective(1400px) rotateY(${x * maxDeg * 2}deg) rotateX(${-y * maxDeg * 2}deg)`;
      });
      tiltEl.addEventListener('mouseleave', () => {
        tiltEl.style.transform = 'perspective(1400px) rotateY(0deg) rotateX(0deg)';
      });
    }
  }

  /* ─────── 7. SMOOTH ANCHOR SCROLL (offset) ─────── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ─────── 8. FAQ — apenas uma aberta ─────── */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach(other => {
          if (other !== item && other.open) other.open = false;
        });
      }
    });
  });

  /* ─────── 9. YEAR ─────── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
