export type Phase = 'waiting' | 'showering' | 'revealed';

export interface HeartParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  rotation: number;
  vRot: number;
  wobbleSpeed: number;
  wobbleOffset: number;
  life: number;
  maxLife: number;
  scaleX: number;
  scaleY: number;
  type: 'heart' | 'sparkle' | 'petal' | 'glow';
}

export interface AmbientParticle {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  baseOpacity: number;
  sinOffset: number;
  color: string;
}

export interface FloatingWhisper {
  id: number;
  text: string;
  x: number;
  y: number;
  opacity: number;
  vy: number;
  life: number;
  maxLife: number;
}
