'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  isValid: boolean
}

function highlightJSON(code: string): string {
  // Escape only &, < and > to prevent HTML injection — quotes stay as "
  const escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  return escaped
    // JSON keys: "word":
    .replace(
      /("(?:[^"\\]|\\.)*")(\s*)(:)/g,
      '<span style="color:#ffe600">$1</span>$2$3'
    )
    // String values after colon
    .replace(
      /(:\s*)("(?:[^"\\]|\\.)*")/g,
      '$1<span style="color:#00ff66">$2</span>'
    )
    // Strings in arrays (after [ or ,)
    .replace(
      /([,[\]]\s*)("(?:[^"\\]|\\.)*")/g,
      '$1<span style="color:#00ff66">$2</span>'
    )
    // Numbers
    .replace(/(:\s*)(-?\d+\.?\d*)/g, '$1<span style="color:#00d4ff">$2</span>')
    // Booleans
    .replace(/(:\s*)(true|false)\b/g, '$1<span style="color:#ff6b6b">$2</span>')
    // null
    .replace(/(:\s*)(null)\b/g, '$1<span style="color:#888">$2</span>')
    // Structural chars
    .replace(/([{}[\]])/g, '<span style="color:#fff;font-weight:bold">$1</span>')
}

export default function CodeEditor({ value, onChange, isValid }: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const preRef = useRef<HTMLPreElement>(null)
  const lineNumbersRef = useRef<HTMLDivElement>(null)
  const hasTyped = useRef(false)
  const [activeLine, setActiveLine] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const typingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const fullTextRef = useRef(value)

  const lines = useMemo(() => value.split('\n'), [value])
  const lineCount = lines.length

  // Skip typing animation instantly on any interaction
  const skipTyping = useCallback(() => {
    if (!isTyping) return
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current)
    typingIntervalRef.current = null
    onChange(fullTextRef.current)
    setIsTyping(false)
  }, [isTyping, onChange])

  // Fast typing animation on first mount
  useEffect(() => {
    if (hasTyped.current) return
    hasTyped.current = true
    fullTextRef.current = value
    setIsTyping(true)
    let currentIndex = 0
    const fullText = value
    onChange('')

    typingIntervalRef.current = setInterval(() => {
      currentIndex += 6 + Math.floor(Math.random() * 6) // 6-11 chars at a time — fast
      if (currentIndex >= fullText.length) {
        currentIndex = fullText.length
        if (typingIntervalRef.current) clearInterval(typingIntervalRef.current)
        typingIntervalRef.current = null
        setIsTyping(false)
      }
      onChange(fullText.slice(0, currentIndex))
    }, 6) // very fast

    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync scroll: textarea → pre + line numbers
  const syncScroll = useCallback(() => {
    if (!textareaRef.current) return
    if (preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop
      preRef.current.scrollLeft = textareaRef.current.scrollLeft
    }
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop
    }
  }, [])

  // Track active line from cursor position
  const handleCursorMove = useCallback(() => {
    if (!textareaRef.current) return
    const pos = textareaRef.current.selectionStart
    const textBefore = textareaRef.current.value.slice(0, pos)
    setActiveLine((textBefore.match(/\n/g) || []).length)
  }, [])

  const highlighted = useMemo(() => highlightJSON(value), [value])

  // Line height must match textarea's leading-relaxed at text-[13px]
  // 13px * 1.625 (relaxed) ≈ 21.125px — we use 21px for CSS consistency
  const LINE_HEIGHT = 21

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="brutal-box brutal-shadow-lg flex flex-col flex-1 min-h-0"
      style={{ minHeight: '400px' }}
    >
      {/* ── Title bar ── */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-black text-[#ffe600] border-b-4 border-[#ffe600] shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff2d2d] border border-[#ffe600]/60" />
            <div className="w-3 h-3 rounded-full bg-[#ffe600] border border-black/60" />
            <div className="w-3 h-3 rounded-full bg-[#0040ff] border border-black/60" />
          </div>
          <span className="font-mono text-xs font-bold tracking-wider">config.json</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold opacity-50">{lineCount} LN</span>
          <AnimatePresence mode="wait">
            <motion.div
              key={isValid ? 'valid' : 'invalid'}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-1.5"
            >
              <span className={isValid ? 'pulse-dot-green' : 'pulse-dot-red'} />
              <span
                className={`font-mono text-[10px] font-black tracking-widest ${
                  isValid ? 'text-[#00ff66]' : 'text-[#ff2d2d]'
                }`}
              >
                {isValid ? 'VALID' : 'INVALID'}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Editor body (fills remaining height, never overflows) ── */}
      <div className="flex flex-1 bg-[#0a0a0a] overflow-hidden min-h-0">

        {/* Line numbers — scrolls vertically only, synced with textarea */}
        <div
          ref={lineNumbersRef}
          className="shrink-0 overflow-hidden select-none border-r border-[#ffe600]/15"
          style={{ width: '44px', paddingTop: '1rem', paddingBottom: '1rem' }}
        >
          {lines.map((_, i) => (
            <div
              key={i}
              className="text-right pr-3 font-mono font-bold transition-colors duration-75"
              style={{
                height: `${LINE_HEIGHT}px`,
                lineHeight: `${LINE_HEIGHT}px`,
                fontSize: '12px',
                color: i === activeLine ? '#ffe600' : 'rgba(255,230,0,0.2)',
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* Code area — textarea + highlighted pre stacked */}
        <div className="relative flex-1 overflow-hidden">
          {/* Active line highlight band */}
          <div
            className="absolute left-0 right-0 pointer-events-none z-0 transition-transform duration-75"
            style={{
              height: `${LINE_HEIGHT}px`,
              transform: `translateY(calc(1rem + ${activeLine} * ${LINE_HEIGHT}px))`,
              background: 'rgba(255, 230, 0, 0.04)',
              borderLeft: '2px solid rgba(255, 230, 0, 0.25)',
            }}
            aria-hidden="true"
          />

          {/* Highlighted output — perfectly overlays textarea */}
          <pre
            ref={preRef}
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none z-10 overflow-hidden"
            style={{
              padding: '1rem',
              fontFamily: 'monospace',
              fontSize: '13px',
              lineHeight: `${LINE_HEIGHT}px`,
              color: '#00ff66',
              whiteSpace: 'pre',
              wordBreak: 'normal',
              margin: 0,
            }}
            dangerouslySetInnerHTML={{
              __html:
                highlighted +
                (isTyping
                  ? '<span class="animate-brutal-blink" style="color:#ffe600;font-weight:bold">▋</span>'
                  : ''),
            }}
          />

          {/* Textarea — transparent text, yellow caret, scrollable */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              if (isTyping) skipTyping()
              else onChange(e.target.value)
            }}
            onScroll={syncScroll}
            onSelect={handleCursorMove}
            onClick={() => {
              if (isTyping) skipTyping()
              handleCursorMove()
            }}
            onKeyUp={handleCursorMove}
            onFocus={() => { if (isTyping) skipTyping() }}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            className="absolute inset-0 z-20 w-full h-full resize-none focus:outline-none selection:bg-[#ffe600]/20"
            placeholder="// PASTE YOUR JSON CONFIG HERE..."
            style={{
              background: 'transparent',
              color: 'transparent',
              caretColor: '#ffe600',
              fontFamily: 'monospace',
              fontSize: '13px',
              lineHeight: `${LINE_HEIGHT}px`,
              padding: '1rem',
              whiteSpace: 'pre',
              wordBreak: 'normal',
              overflowX: 'auto',
              overflowY: 'auto',
              tabSize: 2,
            }}
          />
        </div>
      </div>

      {/* ── Skip typing hint ── */}
      <AnimatePresence>
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="shrink-0 px-4 py-1.5 bg-black border-t border-[#ffe600]/20 text-[10px] font-mono text-[#ffe600]/50 flex justify-between items-center"
          >
            <span>● LOADING CONFIG...</span>
            <button
              onClick={skipTyping}
              className="text-[#ffe600]/70 hover:text-[#ffe600] transition-colors font-bold uppercase tracking-wider"
            >
              [CLICK TO SKIP]
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
