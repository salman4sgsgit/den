import React from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles } from 'lucide-react';

interface RomanticInitialViewProps {
  onTap: (e: React.MouseEvent | React.TouchEvent) => void;
}

export const RomanticInitialView: React.FC<RomanticInitialViewProps> = ({ onTap }) => {
  return (
    <div
      id="initial-tap-screen"
      onClick={onTap}
      className="relative z-20 flex flex-col items-center justify-center min-h-screen px-6 text-center cursor-pointer select-none"
    >
      {/* Soft atmospheric background glow */}
      <div className="absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-rose-600/15 blur-[120px] pointer-events-none -z-10" />

      {/* Gentle Header Tag */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-rose-400/20 bg-rose-950/40 backdrop-blur-md mb-8 text-rose-200/90 text-xs sm:text-sm font-medium tracking-wide shadow-lg shadow-rose-950/50"
      >
        <Sparkles className="w-3.5 h-3.5 text-rose-300 animate-spin" style={{ animationDuration: '6s' }} />
        <span>A Secret Just For You 🌸</span>
      </motion.div>

      {/* Main Interactive Pulsing Heart Container */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="relative group flex items-center justify-center mb-8"
      >
        {/* Pulsing Ripple rings */}
        <div className="absolute w-48 h-48 sm:w-60 sm:h-60 rounded-full border border-rose-500/25 animate-ping" style={{ animationDuration: '3s' }} />
        <div className="absolute w-36 h-36 sm:w-48 sm:h-48 rounded-full bg-gradient-to-tr from-rose-600/30 via-pink-500/25 to-amber-500/15 blur-xl animate-pulse-heart" />

        {/* Heart Seal Button */}
        <div
          id="tap-heart-trigger"
          className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-rose-500 via-rose-600 to-pink-700 flex items-center justify-center shadow-2xl shadow-rose-900/80 border-2 border-rose-300/40 transform transition-transform duration-300 group-hover:scale-110 active:scale-95"
        >
          <Heart className="w-14 h-14 sm:w-18 sm:h-18 text-white fill-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)] animate-pulse-heart" />
        </div>
      </motion.div>

      {/* Romantic Headline */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="max-w-md mx-auto"
      >
        <h1 className="font-serif-romantic text-3xl sm:text-4xl md:text-5xl text-rose-50 font-normal tracking-tight mb-3">
          Touch To Begin
        </h1>
        <p className="text-rose-200/75 text-sm sm:text-base font-light tracking-wide">
          Tap anywhere to unlock the heart shower waiting for you
        </p>
      </motion.div>

      {/* Hint Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="mt-10 flex items-center gap-2 text-xs uppercase tracking-widest text-rose-400/60"
      >
        <span className="w-8 h-[1px] bg-rose-400/30" />
        <span>Single Tap • Sound Recommended</span>
        <span className="w-8 h-[1px] bg-rose-400/30" />
      </motion.div>
    </div>
  );
};
