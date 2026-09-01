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
      className="relative py-24 sm:py-32 md:py-40 px-6 sm:px-10 md:px-16 bg-[#FAF7F2] text-[#231C18] overflow-hidden select-none border-b border-[#E8DFC2]/60"
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
            <div className="w-8 sm:w-12 h-[1px] bg-[#8C6D3B]/40" />
            <span className="font-serif-en text-[10px] sm:text-[11px] md:text-xs tracking-[0.4em] uppercase text-[#8C6D3B] font-medium">
              WISHES &amp; TIME CAPSULE
            </span>
            <div className="w-8 sm:w-12 h-[1px] bg-[#8C6D3B]/40" />
          </div>

          <h2 className="font-display-ar text-2xl sm:text-3xl md:text-[34px] font-normal text-[#1E1815] leading-[1.35] tracking-wide mb-3">
            كلمة منكم… وذكرى لينا
          </h2>

          <p className="font-display-ar text-sm sm:text-base text-[#4A3E36] font-light leading-relaxed max-w-md">
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
            <div className="flex items-center justify-center gap-8 sm:gap-14 border-b border-[#E8DFC2]/80 pb-3.5 w-full max-w-md">
              <button
                type="button"
                onClick={() => {
                  soundEffects.playSoftTap();
                  setCapsuleType('today');
                }}
                className={`relative pb-1.5 transition-all duration-300 cursor-pointer flex flex-col items-center ${
                  capsuleType === 'today'
                    ? 'text-[#1E1815] font-medium'
                    : 'text-[#6E5F53] opacity-60 hover:opacity-90 font-light'
                }`}
              >
                <span className="font-display-ar text-sm sm:text-[15px]">
                  تهنئة لليلة الزفاف
                </span>
                <span className="font-serif-en text-[10px] text-[#8C6D3B] tracking-wider uppercase font-medium mt-0.5">
                  TONIGHT
                </span>
                {capsuleType === 'today' && (
                  <motion.div
                    layoutId="activeWishesTab"
                    className="absolute -bottom-[15px] left-0 right-0 h-[2px] bg-[#8C6D3B]"
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
                    ? 'text-[#1E1815] font-medium'
                    : 'text-[#6E5F53] opacity-60 hover:opacity-90 font-light'
                }`}
              >
                <span className="font-display-ar text-sm sm:text-[15px]">
                  رسالة لأول ذكرى
                </span>
                <span className="font-serif-en text-[10px] text-[#8C6D3B] tracking-wider uppercase font-medium mt-0.5">
                  YEAR 2027
                </span>
                {capsuleType === 'anniversary' && (
                  <motion.div
                    layoutId="activeWishesTab"
                    className="absolute -bottom-[15px] left-0 right-0 h-[2px] bg-[#8C6D3B]"
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
                  <p className="font-display-ar text-xs text-[#52634D] font-normal leading-relaxed italic">
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
                    className="font-display-ar text-xs text-[#8C6D3B] font-medium tracking-wide"
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
                    className="w-full py-3 px-1 bg-transparent border-b border-[#D8CCBA] focus:border-[#8C6D3B] text-[#1E1815] font-display-ar text-base sm:text-lg font-light placeholder:text-[#A6988B] placeholder:font-extralight focus:outline-hidden transition-colors duration-400"
                  />
                </div>

                {/* Field 2: Message */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="guest-input-message"
                    className="font-display-ar text-xs text-[#8C6D3B] font-medium tracking-wide"
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
                    className="w-full py-3 px-1 bg-transparent border-b border-[#D8CCBA] focus:border-[#8C6D3B] text-[#1E1815] font-display-ar text-base sm:text-lg font-light placeholder:text-[#A6988B] placeholder:font-extralight focus:outline-hidden resize-none leading-relaxed transition-colors duration-400"
                  />
                  <div className="flex justify-start text-[11px] text-[#A6988B] font-light pt-1">
                    <span>{500 - message.length} حرف متبقي</span>
                  </div>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="flex items-center gap-2 p-3 bg-[#FAF7F2] border border-red-200 rounded-xl text-red-800 text-xs font-display-ar font-light">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
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
                    className="inline-flex items-center justify-center gap-2 px-12 py-3.5 bg-[#FAF7F2] hover:bg-[#F6EFE5] border border-[#8C6D3B]/80 hover:border-[#8C6D3B] text-[#1E1815] font-display-ar text-sm font-normal tracking-wider rounded-full shadow-[0_2px_12px_rgba(140,109,59,0.12)] hover:shadow-[0_4px_18px_rgba(140,109,59,0.22)] transition-all duration-400 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-hidden"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#52634D]" />
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
                <div className="w-10 h-10 rounded-full bg-[#52634D]/10 flex items-center justify-center mb-4 text-[#52634D]">
                  <Check className="w-5 h-5 stroke-[2]" />
                </div>
                <p className="font-display-ar text-lg sm:text-xl text-[#1E1815] font-normal leading-relaxed mb-2">
                  وصلت رسالتكم بكل حب، ومستنيانا في وقتها.
                </p>
                <p className="font-display-ar text-xs sm:text-sm text-[#6E5F53] font-light mb-6">
                  شكراً لمشاركتنا فرحتنا وكلماتكم الطيبة
                </p>

                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playSoftTap();
                    setIsSuccess(false);
                  }}
                  className="font-display-ar text-xs sm:text-sm text-[#52634D] hover:text-[#1E1815] transition-colors border-b border-[#52634D]/40 pb-0.5 cursor-pointer font-light"
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
            className="w-full mt-20 sm:mt-24 pt-12 border-t border-[#E8DFC2]/60 flex flex-col items-center"
          >
            <div className="flex items-center gap-3 mb-8 justify-center">
              <div className="w-6 sm:w-10 h-[1px] bg-[#8C6D3B]/30" />
              <span className="font-serif-en text-[10px] sm:text-[11px] tracking-[0.35em] uppercase text-[#8C6D3B] font-medium">
                GUEST WORDS &amp; MEMORIES
              </span>
              <div className="w-6 sm:w-10 h-[1px] bg-[#8C6D3B]/30" />
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
                {[...publicMessages, ...publicMessages, ...publicMessages].map((msg, idx) => (
                  <div
                    key={`${msg.id}-${idx}`}
                    className="flex flex-col justify-between py-1 pr-5 pl-2 bg-transparent relative w-72 sm:w-80 shrink-0 text-right border-r border-[#8C6D3B]/25"
                  >
                    <div>
                      {msg.capsuleType === 'anniversary' && (
                        <span className="font-serif-en text-[9px] text-[#8C6D3B] tracking-widest uppercase block mb-1.5 font-medium">
                          1st Anniversary Capsule
                        </span>
                      )}
                      <p className="font-display-ar text-xs sm:text-[13px] text-[#231C18] leading-relaxed font-light italic line-clamp-3">
                        «{msg.message}»
                      </p>
                    </div>

                    {msg.name && (
                      <div className="flex items-center gap-2 mt-3.5">
                        <div className="w-3.5 h-[1px] bg-[#52634D]/40" />
                        <span className="font-display-ar text-xs text-[#52634D] font-normal">
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
