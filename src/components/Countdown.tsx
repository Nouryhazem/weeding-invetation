import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WeddingData } from '../types';
import { calculateCountdown, CountdownResult, formatTwoDigits } from '../utils/formatters';

interface CountdownProps {
  data: WeddingData;
}

export const Countdown: React.FC<CountdownProps> = ({ data }) => {
  const [countdown, setCountdown] = useState<CountdownResult>(() =>
    calculateCountdown(data.date, data.time)
  );

  useEffect(() => {
    const updateCountdown = () => {
      setCountdown(calculateCountdown(data.date, data.time));
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [data.date, data.time]);

  // Explicit LTR units layout so Days is first on the left (or right with explicit labels)
  const units = [
    { label: 'DAYS', labelAr: 'يوم', value: formatTwoDigits(countdown.days) },
    { label: 'HOURS', labelAr: 'ساعة', value: formatTwoDigits(countdown.hours) },
    { label: 'MINUTES', labelAr: 'دقيقة', value: formatTwoDigits(countdown.minutes) },
    { label: 'SECONDS', labelAr: 'ثانية', value: formatTwoDigits(countdown.seconds) },
  ];

  return (
    <section
      id="countdown"
      className="relative w-full flex flex-col items-center justify-center text-center overflow-hidden bg-[#FAF7F2] py-12 sm:py-16 md:py-20 px-4 select-none border-b border-[#D8CCA8]"
    >
      {/* Central Content Layer */}
      <div className="relative z-10 max-w-2xl w-full mx-auto flex flex-col items-center justify-center">
        {/* The Golden Live Digits with Separator Dots */}
        {countdown.status === 'upcoming' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center w-full my-2"
          >
            {/* Live Numbers Row with explicit LTR order for numerals so 07 always displays left-to-right as 0 then 7 */}
            <div dir="ltr" className="flex items-baseline justify-center gap-1.5 sm:gap-4 md:gap-6 flex-wrap">
              {units.map((unit, idx) => (
                <React.Fragment key={unit.label}>
                  <div className="flex flex-col items-center min-w-[58px] sm:min-w-[76px] md:min-w-[90px]">
                    <div className="h-14 sm:h-20 md:h-24 overflow-hidden flex items-center justify-center" dir="ltr">
                      <RollingGoldNumber value={unit.value} />
                    </div>
                    {/* English and Arabic Sub-labels - Highest Contrast */}
                    <span className="font-serif-en text-[10px] sm:text-[11.5px] md:text-xs tracking-[0.3em] sm:tracking-[0.38em] text-[#634718] uppercase font-bold mt-1">
                      {unit.label}
                    </span>
                    <span className="font-display-ar text-[11px] sm:text-xs text-[#110D0B] font-bold mt-0.5">
                      {unit.labelAr}
                    </span>
                  </div>

                  {/* Elegant Golden Separator Dot between units */}
                  {idx < units.length - 1 && (
                    <div className="font-serif-en text-xl sm:text-3xl md:text-4xl text-[#7A5822] font-bold self-center mb-6 sm:mb-8 select-none">
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
            className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#7A5822] max-w-md shadow-md text-center"
          >
            <p className="font-display-ar text-xl sm:text-2xl text-[#110D0B] font-bold leading-relaxed">
              اليوم هو موعد الفرح والسرور
            </p>
            <p className="font-calligraphy-ar text-base sm:text-lg text-[#110D0B] mt-2 font-bold">
              فرحتنا تكتمل بوجودكم بيننا الليلة
            </p>
            <span className="font-serif-en italic text-xs text-[#7A5822] tracking-widest block mt-3 font-bold">
              TONIGHT AT 8:00 PM
            </span>
          </motion.div>
        )}

        {/* Post-wedding Message */}
        {countdown.status === 'passed' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#1F331D] max-w-md shadow-md text-center"
          >
            <p className="font-calligraphy-ar text-lg sm:text-xl text-[#1F331D] leading-relaxed font-bold">
              كانت ليلة لا تُنسى بوجودكم ومحبتكم. دامت دياركم عامرة بالأفراح.
            </p>
          </motion.div>
        )}

        {/* Elegant Lower Script: until we say I do */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 sm:mt-8 flex flex-col items-center"
        >
          <span className="font-serif-en italic text-lg sm:text-xl md:text-2xl text-[#634718] font-bold tracking-wide">
            until we say I do
          </span>
          <span className="font-calligraphy-ar text-sm sm:text-base text-[#110D0B] mt-1 font-bold">
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
    <div className="flex items-center gap-0.5 sm:gap-1" dir="ltr">
      {chars.map((char, index) => (
        <div
          key={index}
          className="relative h-14 sm:h-20 md:h-24 w-6 sm:w-8 md:w-10 overflow-hidden flex items-center justify-center"
          dir="ltr"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={`${index}-${char}`}
              initial={{ y: '50%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              exit={{ y: '-50%', opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif-en text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight block select-none drop-shadow-[0_2px_4px_rgba(255,255,255,0.9)]"
              style={{
                background: 'linear-gradient(180deg, #593E1A 0%, #876228 50%, #4D3312 100%)',
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
