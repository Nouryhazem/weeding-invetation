import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WeddingData } from '../types';
import { preloadImage } from '../utils/imageManifest';
import preloaderVideo from '../assets/preloader.MP4';
import { ChevronUp } from 'lucide-react';
import { soundEffects } from '../utils/soundEffects';

interface PreloaderProps {
  data: WeddingData;
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ data, onComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const transitionTriggeredRef = useRef<boolean>(false);

  useEffect(() => {
    if (data.heroImage) {
      preloadImage(data.heroImage);
    }
  }, [data.heroImage]);

  // Preload video metadata on mount for instant start
  useEffect(() => {
    const vid = videoRef.current;
    if (vid) {
      vid.load();
    }
  }, []);

  // Smooth, Cinema-Grade Luminous Transition into the Hero (Triggered in the last 2 seconds)
  const triggerWhiteTransition = useCallback(() => {
    if (transitionTriggeredRef.current || isCompleted) return;
    transitionTriggeredRef.current = true;
    setIsTransitioning(true);
    soundEffects.playEtherealBellChord();

    // Smoothly fade out audio over ~1.8 seconds
    if (videoRef.current) {
      const vid = videoRef.current;
      try {
        const fadeInterval = setInterval(() => {
          if (vid.volume > 0.05) {
            vid.volume = Math.max(0, vid.volume - 0.05);
          } else {
            vid.volume = 0;
            clearInterval(fadeInterval);
          }
        }, 80);
      } catch {
        // ignore
      }
    }

    // Hero becomes active when white bloom reaches peak opacity
    setTimeout(() => {
      onComplete();
    }, 1100);

    // Fade out white transition overlay completely
    setTimeout(() => {
      setIsCompleted(true);
    }, 2200);
  }, [isCompleted, onComplete]);

  // Listen to playback time to smoothly trigger transition during the final 2 seconds
  const handleTimeUpdate = useCallback(() => {
    const vid = videoRef.current;
    if (!vid || transitionTriggeredRef.current || isCompleted) return;
    
    if (vid.duration && vid.duration > 2.5) {
      const timeLeft = vid.duration - vid.currentTime;
      if (timeLeft <= 2.0 && timeLeft > 0) {
        triggerWhiteTransition();
      }
    }
  }, [triggerWhiteTransition, isCompleted]);

  // Highly robust click / tap handler for all mobile and desktop devices
  const handlePlayClick = useCallback(() => {
    soundEffects.init();
    if (transitionTriggeredRef.current || isCompleted) return;
    const vid = videoRef.current;
    if (!vid) {
      triggerWhiteTransition();
      return;
    }

    if (vid.paused) {
      vid.muted = false;
      const playPromise = vid.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.warn('Audio play restricted by browser, playing with muted fallback:', err);
            vid.muted = true;
            vid
              .play()
              .then(() => {
                setIsPlaying(true);
              })
              .catch((playErr) => {
                console.error('Video playback failed:', playErr);
                triggerWhiteTransition();
              });
          });
      }
    } else {
      vid.pause();
      setIsPlaying(false);
    }
  }, [isCompleted, triggerWhiteTransition]);

  if (isCompleted) return null;

  return (
    <div
      id="cinematic-preloader"
      role="button"
      tabIndex={0}
      aria-label="بدء التجربة السينمائية لافتتاح دعوة الزفاف"
      onClick={handlePlayClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
          e.preventDefault();
          handlePlayClick();
        }
      }}
      className="fixed inset-0 z-50 overflow-hidden bg-black select-none cursor-pointer flex items-center justify-center focus:outline-hidden"
    >
      {/* 1. Full-Screen Video with Multi-device Compatibility */}
      <video
        ref={videoRef}
        playsInline
        muted
        preload="auto"
        controls={false}
        disablePictureInPicture
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onEnded={triggerWhiteTransition}
        onError={() => {
          console.warn('Video failed to load, proceeding to hero.');
          triggerWhiteTransition();
        }}
        className="w-full h-full object-cover object-center pointer-events-none"
      >
        <source src={preloaderVideo} type="video/mp4" />
      </video>

      {/* 2. Pure Minimalist Arrow Pointing Up directly under the Bow (Zero Background & Lowered) */}
      <AnimatePresence>
        {!isPlaying && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.25 } }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="absolute top-[76%] sm:top-[77%] md:top-[78%] left-[53%] -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              className="text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]"
            >
              <ChevronUp className="w-7 h-7 sm:w-8 sm:h-8 text-white stroke-[1.5]" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Smooth, Cinema-Grade Luminous Dissolve Bloom Starting in Last 2 Seconds */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="fixed inset-0 z-50 bg-[#FAF7F2] pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
};
