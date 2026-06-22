"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"

export function AuthHeader() {
  const { data: session, status } = useSession()

  if (status === "loading") return null

  if (session?.user) {
    const username = session.user.name || session.user.email?.split('@')[0] || 'USER'
    
    return (
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* User Tag */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-[#ffe600] text-black border-2 border-black font-mono text-[10px] font-black tracking-wider shadow-[2px_2px_0_#000]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] animate-pulse" />
          {username.toUpperCase()}
        </div>

        {/* Dashboard Button */}
        <Link
          href="/dashboard"
          className="px-3 py-1.5 bg-white text-black border-2 border-black text-[10px] font-mono font-black uppercase tracking-widest shadow-[2px_2px_0_#ffe600] hover:shadow-[4px_4px_0_#ffe600] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all"
        >
          DASHBOARD
        </Link>

        {/* Sign Out Button */}
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="px-3 py-1.5 bg-black text-[#ff2d2d] border-2 border-[#ff2d2d] text-[10px] font-mono font-black uppercase tracking-widest shadow-[2px_2px_0_#ff2d2d] hover:shadow-[4px_4px_0_#ff2d2d] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
        >
          SIGN OUT
        </button>
      </div>
    )
  }

  // Unauthenticated — show simple link to home/login
  return (
    <div>
      <Link
        href="/"
        className="px-3 py-1.5 bg-[#ffe600] text-black border-2 border-black text-[10px] font-mono font-black uppercase tracking-widest shadow-[2px_2px_0_#000] hover:shadow-[4px_4px_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all"
      >
        ← SIGN IN
      </Link>
    </div>
  )
}
