"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"
import { User } from "next-auth"
import { LogOut, User as UserIcon, LayoutDashboard } from "lucide-react"
import Link from "next/link"

interface UserMenuProps {
  user: User
}

export function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      {/* User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-3 border-4 border-black hover:border-purple-600 hover:bg-purple-50 transition-all"
      >
        {user.image ? (
          <img
            src={user.image}
            alt={user.name || "User"}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-black">
            {user.name?.[0] || user.email?.[0] || "U"}
          </div>
        )}
        <span className="font-black text-sm hidden sm:block">
          {user.name || user.email}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 mt-2 w-64 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-20">
            <div className="p-4 border-b-4 border-black">
              <p className="font-black text-sm uppercase tracking-tight">
                {user.name || "User"}
              </p>
              <p className="text-xs text-gray-600 font-mono">
                {user.email}
              </p>
            </div>

            <div className="p-2">
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 hover:bg-purple-50 font-bold uppercase text-sm tracking-tight transition-all"
              >
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </Link>

              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 hover:bg-purple-50 font-bold uppercase text-sm tracking-tight transition-all"
              >
                <UserIcon className="w-5 h-5" />
                Create App
              </Link>

              <button
                onClick={() => {
                  setIsOpen(false)
                  signOut({ callbackUrl: "/" })
                }}
                className="w-full flex items-center gap-3 p-3 hover:bg-red-50 hover:text-red-600 font-bold uppercase text-sm tracking-tight transition-all text-left"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
