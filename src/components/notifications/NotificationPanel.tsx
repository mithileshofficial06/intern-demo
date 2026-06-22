'use client'

import { useState, useCallback } from 'react'
import { AppNotification } from '@/lib/notifications'
import { NotificationItem } from './NotificationItem'

type FilterType = 'all' | 'unread' | 'success' | 'error' | 'info' | 'warning'

interface NotificationPanelProps {
  notifications: AppNotification[]
  loading: boolean
  onMarkRead: (id: string) => void
  onMarkAllRead: () => void
  onDelete: (id: string) => void
  onClearAll: () => void
}

const FILTERS: { label: string; value: FilterType }[] = [
  { label: 'ALL', value: 'all' },
  { label: 'UNREAD', value: 'unread' },
  { label: '✓', value: 'success' },
  { label: '⚠', value: 'error' },
  { label: 'ℹ', value: 'info' },
  { label: '⚡', value: 'warning' },
]

export function NotificationPanel({
  notifications,
  loading,
  onMarkRead,
  onMarkAllRead,
  onDelete,
  onClearAll,
}: NotificationPanelProps) {
  const [filter, setFilter] = useState<FilterType>('all')

  const filtered = useCallback(() => {
    if (filter === 'all') return notifications
    if (filter === 'unread') return notifications.filter((n) => !n.read)
    return notifications.filter((n) => n.type === filter)
  }, [notifications, filter])()

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div
      className="absolute right-0 top-full mt-2 w-80 z-50 border-4 border-black"
      style={{ boxShadow: '8px 8px 0 #000', background: '#fff', minHeight: 200 }}
    >
      {/* Header */}
      <div className="bg-[#ffe600] border-b-4 border-black px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-widest">🔔 NOTIFICATIONS</span>
          {unreadCount > 0 && (
            <span className="bg-black text-[#ffe600] text-[9px] font-black px-1.5 py-0.5 font-mono">
              {unreadCount} NEW
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="text-[9px] font-black uppercase border-2 border-black px-1.5 py-0.5 bg-white hover:bg-black hover:text-[#ffe600] transition-colors"
            >
              READ ALL
            </button>
          )}
          <button
            onClick={onClearAll}
            className="text-[9px] font-black uppercase border-2 border-black px-1.5 py-0.5 bg-white hover:bg-[#ff2d2d] hover:text-white transition-colors"
          >
            CLEAR
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex border-b-4 border-black overflow-x-auto">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-2.5 py-1.5 text-[9px] font-black uppercase tracking-widest border-r-2 border-black last:border-r-0 shrink-0 transition-colors ${
              filter === f.value
                ? 'bg-black text-[#ffe600]'
                : 'bg-white text-black hover:bg-[#ffe600]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight: 380 }}>
        {loading && (
          <div className="py-8 text-center">
            <p className="text-xs font-black uppercase animate-pulse tracking-widest text-black/50">
              LOADING...
            </p>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="py-10 text-center px-4">
            <p className="text-2xl mb-2">🔕</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-black/40">
              NO NOTIFICATIONS
            </p>
          </div>
        )}

        {!loading &&
          filtered.map((notif) => (
            <NotificationItem
              key={notif.id}
              notification={notif}
              onMarkRead={onMarkRead}
              onDelete={onDelete}
            />
          ))}
      </div>

      {/* Footer count */}
      {notifications.length > 0 && (
        <div className="border-t-4 border-black bg-black px-4 py-2">
          <p className="text-[9px] font-mono font-black text-white/40 uppercase tracking-widest">
            // {notifications.length} TOTAL · {unreadCount} UNREAD
          </p>
        </div>
      )}
    </div>
  )
}
