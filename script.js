/* ── Scroll progress bar ── */
(function () {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    bar.style.width = Math.min(pct * 100, 100) + '%';
  }, { passive: true });
})();


/* ── Enhanced particle canvas ── */
(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const N = 120;
  const COLORS = ['0,240,255', '191,0,255', '0,200,220', '160,0,220'];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function rand(a, b) { return a + Math.random() * (b - a); }

  let mouse = { x: W / 2, y: H / 2 };
  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  for (let i = 0; i < N; i++) {
    particles.push({
      x: rand(0, W), y: rand(0, H),
      vx: rand(-0.28, 0.28), vy: rand(-0.28, 0.28),
      r: rand(1, 2.8),
      alpha: rand(0.15, 0.6),
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    /* connections */
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const p = particles[i], q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(0,240,255,${0.055 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.65;
          ctx.stroke();
        }
      }
    }

    /* dots + mouse repulsion */
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      ctx.fill();

      /* subtle mouse repulsion */
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 110 && dist > 0) {
        const force = (110 - dist) / 110;
        p.vx += (dx / dist) * force * 0.025;
        p.vy += (dy / dist) * force * 0.025;
      }

      /* speed cap */
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > 0.75) { p.vx = (p.vx / speed) * 0.75; p.vy = (p.vy / speed) * 0.75; }

      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

/* ── Animated counters ── */
function animateCounter(el, target, suffix) {
  const duration = 2000;
  const start = performance.now();
  function step(now) {
    const pct = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - pct, 4);
    el.textContent = Math.round(ease * target) + (suffix || '');
    if (pct < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ── IntersectionObserver for fade-ins ── */
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => io.observe(el));

/* ── Counter trigger on hero stats visible ── */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('[data-target]').forEach(el => {
        animateCounter(el, parseInt(el.dataset.target, 10), '+');
      });
      counterObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) counterObserver.observe(heroStats);

/* ── Nav active highlight on scroll ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 160) current = s.id;
  });
  navLinks.forEach(a => {
    const isActive = a.getAttribute('href') === '#' + current;
    a.style.color = isActive ? 'var(--accent)' : '';
    a.style.background = isActive ? 'rgba(0,240,255,0.09)' : '';
  });
}, { passive: true });

/* ── 3D card tilt on hover ── */
document.querySelectorAll('.glass').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'border-color .35s, box-shadow .35s';
  });
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotX = (-y / rect.height) * 7;
    const rotY = (x / rect.width) * 7;
    card.style.transform =
      `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transition =
      'transform .55s ease, border-color .35s, box-shadow .35s';
    card.style.transform = '';
  });
});
