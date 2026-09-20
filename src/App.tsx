import React, { useState, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { HeartCanvas, HeartCanvasHandle } from './components/HeartCanvas';
import { RomanticInitialView } from './components/RomanticInitialView';
import { RomanticMessageCard } from './components/RomanticMessageCard';
import { romanticAudio } from './utils/audio';
import { Phase } from './types';

export default function App() {
  const [phase, setPhase] = useState<Phase>('waiting');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const canvasRef = useRef<HeartCanvasHandle | null>(null);
  const timerRef = useRef<number | null>(null);

  const handleFirstTap = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (phase !== 'waiting') return;

    // Get tap coordinate
    let clientX = window.innerWidth / 2;
    let clientY = window.innerHeight / 2;

    if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }

    // Trigger audio effects
    romanticAudio.playHeartbeat();
    setTimeout(() => {
      romanticAudio.playRomanticCascade();
    }, 180);

    // Trigger massive heart burst & everywhere shower
    canvasRef.current?.burstFrom(clientX, clientY, 90);
    canvasRef.current?.showerFromEverywhere(320);

    setPhase('showering');

    // Reveal the grand climax card after hearts have spread and showered across screen
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setPhase('revealed');
    }, 2400);
  }, [phase]);

  const handleShowerAgain = useCallback(() => {
    romanticAudio.playRomanticCascade();
    canvasRef.current?.showerFromEverywhere(260);
  }, []);

  const handleReset = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    canvasRef.current?.clear();
    setPhase('waiting');
  }, []);

  const handleToggleMute = useCallback(() => {
    const next = !isMuted;
    setIsMuted(next);
    romanticAudio.isMuted = next;
  }, [isMuted]);

  return (
    <main
      id="app-root"
      className="relative w-screen h-screen overflow-hidden bg-gradient-to-br from-[#12020a] via-[#240516] to-[#0c0107] text-[#fce7f3] flex items-center justify-center"
    >
      {/* Dynamic Romantic Background Lighting */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Soft Radial Ambient Lights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-rose-600/12 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-1/4 w-[400px] h-[400px] bg-pink-700/10 rounded-full blur-[120px]" />
        <div className="absolute top-10 right-1/4 w-[400px] h-[400px] bg-amber-600/8 rounded-full blur-[130px]" />
      </div>

      {/* Interactive 60FPS Heart & Sparkle Canvas */}
      <HeartCanvas ref={canvasRef} interactive={true} />

      {/* Screen States */}
      <AnimatePresence mode="wait">
        {phase === 'waiting' && (
          <motion.div
            key="initial-view"
            className="w-full h-full flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.08, filter: 'blur(8px)' }}
            transition={{ duration: 0.6 }}
          >
            <RomanticInitialView onTap={handleFirstTap} />
          </motion.div>
        )}

        {phase === 'revealed' && (
          <motion.div
            key="revealed-view"
            className="w-full h-full flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <RomanticMessageCard
              onShowerAgain={handleShowerAgain}
              onReset={handleReset}
              isMuted={isMuted}
              onToggleMute={handleToggleMute}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
