import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WeddingData, GuestMessageEntry } from '../types';
import { GuestMessageService } from '../services/guestMessages';
import { Send, CheckCircle2, AlertCircle, Loader2, MessageSquareHeart } from 'lucide-react';
import { AppleCard } from './AppleCard';

interface GuestMessageProps {
  data: WeddingData;
}

export const GuestMessage: React.FC<GuestMessageProps> = ({ data }) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedEntry, setSubmittedEntry] = useState<GuestMessageEntry | null>(null);
  const [messagesList, setMessagesList] = useState<GuestMessageEntry[]>([]);

  useEffect(() => {
    GuestMessageService.getMessages().then((res) => {
      setMessagesList(res);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('برجاء كتابة الاسم الكريم');
      return;
    }
    if (!message.trim()) {
      setErrorMessage('برجاء كتابة رسالتكم الكريمة لأحمد ونور');
      return;
    }

    setLoading(true);
    try {
      const res = await GuestMessageService.submitMessage(name, message);
      if (res.success && res.entry) {
        setSubmittedEntry(res.entry);
        setMessagesList((prev) => [res.entry!, ...prev]);
        setName('');
        setMessage('');
      } else {
        setErrorMessage(res.message || 'حدث خطأ أثناء الإرسال، برجاء المحاولة مرة أخرى');
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
      className="relative py-20 md:py-28 px-4 sm:px-6 bg-[#F4EEE7] text-[#463F3A] overflow-hidden"
    >
      <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12"
        >
          <span className="font-serif-en italic text-xs tracking-[0.35em] uppercase text-[#A6988B] block mb-1 font-light">
            Wishes &amp; Guestbook
          </span>
          <h2 className="font-display-ar text-2xl sm:text-4xl font-extralight text-[#463F3A]">
            تهانيكم وكلماتكم الطيبة
          </h2>
          <p className="font-calligraphy-ar text-sm sm:text-base text-[#62695D] mt-1.5 font-normal">
            شاركونا أمنياتكم ودعواتكم الصادقة للعروسين
          </p>
        </motion.div>

        {/* Form Container Card with Apple-Style 3D Tilt & Specular Hover */}
        <AppleCard
          id="guest-message-card"
          delay={0.1}
          className="w-full max-w-lg bg-[#FAF7F2] p-6 sm:p-8 border border-[#C9AF87]/25 overflow-hidden"
        >
          
          <AnimatePresence mode="wait">
            {!submittedEntry ? (
              <motion.form
                key="form"
                id="guest-message-form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col gap-4 relative z-10"
              >
                {/* Field 1: Name */}
                <div className="flex flex-col gap-1 text-right">
                  <label
                    htmlFor="guest-name-input"
                    className="font-display-ar text-xs font-light text-[#62695D]"
                  >
                    الاسم الكريم
                  </label>
                  <input
                    id="guest-name-input"
                    type="text"
                    placeholder="مثال: د. محمد وعائلته"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={50}
                    disabled={loading}
                    className="w-full px-4 py-3 rounded-2xl border border-[#C9AF87]/30 bg-[#F4EEE7]/80 text-[#463F3A] font-body-ar text-xs sm:text-sm font-light focus:outline-hidden focus:border-[#C9AF87] focus:ring-1 focus:ring-[#C9AF87] transition-all duration-300"
                  />
                </div>

                {/* Field 2: Message */}
                <div className="flex flex-col gap-1 text-right">
                  <label
                    htmlFor="guest-message-input"
                    className="font-display-ar text-xs font-light text-[#62695D]"
                  >
                    رسالتكم وتهنئتكم
                  </label>
                  <textarea
                    id="guest-message-input"
                    rows={4}
                    placeholder="ألف مبروك لأحمد ونور، مبارك زفافكما وبالرفاء والبنين..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={500}
                    disabled={loading}
                    className="w-full px-4 py-3 rounded-2xl border border-[#C9AF87]/30 bg-[#F4EEE7]/80 text-[#463F3A] font-body-ar text-xs sm:text-sm font-light focus:outline-hidden focus:border-[#C9AF87] focus:ring-1 focus:ring-[#C9AF87] transition-all duration-300 resize-none"
                  />
                  <div className="flex justify-start text-[11px] text-[#A6988B] font-extralight">
                    <span>{500 - message.length} حرف متبقي</span>
                  </div>
                </div>

                {/* Error Message */}
                {errorMessage && (
                  <div className="flex items-center gap-2 p-2.5 bg-red-50/70 border border-red-200 rounded-xl text-red-700 text-xs font-body-ar font-light">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Submit Button */}
                <motion.button
                  id="btn-submit-guest-message"
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 py-3 px-5 bg-[#FAF7F2] hover:border-[#C9AF87] border border-[#C9AF87]/40 text-[#463F3A] font-display-ar text-xs sm:text-sm font-light rounded-2xl shadow-xs transition-all duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group focus:outline-hidden"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#62695D]" />
                      <span>جاري إرسال التهنئة...</span>
                    </>
                  ) : (
                    <>
                      <span>إرسال التهنئة</span>
                      <Send className="w-3.5 h-3.5 text-[#62695D] group-hover:-translate-x-1 transition-transform stroke-[1.2]" />
                    </>
                  )}
                </motion.button>
              </motion.form>
            ) : (
              /* Success State */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45 }}
                className="flex flex-col items-center text-center py-3 relative z-10"
              >
                <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#C9AF87]/40 flex items-center justify-center mb-3 text-[#62695D]">
                  <CheckCircle2 className="w-6 h-6 stroke-[1.2]" />
                </div>

                <h3 className="font-display-ar text-xl font-light text-[#463F3A] mb-1">
                  وصلت رسالتكم الكريمة
                </h3>
                <p className="font-calligraphy-ar text-sm text-[#62695D] max-w-xs leading-relaxed mb-4 font-normal">
                  شكراً لمشاعركم ودعواتكم الطيبة التي أسعدت قلوبنا.
                </p>

                <div className="w-full p-3.5 bg-[#F4EEE7] rounded-2xl border border-[#C9AF87]/20 text-right mb-4">
                  <span className="font-display-ar text-xs text-[#62695D] block mb-0.5 font-light">
                    {submittedEntry.name}
                  </span>
                  <p className="font-body-ar text-xs text-[#463F3A] font-extralight italic">
                    "{submittedEntry.message}"
                  </p>
                </div>

                <button
                  id="btn-write-another-message"
                  onClick={() => setSubmittedEntry(null)}
                  className="font-display-ar text-xs text-[#62695D] hover:text-[#463F3A] transition-colors underline cursor-pointer font-light"
                >
                  كتابة تهنئة أخرى
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </AppleCard>

        {/* Marquee Display of Guest Messages with interactive hover pause & card lift */}
        {messagesList.length > 0 && (
          <div className="w-full mt-10">
            <div className="text-center mb-3 flex items-center justify-center gap-1.5 text-[#A6988B]">
              <MessageSquareHeart className="w-3.5 h-3.5 stroke-[1.2]" />
              <span className="font-serif-en italic text-xs tracking-widest uppercase font-light">
                Warm Guest Messages
              </span>
            </div>

            <div
              tabIndex={0}
              className="relative w-full overflow-hidden py-2.5 border-y border-[#C9AF87]/15 group focus:outline-hidden"
              aria-label="رسائل الضيوف"
            >
              <div className="flex w-max gap-3 sm:gap-4 animate-[marquee_35s_linear_infinite] group-hover:[animation-play-state:paused]">
                {[...messagesList, ...messagesList].map((msg, idx) => (
                  <div
                    key={`${msg.id}-${idx}`}
                    className="flex flex-col justify-between p-3.5 bg-[#FAF7F2] border border-[#C9AF87]/25 rounded-2xl w-60 sm:w-68 shadow-xs shrink-0 select-none text-right transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-[#C9AF87]/45"
                  >
                    <p className="font-body-ar text-xs text-[#463F3A] leading-relaxed line-clamp-3 mb-2 font-extralight">
                      "{msg.message}"
                    </p>
                    <div className="flex items-center justify-between pt-1.5 border-t border-[#F4EEE7]">
                      <span className="font-display-ar text-[11px] text-[#62695D] font-light">
                        {msg.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

