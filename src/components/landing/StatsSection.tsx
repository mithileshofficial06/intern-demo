'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

interface StatItem {
  target: string
  label: string
  isNumber: boolean
  numericTarget?: number
  prefix?: string
  suffix?: string
}

const STATS: StatItem[] = [
  { target: '0', label: 'LOC', isNumber: true, numericTarget: 0 },
  { target: '<1s', label: 'BUILD', isNumber: false, prefix: '<', numericTarget: 1, suffix: 's' },
  { target: '99%', label: 'UP', isNumber: true, numericTarget: 99, suffix: '%' },
]

function AnimatedCounter({
  stat,
  shouldAnimate,
  delay = 0,
}: {
  stat: StatItem
  shouldAnimate: boolean
  delay?: number
}) {
  const [displayVal, setDisplayVal] = useState('0')
  const [hasPulsed, setHasPulsed] = useState(false)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!shouldAnimate || hasAnimated.current) return
    hasAnimated.current = true

    const target = stat.numericTarget ?? 0
    const duration = 1500
    const startTime = performance.now() + delay

    if (target === 0) {
      setTimeout(() => {
        setDisplayVal('0')
        setHasPulsed(true)
      }, delay)
      return
    }

    const animate = (now: number) => {
      if (now < startTime) {
        requestAnimationFrame(animate)
        return
      }

      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(eased * target)

      setDisplayVal(String(current))

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setHasPulsed(true)
      }
    }

    requestAnimationFrame(animate)
  }, [shouldAnimate, stat.numericTarget, delay])

  const formatted = stat.isNumber
    ? `${stat.prefix ?? ''}${displayVal}${stat.suffix ?? ''}`
    : `${stat.prefix ?? ''}${displayVal}${stat.suffix ?? ''}`

  return (
    <div className={`text-2xl lg:text-3xl font-black font-mono transition-transform duration-300 ${hasPulsed ? 'scale-100' : 'scale-95'}`}>
      {formatted}
      {hasPulsed && (
        <motion.span
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="inline"
        />
      )}
    </div>
  )
}

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="grid grid-cols-3 gap-0 brutal-border bg-black text-[#ffe600]"
    >
      {STATS.map((s, i) => (
        <div
          key={s.label}
          className={`p-4 text-center ${i < 2 ? 'border-r-4 border-[#ffe600]' : ''}`}
        >
          <AnimatedCounter stat={s} shouldAnimate={isInView} delay={i * 200} />
          <div className="text-[10px] font-black tracking-widest mt-1 opacity-70">
            {s.label}
          </div>
        </div>
      ))}
    </motion.div>
  )
}
