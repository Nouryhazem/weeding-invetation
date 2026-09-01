import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { WeddingData } from '../types';

interface NavigationProps {
  data: WeddingData;
}

const NAV_LINKS = [
  { id: 'hero', label: 'البداية' },
  { id: 'date', label: 'التاريخ' },
  { id: 'details', label: 'التفاصيل' },
  { id: 'location', label: 'المكان' },
  { id: 'guestbook', label: 'رسالتكم' }
];

export const Navigation: React.FC<NavigationProps> = ({ data }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      const sections = NAV_LINKS.map(link => document.getElementById(link.id));
      const scrollPosition = window.scrollY + window.innerHeight * 0.35;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section) {
          const top = section.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(NAV_LINKS[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -20;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.header
            id="main-navigation"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 left-0 right-0 z-40 px-6 py-4 transition-all duration-300 pointer-events-none"
          >
            <div className="max-w-4xl mx-auto flex items-center justify-between pointer-events-auto bg-[#FAF7F2]/90 backdrop-blur-md px-6 py-2.5 rounded-full border border-[#9DAE99]/35 shadow-xs">
              {/* Couple Initial Monogram */}
              <button
                id="nav-brand-button"
                onClick={() => scrollToSection('hero')}
                className="flex items-center gap-2 text-right group cursor-pointer focus:outline-hidden"
              >
                <span className="font-display-ar text-sm font-light text-[#3D3835] group-hover:text-[#5E695A] transition-colors">
                  {data.groomArabic} × {data.brideArabic}
                </span>
                <span className="text-[10px] tracking-widest text-[#9D9287] font-serif-en hidden sm:inline font-light">
                  08.09.2026
                </span>
              </button>

              {/* Desktop Nav Links */}
              <nav className="hidden md:flex items-center gap-7">
                {NAV_LINKS.map((link) => {
                  const isActive = activeSection === link.id;
                  return (
                    <button
                      key={link.id}
                      id={`nav-link-${link.id}`}
                      onClick={() => scrollToSection(link.id)}
                      className={`relative font-body-ar text-xs tracking-wider transition-all duration-300 py-1 cursor-pointer focus:outline-hidden ${
                        isActive
                          ? 'text-[#3D3835] font-medium'
                          : 'text-[#5E695A] hover:text-[#3D3835] font-light'
                      }`}
                    >
                      {link.label}
                      {isActive && (
                        <motion.div
                          layoutId="activeNavIndicator"
                          className="absolute -bottom-1 left-0 right-0 h-[1px] bg-[#7E8C7A]"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Mobile Menu Toggle Button */}
              <button
                id="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="فتح القائمة"
                className="md:hidden p-1.5 text-[#3D3835] hover:text-[#5E695A] transition-colors cursor-pointer focus:outline-hidden"
              >
                <Menu className="w-4 h-4 stroke-[1.2]" />
              </button>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Clean Full-Screen Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-[#F4EFEA] flex flex-col justify-between p-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#9DAE99]/30 pb-6">
              <div>
                <span className="font-display-ar text-lg font-light text-[#3D3835] block">
                  {data.groomArabic} × {data.brideArabic}
                </span>
                <span className="font-serif-en italic text-xs text-[#5E695A] tracking-widest block font-light">
                  September 8, 2026
                </span>
              </div>
              <button
                id="mobile-menu-close"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="إغلاق القائمة"
                className="p-2 rounded-full border border-[#9DAE99]/35 text-[#3D3835] hover:text-[#5E695A] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 stroke-[1.2]" />
              </button>
            </div>

            {/* Links */}
            <div className="flex flex-col gap-6 my-auto py-8">
              {NAV_LINKS.map((link, idx) => {
                const isActive = activeSection === link.id;
                return (
                  <motion.button
                    key={link.id}
                    id={`mobile-nav-link-${link.id}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * idx, duration: 0.3 }}
                    onClick={() => scrollToSection(link.id)}
                    className="flex items-center justify-between text-right py-3 border-b border-[#FAF7F2] group cursor-pointer"
                  >
                    <span
                      className={`font-display-ar text-2xl transition-colors ${
                        isActive
                          ? 'text-[#3D3835] font-normal'
                          : 'text-[#5E695A] group-hover:text-[#3D3835] font-light'
                      }`}
                    >
                      {link.label}
                    </span>
                    {isActive && (
                      <span className="text-[#7E8C7A] text-xs font-serif-en tracking-widest uppercase font-light">
                        Current
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="text-center pt-6 border-t border-[#9DAE99]/30">
              <p className="font-body-ar text-xs text-[#5E695A] font-light">
                مستنيينكم تشاركونا ليلتنا
              </p>
              <div className="w-12 h-[1px] bg-[#7E8C7A]/50 mx-auto mt-3" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

