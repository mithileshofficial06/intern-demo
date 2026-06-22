'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { safeValidateConfig } from '@/lib/config-validator'
import {
  Zap,
  RefreshCw,
  Shield,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Code2,
  ArrowRight,
  Layers,
  Box,
  Users,
  FileText,
} from 'lucide-react'

const defaultJsonInput = `{
  "app": "Task Manager",
  "entities": [
    {
      "name": "Task",
      "fields": [
        { "name": "title", "type": "string", "required": true, "label": "Task Title" },
        { "name": "status", "type": "enum", "values": ["todo", "in-progress", "done"], "label": "Status" },
        { "name": "dueDate", "type": "date", "label": "Due Date" },
        { "name": "description", "type": "text", "label": "Description" }
      ]
    }
  ],
  "pages": [
    { "type": "list", "entity": "Task", "title": "My Tasks" },
    { "type": "form", "entity": "Task", "title": "Add Task" }
  ]
}`

const TEMPLATE_DATA: Record<string, string> = {
  'Task Manager': defaultJsonInput,
  'Blog CMS': `{
  "app": "Blog CMS",
  "entities": [
    {
      "name": "Post",
      "fields": [
        { "name": "title", "type": "string", "required": true, "label": "Title" },
        { "name": "content", "type": "text", "label": "Content" },
        { "name": "status", "type": "enum", "values": ["draft", "published"], "label": "Status" },
        { "name": "publishedAt", "type": "date", "label": "Publish Date" }
      ]
    }
  ],
  "pages": [
    { "type": "list", "entity": "Post", "title": "All Posts" },
    { "type": "form", "entity": "Post", "title": "Create Post" }
  ]
}`,
  Inventory: `{
  "app": "Inventory Manager",
  "entities": [
    {
      "name": "Product",
      "fields": [
        { "name": "name", "type": "string", "required": true, "label": "Product Name" },
        { "name": "sku", "type": "string", "required": true, "label": "SKU" },
        { "name": "quantity", "type": "number", "label": "Quantity" },
        { "name": "price", "type": "number", "label": "Price" },
        { "name": "category", "type": "enum", "values": ["electronics", "clothing", "books"], "label": "Category" }
      ]
    }
  ],
  "pages": [
    { "type": "list", "entity": "Product", "title": "Products" },
    { "type": "form", "entity": "Product", "title": "Add Product" }
  ]
}`,
  CRM: `{
  "app": "Simple CRM",
  "entities": [
    {
      "name": "Contact",
      "fields": [
        { "name": "name", "type": "string", "required": true, "label": "Full Name" },
        { "name": "email", "type": "string", "label": "Email" },
        { "name": "phone", "type": "string", "label": "Phone" },
        { "name": "company", "type": "string", "label": "Company" },
        { "name": "status", "type": "enum", "values": ["lead", "customer", "inactive"], "label": "Status" }
      ]
    }
  ],
  "pages": [
    { "type": "list", "entity": "Contact", "title": "Contacts" },
    { "type": "form", "entity": "Contact", "title": "Add Contact" }
  ]
}`,
}

const PARTICLES = [
  { w: 6, h: 6, left: '12%', top: '18%', delay: '0s', dur: '18s' },
  { w: 4, h: 4, left: '78%', top: '25%', delay: '2s', dur: '22s' },
  { w: 8, h: 8, left: '55%', top: '65%', delay: '1s', dur: '16s' },
  { w: 5, h: 5, left: '88%', top: '72%', delay: '3s', dur: '20s' },
  { w: 3, h: 3, left: '30%', top: '80%', delay: '4s', dur: '24s' },
  { w: 7, h: 7, left: '65%', top: '12%', delay: '1.5s', dur: '19s' },
]

const FEATURES = [
  { icon: Zap, title: 'Dynamic form generation', delay: 900 },
  { icon: RefreshCw, title: 'Automatic CRUD APIs', delay: 1000 },
  { icon: Shield, title: 'Graceful error handling', delay: 1100 },
]

const TEMPLATES = [
  { name: 'Task Manager', icon: CheckCircle2, color: 'from-violet-500/20 to-purple-600/10' },
  { name: 'Inventory', icon: Box, color: 'from-cyan-500/20 to-blue-600/10' },
  { name: 'Blog CMS', icon: FileText, color: 'from-pink-500/20 to-rose-600/10' },
  { name: 'CRM', icon: Users, color: 'from-emerald-500/20 to-teal-600/10' },
]

