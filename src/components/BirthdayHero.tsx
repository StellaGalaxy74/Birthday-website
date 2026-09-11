import React from 'react';
import { motion } from 'motion/react';
import { birthdayConfig } from '../config/birthdayConfig';
import { CricketBall } from './CricketBall';
import { Mic, ChevronDown, Sparkles, Flame } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface BirthdayHeroProps {
  onTapToReveal: () => void;
}

export const BirthdayHero: React.FC<BirthdayHeroProps> = ({ onTapToReveal }) => {
  const handleClick = () => {
    soundEngine.playCelebrationChime();
    onTapToReveal();
  };

  return (
    <section
      id="hero-section"
      className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-20 px-4 text-center overflow-hidden bg-black text-slate-100"
    >
      {/* Decorative floating balloons in Blue & Cyan palette */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Balloon 1 - Electric Blue */}
        <motion.div
          className="absolute left-[6%] top-[22%] opacity-40 md:opacity-75"
          animate={{ y: [0, -35, 0], x: [0, 8, 0], rotate: [0, 4, -4, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-12 h-16 rounded-full bg-gradient-to-tr from-blue-800 via-blue-600 to-cyan-400 shadow-[0_4px_20px_rgba(37,99,235,0.5)] relative">
            <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-950" />
            <div className="absolute bottom-[-30px] left-1/2 w-0.5 h-6 bg-cyan-400/40" />
          </div>
        </motion.div>

        {/* Balloon 2 - Cyan & Ice Blue */}
        <motion.div
          className="absolute right-[8%] top-[26%] opacity-40 md:opacity-75"
          animate={{ y: [0, -45, 0], x: [0, -10, 0], rotate: [0, -5, 5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <div className="w-14 h-18 rounded-full bg-gradient-to-tr from-cyan-700 via-sky-500 to-blue-200 shadow-[0_4px_20px_rgba(56,189,248,0.5)] relative">
            <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-cyan-950" />
            <div className="absolute bottom-[-35px] left-1/2 w-0.5 h-8 bg-blue-400/40" />
          </div>
        </motion.div>

        {/* Balloon 3 - Deep Midnight Navy */}
        <motion.div
          className="absolute left-[12%] bottom-[18%] opacity-30 md:opacity-60"
          animate={{ y: [0, -25, 0], x: [0, 6, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        >
          <div className="w-10 h-14 rounded-full bg-gradient-to-tr from-blue-950 via-blue-800 to-cyan-600 shadow-[0_4px_15px_rgba(30,58,138,0.4)] relative">
            <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-1 h-1 bg-black" />
            <div className="absolute bottom-[-25px] left-1/2 w-0.5 h-5 bg-blue-400/30" />
          </div>
        </motion.div>

        {/* Tiny stars / glowing particles */}
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-cyan-200/60"
            style={{
              top: `${(i * 23 + 12) % 88}%`,
              left: `${(i * 37 + 5) % 92}%`,
              width: `${(i % 3) + 2}px`,
              height: `${(i % 3) + 2}px`,
              boxShadow: '0 0 10px rgba(56, 189, 248, 0.9)',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto w-full flex flex-col items-center">
        {/* Animated Cricket Ball Icon with Gentle Orbit / Bounce */}
        <motion.div
          className="mb-6 cursor-pointer"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          onClick={() => soundEngine.playBatCrack()}
          title="Click to hear the sweet sound of the willow!"
        >
          <div className="relative">
            <CricketBall size={76} spinning={true} />
            <motion.div
              className="absolute -inset-2 rounded-full border border-cyan-400/50"
              animate={{ scale: [1, 1.25, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 2.4, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/50 text-cyan-300 text-xs sm:text-sm font-semibold tracking-wider uppercase mb-6 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
        >
          <Flame className="w-4 h-4 text-cyan-400 fill-cyan-400" />
          <span>Match Day: A Legend Is Born • Blue & Black Edition</span>
        </motion.div>

        {/* Main Heading in Blue & Black styling */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-athletic text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight leading-[1.02] mb-6 text-white"
        >
          HAPPY BIRTHDAY,{' '}
          <span className="block sm:inline blue-gradient-text">
            {birthdayConfig.friendName}!
          </span>{' '}
          <span className="inline-block animate-bounce">🎉</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg sm:text-2xl text-blue-200/90 max-w-2xl font-light leading-relaxed mb-10"
        >
          Today is all about celebrating you, champion. <span className="text-cyan-400">⚡</span>
        </motion.p>

        {/* Broadcast Reveal Card in Blue & Black */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full max-w-2xl mx-auto glass-card p-6 sm:p-10 rounded-2xl shadow-[0_0_45px_rgba(37,99,235,0.35)] relative overflow-hidden text-center border border-blue-500/40 bg-black/85"
        >
          {/* Top electric blue glow stripe */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent" />

          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <p className="text-cyan-300 text-xs font-mono font-bold tracking-widest uppercase">
              Special Fan Broadcast
            </p>
          </div>

          <h2 className="font-athletic text-3xl sm:text-5xl font-bold text-white mb-3 tracking-wide">
            ROHIT SHARMA’S BIRTHDAY WISH FOR {birthdayConfig.friendName.toUpperCase()}
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8 max-w-xl mx-auto font-normal">
            Step onto the pitch for an exclusive cinematic tribute message crafted in honour of your milestone day.
          </p>

          <motion.button
            id="tap-to-reveal-hero-btn"
            onClick={handleClick}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full max-w-md mx-auto py-4 px-8 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 hover:from-blue-500 hover:to-cyan-300 text-black font-extrabold text-lg sm:text-xl shadow-[0_0_35px_rgba(59,130,246,0.65)] transition-all flex items-center justify-center gap-3 cursor-pointer tracking-wider font-athletic"
          >
            <Mic className="w-5 h-5 text-black animate-pulse" />
            <span>🎙️ TAP TO REVEAL WISH</span>
          </motion.button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="mt-14 flex flex-col items-center opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          onClick={onTapToReveal}
        >
          <span className="text-xs text-blue-300 tracking-widest uppercase font-mono mb-1">
            Scroll to Experience
          </span>
          <ChevronDown className="w-5 h-5 text-cyan-400" />
        </motion.div>
      </div>
    </section>
  );
};

