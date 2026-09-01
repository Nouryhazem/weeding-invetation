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
    <div className="fixed top-0 left-0 right-0 h-[2px] z-50 pointer-events-none bg-transparent">
      <motion.div
        className="h-full bg-gradient-to-r from-[#C9AF87] via-[#DECBC7] to-[#C9AF87] origin-right"
        style={{ scaleX }}
      />
    </div>
  );
};

