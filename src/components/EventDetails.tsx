import React from 'react';
import { motion } from 'motion/react';
import { WeddingData } from '../types';
import { getArabicDateDetails } from '../utils/formatters';
import { Calendar, Clock, MapPin, Sparkles } from 'lucide-react';
import { AppleCard } from './AppleCard';

interface EventDetailsProps {
  data: WeddingData;
}

export const EventDetails: React.FC<EventDetailsProps> = ({ data }) => {
  const dateDetails = getArabicDateDetails(data.date, data.time);

  return (
    <section
      id="details"
      className="relative bg-[#F4EFEA] text-[#3D3835] py-20 md:py-28 px-4 sm:px-6 overflow-hidden"
    >
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        
        {/* Header Heading */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="font-serif-en italic text-xs tracking-[0.35em] uppercase text-[#9D9287] block mb-1 font-light">
            Celebration Details
          </span>
          <h2 className="font-display-ar text-2xl sm:text-4xl font-extralight text-[#3D3835]">
            تفاصيل حفل الزفاف
          </h2>
          <p className="font-calligraphy-ar text-sm sm:text-base text-[#5E695A] mt-1.5 font-normal">
            يسعدنا تشريفكم لنا في هذا اليوم المبارك
          </p>
        </motion.div>

        {/* 4 Core Detail Cards Grid with Apple-Style 3D Tilt & Specular Hover */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 w-full mb-8">
          
          {/* 1. Date & Day */}
          <AppleCard
            id="detail-card-date"
            delay={0}
            className="p-5 sm:p-6 bg-[#FAF7F2] border border-[#C9AF87]/25 flex items-start gap-4 overflow-hidden"
          >
            <div className="w-10 h-10 rounded-full bg-[#EFE8DC]/60 border border-[#9DAE99]/35 flex items-center justify-center text-[#5E695A] shrink-0">
              <Calendar className="w-4 h-4 stroke-[1.2]" />
            </div>
            <div>
              <span className="font-serif-en text-[11px] tracking-widest text-[#9D9287] uppercase block mb-0.5 font-light">
                Date &amp; Day
              </span>
              <h3 className="font-display-ar text-base sm:text-lg font-light text-[#3D3835] mb-0.5">
                {dateDetails.dayName}، {dateDetails.rawDay} {dateDetails.monthName} {dateDetails.year}
              </h3>
              <p className="font-serif-en text-xs text-[#5E695A] font-light">
                Tuesday, September 8, 2026
              </p>
            </div>
          </AppleCard>

          {/* 2. Time & Reception */}
          <AppleCard
            id="detail-card-time"
            delay={0.1}
            className="p-5 sm:p-6 bg-[#FAF7F2] border border-[#C9AF87]/25 flex items-start gap-4 overflow-hidden"
          >
            <div className="w-10 h-10 rounded-full bg-[#EFE8DC]/60 border border-[#9DAE99]/35 flex items-center justify-center text-[#5E695A] shrink-0">
              <Clock className="w-4 h-4 stroke-[1.2]" />
            </div>
            <div>
              <span className="font-serif-en text-[11px] tracking-widest text-[#9D9287] uppercase block mb-0.5 font-light">
                Timing
              </span>
              <h3 className="font-display-ar text-base sm:text-lg font-light text-[#3D3835] mb-0.5">
                {dateDetails.timeArabic}
              </h3>
              <p className="font-serif-en text-xs text-[#5E695A] font-light">
                8:00 PM (Cairo Time)
              </p>
            </div>
          </AppleCard>

          {/* 3. Venue */}
          <AppleCard
            id="detail-card-venue"
            delay={0.18}
            className="p-5 sm:p-6 bg-[#FAF7F2] border border-[#C9AF87]/25 flex items-start gap-4 overflow-hidden"
          >
            <div className="w-10 h-10 rounded-full bg-[#EFE8DC]/60 border border-[#9DAE99]/35 flex items-center justify-center text-[#5E695A] shrink-0">
              <MapPin className="w-4 h-4 stroke-[1.2]" />
            </div>
            <div>
              <span className="font-serif-en text-[11px] tracking-widest text-[#9D9287] uppercase block mb-0.5 font-light">
                Location
              </span>
              <h3 className="font-display-ar text-base sm:text-lg font-light text-[#3D3835] mb-0.5">
                {data.venueName}
              </h3>
              <p className="font-body-ar text-xs sm:text-sm text-[#5E695A] font-light">
                {data.venueAddress}
              </p>
            </div>
          </AppleCard>

          {/* 4. Dress Code */}
          <AppleCard
            id="detail-card-dress"
            delay={0.25}
            className="p-5 sm:p-6 bg-[#FAF7F2] border border-[#C9AF87]/25 flex items-start gap-4 overflow-hidden"
          >
            <div className="w-10 h-10 rounded-full bg-[#EFE8DC]/60 border border-[#9DAE99]/35 flex items-center justify-center text-[#5E695A] shrink-0">
              <Sparkles className="w-4 h-4 stroke-[1.2]" />
            </div>
            <div>
              <span className="font-serif-en text-[11px] tracking-widest text-[#9D9287] uppercase block mb-0.5 font-light">
                Dress Code
              </span>
              <h3 className="font-display-ar text-base sm:text-lg font-light text-[#3D3835] mb-0.5">
                ملابس رسمية / سهرة
              </h3>
              <p className="font-serif-en text-xs text-[#5E695A] font-light">
                Formal Evening Attire
              </p>
            </div>
          </AppleCard>

        </div>

      </div>
    </section>
  );
};

