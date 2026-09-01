import React, { useState, useEffect, useRef } from 'react';
import { weddingData } from './data/weddingData';
import { Preloader } from './components/Preloader';
import { ScrollProgress } from './components/ScrollProgress';
import { FloatingFlowers } from './components/FloatingFlowers';
import { Hero } from './components/Hero';
import { Countdown } from './components/Countdown';
import { EventDetails } from './components/EventDetails';
import { LocationSection } from './components/LocationSection';
import { BlessingHearts } from './components/BlessingHearts';
import { GuestMessage } from './components/GuestMessage';
import { Footer } from './components/Footer';
import { soundEffects } from './utils/soundEffects';
import { Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [preloaderFinished, setPreloaderFinished] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    // Initialize audio on first user gesture
    const handleFirstGesture = () => {
      soundEffects.init();
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };

    window.addEventListener('click', handleFirstGesture, { passive: true });
    window.addEventListener('touchstart', handleFirstGesture, { passive: true });

    const handleScroll = () => {
      const currentY = window.scrollY;
      const deltaY = currentY - lastScrollY.current;
      lastScrollY.current = currentY;

      // Trigger delicate musical scroll notes
      soundEffects.onScrollTick(deltaY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleToggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEffects.init();
    const muted = soundEffects.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundEffects.playSoftTap();
    }
  };

  return (
    <div className="relative min-h-screen bg-[#F4EEE7] text-[#463F3A] overflow-x-hidden selection:bg-[#DECBC7]/35 selection:text-[#463F3A] font-light">
      <ScrollProgress />
      <FloatingFlowers />

      {/* Floating Audio Ambience Toggle Button */}
      <AnimatePresence>
        {preloaderFinished && (
          <motion.button
            id="audio-toggle-btn"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            onClick={handleToggleSound}
            aria-label={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
            className="fixed top-4 left-4 z-40 w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#C9AF87]/25 bg-[#FAF7F2]/75 backdrop-blur-xs flex items-center justify-center text-[#8E8074] hover:text-[#2E2824] hover:border-[#A98A59]/60 transition-all cursor-pointer focus:outline-hidden group"
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-[#9A8A7A] group-hover:text-[#463F3A] transition-colors stroke-[1.2]" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-[#A98A59] group-hover:text-[#8E714B] transition-colors stroke-[1.2]" />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* 1. Preloader */}
      <Preloader
        data={weddingData}
        onComplete={() => setPreloaderFinished(true)}
      />

      <main className="relative w-full">
        {/* 2. Hero */}
        <Hero
          data={weddingData}
          preloaderFinished={preloaderFinished}
        />

        {/* 3. Countdown */}
        <Countdown data={weddingData} />

        {/* 4. Event Details */}
        <EventDetails data={weddingData} />

        {/* 5. Location */}
        <LocationSection data={weddingData} />

        {/* 6. Guest Message */}
        <GuestMessage data={weddingData} />

        {/* 7. Blessing Hearts & Love */}
        <BlessingHearts data={weddingData} />

        {/* 8. Footer with Admin & Credits */}
        <Footer data={weddingData} />
      </main>
    </div>
  );
}


