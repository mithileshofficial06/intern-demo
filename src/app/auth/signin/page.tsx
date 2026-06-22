"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("⚠ INVALID EMAIL OR PASSWORD")
      } else {
        router.push('/editor')
        router.refresh()
      }
    } catch {
      setError("⚠ AN ERROR OCCURRED. PLEASE TRY AGAIN.")
    } finally {
      setLoading(false)
    }
  }

  const handleGitHub = () => {
    signIn("github", { callbackUrl: "/editor" })
  }

  return (
    <div className="min-h-screen bg-black flex flex-col overflow-hidden">
      {/* Background layers */}
      <div className="bg-grain" aria-hidden="true" />
      <div className="bg-scanlines" aria-hidden="true" />
      <div className="bg-grid" aria-hidden="true" />

      {/* Top marquee */}
      <div className="brutal-border bg-[#ffe600] text-black py-2 overflow-hidden border-x-0 border-t-0 shrink-0 relative z-10">
        <div className="flex animate-brutal-marquee w-max gap-10">
          {[...Array(2)].map((_, pass) =>
            ["SIGN IN", "APPFORGE", "BUILD FROM JSON", "NO CODE", "INSTANT DEPLOY", "SCHEMA DRIVEN"].map((item, i) => (
              <span key={`${pass}-${i}`} className="text-xs font-black uppercase tracking-[0.25em] whitespace-nowrap font-mono">
                ★ {item} ★
              </span>
            ))
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md">

          {/* Brand header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block group">
              <span className="text-2xl font-black uppercase tracking-tighter text-white">
                APP<span className="brutal-highlight">FORGE</span>
              </span>
            </Link>
            <div className="mt-4 inline-block relative">
              <h1 className="text-5xl font-black uppercase tracking-tighter text-[#ffe600]">
                SIGN IN
              </h1>
              <span className="animate-brutal-blink text-[#ff2d2d] text-4xl absolute -right-6 bottom-0">_</span>
            </div>
            <p className="mt-3 text-sm font-mono font-bold text-white/50 uppercase tracking-widest">
              // WELCOME BACK
            </p>
          </div>

          {/* Card */}
          <div className="brutal-box brutal-shadow-lg bg-[#0d0d0d] border-[#ffe600]" style={{ borderColor: '#ffe600' }}>

            {/* Card header bar */}
            <div className="flex items-center gap-3 px-5 py-3 border-b-4 border-[#ffe600] bg-black">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff2d2d] border border-[#ffe600]/40" />
                <div className="w-3 h-3 rounded-full bg-[#ffe600] border border-black/40" />
                <div className="w-3 h-3 rounded-full bg-[#0040ff] border border-black/40" />
              </div>
              <span className="font-mono text-xs font-bold text-[#ffe600]/70 tracking-wider">auth.signin</span>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="pulse-dot-green" style={{ width: 6, height: 6 }} />
                <span className="text-[10px] font-black text-[#00ff66] font-mono tracking-wider">SECURE</span>
              </div>
            </div>

            <div className="p-6 space-y-5">

              {/* Error */}
              {error && (
                <div className="brutal-box-red p-3 text-xs font-black uppercase tracking-wide animate-brutal-shake">
                  {error}
                </div>
              )}

              {/* GitHub */}
              <button
                onClick={handleGitHub}
                className="brutal-btn w-full py-4 bg-white text-black text-sm flex items-center justify-center gap-3 hover:bg-[#ffe600] transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.748 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                CONTINUE WITH GITHUB
              </button>

              {/* Divider */}
              <div className="relative flex items-center gap-3">
                <div className="flex-1 border-t-2 border-[#ffe600]/20" />
                <span className="text-xs font-black text-[#ffe600]/50 font-mono bg-[#0d0d0d] px-2">— OR —</span>
                <div className="flex-1 border-t-2 border-[#ffe600]/20" />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-black uppercase tracking-widest mb-2 text-white font-mono">
                    EMAIL
                  </label>
                  <input
                    id="signin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="w-full px-4 py-3 bg-black border-2 border-[#ffe600]/40 font-mono text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#ffe600] transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-black uppercase tracking-widest mb-2 text-white font-mono">
                    PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      id="signin-password"
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      className="w-full px-4 py-3 pr-16 bg-black border-2 border-[#ffe600]/40 font-mono text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#ffe600] transition-colors"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#ffe600]/60 hover:text-[#ffe600] font-mono uppercase tracking-wider transition-colors"
                    >
                      {showPass ? "HIDE" : "SHOW"}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  id="signin-submit"
                  type="submit"
                  disabled={loading}
                  className="brutal-btn w-full py-4 bg-[#ffe600] text-black text-sm font-black uppercase tracking-widest mt-2 disabled:opacity-40"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-brutal-blink">▓</span>
                      SIGNING IN...
                      <span className="animate-brutal-blink">▓</span>
                    </span>
                  ) : (
                    "► SIGN IN"
                  )}
                </button>
              </form>

              {/* Footer links */}
              <div className="pt-2 border-t-2 border-[#ffe600]/10 flex flex-col items-center gap-3">
                <p className="text-sm font-bold font-mono text-white">
                  DON&apos;T HAVE AN ACCOUNT?{" "}
                  <Link
                    href="/auth/signup"
                    className="text-[#ffe600] hover:underline font-black uppercase tracking-wide"
                  >
                    SIGN UP
                  </Link>
                </p>
                <Link
                  href="/"
                  className="text-xs font-black font-mono text-[#ffe600]/70 hover:text-[#ffe600] uppercase tracking-widest transition-colors"
                >
                  ← BACK TO HOME
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom tag */}
          <p className="text-center mt-5 text-[10px] font-mono text-white/20 uppercase tracking-widest">
            APPFORGE — BUILD APPS FROM JSON CONFIG
          </p>
        </div>
      </div>

      {/* Bottom marquee */}
      <div className="brutal-border bg-black text-[#ffe600] py-2 overflow-hidden border-x-0 border-b-0 shrink-0 relative z-10">
        <div className="flex animate-brutal-marquee w-max gap-10" style={{ animationDirection: 'reverse' }}>
          {[...Array(2)].map((_, pass) =>
            ["NO EXCUSES", "JSON ONLY", "ZERO BOILERPLATE", "INSTANT DEPLOY", "NO BACKEND CODE", "RAW POWER"].map((item, i) => (
              <span key={`${pass}-${i}`} className="text-xs font-black uppercase tracking-[0.25em] whitespace-nowrap font-mono">
                ★ {item} ★
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
