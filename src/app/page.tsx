'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, type Variants } from 'framer-motion'
import { safeValidateConfig } from '@/lib/config-validator'

import BackgroundEffects from '@/components/landing/BackgroundEffects'
import BrutalMarquee from '@/components/landing/BrutalMarquee'
import HeroSection from '@/components/landing/HeroSection'
import FeatureCards from '@/components/landing/FeatureCards'
import StatsSection from '@/components/landing/StatsSection'
import QuickStartTemplates from '@/components/landing/QuickStartTemplates'
import CodeEditor from '@/components/landing/CodeEditor'
import LivePreview from '@/components/landing/LivePreview'
import GenerateButton from '@/components/landing/GenerateButton'

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

// Stagger container animation
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

const fadeSlideUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
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

  const loadTemplate = useCallback((name: string) => {
    setActiveTemplate(name)
    setJsonInput(TEMPLATE_DATA[name] ?? defaultJsonInput)
    setError(null)
  }, [])

  const handleSubmit = useCallback(async () => {
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
  }, [jsonInput, router])

  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/* Global effects */}
      <BackgroundEffects />

      {/* Top marquee */}
      <BrutalMarquee />

      {/* Main content */}
      <div className="flex flex-col lg:flex-row flex-1 min-h-0">
        {/* ── LEFT PANEL: Yellow Brutalist ── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative w-full lg:w-[32%] xl:w-[30%] bg-[#ffe600] brutal-border border-t-0 border-l-0 border-b-0 flex flex-col"
        >
          <div className="absolute inset-0 brutal-checker pointer-events-none" />

          {/* Header */}
          <motion.header
            variants={fadeSlideUp}
            className="relative z-10 p-6 lg:p-8 border-b-4 border-black"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-3xl lg:text-4xl font-black tracking-tighter leading-none">
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
          </motion.header>

          {/* Hero section */}
          <HeroSection />

          {/* Features */}
          <motion.div variants={fadeSlideUp} className="relative z-10 px-8 lg:px-12">
            <FeatureCards />
          </motion.div>

          {/* Stats */}
          <motion.div variants={fadeSlideUp} className="relative z-10 px-8 lg:px-12 mt-8">
            <StatsSection />
          </motion.div>

          {/* Quick Start */}
          <motion.div variants={fadeSlideUp} className="relative z-10 px-8 lg:px-12 mt-8 pb-8">
            <QuickStartTemplates
              activeTemplate={activeTemplate}
              onSelect={loadTemplate}
            />
          </motion.div>

          {/* Footer */}
          <footer className="relative z-10 p-6 border-t-4 border-black bg-black text-[#ffe600] mt-auto">
            <p className="text-xs font-black uppercase tracking-widest font-mono flex items-center gap-2">
              <span className="pulse-dot-green" style={{ width: 6, height: 6 }} />
              SYSTEM READY — JUST JSON
            </p>
          </footer>
        </motion.div>

        {/* ── RIGHT PANEL: Editor + Preview ── */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] as const }}
          className="relative w-full lg:w-[68%] xl:w-[70%] bg-[#111] flex flex-col"
        >
          <div className="absolute inset-0 brutal-checker pointer-events-none opacity-50" />

          <div className="relative z-10 flex flex-col flex-1 p-6 lg:p-10 xl:p-12">
            {/* Editor header */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex items-center justify-between mb-4"
            >
              <span className="text-xs font-black uppercase tracking-[0.25em] text-white/70 font-mono">
                {'>'} YOUR_CONFIG.JSON
              </span>
            </motion.div>

            {/* Code Editor */}
            <CodeEditor
              value={jsonInput}
              onChange={setJsonInput}
              isValid={isValidJson}
            />

            {/* Live Preview */}
            <LivePreview jsonInput={jsonInput} isValid={isValidJson} />

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 brutal-box-red p-4 text-sm font-black uppercase tracking-wide animate-brutal-shake"
              >
                ⚠ {error}
              </motion.div>
            )}

            {/* Generate Button */}
            <div className="mt-5">
              <GenerateButton
                onGenerate={handleSubmit}
                disabled={!isValidJson}
                loading={loading}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom marquee */}
      <BrutalMarquee />
    </div>
  )
}
