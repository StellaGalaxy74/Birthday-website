import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { birthdayConfig } from '../config/birthdayConfig';
import { CricketBall } from './CricketBall';
import { soundEngine } from '../utils/audio';
import { Trophy, Flame, RotateCcw } from 'lucide-react';

export const CricketGameSection: React.FC = () => {
  const [gameState, setGameState] = useState<'ready' | 'swinging' | 'six' | 'celebrating'>('ready');
  const [hitDistance, setHitDistance] = useState<number>(108);

  const handleSwing = () => {
    if (gameState === 'swinging') return;

    // Trigger realistic cricket bat thwack sound & set swinging
    soundEngine.playBatThwack();
    setGameState('swinging');

    // Randomize dramatic six distance between 102m and 124m
    const distance = Math.floor(Math.random() * 22) + 104;
    setHitDistance(distance);

    // After bat impacts, ball launches and "SIX!" appears
    setTimeout(() => {
      setGameState('six');
      soundEngine.playCrowdCheer();

      // Confetti burst in blue & black celebration palette
      confetti({
        particleCount: 85,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#38bdf8', '#60a5fa', '#ffffff', '#1d4ed8'],
      });
    }, 450);

    setTimeout(() => {
      setGameState('celebrating');
    }, 1800);
  };

  const handleReset = () => {
    setGameState('ready');
  };

  return (
    <section
      id="cricket-game-section"
      className="relative min-h-screen py-24 px-4 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background Stadium Glow on Six */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
          gameState === 'six' || gameState === 'celebrating' ? 'opacity-80' : 'opacity-20'
        }`}
      >
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[520px] bg-gradient-to-b from-blue-600/30 via-cyan-500/15 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto w-full flex flex-col items-center text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-3 mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/50 text-cyan-300 text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <Trophy className="w-3.5 h-3.5 text-cyan-400" />
            <span>MATCH DECIDING OVER</span>
          </div>

          <h2 className="font-athletic text-4xl sm:text-6xl font-bold text-white tracking-tight">
            ONE FINAL CHALLENGE FOR THE BIRTHDAY BOY… 🏏
          </h2>

          <p className="text-cyan-400 text-2xl sm:text-3xl font-athletic font-bold tracking-wide">
            HIT THE BIRTHDAY SIX!
          </p>
        </motion.div>

        {/* Stadium Pitch Interactive Arena Card */}
        <div className="glass-card w-full rounded-3xl p-6 sm:p-10 border border-blue-500/35 bg-black/90 shadow-[0_0_45px_rgba(37,99,235,0.35)] relative overflow-hidden flex flex-col items-center">
          {/* Animated Stadium Scene Canvas */}
          <div className="w-full h-64 sm:h-72 bg-gradient-to-b from-[#020617] to-[#03152d] rounded-2xl relative overflow-hidden border border-blue-900/60 flex items-center justify-center">
            {/* Pitch surface perspective lines */}
            <div className="absolute bottom-0 w-48 sm:w-60 h-40 bg-[#0f2747]/40 border-x border-cyan-400/30 transform -perspective-x" />
            <div className="absolute bottom-6 w-52 h-0.5 bg-cyan-300/50" />

            {/* Stumps */}
            <div className="absolute bottom-8 flex gap-1.5 opacity-90">
              <div className="w-1.5 h-12 bg-cyan-300 rounded-t-sm shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
              <div className="w-1.5 h-12 bg-cyan-300 rounded-t-sm shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
              <div className="w-1.5 h-12 bg-cyan-300 rounded-t-sm shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
            </div>

            {/* Batsman & Bat Animation */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-end">
              {/* Bat SVG */}
              <motion.div
                className="origin-bottom-left"
                animate={
                  gameState === 'swinging' || gameState === 'six' || gameState === 'celebrating'
                    ? { rotate: [-20, 85, 30] }
                    : { rotate: [-15, -25, -15] }
                }
                transition={
                  gameState === 'swinging'
                    ? { duration: 0.35, ease: 'easeInOut' }
                    : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }
                }
              >
                <svg width="40" height="90" viewBox="0 0 40 90" fill="none">
                  {/* Handle */}
                  <rect x="17" y="5" width="6" height="35" rx="3" fill="#cbd5e1" stroke="#334155" strokeWidth="1" />
                  {/* Grip coils in electric blue */}
                  <line x1="17" y1="12" x2="23" y2="12" stroke="#2563eb" strokeWidth="1.5" />
                  <line x1="17" y1="18" x2="23" y2="18" stroke="#2563eb" strokeWidth="1.5" />
                  <line x1="17" y1="24" x2="23" y2="24" stroke="#2563eb" strokeWidth="1.5" />
                  {/* Blade */}
                  <rect x="12" y="38" width="16" height="48" rx="4" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
                  {/* Highlight */}
                  <line x1="16" y1="42" x2="16" y2="82" stroke="#0ea5e9" strokeWidth="1.5" />
                  <line x1="24" y1="42" x2="24" y2="82" stroke="#38bdf8" strokeWidth="1" opacity="0.8" />
                  {/* Blue sticker */}
                  <rect x="14" y="44" width="12" height="10" fill="#2563eb" rx="1" />
                </svg>
              </motion.div>
            </div>

            {/* Ball trajectory animation */}
            <AnimatePresence>
              {gameState === 'ready' && (
                <motion.div
                  className="absolute bottom-16 left-1/2 -translate-x-1/2"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  <CricketBall size={32} spinning={false} />
                </motion.div>
              )}

              {(gameState === 'swinging' || gameState === 'six' || gameState === 'celebrating') && (
                <motion.div
                  className="absolute z-20"
                  initial={{ left: '50%', bottom: '50px', scale: 1, opacity: 1 }}
                  animate={{
                    left: ['50%', '58%', '85%'],
                    bottom: ['50px', '220px', '320px'],
                    scale: [1, 1.4, 0.4],
                    opacity: [1, 1, 0],
                  }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                >
                  <CricketBall size={36} spinning={true} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* "SIX!" Dramatic overlay burst */}
            <AnimatePresence>
              {(gameState === 'six' || gameState === 'celebrating') && (
                <motion.div
                  initial={{ scale: 0, rotate: -25, opacity: 0 }}
                  animate={{ scale: [0, 1.3, 1], rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.5, ease: 'backOut' }}
                  className="absolute z-30 flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-black/90 backdrop-blur-md border-2 border-cyan-400 shadow-[0_0_35px_rgba(56,189,248,0.7)]"
                >
                  <span className="font-athletic text-6xl sm:text-8xl font-black text-cyan-300 drop-shadow-[0_0_35px_rgba(56,189,248,0.95)] tracking-wider">
                    SIX! 🚀
                  </span>
                  <span className="text-xs sm:text-sm font-mono text-white tracking-widest uppercase mt-1 bg-blue-600 px-3 py-0.5 rounded-full font-bold shadow-[0_0_15px_rgba(37,99,235,0.7)]">
                    OUT OF THE STADIUM &bull; {hitDistance} METERS
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action button & outcome feedback */}
          <div className="mt-8 w-full flex flex-col items-center">
            {gameState === 'ready' && (
              <motion.button
                id="swing-cricket-bat-btn"
                onClick={handleSwing}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 hover:from-blue-500 hover:to-cyan-300 text-black font-extrabold text-xl tracking-wider shadow-[0_0_35px_rgba(59,130,246,0.65)] cursor-pointer flex items-center gap-3 transition-transform"
              >
                <span className="text-2xl">🏏</span>
                <span className="font-athletic text-2xl tracking-wide">SWING FOR SIX!</span>
              </motion.button>
            )}

            {(gameState === 'six' || gameState === 'celebrating') && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 text-center max-w-lg"
              >
                <div className="p-5 rounded-xl bg-blue-950/70 border border-blue-500/40 shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                  <p className="font-athletic text-2xl sm:text-3xl font-bold text-cyan-300 tracking-wide">
                    "LOOKS LIKE {birthdayConfig.friendName.toUpperCase()} IS STARTING THIS NEW YEAR WITH A SIX! 🎉🏏"
                  </p>
                  <p className="text-xs text-blue-200 mt-2 font-mono">
                    Classic Hitman pull shot dispatched high into the floodlit night sky!
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={handleReset}
                    className="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-mono tracking-wider uppercase border border-blue-900 flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Hit Another Six</span>
                  </button>

                  <button
                    onClick={handleSwing}
                    className="px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                  >
                    <Flame className="w-3.5 h-3.5 text-black" />
                    <span>Swing Again</span>
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
