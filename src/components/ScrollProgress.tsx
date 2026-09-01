import React from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

export const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="fixed top-0 left-0 right-0 h-[1.5px] z-50 pointer-events-none bg-transparent">
      <motion.div
        className="h-full bg-gradient-to-r from-[#A98A59] via-[#96A08C] to-[#A98A59] origin-right"
        style={{ scaleX }}
      />
    </div>
  );
};
