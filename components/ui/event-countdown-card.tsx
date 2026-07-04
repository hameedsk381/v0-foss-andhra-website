"use client"

// Adapted from 21st.dev "Event Countdown Card" by isaiahbjork
// (21st.dev/@isaiahbjork). Re-themed: flat primary CTA, local default image,
// existing button variants, Variants typing.

import { useEffect, useState } from "react"
import { motion, useReducedMotion, type Variants } from "framer-motion"
import { buttonVariants } from "@/components/ui/button"
import { Calendar, Clock, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface EventCountdownCardProps {
  title: string
  date: Date
  image?: string | null
  attendees?: number
  ctaLabel?: string
  onJoin?: () => void
  className?: string
}

export function EventCountdownCard({
  title,
  date,
  image,
  attendees,
  ctaLabel,
  onJoin,
  className,
}: EventCountdownCardProps) {
  const [timeLeft, setTimeLeft] = useState(() =>
    Math.max(0, Math.floor((+date - Date.now()) / 1000))
  )
  const shouldReduceMotion = useReducedMotion()
  const shouldAnimate = !shouldReduceMotion

  useEffect(() => {
    const update = () =>
      setTimeLeft(Math.max(0, Math.floor((+date - Date.now()) / 1000)))
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [date])

  const days = Math.floor(timeLeft / 86400)
  const hours = Math.floor((timeLeft % 86400) / 3600)
  const minutes = Math.floor((timeLeft % 3600) / 60)
  const seconds = timeLeft % 60

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.95, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.8,
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
    hover: shouldAnimate
      ? {
          scale: 1.02,
          y: -5,
          transition: { type: "spring", stiffness: 300, damping: 30, mass: 0.8 },
        }
      : {},
  }

  const childVariants: Variants = {
    hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 400, damping: 28, mass: 0.6 },
    },
  }

  const pulseVariants: Variants = {
    initial: { scale: 1, opacity: 1 },
    pulse: shouldAnimate
      ? {
          scale: [1, 1.12, 1],
          opacity: [1, 0.75, 1],
          transition: { duration: 1, repeat: Infinity, ease: "easeInOut" },
        }
      : {},
  }

  return (
    <motion.div
      initial={shouldAnimate ? "hidden" : "visible"}
      animate="visible"
      whileHover="hover"
      variants={containerVariants}
      className={cn(
        "relative w-full max-w-sm rounded-2xl border border-white/15 bg-white/[0.07] backdrop-blur-md text-white overflow-hidden shadow-2xl",
        className
      )}
    >
      {/* Image */}
      <motion.div className="relative overflow-hidden" variants={childVariants}>
        <motion.img
          src={image || "/stock/hackathon.jpg"}
          alt={title}
          className="h-44 w-full object-cover"
          initial={{ scale: 1 }}
          whileHover={shouldAnimate ? { scale: 1.08 } : {}}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#04122b]/70 via-transparent to-transparent" />
        {timeLeft > 0 && timeLeft < 86400 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-4 right-4 bg-white text-primary px-3 py-1 rounded-full text-xs font-bold"
          >
            Starts soon!
          </motion.div>
        )}
      </motion.div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <motion.div className="space-y-2" variants={childVariants}>
          <h3 className="font-display text-xl font-bold leading-tight tracking-tight line-clamp-2">
            {title}
          </h3>
          <div className="flex items-center gap-4 text-sm text-white/60">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>
                {date.toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            {typeof attendees === "number" && attendees > 0 && (
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{attendees} attending</span>
              </div>
            )}
          </div>
        </motion.div>

        {timeLeft > 0 ? (
          <motion.div className="space-y-3" variants={childVariants}>
            <div className="flex items-center gap-1 text-sm font-medium text-white/60">
              <Clock className="w-4 h-4" />
              <span>Starts in</span>
            </div>
            <div className="grid grid-cols-4 gap-2.5">
              {[
                { value: days, label: "Days" },
                { value: hours, label: "Hrs" },
                { value: minutes, label: "Min" },
                { value: seconds, label: "Sec" },
              ].map((unit, index) => (
                <motion.div
                  key={unit.label}
                  variants={index === 3 ? pulseVariants : undefined}
                  initial="initial"
                  animate={index === 3 ? "pulse" : "initial"}
                  className="bg-white/10 rounded-xl p-2.5 text-center border border-white/10"
                >
                  <div className="text-lg font-bold tabular-nums">
                    {unit.value.toString().padStart(2, "0")}
                  </div>
                  <div className="text-[11px] text-white/55 font-medium">{unit.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div variants={childVariants} className="text-center py-3">
            <div className="text-lg font-bold">Happening now</div>
            <div className="text-sm text-white/60">Join in to participate</div>
          </motion.div>
        )}

        <motion.button
          onClick={onJoin}
          variants={childVariants}
          whileHover={shouldAnimate ? { scale: 1.03, y: -2 } : {}}
          whileTap={shouldAnimate ? { scale: 0.97 } : {}}
          className={cn(
            buttonVariants({ variant: "default" }),
            "w-full h-11 font-semibold rounded-xl bg-white text-primary hover:bg-white/90 shadow-lg"
          )}
        >
          {ctaLabel || (timeLeft > 0 ? "Reserve your spot" : "Join event")}
        </motion.button>
      </div>
    </motion.div>
  )
}
