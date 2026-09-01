import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { WeddingData } from '../types';
import { AppleCard } from './AppleCard';
import { RefinedSatinBow } from './RefinedSatinBow';

interface InvitationStatementProps {
  data: WeddingData;
}

const MAIN_WORDS = [
  { word: 'بكل', isHighlight: false },
  { word: 'المحبة', isHighlight: true },
  { word: 'والسرور،', isHighlight: false },
  { word: 'نتشرف', isHighlight: false },
  { word: 'بدعوتكم', isHighlight: true },
  { word: 'لتشاركونا', isHighlight: false },
  { word: 'فرحة', isHighlight: false },
  { word: 'زفافنا', isHighlight: true }
];

export const InvitationStatement: React.FC<InvitationStatementProps> = ({ data }) => {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });

  const lineScaleX = useTransform(scrollYProgress, [0.15, 0.85], [0, 1]);

  return (
    <section
      ref={sectionRef}
      id="statement"
      className="relative min-h-[65vh] py-18 md:py-24 px-4 sm:px-6 bg-[#F4EFEA] flex flex-col justify-center items-center overflow-hidden"
    >
      {/* Decorative Minimalist Watercolor Stationery Card with Apple-Style Scroll & Hover */}
      <AppleCard
        id="invitation-statement-card"
        className="max-w-3xl w-full mx-auto bg-[#FAF7F2] p-7 sm:p-12 md:p-16 border border-[#C9AF87]/25"
        delay={0.1}
      >
        {/* Inner Inset Border with Subtle Sage & Champagne Touch */}
        <div className="absolute inset-3 sm:inset-4 border border-[#9DAE99]/25 rounded-2xl pointer-events-none" />

        <div className="relative z-10 text-center flex flex-col items-center">
          {/* Subtle Delicate Satin Ribbon Bow at Top */}
          <div className="mb-2">
            <RefinedSatinBow size="sm" />
          </div>

          {/* Subtle English Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-8 h-[1px] bg-[#C9AF87]/35" />
            <span className="font-serif-en italic text-xs tracking-[0.35em] uppercase text-[#9D9287] font-light">
              With Love &amp; Joy
            </span>
            <div className="w-8 h-[1px] bg-[#C9AF87]/35" />
          </motion.div>

          {/* Word-by-Word Scroll Reveal Statement in Thin Typography */}
          <div className="flex flex-wrap justify-center items-center gap-x-2.5 gap-y-2 md:gap-x-3.5 md:gap-y-2.5 max-w-2xl leading-relaxed text-center mb-5">
            {MAIN_WORDS.map((item, idx) => {
              const startRange = 0.15 + (idx / MAIN_WORDS.length) * 0.45;
              const endRange = startRange + 0.12;

              return (
                <WordItem
                  key={idx}
                  word={item.word}
                  isHighlight={item.isHighlight}
                  scrollYProgress={scrollYProgress}
                  startRange={startRange}
                  endRange={endRange}
                />
              );
            })}
          </div>

          {/* Slender Divider */}
          <div className="w-full max-w-xs h-[1px] bg-[#BDB1A5]/30 my-3 relative overflow-hidden">
            <motion.div
              style={{ scaleX: lineScaleX }}
              className="h-full w-full bg-gradient-to-r from-transparent via-[#7E8C7A]/60 to-transparent origin-center"
            />
          </div>

          {/* Poetic Arabic Invitation Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-calligraphy-ar text-base sm:text-lg md:text-xl text-[#5E695A] mt-2 max-w-md leading-relaxed font-normal"
          >
            حضوركم يزيّن ليلتنا، ويزيد قلوبنا بهجةً وسروراً
          </motion.p>
        </div>
      </AppleCard>
    </section>
  );
};

interface WordItemProps {
  word: string;
  isHighlight: boolean;
  scrollYProgress: any;
  startRange: number;
  endRange: number;
}

const WordItem: React.FC<WordItemProps> = ({
  word,
  isHighlight,
  scrollYProgress,
  startRange,
  endRange
}) => {
  const color = useTransform(
    scrollYProgress,
    [startRange, endRange],
    isHighlight ? ['#BDB1A5', '#5E695A'] : ['#BDB1A5', '#3D3835']
  );

  const opacity = useTransform(scrollYProgress, [startRange, endRange], [0.35, 1]);
  const y = useTransform(scrollYProgress, [startRange, endRange], [3, 0]);

  return (
    <motion.span
      style={{ color, opacity, y }}
      className="font-display-ar text-2xl sm:text-3xl md:text-4xl font-extralight tracking-wider transition-colors duration-200 inline-block"
    >
      {word}
    </motion.span>
  );
};

