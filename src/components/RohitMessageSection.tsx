import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { birthdayConfig, rohitSpeechLines, DISCLAIMER_TEXT } from '../config/birthdayConfig';
import { CricketBall } from './CricketBall';
import { soundEngine, BirthdayTTS } from '../utils/audio';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  Info,
  Award,
  Flame,
  CheckCircle2,
} from 'lucide-react';

interface RohitMessageSectionProps {
  autoStartReveal?: boolean;
  onCelebrationTriggered?: () => void;
}

export const RohitMessageSection: React.FC<RohitMessageSectionProps> = ({
  autoStartReveal = false,
  onCelebrationTriggered,
}) => {
  // State machine:
  // 'idle': waiting for tap to reveal
  // 'countdown': 3 -> 2 -> 1
  // 'revealing': lines displaying line by line
  // 'completed': celebration triggered
  const [revealStatus, setRevealStatus] = useState<'idle' | 'countdown' | 'revealing' | 'completed'>('idle');
  const [countdownValue, setCountdownValue] = useState<number | null>(null);
  const [visibleLineCount, setVisibleLineCount] = useState<number>(0);
  const [activeSpeakingLine, setActiveSpeakingLine] = useState<number>(-1);

  // Voice player state
  const [isVoicePlaying, setIsVoicePlaying] = useState<boolean>(false);
  const [isVoicePaused, setIsVoicePaused] = useState<boolean>(false);
  const [isVoiceMuted, setIsVoiceMuted] = useState<boolean>(false);

  const ttsRef = useRef<BirthdayTTS | null>(null);
  const timerRefs = useRef<number[]>([]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timerRefs.current.forEach(t => clearTimeout(t));
      if (ttsRef.current) {
        ttsRef.current.stop();
      }
    };
  }, []);

  // Initialize TTS
  useEffect(() => {
    ttsRef.current = new BirthdayTTS(
      (lineIdx) => {
        setActiveSpeakingLine(lineIdx);
        // Ensure that line is visible if voice is speaking ahead
        setVisibleLineCount(prev => Math.max(prev, lineIdx + 1));
      },
      () => {
        setIsVoicePlaying(false);
        setIsVoicePaused(false);
        triggerCompletion();
      }
    );
  }, []);

  // Trigger celebration effects
  const triggerCelebrationFireworks = () => {
    soundEngine.playCelebrationChime();
    soundEngine.playCrowdCheer(4.0); // Stadium crowd roar on milestone celebration

    // Multistage high-energy confetti in blue & black celebration palette
    const end = Date.now() + 3 * 1000;
    const colors = ['#2563eb', '#38bdf8', '#60a5fa', '#ffffff', '#000000', '#1d4ed8'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const triggerCompletion = () => {
    setRevealStatus('completed');
    triggerCelebrationFireworks();
    if (onCelebrationTriggered) {
      onCelebrationTriggered();
    }
  };

  // Start the countdown & line reveal sequence
  const startMessageSequence = () => {
    if (revealStatus !== 'idle') return;

    soundEngine.playCelebrationChime();
    setRevealStatus('countdown');
    setCountdownValue(3);

    const t1 = window.setTimeout(() => {
      setCountdownValue(2);
      soundEngine.playBatCrack();
    }, 1000);

    const t2 = window.setTimeout(() => {
      setCountdownValue(1);
      soundEngine.playBatCrack();
    }, 2000);

    const t3 = window.setTimeout(() => {
      setCountdownValue(null);
      setRevealStatus('revealing');
      setVisibleLineCount(1);
      setActiveSpeakingLine(0);

      // Start revealing lines one by one with smooth dramatic pacing
      rohitSpeechLines.forEach((_, idx) => {
        if (idx === 0) return;
        const delay = idx * 2400;
        const lineTimer = window.setTimeout(() => {
          setVisibleLineCount(idx + 1);
          setActiveSpeakingLine(idx);

          // If reached final line
          if (idx === rohitSpeechLines.length - 1) {
            const finalTimer = window.setTimeout(() => {
              triggerCompletion();
            }, 3000);
            timerRefs.current.push(finalTimer);
          }
        }, delay);
        timerRefs.current.push(lineTimer);
      });
    }, 3000);

    timerRefs.current.push(t1, t2, t3);
  };

  // Voice controls
  const handleToggleVoice = () => {
    if (!ttsRef.current) return;

    if (!isVoicePlaying) {
      setIsVoicePlaying(true);
      setIsVoicePaused(false);
      // Start speaking from active line or beginning
      const startIdx = activeSpeakingLine >= 0 ? activeSpeakingLine : 0;
      ttsRef.current.speakLines(rohitSpeechLines, startIdx);
    } else if (isVoicePaused) {
      ttsRef.current.resume();
      setIsVoicePaused(false);
    } else {
      ttsRef.current.pause();
      setIsVoicePaused(true);
    }
  };

  const handleToggleMute = () => {
    if (!ttsRef.current) return;
    const muted = ttsRef.current.toggleMute();
    setIsVoiceMuted(muted);
  };

  // Auto trigger if requested
  useEffect(() => {
    if (autoStartReveal && revealStatus === 'idle') {
      startMessageSequence();
    }
  }, [autoStartReveal]);

  return (
    <section
      id="message-section"
      className="relative min-h-screen py-24 px-4 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Decorative Stadium Pitch Silhouette & Lighting Graphics */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
        <svg viewBox="0 0 800 800" className="w-[850px] h-[850px] max-w-none select-none">
          {/* Circular pitch boundary */}
          <circle cx="400" cy="400" r="320" fill="none" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="6 8" opacity="0.4" />
          <circle cx="400" cy="400" r="240" fill="none" stroke="#eab308" strokeWidth="1" opacity="0.3" />

          {/* Stylized Bat Silhouettes */}
          <g transform="translate(370, 260) rotate(45) scale(0.7)" opacity="0.25">
            {/* Bat blade */}
            <rect x="25" y="60" width="30" height="140" rx="6" fill="#f8fafc" />
            {/* Bat handle */}
            <rect x="36" y="10" width="8" height="60" rx="4" fill="#cbd5e1" />
            {/* Bat grip wrap lines */}
            <line x1="36" y1="25" x2="44" y2="25" stroke="#475569" strokeWidth="1" />
            <line x1="36" y1="40" x2="44" y2="40" stroke="#475569" strokeWidth="1" />
          </g>

          <g transform="translate(430, 540) rotate(-135) scale(0.7)" opacity="0.25">
            <rect x="25" y="60" width="30" height="140" rx="6" fill="#f8fafc" />
            <rect x="36" y="10" width="8" height="60" rx="4" fill="#cbd5e1" />
          </g>

          {/* Pitch Crease line */}
          <line x1="280" y1="400" x2="520" y2="400" stroke="#38bdf8" strokeWidth="1.5" opacity="0.35" />
          {/* Stumps silhouette */}
          <rect x="388" y="375" width="4" height="25" fill="#f59e0b" opacity="0.5" />
          <rect x="398" y="375" width="4" height="25" fill="#f59e0b" opacity="0.5" />
          <rect x="408" y="375" width="4" height="25" fill="#f59e0b" opacity="0.5" />
          {/* Bails */}
          <rect x="386" y="373" width="28" height="3" rx="1" fill="#fef08a" opacity="0.6" />
        </svg>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto w-full flex flex-col items-center">
        {/* MANDATORY LABELS & DISCLAIMERS */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center space-y-2 mb-8 text-center"
        >
          {/* Fan-Made AI Experience Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/50 text-cyan-300 font-bold text-xs tracking-widest uppercase shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <Award className="w-3.5 h-3.5 text-cyan-400" />
            <span>FAN-MADE AI EXPERIENCE</span>
          </div>

          <p className="text-xs sm:text-sm text-blue-200/80 max-w-xl font-medium">
            This is a fictional birthday experience inspired by Rohit Sharma and created for {birthdayConfig.friendName}.
          </p>

          <div className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 bg-black/80 px-3 py-1 rounded-md border border-blue-900/60">
            <Info className="w-3 h-3 text-blue-400 shrink-0" />
            <span>{DISCLAIMER_TEXT}</span>
          </div>
        </motion.div>

        {/* Section Header in Blue & Black styling */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="space-y-2"
          >
            <h2 className="font-athletic text-4xl sm:text-6xl font-bold text-white tracking-tight">
              Hey {birthdayConfig.friendName}! <span className="inline-block animate-wave">👋</span>
            </h2>
            <p className="text-xl sm:text-3xl text-cyan-400 font-bold font-athletic tracking-wide">
              Wishing you a very Happy Birthday! 🎂🎉
            </p>
          </motion.div>
        </div>

        {/* Main Stadium Glass Broadcast Card */}
        <div className="glass-card w-full rounded-2xl p-6 sm:p-8 border border-blue-500/35 bg-black/90 shadow-[0_0_45px_rgba(37,99,235,0.35)] relative overflow-hidden">
          {/* Top Decorative Match Ribbon */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-blue-900/50 text-xs text-blue-300/80">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="font-mono uppercase tracking-wider text-cyan-300">Live Stadium Broadcast</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-blue-300">
              <Flame className="w-3.5 h-3.5 text-cyan-400" />
              <span>HITMAN INSPIRATION EDITION • #45</span>
            </div>
          </div>

          {/* IDLE STATE: Centered Stadium Broadcast Card */}
          {revealStatus === 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto py-8 flex flex-col items-center text-center space-y-6"
            >
              {/* Animated Ball & Captain #45 Emblem */}
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-blue-950/80 border border-blue-500/50 flex items-center justify-center shadow-[0_0_35px_rgba(59,130,246,0.45)]">
                  <CricketBall size={56} spinning={true} />
                </div>
                <div className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-blue-600 text-[11px] font-athletic font-bold text-white border border-cyan-300 shadow-md">
                  #45
                </div>
              </div>

              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/90 border border-blue-400/40 text-cyan-300 text-xs font-mono uppercase tracking-wider">
                  <Flame className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Captain Tribute Edition • #45</span>
                </div>

                <h3 className="font-athletic text-4xl sm:text-6xl font-bold text-white tracking-wide">
                  STEP ONTO THE PITCH
                </h3>

                <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-lg mx-auto">
                  A powerful cinematic message of perseverance, brotherhood, and triumph crafted specifically for your big day, {birthdayConfig.friendName}.
                </p>
              </div>

              <motion.button
                id="start-rohit-reveal-btn"
                onClick={startMessageSequence}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="px-10 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 text-black font-extrabold text-lg tracking-wider font-athletic shadow-[0_0_35px_rgba(59,130,246,0.65)] cursor-pointer flex items-center gap-3 transition-all"
              >
                <Sparkles className="w-5 h-5 text-black" />
                <span>🎙️ TAP TO REVEAL WISH</span>
              </motion.button>
            </motion.div>
          )}

          {/* COUNTDOWN STATE: 3 -> 2 -> 1 */}
          {revealStatus === 'countdown' && countdownValue !== null && (
            <div className="py-16 flex flex-col items-center justify-center min-h-[320px]">
              <motion.div
                key={countdownValue}
                initial={{ scale: 0.2, opacity: 0, rotate: -20 }}
                animate={{ scale: 1.2, opacity: 1, rotate: 0 }}
                exit={{ scale: 1.8, opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="font-athletic text-8xl sm:text-9xl font-black text-cyan-300 drop-shadow-[0_0_45px_rgba(56,189,248,0.95)]"
              >
                {countdownValue}
              </motion.div>
              <p className="text-sm font-mono text-cyan-400 uppercase tracking-widest mt-4">
                Illuminating the pitch with stadium floodlights...
              </p>
            </div>
          )}

          {/* REVEALING & COMPLETED STATE: Speech Stream & Voice Experience */}
          {(revealStatus === 'revealing' || revealStatus === 'completed') && (
            <div className="w-full max-w-3xl mx-auto space-y-4">
              {/* Voice Experience Control Bar */}
              <div className="bg-black/90 border border-blue-500/40 rounded-xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-4 shadow-[0_0_20px_rgba(37,99,235,0.25)]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-600/20 border border-blue-400/50 flex items-center justify-center text-cyan-300">
                      {isVoicePlaying && !isVoicePaused ? (
                        <span className="flex gap-0.5 items-end h-3.5">
                          <span className="w-0.5 h-3.5 bg-cyan-400 animate-bounce" />
                          <span className="w-0.5 h-2 bg-cyan-400 animate-bounce delay-100" />
                          <span className="w-0.5 h-4 bg-cyan-400 animate-bounce delay-200" />
                        </span>
                      ) : (
                        <Play className="w-4 h-4 ml-0.5 text-cyan-300" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-cyan-300 tracking-wide uppercase block font-mono">
                        AI-generated fan-made voice
                      </span>
                      <span className="text-[11px] text-slate-400 block">
                        Warm narration • Audio playback optional
                      </span>
                    </div>
                  </div>

                  {/* Voice player buttons & Audio Waveform */}
                  <div className="flex items-center gap-3">
                    {/* Waveform indicator */}
                    <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-blue-900/60">
                      <span className="text-[10px] font-mono text-cyan-300 mr-1.5 uppercase">Audio</span>
                      {Array.from({ length: 8 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-1 bg-cyan-400 rounded-full"
                          animate={{
                            height: isVoicePlaying && !isVoicePaused ? [3, 14, 5, 18, 3] : [3, 3, 3],
                          }}
                          transition={{
                            duration: 0.8 + (i % 4) * 0.2,
                            repeat: Infinity,
                            delay: i * 0.08,
                          }}
                        />
                      ))}
                    </div>

                    <button
                      id="toggle-voice-play-btn"
                      onClick={handleToggleVoice}
                      className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-black font-extrabold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {isVoicePlaying && !isVoicePaused ? (
                        <>
                          <Pause className="w-3.5 h-3.5" />
                          <span>Pause Voice</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>{isVoicePaused ? 'Resume Voice' : 'Play Voice'}</span>
                        </>
                      )}
                    </button>

                    <button
                      id="toggle-voice-mute-btn"
                      onClick={handleToggleMute}
                      title={isVoiceMuted ? 'Unmute voice' : 'Mute voice'}
                      className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-blue-900 transition-colors cursor-pointer"
                    >
                      {isVoiceMuted ? (
                        <VolumeX className="w-4 h-4 text-rose-400" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-cyan-300" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Message lines stream */}
                <div className="space-y-3.5 pt-1 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
                  {rohitSpeechLines.slice(0, visibleLineCount).map((line, idx) => {
                    const isCurrent = idx === activeSpeakingLine;
                    const isOpening = idx === 0;
                    const isClosing = idx === rohitSpeechLines.length - 1;

                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className={`p-4 sm:p-5 rounded-xl transition-all duration-500 ${
                          isCurrent
                            ? 'bg-blue-950/90 border-l-4 border-cyan-400 shadow-[0_0_25px_rgba(56,189,248,0.3)] text-white'
                            : 'bg-slate-950/70 border border-blue-950/80 text-slate-200'
                        }`}
                      >
                        <p
                          className={`leading-relaxed ${
                            isOpening || isClosing
                              ? 'font-athletic text-2xl sm:text-3xl font-bold text-cyan-300 tracking-wide'
                              : 'text-base sm:text-lg font-normal'
                          }`}
                        >
                          {line}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Progress counter */}
                <div className="flex items-center justify-between text-xs text-blue-300/70 pt-3 border-t border-blue-900/50 font-mono">
                  <span>
                    Delivering lines {visibleLineCount} of {rohitSpeechLines.length}
                  </span>
                  {visibleLineCount === rohitSpeechLines.length && (
                    <span className="text-cyan-400 inline-flex items-center gap-1 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Broadcast Complete
                    </span>
                  )}
                </div>
              </div>
          )}

          {/* SECTION 4 CELEBRATION BANNER */}
          <AnimatePresence>
            {revealStatus === 'completed' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-blue-950/90 via-black to-slate-950 border-2 border-blue-400/60 text-center shadow-[0_0_40px_rgba(37,99,235,0.4)] relative overflow-hidden"
              >
                <div className="absolute top-2 right-4 text-xs font-mono text-cyan-300 uppercase tracking-widest opacity-85">
                  🎉 Milestone Unlocked
                </div>

                <div className="flex justify-center mb-3">
                  <span className="text-4xl animate-bounce">🏏</span>
                </div>

                <h3 className="font-athletic text-3xl sm:text-4xl font-bold text-white mb-2 tracking-wide">
                  THAT WAS JUST THE BEGINNING... <span className="text-cyan-400">⚡</span>
                </h3>
                <p className="text-blue-200/90 text-sm sm:text-base max-w-lg mx-auto mb-5 font-light leading-relaxed">
                  The stadium floodlights are burning bright, and now comes a personal tribute from someone who has stood by your side through every match.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={triggerCelebrationFireworks}
                    className="px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-black font-extrabold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(59,130,246,0.5)] cursor-pointer flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-black" />
                    <span>Trigger Blue Fireworks & Confetti</span>
                  </button>

                  <a
                    href="#personal-message-section"
                    className="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-blue-500/40 font-semibold text-xs tracking-wider uppercase transition-colors"
                  >
                    Read Personal Letter &darr;
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
