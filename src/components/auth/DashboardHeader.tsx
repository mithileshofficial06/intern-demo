"use client"

import { signOut } from "next-auth/react"
import Link from "next/link"
import { User } from "next-auth"
import { NotificationBell } from "@/components/notifications/NotificationBell"

interface DashboardHeaderProps {
  user: User
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const username = user.name || user.email?.split('@')[0] || 'USER'

  return (
    <div className="flex items-center gap-2.5 sm:gap-3">
      {/* User Tag */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ffe600] text-black border-2 border-black font-mono text-[10px] font-black tracking-wider shadow-[2px_2px_0_#000] shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] animate-pulse" />
        {username.toUpperCase()}
      </div>

      {/* Notification Bell */}
      <NotificationBell />

      {/* Editor Button */}
      <Link
        href="/editor"
        className="px-3 py-1.5 bg-white text-black border-2 border-black text-[10px] font-mono font-black uppercase tracking-widest shadow-[2px_2px_0_#ffe600] hover:shadow-[4px_4px_0_#ffe600] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all text-center shrink-0"
      >
        CONFIG EDITOR
      </Link>

      {/* Sign Out Button */}
      <button
        onClick={async () => {
          await signOut({ redirect: false })
          window.location.href = '/'
        }}
        className="px-3 py-1.5 bg-black text-[#ff2d2d] border-2 border-[#ff2d2d] text-[10px] font-mono font-black uppercase tracking-widest shadow-[2px_2px_0_#ff2d2d] hover:shadow-[4px_4px_0_#ff2d2d] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer shrink-0"
      >
        SIGN OUT
      </button>
    </div>
  )
}
