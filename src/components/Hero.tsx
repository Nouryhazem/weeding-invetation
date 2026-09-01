import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { WeddingData } from '../types';
import { ChevronDown, Calendar, MapPin, Sparkles } from 'lucide-react';

interface HeroProps {
  data: WeddingData;
  preloaderFinished: boolean;
}

export const Hero: React.FC<HeroProps> = ({ data, preloaderFinished }) => {
  const containerRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, rotateX: 0, rotateY: 0 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  // Smooth Springs for Scroll-linked dynamics
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Multi-tier Parallax & Depth Transforms
  const backgroundScale = useTransform(smoothProgress, [0, 1], [1, 1.15]);
  const backgroundY = useTransform(smoothProgress, [0, 1], ['0%', '12%']);
  const overlayOpacity = useTransform(smoothProgress, [0, 0.8, 1], [0.35, 0.7, 0.9]);

  const contentY = useTransform(smoothProgress, [0, 1], [0, 100]);
  const contentScale = useTransform(smoothProgress, [0, 0.7, 1], [1, 0.97, 0.9]);
  const contentOpacity = useTransform(smoothProgress, [0, 0.65, 1], [1, 0.85, 0]);

  const titleScale = useTransform(smoothProgress, [0, 1], [1, 1.04]);
  const badgeY = useTransform(smoothProgress, [0, 1], [0, 35]);
  const motesY = useTransform(smoothProgress, [0, 1], [0, -120]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 768) return;
      const { innerWidth, innerHeight } = window;
      const normX = e.clientX / innerWidth - 0.5;
      const normY = e.clientY / innerHeight - 0.5;
      setMousePos({
        x: normX * 12,
        y: normY * 12,
        rotateX: -normY * 4.5,
        rotateY: normX * 4.5,
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
      className="relative min-h-screen w-full overflow-hidden flex items-center justify-center text-center select-none py-16 px-4 sm:px-6 perspective-[1000px] bg-[#1E1C1A]"
    >
      {/* 1. Full-Bleed Cinematic Background with Multi-Layer Parallax & Controlled Champagne Glow */}
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
          className="w-full h-full object-cover object-center sm:object-[center_20%] transition-transform duration-1000 filter brightness-[0.92] contrast-[1.03]"
        />

        {/* Controlled Champagne Ivory & Soft Sage Vignette Overlay (Reduced Yellow, Added Muted Sage) */}
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-gradient-to-t from-[#1A1816]/95 via-[#23201D]/55 to-[#1E231E]/30"
        />

        {/* Central Champagne Focal Light Cone (Quiet, elegant glow on arch) */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_35%,rgba(245,238,228,0.18),transparent_70%)] pointer-events-none" />

        {/* Soft Muted Sage/Olive Atmospheric Base at Bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#181B18]/30 via-transparent to-[#181614]/85 pointer-events-none" />
      </motion.div>

      {/* 2. Floating Ambient Dust / Champagne & Sage Motes */}
      <motion.div
        style={{ y: motesY }}
        className="absolute inset-0 z-5 pointer-events-none overflow-hidden"
      >
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -25, 0],
              x: [0, (i % 2 === 0 ? 12 : -12), 0],
              opacity: [0.15, 0.6, 0.15],
            }}
            transition={{
              duration: 5 + (i % 4),
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
            style={{
              top: `${18 + (i * 7)}%`,
              left: `${10 + ((i * 19) % 80)}%`,
              width: `${(i % 2) + 2.5}px`,
              height: `${(i % 2) + 2.5}px`,
            }}
            className={`absolute rounded-full ${
              i % 3 === 0
                ? 'bg-[#A6B8A2] shadow-[0_0_6px_#A6B8A2]' // Muted sage mote
                : 'bg-[#EADECE] shadow-[0_0_6px_#EADECE]' // Champagne ivory mote
            } blur-[0.4px]`}
          />
        ))}
      </motion.div>

      {/* 3. Hero Editorial Content with 3D Depth & Generous Breathing Room */}
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
        className="relative z-10 max-w-3xl w-full mx-auto my-auto flex flex-col items-center justify-center text-white pt-6 pb-12"
      >
        {/* Subtle Elegant Eyebrow with Sage & Champagne Touches */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={preloaderFinished ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center gap-3 mb-5"
        >
          <span className="w-8 sm:w-12 h-[1px] bg-gradient-to-r from-transparent to-[#C9AF87]/60" />
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9DAE99]/80" />
            <span className="font-serif-en italic text-xs sm:text-[13px] tracking-[0.4em] uppercase text-[#EADFCF] font-light">
              Wedding Celebration
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#9DAE99]/80" />
          </div>
          <span className="w-8 sm:w-12 h-[1px] bg-gradient-to-l from-transparent to-[#C9AF87]/60" />
        </motion.div>

        {/* Grand Names in Ultra-Thin Arabic Display with 3D Depth */}
        <motion.div
          style={{ scale: titleScale }}
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={preloaderFinished ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mb-3 sm:mb-4"
        >
          <h1 className="font-display-ar text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extralight text-[#FFFFFF] tracking-widest leading-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.55)]">
            <span className="inline-block transition-transform duration-300 hover:scale-105 hover:text-[#FAF7F2]">
              {data.groomArabic}
            </span>
            <span className="mx-3 sm:mx-6 font-serif-en italic text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-[#D8C7B0] font-light inline-block transition-transform hover:rotate-6">
              &amp;
            </span>
            <span className="inline-block transition-transform duration-300 hover:scale-105 hover:text-[#FAF7F2]">
              {data.brideArabic}
            </span>
          </h1>
        </motion.div>

        {/* English Subtitle in Warm Pale Champagne */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={preloaderFinished ? { opacity: 0.9 } : {}}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="font-serif-en text-xs sm:text-sm md:text-base tracking-[0.45em] text-[#DDD0BE] uppercase mb-6 sm:mb-8 font-light"
        >
          {data.groomEnglish} &amp; {data.brideEnglish}
        </motion.div>

        {/* Poetic Welcoming Line with Clean Negative Space */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={preloaderFinished ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.55 }}
          className="font-calligraphy-ar text-lg sm:text-2xl md:text-3xl text-[#F7F3EE] font-normal max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
        >
          يسعدنا ويشرفنا حضوركم ومشاركتنا فرحة العمر
        </motion.p>

        {/* Date & Venue Glass Badge with Refined Sage and Ivory Accents */}
        <motion.div
          style={{ y: badgeY }}
          initial={{ scale: 0.94, opacity: 0 }}
          animate={preloaderFinished ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
          whileHover={{ scale: 1.03, y: -2 }}
          className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 px-7 py-3 rounded-full bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 hover:border-[#9DAE99]/40 shadow-xl text-[#FFFFFF] transition-all duration-300"
        >
          <div className="flex items-center gap-2.5">
            <Calendar className="w-3.5 h-3.5 text-[#D8C7B0] stroke-[1.2]" />
            <span className="font-display-ar text-xs sm:text-sm font-light tracking-wider">
              الثلاثاء، ٨ سبتمبر ٢٠٢٦
            </span>
          </div>

          <span className="hidden sm:inline text-[#9DAE99]/60 font-light">•</span>

          <div className="flex items-center gap-2.5">
            <MapPin className="w-3.5 h-3.5 text-[#D8C7B0] stroke-[1.2]" />
            <span className="font-body-ar text-xs sm:text-sm font-light text-white/95">
              {data.venueName}
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* 4. Minimalist Scroll Down Indicator */}
      <motion.button
        id="hero-scroll-indicator"
        onClick={handleScrollDown}
        initial={{ opacity: 0 }}
        animate={preloaderFinished ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.95 }}
        className="absolute bottom-6 z-10 flex flex-col items-center gap-1.5 text-white/70 hover:text-white transition-colors cursor-pointer group focus:outline-hidden"
      >
        <span className="font-serif-en text-[10px] sm:text-[11px] tracking-[0.35em] uppercase font-light text-[#DDD0BE] group-hover:text-white transition-colors">
          Explore Invitation
        </span>
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          className="w-7 h-7 rounded-full border border-white/25 flex items-center justify-center bg-white/10 backdrop-blur-xs group-hover:border-[#9DAE99]/60 group-hover:bg-white/20 transition-all shadow-sm"
        >
          <ChevronDown className="w-3.5 h-3.5 text-[#D8C7B0] stroke-[1.2]" />
        </motion.div>
      </motion.button>
    </section>
  );
};


