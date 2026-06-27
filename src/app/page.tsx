'use client'

import { useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, type Variants } from 'framer-motion'

import BackgroundEffects from '@/components/landing/BackgroundEffects'
import BrutalMarquee from '@/components/landing/BrutalMarquee'
import HeroSection from '@/components/landing/HeroSection'
import FeatureCards from '@/components/landing/FeatureCards'
import StatsSection from '@/components/landing/StatsSection'
import QuickStartTemplates from '@/components/landing/QuickStartTemplates'

// ── Animation variants ──────────────────────────────────────────
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

const fadeSlideUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
}

// ── Sign-In panel ────────────────────────────────────────────────
function SignInPanel() {
  const router = useRouter()
  const [tab, setTab] = useState<'signin' | 'signup'>('signin')

  // Signin state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [signinError, setSigninError] = useState('')
  const [signinLoading, setSigninLoading] = useState(false)

  // Signup state
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '', confirm: '' })
  const [signupError, setSignupError] = useState('')
  const [signupLoading, setSignupLoading] = useState(false)

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault()
    setSigninError('')
    setSigninLoading(true)
    try {
      const result = await signIn('credentials', { email, password, redirect: false })
      if (result?.error) {
        setSigninError('⚠ INVALID EMAIL OR PASSWORD')
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch {
      setSigninError('⚠ AN ERROR OCCURRED. TRY AGAIN.')
    } finally {
      setSigninLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setSignupError('')
    if (signupData.password !== signupData.confirm) {
      setSignupError('⚠ PASSWORDS DO NOT MATCH')
      return
    }
    if (signupData.password.length < 8) {
      setSignupError('⚠ PASSWORD MUST BE AT LEAST 8 CHARS')
      return
    }
    setSignupLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: signupData.name, email: signupData.email, password: signupData.password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setSignupError(`⚠ ${(data.error || 'REGISTRATION FAILED').toUpperCase()}`)
        return
      }
      const result = await signIn('credentials', { email: signupData.email, password: signupData.password, redirect: false })
      if (result?.error) {
        setTab('signin')
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch {
      setSignupError('⚠ AN ERROR OCCURRED. TRY AGAIN.')
    } finally {
      setSignupLoading(false)
    }
  }

  const handleGitHub = () => signIn('github', { callbackUrl: '/dashboard' })

  const passwordsMatch = signupData.confirm.length > 0 && signupData.password === signupData.confirm

  const inputCls = 'w-full px-4 py-3 bg-black border-2 border-[#ffe600]/40 font-mono text-sm text-white placeholder-white/45 focus:outline-none focus:border-[#ffe600] transition-colors'

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] as const }}
      className="relative w-full lg:w-[42%] xl:w-[40%] bg-[#0d0d0d] flex flex-col"
    >
      <div className="absolute inset-0 brutal-checker pointer-events-none opacity-30" />

      <div className="relative z-10 flex flex-col h-full p-6 lg:p-10 xl:p-12 justify-center">

        {/* Panel title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-1">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-[#ffe600]/60 font-mono">{'>'} AUTH.PORTAL</span>
            <span className="flex items-center gap-1.5">
              <span className="pulse-dot-green" style={{ width: 6, height: 6 }} />
              <span className="text-[10px] font-black text-[#00ff66] font-mono tracking-wider">SECURE</span>
            </span>
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white">
            {tab === 'signin' ? 'SIGN IN' : 'SIGN UP'}
            <span className="animate-brutal-blink text-[#ffe600] ml-1">_</span>
          </h2>
        </motion.div>

        {/* Card */}
        <div className="brutal-box flex flex-col" style={{ borderColor: '#ffe600' }}>

          {/* Card titlebar */}
          <div className="flex items-center gap-3 px-4 py-2.5 border-b-4 border-[#ffe600] bg-black shrink-0">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff2d2d]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#ffe600]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#0040ff]" />
            </div>
            {/* Tabs */}
            <div className="flex gap-1 ml-2">
              <button
                onClick={() => { setTab('signin'); setSigninError('') }}
                className={`px-3 py-1 text-[10px] font-black uppercase font-mono tracking-wider transition-colors ${
                  tab === 'signin' ? 'bg-[#ffe600] text-black' : 'text-[#ffe600]/50 hover:text-[#ffe600]'
                }`}
              >
                SIGN IN
              </button>
              <button
                onClick={() => { setTab('signup'); setSignupError('') }}
                className={`px-3 py-1 text-[10px] font-black uppercase font-mono tracking-wider transition-colors ${
                  tab === 'signup' ? 'bg-[#00ff66] text-black' : 'text-[#ffe600]/50 hover:text-[#ffe600]'
                }`}
              >
                SIGN UP
              </button>
            </div>
          </div>

          <div className="p-5 space-y-4">

            {/* Error */}
            {(signinError || signupError) && (
              <div className="brutal-box-red p-3 text-[11px] font-black uppercase tracking-wide animate-brutal-shake">
                {tab === 'signin' ? signinError : signupError}
              </div>
            )}

            {/* GitHub */}
            <button
              onClick={handleGitHub}
              className="brutal-btn w-full py-3 bg-white text-black text-xs flex items-center justify-center gap-2.5 hover:bg-[#ffe600] transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.748 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              CONTINUE WITH GITHUB
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 border-t border-black/25" />
              <span className="text-[10px] font-black text-black/80 font-mono">— OR —</span>
              <div className="flex-1 border-t border-black/25" />
            </div>

            {/* ── SIGN IN FORM ── */}
            {tab === 'signin' && (
              <form onSubmit={handleSignin} className="space-y-3">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest mb-1.5 text-black font-mono">EMAIL</label>
                  <input id="home-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" className={inputCls} placeholder="your@email.com" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest mb-1.5 text-black font-mono">PASSWORD</label>
                  <div className="relative">
                    <input id="home-password" type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" className={`${inputCls} pr-14`} placeholder="••••••••" />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-[#ffe600]/85 hover:text-[#ffe600] font-mono uppercase transition-colors">{showPass ? 'HIDE' : 'SHOW'}</button>
                  </div>
                </div>
                <button id="home-signin-btn" type="submit" disabled={signinLoading} className="brutal-btn w-full py-3.5 bg-[#ffe600] text-black text-xs font-black uppercase tracking-widest disabled:opacity-40 mt-1">
                  {signinLoading ? <span className="flex items-center justify-center gap-2"><span className="animate-brutal-blink">▓</span>SIGNING IN...<span className="animate-brutal-blink">▓</span></span> : '► SIGN IN'}
                </button>
              </form>
            )}

            {/* ── SIGN UP FORM ── */}
            {tab === 'signup' && (
              <form onSubmit={handleSignup} className="space-y-3">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest mb-1.5 text-black font-mono">NAME <span className="text-black/50 normal-case">(opt)</span></label>
                  <input type="text" value={signupData.name} onChange={e => setSignupData(p => ({ ...p, name: e.target.value }))} autoComplete="name" className={inputCls} placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest mb-1.5 text-black font-mono">EMAIL <span className="text-[#ff2d2d]">*</span></label>
                  <input type="email" value={signupData.email} onChange={e => setSignupData(p => ({ ...p, email: e.target.value }))} required autoComplete="email" className={inputCls} placeholder="your@email.com" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest mb-1.5 text-black font-mono">PASSWORD <span className="text-[#ff2d2d]">*</span></label>
                  <div className="relative">
                    <input type={showPass ? 'text' : 'password'} value={signupData.password} onChange={e => setSignupData(p => ({ ...p, password: e.target.value }))} required autoComplete="new-password" className={`${inputCls} pr-14`} placeholder="min 8 chars" />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-white/60 hover:text-white font-mono uppercase transition-colors">{showPass ? 'HIDE' : 'SHOW'}</button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest mb-1.5 font-mono flex items-center gap-2">
                    <span className="text-black">CONFIRM <span className="text-[#ff2d2d]">*</span></span>
                    {signupData.confirm.length > 0 && (
                      <span className={`text-[9px] font-black ${passwordsMatch ? 'text-[#00ff66]' : 'text-[#ff2d2d]'}`}>
                        {passwordsMatch ? '✓ MATCH' : '✗ MISMATCH'}
                      </span>
                    )}
                  </label>
                  <input type={showPass ? 'text' : 'password'} value={signupData.confirm} onChange={e => setSignupData(p => ({ ...p, confirm: e.target.value }))} required autoComplete="new-password"
                    className={`w-full px-4 py-3 bg-black border-2 font-mono text-sm text-white placeholder-white/45 focus:outline-none transition-colors ${
                      signupData.confirm.length > 0 ? passwordsMatch ? 'border-[#00ff66]' : 'border-[#ff2d2d]' : 'border-black focus:border-black/70'
                    }`}
                    placeholder="••••••••"
                  />
                </div>
                <button type="submit" disabled={signupLoading} className="brutal-btn w-full py-3.5 bg-[#00ff66] text-black text-xs font-black uppercase tracking-widest disabled:opacity-40 mt-1">
                  {signupLoading ? <span className="flex items-center justify-center gap-2"><span className="animate-brutal-blink">▓</span>CREATING...<span className="animate-brutal-blink">▓</span></span> : '► CREATE ACCOUNT'}
                </button>
              </form>
            )}

            {/* Footer */}
            <p className="text-center text-[11px] font-mono text-black uppercase tracking-wider pt-1">
              {tab === 'signin' ? (
                <>NO ACCOUNT? <button onClick={() => setTab('signup')} className="text-black font-black hover:underline cursor-pointer">SIGN UP</button></>
              ) : (
                <>HAVE ACCOUNT? <button onClick={() => setTab('signin')} className="text-black font-black hover:underline cursor-pointer">SIGN IN</button></>
              )}
            </p>
          </div>
        </div>

        {/* Bottom caption */}
        <p className="mt-4 text-[9px] font-mono text-white/20 uppercase tracking-widest text-center">
          APPFORGE — BUILD APPS FROM JSON CONFIG
        </p>
      </div>
    </motion.div>
  )
}

