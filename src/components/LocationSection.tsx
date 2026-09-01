import React from 'react';
import { motion } from 'motion/react';
import { WeddingData } from '../types';
import { MapPin, Navigation, ExternalLink, Car } from 'lucide-react';

interface LocationSectionProps {
  data: WeddingData;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ data }) => {
  const hasValidMapsUrl = Boolean(
    data.mapsUrl &&
    data.mapsUrl.trim().length > 0 &&
    !data.mapsUrl.includes('[GOOGLE_MAPS_URL]')
  );

  const handleOpenMaps = () => {
    if (hasValidMapsUrl) {
      window.open(data.mapsUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section
      id="location"
      className="relative bg-[#FAF7F2] text-[#110D0B] py-20 sm:py-28 md:py-36 px-4 sm:px-6 md:px-12 overflow-hidden select-none border-b border-[#D8CCA8]"
    >
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="font-serif-en text-[11px] sm:text-xs tracking-[0.45em] uppercase text-[#634718] block mb-2 sm:mb-3 font-bold">
            THE VENUE &amp; LOCATION
          </span>
          <h2 className="font-display-ar text-2xl sm:text-3xl md:text-4xl font-bold text-[#110D0B] tracking-wide">
            موقع الحفل والوصول
          </h2>
          <p className="font-calligraphy-ar text-base sm:text-lg text-[#110D0B] mt-2 font-bold">
            نسعد باستقبالكم ومشاركتكم ليلتنا في قاعة لوفلي
          </p>
        </motion.div>

        {/* Minimal Editorial Location Box */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="w-full bg-white p-6 sm:p-10 rounded-3xl border-2 border-[#D8CCA8] shadow-md"
        >
          {/* Top Subtle Map Banner with Watercolor Wash & Sage Linework */}
          <div className="relative w-full h-44 sm:h-56 rounded-2xl overflow-hidden bg-gradient-to-br from-[#F6F0E8] via-[#FAF7F2] to-[#EFEAE2] border border-[#D8CCA8] flex items-center justify-center mb-8">
            
            {/* Subtle Map Grid Pattern Background */}
            <svg className="w-full h-full opacity-30 absolute inset-0" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="lightMapGrid" width="36" height="36" patternUnits="userSpaceOnUse">
                  <path d="M 36 0 L 0 0 0 36" fill="none" stroke="#7A8A74" strokeWidth="0.75" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#lightMapGrid)" />
            </svg>

            {/* Delicate Watercolor Radial Tint */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.7),transparent_70%)] pointer-events-none" />

            {/* Center Location Pin in Antique Champagne */}
            <div className="relative z-10 flex flex-col items-center">
              <motion.div
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="w-12 h-12 rounded-full bg-white text-[#7A5822] flex items-center justify-center border-2 border-[#7A5822] shadow-sm cursor-pointer"
              >
                <MapPin className="w-6 h-6 text-[#7A5822] stroke-[2]" />
              </motion.div>
              <div className="mt-2.5 px-4 py-1.5 bg-white border-2 border-[#7A5822] rounded-full text-xs font-display-ar font-bold text-[#110D0B] shadow-sm">
                {data.venueName} • سمالوط
              </div>
            </div>
          </div>

          {/* Details & CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10 pt-2">
            <div className="text-center sm:text-right">
              <span className="font-serif-en text-[10.5px] sm:text-[11.5px] tracking-[0.25em] text-[#634718] uppercase block mb-1 font-bold">
                VENUE &amp; ADDRESS
              </span>
              <h3 className="font-display-ar text-xl sm:text-2xl font-bold text-[#110D0B] mb-1">
                {data.venueName}
              </h3>
              <p className="font-body-ar text-xs sm:text-sm text-[#241C16] font-medium">
                {data.venueAddress}
              </p>
            </div>

            {hasValidMapsUrl && (
              <motion.button
                id="btn-open-maps"
                onClick={handleOpenMaps}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-2.5 px-7 py-3 bg-white hover:bg-[#F6EFE5] border-2 border-[#7A5822] text-[#110D0B] rounded-full transition-all duration-300 font-display-ar text-xs sm:text-sm font-bold shadow-xs cursor-pointer shrink-0 focus:outline-hidden"
              >
                <Navigation className="w-4 h-4 text-[#1F331D] stroke-[2]" />
                <span>خرائط Google</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#7A5822] stroke-[2]" />
              </motion.button>
            )}
          </div>

          {/* Valet Parking Note with Clean Line */}
          <div className="mt-8 pt-5 border-t border-[#D8CCA8] flex items-center justify-center gap-2 text-center text-xs text-[#110D0B] font-body-ar font-bold">
            <Car className="w-4 h-4 text-[#7A5822] stroke-[2]" />
            <span>تتوفر خدمة استقبال وصف السيارات (Valet Parking)</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
