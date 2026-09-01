import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WeddingData } from '../types';
import { ChevronRight, ChevronLeft, Heart } from 'lucide-react';
import { AppleCard } from './AppleCard';

interface PhotoJourneyProps {
  data: WeddingData;
}

export const PhotoJourney: React.FC<PhotoJourneyProps> = ({ data }) => {
  const images = data.journeyImages && data.journeyImages.length > 0 ? data.journeyImages : [];
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) return null;

  const currentItem = images[activeIndex];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <section
      id="journey"
      className="relative py-20 md:py-28 px-4 sm:px-6 bg-[#F4EEE7] text-[#463F3A] overflow-hidden"
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12"
        >
          <span className="font-serif-en italic text-xs tracking-[0.35em] uppercase text-[#A6988B] block mb-1 font-light">
            Our Moments
          </span>
          <h2 className="font-display-ar text-2xl sm:text-3xl font-extralight text-[#463F3A] mb-2">
            حكاية حبنا ولحظاتنا الجميلة
          </h2>
          <p className="font-calligraphy-ar text-sm sm:text-base text-[#62695D] max-w-md mx-auto font-normal">
            محطات نعتز بها في طريقنا نحو ليلة العمر
          </p>
        </motion.div>

        {/* Gallery Card Frame with Apple-Style 3D Tilt & Specular Hover */}
        <AppleCard
          id="photo-journey-card"
          delay={0.1}
          className="w-full max-w-2xl bg-[#FAF7F2] p-3.5 sm:p-6 border border-[#C9AF87]/25 overflow-hidden"
        >
          {/* Main Photo Showcase */}
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden bg-[#F4EEE7] border border-[#C9AF87]/20 group">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentItem.id || activeIndex}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full relative"
              >
                <img
                  src={currentItem.src}
                  alt={currentItem.caption}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                {/* Soft Warm Gradient Overlay at Bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#463F3A]/70 via-[#463F3A]/20 to-transparent" />

                {/* Overlaid Caption on Image */}
                <div className="absolute bottom-5 right-5 left-5 text-right z-10 text-[#FAF7F2]">
                  <div className="flex items-center gap-1.5 text-[#FAF7F2]/90 mb-1">
                    <Heart className="w-3 h-3 fill-[#DECBC7]" />
                    <span className="font-serif-en text-[10px] tracking-widest uppercase font-light">
                      Moment 0{activeIndex + 1}
                    </span>
                  </div>
                  <h3 className="font-display-ar text-lg sm:text-2xl font-extralight text-[#FAF7F2] mb-0.5 tracking-wide">
                    {currentItem.caption}
                  </h3>
                  {currentItem.subtitle && (
                    <p className="font-body-ar text-xs sm:text-sm text-[#FAF7F2]/80 font-extralight">
                      {currentItem.subtitle}
                    </p>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls & Indicators */}
          <div className="flex items-center justify-between mt-4 px-2 relative z-10">
            
            {/* Prev Button */}
            <motion.button
              onClick={handlePrev}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.92 }}
              aria-label="Previous image"
              className="w-8 h-8 rounded-full border border-[#C9AF87]/35 flex items-center justify-center text-[#62695D] hover:bg-[#F4EEE7] transition-colors cursor-pointer bg-[#FAF7F2] shadow-xs"
            >
              <ChevronRight className="w-4 h-4 stroke-[1.2]" />
            </motion.button>

            {/* Pagination Dots */}
            <div className="flex items-center gap-1.5">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Go to photo ${idx + 1}`}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    idx === activeIndex
                      ? 'w-6 h-1.5 bg-[#C9AF87]'
                      : 'w-1.5 h-1.5 bg-[#BDB1A5]/40 hover:bg-[#C9AF87]/60'
                  }`}
                />
              ))}
            </div>

            {/* Next Button */}
            <motion.button
              onClick={handleNext}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.92 }}
              aria-label="Next image"
              className="w-8 h-8 rounded-full border border-[#C9AF87]/35 flex items-center justify-center text-[#62695D] hover:bg-[#F4EEE7] transition-colors cursor-pointer bg-[#FAF7F2] shadow-xs"
            >
              <ChevronLeft className="w-4 h-4 stroke-[1.2]" />
            </motion.button>
          </div>
        </AppleCard>

      </div>
    </section>
  );
};

