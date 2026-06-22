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
  Terminal,
  Rocket,
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

const FEATURES = [
  { icon: Zap, title: 'Dynamic forms', desc: 'Auto-generated from schema' },
  { icon: RefreshCw, title: 'CRUD APIs', desc: 'REST endpoints included' },
  { icon: Shield, title: 'Error handling', desc: 'Graceful fallbacks built-in' },
]

const TEMPLATES = [
  { name: 'Task Manager', icon: CheckCircle2 },
  { name: 'Inventory', icon: Box },
  { name: 'Blog CMS', icon: FileText },
  { name: 'CRM', icon: Users },
]

const MARQUEE_ITEMS = [
  'Zero boilerplate',
  'Instant deploy',
  'Schema-driven',
  'Type-safe',
  'Auto CRUD',
  'Live preview',
  'No backend code',
  'JSON only',
]

function AuroraBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 bg-[#050508]" />
      <div
        className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full animate-aurora-1"
        style={{
          background: 'radial-gradient(circle, rgba(124,58,237,0.35) 0%, transparent 70%)',
          animation: 'aurora-1 12s ease-in-out infinite, glow-pulse 8s ease-in-out infinite',
        }}
      />
      <div
        className="absolute top-[30%] right-[-15%] w-[50vw] h-[50vw] rounded-full animate-aurora-2"
        style={{
          background: 'radial-gradient(circle, rgba(6,182,212,0.25) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute bottom-[-10%] left-[20%] w-[45vw] h-[45vw] rounded-full animate-aurora-3"
        style={{
          background: 'radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  )
}

function MarqueeStrip() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]
  return (
    <div className="relative overflow-hidden border-y border-white/5 py-3 mb-12 opacity-0 animate-fade-in" style={{ animationDelay: '600ms' }}>
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#050508] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#050508] to-transparent z-10" />
      <div className="flex marquee-track w-max gap-8">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-white/30 whitespace-nowrap">
            <Sparkles className="w-3 h-3 text-violet-400/60" />
            {item}
          </span>
        ))}
      </div>
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
  const editorRef = useRef<HTMLDivElement>(null)
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
    if (!editorRef.current) return
    const rect = editorRef.current.getBoundingClientRect()
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

  const lineCount = jsonInput.split('\n').length

  return (
    <div className="relative min-h-screen text-white">
      <AuroraBackground />

      {/* Nav */}
      <nav
        className="relative z-20 flex items-center justify-between max-w-6xl mx-auto px-6 pt-6 opacity-0 animate-fade-in-up"
        style={{ animationDelay: '100ms' }}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 shadow-lg shadow-violet-500/30">
            <Layers className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">AppForge</span>
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
            Beta
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-white/40">
          <Terminal className="w-3.5 h-3.5" />
          JSON → Live App
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pb-16">
        {/* Hero */}
        <section className="text-center pt-14 pb-6">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-violet-300 text-xs font-semibold mb-8 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '200ms' }}
          >
            <Rocket className="w-3.5 h-3.5" />
            No code required — just JSON
          </div>

          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] opacity-0 animate-fade-in-up"
            style={{ animationDelay: '350ms' }}
          >
            Build apps from
            <br />
            <span className="animate-gradient-text">config.</span>
          </h1>

          <p
            className="mt-6 text-lg text-white/50 max-w-xl mx-auto leading-relaxed opacity-0 animate-fade-in-up"
            style={{ animationDelay: '500ms' }}
          >
            Paste a JSON schema. Get a fully working app with forms, tables, and APIs — instantly.
          </p>
        </section>

        <MarqueeStrip />

        {/* Bento grid: features + editor */}
        <div className="grid lg:grid-cols-5 gap-5">
          {/* Left bento column */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Feature cards */}
            {FEATURES.map((f, i) => {
              const Icon = f.icon
              return (
                <div
                  key={f.title}
                  className="glass-panel rounded-2xl p-5 flex items-start gap-4 transition-all duration-300 hover:bg-white/[0.07] hover:border-white/15 hover:-translate-y-0.5 opacity-0 animate-fade-in-up group"
                  style={{ animationDelay: `${700 + i * 100}ms` }}
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/10 border border-violet-500/20 shrink-0 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white/90">{f.title}</h3>
                    <p className="text-sm text-white/40 mt-0.5">{f.desc}</p>
                  </div>
                </div>
              )
            })}

            {/* Stats row */}
            <div
              className="glass-panel rounded-2xl p-5 grid grid-cols-3 gap-3 opacity-0 animate-fade-in-up"
              style={{ animationDelay: '1000ms' }}
            >
              {[
                { val: '0', label: 'Lines of code' },
                { val: '<1s', label: 'Build time' },
                { val: '99.9%', label: 'Uptime' },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                    {s.val}
                  </div>
                  <div className="text-[10px] text-white/30 mt-1 uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Templates */}
            <div
              className="glass-panel rounded-2xl p-5 opacity-0 animate-fade-in-up"
              style={{ animationDelay: '1100ms' }}
            >
              <p className="text-[10px] uppercase tracking-[0.15em] text-white/30 font-semibold mb-3">
                Quick start
              </p>
              <div className="grid grid-cols-2 gap-2">
                {TEMPLATES.map((t) => {
                  const Icon = t.icon
                  const active = activeTemplate === t.name
                  return (
                    <button
                      key={t.name}
                      onClick={() => loadTemplate(t.name)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        active
                          ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40 shadow-lg shadow-violet-500/10'
                          : 'bg-white/[0.03] text-white/50 border border-white/5 hover:bg-white/[0.06] hover:text-white/80 hover:border-white/10'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {t.name}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right: Editor panel */}
          <div
            ref={editorRef}
            onMouseMove={handleMouseMove}
            className="lg:col-span-3 relative opacity-0 animate-scale-in"
            style={{ animationDelay: '800ms' }}
          >
            {/* Cursor spotlight */}
            <div
              className="absolute pointer-events-none z-0 rounded-full transition-opacity duration-300"
              style={{
                left: mousePos.x - 150,
                top: mousePos.y - 150,
                width: 300,
                height: 300,
                background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)',
                opacity: editorFocused ? 1 : 0.4,
              }}
            />

            <div className="editor-border relative z-10">
              <div className="rounded-[19px] bg-[#0c0c14]/90 overflow-hidden">
                {/* Title bar */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 bg-white/[0.02]">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/70" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                    </div>
                    <span className="text-xs text-white/30 font-mono ml-1">config.json</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-white/20 font-mono">{lineCount} lines</span>
                    {jsonInput.trim() && (
                      <span
                        className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                          isValidJson
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                            : 'bg-red-500/15 text-red-400 border border-red-500/25'
                        }`}
                      >
                        {isValidJson ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        {isValidJson ? 'Valid' : 'Invalid'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Editor body with line numbers */}
                <div className="relative flex">
                  <div className="py-5 pl-4 pr-2 select-none border-r border-white/5 bg-white/[0.01]">
                    {jsonInput.split('\n').map((_, i) => (
                      <div key={i} className="text-[11px] leading-relaxed text-white/15 font-mono text-right w-6">
                        {i + 1}
                      </div>
                    ))}
                  </div>

                  <div className="relative flex-1">
                    {editorFocused && (
                      <div
                        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-400/30 to-transparent pointer-events-none z-10"
                        style={{ animation: 'scan-line 3s ease-in-out infinite' }}
                      />
                    )}
                    <textarea
                      value={jsonInput}
                      onChange={(e) => setJsonInput(e.target.value)}
                      onFocus={() => setEditorFocused(true)}
                      onBlur={() => setEditorFocused(false)}
                      spellCheck={false}
                      className="w-full bg-transparent text-emerald-400/85 font-mono text-[13px] leading-relaxed py-5 px-4 resize-none focus:outline-none custom-scrollbar min-h-[380px]"
                      placeholder="Paste your JSON config here..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-4 flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm animate-fade-in-up">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading || !isValidJson}
              className="btn-glow group relative mt-5 w-full py-4 rounded-2xl font-bold text-base text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] animate-float-y"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #6366f1, #0891b2)',
                boxShadow: '0 0 60px rgba(124,58,237,0.35), 0 8px 32px rgba(0,0,0,0.4)',
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <Code2 className="w-5 h-5" />
                    Generate App
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </span>
            </button>

            <p className="text-center text-xs text-white/25 mt-4">
              Supports missing fields, invalid values, and broken schemas
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
