import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WeddingData } from '../types';
import { preloadImage } from '../utils/imageManifest';
import preloaderVideo from '../assets/preloader.MP4';
import { ChevronDown, Play } from 'lucide-react';

interface PreloaderProps {
  data: WeddingData;
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ data, onComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

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

  // Pure White Flash Bloom Transition into the Hero
  const triggerWhiteTransition = useCallback(() => {
    if (isTransitioning || isCompleted) return;
    setIsTransitioning(true);

    // Fade out audio gracefully if active
    if (videoRef.current) {
      const vid = videoRef.current;
      try {
        const fadeAudio = setInterval(() => {
          if (vid.volume > 0.15) {
            vid.volume -= 0.15;
          } else {
            vid.volume = 0;
            vid.pause();
            clearInterval(fadeAudio);
          }
        }, 30);
      } catch {
        vid.pause();
      }
    }

    // White flash reaches apex -> Hero becomes active behind it
    setTimeout(() => {
      onComplete();
    }, 450);

    // Fade out white flash completely
    setTimeout(() => {
      setIsCompleted(true);
    }, 1200);
  }, [isTransitioning, isCompleted, onComplete]);

  // Highly robust click / tap handler for all mobile and desktop devices
  const handlePlayClick = useCallback(() => {
    if (isTransitioning || isCompleted) return;
    const vid = videoRef.current;
    if (!vid) {
      triggerWhiteTransition();
      return;
    }

    if (vid.paused) {
      // First attempt: unmuted audio with video
      vid.muted = false;
      const playPromise = vid.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.warn('Audio play restricted by browser, playing with muted audio fallback:', err);
            vid.muted = true;
            vid
              .play()
              .then(() => {
                setIsPlaying(true);
              })
              .catch((playErr) => {
                console.error('Video playback failed:', playErr);
                // In case of browser video error, smoothly transition to hero
                triggerWhiteTransition();
              });
          });
      }
    } else {
      // If already playing and tapped again, toggle pause/play
      vid.pause();
      setIsPlaying(false);
    }
  }, [isTransitioning, isCompleted, triggerWhiteTransition]);

  if (isCompleted) return null;

  return (
    <div
      id="cinematic-preloader"
      onClick={handlePlayClick}
      className="fixed inset-0 z-50 overflow-hidden bg-black select-none cursor-pointer flex items-center justify-center"
    >
      {/* 1. Full-Screen Video with Multi-device Compatibility & Source Fallback */}
      <video
        ref={videoRef}
        playsInline
        muted
        preload="auto"
        controls={false}
        disablePictureInPicture
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={triggerWhiteTransition}
        onError={() => {
          console.warn('Video failed to load, proceeding to hero.');
          triggerWhiteTransition();
        }}
        className="w-full h-full object-cover object-center pointer-events-none"
      >
        <source src={preloaderVideo} type="video/mp4" />
      </video>

      {/* 2. Pure Minimal Text & Small Arrow without Background (Zero Clutter) */}
      <AnimatePresence>
        {!isPlaying && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.25 } }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center gap-1.5 text-center"
          >
            {/* Minimal Text without background */}
            <div className="flex items-center gap-2 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
              <motion.div
                animate={{ scale: [1, 1.25, 1], opacity: [0.85, 1, 0.85] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              >
                <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5 drop-shadow-sm" />
              </motion.div>

              <span className="font-display-ar text-xs sm:text-sm md:text-base font-light tracking-[0.25em] text-[#FAF7F2] drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                اضغط لفتح الدعوة
              </span>
            </div>

            {/* Small subtle bounce arrow */}
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              className="text-white/85 drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]"
            >
              <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[1.5]" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Apple-Grade Pure Luminous White Flash Bloom on finish */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.45,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="fixed inset-0 z-50 bg-[#FFFFFF] pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
};




