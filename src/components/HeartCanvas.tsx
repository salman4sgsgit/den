import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { HeartParticle, AmbientParticle } from '../types';

export interface HeartCanvasHandle {
  burstFrom: (x: number, y: number, count?: number) => void;
  showerFromEverywhere: (count?: number) => void;
  clear: () => void;
}

interface HeartCanvasProps {
  interactive?: boolean;
}

const ROMANTIC_PALETTE = [
  '#ff2a6d', // Vivid romantic rose
  '#ff4d6d', // Bright ruby
  '#ff758f', // Soft blush pink
  '#c9184a', // Deep crimson
  '#a4133c', // Velvet wine
  '#ff85a1', // Pastel petal
  '#f72585', // Radiant magenta
  '#ffd166', // Glistening warm gold
  '#ffe5ec', // Frosted porcelain rose
  '#ff0054', // Passion pink
];

// Helper to draw a crisp bezier heart centered at (0, 0)
function drawHeart(ctx: CanvasRenderingContext2D, size: number) {
  const s = size / 20;
  ctx.beginPath();
  ctx.moveTo(0, -5 * s);
  ctx.bezierCurveTo(-5 * s, -14 * s, -15 * s, -9 * s, -15 * s, 1 * s);
  ctx.bezierCurveTo(-15 * s, 10 * s, -5 * s, 16 * s, 0, 20 * s);
  ctx.bezierCurveTo(5 * s, 16 * s, 15 * s, 10 * s, 15 * s, 1 * s);
  ctx.bezierCurveTo(15 * s, -9 * s, 5 * s, -14 * s, 0, -5 * s);
  ctx.closePath();
}

// Helper to draw a glistening 4-point sparkle star
function drawSparkle(ctx: CanvasRenderingContext2D, size: number) {
  const r = size / 2;
  const inner = r * 0.25;
  ctx.beginPath();
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2;
    const nextAngle = angle + Math.PI / 4;
    ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
    ctx.lineTo(Math.cos(nextAngle) * inner, Math.sin(nextAngle) * inner);
  }
  ctx.closePath();
}

