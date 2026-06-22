"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Suspense } from "react"

function ErrorCard() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  let errorTitle = "AUTHENTICATION ERROR"
  let errorMessage = "AN UNKNOWN AUTHENTICATION ERROR OCCURRED. PLEASE TRY AGAIN."

  if (error) {
    const errorUpper = error.toUpperCase()
    if (errorUpper === "CONFIGURATION") {
      errorTitle = "CONFIGURATION ERROR"
      errorMessage = "THERE IS A CONFIGURATION ISSUE. VERIFY THAT AUTH_SECRET IS SET AND OAUTH PROVIDERS ARE CORRECTLY CONFIGURED."
    } else if (errorUpper === "ACCESSDENIED") {
      errorTitle = "ACCESS DENIED"
      errorMessage = "THE SIGN-IN REQUEST WAS DENIED. YOU MIGHT NOT HAVE PERMISSION TO ACCESS THIS APP."
    } else if (errorUpper === "VERIFICATION") {
      errorTitle = "VERIFICATION EXPIRED"
      errorMessage = "THE VERIFICATION LINK HAS EXPIRED OR HAS ALREADY BEEN USED."
    } else if (errorUpper === "OAUTHSIGNIN") {
      errorTitle = "OAUTH INITIALIZATION FAILED"
      errorMessage = "COULD NOT COMMUNICATE WITH GITHUB OAUTH SERVER TO INITIATE SIGN-IN."
    } else if (errorUpper === "OAUTHCALLBACK") {
      errorTitle = "OAUTH CALLBACK FAILED"
      errorMessage = "COULD NOT VERIFY GITHUB SIGN-IN RESPONSE. IT MAY BE EXPIRED OR INVALID."
    } else if (errorUpper === "OAUTHCREATEACCOUNT") {
      errorTitle = "ACCOUNT LINKING FAILED"
      errorMessage = "COULD NOT CREATE OR LINK THE DATABASE RECORD FOR THIS GITHUB ACCOUNT."
    } else if (errorUpper === "OAUTHACCOUNTNOTLINKED") {
      errorTitle = "ACCOUNT LINK REQUIRED"
      errorMessage = "AN ACCOUNT WITH THIS EMAIL ALREADY EXISTS USING EMAIL/PASSWORD. PLEASE LOG IN WITH YOUR PASSWORD."
    } else {
      errorTitle = `${errorUpper} ERROR`
      errorMessage = `AN ERROR OF TYPE '${errorUpper}' OCCURRED DURING THE AUTHENTICATION PROCESS.`
    }
  }

  return (
    <div className="brutal-box brutal-shadow-lg bg-[#0d0d0d] border-[#ff2d2d]" style={{ borderColor: '#ff2d2d' }}>
      {/* Card header bar */}
      <div className="flex items-center gap-3 px-5 py-3 border-b-4 border-[#ff2d2d] bg-black">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff2d2d] border border-black/40" />
          <div className="w-3 h-3 rounded-full bg-[#ffe600] border border-black/40" />
          <div className="w-3 h-3 rounded-full bg-white/20 border border-black/40" />
        </div>
        <span className="font-mono text-xs font-bold text-[#ff2d2d] tracking-wider">auth.error</span>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff2d2d] animate-pulse" />
          <span className="text-[10px] font-black text-[#ff2d2d] font-mono tracking-wider">FAILED</span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="brutal-box-red p-4 text-xs font-mono font-bold leading-relaxed">
          <div className="text-sm font-black mb-2 text-[#ffe600] uppercase tracking-wider">
            SYSTEM DETAILS:
          </div>
          <div>CODE: {error || "UNKNOWN"}</div>
          <div className="mt-2 text-white/90">{errorMessage}</div>
        </div>

        <div className="pt-2 border-t-2 border-[#ff2d2d]/10 flex flex-col items-center gap-3">
          <Link
            href="/auth/signin"
            className="brutal-btn w-full py-4 bg-[#ffe600] text-black text-sm font-black uppercase text-center tracking-widest hover:bg-white transition-colors"
          >
            ► TRY SIGNING IN AGAIN
          </Link>
          <Link
            href="/"
            className="text-xs font-black font-mono text-white/50 hover:text-[#ffe600] uppercase tracking-widest transition-colors mt-2"
          >
            ← BACK TO HOMEPAGE
          </Link>
        </div>
      </div>
    </div>
  )
}

function AuthErrorPageContent() {
  return (
    <div className="min-h-screen bg-black flex flex-col overflow-hidden">
      {/* Background layers */}
      <div className="bg-grain" aria-hidden="true" />
      <div className="bg-scanlines" aria-hidden="true" />
      <div className="bg-grid" aria-hidden="true" />

      {/* Top marquee */}
      <div className="brutal-border bg-[#ff2d2d] text-black py-2 overflow-hidden border-x-0 border-t-0 shrink-0 relative z-10">
        <div className="flex animate-brutal-marquee w-max gap-10">
          {[...Array(2)].map((_, pass) =>
            ["AUTH ERROR", "SECURITY EXCEPTION", "ACCESS DENIED", "VERIFICATION FAILED", "CRITICAL STATUS"].map((item, i) => (
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
              <h1 className="text-5xl font-black uppercase tracking-tighter text-[#ff2d2d]">
                SEC_ERROR
              </h1>
              <span className="animate-brutal-blink text-[#ffe600] text-4xl absolute -right-6 bottom-0">_</span>
            </div>
            <p className="mt-3 text-sm font-mono font-bold text-white/50 uppercase tracking-widest">
              // INTERRUPT IN AUTHENTICATION FLOW
            </p>
          </div>

          <ErrorCard />

          {/* Bottom tag */}
          <p className="text-center mt-5 text-[10px] font-mono text-white/20 uppercase tracking-widest">
            APPFORGE — BUILD APPS FROM JSON CONFIG
          </p>
        </div>
      </div>

      {/* Bottom marquee */}
      <div className="brutal-border bg-black text-[#ff2d2d] py-2 overflow-hidden border-x-0 border-b-0 shrink-0 relative z-10">
        <div className="flex animate-brutal-marquee w-max gap-10" style={{ animationDirection: 'reverse' }}>
          {[...Array(2)].map((_, pass) =>
            ["DO NOT PANIC", "SYSTEM HALTED", "UNAUTHORIZED", "CHECK PERMISSIONS", "CONTACT ADMIN"].map((item, i) => (
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

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center font-mono text-[#ffe600]">
        LOADING SYSTEM CORE...
      </div>
    }>
      <AuthErrorPageContent />
    </Suspense>
  )
}
