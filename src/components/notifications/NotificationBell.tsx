'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { AppNotification } from '@/lib/notifications'
import { NotificationPanel } from './NotificationPanel'

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [loading, setLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const fetchNotifications = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/notifications')
      if (res.ok) {
        const data = await res.json()
        setNotifications(data.notifications ?? [])
      }
    } catch {
      // silent — bell shouldn't break the UI
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch on mount + auto-refresh every 30s
  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30_000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  // Fetch when panel opens
  useEffect(() => {
    if (open) fetchNotifications()
  }, [open, fetchNotifications])

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleMarkRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
    await fetch(`/api/notifications/${id}`, { method: 'PATCH' })
  }

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    await fetch('/api/notifications/read-all', { method: 'PATCH' })
  }

  const handleDelete = async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    await fetch(`/api/notifications/${id}`, { method: 'DELETE' })
  }

  const handleClearAll = async () => {
    setNotifications([])
    await fetch('/api/notifications/clear', { method: 'DELETE' })
  }

  return (
    <div className="relative shrink-0" ref={containerRef}>
      {/* Bell button */}
      <button
        id="notification-bell-btn"
        onClick={() => setOpen((o) => !o)}
        aria-label={`Notifications — ${unreadCount} unread`}
        className={`relative w-9 h-9 flex items-center justify-center border-2 border-black font-black text-base transition-all
          ${open
            ? 'bg-black text-[#ffe600] shadow-none translate-x-0.5 translate-y-0.5'
            : 'bg-white text-black shadow-[3px_3px_0_#000] hover:shadow-[5px_5px_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5'
          }`}
      >
        🔔
        {unreadCount > 0 && (
          <span
            className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-[9px] font-black border-2 border-black bg-[#ff2d2d] text-white animate-pulse"
            style={{ borderRadius: 0 }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <NotificationPanel
          notifications={notifications}
          loading={loading}
          onMarkRead={handleMarkRead}
          onMarkAllRead={handleMarkAllRead}
          onDelete={handleDelete}
          onClearAll={handleClearAll}
        />
      )}
    </div>
  )
}
