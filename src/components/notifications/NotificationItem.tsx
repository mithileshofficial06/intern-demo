'use client'

import { AppNotification, timeAgo } from '@/lib/notifications'

const TYPE_CONFIG = {
  success: { bg: '#00ff66', text: '#000', icon: '✓', label: 'SUCCESS' },
  error:   { bg: '#ff2d2d', text: '#fff', icon: '⚠', label: 'ERROR' },
  info:    { bg: '#0040ff', text: '#fff', icon: 'ℹ', label: 'INFO' },
  warning: { bg: '#ffe600', text: '#000', icon: '⚡', label: 'WARNING' },
} as const

interface NotificationItemProps {
  notification: AppNotification
  onMarkRead: (id: string) => void
  onDelete: (id: string) => void
}

export function NotificationItem({ notification, onMarkRead, onDelete }: NotificationItemProps) {
  const cfg = TYPE_CONFIG[notification.type as keyof typeof TYPE_CONFIG] ?? TYPE_CONFIG.info

  return (
    <div
      className={`relative border-b-4 border-black transition-all ${notification.read ? 'opacity-60' : ''}`}
      style={{ background: notification.read ? '#f5f5f5' : '#fff' }}
    >
      {/* Unread dot */}
      {!notification.read && (
        <span
          className="absolute top-3 left-2 w-2 h-2 rounded-full animate-pulse"
          style={{ background: cfg.bg }}
        />
      )}

      <div className="pl-6 pr-3 py-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className="shrink-0 w-5 h-5 flex items-center justify-center text-[10px] font-black border-2 border-black"
              style={{ background: cfg.bg, color: cfg.text }}
            >
              {cfg.icon}
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest truncate">
              {notification.title}
            </span>
          </div>
          <button
            onClick={() => onDelete(notification.id)}
            className="shrink-0 w-4 h-4 flex items-center justify-center text-[10px] font-black border-2 border-black bg-white hover:bg-black hover:text-[#ffe600] transition-colors"
            aria-label="Delete notification"
          >
            ×
          </button>
        </div>

        {/* Message */}
        <p className="text-[11px] font-bold text-black/70 leading-snug ml-6 uppercase tracking-wide">
          {notification.message}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-2 ml-6">
          <span className="text-[9px] font-mono font-bold text-black/40 uppercase">
            {timeAgo(notification.createdAt)}
          </span>
          {!notification.read && (
            <button
              onClick={() => onMarkRead(notification.id)}
              className="text-[9px] font-black uppercase tracking-widest border-2 border-black px-1.5 py-0.5 bg-white hover:bg-black hover:text-[#ffe600] transition-colors"
            >
              MARK READ
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
