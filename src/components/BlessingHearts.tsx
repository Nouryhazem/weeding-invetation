import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { WeddingData } from '../types';
import { soundEffects } from '../utils/soundEffects';
import { Heart } from 'lucide-react';

interface BlessingHeartsProps {
  data?: WeddingData;
}

interface FloatingHeartItem {
  id: string;
  x: number; // percentage 3% to 94% across the section
  y: number; // percentage 6% to 92% down the section
  size: number; // in pixels (18 - 32)
  color: string;
  rotation: number; // -18 to 18 deg
  scale: number;
  duration: number; // floating animation cycle duration (4 - 8s)
  floatDistanceY: number; // -12 to -24px drift
  floatDistanceX: number; // -8 to 8px drift
  depthSpeed: number; // parallax multiplier for scroll (-30 to 45px)
}

const STORAGE_HEARTS_DATA_KEY = 'wedding_ahmed_noor_blessing_hearts_list_v1';

// Identity Color Palette for hearts: Outline Gold & Ivory tones (Transparent fill, outline only)
const OUTLINE_HEART_COLORS = [
  '#C9AF87', // Luminous Gold / Champagne
  '#B89968', // Antique Warm Gold
  '#A98A59', // Classic Champagne Gold
  '#8C6D3B', // Deep Antique Bronze Gold
  '#D4C5A9', // Pale Ivory Gold
  '#9E8256', // Soft Taupe Gold
];

