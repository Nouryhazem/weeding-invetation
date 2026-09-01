import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WeddingData, GuestMessageEntry } from '../types';
import { GuestMessageService } from '../services/guestMessages';
import {
  Lock,
  X,
  Clock,
  Sparkles,
  Hourglass,
  Check,
  Trash2,
  EyeOff,
  ShieldCheck,
  ArrowUpRight
} from 'lucide-react';
import { soundEffects } from '../utils/soundEffects';

interface FooterProps {
  data: WeddingData;
}

const ADMIN_PIN = 'Nour&Ahmed#2026';

export const Footer: React.FC<FooterProps> = ({ data }) => {
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [allAdminMessages, setAllAdminMessages] = useState<GuestMessageEntry[]>([]);
  const [adminTab, setAdminTab] = useState<'pending' | 'approved' | 'capsule'>('pending');

  const refreshAdminMessages = () => {
    GuestMessageService.getAllMessages().then((msgs) => {
      setAllAdminMessages(msgs);
    });
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showAdminModal) {
        setShowAdminModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAdminModal]);

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === ADMIN_PIN) {
      setIsAdminAuthenticated(true);
      setPinError(false);
      setPinInput('');
      refreshAdminMessages();
    } else {
      setPinError(true);
    }
  };

  const handleApprove = async (id: string) => {
    soundEffects.playSoftTap();
    await GuestMessageService.approveMessage(id);
    refreshAdminMessages();
  };

  const handleHide = async (id: string) => {
    soundEffects.playSoftTap();
    await GuestMessageService.hideMessage(id);
    refreshAdminMessages();
  };

  const handleDelete = async (id: string) => {
    soundEffects.playSoftTap();
    await GuestMessageService.deleteMessage(id);
    refreshAdminMessages();
  };

  const pendingMessages = allAdminMessages.filter((m) => !m.approved);
  const approvedMessages = allAdminMessages.filter((m) => m.approved);
  const capsuleMessages = allAdminMessages.filter((m) => m.capsuleType === 'anniversary');

  return (
    <motion.footer
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-30 bg-[#FAF7F2] text-[#110D0B] py-2.5 sm:py-3 px-4 sm:px-8 select-none border-t border-[#D8CCA8] shadow-[0_-2px_12px_rgba(0,0,0,0.06)]"
    >
      <div className="max-w-6xl mx-auto flex flex-row items-center justify-between gap-3 text-xs">
        {/* 1. Left Side: Creator Credits with Instagram Link & Best Wishes */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <motion.a
            href="https://www.instagram.com/nouryhazem/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group inline-flex items-center gap-1 font-serif-en text-[10.5px] sm:text-[11.5px] tracking-[0.2em] uppercase font-bold text-[#110D0B] hover:text-[#7A5822] transition-all duration-300"
            title="Designed & Developed by Noury Hazem"
          >
            <span className="text-[#6E4F1E] font-semibold">A WEBSITE BY</span>
            <span className="border-b-2 border-[#7A5822]/40 group-hover:border-[#7A5822] transition-colors text-[#110D0B]">NOURY HAZEM</span>
            <ArrowUpRight className="w-3 h-3 text-[#7A5822] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 stroke-[2.2]" />
          </motion.a>

          <span className="hidden xs:inline-block text-[#7A5822]/60 font-bold">•</span>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="hidden xs:inline-flex items-center gap-1.5"
          >
            <span className="font-serif-en text-[10px] sm:text-[10.5px] tracking-[0.25em] uppercase text-[#1F331D] font-bold">
              BEST WISHES
            </span>
          </motion.div>
        </div>

        {/* 2. Center: Names & Date Indicator (Desktop / Tablet) */}
        <motion.div
          whileHover={{ y: -1 }}
          transition={{ duration: 0.2 }}
          className="hidden md:flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 border border-[#D8CCA8] text-[11px] font-serif-en tracking-wider text-[#110D0B] shadow-2xs"
        >
          <span className="text-[#110D0B] font-bold font-display-ar text-[11.5px]">
            {data.groomArabic} &amp; {data.brideArabic}
          </span>
          <span className="text-[#7A5822] font-bold">• 08.09.2026</span>
        </motion.div>

        {/* 3. Right Side: Admin Vault Lock */}
        <div className="shrink-0 flex items-center">
          <motion.button
            id="btn-footer-admin-wishes"
            onClick={() => {
              soundEffects.playSoftTap();
              setShowAdminModal(true);
              if (isAdminAuthenticated) refreshAdminMessages();
            }}
            whileHover={{ scale: 1.04, y: -0.5 }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border-2 border-[#7A5822] bg-white hover:bg-[#F6EFE5] text-[#110D0B] text-[10.5px] sm:text-[11.5px] font-serif-en tracking-wider uppercase font-bold transition-all duration-300 shadow-xs focus:outline-hidden cursor-pointer"
            title="Admin Moderation & Time Capsule"
          >
            <Lock className="w-3 h-3 text-[#7A5822] stroke-[2]" />
            <span className="font-bold text-[10px] sm:text-[10.5px] text-[#110D0B]">VAULT</span>
          </motion.button>
        </div>
      </div>

      {/* Admin Moderation Modal - Fully Scrollable and Accessible */}
      <AnimatePresence>
        {showAdminModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto overscroll-contain"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg bg-[#FAF7F2] border-2 border-[#D8CCA8] rounded-2xl p-5 sm:p-7 max-h-[90vh] my-auto flex flex-col text-right shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-[#D8CCA8] mb-3 shrink-0">
                <button
                  onClick={() => setShowAdminModal(false)}
                  className="p-1.5 rounded-full bg-white border border-[#D8CCA8] text-[#110D0B] hover:text-red-700 hover:border-red-400 transition-colors cursor-pointer"
                  aria-label="إغلاق"
                >
                  <X className="w-4 h-4 stroke-[2]" />
                </button>
                <div className="flex items-center gap-2 text-[#110D0B]">
                  <ShieldCheck className="w-5 h-5 text-[#7A5822] stroke-[2]" />
                  <h3 className="font-display-ar text-base sm:text-lg font-bold text-[#110D0B]">
                    مراجعة رسائل الضيوف وكبسولة الزمن
                  </h3>
                </div>
              </div>

              {/* Password Gate */}
              {!isAdminAuthenticated ? (
                <div className="overflow-y-auto flex-1 py-4 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-white border-2 border-[#7A5822] flex items-center justify-center mb-3 text-[#7A5822]">
                    <Lock className="w-6 h-6 stroke-[2]" />
                  </div>
                  <h4 className="font-display-ar text-base font-bold text-[#110D0B] mb-1">
                    كلمة المرور للعروسين
                  </h4>
                  <p className="font-display-ar text-xs sm:text-sm text-[#241C16] font-medium mb-5 max-w-xs">
                    أدخل كلمة المرور لإدارة الرسائل والاطلاع على كبسولة الزمن
                  </p>

                  <form onSubmit={handleVerifyPin} className="w-full flex flex-col items-center">
                    <input
                      type="password"
                      placeholder="كلمة المرور"
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value)}
                      className="w-64 px-4 py-2.5 text-center text-sm font-medium tracking-wide border-2 border-[#7A5822] rounded-xl bg-white text-[#110D0B] placeholder:text-[#695D51] focus:outline-hidden focus:ring-2 focus:ring-[#7A5822] mb-3"
                    />

                    {pinError && (
                      <span className="text-xs text-red-700 font-display-ar font-bold mb-3">
                        كلمة المرور غير صحيحة
                      </span>
                    )}

                    <button
                      type="submit"
                      className="px-10 py-2.5 rounded-full bg-[#7A5822] hover:bg-[#634718] text-white text-sm font-display-ar font-bold transition-all shadow-md cursor-pointer mt-1"
                    >
                      دخول
                    </button>
                  </form>
                </div>
              ) : (
                /* Authenticated Dashboard */
                <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
                  {/* Tabs */}
                  <div className="flex border-b-2 border-[#D8CCA8] mb-3 gap-1 shrink-0">
                    <button
                      onClick={() => setAdminTab('pending')}
                      className={`flex-1 py-2 text-xs sm:text-sm font-display-ar text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                        adminTab === 'pending'
                          ? 'border-[#7A5822] text-[#110D0B] font-bold'
                          : 'border-transparent text-[#5C4D3F] hover:text-[#110D0B] font-medium'
                      }`}
                    >
                      <Clock className="w-4 h-4 text-[#7A5822]" />
                      <span>قيد المراجعة</span>
                      {pendingMessages.length > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#7A5822] text-white font-bold">
                          {pendingMessages.length}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => setAdminTab('approved')}
                      className={`flex-1 py-2 text-xs sm:text-sm font-display-ar text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                        adminTab === 'approved'
                          ? 'border-[#7A5822] text-[#110D0B] font-bold'
                          : 'border-transparent text-[#5C4D3F] hover:text-[#110D0B] font-medium'
                      }`}
                    >
                      <Sparkles className="w-4 h-4 text-[#1F331D]" />
                      <span>المنشورة ({approvedMessages.length})</span>
                    </button>

                    <button
                      onClick={() => setAdminTab('capsule')}
                      className={`flex-1 py-2 text-xs sm:text-sm font-display-ar text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                        adminTab === 'capsule'
                          ? 'border-[#7A5822] text-[#110D0B] font-bold'
                          : 'border-transparent text-[#5C4D3F] hover:text-[#110D0B] font-medium'
                      }`}
                    >
                      <Hourglass className="w-4 h-4 text-[#7A5822]" />
                      <span>الكبسولة ({capsuleMessages.length})</span>
                    </button>
                  </div>

                  {/* Messages List - Scrollable to the very bottom */}
                  <div className="flex-1 min-h-0 overflow-y-auto pr-1 pb-4 space-y-3 overscroll-contain">
                    {adminTab === 'pending' &&
                      (pendingMessages.length === 0 ? (
                        <div className="text-center py-12 text-[#241C16] text-sm font-display-ar font-medium">
                          لا توجد رسائل معلقة حالياً
                        </div>
                      ) : (
                        pendingMessages.map((msg) => (
                          <div
                            key={msg.id}
                            className="p-4 bg-white border-2 border-[#D8CCA8] rounded-xl flex flex-col gap-2.5 shadow-2xs"
                          >
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-[11.5px] text-[#7A5822] font-serif-en font-bold">
                                {new Date(msg.timestamp).toLocaleTimeString('ar-EG', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                              <div className="flex items-center gap-2">
                                {msg.capsuleType === 'anniversary' && (
                                  <span className="text-[10.5px] text-[#7A5822] bg-[#F6EFE5] border border-[#7A5822] px-2 py-0.5 rounded-full font-bold">
                                    كبسولة الذكرى الأولى
                                  </span>
                                )}
                                <span className="font-display-ar text-[#1F331D] font-bold text-sm">
                                  {msg.name || 'ضيف'}
                                </span>
                              </div>
                            </div>
                            <p className="font-display-ar text-sm text-[#110D0B] leading-relaxed font-normal">
                              "{msg.message}"
                            </p>

                            <div className="flex items-center justify-end gap-2 pt-2.5 border-t border-[#D8CCA8]">
                              <button
                                onClick={() => handleDelete(msg.id)}
                                className="flex items-center gap-1 px-3 py-1.5 text-red-800 text-xs font-display-ar font-bold cursor-pointer hover:bg-red-100 rounded-lg border border-red-300"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>حذف</span>
                              </button>

                              <button
                                onClick={() => handleApprove(msg.id)}
                                className="flex items-center gap-1 px-4 py-1.5 bg-[#1F331D] text-white text-xs font-display-ar font-bold cursor-pointer hover:bg-[#142213] rounded-full shadow-2xs"
                              >
                                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                <span>موافقة</span>
                              </button>
                            </div>
                          </div>
                        ))
                      ))}

                    {adminTab === 'approved' &&
                      (approvedMessages.length === 0 ? (
                        <div className="text-center py-12 text-[#241C16] text-sm font-display-ar font-medium">
                          لا توجد رسائل منشورة حتى الآن
                        </div>
                      ) : (
                        approvedMessages.map((msg) => (
                          <div
                            key={msg.id}
                            className="p-4 bg-white border-2 border-[#D8CCA8] rounded-xl flex flex-col gap-2.5 shadow-2xs"
                          >
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-[11.5px] text-[#7A5822] font-serif-en font-bold">
                                {new Date(msg.timestamp).toLocaleTimeString('ar-EG', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                              <div className="flex items-center gap-2">
                                {msg.capsuleType === 'anniversary' && (
                                  <span className="text-[10.5px] text-[#7A5822] bg-[#F6EFE5] border border-[#7A5822] px-2 py-0.5 rounded-full font-bold">
                                    الذكرى الأولى
                                  </span>
                                )}
                                <span className="font-display-ar text-[#1F331D] font-bold text-sm">
                                  {msg.name || 'ضيف'}
                                </span>
                              </div>
                            </div>
                            <p className="font-display-ar text-sm text-[#110D0B] leading-relaxed font-normal">
                              "{msg.message}"
                            </p>

                            <div className="flex items-center justify-end gap-2 pt-2.5 border-t border-[#D8CCA8]">
                              <button
                                onClick={() => handleDelete(msg.id)}
                                className="flex items-center gap-1 px-3 py-1.5 text-red-800 text-xs font-display-ar font-bold cursor-pointer hover:bg-red-100 rounded-lg border border-red-300"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>حذف</span>
                              </button>

                              <button
                                onClick={() => handleHide(msg.id)}
                                className="flex items-center gap-1 px-4 py-1.5 bg-[#FAF7F2] border border-[#7A5822] text-[#110D0B] text-xs font-display-ar font-bold cursor-pointer hover:bg-[#F6EFE5] rounded-full"
                              >
                                <EyeOff className="w-3.5 h-3.5" />
                                <span>إخفاء</span>
                              </button>
                            </div>
                          </div>
                        ))
                      ))}

                    {adminTab === 'capsule' && (
                      <div className="space-y-4">
                        <div className="p-5 bg-white border-2 border-[#7A5822] rounded-2xl text-center shadow-2xs">
                          <Hourglass className="w-6 h-6 text-[#7A5822] mx-auto mb-1 stroke-[2]" />
                          <h4 className="font-display-ar text-base font-bold text-[#110D0B]">
                            كبسولة الذكرى السنوية الأولى
                          </h4>
                          <p className="font-serif-en text-xs text-[#7A5822] tracking-widest mt-0.5 font-bold">
                            UNLOCK DATE: SEPTEMBER 8, 2027
                          </p>
                          <p className="font-display-ar text-xs sm:text-sm text-[#241C16] mt-2 font-medium leading-relaxed">
                            الرسائل دي مكتوبة لتتفتح يوم 8 سبتمبر 2027
                          </p>
                        </div>

                        {capsuleMessages.length === 0 ? (
                          <div className="text-center py-8 text-[#241C16] text-sm font-display-ar font-medium">
                            لم تُسجل رسائل في كبسولة الزمن حتى الآن
                          </div>
                        ) : (
                          capsuleMessages.map((msg) => (
                            <div
                              key={msg.id}
                              className="p-4 bg-white border-2 border-[#7A5822]/40 rounded-xl flex flex-col gap-2 shadow-2xs"
                            >
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-[11px] text-[#7A5822] font-serif-en tracking-wider font-bold">
                                  Sealed for 2027
                                </span>
                                <span className="font-display-ar text-[#1F331D] font-bold text-sm">
                                  {msg.name || 'ضيف'}
                                </span>
                              </div>
                              <p className="font-display-ar text-sm text-[#110D0B] leading-relaxed font-normal">
                                "{msg.message}"
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.footer>
  );
};

