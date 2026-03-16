interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  shape: "rect" | "circle";
}

const GREEN_COLORS = [
  "#22c55e", "#4ade80", "#ffffff", "#86efac",
  "#16a34a", "#bbf7d0", "#dcfce7",
];

const GOLD_COLORS = [
  "#fbbf24", "#f59e0b", "#ffffff", "#fde68a",
  "#d97706", "#fef3c7", "#fffbeb",
];

export type ConfettiTheme = "green" | "gold";

export function fireConfetti(theme: ConfettiTheme = "green") {
  const COLORS = theme === "gold" ? GOLD_COLORS : GREEN_COLORS;
  const canvas = document.createElement("canvas");
  canvas.style.cssText =
    "position:fixed;inset:0;z-index:9999;pointer-events:none;width:100%;height:100%";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d")!;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.scale(dpr, dpr);

  const W = window.innerWidth;
  const H = window.innerHeight;
  const COUNT = 150;
  const GRAVITY = 0.14;
  const DRAG = 0.985;
  const DURATION = 3500;

  const particles: Particle[] = [];
  for (let i = 0; i < COUNT; i++) {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.4;
    const speed = 8 + Math.random() * 10;
    particles.push({
      x: W * (0.3 + Math.random() * 0.4),
      y: H * 0.55,
      vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
      vy: Math.sin(angle) * speed - Math.random() * 4,
      w: 4 + Math.random() * 5,
      h: 6 + Math.random() * 8,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
      opacity: 1,
      shape: Math.random() > 0.3 ? "rect" : "circle",
    });
  }

  const start = performance.now();

  function frame(now: number) {
    const elapsed = now - start;
    if (elapsed > DURATION) {
      canvas.remove();
      return;
    }

    const fadeStart = DURATION * 0.6;
    const globalAlpha = elapsed > fadeStart ? 1 - (elapsed - fadeStart) / (DURATION - fadeStart) : 1;

    ctx.clearRect(0, 0, W, H);

    for (const p of particles) {
      p.vy += GRAVITY;
      p.vx *= DRAG;
      p.vy *= DRAG;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;

      ctx.save();
      ctx.globalAlpha = globalAlpha * p.opacity;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;

      if (p.shape === "rect") {
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}