// ── Main page ────────────────────────────────────────────────────
export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Auto-redirect if already logged in
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [status, router])

  // Show loading while checking auth
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-[#ffe600] text-xl font-black uppercase animate-brutal-blink">
          LOADING...
        </div>
      </div>
    )
  }

  // Will redirect if authenticated
  if (status === 'authenticated') {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <BackgroundEffects />
      <BrutalMarquee />

      <div className="flex flex-col lg:flex-row flex-1 min-h-0">

        {/* ── LEFT: Yellow branding panel ── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative w-full lg:w-[58%] xl:w-[60%] bg-[#ffe600] brutal-border border-t-0 border-l-0 border-b-0 flex flex-col"
        >
          <div className="absolute inset-0 brutal-checker pointer-events-none" />

          {/* Header */}
          <motion.header
            variants={fadeSlideUp}
            className="relative z-10 p-6 lg:p-8 border-b-4 border-black"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-black tracking-tighter leading-none">
                  APP<span className="brutal-highlight">FORGE</span>
                </h1>
              </div>
              <div className="brutal-box bg-black text-[#ffe600] px-3 py-2 text-xs font-mono font-bold leading-tight text-right">
                JSON<br />→ APP
              </div>
            </div>
          </motion.header>

          {/* Hero */}
          <HeroSection />

          {/* Features */}
          <motion.div variants={fadeSlideUp} className="relative z-10 px-8 lg:px-12">
            <FeatureCards />
          </motion.div>

          {/* Stats */}
          <motion.div variants={fadeSlideUp} className="relative z-10 px-8 lg:px-12 mt-8">
            <StatsSection />
          </motion.div>

          {/* Quick Start */}
          <motion.div variants={fadeSlideUp} className="relative z-10 px-8 lg:px-12 mt-8 pb-8">
            <QuickStartTemplates activeTemplate="" onSelect={() => {}} />
          </motion.div>

          {/* Footer */}
          <footer className="relative z-10 p-6 border-t-4 border-black bg-black text-[#ffe600] mt-auto">
            <p className="text-xs font-black uppercase tracking-widest font-mono flex items-center gap-2">
              <span className="pulse-dot-green" style={{ width: 6, height: 6 }} />
              SIGN IN TO START BUILDING
            </p>
          </footer>
        </motion.div>

        {/* ── RIGHT: Auth panel ── */}
        <SignInPanel />
      </div>

      <BrutalMarquee />
    </div>
  )
}
