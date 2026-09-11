import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Share2, Check, Copy, Sparkles, Heart } from 'lucide-react';
import { birthdayConfig } from '../config/birthdayConfig';

export const ShareSection: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: `Happy Birthday ${birthdayConfig.friendName} 🎂🏏`,
      text: `Check out this special cinematic birthday surprise created for ${birthdayConfig.friendName}!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // User cancelled or share failed, fallback to copy
      }
    }

    // Fallback: Copy link
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Older browsers fallback
      const textArea = document.createElement('textarea');
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <section id="share-section" className="relative py-16 px-4 sm:px-6 max-w-4xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="glass-card rounded-3xl p-8 sm:p-12 border-2 border-blue-500/50 bg-black/90 shadow-[0_0_50px_rgba(37,99,235,0.3)] relative overflow-hidden"
      >
        {/* Glow ambient */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-4 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-950/80 border border-blue-400/40 text-cyan-300 text-xs font-mono uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Pass On The Celebration</span>
          </div>

          <h3 className="font-athletic text-3xl sm:text-5xl font-bold text-white tracking-wide">
            SHARE THE SURPRISE WITH {birthdayConfig.friendName.toUpperCase()}
          </h3>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Send this public link directly to {birthdayConfig.friendName} or share it with friends to celebrate his special day together.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              id="share-surprise-btn"
              onClick={handleShare}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 text-black font-extrabold text-base sm:text-lg tracking-wider font-athletic shadow-[0_0_30px_rgba(59,130,246,0.6)] cursor-pointer flex items-center justify-center gap-2.5 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5 text-black stroke-[3]" />
                  <span>Link copied! 🎉</span>
                </>
              ) : (
                <>
                  <Heart className="w-5 h-5 text-black fill-current" />
                  <span>💙 Share This Birthday Surprise</span>
                </>
              )}
            </motion.button>
          </div>

          {copied && (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-mono text-cyan-300 pt-2"
            >
              Copied to your clipboard! Send it anywhere! ✨
            </motion.p>
          )}
        </div>
      </motion.div>
    </section>
  );
};
