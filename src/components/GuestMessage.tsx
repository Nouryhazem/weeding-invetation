import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WeddingData, GuestMessageEntry } from '../types';
import { GuestMessageService } from '../services/guestMessages';
import { Loader2, Check, AlertCircle } from 'lucide-react';
import { soundEffects } from '../utils/soundEffects';

interface GuestMessageProps {
  data: WeddingData;
}

export const GuestMessage: React.FC<GuestMessageProps> = ({ data: _data }) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [capsuleType, setCapsuleType] = useState<'today' | 'anniversary'>('today');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Public approved messages
  const [publicMessages, setPublicMessages] = useState<GuestMessageEntry[]>([]);

  const refreshPublicMessages = useCallback(() => {
    GuestMessageService.getApprovedMessages().then((msgs) => {
      setPublicMessages(msgs);
    });
  }, []);

  useEffect(() => {
    refreshPublicMessages();
    const handleUpdate = () => refreshPublicMessages();
    window.addEventListener('wedding-messages-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('wedding-messages-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [refreshPublicMessages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('برجاء كتابة الاسم');
      return;
    }
    if (!message.trim()) {
      setErrorMessage('برجاء كتابة رسالتكم');
      return;
    }

    setLoading(true);
    try {
      const res = await GuestMessageService.submitMessage(name, message, capsuleType);
      if (res.success && res.entry) {
        soundEffects.playSoftChime();
        setIsSuccess(true);
        setName('');
        setMessage('');
        refreshPublicMessages();
      } else {
        setErrorMessage(res.message || 'حدث خطأ أثناء الحفظ، برجاء المحاولة مرة أخرى');
      }
    } catch {
      setErrorMessage('تعذر الاتصال، برجاء المحاولة لاحقاً');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="guestbook"
      className="relative py-24 sm:py-32 md:py-40 px-6 sm:px-10 md:px-16 bg-[#FAF7F2] text-[#110D0B] overflow-hidden select-none border-b border-[#D8CCA8]"
    >
      {/* Ambient Watercolor Washes */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-radial from-[#F5EFE6]/70 via-[#FAF7F2]/20 to-transparent blur-3xl pointer-events-none -translate-y-16" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-radial from-[#EFEAE1]/60 via-[#FAF7F2]/20 to-transparent blur-3xl pointer-events-none translate-y-16" />

      <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
        {/* 1. Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center mb-12 sm:mb-16"
        >
          <div className="flex items-center gap-3 mb-4 justify-center">
            <div className="w-8 sm:w-12 h-[1.5px] bg-[#7A5822]" />
            <span className="font-serif-en text-[11px] sm:text-xs md:text-sm tracking-[0.4em] uppercase text-[#634718] font-bold">
              WISHES &amp; TIME CAPSULE
            </span>
            <div className="w-8 sm:w-12 h-[1.5px] bg-[#7A5822]" />
          </div>

          <h2 className="font-display-ar text-2xl sm:text-3xl md:text-[34px] font-bold text-[#110D0B] leading-[1.35] tracking-wide mb-3">
            كلمة منكم… وذكرى لينا
          </h2>

          <p className="font-display-ar text-sm sm:text-base text-[#241C16] font-medium leading-relaxed max-w-md">
            اكتبولنا كلمة لليلة دي، أو سيبوا رسالة نخبيها ونفتحها في أول ذكرى جواز لينا.
          </p>
        </motion.div>

        {/* 2. Fluid, Non-Boxy Letter Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-lg"
        >
          {/* Organic Switcher (No Box, Pure Typography & Line Indicator) */}
          <div className="flex flex-col items-center mb-12">
            <div className="flex items-center justify-center gap-8 sm:gap-14 border-b-2 border-[#D8CCA8] pb-3.5 w-full max-w-md">
              <button
                type="button"
                onClick={() => {
                  soundEffects.playSoftTap();
                  setCapsuleType('today');
                }}
                className={`relative pb-1.5 transition-all duration-300 cursor-pointer flex flex-col items-center ${
                  capsuleType === 'today'
                    ? 'text-[#110D0B] font-bold'
                    : 'text-[#5C4D3F] hover:text-[#110D0B] font-medium'
                }`}
              >
                <span className="font-display-ar text-sm sm:text-[15px]">
                  تهنئة لليلة الزفاف
                </span>
                <span className="font-serif-en text-[10.5px] text-[#7A5822] tracking-wider uppercase font-bold mt-0.5">
                  TONIGHT
                </span>
                {capsuleType === 'today' && (
                  <motion.div
                    layoutId="activeWishesTab"
                    className="absolute -bottom-[16px] left-0 right-0 h-[2.5px] bg-[#7A5822]"
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEffects.playSoftTap();
                  setCapsuleType('anniversary');
                }}
                className={`relative pb-1.5 transition-all duration-300 cursor-pointer flex flex-col items-center ${
                  capsuleType === 'anniversary'
                    ? 'text-[#110D0B] font-bold'
                    : 'text-[#5C4D3F] hover:text-[#110D0B] font-medium'
                }`}
              >
                <span className="font-display-ar text-sm sm:text-[15px]">
                  رسالة لأول ذكرى
                </span>
                <span className="font-serif-en text-[10.5px] text-[#7A5822] tracking-wider uppercase font-bold mt-0.5">
                  YEAR 2027
                </span>
                {capsuleType === 'anniversary' && (
                  <motion.div
                    layoutId="activeWishesTab"
                    className="absolute -bottom-[16px] left-0 right-0 h-[2.5px] bg-[#7A5822]"
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
              </button>
            </div>

            {/* Poetic Capsule Reminder */}
            <AnimatePresence mode="wait">
              {capsuleType === 'anniversary' && (
                <motion.div
                  key="capsule-subtext"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.45 }}
                  className="mt-4 text-center max-w-sm"
                >
                  <p className="font-display-ar text-xs sm:text-sm text-[#1F331D] font-bold leading-relaxed italic">
                    «الرسالة دي هنحتفظ بيها مقفولة، ونرجعلها سوا يوم 8 سبتمبر 2027… في أول ذكرى جواز لينا»
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Form */}
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.form
                key="message-form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col gap-9 text-right"
              >
                {/* Field 1: Name */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="guest-input-name"
                    className="font-display-ar text-xs sm:text-sm text-[#634718] font-bold tracking-wide"
                  >
                    اسمكم الكريم
                  </label>
                  <input
                    id="guest-input-name"
                    type="text"
                    placeholder="اكتبوا اسمكم هنا"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={50}
                    disabled={loading}
                    className="w-full py-3 px-1 bg-transparent border-b-2 border-[#D8CCA8] focus:border-[#7A5822] text-[#110D0B] font-display-ar text-base sm:text-lg font-medium placeholder:text-[#695D51] focus:outline-hidden transition-colors duration-300"
                  />
                </div>

                {/* Field 2: Message */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="guest-input-message"
                    className="font-display-ar text-xs sm:text-sm text-[#634718] font-bold tracking-wide"
                  >
                    رسالتكم
                  </label>
                  <textarea
                    id="guest-input-message"
                    rows={4}
                    placeholder="اكتبولنا دعوة حلوة أو كلمة تفتكرونا بيها…"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={500}
                    disabled={loading}
                    className="w-full py-3 px-1 bg-transparent border-b-2 border-[#D8CCA8] focus:border-[#7A5822] text-[#110D0B] font-display-ar text-base sm:text-lg font-medium placeholder:text-[#695D51] focus:outline-hidden resize-none leading-relaxed transition-colors duration-300"
                  />
                  <div className="flex justify-start text-xs text-[#5C4D3F] font-bold pt-1">
                    <span>{500 - message.length} حرف متبقي</span>
                  </div>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-300 rounded-xl text-red-900 text-xs font-display-ar font-bold">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-700" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-center pt-2">
                  <motion.button
                    id="btn-save-message"
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-flex items-center justify-center gap-2 px-14 py-3.5 bg-white hover:bg-[#F6EFE5] border-2 border-[#7A5822] text-[#110D0B] font-display-ar text-sm font-bold tracking-wider rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-hidden"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#1F331D]" />
                        <span>جاري الحفظ...</span>
                      </>
                    ) : (
                      <span>احفظوا الرسالة</span>
                    )}
                  </motion.button>
                </div>
              </motion.form>
            ) : (
              /* Success State */
              <motion.div
                key="success-state"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center text-center py-8"
              >
                <div className="w-12 h-12 rounded-full bg-green-100 border border-green-300 flex items-center justify-center mb-4 text-[#1F331D]">
                  <Check className="w-6 h-6 stroke-[2.5]" />
                </div>
                <p className="font-display-ar text-lg sm:text-xl text-[#110D0B] font-bold leading-relaxed mb-2">
                  وصلت رسالتكم بكل حب، ومستنيانا في وقتها.
                </p>
                <p className="font-display-ar text-xs sm:text-sm text-[#241C16] font-medium mb-6">
                  شكراً لمشاركتنا فرحتنا وكلماتكم الطيبة
                </p>

                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playSoftTap();
                    setIsSuccess(false);
                  }}
                  className="font-display-ar text-xs sm:text-sm text-[#1F331D] hover:text-black font-bold transition-colors border-b-2 border-[#1F331D] pb-0.5 cursor-pointer"
                >
                  كتابة رسالة أخرى
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* 3. Non-Boxy Floating Wishes Moving Slider (Marquee) */}
        {publicMessages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="w-full mt-20 sm:mt-24 pt-12 border-t-2 border-[#D8CCA8] flex flex-col items-center"
          >
            <div className="flex items-center gap-3 mb-8 justify-center">
              <div className="w-6 sm:w-10 h-[1.5px] bg-[#7A5822]" />
              <span className="font-serif-en text-[10.5px] sm:text-[12px] tracking-[0.35em] uppercase text-[#634718] font-bold">
                GUEST WORDS &amp; MEMORIES
              </span>
              <div className="w-6 sm:w-10 h-[1.5px] bg-[#7A5822]" />
            </div>

            {/* Seamless, Non-Boxy Continuous Marquee Slider */}
            <div
              tabIndex={0}
              className="relative w-full overflow-hidden py-4 select-none group focus:outline-hidden"
              aria-label="رسائل وكلمات الضيوف"
            >
              {/* Fade Edges */}
              <div className="absolute top-0 bottom-0 left-0 w-12 sm:w-20 bg-gradient-to-r from-[#FAF7F2] to-transparent z-10 pointer-events-none" />
              <div className="absolute top-0 bottom-0 right-0 w-12 sm:w-20 bg-gradient-to-l from-[#FAF7F2] to-transparent z-10 pointer-events-none" />

              <div className="flex w-max gap-10 sm:gap-14 animate-marquee-flow">
                {(publicMessages.length < 6
                  ? Array.from({ length: Math.ceil(8 / Math.max(publicMessages.length, 1)) }, () => publicMessages).flat()
                  : [...publicMessages, ...publicMessages]
                ).map((msg, idx) => (
                  <div
                    key={`${msg.id}-${idx}`}
                    className="flex flex-col justify-between py-1 pr-5 pl-2 bg-transparent relative w-72 sm:w-80 shrink-0 text-right border-r-2 border-[#7A5822]"
                  >
                    <div>
                      {msg.capsuleType === 'anniversary' && (
                        <span className="font-serif-en text-[10px] text-[#7A5822] tracking-widest uppercase block mb-1.5 font-bold">
                          1st Anniversary Capsule
                        </span>
                      )}
                      <p className="font-display-ar text-xs sm:text-[13.5px] text-[#110D0B] leading-relaxed font-bold italic line-clamp-3">
                        «{msg.message}»
                      </p>
                    </div>

                    {msg.name && (
                      <div className="flex items-center gap-2 mt-3.5">
                        <div className="w-4 h-[1.5px] bg-[#1F331D]" />
                        <span className="font-display-ar text-xs sm:text-sm text-[#1F331D] font-bold">
                          {msg.name}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};
