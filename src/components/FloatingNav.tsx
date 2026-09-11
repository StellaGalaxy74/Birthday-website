import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home,
  Mic,
  Heart,
  Trophy,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';

interface FloatingNavProps {
  activeSection?: string;
  onNavigate?: (id: string) => void;
}

export const FloatingNav: React.FC<FloatingNavProps> = ({ onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 150);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'hero-section', label: 'Home', icon: Home, emoji: '🏠' },
    { id: 'message-section', label: 'Birthday Message', icon: Mic, emoji: '🏏' },
    { id: 'personal-message-section', label: 'Personal Letter', icon: Heart, emoji: '❤️' },
    { id: 'cricket-game-section', label: 'Hit Six', icon: Trophy, emoji: '🏆' },
    { id: 'wishes-section', label: 'Wish Cards', icon: Sparkles, emoji: '🎁' },
    { id: 'share-section', label: 'Share', icon: Sparkles, emoji: '💙' },
  ];

  const handleNavClick = (id: string) => {
    setIsMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(id);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      {/* Desktop Floating Pill Navigation (Centered at top) */}
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: scrolled ? 1 : 0.9 }}
        transition={{ duration: 0.4 }}
        className="hidden md:flex fixed top-5 left-1/2 -translate-x-1/2 z-40 items-center gap-1 p-1.5 rounded-full bg-black/85 border border-blue-500/40 shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-md text-xs font-semibold text-slate-300"
      >
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className="px-4 py-2 rounded-full hover:text-cyan-300 hover:bg-blue-600/20 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <span>{item.emoji}</span>
            <span className="font-athletic text-base tracking-wide">{item.label}</span>
          </button>
        ))}
      </motion.nav>

      {/* Mobile Floating Toggle Button (Top Right) */}
      <div className="md:hidden fixed top-4 right-4 z-40">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2.5 rounded-full bg-black/90 border border-blue-500/50 text-cyan-300 shadow-[0_0_20px_rgba(37,99,235,0.4)] backdrop-blur-md cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="md:hidden fixed top-16 right-4 left-4 z-40 p-4 rounded-2xl glass-card border border-blue-500/40 shadow-[0_10px_40px_rgba(0,0,0,0.9)] bg-black/95 backdrop-blur-xl"
          >
            <div className="flex flex-col space-y-2">
              <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest px-2 mb-1 font-bold">
                EXPERIENCE TIMELINE
              </span>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-blue-600/20 text-slate-200 hover:text-cyan-300 text-sm font-medium flex items-center gap-3 transition-colors cursor-pointer"
                >
                  <span className="text-base">{item.emoji}</span>
                  <span className="font-athletic text-lg tracking-wide">{item.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
