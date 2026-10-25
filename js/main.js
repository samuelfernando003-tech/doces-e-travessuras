(() => {
  'use strict';
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─────── PRELOADER ─────── */
  window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('preloader')?.classList.add('is-done'), 400);
  });
  // fallback: se a página demorar mais que 4s, esconde preloader
  setTimeout(() => document.getElementById('preloader')?.classList.add('is-done'), 4000);

  /* ─────── PROGRESS BAR ─────── */
  const progressBar = document.getElementById('progress');
  const updateProgress = () => {
    const h = document.documentElement;
    const p = h.scrollTop / (h.scrollHeight - h.clientHeight);
    progressBar.style.width = (p * 100) + '%';
  };
  window.addEventListener('scroll', updateProgress, { passive: true });

  /* ─────── HEADER SCROLL ─────── */
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => header.classList.toggle('is-scrolled', window.scrollY > 30), { passive: true });
  header.classList.toggle('is-scrolled', window.scrollY > 30);

  /* ─────── MOBILE MENU ─────── */
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeMenu = () => {
    burger.classList.remove('is-open');
    mobileMenu.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
    burger.setAttribute('aria-expanded', 'false');
  };
  burger?.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('is-open');
    burger.classList.toggle('is-open', open);
    document.body.classList.toggle('no-scroll', open);
    burger.setAttribute('aria-expanded', String(open));
  });
  mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  /* ─────── SPLIT TEXT (hero title) ─────── */
  document.querySelectorAll('[data-split]').forEach(el => {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) textNodes.push(node);

    let idx = 0;
    textNodes.forEach(node => {
      const text = node.textContent;
      const frag = document.createDocumentFragment();
      [...text].forEach(char => {
        if (char === ' ') {
          frag.appendChild(document.createTextNode(' '));
        } else {
          const span = document.createElement('span');
          span.className = 'char';
          span.textContent = char;
          span.style.animationDelay = (idx * 25) + 'ms';
          frag.appendChild(span);
          idx++;
        }
      });
      node.parentNode.replaceChild(frag, node);
    });
  });

  /* ─────── REVEAL ─────── */
  const reveals = document.querySelectorAll('.reveal');
  if (prefersReduced || !('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('is-visible'));
  } else {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });
    reveals.forEach((el, i) => {
      // stagger automático dentro de grids
      el.style.transitionDelay = (i % 6) * 60 + 'ms';
      obs.observe(el);
    });
  }

  /* ─────── COUNTERS ─────── */
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
    counters.forEach(el => el.textContent = fmt(+el.dataset.count) + (el.dataset.suffix || ''));
  } else {
    const cObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { animateCounter(e.target); cObs.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => cObs.observe(el));
  }

  /* ─────── TILT 3D ─────── */
  if (!prefersReduced && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('[data-tilt]').forEach(el => {
      const maxDeg = 6;
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(1400px) rotateY(${x * maxDeg * 2}deg) rotateX(${-y * maxDeg * 2}deg)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(1400px) rotateY(0) rotateX(0)';
      });
    });
  }

  /* ─────── MAGNETIC BUTTONS ─────── */
  if (!prefersReduced && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ─────── HERO PARTICLES ─────── */
  const canvas = document.getElementById('particles');
  if (canvas && !prefersReduced) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let raf;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * devicePixelRatio;
      canvas.height = r.height * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const colors = ['196,181,253', '167,139,250', '139,92,246'];
    for (let i = 0; i < 40; i++) {
      const r = canvas.getBoundingClientRect();
      particles.push({
        x: Math.random() * r.width,
        y: Math.random() * r.height,
        r: Math.random() * 1.8 + 0.4,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        c: colors[Math.floor(Math.random() * colors.length)],
        a: Math.random() * 0.4 + 0.2
      });
    }

    const render = () => {
      const w = canvas.width / devicePixelRatio;
      const h = canvas.height / devicePixelRatio;
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c},${p.a})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(render);
    };
    render();
  }

  /* ─────── ORB FOLLOW MOUSE ─────── */
  const orb = document.querySelector('[data-orb]');
  const hero = document.querySelector('.hero');
  if (orb && hero && !prefersReduced && window.matchMedia('(hover: hover)').matches) {
    hero.addEventListener('mousemove', (e) => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      orb.style.transform = `translate(${x * 60}px, ${y * 60}px)`;
    });
    hero.addEventListener('mouseleave', () => { orb.style.transform = ''; });
  }

  /* ─────── SMOOTH ANCHORS ─────── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ─────── SCROLL SPY ─────── */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    const spyObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === '#' + id));
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(s => spyObs.observe(s));
  }

  /* ─────── FAQ (uma aberta) ─────── */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) faqItems.forEach(o => { if (o !== item) o.open = false; });
    });
  });

  /* ─────── BACK TO TOP ─────── */
  const backTop = document.getElementById('backTop');
  window.addEventListener('scroll', () => {
    backTop.classList.toggle('is-visible', window.scrollY > 800);
  }, { passive: true });
  backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ─────── YEAR ─────── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
