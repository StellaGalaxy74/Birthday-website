import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { birthdayConfig } from '../config/birthdayConfig';
import { Heart, Feather, Edit3, Check, Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface PersonalMessageSectionProps {
  onCustomMessageChange?: (newMessage: string) => void;
}

export const PersonalMessageSection: React.FC<PersonalMessageSectionProps> = ({
  onCustomMessageChange,
}) => {
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isTypingComplete, setIsTypingComplete] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editableMessage, setEditableMessage] = useState<string>(birthdayConfig.personalMessage);
  const [hasStartedTyping, setHasStartedTyping] = useState<boolean>(false);

  // Typewriter effect when section scrolls into view
  useEffect(() => {
    if (!hasStartedTyping) return;

    let currentIndex = 0;
    const fullText = editableMessage;
    setDisplayedText('');
    setIsTypingComplete(false);

    // Fast typewriter streaming
    const interval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex + 2));
        currentIndex += 2;
      } else {
        setDisplayedText(fullText);
        setIsTypingComplete(true);
        clearInterval(interval);
      }
    }, 14);

    return () => clearInterval(interval);
  }, [hasStartedTyping, editableMessage]);

  const handleSaveEdit = () => {
    setIsEditing(false);
    birthdayConfig.personalMessage = editableMessage;
    if (onCustomMessageChange) {
      onCustomMessageChange(editableMessage);
    }
    setHasStartedTyping(false);
    setTimeout(() => setHasStartedTyping(true), 50);
  };

  return (
    <section
      id="personal-message-section"
      className="relative min-h-screen py-24 px-4 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Blue & cyan ambient lighting gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-blue-600/15 via-cyan-500/10 to-transparent rounded-full blur-3xl opacity-70" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto w-full">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          onViewportEnter={() => setHasStartedTyping(true)}
          className="text-center space-y-3 mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/40 text-cyan-300 text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <Heart className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400/30" />
            <span>FROM THE HEART</span>
          </div>

          <h2 className="font-athletic text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight max-w-xl mx-auto leading-tight">
            AND NOW… SOMETHING FROM SOMEONE WHO TRULY CARES ABOUT YOU{' '}
            <span className="text-cyan-400 inline-block">💙</span>
          </h2>

          <p className="text-blue-200/80 text-sm sm:text-base font-light">
            Beyond stadiums and scoreboards — a heartfelt letter written just for you.
          </p>
        </motion.div>

        {/* Parchment-inspired Glassmorphism Letter Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl p-6 sm:p-10 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-blue-500/35 overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, rgba(5, 10, 24, 0.95) 0%, rgba(2, 5, 14, 0.98) 100%)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Subtle cyan stamp in the corner */}
          <div className="absolute top-6 right-6 opacity-40 flex items-center gap-1.5 text-cyan-300 font-mono text-xs uppercase tracking-widest pointer-events-none">
            <Feather className="w-4 h-4 text-cyan-400" />
            <span>CONFIDENTIAL &bull; FOR ULLAS</span>
          </div>

          {/* Edit toggle for friend */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => {
                if (isEditing) {
                  handleSaveEdit();
                } else {
                  setIsEditing(true);
                }
              }}
              className="text-xs text-cyan-300/80 hover:text-cyan-300 flex items-center gap-1 py-1.5 px-3 rounded-lg border border-blue-500/40 bg-blue-950/60 transition-colors cursor-pointer"
            >
              {isEditing ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Save Custom Letter</span>
                </>
              ) : (
                <>
                  <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Customize Personal Message</span>
                </>
              )}
            </button>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <label className="text-xs text-blue-300 font-mono block">
                Edit your personal message for {birthdayConfig.friendName}:
              </label>
              <textarea
                value={editableMessage}
                onChange={(e) => setEditableMessage(e.target.value)}
                rows={12}
                className="w-full bg-black/90 text-slate-100 p-4 rounded-xl border border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 font-sans leading-relaxed text-sm sm:text-base"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleSaveEdit}
                  className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-black font-extrabold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                >
                  Apply & Replay Animation
                </button>
              </div>
            </div>
          ) : (
            <div className="prose prose-invert max-w-none">
              <div className="font-sans text-slate-200 text-base sm:text-lg leading-relaxed whitespace-pre-line">
                {displayedText}
                {!isTypingComplete && (
                  <span className="inline-block w-2 h-5 ml-1 bg-cyan-400 animate-pulse align-middle shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                )}
              </div>

              {/* Sender signature block */}
              {isTypingComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="mt-8 pt-6 border-t border-blue-500/25 flex flex-wrap items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5">
                      <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                        <Heart className="w-5 h-5 text-cyan-400 fill-cyan-400/60" />
                      </div>
                    </div>
                    <div>
                      <span className="font-athletic font-bold text-cyan-300 block text-xl tracking-wide">
                        {birthdayConfig.senderName}
                      </span>
                      <span className="text-xs text-slate-400 block">
                        Always in your corner &bull; Forever your friend
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      soundEngine.playCelebrationChime();
                      setHasStartedTyping(false);
                      setTimeout(() => setHasStartedTyping(true), 100);
                    }}
                    className="text-xs text-slate-400 hover:text-cyan-300 font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Re-read with typewriter</span>
                  </button>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};
