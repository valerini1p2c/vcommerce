import type { Variants } from "framer-motion";

export const motionTokens = {
  duration: { fast: 0.22, base: 0.45, slow: 0.72 },
  ease: [0.22, 1, 0.36, 1] as const,
  distance: { small: 12, base: 28, large: 48 },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: motionTokens.distance.base, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: motionTokens.duration.slow,
      ease: motionTokens.ease,
    },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: motionTokens.duration.base,
      ease: motionTokens.ease,
    },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.065, delayChildren: 0.06 } },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: motionTokens.duration.base,
      ease: motionTokens.ease,
    },
  },
};

export const drawerVariants: Variants = {
  closed: { x: "100%", opacity: 0.6 },
  open: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.38, ease: motionTokens.ease },
  },
};
