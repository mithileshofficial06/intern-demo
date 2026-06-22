'use client'

import { motion } from 'framer-motion'

const TEMPLATES = ['Task Manager', 'Inventory', 'Blog CMS', 'CRM']

const TEMPLATE_ICONS: Record<string, string> = {
  'Task Manager': '☑',
  'Inventory': '📦',
  'Blog CMS': '✍',
  'CRM': '👥',
}

interface QuickStartTemplatesProps {
  activeTemplate: string
  onSelect: (name: string) => void
}

export default function QuickStartTemplates({
  activeTemplate,
  onSelect,
}: QuickStartTemplatesProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.9 }}
    >
      <p className="text-xs font-black uppercase tracking-[0.2em] mb-4 font-mono">
        ► QUICK START
      </p>
      <div className="grid grid-cols-2 gap-3">
        {TEMPLATES.map((name) => {
          const active = activeTemplate === name
          return (
            <motion.button
              key={name}
              onClick={() => onSelect(name)}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className={`brutal-btn px-4 py-3.5 text-xs text-left relative overflow-hidden transition-colors duration-150 ${
                active
                  ? 'bg-black text-[#ffe600]'
                  : 'bg-white text-black hover:bg-[#ffe600]'
              }`}
              style={active ? { boxShadow: '6px 6px 0 #000, 0 0 20px rgba(255,230,0,0.3)' } : undefined}
            >
              {/* Active glow overlay */}
              {active && (
                <motion.div
                  layoutId="template-glow"
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    boxShadow: 'inset 0 0 20px rgba(255,230,0,0.15)',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              <span className="relative z-10 flex items-center gap-2">
                <span className="text-base">{TEMPLATE_ICONS[name]}</span>
                <span className="font-black">{name.toUpperCase()}</span>
              </span>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}
