import { useScroll, useSpring, motion } from 'motion/react';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, mass: 0.4 });

  return (
    <motion.div
      aria-hidden="true"
      className="scroll-progress"
      style={{ scaleX }}
    />
  );
}
