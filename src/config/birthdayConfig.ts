import { BirthdayConfig, WishItem } from '../types';

/**
 * CENTRAL CONFIGURATION
 * Easily customize the entire birthday website from here!
 */
export const birthdayConfig: BirthdayConfig = {
  friendName: "Ullas",
  senderName: "Your Best Friend",
  backgroundMusic: "/assets/background-music.mp3",
  
  // Personal message from someone who truly cares about you
  personalMessage: `Dear Ullas,

I just want you to know how special our friendship is to me.

We've shared so many moments together — the fun ones, the difficult ones, the completely chaotic ones, and the memories that we'll probably laugh about years from now.

I hope you always remember that you don't have to face everything alone.

I'll always be here to support you, especially when things get difficult.

I genuinely hope you achieve every dream you're working towards and become everything you want to be.

Here's to more adventures, more laughter, more stupid memories, and many more moments together.

No matter where life takes us, I hope we continue creating beautiful memories together.

Keep believing in yourself.
Keep chasing your dreams.
Keep being you.

Happy Birthday, Ullas. ❤️
I'm always rooting for you.`
};

export const rohitSpeechLines = [
  "Hey Ullas, wishing you a very Happy Birthday! 🎂",
  "May this new year of your life bring you endless happiness, success, good health and unforgettable memories.",
  "Keep believing in yourself, keep working hard, and never stop chasing your dreams.",
  "There will be challenges along the way, but always remember that every great journey takes patience, courage and consistency.",
  "I hope you achieve everything you are working towards and make your family and the people who love you proud.",
  "Keep smiling, keep growing, and enjoy every moment of this beautiful journey.",
  "Once again, Happy Birthday, Ullas!",
  "Wishing you an amazing year ahead and a very bright future.",
  "Keep shining and keep going! ❤️🏏"
];

export const wishesList: WishItem[] = [
  {
    id: "happiness",
    icon: "Heart",
    title: "Happiness",
    quote: "May you always have reasons to smile and celebrate every match.",
    accent: "from-blue-600/30 to-cyan-500/15"
  },
  {
    id: "dreams",
    icon: "Sparkles",
    title: "Dreams",
    quote: "May the dreams you chase become your greatest victories.",
    accent: "from-sky-500/30 to-blue-600/15"
  },
  {
    id: "success",
    icon: "Trophy",
    title: "Success",
    quote: "May your hard work take you to the top of every leaderboard.",
    accent: "from-cyan-500/30 to-blue-700/15"
  },
  {
    id: "friendship",
    icon: "Users",
    title: "Friendship",
    quote: "May you always have brotherhood that stands by you in every over.",
    accent: "from-blue-500/30 to-indigo-600/15"
  },
  {
    id: "adventures",
    icon: "Compass",
    title: "Adventures",
    quote: "May this year give you memorable innings you will talk about forever.",
    accent: "from-indigo-600/30 to-blue-500/15"
  },
  {
    id: "growth",
    icon: "Rocket",
    title: "Growth",
    quote: "May you keep timing the ball sweet and become an unstoppable force.",
    accent: "from-cyan-400/30 to-sky-600/15"
  }
];

export const DISCLAIMER_TEXT = "Fan-made AI birthday experience created for Ullas S. This is fictional and is not an actual message from Rohit Sharma.";
