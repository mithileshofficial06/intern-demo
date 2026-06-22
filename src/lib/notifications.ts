import { toast } from 'sonner'

// ──────────────────────────────────────────
// Brutalist toast style tokens
// ──────────────────────────────────────────
const base = {
  fontFamily: '"Arial Black", Impact, sans-serif',
  fontWeight: 900,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.08em',
  border: '4px solid #000',
  borderRadius: 0,
  fontSize: '12px',
}

// ──────────────────────────────────────────
// Client-side toast helpers
// ──────────────────────────────────────────
export const notify = {
  success: (message: string, title?: string) =>
    toast.success(title ?? 'SUCCESS', {
      description: message,
      duration: 4000,
      style: { ...base, background: '#00ff66', color: '#000', boxShadow: '6px 6px 0 #000' },
    }),

  error: (message: string, title?: string) =>
    toast.error(title ?? 'ERROR', {
      description: message,
      duration: 5000,
      style: { ...base, background: '#ff2d2d', color: '#fff', boxShadow: '6px 6px 0 #000' },
    }),

  info: (message: string, title?: string) =>
    toast.info(title ?? 'INFO', {
      description: message,
      duration: 4000,
      style: { ...base, background: '#0040ff', color: '#fff', boxShadow: '6px 6px 0 #000' },
    }),

  warning: (message: string, title?: string) =>
    toast.warning(title ?? 'WARNING', {
      description: message,
      duration: 4500,
      style: { ...base, background: '#ffe600', color: '#000', boxShadow: '6px 6px 0 #000' },
    }),

  loading: (message: string) =>
    toast.loading(message, {
      style: { ...base, background: '#111', color: '#ffe600', boxShadow: '6px 6px 0 #ffe600' },
    }),

  dismiss: (id: string | number) => toast.dismiss(id),

  promise: <T>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string }
  ) =>
    toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
      style: { ...base, background: '#111', color: '#ffe600' },
    }),
}

// ──────────────────────────────────────────
// Time-ago helper (no dependencies)
// ──────────────────────────────────────────
export function timeAgo(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diff = Math.floor((now - then) / 1000)

  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

// ──────────────────────────────────────────
// Type helpers
// ──────────────────────────────────────────
export type NotificationType = 'success' | 'error' | 'info' | 'warning'

export interface AppNotification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  createdAt: string
}
