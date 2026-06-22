'use client'

import { useState } from 'react'
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

export default function Home() {
  const [jsonInput, setJsonInput] = useState(defaultJsonInput)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      // 1. Parse JSON input
      let parsedJson
      try {
        parsedJson = JSON.parse(jsonInput)
      } catch {
        setError('Invalid JSON: please check your syntax')
        return
      }

      // 2. Validate config
      const validationResult = safeValidateConfig(parsedJson)
      if (!validationResult.success) {
        setError(validationResult.error)
        return
      }

      // 3. Register app
      const response = await fetch('/api/runtime/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(parsedJson)
      })

      if (!response.ok) {
        setError('Failed to register app')
        return
      }

      // 4. Redirect to app
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-5xl font-bold text-white">AppForge</h1>
            <span className="bg-purple-600 text-white text-sm px-2 py-1 rounded-full">
              AI App Generator
            </span>
          </div>
          <p className="text-xl text-slate-300">
            Paste your JSON config and get a live app instantly
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-slate-800 rounded-xl shadow-2xl p-8">
          <label className="block text-white text-lg font-medium mb-4">
            App Configuration (JSON)
          </label>
          
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            rows={20}
            className="w-full p-4 bg-slate-900 text-slate-100 border border-slate-600 rounded-lg font-mono text-sm resize-none focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            placeholder="Enter your JSON configuration..."
          />

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
              {error}
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-6 py-4 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium text-lg rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Generating...
              </>
            ) : (
              'Generate App'
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-slate-400">
          Built with Next.js + Prisma + PostgreSQL
        </div>
      </div>
    </div>
  )
}