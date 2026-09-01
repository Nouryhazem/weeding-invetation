import React, { useState } from 'react';

interface PlaceholderImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  objectPosition?: string;
  type?: 'hero' | 'portraitAhmed' | 'portraitNoor' | 'venue' | 'closing' | 'journey';
  subtitle?: string;
  priority?: boolean;
}

export const PlaceholderImage: React.FC<PlaceholderImageProps> = ({
  src,
  alt,
  className = '',
  aspectRatio,
  objectPosition = 'center center',
  type = 'journey',
  subtitle,
  priority = false
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // High-fashion monochrome SVG artwork themes for editorial placeholders
  const getArtwork = () => {
    switch (type) {
      case 'hero':
        return (
          <div className="absolute inset-0 bg-[#1A1817] flex items-center justify-center overflow-hidden">
            {/* Subtle architectural atmosphere */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_40%,#C5A880_0%,transparent_70%)]" />
            <svg className="w-full h-full opacity-35" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" fill="none">
              <circle cx="500" cy="220" r="180" stroke="#C5A880" strokeWidth="0.75" strokeDasharray="4 4" />
              <circle cx="500" cy="220" r="260" stroke="#DFC7A5" strokeWidth="0.5" opacity="0.4" />
              {/* Couple silhouette artistic representation */}
              <path d="M440 380 C440 280, 480 230, 480 200 C480 180, 460 160, 460 140 C460 115, 475 100, 490 100 C505 100, 520 115, 520 140 C520 160, 500 180, 500 200 C500 230, 540 280, 540 380 Z" fill="#2A2624" opacity="0.8" />
              <path d="M480 400 L480 600 L560 600 L560 400 Z" fill="#22201F" opacity="0.9" />
              <line x1="100" y1="520" x2="900" y2="520" stroke="#C5A880" strokeWidth="0.5" opacity="0.6" />
            </svg>
            <div className="absolute bottom-12 text-center text-[#E8E2D9]/80 z-10 px-6">
              <span className="font-serif-en italic text-xs tracking-widest text-[#C5A880] uppercase block mb-1">Editorial Portrait</span>
              <span className="font-display-ar text-sm tracking-wide text-[#FAF8F5]/90">أحمد &amp; نور</span>
            </div>
          </div>
        );
      case 'portraitAhmed':
        return (
          <div className="absolute inset-0 bg-[#161514] flex flex-col items-center justify-between p-8 overflow-hidden">
            <div className="w-full flex justify-between items-center opacity-40">
              <span className="text-[10px] tracking-widest uppercase font-serif-en text-[#C5A880]">Groom</span>
              <div className="h-px w-12 bg-[#C5A880]/50" />
            </div>
            <div className="relative my-auto flex flex-col items-center">
              <div className="w-48 h-64 border border-[#C5A880]/30 rounded-t-full flex items-center justify-center p-4 relative">
                <div className="w-40 h-56 rounded-t-full bg-gradient-to-b from-[#2A2624] to-[#161514] flex items-center justify-center">
                  <span className="font-display-ar text-2xl text-[#E8E2D9] font-medium tracking-wide">أحمد</span>
                </div>
                <div className="absolute -bottom-3 px-3 py-1 bg-[#1A1817] border border-[#C5A880]/40 text-[10px] text-[#C5A880] tracking-widest uppercase">
                  Ahmed
                </div>
              </div>
            </div>
            <div className="text-center opacity-40">
              <span className="text-[10px] tracking-widest text-[#7A746E]">08.09.2026</span>
            </div>
          </div>
        );
      case 'portraitNoor':
        return (
          <div className="absolute inset-0 bg-[#161514] flex flex-col items-center justify-between p-8 overflow-hidden">
            <div className="w-full flex justify-between items-center opacity-40">
              <span className="text-[10px] tracking-widest uppercase font-serif-en text-[#C5A880]">Bride</span>
              <div className="h-px w-12 bg-[#C5A880]/50" />
            </div>
            <div className="relative my-auto flex flex-col items-center">
              <div className="w-48 h-64 border border-[#C5A880]/30 rounded-t-full flex items-center justify-center p-4 relative">
                <div className="w-40 h-56 rounded-t-full bg-gradient-to-b from-[#2E2825] to-[#161514] flex items-center justify-center">
                  <span className="font-display-ar text-2xl text-[#E8E2D9] font-medium tracking-wide">نور</span>
                </div>
                <div className="absolute -bottom-3 px-3 py-1 bg-[#1A1817] border border-[#C5A880]/40 text-[10px] text-[#C5A880] tracking-widest uppercase">
                  Noor
                </div>
              </div>
            </div>
            <div className="text-center opacity-40">
              <span className="text-[10px] tracking-widest text-[#7A746E]">08.09.2026</span>
            </div>
          </div>
        );
      case 'venue':
        return (
          <div className="absolute inset-0 bg-[#11100F] flex items-center justify-center overflow-hidden">
            <svg className="w-full h-full opacity-25" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" fill="none">
              {/* Grand architectural arches */}
              <path d="M100 500 L100 200 C100 100, 250 100, 250 200 L250 500" stroke="#C5A880" strokeWidth="1" />
              <path d="M300 500 L300 150 C300 50, 500 50, 500 150 L500 500" stroke="#C5A880" strokeWidth="1.5" />
              <path d="M550 500 L550 200 C550 100, 700 100, 700 200 L700 500" stroke="#C5A880" strokeWidth="1" />
              <line x1="50" y1="420" x2="750" y2="420" stroke="#C5A880" strokeWidth="0.75" />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-transparent to-[#121110]/80" />
            <div className="relative text-center z-10 p-6">
              <span className="font-serif-en text-sm tracking-widest text-[#C5A880] uppercase block mb-1">Architectural Venue</span>
              <span className="font-display-ar text-xl text-[#FAF8F5] tracking-wide">Lovely Hall</span>
            </div>
          </div>
        );
      case 'closing':
        return (
          <div className="absolute inset-0 bg-[#121110] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#262220_0%,#121110_80%)]" />
            <div className="relative text-center z-10 px-8 py-12 border border-[#C5A880]/20 rounded-full max-w-sm aspect-square flex flex-col items-center justify-center backdrop-blur-xs">
              <div className="w-8 h-px bg-[#C5A880] mb-4" />
              <span className="font-display-ar text-2xl text-[#FAF8F5] font-light mb-2">أحمد &amp; نور</span>
              <span className="font-serif-en italic text-sm text-[#C5A880] tracking-widest">Together Forever</span>
              <div className="w-8 h-px bg-[#C5A880] mt-4" />
            </div>
          </div>
        );
      default:
        return (
          <div className="absolute inset-0 bg-[#1E1C1A] flex flex-col items-center justify-center p-6 text-center">
            <div className="w-12 h-12 rounded-full border border-[#C5A880]/30 flex items-center justify-center mb-3 text-[#C5A880]">
              <span className="font-serif-en italic text-sm">✦</span>
            </div>
            <span className="font-display-ar text-base text-[#E8E2D9] font-medium block mb-1">{alt}</span>
            {subtitle && <span className="font-body-ar text-xs text-[#A48356] block max-w-xs">{subtitle}</span>}
          </div>
        );
    }
  };

  return (
    <div
      className={`relative overflow-hidden bg-[#1A1817] select-none ${className}`}
      style={{ aspectRatio: aspectRatio }}
    >
      {/* Real image if available */}
      {src && !error && (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`w-full h-full object-cover transition-opacity duration-700 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ objectPosition }}
        />
      )}

      {/* Fallback artwork if no image or error */}
      {(!loaded || error) && getArtwork()}
    </div>
  );
};
