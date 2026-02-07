// Animation constants for consistent motion design across the application

export const ANIMATION_DURATIONS = {
    fast: 0.2,
    normal: 0.5,
    slow: 1,
    verySlow: 2,
} as const

export const ANIMATION_DELAYS = {
    none: 0,
    short: 0.1,
    medium: 0.2,
    long: 0.3,
} as const

export const EASING = {
    easeOut: [0.16, 1, 0.3, 1],
    easeInOut: [0.4, 0, 0.2, 1],
    spring: { type: "spring" as const, stiffness: 400, damping: 17 },
    bounce: { type: "spring" as const, stiffness: 300, damping: 10 },
} as const

// Common animation variants
export const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
}

export const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
}

export const scaleIn = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
}

export const slideInRight = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
}

export const slideInLeft = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
}

// Stagger children animations
export const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1,
        },
    },
}

// Hover and tap animations
export const hoverScale = {
    scale: 1.05,
    transition: { duration: ANIMATION_DURATIONS.fast },
}

export const tapScale = {
    scale: 0.98,
    transition: { duration: ANIMATION_DURATIONS.fast },
}

// Button micro-interactions
export const buttonHover = {
    scale: 1.02,
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
    transition: { duration: ANIMATION_DURATIONS.fast },
}

export const buttonTap = {
    scale: 0.98,
    transition: { duration: ANIMATION_DURATIONS.fast },
}

// Card animations
export const cardHover = {
    y: -5,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: { duration: ANIMATION_DURATIONS.normal },
}
