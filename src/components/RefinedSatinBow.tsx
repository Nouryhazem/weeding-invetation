import React from 'react';
import { motion } from 'motion/react';

interface RefinedSatinBowProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const RefinedSatinBow: React.FC<RefinedSatinBowProps> = ({
  className = '',
  size = 'md',
}) => {
  const dimensions = {
    sm: { width: 90, height: 65 },
    md: { width: 120, height: 85 },
    lg: { width: 150, height: 105 },
  }[size];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: -6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className={`relative flex items-center justify-center select-none pointer-events-none ${className}`}
      style={{ width: dimensions.width, height: dimensions.height }}
    >
      <svg
        viewBox="0 0 160 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_4px_12px_rgba(70,63,58,0.12)]"
      >
        <defs>
          {/* Real Silk / Satin Gradient with Ivory & Pale Champagne Sheen */}
          <linearGradient id="satinMain" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#F9F6F0" />
            <stop offset="70%" stopColor="#EFE8DD" />
            <stop offset="100%" stopColor="#E5DC CE" />
          </linearGradient>

          <linearGradient id="satinShadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D9CEBF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#BDB09E" stopOpacity="0.9" />
          </linearGradient>

          <linearGradient id="satinGleam" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#FAF7F2" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#E3D7C5" stopOpacity="0.8" />
          </linearGradient>

          {/* Muted Sage & Dusty Olive Botanical Gradients */}
          <linearGradient id="sageLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9DAE99" />
            <stop offset="60%" stopColor="#7E8C7A" />
            <stop offset="100%" stopColor="#5E695A" />
          </linearGradient>

          <linearGradient id="oliveLeafGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8A9684" />
            <stop offset="100%" stopColor="#6C7A68" />
          </linearGradient>
        </defs>

        {/* 1. Subtle Botanical Sprigs Behind the Bow (Muted Sage & Dusty Olive) */}
        <g id="botanical-accents" opacity="0.85">
          {/* Left Sage Leaf 1 */}
          <path
            d="M58 46 C42 40, 28 35, 18 42 C26 50, 42 48, 56 48 Z"
            fill="url(#sageLeafGrad)"
            opacity="0.9"
          />
          <path
            d="M57 46 C40 42, 28 38, 20 42"
            stroke="#4D5749"
            strokeWidth="0.6"
            strokeLinecap="round"
          />

          {/* Left Sage Leaf 2 (Upper tilt) */}
          <path
            d="M62 40 C52 26, 38 18, 28 22 C32 32, 46 36, 60 42 Z"
            fill="url(#oliveLeafGrad)"
            opacity="0.8"
          />

          {/* Right Sage Leaf 1 */}
          <path
            d="M102 46 C118 40, 132 35, 142 42 C134 50, 118 48, 104 48 Z"
            fill="url(#sageLeafGrad)"
            opacity="0.9"
          />
          <path
            d="M103 46 C120 42, 132 38, 140 42"
            stroke="#4D5749"
            strokeWidth="0.6"
            strokeLinecap="round"
          />

          {/* Right Sage Leaf 2 (Upper tilt) */}
          <path
            d="M98 40 C108 26, 122 18, 132 22 C128 32, 114 36, 100 42 Z"
            fill="url(#oliveLeafGrad)"
            opacity="0.8"
          />

          {/* Delicate Tiny Porcelain Blossom on Left */}
          <circle cx="38" cy="32" r="2.2" fill="#FAF7F2" />
          <circle cx="38" cy="32" r="0.8" fill="#C9AF87" />

          {/* Delicate Tiny Porcelain Blossom on Right */}
          <circle cx="122" cy="32" r="2.2" fill="#FAF7F2" />
          <circle cx="122" cy="32" r="0.8" fill="#C9AF87" />
        </g>

        {/* 2. Hanging Ribbon Tails with Natural Gravity & Organic Flow */}
        <g id="ribbon-tails">
          {/* Left Tail with Realistic Satin Fold */}
          <path
            d="M74 54 C70 68, 64 86, 52 104 C58 98, 68 94, 76 96 C78 82, 80 66, 80 54 Z"
            fill="url(#satinMain)"
          />
          {/* Left Tail Underside Shadow */}
          <path
            d="M74 54 C71 66, 66 82, 52 104 C55 101, 60 97, 66 96 C72 80, 76 66, 78 54 Z"
            fill="url(#satinShadow)"
            opacity="0.35"
          />
          {/* Left Tail Silk Sheen Line */}
          <path
            d="M77 56 C74 70, 68 86, 60 98"
            stroke="url(#satinGleam)"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.6"
          />

          {/* Right Tail with Gentle Organic Wave (Slight Asymmetry) */}
          <path
            d="M86 54 C90 68, 98 84, 110 102 C104 97, 94 94, 86 97 C84 82, 82 66, 82 54 Z"
            fill="url(#satinMain)"
          />
          {/* Right Tail Underside Shadow */}
          <path
            d="M86 54 C89 66, 96 82, 110 102 C107 99, 102 96, 96 96 C90 80, 86 66, 84 54 Z"
            fill="url(#satinShadow)"
            opacity="0.35"
          />
          {/* Right Tail Silk Sheen Line */}
          <path
            d="M84 56 C88 70, 94 86, 102 96"
            stroke="url(#satinGleam)"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.6"
          />
        </g>

        {/* 3. Left Loop (Soft, Refined, Less Puffy, Realistic Silk Folds) */}
        <g id="left-loop">
          <path
            d="M78 48 C68 34, 46 28, 34 38 C26 46, 32 58, 48 58 C62 58, 72 52, 78 48 Z"
            fill="url(#satinMain)"
          />
          {/* Inner Loop Shadow/Depth */}
          <path
            d="M74 48 C65 38, 48 34, 38 42 C33 47, 36 53, 46 54 C58 54, 68 50, 74 48 Z"
            fill="url(#satinShadow)"
            opacity="0.4"
          />
          {/* Crease / Silk Highlight */}
          <path
            d="M76 48 C62 38, 48 38, 38 44"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.75"
          />
        </g>

        {/* 4. Right Loop (Soft, Refined, Complementary) */}
        <g id="right-loop">
          <path
            d="M82 48 C92 34, 114 28, 126 38 C134 46, 128 58, 112 58 C98 58, 88 52, 82 48 Z"
            fill="url(#satinMain)"
          />
          {/* Inner Loop Shadow/Depth */}
          <path
            d="M86 48 C95 38, 112 34, 122 42 C127 47, 124 53, 114 54 C102 54, 92 50, 86 48 Z"
            fill="url(#satinShadow)"
            opacity="0.4"
          />
          {/* Crease / Silk Highlight */}
          <path
            d="M84 48 C98 38, 112 38, 122 44"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.75"
          />
        </g>

        {/* 5. Center Knot (Organic Silk Wrap) */}
        <g id="center-knot">
          <ellipse cx="80" cy="49" rx="7.5" ry="9.5" fill="url(#satinMain)" />
          {/* Knot Crease Lines */}
          <path
            d="M76 43 C77 48, 77 52, 75 56"
            stroke="url(#satinShadow)"
            strokeWidth="0.8"
            strokeLinecap="round"
            opacity="0.6"
          />
          <path
            d="M84 43 C83 48, 83 52, 85 56"
            stroke="url(#satinShadow)"
            strokeWidth="0.8"
            strokeLinecap="round"
            opacity="0.6"
          />
          {/* Top Silk Gleam */}
          <ellipse
            cx="80"
            cy="46"
            rx="4"
            ry="2.5"
            fill="#FFFFFF"
            opacity="0.85"
          />
        </g>
      </svg>
    </motion.div>
  );
};
