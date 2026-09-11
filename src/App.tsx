/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { birthdayConfig } from './config/birthdayConfig';
import { StadiumBackground } from './components/StadiumBackground';
import { CinematicIntro } from './components/CinematicIntro';
import { BirthdayHero } from './components/BirthdayHero';
import { RohitMessageSection } from './components/RohitMessageSection';
import { PersonalMessageSection } from './components/PersonalMessageSection';
import { CricketGameSection } from './components/CricketGameSection';
import { WishesSection } from './components/WishesSection';
import { ShareSection } from './components/ShareSection';
import { FloatingNav } from './components/FloatingNav';
import { MusicPlayer } from './components/MusicPlayer';
import { soundEngine } from './utils/audio';

export default function App() {
  // Experience phase: 'intro' | 'main'
  const [showIntro, setShowIntro] = useState(true);
  const [autoStartRohitReveal, setAutoStartRohitReveal] = useState(false);
  const [stadiumIllumination, setStadiumIllumination] = useState<'dark' | 'dim' | 'bright' | 'celebration'>('dim');
  const [experienceKey, setExperienceKey] = useState(0);

  // Transition from Intro to Main website
  const handleOpenSurprise = () => {
    setShowIntro(false);
    setStadiumIllumination('bright');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // From Hero "Tap to Reveal" -> Smooth scroll to Section 3 and trigger reveal
  const handleHeroTapToReveal = () => {
    const el = document.getElementById('message-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setAutoStartRohitReveal(true);
    }
  };

  // When Rohit message finishes, swell stadium lights to celebration
  const handleCelebrationTriggered = () => {
    setStadiumIllumination('celebration');
  };

  // Replay the entire surprise
  const handleReplay = () => {
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    soundEngine.stopAmbientMusic();

    // Reset states after brief smooth scroll
    setTimeout(() => {
      setShowIntro(true);
      setAutoStartRohitReveal(false);
      setStadiumIllumination('dim');
      setExperienceKey((prev) => prev + 1);
    }, 600);
  };

  return (
    <div key={experienceKey} className="min-h-screen text-slate-100 relative selection:bg-blue-600/40 selection:text-cyan-200 bg-black">
      {/* Cinematic Stadium Background - Persistent */}
      <StadiumBackground illuminationLevel={stadiumIllumination} />

      {/* SECTION 1: Full-Screen Cinematic Intro Modal / Overlay */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
            className="fixed inset-0 z-50"
          >
            <CinematicIntro onOpenSurprise={handleOpenSurprise} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Experience Flow */}
      {!showIntro && (
        <main className="relative z-10 w-full overflow-x-hidden">
          {/* Floating Navigation Dock */}
          <FloatingNav />

          {/* Floating Ambient Music Player */}
          <MusicPlayer />

          {/* SECTION 2: Birthday Hero */}
          <BirthdayHero onTapToReveal={handleHeroTapToReveal} />

          {/* SECTION 3 & 4: Rohit Sharma Inspired Birthday Message & Celebration */}
          <RohitMessageSection
            autoStartReveal={autoStartRohitReveal}
            onCelebrationTriggered={handleCelebrationTriggered}
          />

          {/* SECTION 5: Personal Message */}
          <PersonalMessageSection />

          {/* SECTION 6: Interactive Cricket Game */}
          <CricketGameSection />

          {/* SECTION 7: Birthday Wishes */}
          <WishesSection />

          {/* SECTION 8: Share This Birthday Surprise */}
          <ShareSection />

          {/* Footer with tasteful signoff & Replay action */}
          <footer className="relative py-14 px-4 text-center border-t border-blue-950/80 bg-black/95 text-xs text-slate-500 font-mono space-y-4">
            {/* Replay Surprise Button */}
            <div>
              <button
                id="replay-surprise-btn"
                onClick={handleReplay}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-black via-blue-950 to-black hover:border-cyan-400 text-cyan-300 font-athletic font-bold text-base tracking-wider uppercase border border-blue-500/40 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(56,189,248,0.5)] transition-all cursor-pointer inline-flex items-center gap-2.5"
              >
                <span>🔄 Replay Birthday Surprise</span>
              </button>
            </div>

            <p className="text-slate-400">
              Created with 💙 for <span className="text-cyan-300 font-athletic text-base tracking-wide font-bold">{birthdayConfig.friendName}</span>
            </p>
            <p className="text-[11px] text-slate-600 max-w-md mx-auto">
              Fictional fan-made cricket tribute. Not affiliated with or endorsed by Rohit Sharma.
            </p>
          </footer>
        </main>
      )}
    </div>
  );
}
