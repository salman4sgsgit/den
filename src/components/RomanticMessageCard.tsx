import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, RotateCcw, Volume2, VolumeX, Check, Clock, Send } from 'lucide-react';
import { romanticAudio } from '../utils/audio';

interface RomanticMessageCardProps {
  onShowerAgain: () => void;
  onReset: () => void;
  onSendHeartbeat: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const RomanticMessageCard: React.FC<RomanticMessageCardProps> = ({
  onShowerAgain,
  onReset,
  onSendHeartbeat,
  isMuted,
  onToggleMute,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [heartbeatSent, setHeartbeatSent] = useState<boolean>(false);
  const [heartbeatCount, setHeartbeatCount] = useState<number>(0);

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleTriggerHeartbeat = () => {
    romanticAudio.playHeartbeat(true);
    romanticAudio.playComingSoonMelody();
    onSendHeartbeat();
    setHeartbeatCount((prev) => prev + 1);
    setHeartbeatSent(true);
    setTimeout(() => {
      setHeartbeatSent(false);
    }, 3200);
  };

  return (
    <motion.div
      id="romantic-message-container"
      initial={{ opacity: 0, scale: 0.88, y: 35 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-30 w-full max-w-xl px-4 mx-auto my-auto"
    >
      {/* Dynamic ambient halo */}
      <div className="absolute -inset-2 bg-gradient-to-r from-rose-600/30 via-pink-500/25 to-amber-500/15 rounded-[36px] blur-2xl -z-10 pointer-events-none" />

      {/* Glassmorphic Romantic Card */}
      <div className="relative overflow-hidden rounded-[32px] border border-rose-400/30 bg-gradient-to-b from-[#210515]/95 via-[#180310]/95 to-[#0e020a]/98 p-6 sm:p-8 md:p-10 shadow-2xl shadow-rose-950/90 backdrop-blur-2xl">
        
        {/* Soft decorative background glows */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-44 h-44 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Badge */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-950/70 border border-rose-500/30 text-rose-300 text-xs font-medium tracking-wide">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
            </span>
            <Heart className="w-3 h-3 fill-rose-400 text-rose-400 animate-pulse" />
            <span>Missing You Every Second</span>
          </div>

          <button
            id="audio-toggle-btn"
            onClick={onToggleMute}
            aria-label={isMuted ? 'Unmute romantic sound' : 'Mute romantic sound'}
            className="flex items-center gap-1.5 p-2 px-3 rounded-full border border-rose-500/20 bg-rose-950/50 text-rose-300 hover:text-rose-100 hover:border-rose-400/40 transition-colors text-xs"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-rose-300 animate-pulse" />}
            <span>{isMuted ? 'Muted' : 'Music On'}</span>
          </button>
        </div>

        {/* The Exact User Requested Climax Title */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8 }}
            className="font-script text-rose-300/90 text-2xl sm:text-3xl mb-1"
          >
            A whisper straight from my heart...
          </motion.div>

          <motion.h1
            id="vaishu-revelation-heading"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.45, duration: 1 }}
            className="font-serif-romantic text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white drop-shadow-[0_4px_22px_rgba(244,63,94,0.55)]"
          >
            &ldquo;Hey Vaishu, See this&rdquo;
          </motion.h1>

          <div className="flex items-center justify-center gap-3 my-4">
            <span className="w-14 h-[1px] bg-gradient-to-r from-transparent via-rose-400/50 to-rose-400/80" />
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
            <span className="w-14 h-[1px] bg-gradient-to-l from-transparent via-rose-400/50 to-rose-400/80" />
          </div>
        </div>

        {/* Romantic Letter Verses: Pure romance & longing without saying "love you" or proposing */}
        <div className="space-y-3.5 mb-7 text-center px-1">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.8 }}
            className="font-serif-romantic text-rose-100/95 text-base sm:text-lg leading-relaxed font-light"
          >
            The world feels just a little too quiet, a little too still, and way too ordinary when you&apos;re not around.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.8 }}
            className="font-serif-romantic text-rose-200/85 text-sm sm:text-base leading-relaxed font-light italic"
          >
            Everything feels warmer, lighter, and truly complete the moment your smile walks into the room.
          </motion.p>
        </div>

        {/* Animated Highlight Box: "Come Soon" Callout */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.05, duration: 0.9 }}
          className="relative overflow-hidden rounded-2xl border border-rose-400/40 bg-gradient-to-r from-rose-950/80 via-pink-950/60 to-rose-950/80 p-4 sm:p-5 mb-7 shadow-inner shadow-rose-900/40"
        >
          {/* Pulsing subtle glow behind the box */}
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 via-pink-500/15 to-rose-500/10 animate-pulse" style={{ animationDuration: '3.5s' }} />

          <div className="relative flex flex-col items-center text-center">
            <div className="flex items-center gap-2 mb-1.5 text-rose-300">
              <Clock className="w-4 h-4 text-rose-300 animate-spin" style={{ animationDuration: '14s' }} />
              <span className="font-script text-xl sm:text-2xl text-rose-200">Please Don&apos;t Make Me Wait</span>
            </div>

            <div className="text-xl sm:text-2xl font-serif-romantic font-semibold text-white tracking-wide mb-1 drop-shadow-[0_2px_12px_rgba(244,63,94,0.4)]">
              Come soon, okay? 🌸
            </div>

            <p className="text-xs sm:text-sm text-rose-200/80 font-light max-w-sm">
              I find myself counting down every second... waiting for the moment you&apos;re finally right here.
            </p>
          </div>
        </motion.div>

        {/* Interactive Heartbeat Button: Send a pulse to hurry her back */}
        <div className="mb-6">
          <motion.button
            id="send-heartbeat-btn"
            onClick={handleTriggerHeartbeat}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            className="w-full relative group overflow-hidden flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 hover:from-rose-500 hover:to-pink-500 text-white font-medium text-sm sm:text-base shadow-lg shadow-rose-600/50 border border-rose-300/30 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            <span className="tracking-wide">Send A Heartbeat To Hurry You Back</span>
            <Heart className="w-4 h-4 fill-white animate-pulse" />
          </motion.button>

          {/* Heartbeat notification feedback toast */}
          <AnimatePresence>
            {heartbeatSent && (
              <motion.div
                initial={{ opacity: 0, y: -6, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -6, height: 0 }}
                className="mt-2.5 text-center"
              >
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs font-light">
                  <Sparkles className="w-3 h-3 text-amber-300 animate-spin" />
                  <span>Heartbeat #{heartbeatCount} sent through the wind... Hurry back, Vaishu ✨</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Secondary Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {/* Shower More Hearts & Petals Button */}
          <button
            id="shower-again-btn"
            onClick={onShowerAgain}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-rose-950/60 hover:bg-rose-900/60 border border-rose-500/30 text-rose-100 font-medium text-xs sm:text-sm active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Shower More Hearts &amp; Petals</span>
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
          <span>Tap anywhere on screen to release whispers &amp; petals</span>
          <button
            onClick={handleCopyLink}
            className="text-rose-300/80 hover:text-rose-200 flex items-center gap-1 underline underline-offset-2 transition-colors cursor-pointer"
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

