import React from 'react';
import { motion } from 'motion/react';
import { WeddingData } from '../types';
import { MapPin, Navigation, ExternalLink, Car } from 'lucide-react';
import { AppleCard } from './AppleCard';

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
      className="relative bg-[#F4EFEA] text-[#3D3835] py-20 md:py-28 px-4 sm:px-6 overflow-hidden"
    >
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12"
        >
          <span className="font-serif-en italic text-xs tracking-[0.35em] uppercase text-[#9D9287] block mb-1 font-light">
            The Venue
          </span>
          <h2 className="font-display-ar text-2xl sm:text-4xl font-extralight text-[#3D3835]">
            موقع الحفل والوصول
          </h2>
          <p className="font-calligraphy-ar text-sm sm:text-base text-[#5E695A] mt-1.5 font-normal">
            نسعد باستقبالكم في قاعة لوفلي
          </p>
        </motion.div>

        {/* Center Location Card with Apple-Style 3D Tilt & Specular Hover */}
        <AppleCard
          id="location-center-card"
          delay={0.1}
          className="w-full bg-[#FAF7F2] p-6 sm:p-8 border border-[#C9AF87]/25 overflow-hidden"
        >
          {/* Top Map Graphic Banner with Muted Sage & Ivory Palette */}
          <div className="relative w-full h-48 sm:h-60 rounded-2xl overflow-hidden bg-gradient-to-br from-[#EFE8DC]/40 via-[#DDE5DC]/30 to-[#FAF7F2] border border-[#9DAE99]/30 flex items-center justify-center mb-6">
            
            {/* Map Grid Pattern Background */}
            <svg className="w-full h-full opacity-25 absolute inset-0" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="lightMapGrid" width="36" height="36" patternUnits="userSpaceOnUse">
                  <path d="M 36 0 L 0 0 0 36" fill="none" stroke="#7E8C7A" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#lightMapGrid)" />
            </svg>

            {/* Center Pin with Sage & Pale Champagne Glow */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.12, rotate: 4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  className="w-11 h-11 rounded-full bg-[#FAF7F2] text-[#5E695A] flex items-center justify-center shadow-xs border border-[#9DAE99]/50 cursor-pointer"
                >
                  <MapPin className="w-5 h-5 text-[#5E695A] stroke-[1.2]" />
                </motion.div>
              </div>
              <div className="mt-2.5 px-3.5 py-1 bg-[#FAF7F2]/90 backdrop-blur-xs border border-[#9DAE99]/40 rounded-full text-xs font-display-ar font-extralight text-[#3D3835] shadow-xs">
                {data.venueName}
              </div>
            </div>
          </div>

          {/* Details & CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 relative z-10">
            <div className="text-center sm:text-right">
              <span className="font-serif-en text-[11px] tracking-widest text-[#9D9287] uppercase block mb-0.5 font-light">
                Venue
              </span>
              <h3 className="font-display-ar text-xl font-light text-[#3D3835] mb-0.5">
                {data.venueName}
              </h3>
              <p className="font-body-ar text-xs sm:text-sm text-[#5E695A] font-light">
                {data.venueAddress}
              </p>
            </div>

            {hasValidMapsUrl && (
              <motion.button
                id="btn-open-maps"
                onClick={handleOpenMaps}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#FAF7F2] hover:border-[#7E8C7A] border border-[#9DAE99]/45 text-[#3D3835] rounded-full transition-all duration-300 font-display-ar text-xs sm:text-sm font-light shadow-xs cursor-pointer focus:outline-hidden shrink-0"
              >
                <Navigation className="w-3.5 h-3.5 text-[#5E695A]" />
                <span>خرائط Google</span>
                <ExternalLink className="w-3 h-3 text-[#9D9287]" />
              </motion.button>
            )}
          </div>

          {/* Valet Parking Note */}
          <div className="mt-6 pt-5 border-t border-[#BDB1A5]/25 flex items-center justify-center gap-2 text-center text-xs text-[#5E695A] font-body-ar font-light relative z-10">
            <Car className="w-3.5 h-3.5 text-[#9D9287] stroke-[1.2]" />
            <span>تتوفر خدمة استقبال وصف السيارات (Valet Parking)</span>
          </div>
        </AppleCard>

      </div>
    </section>
  );
};

