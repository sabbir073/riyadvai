import type { Variants, Transition } from 'motion/react';

export const ease = [0.16, 1, 0.3, 1] as const;
export const easeInOut = [0.83, 0, 0.17, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease } },
};

export const stagger = (delay = 0.06, child = 0): Variants => ({
  hidden: {},
  visible: {
    transition: {
      delayChildren: child,
      staggerChildren: delay,
    },
  },
});

export const spring: Transition = { type: 'spring', stiffness: 280, damping: 30 };

export const softSpring: Transition = { type: 'spring', stiffness: 120, damping: 18, mass: 0.8 };

export const reveal = {
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, amount: 0.2 },
} as const;
