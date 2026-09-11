import React from 'react';
import { motion } from 'motion/react';
import { wishesList } from '../config/birthdayConfig';
import {
  Heart,
  Sparkles,
  Trophy,
  Users,
  Compass,
  Rocket,
  Star,
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Heart,
  Sparkles,
  Trophy,
  Users,
  Compass,
  Rocket,
};

export const WishesSection: React.FC = () => {
  return (
    <section
      id="wishes-section"
      className="relative min-h-screen py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center justify-center"
    >
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center space-y-3 mb-16"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/40 text-cyan-300 text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          <Star className="w-3.5 h-3.5 text-cyan-400" />
          <span>BLESSINGS & ASPIRATIONS</span>
        </div>

        <h2 className="font-athletic text-4xl sm:text-6xl font-bold text-white tracking-tight">
          WISHES FOR YOUR NEW CHAPTER <span className="text-cyan-400">⚡</span>
        </h2>

        <p className="text-blue-200/80 text-sm sm:text-base max-w-xl mx-auto font-light">
          Six foundational championship pillars wished for your incredible journey ahead.
        </p>
      </motion.div>

      {/* 6 Animated Cards Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishesList.map((wish, index) => {
          const IconComponent = iconMap[wish.icon] || Sparkles;

          return (
            <motion.div
              key={wish.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -6 }}
              className="glass-card rounded-2xl p-7 relative overflow-hidden border border-blue-950 hover:border-cyan-400/60 bg-black/90 transition-all duration-300 flex flex-col justify-between group shadow-[0_0_25px_rgba(37,99,235,0.15)] hover:shadow-[0_0_35px_rgba(56,189,248,0.3)]"
            >
              {/* Subtle top gradient glow */}
              <div
                className={`absolute top-0 inset-x-0 h-32 bg-gradient-to-b ${wish.accent} opacity-50 group-hover:opacity-85 transition-opacity pointer-events-none`}
              />

              <div className="relative z-10 space-y-4">
                {/* Icon badge */}
                <div className="w-12 h-12 rounded-xl bg-slate-950 border border-blue-500/40 flex items-center justify-center text-cyan-300 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
                  <IconComponent className="w-6 h-6" />
                </div>

                {/* Title */}
                <h3 className="font-athletic text-3xl font-bold text-white group-hover:text-cyan-300 transition-colors tracking-wide">
                  {wish.title}
                </h3>

                {/* Quote */}
                <p className="font-sans text-slate-200 text-base leading-relaxed">
                  "{wish.quote}"
                </p>
              </div>

              {/* Bottom decorative bar */}
              <div className="relative z-10 mt-6 pt-4 border-t border-blue-950/80 flex items-center justify-between text-xs text-blue-400/70 font-mono">
                <span>PILLAR 0{index + 1}</span>
                <Sparkles className="w-3.5 h-3.5 text-cyan-400/60 group-hover:text-cyan-300 transition-colors" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
