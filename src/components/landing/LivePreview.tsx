'use client'

import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LivePreviewProps {
  jsonInput: string
  isValid: boolean
}

interface ParsedEntity {
  name: string
  fields: Array<{
    name: string
    type: string
    label?: string
    required?: boolean
    values?: string[]
  }>
}

interface ParsedPage {
  type: string
  entity: string
  title?: string
}

interface ParsedConfig {
  app: string
  entities: ParsedEntity[]
  pages: ParsedPage[]
}

function parseConfig(jsonInput: string): ParsedConfig | null {
  try {
    const parsed = JSON.parse(jsonInput)
    if (!parsed || typeof parsed !== 'object') return null
    return {
      app: parsed.app || 'Untitled',
      entities: Array.isArray(parsed.entities) ? parsed.entities : [],
      pages: Array.isArray(parsed.pages) ? parsed.pages : [],
    }
  } catch {
    return null
  }
}

function PreviewField({ field }: { field: ParsedEntity['fields'][0] }) {
  const label = field.label || field.name

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ duration: 0.2 }}
      className="space-y-1.5"
    >
      <label className="block text-[11px] font-black uppercase tracking-wider text-[#ffe600]">
        {label}
        {field.required && <span className="text-[#ff2d2d] ml-1">*</span>}
      </label>
      {field.type === 'text' ? (
        <div className="w-full h-14 bg-[#1a1a1a] border-2 border-[#ffe600]/40 px-3 py-2 text-xs text-[#ffe600]/50 font-mono">
          Enter {label.toLowerCase()}...
        </div>
      ) : field.type === 'enum' ? (
        <div className="w-full bg-[#1a1a1a] border-2 border-[#ffe600]/40 px-3 py-2 text-xs text-[#ffe600]/70 font-mono flex justify-between items-center">
          <span>{field.values?.[0] || 'Select...'}</span>
          <span className="text-[10px] text-[#ffe600]/50">▼</span>
        </div>
      ) : field.type === 'boolean' ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-[#ffe600]/50 bg-[#1a1a1a]" />
          <span className="text-xs text-[#ffe600]/60 font-mono">{label}</span>
        </div>
      ) : field.type === 'date' ? (
        <div className="w-full bg-[#1a1a1a] border-2 border-[#ffe600]/40 px-3 py-2 text-xs text-[#ffe600]/50 font-mono">
          yyyy-mm-dd
        </div>
      ) : (
        <div className="w-full bg-[#1a1a1a] border-2 border-[#ffe600]/40 px-3 py-2 text-xs text-[#ffe600]/50 font-mono">
          Enter {label.toLowerCase()}...
        </div>
      )}
    </motion.div>
  )
}

function PreviewTable({ entity }: { entity: ParsedEntity }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden"
    >
      <div className="text-[11px] font-black uppercase tracking-wider text-[#ffe600]/80 mb-2 font-mono">
        ► {entity.name} Records
      </div>
      <div className="border-2 border-[#ffe600]/30 overflow-hidden">
        {/* Header */}
        <div className="flex bg-[#ffe600]/15 border-b-2 border-[#ffe600]/30">
          {entity.fields.slice(0, 4).map((f) => (
            <div
              key={f.name}
              className="flex-1 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-[#ffe600]/90 font-mono border-r border-[#ffe600]/20 last:border-r-0"
            >
              {f.label || f.name}
            </div>
          ))}
        </div>
        {/* Sample rows */}
        {[0, 1, 2].map((row) => (
          <div
            key={row}
            className="flex border-b border-[#ffe600]/10 last:border-b-0"
          >
            {entity.fields.slice(0, 4).map((f) => (
              <div
                key={f.name}
                className="flex-1 px-3 py-2 text-[10px] text-[#ffe600]/40 font-mono border-r border-[#ffe600]/10 last:border-r-0"
              >
                {f.type === 'enum'
                  ? f.values?.[row % (f.values?.length || 1)] || '—'
                  : f.type === 'number'
                  ? String(10 + row * 15)
                  : '—'}
              </div>
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default function LivePreview({ jsonInput, isValid }: LivePreviewProps) {
  const config = useMemo(() => (isValid ? parseConfig(jsonInput) : null), [jsonInput, isValid])

  const formPages = useMemo(
    () => config?.pages.filter((p) => p.type === 'form') || [],
    [config]
  )
  const listPages = useMemo(
    () => config?.pages.filter((p) => p.type === 'list') || [],
    [config]
  )

  const getEntity = (name: string) => config?.entities.find((e) => e.name === name)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="flex flex-col overflow-hidden border-4 border-[#ffe600]/50 border-t-0 bg-[#0d0d0d]"
      style={{ boxShadow: '6px 6px 0 #000' }}
    >
      {/* Preview header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#111] border-b-2 border-[#ffe600]/30">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#ffe600] font-mono">
            {'>'} GENERATED PREVIEW
          </span>
        </div>
        <AnimatePresence mode="wait">
          {config ? (
            <motion.span
              key="live"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5"
            >
              <span className="pulse-dot-green" style={{ width: 7, height: 7 }} />
              <span className="text-[10px] font-black uppercase tracking-wider text-[#00ff66] font-mono">
                LIVE
              </span>
            </motion.span>
          ) : (
            <motion.span
              key="waiting"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-[10px] font-black uppercase tracking-wider text-[#ff2d2d] font-mono"
            >
              WAITING FOR VALID CONFIG...
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Preview content */}
      <div className="flex-1 p-5 min-h-[200px] max-h-[320px] overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="wait">
          {config ? (
            <motion.div
              key={config.app}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              {/* App title */}
              <div className="text-sm font-black uppercase tracking-wider text-[#ffe600] font-mono border-b-2 border-[#ffe600]/30 pb-2">
                ◆ {config.app}
              </div>

              {/* Form previews */}
              {formPages.map((page) => {
                const entity = getEntity(page.entity)
                if (!entity) return null
                return (
                  <div key={`form-${page.entity}`}>
                    <div className="text-[11px] font-black uppercase tracking-wider text-[#ffe600]/80 mb-3 font-mono">
                      ► {page.title || `${page.entity} Form`}
                    </div>
                    <div className="space-y-3 pl-3 border-l-3 border-[#ffe600]/30">
                      {entity.fields.map((field) => (
                        <PreviewField key={field.name} field={field} />
                      ))}
                    </div>
                    {/* Submit button preview */}
                    <div className="mt-4 px-4 py-2 bg-[#ff2d2d]/30 border-2 border-[#ff2d2d]/50 text-xs font-black text-[#ff2d2d] text-center uppercase tracking-wider font-mono">
                      ► SAVE RECORD
                    </div>
                  </div>
                )
              })}

              {/* Table previews */}
              {listPages.map((page) => {
                const entity = getEntity(page.entity)
                if (!entity) return null
                return <PreviewTable key={`list-${page.entity}`} entity={entity} />
              })}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full min-h-[160px] text-center"
            >
              <div className="text-4xl mb-3 text-[#ffe600]/30">{'{ }'}</div>
              <p className="text-xs font-black uppercase tracking-wider text-[#ffe600]/40 font-mono">
                Your generated app will appear here
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
