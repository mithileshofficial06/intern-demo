'use client'

import { useRef, type MouseEvent } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

const FEATURES = [
  { num: '01', title: 'DYNAMIC FORMS', desc: 'Generated from your schema. No hand-coding.' },
  { num: '02', title: 'CRUD APIs', desc: 'REST endpoints. Wired up automatically.' },
  { num: '03', title: 'ERROR HANDLING', desc: 'Broken schemas? We deal with it.' },
]

const cardVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.4 + i * 0.12,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

function FeatureCard({ feature, index }: { feature: typeof FEATURES[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springX = useSpring(mouseX, { stiffness: 200, damping: 30 })
  const springY = useSpring(mouseY, { stiffness: 200, damping: 30 })

  const handleMouseMove = (e: MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  return (
    <motion.div
      ref={cardRef}
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{
        y: -8,
        scale: 1.02,
        boxShadow: '12px 12px 0 #000',
        transition: { duration: 0.2 },
      }}
      onMouseMove={handleMouseMove}
      className="relative brutal-box p-5 flex gap-5 overflow-hidden group"
      style={{ willChange: 'transform' }}
    >
      {/* Mouse-follow highlight */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(250px circle at var(--mx) var(--my), rgba(255,230,0,0.15), transparent 60%)`,
          // @ts-expect-error CSS custom properties
          '--mx': springX,
          '--my': springY,
        }}
        aria-hidden="true"
      />

      {/* Animated border reveal */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
        style={{
          background: `
            linear-gradient(to right, #ffe600, #ffe600) top left / 0% 3px no-repeat,
            linear-gradient(to bottom, #ffe600, #ffe600) top right / 3px 0% no-repeat,
            linear-gradient(to left, #ffe600, #ffe600) bottom right / 0% 3px no-repeat,
            linear-gradient(to top, #ffe600, #ffe600) bottom left / 3px 0% no-repeat
          `,
          transition: 'all 0.4s ease',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
        style={{
          background: `
            linear-gradient(to right, #ffe600, #ffe600) top left / 100% 3px no-repeat,
            linear-gradient(to bottom, #ffe600, #ffe600) top right / 3px 100% no-repeat,
            linear-gradient(to left, #ffe600, #ffe600) bottom right / 100% 3px no-repeat,
            linear-gradient(to top, #ffe600, #ffe600) bottom left / 3px 100% no-repeat
          `,
          transition: 'all 0.6s ease 0.05s',
        }}
        aria-hidden="true"
      />

      {/* Number */}
      <motion.span
        className="relative z-10 font-mono font-black text-2xl leading-none text-[#ff2d2d] transition-all duration-200 group-hover:text-3xl group-hover:text-[#ff2d2d]"
        layout
      >
        {feature.num}
      </motion.span>

      {/* Content */}
      <div className="relative z-10">
        <h3 className="font-black text-sm tracking-wide">{feature.title}</h3>
        <p className="text-xs font-bold mt-1 opacity-70">{feature.desc}</p>
      </div>
    </motion.div>
  )
}

export default function FeatureCards() {
  return (
    <div className="space-y-4">
      {FEATURES.map((f, i) => (
        <FeatureCard key={f.num} feature={f} index={i} />
      ))}
    </div>
  )
}