// Helper to deterministically generate visual positioning and variety across the entire section
const generateFloatingHeart = (index: number): FloatingHeartItem => {
  // Deterministic pseudo-random generation based on index and timestamp
  const seed = (index * 9301 + 49297) % 233280;
  const pseudoRandom1 = ((seed * 9301 + 49297) % 233280) / 233280;
  const pseudoRandom2 = ((seed * 49297 + 9301) % 233280) / 233280;
  const pseudoRandom3 = ((seed * 1337 + 777) % 233280) / 233280;
  const pseudoRandom4 = ((seed * 7823 + 3121) % 233280) / 233280;

  // Spread nicely across the whole section
  let x = 4 + pseudoRandom1 * 91;
  let y = 6 + pseudoRandom2 * 86;

  // Avoid pure center directly on top of the button
  if (x > 36 && x < 64 && y > 34 && y < 66) {
    if (pseudoRandom3 > 0.5) {
      x = (x + 26) % 92 + 4;
    } else {
      y = (y + 26) % 88 + 6;
    }
  }

  const size = 18 + Math.floor(pseudoRandom3 * 14); // 18px - 32px
  const color = OUTLINE_HEART_COLORS[index % OUTLINE_HEART_COLORS.length];
  const rotation = Math.round((pseudoRandom4 - 0.5) * 36); // -18deg to +18deg
  const scale = 0.9 + pseudoRandom1 * 0.22;
  const duration = 4.5 + pseudoRandom2 * 3.5; // 4.5s - 8s gentle organic loop
  const floatDistanceY = -(12 + pseudoRandom3 * 18);
  const floatDistanceX = Math.round((pseudoRandom4 - 0.5) * 16);
  const depthSpeed = (pseudoRandom1 - 0.5) * 60;

  return {
    id: `floating-heart-${index}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    x,
    y,
    size,
    color,
    rotation,
    scale,
    duration,
    floatDistanceY,
    floatDistanceX,
    depthSpeed,
  };
};

export const BlessingHearts: React.FC<BlessingHeartsProps> = () => {
  const [heartsList, setHeartsList] = useState<FloatingHeartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_HEARTS_DATA_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Mouse hover parallax coordinates
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Scroll reaction
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const scrollParallax = useTransform(scrollYProgress, [0, 1], [-25, 25]);

  // Sync across tabs and custom events
  useEffect(() => {
    const handleStorageUpdate = () => {
      try {
        const saved = localStorage.getItem(STORAGE_HEARTS_DATA_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setHeartsList(parsed);
          }
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener('storage', handleStorageUpdate);
    window.addEventListener('wedding-hearts-updated', handleStorageUpdate);
    return () => {
      window.removeEventListener('storage', handleStorageUpdate);
      window.removeEventListener('wedding-hearts-updated', handleStorageUpdate);
    };
  }, []);

  // Mouse move handler for organic hover parallax across section
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const relativeX = (e.clientX - rect.left) / rect.width - 0.5;
    const relativeY = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseOffset({
      x: relativeX * 24, // subtle -12px to +12px shift
      y: relativeY * 24,
    });
  };

  // Handle Add Heart
  const handleAddHeart = useCallback(() => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    soundEffects.playSoftTap();

    setHeartsList((prev) => {
      const newHeart = generateFloatingHeart(prev.length);
      const updated = [...prev, newHeart];
      try {
        localStorage.setItem(STORAGE_HEARTS_DATA_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event('wedding-hearts-updated'));
      } catch (e) {
        console.error('Failed to save heart', e);
      }
      return updated;
    });

    setTimeout(() => {
      setIsSubmitting(false);
    }, 180);
  }, [isSubmitting]);

  // Visible hearts capped to latest 75 for optimal GPU and DOM performance
  const visibleHearts = heartsList.length > 75 ? heartsList.slice(-75) : heartsList;

  return (
    <section
      ref={sectionRef}
      id="blessings-and-love"
      onMouseMove={handleMouseMove}
      className="relative min-h-[380px] sm:min-h-[440px] md:min-h-[500px] py-28 sm:py-36 md:py-44 px-6 bg-[#FAF7F2] text-[#231C18] overflow-hidden select-none flex items-center justify-center"
    >
      {/* Background Watercolor Ambient Washes */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-radial from-[#F5EFE6]/60 via-[#FAF7F2]/30 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-12 w-80 h-80 bg-radial from-[#ECEFE8]/45 to-transparent blur-2xl pointer-events-none" />
      <div className="absolute bottom-10 left-12 w-80 h-80 bg-radial from-[#F2ECE4]/50 to-transparent blur-2xl pointer-events-none" />

      {/* Floating Hollow Outline Hearts with Scroll & Hover Sensitivity */}
      <motion.div
        style={{ y: scrollParallax }}
        className="absolute inset-0 pointer-events-none overflow-hidden z-0"
      >
        <AnimatePresence initial={false}>
          {visibleHearts.map((heart) => (
            <motion.div
              key={heart.id}
              initial={{
                opacity: 0,
                scale: 0.8,
              }}
              animate={{
                opacity: [0.65, 0.95, 0.65],
                scale: heart.scale,
                y: [0, heart.floatDistanceY + mouseOffset.y * 0.4, 0],
                x: [0, heart.floatDistanceX + mouseOffset.x * 0.4, 0],
                rotate: [heart.rotation, heart.rotation + 6, heart.rotation],
              }}
              whileHover={{
                scale: 1.4,
                rotate: 15,
                transition: { duration: 0.25 },
              }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{
                opacity: { duration: heart.duration * 0.8, repeat: Infinity, ease: 'easeInOut' },
                y: { duration: heart.duration, repeat: Infinity, ease: 'easeInOut' },
                x: { duration: heart.duration * 1.2, repeat: Infinity, ease: 'easeInOut' },
                rotate: { duration: heart.duration * 1.5, repeat: Infinity, ease: 'easeInOut' },
                scale: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
              }}
              style={{
                position: 'absolute',
                top: `${heart.y}%`,
                left: `${heart.x}%`,
                transform: `rotate(${heart.rotation}deg)`,
                pointerEvents: 'auto', // Allows hover reaction
              }}
              className="inline-flex items-center justify-center p-1.5 cursor-pointer group"
            >
              {/* Unfilled/Hollow Gold & Ivory Heart Outline */}
              <svg
                width={heart.size}
                height={heart.size}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-transform duration-300 group-hover:scale-120 drop-shadow-[0_1px_3px_rgba(255,255,255,0.9)]"
              >
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  fill="none"
                  stroke={heart.color}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Button with ONLY Heart Icon (Minimal Round Luxury Style) */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        <motion.button
          id="btn-leave-heart"
          type="button"
          aria-label="إرسال قلب"
          onClick={handleAddHeart}
          whileHover={{ scale: 1.1, rotate: 6 }}
          whileTap={{ scale: 0.92 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="group w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center bg-[#FAF7F2]/95 hover:bg-[#F6EFE5] backdrop-blur-xs border border-[#A98A59]/80 hover:border-[#8C6D3B] text-[#8C6D3B] hover:text-[#A98A59] rounded-full shadow-[0_2px_16px_rgba(169,138,89,0.16)] hover:shadow-[0_4px_22px_rgba(169,138,89,0.28)] transition-all duration-300 cursor-pointer focus:outline-hidden"
        >
          <Heart className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.4] transition-transform duration-300 group-hover:scale-110" />
        </motion.button>
      </div>
    </section>
  );
};
