import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WeddingData } from '../types';
import { calculateCountdown, CountdownResult, formatTwoDigits } from '../utils/formatters';
import countdownBg from '../assets/countdown.png';

interface CountdownProps {
  data: WeddingData;
}

export const Countdown: React.FC<CountdownProps> = ({ data }) => {
  const [countdown, setCountdown] = useState<CountdownResult>(() =>
    calculateCountdown(data.date, data.time)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(calculateCountdown(data.date, data.time));
    }, 1000);

    return () => clearInterval(interval);
  }, [data.date, data.time]);

  const units = [
    { label: 'DAYS', labelAr: 'يوم', value: formatTwoDigits(countdown.days) },
    { label: 'HOURS', labelAr: 'ساعة', value: formatTwoDigits(countdown.hours) },
    { label: 'MINUTES', labelAr: 'دقيقة', value: formatTwoDigits(countdown.minutes) },
    { label: 'SECONDS', labelAr: 'ثانية', value: formatTwoDigits(countdown.seconds) },
  ];

  return (
    <section
      id="countdown"
      className="relative min-h-screen w-full flex flex-col items-center justify-center text-center overflow-hidden bg-[#F7F2EB] py-16 sm:py-24 px-4 select-none"
    >
      {/* 1. Full-Bleed High-Res Watercolor Art Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={countdownBg}
          alt="Counting the days countdown background"
          className="w-full h-full object-cover object-center sm:object-[center_35%] filter brightness-[1.01] contrast-[1.01]"
        />
        {/* Soft atmospheric gradient wash to ensure pristine readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F7F2EB]/35 via-transparent to-[#F7F2EB]/40" />
      </div>

      {/* 2. Central Editorial Content Layer */}
      <div className="relative z-10 max-w-2xl w-full mx-auto flex flex-col items-center justify-center my-auto pt-16 sm:pt-20 pb-28 sm:pb-36">
        
        {/* Editorial Eyebrow: COUNTING THE DAYS */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center mb-6 sm:mb-8"
        >
          <span className="font-serif-en text-xs sm:text-sm md:text-base tracking-[0.45em] sm:tracking-[0.55em] text-[#9E8765] uppercase font-light drop-shadow-xs">
            COUNTING THE DAYS
          </span>
          <span className="font-calligraphy-ar text-sm sm:text-base text-[#6E6356] mt-1 font-normal opacity-85">
            نعدّ الأيام واللحظات حتى موعد الفرح
          </span>
          
          {/* Subtle Vintage Flourish / Ornament Line */}
          <div className="flex items-center gap-2 mt-3 opacity-60">
            <span className="w-10 sm:w-16 h-[1px] bg-gradient-to-r from-transparent to-[#A9916F]" />
            <span className="w-1.5 h-1.5 rotate-45 border border-[#A9916F] bg-transparent" />
            <span className="w-10 sm:w-16 h-[1px] bg-gradient-to-l from-transparent to-[#A9916F]" />
          </div>
        </motion.div>

        {/* The Golden Live Digits with Separator Dots */}
        {countdown.status === 'upcoming' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center w-full my-2"
          >
            {/* Live Numbers Row with Separator Dots */}
            <div className="flex items-baseline justify-center gap-1.5 sm:gap-4 md:gap-6 flex-wrap">
              {units.map((unit, idx) => (
                <React.Fragment key={unit.label}>
                  <div className="flex flex-col items-center min-w-[58px] sm:min-w-[76px] md:min-w-[90px]">
                    <div className="h-14 sm:h-20 md:h-24 overflow-hidden flex items-center justify-center">
                      <RollingGoldNumber value={unit.value} />
                    </div>
                    {/* English and Arabic Sub-labels */}
                    <span className="font-serif-en text-[9px] sm:text-[11px] md:text-xs tracking-[0.3em] sm:tracking-[0.38em] text-[#9A825F] uppercase font-light mt-1">
                      {unit.label}
                    </span>
                    <span className="font-display-ar text-[10px] sm:text-xs text-[#7A6C5B] font-extralight mt-0.5">
                      {unit.labelAr}
                    </span>
                  </div>

                  {/* Elegant Golden Separator Dot between units */}
                  {idx < units.length - 1 && (
                    <div className="font-serif-en text-xl sm:text-3xl md:text-4xl text-[#B39972] font-light opacity-80 self-center mb-6 sm:mb-8 select-none">
                      ·
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </motion.div>
        )}

        {/* Day of Wedding Message */}
        {countdown.status === 'today' && (
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-6 sm:p-8 rounded-3xl bg-[#FAF7F2]/80 backdrop-blur-xs border border-[#C9AF87]/35 max-w-md shadow-xs text-center"
          >
            <p className="font-display-ar text-xl sm:text-2xl text-[#463F3A] font-light leading-relaxed">
              اليوم هو موعد الفرح والسرور
            </p>
            <p className="font-calligraphy-ar text-base text-[#6E6356] mt-2 font-normal">
              فرحتنا تكتمل بوجودكم بيننا الليلة
            </p>
            <span className="font-serif-en italic text-xs text-[#9E8765] tracking-widest block mt-3 font-light">
              TONIGHT AT 8:00 PM
            </span>
          </motion.div>
        )}

        {/* Post-wedding Message */}
        {countdown.status === 'passed' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 sm:p-8 rounded-3xl bg-[#FAF7F2]/80 backdrop-blur-xs border border-[#BDB1A5]/35 max-w-md shadow-xs text-center"
          >
            <p className="font-calligraphy-ar text-lg sm:text-xl text-[#5E695A] leading-relaxed font-normal">
              كانت ليلة لا تُنسى بوجودكم ومحبتكم. دامت دياركم عامرة بالأفراح.
            </p>
          </motion.div>
        )}

        {/* Elegant Lower Script: until we say I do */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mt-6 sm:mt-8 flex flex-col items-center"
        >
          <span className="font-serif-en italic text-base sm:text-xl md:text-2xl text-[#8E7655] font-light tracking-wide">
            until we say I do
          </span>
          <span className="font-calligraphy-ar text-sm sm:text-base text-[#685D51] mt-1 font-normal opacity-85">
            حتى نلتقي ونعقد عهد العمر
          </span>
        </motion.div>

      </div>
    </section>
  );
};

interface RollingGoldNumberProps {
  value: string;
}

const RollingGoldNumber: React.FC<RollingGoldNumberProps> = ({ value }) => {
  const chars = value.split('');

  return (
    <div className="flex items-center gap-0.5 sm:gap-1">
      {chars.map((char, index) => (
        <div
          key={index}
          className="relative h-14 sm:h-20 md:h-24 w-6 sm:w-8 md:w-10 overflow-hidden flex items-center justify-center"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={`${index}-${char}`}
              initial={{ y: '50%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              exit={{ y: '-50%', opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif-en text-4xl sm:text-6xl md:text-7xl font-extralight text-[#8E714B] tracking-tight block select-none drop-shadow-[0_1px_2px_rgba(255,255,255,0.7)]"
              style={{
                background: 'linear-gradient(180deg, #7A5E38 0%, #A28255 60%, #765B36 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {char}
            </motion.span>
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};
