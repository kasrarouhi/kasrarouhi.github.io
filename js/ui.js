/* ── Scroll progress bar ── */
(function () {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    bar.style.width = Math.min(pct * 100, 100) + '%';
  }, { passive: true });
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
