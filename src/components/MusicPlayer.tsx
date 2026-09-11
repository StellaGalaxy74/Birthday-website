import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundEngine } from '../utils/audio';
import { birthdayConfig } from '../config/birthdayConfig';
import { Play, Pause, Volume2, VolumeX, Sliders, Music } from 'lucide-react';

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasAudioFile, setHasAudioFile] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Check if audio file exists or load
  useEffect(() => {
    const audio = new Audio();
    audio.src = birthdayConfig.backgroundMusic || '/assets/background-music.mp3';
    audio.loop = true;
    audio.volume = volume;

    audio.oncanplaythrough = () => {
      setHasAudioFile(true);
    };

    audio.onerror = () => {
      // Audio file not present on static host; fallback to Web Audio synthesizer
      setHasAudioFile(false);
    };

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      if (audioRef.current && hasAudioFile) {
        audioRef.current.pause();
      }
      soundEngine.stopAmbientMusic();
      setIsPlaying(false);
    } else {
      if (audioRef.current && hasAudioFile) {
        audioRef.current.play().catch(() => {
          // If browser restricts or fails, fallback to web audio
          soundEngine.startAmbientMusic();
        });
      } else {
        // Play web audio synthesizer
        soundEngine.startAmbientMusic();
      }
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);

    if (audioRef.current) {
      audioRef.current.muted = newMuted;
    }
    soundEngine.toggleMute();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
    soundEngine.setVolume(newVol);
    if (isMuted && newVol > 0) {
      setIsMuted(false);
      if (audioRef.current) audioRef.current.muted = false;
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 select-none">
      {/* Expanded Control Box */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="mb-2 p-4 rounded-2xl glass-card border border-blue-500/40 shadow-2xl w-64 text-slate-200 bg-black/95 backdrop-blur-md"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold">
                BIRTHDAY SONG
              </span>
              <span className="text-[10px] text-blue-300 font-mono">
                {hasAudioFile ? 'MP3 Track' : 'Happy Birthday Anthem'}
              </span>
            </div>

            {/* Volume slider */}
            <div className="flex items-center gap-2 text-xs mb-3">
              <span className="text-blue-300 font-mono">Vol:</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full accent-cyan-400 h-1.5 bg-slate-900 rounded-lg cursor-pointer"
              />
              <span className="text-cyan-300 font-mono text-[11px] w-7 text-right">
                {Math.round(volume * 100)}%
              </span>
            </div>

            <div className="pt-2 border-t border-blue-950/80 flex items-center justify-between">
              <button
                onClick={toggleMute}
                className="text-xs text-slate-300 hover:text-cyan-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {isMuted ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-cyan-300" />
                    <span>🔊 Unmute Music</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                    <span>🔇 Mute Music</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Floating Pill */}
      <div className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-black/90 border border-blue-500/40 shadow-[0_8px_25px_rgba(0,0,0,0.8)] backdrop-blur-md">
        {/* Play/Pause Button */}
        <button
          id="music-play-btn"
          onClick={togglePlay}
          className="px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-black flex items-center gap-1.5 font-bold text-xs tracking-wide transition-all shadow-[0_0_15px_rgba(59,130,246,0.5)] cursor-pointer"
          title={isPlaying ? 'Pause music' : 'Play music'}
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Pause Music</span>
            </>
          ) : (
            <>
              <Music className="w-3.5 h-3.5" />
              <span>🎵 Play Birthday Music</span>
            </>
          )}
        </button>

        {/* Equalizer animation when playing */}
        {isPlaying && (
          <div className="hidden sm:flex items-end gap-0.5 h-3 px-1">
            <span className="w-0.5 h-3 bg-cyan-400 animate-pulse" />
            <span className="w-0.5 h-2 bg-cyan-400 animate-pulse delay-100" />
            <span className="w-0.5 h-3.5 bg-cyan-400 animate-pulse delay-200" />
          </div>
        )}

        {/* Quick Mute/Unmute Toggle */}
        <button
          onClick={toggleMute}
          className="p-1.5 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
          title={isMuted ? '🔊 Unmute Music' : '🔇 Mute Music'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-rose-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-cyan-300" />
          )}
        </button>

        {/* Settings button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
          title="Audio settings"
        >
          <Sliders className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
