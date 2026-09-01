import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { WeddingData } from '../types';
import { ChevronDown } from 'lucide-react';

interface HeroProps {
  data: WeddingData;
  preloaderFinished: boolean;
}

export const Hero: React.FC<HeroProps> = ({ data, preloaderFinished }) => {
  const containerRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, rotateX: 0, rotateY: 0 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Smooth Springs for Scroll-linked parallax dynamics
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Parallax & Depth Transforms
  const backgroundScale = useTransform(smoothProgress, [0, 1], [1, 1.06]);
  const backgroundY = useTransform(smoothProgress, [0, 1], ['0%', '6%']);

  const contentY = useTransform(smoothProgress, [0, 1], [0, 60]);
  const contentScale = useTransform(smoothProgress, [0, 0.7, 1], [1, 0.98, 0.94]);
  const contentOpacity = useTransform(smoothProgress, [0, 0.7, 1], [1, 0.85, 0]);

  const titleScale = useTransform(smoothProgress, [0, 1], [1, 1.02]);
  const motesY = useTransform(smoothProgress, [0, 1], [0, -60]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 768) return;
      const { innerWidth, innerHeight } = window;
      const normX = e.clientX / innerWidth - 0.5;
      const normY = e.clientY / innerHeight - 0.5;
      setMousePos({
        x: normX * 8,
        y: normY * 8,
        rotateX: -normY * 2.5,
        rotateY: normX * 2.5,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleScrollDown = () => {
    const countdownElem = document.getElementById('countdown');
    if (countdownElem) {
      countdownElem.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen w-full overflow-hidden flex items-center justify-center text-center select-none py-16 sm:py-24 px-4 sm:px-8 perspective-[1000px] bg-[#FAF7F2]"
    >
      {/* 1. Full-Bleed Luminous Watercolor Artwork with Rich Botanical Arch Contrast */}
      <motion.div
        style={{
          scale: backgroundScale,
          y: backgroundY,
        }}
        className="absolute inset-0 z-0 overflow-hidden"
      >
        <img
          src={data.heroImage}
          alt={`زفاف ${data.groomArabic} و ${data.brideArabic}`}
          className="w-full h-full object-cover object-center sm:object-[center_28%] transition-transform duration-1000 filter contrast-[1.12] brightness-[1.02] saturate-[1.08]"
        />

        {/* Soft, Light Vignette to keep outer florals rich while keeping central typography ultra-crisp */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/40 to-[#FAF7F2]/15" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F2]/45 via-transparent to-[#FAF7F2]/60" />

        {/* Luminous Central Radial Backdrop - Ensures 100% Crisp WCAG AA Contrast for Text */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_65%_at_50%_46%,rgba(250,247,242,0.85)_0%,rgba(250,247,242,0.65)_45%,transparent_80%)] pointer-events-none" />

        {/* Subtle Botanical Sage & Pale Lavender Accents */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#96A08C]/10 via-[#E4E7EE]/10 to-[#A98A59]/10 pointer-events-none" />
      </motion.div>

      {/* 2. Reduced Delicate Ambient Floating Motes */}
      <motion.div
        style={{ y: motesY }}
        className="absolute inset-0 z-5 pointer-events-none overflow-hidden"
      >
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -18, 0],
              x: [0, i % 2 === 0 ? 6 : -6, 0],
              opacity: [0.2, 0.45, 0.2],
            }}
            transition={{
              duration: 7 + i * 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 1.2,
            }}
            style={{
              top: `${25 + i * 16}%`,
              left: `${18 + i * 22}%`,
              width: `${(i % 2) + 2}px`,
              height: `${(i % 2) + 2}px`,
            }}
            className={`absolute rounded-full ${
              i % 2 === 0 ? 'bg-[#7A8A74]' : 'bg-[#967845]'
            } blur-[0.2px]`}
          />
        ))}
      </motion.div>

      {/* 3. Editorial Hero Content Layer - High Contrast & Crisp Readability */}
      <motion.div
        style={{
          opacity: contentOpacity,
          y: contentY,
          scale: contentScale,
          x: mousePos.x,
          rotateX: mousePos.rotateX,
          rotateY: mousePos.rotateY,
          transformStyle: 'preserve-3d',
        }}
        transition={{ type: 'spring', stiffness: 50, damping: 25 }}
        className="relative z-10 max-w-4xl w-full mx-auto my-auto flex flex-col items-center justify-center pt-6 pb-20"
      >
        {/* Crisp Eyebrow with Warm Gold Accent Lines */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={preloaderFinished ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center gap-3 mb-5 sm:mb-7"
        >
          <span className="w-8 sm:w-12 h-[1.5px] bg-gradient-to-r from-transparent to-[#7A5822]" />
          <span className="font-serif-en text-[10px] sm:text-[11.5px] tracking-[0.55em] uppercase text-[#634718] font-bold">
            THE WEDDING CELEBRATION
          </span>
          <span className="w-8 sm:w-12 h-[1.5px] bg-gradient-to-l from-transparent to-[#7A5822]" />
        </motion.div>

        {/* Strongest Visual Focal Element: Names in Deep Rich Charcoal Espresso */}
        <motion.div
          style={{ scale: titleScale }}
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={preloaderFinished ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mb-2.5 sm:mb-4"
        >
          <h1 className="font-display-ar text-6xl sm:text-8xl md:text-9xl lg:text-[9.5rem] font-bold text-[#110D0B] tracking-wider leading-none drop-shadow-[0_2px_4px_rgba(255,255,255,0.9)]">
            <span className="inline-block">
              {data.groomArabic}
            </span>
            <span className="mx-3 sm:mx-6 md:mx-8 font-serif-en italic text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-[#7A5822] font-bold inline-block align-middle">
              &amp;
            </span>
            <span className="inline-block">
              {data.brideArabic}
            </span>
          </h1>
        </motion.div>

        {/* English Subtitle with Solid Legibility */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={preloaderFinished ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="font-serif-en text-[10.5px] sm:text-[12px] tracking-[0.5em] text-[#110D0B] uppercase mb-4 sm:mb-5 font-bold"
        >
          {data.groomEnglish} &amp; {data.brideEnglish}
        </motion.div>

        {/* Supporting Arabic Welcoming Sentence in Highest Contrast */}
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={preloaderFinished ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.55 }}
          className="font-calligraphy-ar text-base sm:text-lg md:text-xl text-[#110D0B] font-bold max-w-md mx-auto mb-5 sm:mb-6 leading-relaxed"
        >
          يسعدنا ويشرفنا حضوركم ومشاركتنا فرحة العمر
        </motion.p>

        {/* Slender 1px Antique Gold Line Divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={preloaderFinished ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.65 }}
          className="w-20 sm:w-28 h-[1.5px] bg-gradient-to-r from-transparent via-[#7A5822] to-transparent mb-4 sm:mb-5"
        />

        {/* Single Refined Editorial Line in Highest Contrast */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={preloaderFinished ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.75 }}
          className="flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-4 gap-y-1 text-center font-bold"
        >
          <span className="font-display-ar text-sm sm:text-base md:text-lg font-bold tracking-wider text-[#110D0B]">
            الثلاثاء، ٨ سبتمبر ٢٠٢٦
          </span>
          
          <span className="text-[#7A5822] font-serif-en text-base font-bold select-none">·</span>
          
          <span className="font-display-ar text-sm sm:text-base md:text-lg font-bold text-[#110D0B]">
            ٨:٠٠ مساءً
          </span>

          <span className="text-[#7A5822] font-serif-en text-base font-bold select-none">·</span>

          <span className="font-serif-en text-sm sm:text-base md:text-lg font-bold tracking-wide text-[#1F331D]">
            {data.venueName}
          </span>
        </motion.div>
      </motion.div>

      {/* 4. Minimalist Downward Chevron Scroll Indicator */}
      <motion.button
        id="hero-scroll-indicator"
        onClick={handleScrollDown}
        initial={{ opacity: 0, y: 8 }}
        animate={preloaderFinished ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 0.95 }}
        className="absolute bottom-6 sm:bottom-8 z-10 flex items-center justify-center text-[#7A5822] hover:text-[#110D0B] transition-colors cursor-pointer group focus:outline-hidden p-2"
        aria-label="الانتقال للأسفل"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-[#7A5822] flex items-center justify-center bg-white/90 backdrop-blur-xs group-hover:bg-white transition-all shadow-xs"
        >
          <ChevronDown className="w-4 h-4 text-[#7A5822] stroke-[2.2]" />
        </motion.div>
      </motion.button>
    </section>
  );
};
