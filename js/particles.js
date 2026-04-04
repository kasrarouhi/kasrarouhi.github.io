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
