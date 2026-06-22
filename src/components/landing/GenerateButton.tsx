'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MagneticButton from './MagneticButton'

const BUILD_STEPS = [
  'Parsing Schema',
  'Generating Models',
  'Building Forms',
  'Creating APIs',
  'Deploying',
]

interface GenerateButtonProps {
  onGenerate: () => Promise<void>
  disabled: boolean
  loading: boolean
}

export default function GenerateButton({
  onGenerate,
  disabled,
  loading,
}: GenerateButtonProps) {
  const [buildPhase, setBuildPhase] = useState<'idle' | 'building' | 'success'>('idle')
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [activeStep, setActiveStep] = useState(-1)
  const [progress, setProgress] = useState(0)

  const handleClick = useCallback(async () => {
    if (disabled || loading || buildPhase !== 'idle') return

    setBuildPhase('building')
    setCompletedSteps([])
    setActiveStep(0)
    setProgress(0)

    // Animate through build steps
    for (let i = 0; i < BUILD_STEPS.length; i++) {
      setActiveStep(i)
      setProgress(((i + 0.5) / BUILD_STEPS.length) * 100)

      await new Promise((r) => setTimeout(r, 400 + Math.random() * 200))

      setCompletedSteps((prev) => [...prev, i])
      setProgress(((i + 1) / BUILD_STEPS.length) * 100)
    }

    // Show success briefly
    setBuildPhase('success')
    await new Promise((r) => setTimeout(r, 800))

    // Actually submit
    try {
      await onGenerate()
    } catch {
      // Error handling is done in the parent
    }

    // Reset state
    setBuildPhase('idle')
    setCompletedSteps([])
    setActiveStep(-1)
    setProgress(0)
  }, [disabled, loading, buildPhase, onGenerate])

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="space-y-3"
    >
      {/* Build sequence */}
      <AnimatePresence>
        {buildPhase === 'building' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="brutal-box bg-black text-[#ffe600] p-4 overflow-hidden"
          >
            <div className="space-y-2">
              {BUILD_STEPS.map((step, i) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{
                    opacity: i <= activeStep ? 1 : 0.2,
                    x: i <= activeStep ? 0 : -20,
                  }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="flex items-center gap-2 font-mono text-xs font-bold"
                >
                  <AnimatePresence mode="wait">
                    {completedSteps.includes(i) ? (
                      <motion.span
                        key="done"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="text-[#00ff66] w-5 text-center"
                      >
                        ✓
                      </motion.span>
                    ) : i === activeStep ? (
                      <motion.span
                        key="active"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity }}
                        className="text-[#ffe600] w-5 text-center"
                      >
                        ▸
                      </motion.span>
                    ) : (
                      <span className="text-[#ffe600]/20 w-5 text-center">○</span>
                    )}
                  </AnimatePresence>
                  <span
                    className={
                      completedSteps.includes(i)
                        ? 'text-[#00ff66]'
                        : i === activeStep
                        ? 'text-[#ffe600]'
                        : 'text-[#ffe600]/20'
                    }
                  >
                    {step}
                    {i === activeStep && !completedSteps.includes(i) ? '...' : ''}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="mt-3 h-1.5 bg-[#ffe600]/10 overflow-hidden">
              <motion.div
                className="h-full bg-[#ffe600]"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success state */}
      <AnimatePresence>
        {buildPhase === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="brutal-box bg-[#00ff66] text-black p-4 text-center"
          >
            <div className="font-black text-sm uppercase tracking-wider font-mono">
              ✓ BUILD COMPLETE — LAUNCHING APP
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button */}
      <MagneticButton strength={0.15} disabled={disabled || buildPhase !== 'idle'}>
        <motion.button
          onClick={handleClick}
          disabled={disabled || loading || buildPhase !== 'idle'}
          whileHover={
            !disabled && buildPhase === 'idle'
              ? {
                  scale: 1.03,
                  boxShadow: '10px 10px 0 #000, 0 0 30px rgba(255,45,45,0.3)',
                }
              : undefined
          }
          whileTap={!disabled ? { scale: 0.97 } : undefined}
          className="brutal-btn w-full py-5 text-lg bg-[#ff2d2d] text-white group relative overflow-hidden"
        >
          {/* Glow effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

          <span className="relative z-10 flex items-center justify-center gap-2">
            {buildPhase === 'building' ? (
              <>▓▓▓ GENERATING... ▓▓▓</>
            ) : buildPhase === 'success' ? (
              <>✓ DONE</>
            ) : (
              <>
                ► GENERATE APP{' '}
                <motion.span
                  className="inline-block"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  →
                </motion.span>
              </>
            )}
          </span>
        </motion.button>
      </MagneticButton>

      <p className="text-center text-[11px] font-black uppercase tracking-widest opacity-40 font-mono">
        Broken schemas · Missing fields · Invalid values — WE HANDLE IT
      </p>
    </motion.div>
  )
}
