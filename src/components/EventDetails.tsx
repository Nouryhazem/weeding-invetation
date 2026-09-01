import React, { useRef, useState } from 'react';
import { motion, useScroll, useMotionValueEvent, useTransform } from 'motion/react';
import { WeddingData } from '../types';
import { ExternalLink } from 'lucide-react';

interface EventDetailsProps {
  data: WeddingData;
}

interface TimelineItem {
  number: string;
  category: string;
  titleAr: string;
  subtitleAr?: string;
  titleEn: string;
  actionText?: string;
  actionLink?: string;
}

export const EventDetails: React.FC<EventDetailsProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });

  // Calculate active index based on scroll position
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (latest < 0.25) {
      setActiveIndex(0);
    } else if (latest < 0.50) {
      setActiveIndex(1);
    } else if (latest < 0.75) {
      setActiveIndex(2);
    } else {
      setActiveIndex(3);
    }
  });

  // Progress percentage for drawing the vertical line smoothly
  const progressLine = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  const timelineItems: TimelineItem[] = [
    {
      number: '01',
      category: 'التاريخ',
      titleAr: 'الثلاثاء، 8 سبتمبر 2026',
      titleEn: 'Tuesday, September 8, 2026',
    },
    {
      number: '02',
      category: 'الموعد',
      titleAr: '8:00 مساءً',
      titleEn: '8:00 PM',
    },
    {
      number: '03',
      category: 'المكان',
      titleAr: data.venueName,
      subtitleAr: data.venueAddress,
      titleEn: 'Samalut',
      actionText: 'افتحوا الموقع',
      actionLink: data.mapsUrl,
    },
    {
      number: '04',
      category: 'الأناقة',
      titleAr: 'أزياء سهرة رسمية',
      titleEn: 'Formal Evening Attire',
    },
  ];

  return (
    <section
      id="details"
      ref={containerRef}
      className="relative bg-[#FAF7F2] text-[#110D0B] py-20 sm:py-28 md:py-36 px-4 sm:px-8 md:px-12 overflow-hidden select-none border-b border-[#D8CCA8]"
    >
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        
        {/* Editorial Minimal Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 sm:mb-20 md:mb-24"
        >
          <span className="font-serif-en text-[11px] sm:text-xs tracking-[0.45em] uppercase text-[#634718] block mb-2 sm:mb-3 font-bold">
            CELEBRATION DETAILS
          </span>
          <h2 className="font-display-ar text-2xl sm:text-3xl md:text-4xl font-bold text-[#110D0B] tracking-wide">
            تفاصيل ليلتنا
          </h2>
        </motion.div>

        {/* ======================================================== */}
        {/* SIDE-ALIGNED VERTICAL TIMELINE (RTL-Friendly, Desktop & Mobile) */}
        {/* ======================================================== */}
        <div className="relative w-full max-w-2xl px-2 sm:px-6">
          
          {/* Vertical Track Line on the right side (RTL) */}
          <div className="absolute top-6 bottom-6 right-6 sm:right-10 w-[2px] bg-[#D8CCA8]" />

          {/* Dynamic Scroll Progress Line */}
          <motion.div
            className="absolute top-6 right-6 sm:right-10 w-[2px] bg-[#1F331D] origin-top z-0"
            style={{
              height: progressLine,
              maxHeight: 'calc(100% - 48px)',
            }}
          />

          {/* Timeline Items List */}
          <div className="flex flex-col gap-10 sm:gap-14 md:gap-16 w-full z-10 relative">
            {timelineItems.map((item, idx) => {
              const isActive = activeIndex === idx;
              return (
                <div
                  key={item.number}
                  onClick={() => setActiveIndex(idx)}
                  className="flex items-start gap-4 sm:gap-7 cursor-pointer group transition-all duration-700"
                  style={{
                    opacity: isActive ? 1 : 0.65,
                    transform: isActive ? 'scale(1)' : 'scale(0.98)',
                    transition: 'all 700ms cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  {/* Timeline Stop Node & White Flower Column (Right side) */}
                  <div className="relative flex flex-col items-center shrink-0 w-8 sm:w-10 pt-1.5 z-10">
                    
                    {/* Node Dot / Flower Container */}
                    <div
                      className={`relative flex items-center justify-center transition-all duration-700 rounded-full ${
                        isActive
                          ? 'w-7 h-7 sm:w-8 sm:h-8 bg-white border-2 border-[#1F331D] shadow-[0_2px_10px_rgba(31,51,29,0.3)]'
                          : 'w-4 h-4 sm:w-5 sm:h-5 bg-white ring-2 ring-[#7A5822]'
                      }`}
                    >
                      {isActive ? (
                        /* Crisp & Professional Blooming White Flower */
                        <motion.div
                          initial={{ scale: 0, rotate: -30, opacity: 0 }}
                          animate={{ scale: 1, rotate: 0, opacity: 1 }}
                          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center"
                        >
                          <WhiteBotanicalFlower className="w-6 h-6 sm:w-7 sm:h-7" />
                        </motion.div>
                      ) : (
                        /* Inactive Minimal Node */
                        <div className="w-2 h-2 rounded-full bg-[#7A5822] group-hover:bg-[#1F331D] transition-colors" />
                      )}
                    </div>

                    {/* Step Number */}
                    <span
                      className={`font-serif-en text-[11px] tracking-widest mt-2 transition-colors duration-500 uppercase select-none ${
                        isActive ? 'text-[#1F331D] font-bold' : 'text-[#634718] font-bold'
                      }`}
                    >
                      {item.number}
                    </span>
                  </div>

                  {/* Side Text Content (Left of the line in RTL) */}
                  <div className="flex flex-col text-right flex-1 pt-0.5">
                    
                    {/* Category Label with Small White Accent Flower for Active Item */}
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-serif-en text-xs tracking-[0.25em] text-[#634718] uppercase font-bold">
                        {item.number} —
                      </span>
                      <span
                        className={`font-display-ar text-sm sm:text-base transition-colors duration-500 ${
                          isActive ? 'text-[#1F331D] font-bold' : 'text-[#634718] font-bold'
                        }`}
                      >
                        {item.category}
                      </span>
                    </div>

                    {/* Main Arabic Title */}
                    <h3
                      className={`font-display-ar text-xl sm:text-2xl md:text-3xl font-bold leading-snug transition-colors duration-500 ${
                        isActive ? 'text-[#110D0B]' : 'text-[#241C16]'
                      }`}
                    >
                      {item.titleAr}
                    </h3>

                    {/* Optional Address Subtitle */}
                    {item.subtitleAr && (
                      <p className="font-body-ar text-xs sm:text-sm text-[#241C16] font-medium mt-0.5">
                        {item.subtitleAr}
                      </p>
                    )}

                    {/* English Sub-label */}
                    <p className="font-serif-en text-[11.5px] sm:text-xs text-[#634718] font-bold tracking-wide mt-1.5">
                      {item.titleEn}
                    </p>

                    {/* Optional Action link (Location) */}
                    {item.actionText && item.actionLink && (
                      <div className="mt-3">
                        <a
                          href={item.actionLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-display-ar text-[#1F331D] hover:text-black font-bold transition-colors border-b-2 border-[#1F331D] pb-0.5 group/link"
                        >
                          <span>{item.actionText}</span>
                          <ExternalLink className="w-3.5 h-3.5 stroke-[2] transition-transform group-hover/link:translate-x-[-2px] group-hover/link:-translate-y-[2px]" />
                        </a>
                      </div>
                    )}

                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};

/**
 * Premium, professional white botanical watercolor flower SVG with golden core
 */
const WhiteBotanicalFlower: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ filter: 'drop-shadow(0 1px 3px rgba(120, 110, 95, 0.22))' }}
    >
      <defs>
        {/* Soft petal gradient */}
        <linearGradient id="petalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="70%" stopColor="#F9F6F0" />
          <stop offset="100%" stopColor="#EFE8DC" />
        </linearGradient>
        {/* Antique Champagne Golden core gradient */}
        <radialGradient id="coreGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#DFC393" />
          <stop offset="60%" stopColor="#C9AF87" />
          <stop offset="100%" stopColor="#A98A59" />
        </radialGradient>
      </defs>

      {/* 8 Symmetrical Elegant Porcelain White Petals */}
      {/* Petal 1 (Top) */}
      <path
        d="M18 18 C14 11, 14 3, 18 2 C22 3, 22 11, 18 18Z"
        fill="url(#petalGrad)"
        stroke="#DACFBE"
        strokeWidth="0.6"
      />
      {/* Petal 2 (Top-Right) */}
      <path
        d="M18 18 C23 13, 29 7, 30 10 C29 14, 23 20, 18 18Z"
        fill="url(#petalGrad)"
        stroke="#DACFBE"
        strokeWidth="0.6"
      />
      {/* Petal 3 (Right) */}
      <path
        d="M18 18 C25 14, 33 14, 34 18 C33 22, 25 22, 18 18Z"
        fill="url(#petalGrad)"
        stroke="#DACFBE"
        strokeWidth="0.6"
      />
      {/* Petal 4 (Bottom-Right) */}
      <path
        d="M18 18 C23 23, 29 29, 26 31 C22 30, 19 24, 18 18Z"
        fill="url(#petalGrad)"
        stroke="#DACFBE"
        strokeWidth="0.6"
      />
      {/* Petal 5 (Bottom) */}
      <path
        d="M18 18 C14 25, 14 33, 18 34 C22 33, 22 25, 18 18Z"
        fill="url(#petalGrad)"
        stroke="#DACFBE"
        strokeWidth="0.6"
      />
      {/* Petal 6 (Bottom-Left) */}
      <path
        d="M18 18 C13 23, 7 29, 6 26 C7 22, 13 19, 18 18Z"
        fill="url(#petalGrad)"
        stroke="#DACFBE"
        strokeWidth="0.6"
      />
      {/* Petal 7 (Left) */}
      <path
        d="M18 18 C11 14, 3 14, 2 18 C3 22, 11 22, 18 18Z"
        fill="url(#petalGrad)"
        stroke="#DACFBE"
        strokeWidth="0.6"
      />
      {/* Petal 8 (Top-Left) */}
      <path
        d="M18 18 C13 13, 7 7, 10 6 C14 7, 17 13, 18 18Z"
        fill="url(#petalGrad)"
        stroke="#DACFBE"
        strokeWidth="0.6"
      />

      {/* Inner Petal Highlights Layer */}
      <circle cx="18" cy="18" r="5" fill="#FAF6EE" stroke="#E5DAC9" strokeWidth="0.5" opacity="0.9" />

      {/* Golden Pistil Center Core */}
      <circle cx="18" cy="18" r="3.2" fill="url(#coreGrad)" />
      
      {/* Delicate Pistil Dots */}
      <circle cx="16.8" cy="16.8" r="0.6" fill="#FFF2B2" />
      <circle cx="19.2" cy="16.8" r="0.6" fill="#FFF2B2" />
      <circle cx="18" cy="19.2" r="0.6" fill="#FFF2B2" />
    </svg>
  );
};
