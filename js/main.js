/* ══════════════════════════════════════════════════════
   H2O SUSTENTABLE — Interactions
══════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  /* ── Loader ─────────────────────────────────────── */
  const loader = document.getElementById('loader');
  const loaderFill = document.querySelector('.loader-bar-fill');
  if (loader) {
    requestAnimationFrame(() => { if (loaderFill) loaderFill.style.width = '100%'; });
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('loaded'), 350);
    });
    setTimeout(() => loader.classList.add('loaded'), 2200);
  }

  /* ── Navbar scroll state ────────────────────────── */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── Mobile menu ────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobMenu = document.getElementById('mob-menu');
  if (hamburger && mobMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobMenu.classList.toggle('open');
      const expanded = hamburger.classList.contains('active');
      hamburger.setAttribute('aria-expanded', String(expanded));
    });
    mobMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── Reveal on scroll ───────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ── Animated counters (stats) ──────────────────── */
  const counters = document.querySelectorAll('.stat-num[data-count]');
  const animateCount = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1600;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window && counters.length) {
    const cIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          cIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(el => cIo.observe(el));
  }

  /* ── Marquee content ─────────────────────────────── */
  const marquee = document.getElementById('marquee');
  if (marquee) {
    const items = [
      'Mantenimiento de Albercas',
      'Tratamiento de Agua',
      'Tecnología Sustentable',
      'Puerto Vallarta',
      'Riviera Nayarit',
      'Ciudad de México',
      'Servicio de Emergencia 24/7'
    ];
    const buildRow = () => items.map(txt =>
      `<span class="marquee-item">${txt}<i class="fa-solid fa-droplet" aria-hidden="true"></i></span>`
    ).join('');
    marquee.innerHTML = buildRow() + buildRow();
  }

  /* ── Hero canvas — water particle orbs ──────────── */
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, particles;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = canvas.offsetWidth; h = canvas.offsetHeight;
      canvas.width = w * DPR; canvas.height = h * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };

    const initParticles = () => {
      const count = window.innerWidth < 768 ? 18 : 34;
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2.4 + 0.6,
        vy: Math.random() * 0.35 + 0.12,
        vx: (Math.random() - 0.5) * 0.15,
        alpha: Math.random() * 0.4 + 0.15
      }));
    };

    resize();
    initParticles();

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.y -= p.vy;
        p.x += p.vx;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(94,234,212,${p.alpha})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { resize(); initParticles(); }, 200);
    });
  }

  /* ── Footer year ─────────────────────────────────── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Contact form → WhatsApp redirect ───────────── */
  const waForm = document.getElementById('wa-form');
  if (waForm) {
    waForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('f-name').value.trim();
      const interest = document.getElementById('f-interest').value;
      const msg = document.getElementById('f-msg').value.trim();

      if (!name || !msg) {
        waForm.reportValidity();
        return;
      }

      const text = `Hola, soy ${name}. Me interesa: ${interest}. ${msg}`;
      const phone = waForm.getAttribute('data-wa-phone') || '';
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }

});
