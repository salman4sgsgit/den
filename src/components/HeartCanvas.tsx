import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { HeartParticle, AmbientParticle, FloatingWhisper } from '../types';

export interface HeartCanvasHandle {
  burstFrom: (x: number, y: number, count?: number) => void;
  showerFromEverywhere: (count?: number) => void;
  spawnWhisper: (text?: string, x?: number, y?: number) => void;
  triggerHeartbeatPulse: (x?: number, y?: number) => void;
  clear: () => void;
}

interface HeartCanvasProps {
  interactive?: boolean;
}

interface PulseWave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  color: string;
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

const ROMANTIC_WHISPERS = [
  'Come soon ✨',
  'Counting down every second...',
  'The world is waiting for you 🌸',
  'Hurry back to me...',
  'Missing your smile...',
  'Wishing you were here right now 💫',
  'Every moment feels too long without you...',
  'Come back soon, Vaishu 💖',
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

// Helper to draw a delicate rose petal
function drawPetal(ctx: CanvasRenderingContext2D, size: number) {
  const s = size / 20;
  ctx.beginPath();
  ctx.moveTo(0, -12 * s);
  ctx.bezierCurveTo(9 * s, -9 * s, 11 * s, 6 * s, 0, 14 * s);
  ctx.bezierCurveTo(-11 * s, 6 * s, -9 * s, -9 * s, 0, -12 * s);
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
    const whispersRef = useRef<FloatingWhisper[]>([]);
    const pulseWavesRef = useRef<PulseWave[]>([]);
    const animFrameRef = useRef<number | null>(null);
    const idCounterRef = useRef<number>(0);
    const dimsRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });

    // Initialize ambient romantic floating motes
    const initAmbient = (width: number, height: number) => {
      const ambients: AmbientParticle[] = [];
      const count = Math.min(65, Math.floor((width * height) / 16000));
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
      const typeChoice: HeartParticle['type'] = p.type ?? (
        Math.random() < 0.55 ? 'heart' : Math.random() < 0.85 ? 'petal' : 'sparkle'
      );

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
        maxLife: p.maxLife ?? Math.random() * 190 + 160,
        scaleX: 1,
        scaleY: 1,
        type: typeChoice,
      };
      particlesRef.current.push(particle);
    };

    const spawnWhisper = (text?: string, x?: number, y?: number) => {
      idCounterRef.current += 1;
      const chosenText = text || ROMANTIC_WHISPERS[Math.floor(Math.random() * ROMANTIC_WHISPERS.length)];
      const targetX = x ?? (dimsRef.current.w * 0.2 + Math.random() * dimsRef.current.w * 0.6);
      const targetY = y ?? (dimsRef.current.h * 0.4 + Math.random() * dimsRef.current.h * 0.3);

      whispersRef.current.push({
        id: idCounterRef.current,
        text: chosenText,
        x: targetX,
        y: targetY,
        opacity: 1,
        vy: -0.65 - Math.random() * 0.4,
        life: 0,
        maxLife: 150,
      });
    };

    const triggerHeartbeatPulse = (x?: number, y?: number) => {
      const targetX = x ?? dimsRef.current.w / 2;
      const targetY = y ?? dimsRef.current.h / 2;

      pulseWavesRef.current.push({
        x: targetX,
        y: targetY,
        radius: 10,
        maxRadius: Math.min(dimsRef.current.w, dimsRef.current.h) * 0.65,
        opacity: 0.9,
        color: '#ff2a6d',
      });

      pulseWavesRef.current.push({
        x: targetX,
        y: targetY,
        radius: 5,
        maxRadius: Math.min(dimsRef.current.w, dimsRef.current.h) * 0.45,
        opacity: 0.7,
        color: '#ffd166',
      });
    };

    // Burst from specific location (e.g. tap)
    const burstFrom = (x: number, y: number, count = 80) => {
      triggerHeartbeatPulse(x, y);
      spawnWhisper(undefined, x, y - 20);

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 14 + 3;
        const isBig = Math.random() > 0.82;
        const size = isBig ? Math.random() * 24 + 26 : Math.random() * 18 + 12;

        addParticle({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (Math.random() * 4 + 2), // upward bias
          size,
          maxLife: Math.random() * 170 + 130,
        });
      }
    };

    // Shower hearts coming from EVERYWHERE: bottom fountain, top rain, left/right inwards, and center
    const showerFromEverywhere = (count = 280) => {
      const { w, h } = dimsRef.current;
      if (w === 0 || h === 0) return;

      triggerHeartbeatPulse(w / 2, h / 2);
      spawnWhisper('Come soon, okay? ✨', w / 2, h * 0.45);

      // 1. Bottom fountains shooting up (majestic firework fountains of hearts & petals)
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
          maxLife: Math.random() * 230 + 160,
        });
      }

      // 2. Top shower cascading gently down like romantic rain of petals and hearts
      const topCount = Math.floor(count * 0.25);
      for (let i = 0; i < topCount; i++) {
        const startX = Math.random() * w;
        addParticle({
          x: startX,
          y: -20 - Math.random() * 80,
          vx: (Math.random() - 0.5) * 4,
          vy: Math.random() * 4 + 2.5,
          size: Math.random() * 26 + 12,
          maxLife: Math.random() * 270 + 190,
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
          maxLife: Math.random() * 210 + 150,
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
          maxLife: Math.random() * 210 + 150,
        });
      }

      // 5. Center explosion
      const centerCount = Math.floor(count * 0.1);
      burstFrom(w / 2, h / 2, centerCount);
    };

    const clear = () => {
      particlesRef.current = [];
      whispersRef.current = [];
      pulseWavesRef.current = [];
    };

    useImperativeHandle(ref, () => ({
      burstFrom,
      showerFromEverywhere,
      spawnWhisper,
      triggerHeartbeatPulse,
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

        // 2. Render expanding Heartbeat pulse rings
        const waves = pulseWavesRef.current;
        for (let i = waves.length - 1; i >= 0; i--) {
          const wave = waves[i];
          wave.radius += 4;
          const progress = wave.radius / wave.maxRadius;
          wave.opacity = Math.max(0, (1 - progress) * 0.85);

          if (progress >= 1 || wave.opacity <= 0.01) {
            waves.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.beginPath();
          ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
          ctx.strokeStyle = wave.color;
          ctx.lineWidth = 2.5;
          ctx.globalAlpha = wave.opacity;
          ctx.shadowColor = wave.color;
          ctx.shadowBlur = 15;
          ctx.stroke();
          ctx.restore();
        }

        // Periodically spawn gentle ambient drifting hearts/petals in background
        ambientHeartTimer += dt;
        if (ambientHeartTimer > 0.45 && particlesRef.current.length < 320) {
          ambientHeartTimer = 0;
          addParticle({
            x: Math.random() * w,
            y: h + 20,
            vx: (Math.random() - 0.5) * 1.5,
            vy: -Math.random() * 1.8 - 0.8,
            size: Math.random() * 16 + 10,
            opacity: Math.random() * 0.45 + 0.3,
            maxLife: Math.random() * 300 + 200,
          });
        }

        // 3. Render and update active heart & petal particles
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
          p.vy += p.type === 'petal' ? 0.04 : 0.08; // petals drift softer
          p.x += p.vx + Math.sin(p.life * p.wobbleSpeed + p.wobbleOffset) * (p.type === 'petal' ? 1.4 : 0.75);
          p.y += p.vy;
          p.rotation += p.vRot;

          // 3D paper / petal flutter simulation
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
          } else if (p.type === 'petal') {
            drawPetal(ctx, p.size);
            ctx.fill();
          } else {
            drawSparkle(ctx, p.size * 0.8);
            ctx.fill();
          }

          ctx.restore();
        }

        // 4. Render Floating Whispers
        const whispers = whispersRef.current;
        for (let i = whispers.length - 1; i >= 0; i--) {
          const wh = whispers[i];
          wh.life += 1;
          wh.y += wh.vy;

          const progress = wh.life / wh.maxLife;
          const alpha = progress < 0.2
            ? progress / 0.2
            : progress > 0.7
            ? (1 - progress) / 0.3
            : 1;

          if (progress >= 1) {
            whispers.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.font = 'italic 500 16px "Playfair Display", Georgia, serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#ffe5ec';
          ctx.shadowColor = '#ff2a6d';
          ctx.shadowBlur = 10;
          ctx.globalAlpha = Math.max(0, alpha * 0.95);
          ctx.fillText(wh.text, wh.x, wh.y);
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
      burstFrom(x, y, 45);
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

