import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface AppleCardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  delay?: number;
  enableTilt?: boolean;
}

export const AppleCard: React.FC<AppleCardProps> = ({
  children,
  className = '',
  id,
  delay = 0,
  enableTilt = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse coordinate motion values normalized between -0.5 and 0.5
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for Apple-grade fluid tilt
  const springConfig = { damping: 25, stiffness: 220, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4.5, -4.5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4.5, 4.5]), springConfig);

  // Radial gleam position in percentage
  const gleamX = useTransform(mouseX, [-0.5, 0.5], ['0%', '100%']);
  const gleamY = useTransform(mouseY, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableTilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      id={id}
      ref={cardRef}
      initial={{ opacity: 0, y: 32, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.16, 1, 0.3, 1], // Apple-like easeOutExpo curve
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        rotateX: enableTilt ? rotateX : 0,
        rotateY: enableTilt ? rotateY : 0,
        transformStyle: 'preserve-3d',
      }}
      className={`relative rounded-3xl transition-shadow duration-500 will-change-transform ${
        isHovered
          ? 'shadow-[0_20px_45px_-12px_rgba(70,63,58,0.12),0_0_0_1px_rgba(201,175,135,0.45)]'
          : 'shadow-[0_10px_25px_-8px_rgba(70,63,58,0.05),0_0_0_1px_rgba(201,175,135,0.22)]'
      } ${className}`}
    >
      {/* Specular Apple Glare / Light Gleam on Hover */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-3xl z-20 transition-opacity duration-500"
        style={{
          opacity: isHovered ? 0.35 : 0,
          background: `radial-gradient(circle 320px at ${gleamX.get()} ${gleamY.get()}, rgba(255, 255, 255, 0.8), transparent 70%)`,
        }}
      />

      {children}
    </motion.div>
  );
};
