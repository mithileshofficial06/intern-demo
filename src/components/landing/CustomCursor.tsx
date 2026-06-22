'use client'

import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const trailRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const mousePos = useRef({ x: 0, y: 0 })
  const cursorPos = useRef({ x: 0, y: 0 })
  const trailPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    // Don't show on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
      if (!visible) setVisible(true)
    }

    const handleMouseLeave = () => setVisible(false)
    const handleMouseEnter = () => setVisible(true)

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    let rafId: number

    const animate = () => {
      // Lerp cursor position
      cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * 0.2
      cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * 0.2

      // Lerp trail position (slower)
      trailPos.current.x += (mousePos.current.x - trailPos.current.x) * 0.08
      trailPos.current.y += (mousePos.current.y - trailPos.current.y) * 0.08

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cursorPos.current.x - 8}px, ${cursorPos.current.y - 8}px)`
      }
      if (trailRef.current) {
        trailRef.current.style.transform = `translate(${trailPos.current.x - 20}px, ${trailPos.current.y - 20}px)`
      }

      rafId = requestAnimationFrame(animate)
    }

    rafId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
      cancelAnimationFrame(rafId)
    }
  }, [visible])

  // Don't render on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null
  }

  return (
    <>
      {/* Trail (larger, more transparent) */}
      <div
        ref={trailRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-screen"
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,230,0,0.15) 0%, transparent 70%)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.3s ease',
          willChange: 'transform',
        }}
        aria-hidden="true"
      />
      {/* Cursor dot */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[10000]"
        style={{
          width: 16,
          height: 16,
          border: '2px solid #ffe600',
          borderRadius: '50%',
          background: 'rgba(255,230,0,0.2)',
          boxShadow: '0 0 10px rgba(255,230,0,0.3)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.3s ease',
          willChange: 'transform',
        }}
        aria-hidden="true"
      />
    </>
  )
}
