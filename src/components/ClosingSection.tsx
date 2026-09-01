import React, { useState } from 'react';
import { motion } from 'motion/react';
import { WeddingData } from '../types';
import { downloadIcsCalendar } from '../utils/calendar';
import { Calendar, MapPin, Share2, Check, Heart } from 'lucide-react';
import { RefinedSatinBow } from './RefinedSatinBow';

interface ClosingSectionProps {
  data: WeddingData;
}

export const ClosingSection: React.FC<ClosingSectionProps> = ({ data }) => {
  const [copiedToast, setCopiedToast] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: `دعوة زفاف ${data.groomArabic} و${data.brideArabic}`,
      text: `يسعدنا حضوركم ومشاركتنا فرحة ليلتنا في 08.09.2026`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user cancelled or share failed
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedToast(true);
        setTimeout(() => setCopiedToast(false), 3000);
      } catch {
        // ignore
      }
    }
  };

  const handleOpenMaps = () => {
    if (data.mapsUrl && !data.mapsUrl.includes('[GOOGLE_MAPS_URL]')) {
      window.open(data.mapsUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section
      id="closing"
      className="relative bg-[#F4EFEA] text-[#3D3835] py-20 md:py-28 px-4 sm:px-6 overflow-hidden"
    >
      {/* Decorative Frame with Subtle Sage Tint */}
      <div className="absolute inset-4 sm:inset-10 border border-[#9DAE99]/25 rounded-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center flex flex-col items-center">
        
        {/* Delicate Satin Bow Embellishment at Monogram Top */}
        <div className="mb-2">
          <RefinedSatinBow size="sm" />
        </div>

        {/* Monogram Seal */}
        <div className="w-9 h-9 rounded-full border border-[#9DAE99]/40 flex items-center justify-center mb-5 bg-[#FAF7F2] shadow-xs">
          <Heart className="w-3.5 h-3.5 text-[#5E695A] fill-[#DDE5DC]/50" />
        </div>

        {/* Closing Photo in Slender Arched Cameo with Apple-grade 3D hover lift */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          whileInView={{ scale: 1, opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.03, y: -3, rotateZ: 0.5 }}
          className="relative w-40 h-52 sm:w-48 sm:h-64 rounded-t-full rounded-b-2xl overflow-hidden shadow-xs border border-[#9DAE99]/35 bg-[#FAF7F2] p-1 mb-6 cursor-pointer transition-shadow hover:shadow-xl hover:shadow-[#7E8C7A]/10 group"
        >
          <div className="w-full h-full rounded-t-full rounded-b-xl overflow-hidden relative">
            <img
              src={data.closingImage}
              alt={`زفاف ${data.groomArabic} و ${data.brideArabic}`}
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#3D3835]/25 to-transparent pointer-events-none" />
          </div>
        </motion.div>

        {/* Emotional Closing Copy */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-calligraphy-ar text-base sm:text-xl text-[#5E695A] mb-1 leading-relaxed font-normal"
        >
          حضوركم يُبهج قلوبنا ويزيد فرحتنا اكتمالاً
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="font-display-ar text-2xl sm:text-4xl font-extralight text-[#3D3835] mb-3"
        >
          في انتظاركم بكل المحبة
        </motion.h2>

        {/* Names */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-3 my-1"
        >
          <span className="font-display-ar text-xl sm:text-3xl font-extralight text-[#3D3835]">
            {data.groomArabic}
          </span>
          <span className="font-serif-en italic text-lg sm:text-2xl text-[#C9AF87] font-light">
            &amp;
          </span>
          <span className="font-display-ar text-xl sm:text-3xl font-extralight text-[#3D3835]">
            {data.brideArabic}
          </span>
        </motion.div>

        {/* Date Stamp */}
        <div className="font-serif-en text-xs tracking-[0.35em] text-[#9D9287] uppercase mt-2 mb-6 font-light">
          08 . 09 . 2026 • LOVELY HALL
        </div>

        {/* Action Buttons with Apple-style micro-interactions */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-1 mb-8">
          {/* Action 1: Add to Calendar */}
          <motion.button
            id="btn-closing-calendar"
            onClick={() => downloadIcsCalendar(data)}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FAF7F2] hover:border-[#7E8C7A] border border-[#9DAE99]/40 text-[#3D3835] text-xs sm:text-sm font-display-ar font-light transition-all duration-300 shadow-xs cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-[#5E695A] stroke-[1.2]" />
            <span>حفظ الموعد</span>
          </motion.button>

          {/* Action 2: Open Location */}
          <motion.button
            id="btn-closing-location"
            onClick={handleOpenMaps}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FAF7F2] hover:border-[#7E8C7A] border border-[#9DAE99]/40 text-[#3D3835] text-xs sm:text-sm font-display-ar font-light transition-all duration-300 shadow-xs cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-[#5E695A] stroke-[1.2]" />
            <span>موقع القاعة</span>
          </motion.button>

          {/* Action 3: Share Invitation */}
          <motion.button
            id="btn-closing-share"
            onClick={handleShare}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#FAF7F2] hover:border-[#7E8C7A] border border-[#9DAE99]/45 text-[#3D3835] text-xs sm:text-sm font-display-ar font-light transition-all duration-300 cursor-pointer shadow-xs"
          >
            {copiedToast ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#5E695A] stroke-[1.2]" />
                <span>تم نسخ الرابط!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-[#5E695A] stroke-[1.2]" />
                <span>مشاركة الدعوة</span>
              </>
            )}
          </motion.button>
        </div>

        {/* Divider */}
        <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#7E8C7A]/50 to-transparent my-3" />
        
        <p className="font-calligraphy-ar text-xs text-[#5E695A] font-normal">
          دعوة زفاف خاصة • دامت دياركم عامرة بالأفراح والمسرات
        </p>
      </div>
    </section>
  );
};

