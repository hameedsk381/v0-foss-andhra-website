"\"use client"

import type { Variants } from "framer-motion"

// Animation variants for different elements
export const fadeIn = (direction: "up" | "down" | "left" | "right" | "none" = "none", delay = 0): Variants => {
  return {
    hidden: {
      opacity: 0,
      ...(direction === "up" && { y: 20 }),
      ...(direction === "down" && { y: -20 }),
      ...(direction === "left" && { x: -20 }),
      ...(direction === "right" && { x: 20 }),
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.5,
        delay: delay,
        ease: "easeInOut",
      },
    },
  }
}

export const slideIn = (direction: "up" | "down" | "left" | "right", delay = 0): Variants => {
  return {
    hidden: {
      x: direction === "right" ? "100%" : direction === "left" ? "-100%" : 0,
      y: direction === "down" ? "100%" : direction === "up" ? "100%" : 0,
      opacity: 0,
    },
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: delay,
        ease: [0.25, 0.25, 0.25, 0.75],
      },
    },
  }
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
}

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
}

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
}

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
}

export const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export const floatAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 3,
    repeat: Number.POSITIVE_INFINITY,
    repeatType: "loop",
    ease: "easeInOut",
  },
}

export const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Number.POSITIVE_INFINITY,
    repeatType: "loop",
    ease: "easeInOut",
  },
}

export const spinAnimation = {
  rotate: 360,
  transition: {
    duration: 20,
    repeat: Number.POSITIVE_INFINITY,
    ease: "linear",
  },
}

export const blobAnimation = {
  borderRadius: [
    "60% 40% 30% 70% / 60% 30% 70% 40%",
    "30% 60% 70% 40% / 50% 60% 30% 60%",
    "60% 40% 30% 70% / 60% 30% 70% 40%",
  ],
  transition: {
    duration: 8,
    repeat: Number.POSITIVE_INFINITY,
    repeatType: "loop",
    ease: "easeInOut",
  },
}
