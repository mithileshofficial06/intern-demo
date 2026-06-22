'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'

const LINE_1 = 'BUILD APPS'
const LINE_2 = 'FROM CONFIG'

function GlitchText({ text, delay = 0 }: { text: string; delay?: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return
    const letters = containerRef.current.querySelectorAll('.hero-letter')

    // Initial entrance animation
    gsap.fromTo(
      letters,
      { opacity: 0, y: 30, rotateX: -90 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.6,
        stagger: 0.04,
        delay,
        ease: 'power3.out',
      }
    )

    // Subtle continuous float
    letters.forEach((letter, i) => {
      gsap.to(letter, {
        y: -2,
        duration: 2 + Math.random() * 1.5,
        delay: i * 0.1,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
    })
  }, [delay])

  const handleHover = useCallback(() => {
    if (!containerRef.current) return
    setIsHovered(true)
    const letters = containerRef.current.querySelectorAll('.hero-letter')

    // Glitch effect on hover
    letters.forEach((letter) => {
      const el = letter as HTMLElement
      const tl = gsap.timeline()
      tl.to(el, {
        skewX: Math.random() * 20 - 10,
        x: Math.random() * 6 - 3,
        color: Math.random() > 0.5 ? '#ff2d2d' : '#00ff66',
        textShadow: '2px 0 #ff2d2d, -2px 0 #0040ff',
        duration: 0.05,
      })
        .to(el, {
          skewX: 0,
          x: 0,
          color: 'inherit',
          textShadow: 'none',
          duration: 0.05,
          delay: 0.05,
        })
    })

    setTimeout(() => setIsHovered(false), 300)
  }, [])

  return (
    <div
      ref={containerRef}
      className="inline-block"
      onMouseEnter={handleHover}
      style={{ perspective: '500px' }}
      aria-label={text}
    >
      {text.split('').map((char, i) => (
        <span
          key={i}
          className={`hero-letter inline-block ${char === ' ' ? 'w-[0.3em]' : ''} ${isHovered ? 'select-none' : ''}`}
          style={{ willChange: 'transform, opacity' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </div>
  )
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={sectionRef} className="relative z-10 flex-1 p-8 lg:p-12 flex flex-col justify-center">
      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-xs font-black uppercase tracking-[0.3em] mb-6 font-mono text-black/70"
      >
        {'// NO CODE REQUIRED'}
      </motion.p>

      {/* Hero Title */}
      <h1 className="text-4xl sm:text-5xl xl:text-7xl font-black leading-[0.92] tracking-tighter uppercase">
        <GlitchText text={LINE_1} delay={0.2} />
        <br />
        <span className="inline-flex items-baseline gap-2">
          <GlitchText text={LINE_2} delay={0.5} />
          <span className="animate-brutal-blink text-[#ff2d2d] text-3xl sm:text-4xl xl:text-5xl">_</span>
        </span>
      </h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-6 text-base lg:text-lg font-bold max-w-md leading-snug text-black/80"
      >
        Paste JSON. Get forms, tables, APIs. Done.{' '}
        <span className="text-black/50">No frameworks. No nonsense.</span>
      </motion.p>
    </div>
  )
}
