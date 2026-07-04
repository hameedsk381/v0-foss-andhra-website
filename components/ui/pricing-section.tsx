"use client"

// Adapted from 21st.dev "Pricing Section" by YadHakim (21st.dev/@dev.yadhakim)
// Re-themed to the FOSS Andhra design system: INR annual pricing, primary-blue
// popular tier, no billing toggle (memberships are annual only).

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Check, Star, ArrowRight } from "lucide-react"

export interface PricingTier {
  id: string
  name: string
  description: string
  price: string
  period?: string
  features: string[]
  cta: string
  popular?: boolean
  badge?: string
}

interface PricingSectionProps {
  title?: string
  subtitle?: string
  tiers: PricingTier[]
  onSelect?: (tierId: string) => void
  className?: string
}

export function PricingSection({
  title,
  subtitle,
  tiers,
  onSelect,
  className,
}: PricingSectionProps) {
  return (
    <section className={cn("w-full max-w-5xl mx-auto", className)}>
      {(title || subtitle) && (
        <div className="text-center mb-10">
          {title && (
            <motion.h2
              className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {title}
            </motion.h2>
          )}
          {subtitle && (
            <motion.p
              className="text-muted-foreground text-base md:text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-0">
        {tiers.map((tier, i) => (
          <motion.div
            key={tier.id}
            className={cn(
              "relative flex flex-col rounded-2xl border bg-card p-6 md:p-8",
              tier.popular
                ? "border-primary shadow-xl z-10 md:-my-4 md:py-12"
                : "border-border",
              i === 0 && "md:rounded-r-none",
              i === 1 && tier.popular && "md:rounded-2xl",
              i === 2 && "md:rounded-l-none"
            )}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {tier.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide uppercase bg-primary text-white px-3 py-1 rounded-full">
                  <Star className="size-3 fill-current" />
                  {tier.badge}
                </span>
              </div>
            )}

            <div className="mb-6">
              <h3 className="font-display text-lg font-bold text-foreground">{tier.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{tier.description}</p>
            </div>

            <div className="mb-6 flex items-baseline gap-1">
              <span className="font-display text-4xl font-extrabold tracking-tight text-foreground">
                {tier.price}
              </span>
              {tier.period && (
                <span className="text-sm text-muted-foreground">{tier.period}</span>
              )}
            </div>

            <button
              onClick={() => onSelect?.(tier.id)}
              className={cn(
                "w-full rounded-xl py-2.5 text-sm font-semibold transition-all",
                tier.popular
                  ? "bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20"
                  : "bg-muted text-foreground hover:bg-muted/80 border border-border"
              )}
            >
              <span className="flex items-center justify-center gap-2">
                {tier.cta}
                <ArrowRight className="size-3.5" />
              </span>
            </button>

            <div className="h-px bg-border my-6" />

            <ul className="space-y-3 flex-1">
              {tier.features.map((feature, fi) => (
                <motion.li
                  key={feature}
                  className="flex items-start gap-2.5"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.08 + fi * 0.05 }}
                >
                  <Check className="size-4 mt-0.5 shrink-0 text-primary" />
                  <span className="text-sm text-foreground">{feature}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