function AnimatedCounter({
  target,
  suffix = '',
  prefix = '',
  duration = 1200,
}: {
  target: number
  suffix?: string
  prefix?: string
  duration?: number
}) {
  const [value, setValue] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true

    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(target * eased * 10) / 10)
      if (progress < 1) requestAnimationFrame(tick)
    }
    const id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [target, duration])

  return (
    <span>
      {prefix}
      {Number.isInteger(target) ? Math.round(value) : value.toFixed(1)}
      {suffix}
    </span>
  )
}

function AmbientOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-30 blur-3xl animate-float"
        style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }}
      />
      <div
        className="absolute top-1/2 -right-24 w-80 h-80 rounded-full opacity-20 blur-3xl animate-float-slow"
        style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)', animationDelay: '2s' }}
      />
      <div
        className="absolute -bottom-20 left-1/3 w-72 h-72 rounded-full opacity-25 blur-3xl animate-float"
        style={{ background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)', animationDelay: '4s' }}
      />
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-violet-400/30 animate-float"
          style={{
            width: p.w,
            height: p.h,
            left: p.left,
            top: p.top,
            animationDelay: p.delay,
            animationDuration: p.dur,
          }}
        />
      ))}
    </div>
  )
}

function FeatureItem({
  icon: Icon,
  title,
  delay,
}: {
  icon: typeof Zap
  title: string
  delay: number
}) {
  return (
    <div
      className="group flex items-center gap-3.5 opacity-0 animate-fade-in-up cursor-default"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-violet-100 to-purple-50 border border-violet-200/60 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md group-hover:shadow-violet-200/50 group-hover:border-violet-300">
        <Icon className="w-4 h-4 text-violet-600 transition-transform duration-300 group-hover:rotate-12" />
      </div>
      <span className="text-slate-600 text-[15px] font-medium transition-colors duration-300 group-hover:text-slate-900">
        {title}
      </span>
    </div>
  )
}

