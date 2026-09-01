import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { WeddingData } from '../types';
import { downloadIcsCalendar } from '../utils/calendar';
import { Calendar } from 'lucide-react';

interface AnimatedDateProps {
  data: WeddingData;
}

export const AnimatedDate: React.FC<AnimatedDateProps> = ({ data }) => {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end']
  });

  const dayScale = useTransform(scrollYProgress, [0, 0.45, 0.85], [1.4, 1.08, 1]);
  const dayOpacity = useTransform(scrollYProgress, [0, 0.25, 0.9], [0.4, 1, 1]);
  const dayY = useTransform(scrollYProgress, [0, 0.45, 0.85], ['-15px', '0px', '0px']);

  const monthX = useTransform(scrollYProgress, [0.15, 0.6, 0.85], ['40vw', '0vw', '0vw']);
  const monthOpacity = useTransform(scrollYProgress, [0.2, 0.5, 0.9], [0, 1, 1]);

  const yearY = useTransform(scrollYProgress, [0.35, 0.75, 0.85], ['35px', '0px', '0px']);
  const yearOpacity = useTransform(scrollYProgress, [0.4, 0.7, 0.9], [0, 1, 1]);

  const actionOpacity = useTransform(scrollYProgress, [0.65, 0.9], [0, 1]);
  const actionY = useTransform(scrollYProgress, [0.65, 0.9], [15, 0]);

  return (
    <section
      ref={sectionRef}
      id="date"
      className="relative bg-[#F4EEE7] min-h-[140vh] md:min-h-[170vh] selection:bg-[#C9AF87]/20"
    >
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center items-center overflow-hidden px-4 sm:px-6">
        
        {/* Subtle Hand-Painted Border Frame */}
        <div className="absolute inset-4 sm:inset-10 border border-[#C9AF87]/20 rounded-3xl pointer-events-none" />

        {/* Top Heading */}
        <div className="text-center z-10 mb-5 md:mb-7">
          <span className="font-serif-en italic text-xs tracking-[0.35em] uppercase text-[#A6988B] block mb-1 font-light">
            Save The Date
          </span>
          <h2 className="font-display-ar text-2xl md:text-3xl font-extralight text-[#463F3A]">
            احفظوا تاريخ ليلتنا
          </h2>
        </div>

        {/* 3 Moments Date Composition in Slender Elegance */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto w-full max-w-xl py-2">
          
          {/* Day: 08 */}
          <motion.div
            style={{ scale: dayScale, opacity: dayOpacity, y: dayY }}
            className="font-serif-en text-7xl sm:text-9xl md:text-[105px] font-extralight text-[#463F3A] leading-none tracking-tight"
          >
            08
          </motion.div>

          {/* Month: سبتمبر */}
          <motion.div
            style={{ x: monthX, opacity: monthOpacity }}
            className="font-display-ar text-3xl sm:text-4xl md:text-5xl font-extralight text-[#62695D] tracking-wide my-2 md:my-3"
          >
            سبتمبر
          </motion.div>

          {/* Year: 2026 */}
          <motion.div
            style={{ y: yearY, opacity: yearOpacity }}
            className="font-serif-en text-3xl sm:text-5xl md:text-6xl font-extralight text-[#A6988B] tracking-[0.25em]"
          >
            2026
          </motion.div>

          {/* Slender Champagne Divider */}
          <motion.div
            style={{ opacity: actionOpacity }}
            className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#C9AF87] to-transparent my-5"
          />

          {/* Add to Calendar Button */}
          <motion.div
            style={{ opacity: actionOpacity, y: actionY }}
            className="flex flex-col items-center"
          >
            <button
              id="btn-add-calendar"
              onClick={() => downloadIcsCalendar(data)}
              className="group flex items-center gap-2.5 px-7 py-3 bg-[#FAF7F2] border border-[#C9AF87]/35 hover:border-[#C9AF87] text-[#463F3A] rounded-full transition-all duration-300 shadow-xs cursor-pointer focus:outline-hidden font-light text-xs sm:text-sm tracking-wide"
            >
              <Calendar className="w-4 h-4 text-[#62695D] stroke-[1.2]" />
              <span className="font-body-ar">
                أضف الموعد للتقويم
              </span>
            </button>
            
            <span className="font-body-ar text-[11px] text-[#A6988B] mt-2 font-extralight">
              متوافق مع تقويم Apple و Google و Outlook
            </span>
          </motion.div>
        </div>

        {/* Bottom subtle time info */}
        <div className="absolute bottom-6 font-display-ar text-xs text-[#62695D] tracking-wider font-extralight">
          الثلاثاء • الثامنة مساءً بتوقيت القاهرة
        </div>
      </div>
    </section>
  );
};

