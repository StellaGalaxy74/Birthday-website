import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { birthdayConfig } from '../config/birthdayConfig';
import { CricketBall } from './CricketBall';
import { soundEngine } from '../utils/audio';
import { Sparkles } from 'lucide-react';

interface CinematicIntroProps {
  onOpenSurprise: () => void;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onOpenSurprise }) => {
  // Sequence stages:
  // 0: Darkness / Initial
  // 1: Stadium floodlights swelling up & ball roll
  // 2: "A Special Birthday Message Awaits You…"
  // 3: "Happy Birthday, Ullas ❤️"
  // 4: "A little surprise has been prepared just for you..." + Button
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Timed cinematic pacing
    const t1 = setTimeout(() => setStep(1), 600);
    const t2 = setTimeout(() => setStep(2), 2000);
    const t3 = setTimeout(() => setStep(3), 4200);
    const t4 = setTimeout(() => setStep(4), 6200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  const handleOpen = () => {
    soundEngine.playCelebrationChime();
    
    // Blue & cyan confetti burst
    confetti({
      particleCount: 75,
      spread: 75,
      origin: { y: 0.7 },
      colors: ['#2563eb', '#38bdf8', '#60a5fa', '#ffffff', '#1d4ed8'],
      disableForReducedMotion: true,
    });

    // Short delay for visual transition
    setTimeout(() => {
      onOpenSurprise();
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-black text-slate-100 px-4 select-none">
      {/* Dynamic Stadium Light Bloom */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0.05 }}
        animate={{ opacity: step >= 1 ? 0.8 : 0.05 }}
        transition={{ duration: 2.5, ease: 'easeOut' }}
      >
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl" />
        <div className="absolute -top-24 right-1/4 w-96 h-96 bg-cyan-500/25 rounded-full blur-3xl" />
        <div className="absolute bottom-10 inset-x-0 h-40 bg-blue-950/30 blur-2xl" />
      </motion.div>

      {/* Floating stars and particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 28 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/40"
            style={{
              top: `${(i * 17) % 95}%`,
              left: `${(i * 23) % 95}%`,
              width: `${(i % 2) + 1}px`,
              height: `${(i % 2) + 1}px`,
              opacity: step >= 1 ? 0.6 : 0.1,
              transition: 'opacity 2s ease-in',
            }}
          />
        ))}
      </div>

      {/* Animated spinning cricket ball across the screen */}
      <AnimatePresence>
        {step >= 1 && step <= 4 && (
          <motion.div
            className="absolute z-10 pointer-events-none"
            initial={{ x: '-60vw', y: '15vh', scale: 0.7, opacity: 0 }}
            animate={{
              x: ['-60vw', '0vw', '60vw'],
              y: ['15vh', '8vh', '18vh'],
              opacity: [0, 1, 0.9],
            }}
            transition={{
              duration: 3.8,
              ease: 'easeInOut',
              times: [0, 0.5, 1],
            }}
          >
            <CricketBall size={56} spinning={true} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Cinematic Text Cards */}
      <div className="relative z-20 max-w-2xl w-full flex flex-col items-center text-center space-y-6">
        {/* Step 2: "A Special Birthday Message Awaits You…" */}
        <AnimatePresence>
          {step >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-950/80 border border-blue-500/50 text-cyan-300 text-xs sm:text-sm font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(37,99,235,0.4)]"
            >
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>A SPECIAL BIRTHDAY MESSAGE AWAITS YOU…</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 3: "Happy Birthday, Ullas ❤️" */}
        <AnimatePresence>
          {step >= 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
              className="space-y-3"
            >
              <h1 className="font-athletic text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight blue-gradient-text drop-shadow-[0_4px_30px_rgba(56,189,248,0.5)]">
                HAPPY BIRTHDAY, {birthdayConfig.friendName.toUpperCase()}
                <span className="text-cyan-400 ml-2 inline-block animate-pulse">💙</span>
              </h1>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 4: "A little surprise has been prepared just for you..." + Open Surprise Button */}
        <AnimatePresence>
          {step >= 4 && (
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3 }}
              className="flex flex-col items-center space-y-6 pt-4"
            >
              <p className="text-blue-200/90 text-base sm:text-xl font-light max-w-md mx-auto leading-relaxed">
                A special stadium experience has been prepared just for you...
              </p>

              {/* Button */}
              <div className="pt-2 flex flex-col items-center">
                <motion.button
                  id="open-surprise-btn"
                  onClick={handleOpen}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  className="group relative px-8 sm:px-12 py-4 sm:py-5 rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 text-black font-extrabold text-lg sm:text-xl font-athletic tracking-wider shadow-[0_0_40px_rgba(37,99,235,0.7)] hover:shadow-[0_0_55px_rgba(56,189,248,0.9)] border-2 border-cyan-300 transition-all duration-300 flex items-center gap-3 cursor-pointer"
                >
                  <span className="text-2xl group-hover:rotate-12 transition-transform duration-300">🎁</span>
                  <span>OPEN YOUR SURPRISE</span>
                </motion.button>

                <p className="text-xs text-blue-300/70 tracking-wider mt-3 font-mono opacity-80 uppercase">
                  Tap to enter stadium
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Skip Intro button in top corner for instant access */}
      <button
        onClick={() => onOpenSurprise()}
        className="absolute top-6 right-6 text-xs text-blue-300/60 hover:text-cyan-300 transition-colors uppercase tracking-wider py-1.5 px-3 rounded-full border border-blue-900/60 bg-blue-950/40"
      >
        Skip Intro &rarr;
      </button>
    </div>
  );
};
