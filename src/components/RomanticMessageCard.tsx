import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles, RotateCcw, Volume2, VolumeX, Check } from 'lucide-react';

interface RomanticMessageCardProps {
  onShowerAgain: () => void;
  onReset: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const RomanticMessageCard: React.FC<RomanticMessageCardProps> = ({
  onShowerAgain,
  onReset,
  isMuted,
  onToggleMute,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <motion.div
      id="romantic-message-container"
      initial={{ opacity: 0, scale: 0.85, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-30 w-full max-w-lg px-4 mx-auto my-auto"
    >
      {/* Glow aura behind card */}
      <div className="absolute -inset-1 bg-gradient-to-r from-rose-600/30 via-pink-500/20 to-rose-700/30 rounded-3xl blur-2xl -z-10 pointer-events-none" />

      {/* Glassmorphic Romantic Parchment Card */}
      <div className="relative overflow-hidden rounded-3xl border border-rose-400/30 bg-gradient-to-b from-[#1f0614]/90 via-[#180410]/95 to-[#12020d]/95 p-6 sm:p-8 md:p-10 shadow-2xl shadow-rose-950/80 backdrop-blur-xl">
        
        {/* Subtle decorative floral/corner flourishes */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top Floating Mini Heart Badge */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs font-medium tracking-wide">
            <Heart className="w-3 h-3 fill-rose-400 text-rose-400 animate-pulse" />
            <span>Forever Special</span>
          </div>

          <button
            id="audio-toggle-btn"
            onClick={onToggleMute}
            aria-label={isMuted ? 'Unmute romantic sound' : 'Mute romantic sound'}
            className="flex items-center gap-1 p-2 rounded-full border border-rose-500/20 bg-rose-950/40 text-rose-300 hover:text-rose-100 hover:border-rose-400/40 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-rose-300" />}
          </button>
        </div>

        {/* The Exact User Requested Climax Title */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-script text-rose-300/80 text-2xl sm:text-3xl mb-1"
          >
            A Whisper For You
          </motion.div>

          <motion.h1
            id="vaishu-revelation-heading"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="font-serif-romantic text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white drop-shadow-[0_2px_18px_rgba(244,63,94,0.45)]"
          >
            &ldquo;Hey Vaishu, See this&rdquo;
          </motion.h1>

          <div className="flex items-center justify-center gap-3 my-4">
            <span className="w-12 h-[1px] bg-gradient-to-r from-transparent to-rose-400/50" />
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
            <span className="w-12 h-[1px] bg-gradient-to-l from-transparent to-rose-400/50" />
          </div>
        </div>

        {/* Romantic Letter Body */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="relative text-center mb-7 px-2"
        >
          <p className="font-serif-romantic italic text-rose-100/90 text-base sm:text-lg leading-relaxed font-light">
            &ldquo;From the moment you stepped into my life, every heartbeat feels like a celebration. May this endless shower of hearts remind you how deeply and endlessly you are cherished, today and always. ❤️&rdquo;
          </p>
        </motion.div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {/* Shower More Hearts Button */}
          <button
            id="shower-again-btn"
            onClick={onShowerAgain}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 hover:from-rose-400 hover:via-rose-500 hover:to-pink-500 text-white font-medium text-sm shadow-lg shadow-rose-600/40 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Shower More Hearts</span>
          </button>

          {/* Replay Tap Trigger */}
          <button
            id="replay-experience-btn"
            onClick={onReset}
            title="Replay from the beginning"
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-5 py-3 rounded-2xl border border-rose-400/30 bg-rose-950/40 hover:bg-rose-900/50 text-rose-200 text-xs font-medium active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay</span>
          </button>
        </div>

        {/* Micro hint & Share */}
        <div className="mt-6 pt-4 border-t border-rose-500/15 flex items-center justify-between text-[11px] text-rose-300/50 font-light">
          <span>Tip: Tap anywhere on screen to spawn hearts</span>
          <button
            onClick={handleCopyLink}
            className="text-rose-300/80 hover:text-rose-200 flex items-center gap-1 underline underline-offset-2 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Link Copied!</span>
              </>
            ) : (
              <span>Share Page</span>
            )}
          </button>
        </div>

      </div>
    </motion.div>
  );
};
