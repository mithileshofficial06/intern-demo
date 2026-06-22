'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { safeValidateConfig } from '@/lib/config-validator'

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
  { num: '01', title: 'DYNAMIC FORMS', desc: 'Generated from your schema. No hand-coding.' },
  { num: '02', title: 'CRUD APIs', desc: 'REST endpoints. Wired up automatically.' },
  { num: '03', title: 'ERROR HANDLING', desc: 'Broken schemas? We deal with it.' },
]

const TEMPLATES = ['Task Manager', 'Inventory', 'Blog CMS', 'CRM']

const MARQUEE = [
  'JSON ONLY',
  'ZERO BOILERPLATE',
  'INSTANT DEPLOY',
  'NO BACKEND CODE',
  'SCHEMA DRIVEN',
  'RAW POWER',
  'BUILD NOW',
  'NO EXCUSES',
]

function BrutalMarquee() {
  const items = [...MARQUEE, ...MARQUEE]
  return (
    <div className="brutal-border bg-black text-[#ffe600] py-2.5 overflow-hidden border-x-0">
      <div className="flex animate-brutal-marquee w-max gap-10">
        {items.map((item, i) => (
          <span
            key={i}
            className="text-sm font-black uppercase tracking-[0.25em] whitespace-nowrap font-mono"
          >
            ★ {item} ★
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
        setError('INVALID JSON — FIX YOUR SYNTAX')
        return
      }
      const validationResult = safeValidateConfig(parsedJson)
      if (!validationResult.success) {
        setError(validationResult.error.toUpperCase())
        return
      }
      const response = await fetch('/api/runtime/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedJson),
      })
      if (!response.ok) {
        setError('FAILED TO REGISTER APP')
        return
      }
      const { appId } = await response.json()
      router.push(`/${appId}`)
    } catch (err) {
      setError('UNEXPECTED ERROR OCCURRED')
      console.error('Error submitting config:', err)
    } finally {
      setLoading(false)
    }
  }

  const lines = jsonInput.split('\n')

  return (
    <div className="min-h-screen flex flex-col">
      <BrutalMarquee />

      <div className="flex flex-col lg:flex-row flex-1 min-h-0">
        {/* ── LEFT: yellow brutal panel ── */}
        <div className="relative w-full lg:w-[42%] bg-[#ffe600] brutal-border border-t-0 border-l-0 border-b-0 flex flex-col">
          <div className="absolute inset-0 brutal-checker pointer-events-none" />

          {/* Header */}
          <header className="relative z-10 p-6 lg:p-8 border-b-4 border-black animate-brutal-slide">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black tracking-tighter leading-none">
                  APP
                  <span className="brutal-highlight">FORGE</span>
                </h2>
                <span className="brutal-tag bg-white mt-3">BETA v0.1</span>
              </div>
              <div className="brutal-box bg-black text-[#ffe600] px-3 py-2 text-xs font-mono font-bold leading-tight text-right">
                JSON
                <br />
                → APP
              </div>
            </div>
          </header>

          {/* Hero */}
          <div className="relative z-10 flex-1 p-6 lg:p-8 flex flex-col justify-center">
            <p
              className="text-xs font-black uppercase tracking-[0.3em] mb-4 opacity-0 animate-brutal-drop"
              style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
            >
              // NO CODE REQUIRED
            </p>

            <h1
              className="text-4xl sm:text-5xl xl:text-6xl font-black leading-[0.95] tracking-tighter uppercase opacity-0 animate-brutal-drop"
              style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
            >
              BUILD APPS
              <br />
              FROM{' '}
              <span className="brutal-underline">CONFIG</span>
              <span className="animate-brutal-blink">_</span>
            </h1>

            <p
              className="mt-5 text-base font-bold max-w-sm leading-snug opacity-0 animate-brutal-drop"
              style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
            >
              Paste JSON. Get forms, tables, APIs. Done. No frameworks. No nonsense.
            </p>

            {/* Features */}
            <div className="mt-8 space-y-3">
              {FEATURES.map((f, i) => (
                <div
                  key={f.num}
                  className="brutal-box p-4 flex gap-4 opacity-0 animate-brutal-slide hover:translate-x-1 transition-transform"
                  style={{ animationDelay: `${400 + i * 80}ms`, animationFillMode: 'forwards' }}
                >
                  <span className="font-mono font-black text-2xl leading-none text-[#ff2d2d]">
                    {f.num}
                  </span>
                  <div>
                    <h3 className="font-black text-sm tracking-wide">{f.title}</h3>
                    <p className="text-xs font-bold mt-0.5 opacity-70">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div
              className="mt-6 grid grid-cols-3 gap-0 brutal-border bg-black text-[#ffe600] opacity-0 animate-brutal-drop"
              style={{ animationDelay: '650ms', animationFillMode: 'forwards' }}
            >
              {[
                { val: '0', label: 'LOC' },
                { val: '<1s', label: 'BUILD' },
                { val: '99%', label: 'UP' },
              ].map((s, i) => (
                <div
                  key={s.label}
                  className={`p-3 text-center ${i < 2 ? 'border-r-4 border-[#ffe600]' : ''}`}
                >
                  <div className="text-2xl font-black font-mono">{s.val}</div>
                  <div className="text-[10px] font-black tracking-widest mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Templates */}
            <div
              className="mt-6 opacity-0 animate-brutal-drop"
              style={{ animationDelay: '750ms', animationFillMode: 'forwards' }}
            >
              <p className="text-xs font-black uppercase tracking-[0.2em] mb-3">
                ► QUICK START
              </p>
              <div className="grid grid-cols-2 gap-3">
                {TEMPLATES.map((name) => {
                  const active = activeTemplate === name
                  return (
                    <button
                      key={name}
                      onClick={() => loadTemplate(name)}
                      className={`brutal-btn px-3 py-3 text-xs text-left ${
                        active
                          ? 'bg-black text-[#ffe600]'
                          : 'bg-white text-black hover:bg-[#ffe600]'
                      }`}
                    >
                      {active ? '■ ' : '□ '}
                      {name.toUpperCase()}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <footer className="relative z-10 p-6 border-t-4 border-black bg-black text-[#ffe600]">
            <p className="text-xs font-black uppercase tracking-widest font-mono">
              ● SYSTEM READY — JUST JSON
            </p>
          </footer>
        </div>

        {/* ── RIGHT: editor panel ── */}
        <div className="relative w-full lg:w-[58%] bg-white flex flex-col">
          <div className="absolute inset-0 brutal-checker pointer-events-none" />

          <div className="relative z-10 flex flex-col flex-1 p-6 lg:p-8">
            {/* Editor header */}
            <div
              className="flex items-center justify-between mb-4 opacity-0 animate-brutal-slide"
              style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
            >
              <span className="text-xs font-black uppercase tracking-[0.25em]">
                {'>'} YOUR_CONFIG.JSON
              </span>
              {jsonInput.trim() && (
                <span
                  className={`brutal-tag font-mono ${
                    isValidJson
                      ? 'bg-[#00ff66] text-black'
                      : 'bg-[#ff2d2d] text-white animate-brutal-shake'
                  }`}
                >
                  {isValidJson ? 'VALID' : 'INVALID'}
                </span>
              )}
            </div>

            {/* Editor */}
            <div
              className="brutal-box brutal-shadow-lg flex flex-col flex-1 min-h-[360px] opacity-0 animate-brutal-drop"
              style={{ animationDelay: '350ms', animationFillMode: 'forwards' }}
            >
              {/* Title bar */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-black text-[#ffe600] border-b-4 border-black">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-4 h-4 bg-[#ff2d2d] border-2 border-[#ffe600]" />
                    <div className="w-4 h-4 bg-[#ffe600] border-2 border-black" />
                    <div className="w-4 h-4 bg-[#0040ff] border-2 border-black" />
                  </div>
                  <span className="font-mono text-xs font-bold">config.json</span>
                </div>
                <span className="font-mono text-xs font-bold">{lines.length} LN</span>
              </div>

              {/* Code area */}
              <div className="flex flex-1 bg-black overflow-hidden">
                <div className="py-4 pl-3 pr-2 border-r-4 border-[#ffe600] select-none shrink-0">
                  {lines.map((_, i) => (
                    <div
                      key={i}
                      className="font-mono text-xs leading-relaxed text-[#ffe600]/40 text-right w-7 font-bold"
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  spellCheck={false}
                  className="flex-1 bg-black text-[#00ff66] font-mono text-[13px] leading-relaxed py-4 px-4 resize-none focus:outline-none custom-scrollbar w-full min-h-[300px]"
                  placeholder="// PASTE JSON HERE..."
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-4 brutal-box-red p-4 text-sm font-black uppercase tracking-wide animate-brutal-shake">
                ⚠ {error}
              </div>
            )}

            {/* CTA */}
            <button
              onClick={handleSubmit}
              disabled={loading || !isValidJson}
              className="brutal-btn w-full mt-5 py-5 text-lg bg-[#ff2d2d] text-white opacity-0 animate-brutal-drop"
              style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}
            >
              {loading ? '▓▓▓ GENERATING... ▓▓▓' : '► GENERATE APP →'}
            </button>

            <p className="text-center text-[11px] font-black uppercase tracking-widest mt-4 opacity-60">
              Broken schemas · Missing fields · Invalid values — WE HANDLE IT
            </p>
          </div>
        </div>
      </div>

      <BrutalMarquee />
    </div>
  )
}
