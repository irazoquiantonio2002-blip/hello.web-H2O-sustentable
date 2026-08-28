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
      'Filtración y Climatización',
      'Venta de Equipos e Insumos',
      'Medición con Precisión',
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

    let ripples = [];

    const initParticles = () => {
      const count = window.innerWidth < 768 ? 16 : 28;
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 3.4 + 1.6,
        vy: Math.random() * 0.32 + 0.10,
        vx: (Math.random() - 0.5) * 0.12,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.02 + 0.006,
        alpha: Math.random() * 0.35 + 0.12
      }));
      ripples = [];
    };

    // Dibuja una gota de agua (punta hacia arriba)
    const drawDroplet = (x, y, r, alpha) => {
      ctx.beginPath();
      ctx.moveTo(x, y - r * 1.9);
      ctx.quadraticCurveTo(x + r, y - r * 0.35, x + r, y);
      ctx.arc(x, y, r, 0, Math.PI, false);
      ctx.quadraticCurveTo(x - r, y - r * 0.35, x, y - r * 1.9);
      ctx.closePath();
      const g = ctx.createLinearGradient(x, y - r * 1.9, x, y + r);
      g.addColorStop(0, `rgba(94,234,212,${alpha * 0.5})`);
      g.addColorStop(1, `rgba(94,234,212,${alpha})`);
      ctx.fillStyle = g;
      ctx.fill();
      // brillo
      ctx.beginPath();
      ctx.arc(x - r * 0.3, y - r * 0.15, r * 0.32, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(240,255,252,${alpha * 0.9})`;
      ctx.fill();
    };

    resize();
    initParticles();

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      particles.forEach(p => {
        p.sway += p.swaySpeed;
        p.y -= p.vy;
        p.x += p.vx + Math.sin(p.sway) * 0.25;
        if (p.y < -14) {
          p.y = h + 14;
          p.x = Math.random() * w;
          // al "reaparecer" abajo, genera una onda ocasional
          if (Math.random() < 0.5) {
            ripples.push({ x: p.x, y: h - Math.random() * 18, r: 1, alpha: 0.28 });
          }
        }
        drawDroplet(p.x, p.y, p.r, p.alpha);
      });

      ripples.forEach(rp => {
        rp.r += 0.7;
        rp.alpha *= 0.965;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(94,234,212,${rp.alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });
      ripples = ripples.filter(rp => rp.alpha > 0.02);

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

  /* ── Promo modal — "Si contratas hoy mismo" ──────── */
  const promo = document.getElementById('promo-overlay');
  if (promo) {
    const promoClose = document.getElementById('promo-close');
    const STORE_KEY = 'h2o_promo_seen';
    let promoShown = false;

    let alreadySeen = false;
    try { alreadySeen = sessionStorage.getItem(STORE_KEY) === '1'; } catch (e) {}

    const openPromo = () => {
      if (promoShown || alreadySeen) return;
      promoShown = true;
      promo.classList.add('open');
      promo.setAttribute('aria-hidden', 'false');
      try { sessionStorage.setItem(STORE_KEY, '1'); } catch (e) {}
    };
    const closePromo = () => {
      promo.classList.remove('open');
      promo.setAttribute('aria-hidden', 'true');
    };

    if (!alreadySeen) {
      // Aparece tras 8 s de navegación…
      const timer = setTimeout(openPromo, 8000);
      // …o al detectar intención de salida (mouse hacia la parte superior)
      const onExitIntent = (e) => {
        if (e.clientY <= 0) { clearTimeout(timer); openPromo(); }
      };
      document.addEventListener('mouseout', onExitIntent);
    }

    promoClose.addEventListener('click', closePromo);
    promo.addEventListener('click', (e) => { if (e.target === promo) closePromo(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && promo.classList.contains('open')) closePromo();
    });
    // Cerrar al tocar cualquiera de los botones de contacto
    promo.querySelectorAll('a').forEach(a => a.addEventListener('click', closePromo));
  }

});
