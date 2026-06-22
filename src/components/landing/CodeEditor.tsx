'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  isValid: boolean
}

// Simple JSON syntax highlighter
function highlightJSON(code: string): string {
  return code
    // Strings (keys and values)
    .replace(
      /("(?:[^"\\]|\\.)*")\s*:/g,
      '<span style="color:#ffe600">$1</span>:'
    )
    .replace(
      /:\s*("(?:[^"\\]|\\.)*")/g,
      ': <span style="color:#00ff66">$1</span>'
    )
    // Standalone strings in arrays
    .replace(
      /(\[|,)\s*("(?:[^"\\]|\\.)*")/g,
      '$1 <span style="color:#00ff66">$2</span>'
    )
    // Numbers
    .replace(
      /:\s*(\d+\.?\d*)/g,
      ': <span style="color:#00d4ff">$1</span>'
    )
    // Booleans
    .replace(
      /:\s*(true|false)/g,
      ': <span style="color:#ff2d2d">$1</span>'
    )
    // null
    .replace(
      /:\s*(null)/g,
      ': <span style="color:#888">$1</span>'
    )
    // Braces and brackets
    .replace(/([{}[\]])/g, '<span style="color:#fff;font-weight:bold">$1</span>')
}

export default function CodeEditor({ value, onChange, isValid }: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const preRef = useRef<HTMLPreElement>(null)
  const lineNumbersRef = useRef<HTMLDivElement>(null)
  const hasTyped = useRef(false)
  const [activeLine, setActiveLine] = useState(0)
  const [isTyping, setIsTyping] = useState(false)

  const lines = useMemo(() => value.split('\n'), [value])

  const typingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const fullTextRef = useRef(value)

  // Skip typing animation instantly
  const skipTyping = useCallback(() => {
    if (!isTyping) return
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current)
    typingIntervalRef.current = null
    onChange(fullTextRef.current)
    setIsTyping(false)
  }, [isTyping, onChange])

  // Fake typing effect on first mount — fast, skippable
  useEffect(() => {
    if (hasTyped.current) return
    hasTyped.current = true
    fullTextRef.current = value

    setIsTyping(true)
    let currentIndex = 0
    const fullText = value

    // Start with empty
    onChange('')

    typingIntervalRef.current = setInterval(() => {
      currentIndex += 4 + Math.floor(Math.random() * 5) // 4-8 chars at a time
      if (currentIndex >= fullText.length) {
        currentIndex = fullText.length
        if (typingIntervalRef.current) clearInterval(typingIntervalRef.current)
        typingIntervalRef.current = null
        setIsTyping(false)
      }
      onChange(fullText.slice(0, currentIndex))
    }, 8) // Very fast interval

    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync scroll between textarea and highlighted output
  const handleScroll = useCallback(() => {
    if (textareaRef.current && preRef.current && lineNumbersRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop
      preRef.current.scrollLeft = textareaRef.current.scrollLeft
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop
    }
  }, [])

  // Track active line from cursor position
  const handleSelect = useCallback(() => {
    if (!textareaRef.current) return
    const pos = textareaRef.current.selectionStart
    const textBefore = textareaRef.current.value.slice(0, pos)
    const lineNum = (textBefore.match(/\n/g) || []).length
    setActiveLine(lineNum)
  }, [])

  const highlighted = useMemo(() => highlightJSON(value), [value])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="brutal-box brutal-shadow-lg flex flex-col flex-1 min-h-[360px]"
    >
      {/* Title bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-black text-[#ffe600] border-b-4 border-black">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3.5 h-3.5 bg-[#ff2d2d] border-2 border-[#ffe600]" />
            <div className="w-3.5 h-3.5 bg-[#ffe600] border-2 border-black" />
            <div className="w-3.5 h-3.5 bg-[#0040ff] border-2 border-black" />
          </div>
          <span className="font-mono text-xs font-bold tracking-wider">config.json</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold opacity-60">{lines.length} LN</span>
          {/* Validation indicator */}
          <AnimatePresence mode="wait">
            <motion.div
              key={isValid ? 'valid' : 'invalid'}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-1.5"
            >
              <span className={isValid ? 'pulse-dot-green' : 'pulse-dot-red'} />
              <span
                className={`font-mono text-xs font-black tracking-wider ${
                  isValid ? 'text-[#00ff66]' : 'text-[#ff2d2d]'
                }`}
              >
                {isValid ? 'VALID' : 'INVALID'}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Code area */}
      <div className="flex flex-1 bg-[#0a0a0a] overflow-hidden relative">
        {/* Line numbers */}
        <div
          ref={lineNumbersRef}
          className="py-4 pl-3 pr-3 border-r-2 border-[#ffe600]/20 select-none shrink-0 overflow-hidden"
        >
          {lines.map((_, i) => (
            <div
              key={i}
              className={`font-mono text-xs leading-relaxed text-right w-7 font-bold transition-colors duration-100 ${
                i === activeLine ? 'text-[#ffe600]' : 'text-[#ffe600]/25'
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* Code container */}
        <div className="relative flex-1 overflow-hidden">
          {/* Active line highlight */}
          <div
            className="absolute left-0 right-0 pointer-events-none transition-transform duration-75"
            style={{
              top: 0,
              height: '1.65rem',
              transform: `translateY(calc(1rem + ${activeLine} * 1.65rem))`,
              background: 'rgba(255, 230, 0, 0.04)',
              borderLeft: '2px solid rgba(255, 230, 0, 0.3)',
            }}
            aria-hidden="true"
          />

          {/* Highlighted output (visual layer) */}
          <pre
            ref={preRef}
            className="absolute inset-0 py-4 px-4 font-mono text-[13px] leading-relaxed text-[#00ff66] overflow-hidden whitespace-pre pointer-events-none"
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: highlighted + (isTyping ? '<span class="animate-brutal-blink" style="color:#ffe600">▊</span>' : '') }}
          />

          {/* Textarea (input layer) */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              if (isTyping) {
                skipTyping()
              } else {
                onChange(e.target.value)
              }
            }}
            onScroll={handleScroll}
            onSelect={handleSelect}
            onClick={(e) => {
              if (isTyping) skipTyping()
              handleSelect()
            }}
            onKeyUp={handleSelect}
            onFocus={() => { if (isTyping) skipTyping() }}
            spellCheck={false}
            className="relative z-10 w-full h-full bg-transparent text-transparent caret-[#ffe600] font-mono text-[13px] leading-relaxed py-4 px-4 resize-none focus:outline-none selection:bg-[#ffe600]/20"
            placeholder="// PASTE JSON HERE..."
            style={{ caretColor: '#ffe600' }}
          />
        </div>
      </div>
    </motion.div>
  )
}
