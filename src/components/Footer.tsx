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
      className="relative z-30 bg-[#FAF7F2]/90 backdrop-blur-xl text-[#231C18] py-2 sm:py-2.5 px-4 sm:px-8 select-none border-t border-[#E8DFC2]/80 shadow-[0_-1px_10px_rgba(140,109,59,0.04)]"
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
            className="group inline-flex items-center gap-1 font-serif-en text-[10px] sm:text-[11px] tracking-[0.2em] uppercase font-semibold text-[#1E1815] hover:text-[#8C6D3B] transition-all duration-300"
            title="Designed & Developed by Noury Hazem"
          >
            <span className="text-[#8C6D3B]/70 font-normal">A WEBSITE BY</span>
            <span className="border-b border-[#8C6D3B]/30 group-hover:border-[#8C6D3B] transition-colors">NOURY HAZEM</span>
            <ArrowUpRight className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 stroke-[2]" />
          </motion.a>

          <span className="hidden xs:inline-block text-[#8C6D3B]/40 font-light">•</span>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="hidden xs:inline-flex items-center gap-1.5"
          >
            <span className="font-serif-en text-[9.5px] sm:text-[10px] tracking-[0.25em] uppercase text-[#52634D] font-medium">
              BEST WISHES
            </span>
          </motion.div>
        </div>

        {/* 2. Center: Names & Date Indicator (Desktop / Tablet) */}
        <motion.div
          whileHover={{ y: -1 }}
          transition={{ duration: 0.2 }}
          className="hidden md:flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#F5EFE6]/60 border border-[#E8DFC2]/70 text-[10.5px] font-serif-en tracking-wider text-[#7A6B5D]"
        >
          <span className="text-[#1E1815] font-medium font-display-ar text-[11px]">
            {data.groomArabic} &amp; {data.brideArabic}
          </span>
          <span className="text-[#8C6D3B] font-medium">• 08.09.2026</span>
        </motion.div>

        {/* 3. Right Side: Apple Capsule Admin Lock */}
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
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#8C6D3B]/30 hover:border-[#8C6D3B] bg-white/70 hover:bg-white text-[#8C6D3B] hover:text-[#1E1815] text-[10px] sm:text-[11px] font-serif-en tracking-wider uppercase transition-all duration-300 shadow-2xs focus:outline-hidden cursor-pointer"
            title="Admin Moderation & Time Capsule"
          >
            <Lock className="w-2.5 h-2.5 stroke-[1.6]" />
            <span className="font-medium text-[9.5px] sm:text-[10px]">VAULT</span>
          </motion.button>
        </div>
      </div>

      {/* Admin Moderation Modal */}
      <AnimatePresence>
        {showAdminModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg bg-[#FAF7F2] border border-[#E8DFC2] rounded-2xl p-6 sm:p-8 max-h-[85vh] flex flex-col text-right overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E8DFC2] mb-4">
                <button
                  onClick={() => setShowAdminModal(false)}
                  className="p-1 text-[#8C6D3B] hover:text-[#1E1815] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 stroke-[1.2]" />
                </button>
                <div className="flex items-center gap-2 text-[#1E1815]">
                  <ShieldCheck className="w-4 h-4 text-[#8C6D3B]" />
                  <h3 className="font-display-ar text-base font-medium">
                    مراجعة رسائل الضيوف وكبسولة الزمن
                  </h3>
                </div>
              </div>

              {/* Password Gate */}
              {!isAdminAuthenticated ? (
                <form
                  onSubmit={handleVerifyPin}
                  className="py-6 flex flex-col items-center text-center"
                >
                  <Lock className="w-5 h-5 text-[#8C6D3B] stroke-[1.2] mb-3" />
                  <h4 className="font-display-ar text-sm font-medium text-[#1E1815] mb-1">
                    كلمة المرور للعروسين
                  </h4>
                  <p className="font-display-ar text-xs text-[#6E5F53] font-light mb-4">
                    أدخل كلمة المرور لإدارة الرسائل والاطلاع على كبسولة الزمن
                  </p>

                  <input
                    type="password"
                    placeholder="كلمة المرور"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    className="w-56 px-4 py-2 text-center text-sm tracking-wide border-b border-[#8C6D3B] bg-transparent text-[#1E1815] focus:outline-hidden mb-3"
                  />

                  {pinError && (
                    <span className="text-xs text-red-600 font-display-ar font-light mb-3">
                      كلمة المرور غير صحيحة
                    </span>
                  )}

                  <button
                    type="submit"
                    className="px-8 py-2.5 rounded-full border border-[#8C6D3B] hover:bg-[#F6EFE5] text-[#1E1815] text-xs font-display-ar font-normal transition-colors cursor-pointer mt-2"
                  >
                    دخول
                  </button>
                </form>
              ) : (
                /* Authenticated Dashboard */
                <div className="flex flex-col flex-1 overflow-hidden">
                  {/* Tabs */}
                  <div className="flex border-b border-[#E8DFC2] mb-4 gap-1">
                    <button
                      onClick={() => setAdminTab('pending')}
                      className={`flex-1 py-2 text-xs font-display-ar text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                        adminTab === 'pending'
                          ? 'border-[#8C6D3B] text-[#1E1815] font-medium'
                          : 'border-transparent text-[#8C6D3B]/60 hover:text-[#1E1815]'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>قيد المراجعة</span>
                      {pendingMessages.length > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#8C6D3B] text-white">
                          {pendingMessages.length}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => setAdminTab('approved')}
                      className={`flex-1 py-2 text-xs font-display-ar text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                        adminTab === 'approved'
                          ? 'border-[#8C6D3B] text-[#1E1815] font-medium'
                          : 'border-transparent text-[#8C6D3B]/60 hover:text-[#1E1815]'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#52634D]" />
                      <span>المنشورة ({approvedMessages.length})</span>
                    </button>

                    <button
                      onClick={() => setAdminTab('capsule')}
                      className={`flex-1 py-2 text-xs font-display-ar text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                        adminTab === 'capsule'
                          ? 'border-[#8C6D3B] text-[#8C6D3B] font-medium'
                          : 'border-transparent text-[#8C6D3B]/60 hover:text-[#8C6D3B]'
                      }`}
                    >
                      <Hourglass className="w-3.5 h-3.5 text-[#8C6D3B]" />
                      <span>الكبسولة ({capsuleMessages.length})</span>
                    </button>
                  </div>

                  {/* Messages List */}
                  <div className="flex-1 overflow-y-auto pr-1 space-y-3">
                    {adminTab === 'pending' &&
                      (pendingMessages.length === 0 ? (
                        <div className="text-center py-10 text-[#8C6D3B]/60 text-xs font-display-ar font-light">
                          لا توجد رسائل معلقة حالياً
                        </div>
                      ) : (
                        pendingMessages.map((msg) => (
                          <div
                            key={msg.id}
                            className="p-4 bg-[#FAF7F2] border border-[#E8DFC2] rounded-xl flex flex-col gap-2"
                          >
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-[11px] text-[#8C6D3B] font-serif-en">
                                {new Date(msg.timestamp).toLocaleTimeString('ar-EG', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                              <div className="flex items-center gap-2">
                                {msg.capsuleType === 'anniversary' && (
                                  <span className="text-[10px] text-[#8C6D3B] border border-[#8C6D3B]/40 px-2 py-0.5 rounded-full">
                                    كبسولة الذكرى الأولى
                                  </span>
                                )}
                                <span className="font-display-ar text-[#52634D] font-medium">
                                  {msg.name || 'ضيف'}
                                </span>
                              </div>
                            </div>
                            <p className="font-display-ar text-xs sm:text-sm text-[#1E1815] leading-relaxed font-light">
                              "{msg.message}"
                            </p>

                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E8DFC2]">
                              <button
                                onClick={() => handleDelete(msg.id)}
                                className="flex items-center gap-1 px-3 py-1 text-red-700 text-xs font-display-ar cursor-pointer hover:bg-red-50 rounded-lg"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>حذف</span>
                              </button>

                              <button
                                onClick={() => handleApprove(msg.id)}
                                className="flex items-center gap-1 px-4 py-1.5 bg-[#52634D] text-white text-xs font-display-ar cursor-pointer hover:bg-[#43523f] rounded-full"
                              >
                                <Check className="w-3 h-3" />
                                <span>موافقة</span>
                              </button>
                            </div>
                          </div>
                        ))
                      ))}

                    {adminTab === 'approved' &&
                      (approvedMessages.length === 0 ? (
                        <div className="text-center py-10 text-[#8C6D3B]/60 text-xs font-display-ar font-light">
                          لا توجد رسائل منشورة حتى الآن
                        </div>
                      ) : (
                        approvedMessages.map((msg) => (
                          <div
                            key={msg.id}
                            className="p-4 bg-[#FAF7F2] border border-[#E8DFC2] rounded-xl flex flex-col gap-2"
                          >
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-[11px] text-[#8C6D3B] font-serif-en">
                                {new Date(msg.timestamp).toLocaleTimeString('ar-EG', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                              <div className="flex items-center gap-2">
                                {msg.capsuleType === 'anniversary' && (
                                  <span className="text-[10px] text-[#8C6D3B] border border-[#8C6D3B]/40 px-2 py-0.5 rounded-full">
                                    الذكرى الأولى
                                  </span>
                                )}
                                <span className="font-display-ar text-[#52634D] font-medium">
                                  {msg.name || 'ضيف'}
                                </span>
                              </div>
                            </div>
                            <p className="font-display-ar text-xs sm:text-sm text-[#1E1815] leading-relaxed font-light">
                              "{msg.message}"
                            </p>

                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E8DFC2]">
                              <button
                                onClick={() => handleDelete(msg.id)}
                                className="flex items-center gap-1 px-3 py-1 text-red-700 text-xs font-display-ar cursor-pointer hover:bg-red-50 rounded-lg"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>حذف</span>
                              </button>

                              <button
                                onClick={() => handleHide(msg.id)}
                                className="flex items-center gap-1 px-4 py-1.5 bg-[#F6EFE5] text-[#1E1815] text-xs font-display-ar cursor-pointer hover:bg-[#EBE4D8] rounded-full"
                              >
                                <EyeOff className="w-3 h-3" />
                                <span>إخفاء</span>
                              </button>
                            </div>
                          </div>
                        ))
                      ))}

                    {adminTab === 'capsule' && (
                      <div className="space-y-4">
                        <div className="p-5 bg-[#FAF7F2] border border-[#8C6D3B]/30 rounded-2xl text-center">
                          <Hourglass className="w-5 h-5 text-[#8C6D3B] mx-auto mb-1" />
                          <h4 className="font-display-ar text-sm font-medium text-[#1E1815]">
                            كبسولة الذكرى السنوية الأولى
                          </h4>
                          <p className="font-serif-en text-[11px] text-[#8C6D3B] tracking-widest mt-0.5 font-medium">
                            UNLOCK DATE: SEPTEMBER 8, 2027
                          </p>
                          <p className="font-display-ar text-xs text-[#4A3E36] mt-2 font-light leading-relaxed">
                            الرسائل دي مكتوبة لتتفتح يوم 8 سبتمبر 2027
                          </p>
                        </div>

                        {capsuleMessages.length === 0 ? (
                          <div className="text-center py-6 text-[#8C6D3B]/60 text-xs font-display-ar font-light">
                            لم تُسجل رسائل في كبسولة الزمن حتى الآن
                          </div>
                        ) : (
                          capsuleMessages.map((msg) => (
                            <div
                              key={msg.id}
                              className="p-4 bg-[#FAF7F2] border border-[#8C6D3B]/30 rounded-xl flex flex-col gap-2"
                            >
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-[10px] text-[#8C6D3B] font-serif-en tracking-wider font-medium">
                                  Sealed for 2027
                                </span>
                                <span className="font-display-ar text-[#52634D] font-medium">
                                  {msg.name || 'ضيف'}
                                </span>
                              </div>
                              <p className="font-display-ar text-xs sm:text-sm text-[#1E1815] leading-relaxed font-light">
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
