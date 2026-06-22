'use client'

import { Toaster } from 'sonner'

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      expand={true}
      richColors={false}
      gap={8}
      toastOptions={{
        style: {
          fontFamily: '"Arial Black", Impact, sans-serif',
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          borderRadius: 0,
          border: '4px solid #000',
          boxShadow: '6px 6px 0 #000',
          fontSize: '12px',
          padding: '12px 16px',
          maxWidth: '360px',
        },
        classNames: {
          title: 'text-xs font-black uppercase tracking-widest',
          description: 'text-[11px] font-bold opacity-80 mt-0.5',
        },
      }}
    />
  )
}