function StatsRow() {
  return (
    <div
      className="grid grid-cols-3 gap-4 mt-10 opacity-0 animate-fade-in-up"
      style={{ animationDelay: '1200ms' }}
    >
      {[
        { label: 'Lines of Code', display: <AnimatedCounter target={0} /> },
        {
          label: 'Build Time',
          display: (
            <>
              {'< '}
              <AnimatedCounter target={1} />
              sec
            </>
          ),
        },
        {
          label: 'Uptime',
          display: (
            <>
              <AnimatedCounter target={99.9} />
              %
            </>
          ),
        },
      ].map((stat) => (
        <div
          key={stat.label}
          className="group relative text-center p-4 rounded-2xl bg-white/50 border border-slate-200/60 backdrop-blur-sm transition-all duration-300 hover:bg-white/80 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100/50 hover:-translate-y-0.5"
        >
          <div className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent">
            {stat.display}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium uppercase tracking-wider">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  )
}

function ValidationBadge({ isValid, hasContent }: { isValid: boolean; hasContent: boolean }) {
  if (!hasContent) return null

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-500 ${
        isValid
          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
          : 'bg-red-500/15 text-red-400 border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.15)]'
      }`}
    >
      {isValid ? (
        <CheckCircle2 className="w-3.5 h-3.5" />
      ) : (
        <AlertCircle className="w-3.5 h-3.5" />
      )}
      {isValid ? 'Valid JSON' : 'Invalid JSON'}
    </div>
  )
}

export default function Home() {
  const [jsonInput, setJsonInput] = useState(defaultJsonInput)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isValidJson, setIsValidJson] = useState(true)
  const [activeTemplate, setActiveTemplate] = useState('Task Manager')
  const [editorFocused, setEditorFocused] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const rightPanelRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (jsonInput.trim()) {
      try {
        JSON.parse(jsonInput)
        setIsValidJson(true)
      } catch {
        setIsValidJson(false)
      }
    }
  }, [jsonInput])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!rightPanelRef.current) return
    const rect = rightPanelRef.current.getBoundingClientRect()
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }, [])

  const loadTemplate = (name: string) => {
    setActiveTemplate(name)
    setJsonInput(TEMPLATE_DATA[name] ?? defaultJsonInput)
    setError(null)
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      let parsedJson
      try {
        parsedJson = JSON.parse(jsonInput)
      } catch {
        setError('Invalid JSON: please check your syntax')
        return
      }

      const validationResult = safeValidateConfig(parsedJson)
      if (!validationResult.success) {
        setError(validationResult.error)
        return
      }

      const response = await fetch('/api/runtime/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedJson),
      })

      if (!response.ok) {
        setError('Failed to register app')
        return
      }

      const { appId } = await response.json()
      router.push(`/${appId}`)
    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Error submitting config:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative overflow-hidden">
      {/* ── Left Panel ── */}
      <div className="relative w-full lg:w-[44%] xl:w-[42%] min-h-[50vh] lg:min-h-screen flex flex-col">
        <AmbientOrbs />

        <div className="absolute inset-0 bg-gradient-to-br from-violet-50/80 via-white to-cyan-50/60" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #8b5cf6 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />

        {/* Logo */}
        <header
          className="relative z-10 flex items-center justify-between px-8 lg:px-12 pt-8 opacity-0 animate-fade-in-left"
          style={{ animationDelay: '100ms' }}
        >
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 shadow-lg shadow-violet-300/40">
              <Layers className="w-5 h-5 text-white" />
              <div className="absolute inset-0 rounded-xl bg-white/20 animate-pulse" />
            </div>
            <div>
              <span className="text-slate-900 font-bold text-xl tracking-tight">AppForge</span>
              <span className="ml-2.5 px-2 py-0.5 bg-violet-100 text-violet-700 text-[10px] rounded-full font-bold uppercase tracking-wider border border-violet-200">
                Beta
              </span>
            </div>
          </div>
        </header>

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-8 lg:px-12 py-10 lg:py-0">
          <div
            className="inline-flex items-center gap-2 w-fit px-3 py-1.5 rounded-full bg-violet-100/80 border border-violet-200/60 text-violet-700 text-[11px] font-bold uppercase tracking-[0.2em] mb-6 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '250ms' }}
          >
            <Sparkles className="w-3 h-3" />
            JSON → Live App
          </div>

          <h1
            className="text-4xl sm:text-5xl xl:text-[3.25rem] font-black leading-[1.08] text-slate-900 tracking-tight opacity-0 animate-fade-in-up"
            style={{ animationDelay: '400ms' }}
          >
            Build apps from{' '}
            <span className="animate-gradient-text">config.</span>
          </h1>

          <p
            className="text-slate-500 text-lg mt-5 max-w-md leading-relaxed opacity-0 animate-fade-in-up"
            style={{ animationDelay: '550ms' }}
          >
            Paste a JSON schema. Get a fully working app with forms, tables, and
            APIs — instantly.
          </p>

          <div className="mt-9 space-y-3.5">
            {FEATURES.map((f) => (
              <FeatureItem key={f.title} {...f} />
            ))}
          </div>

          <StatsRow />

          {/* Templates */}
          <div
            className="mt-10 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '1350ms' }}
          >
            <p className="text-slate-400 text-[11px] uppercase tracking-[0.15em] font-semibold mb-3.5">
              Quick Start Templates
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {TEMPLATES.map((template, i) => {
                const Icon = template.icon
                const isActive = activeTemplate === template.name
                return (
                  <button
                    key={template.name}
                    onClick={() => loadTemplate(template.name)}
                    className={`group relative flex items-center gap-2.5 p-3.5 text-left text-sm rounded-xl border transition-all duration-300 overflow-hidden ${
                      isActive
                        ? 'bg-violet-50 border-violet-300 text-violet-700 shadow-md shadow-violet-100'
                        : 'bg-white/60 border-slate-200/80 text-slate-600 hover:border-violet-200 hover:bg-white hover:shadow-md hover:shadow-violet-50 hover:-translate-y-0.5'
                    }`}
                    style={{ animationDelay: `${1400 + i * 80}ms` }}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${template.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    />
                    <div
                      className={`relative flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300 ${
                        isActive
                          ? 'bg-violet-200/60'
                          : 'bg-slate-100 group-hover:bg-violet-100'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${
                          isActive ? 'text-violet-600' : 'text-slate-500 group-hover:text-violet-600'
                        }`}
                      />
                    </div>
                    <span className="relative font-medium">{template.name}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <footer
          className="relative z-10 px-8 lg:px-12 pb-8 opacity-0 animate-fade-in-up"
          style={{ animationDelay: '1600ms' }}
        >
          <p className="text-slate-400 text-sm flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            No code required. Just JSON.
          </p>
        </footer>
      </div>

      {/* ── Right Panel ── */}
      <div
        ref={rightPanelRef}
        onMouseMove={handleMouseMove}
        className="relative w-full lg:w-[56%] xl:w-[58%] min-h-[50vh] lg:min-h-screen bg-[#030712] flex flex-col"
      >
        {/* Cursor glow */}
        <div
          className="absolute pointer-events-none transition-opacity duration-500 z-0"
          style={{
            left: mousePos.x - 200,
            top: mousePos.y - 200,
            width: 400,
            height: 400,
            background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
            opacity: editorFocused ? 1 : 0.5,
          }}
        />

        {/* Grid background */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-[-20px] opacity-[0.07]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(139, 92, 246, 0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(139, 92, 246, 0.5) 1px, transparent 1px)
              `,
              backgroundSize: '24px 24px',
              animation: 'grid-drift 20s linear infinite',
            }}
          />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col justify-center flex-1 px-6 sm:px-10 lg:px-12 py-10 lg:py-12">
          <div
            className="flex items-center justify-between mb-4 opacity-0 animate-fade-in-right"
            style={{ animationDelay: '300ms' }}
          >
            <label className="flex items-center gap-2 text-slate-400 text-[11px] uppercase tracking-[0.2em] font-semibold">
              <Code2 className="w-3.5 h-3.5 text-violet-400" />
              Your Configuration
            </label>
            <ValidationBadge isValid={isValidJson} hasContent={jsonInput.trim().length > 0} />
          </div>

          {/* Editor window */}
          <div
            className="opacity-0 animate-scale-in"
            style={{ animationDelay: '500ms' }}
          >
            <div className="editor-glow-border">
              <div className="rounded-[15px] bg-[#0a0f1e] overflow-hidden shadow-2xl shadow-black/50">
                {/* Window chrome */}
                <div className="flex items-center gap-2 px-4 py-3 bg-[#0d1225] border-b border-slate-800/80">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-400 transition-colors" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-400 transition-colors" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-400 transition-colors" />
                  </div>
                  <span className="ml-3 text-[11px] text-slate-500 font-mono">config.json</span>
                  <div className="ml-auto flex items-center gap-1.5 text-[10px] text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    live
                  </div>
                </div>

                <div className="relative">
                  {/* Scan line effect on focus */}
                  {editorFocused && (
                    <div
                      className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-400/40 to-transparent pointer-events-none z-10"
                      style={{ animation: 'scan-line 4s ease-in-out infinite' }}
                    />
                  )}

                  <textarea
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    onFocus={() => setEditorFocused(true)}
                    onBlur={() => setEditorFocused(false)}
                    rows={16}
                    spellCheck={false}
                    className="w-full bg-transparent text-emerald-400/90 font-mono text-[13px] leading-relaxed p-5 resize-none focus:outline-none custom-scrollbar transition-all duration-300"
                    placeholder="Paste your JSON config here..."
                    style={{
                      textShadow: editorFocused
                        ? '0 0 20px rgba(74, 222, 128, 0.15)'
                        : 'none',
                      minHeight: '320px',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 flex items-start gap-3 p-4 rounded-xl bg-red-950/60 border border-red-800/50 text-red-300 text-sm animate-fade-in-up glass-dark">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* CTA */}
          <button
            onClick={handleSubmit}
            disabled={loading || !isValidJson}
            className="group relative mt-5 w-full py-4 rounded-xl font-semibold text-base tracking-wide text-white overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.015] active:scale-[0.99] opacity-0 animate-fade-in-up animate-shimmer"
            style={{
              animationDelay: '700ms',
              background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 50%, #0891b2 100%)',
              boxShadow: loading
                ? '0 0 40px rgba(139, 92, 246, 0.5), 0 8px 32px rgba(0,0,0,0.3)'
                : '0 8px 32px rgba(124, 58, 237, 0.35), 0 2px 8px rgba(0,0,0,0.2)',
            }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2.5">
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Generating your app...
                </>
              ) : (
                <>
                  Generate App
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </span>
          </button>

          <p
            className="text-slate-600 text-xs text-center mt-4 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '900ms' }}
          >
            Supports missing fields, invalid values, and broken schemas
          </p>

          {loading && (
            <div className="mt-5 flex justify-center gap-3 opacity-0 animate-fade-in-up">
              {['Parsing schema', 'Building APIs', 'Launching app'].map((step, i) => (
                <div
                  key={step}
                  className="flex items-center gap-1.5 text-[11px] text-slate-500"
                  style={{ animationDelay: `${i * 0.3}s` }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full bg-violet-500"
                    style={{ animation: `bounce-subtle 1s ease-in-out ${i * 0.2}s infinite` }}
                  />
                  {step}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