export const HeartCanvas = forwardRef<HeartCanvasHandle, HeartCanvasProps>(
  ({ interactive = true }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const particlesRef = useRef<HeartParticle[]>([]);
    const ambientRef = useRef<AmbientParticle[]>([]);
    const animFrameRef = useRef<number | null>(null);
    const idCounterRef = useRef<number>(0);
    const dimsRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });

    // Initialize ambient romantic floating motes
    const initAmbient = (width: number, height: number) => {
      const ambients: AmbientParticle[] = [];
      const count = Math.min(60, Math.floor((width * height) / 18000));
      for (let i = 0; i < count; i++) {
        ambients.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 4 + 1.5,
          speed: Math.random() * 0.5 + 0.2,
          opacity: Math.random() * 0.5 + 0.2,
          baseOpacity: Math.random() * 0.4 + 0.2,
          sinOffset: Math.random() * Math.PI * 2,
          color: Math.random() > 0.3 ? '#ff85a1' : '#ffd166',
        });
      }
      ambientRef.current = ambients;
    };

    const addParticle = (p: Partial<HeartParticle>) => {
      idCounterRef.current += 1;
      const particle: HeartParticle = {
        id: idCounterRef.current,
        x: p.x ?? dimsRef.current.w / 2,
        y: p.y ?? dimsRef.current.h / 2,
        vx: p.vx ?? (Math.random() - 0.5) * 8,
        vy: p.vy ?? (Math.random() - 0.5) * 8,
        size: p.size ?? Math.random() * 26 + 14,
        color: p.color ?? ROMANTIC_PALETTE[Math.floor(Math.random() * ROMANTIC_PALETTE.length)],
        opacity: p.opacity ?? 1,
        rotation: p.rotation ?? (Math.random() - 0.5) * Math.PI,
        vRot: p.vRot ?? (Math.random() - 0.5) * 0.08,
        wobbleSpeed: p.wobbleSpeed ?? Math.random() * 0.05 + 0.02,
        wobbleOffset: Math.random() * Math.PI * 2,
        life: 0,
        maxLife: p.maxLife ?? Math.random() * 180 + 160,
        scaleX: 1,
        scaleY: 1,
        type: p.type ?? (Math.random() > 0.18 ? 'heart' : 'sparkle'),
      };
      particlesRef.current.push(particle);
    };

    // Burst from specific location (e.g. tap)
    const burstFrom = (x: number, y: number, count = 80) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 14 + 3;
        const isBig = Math.random() > 0.85;
        const size = isBig ? Math.random() * 24 + 26 : Math.random() * 18 + 12;

        addParticle({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (Math.random() * 4 + 2), // upward bias
          size,
          maxLife: Math.random() * 160 + 120,
          type: Math.random() > 0.15 ? 'heart' : 'sparkle',
        });
      }
    };

    // Shower hearts coming from EVERYWHERE: bottom fountain, top rain, left/right inwards, and center
    const showerFromEverywhere = (count = 280) => {
      const { w, h } = dimsRef.current;
      if (w === 0 || h === 0) return;

      // 1. Bottom fountains shooting up (majestic firework fountains of hearts)
      const bottomCount = Math.floor(count * 0.35);
      for (let i = 0; i < bottomCount; i++) {
        const startX = Math.random() * w;
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.2;
        const speed = Math.random() * 16 + 10;
        addParticle({
          x: startX,
          y: h + 10,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 24 + 14,
          maxLife: Math.random() * 220 + 150,
          type: 'heart',
        });
      }

      // 2. Top shower cascading gently down like romantic rain
      const topCount = Math.floor(count * 0.25);
      for (let i = 0; i < topCount; i++) {
        const startX = Math.random() * w;
        addParticle({
          x: startX,
          y: -20 - Math.random() * 80,
          vx: (Math.random() - 0.5) * 4,
          vy: Math.random() * 4 + 2.5,
          size: Math.random() * 26 + 12,
          maxLife: Math.random() * 260 + 180,
          type: Math.random() > 0.2 ? 'heart' : 'sparkle',
        });
      }

      // 3. Left border swooshing towards center
      const leftCount = Math.floor(count * 0.15);
      for (let i = 0; i < leftCount; i++) {
        const startY = Math.random() * h;
        const angle = -0.2 + (Math.random() - 0.5) * 0.9;
        const speed = Math.random() * 12 + 6;
        addParticle({
          x: -10,
          y: startY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 22 + 12,
          maxLife: Math.random() * 200 + 140,
          type: 'heart',
        });
      }

      // 4. Right border swooshing towards center
      const rightCount = Math.floor(count * 0.15);
      for (let i = 0; i < rightCount; i++) {
        const startY = Math.random() * h;
        const angle = Math.PI - 0.2 + (Math.random() - 0.5) * 0.9;
        const speed = Math.random() * 12 + 6;
        addParticle({
          x: w + 10,
          y: startY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 22 + 12,
          maxLife: Math.random() * 200 + 140,
          type: 'heart',
        });
      }

      // 5. Center explosion
      const centerCount = Math.floor(count * 0.1);
      burstFrom(w / 2, h / 2, centerCount);
    };

    const clear = () => {
      particlesRef.current = [];
    };

    useImperativeHandle(ref, () => ({
      burstFrom,
      showerFromEverywhere,
      clear,
    }));

    // Setup canvas resolution and animation loop
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const updateSize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = window.innerWidth;
        const h = window.innerHeight;
        dimsRef.current = { w, h };
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        ctx.scale(dpr, dpr);

        if (ambientRef.current.length === 0) {
          initAmbient(w, h);
        }
      };

      updateSize();
      window.addEventListener('resize', updateSize);

      let lastTime = performance.now();
      let ambientHeartTimer = 0;

      const render = (time: number) => {
        const dt = Math.min((time - lastTime) / 1000, 0.1);
        lastTime = time;

        const { w, h } = dimsRef.current;
        ctx.clearRect(0, 0, w, h);

        // 1. Render ambient motes / bokeh
        for (const amb of ambientRef.current) {
          amb.y -= amb.speed;
          if (amb.y < -10) {
            amb.y = h + 10;
            amb.x = Math.random() * w;
          }
          const pulse = Math.sin(time * 0.002 + amb.sinOffset) * 0.2;
          const currentOpacity = Math.max(0.05, amb.baseOpacity + pulse);

          ctx.save();
          ctx.beginPath();
          ctx.arc(amb.x, amb.y, amb.size, 0, Math.PI * 2);
          ctx.fillStyle = amb.color;
          ctx.globalAlpha = currentOpacity;
          ctx.shadowColor = amb.color;
          ctx.shadowBlur = amb.size * 3;
          ctx.fill();
          ctx.restore();
        }

        // Periodically spawn gentle ambient drifting hearts in background
        ambientHeartTimer += dt;
        if (ambientHeartTimer > 0.4 && particlesRef.current.length < 350) {
          ambientHeartTimer = 0;
          addParticle({
            x: Math.random() * w,
            y: h + 20,
            vx: (Math.random() - 0.5) * 1.5,
            vy: -Math.random() * 1.8 - 0.8,
            size: Math.random() * 14 + 10,
            opacity: Math.random() * 0.4 + 0.3,
            maxLife: Math.random() * 300 + 200,
            type: 'heart',
          });
        }

        // 2. Render and update active heart particles
        const particles = particlesRef.current;
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.life += 1;

          if (p.life >= p.maxLife) {
            particles.splice(i, 1);
            continue;
          }

          // Physics: drag, gravity, and gentle sinusoidal flutter
          p.vx *= 0.985;
          p.vy += 0.08; // subtle gravity
          p.x += p.vx + Math.sin(p.life * p.wobbleSpeed + p.wobbleOffset) * 0.75;
          p.y += p.vy;
          p.rotation += p.vRot;

          // 3D paper flutter simulation
          p.scaleX = Math.cos(p.life * p.wobbleSpeed * 1.5 + p.wobbleOffset);

          // Fade out near end of life
          const progress = p.life / p.maxLife;
          const fadeAlpha = progress > 0.7 ? (1 - progress) / 0.3 : 1;
          const currentAlpha = Math.max(0, p.opacity * fadeAlpha);

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.scale(p.scaleX, 1);
          ctx.globalAlpha = currentAlpha;
          ctx.fillStyle = p.color;

          // Subtle glow for larger particles
          if (p.size > 20) {
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 12;
          }

          if (p.type === 'heart') {
            drawHeart(ctx, p.size);
            ctx.fill();
          } else {
            drawSparkle(ctx, p.size * 0.8);
            ctx.fill();
          }

          ctx.restore();
        }

        animFrameRef.current = requestAnimationFrame(render);
      };

      animFrameRef.current = requestAnimationFrame(render);

      return () => {
        window.removeEventListener('resize', updateSize);
        if (animFrameRef.current) {
          cancelAnimationFrame(animFrameRef.current);
        }
      };
    }, []);

    // Interactive tap/click handler on canvas
    const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!interactive) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      burstFrom(x, y, 40);
    };

    return (
      <canvas
        ref={canvasRef}
        id="romantic-heart-canvas"
        onPointerDown={handlePointerDown}
        className="fixed inset-0 w-full h-full pointer-events-auto cursor-pointer z-10"
      />
    );
  }
);

HeartCanvas.displayName = 'HeartCanvas';
