'use client'

import { EntityConfig, FieldConfig } from '@/types/config'
import { useState, useEffect } from 'react'
import ErrorBoundary from './ErrorBoundary'

interface FormRendererProps {
  entity: EntityConfig
  appId: string
  onSuccess?: () => void
}

export default function FormRenderer({ entity, appId, onSuccess }: FormRendererProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const getDefaultValue = (field: FieldConfig): unknown => {
    switch (field.type) {
      case 'string':
      case 'text':
        return ''
      case 'number':
        return 0
      case 'boolean':
        return false
      case 'date':
        return ''
      case 'enum':
        return field.values?.[0] || ''
      default:
        return ''
    }
  }

  useEffect(() => {
    const initialData: Record<string, unknown> = {}
    entity.fields.forEach((field) => {
      initialData[field.name] = field.defaultValue ?? getDefaultValue(field)
    })
    setFormData(initialData)
  }, [entity.fields])

  const handleChange = (fieldName: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }))
    if (error) setError(null)
    if (success) setSuccess(false)
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch(`/api/runtime/${appId}/${entity.name}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        setError('FAILED TO SAVE RECORD')
        return
      }

      setSuccess(true)
      const resetData: Record<string, unknown> = {}
      entity.fields.forEach((field) => {
        resetData[field.name] = field.defaultValue ?? getDefaultValue(field)
      })
      setFormData(resetData)
      onSuccess?.()
    } catch (err) {
      setError('FAILED TO SAVE RECORD')
      console.error('Form submission error:', err)
    } finally {
      setLoading(false)
    }
  }

  const renderField = (field: FieldConfig) => {
    const value = formData[field.name]
    const isEmpty = field.required && (value === '' || value === null || value === undefined)
    const inputClassName = `w-full px-3 py-2.5 font-mono text-sm font-bold bg-white brutal-border focus:outline-none focus:bg-[#ffe600]/30 ${
      isEmpty ? 'border-[#ff2d2d] bg-red-50' : ''
    }`

    const handleFieldChange = (newValue: unknown) => handleChange(field.name, newValue)

    switch (field.type) {
      case 'string':
        return (
          <input
            type="text"
            value={String(value || '')}
            onChange={(e) => handleFieldChange(e.target.value)}
            className={inputClassName}
          />
        )
      case 'text':
        return (
          <textarea
            value={String(value || '')}
            onChange={(e) => handleFieldChange(e.target.value)}
            className={`${inputClassName} min-h-[100px] resize-y`}
            rows={4}
          />
        )
      case 'number':
        return (
          <input
            type="number"
            value={Number(value) || 0}
            onChange={(e) => handleFieldChange(Number(e.target.value))}
            className={inputClassName}
          />
        )
      case 'boolean':
        return (
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => handleFieldChange(e.target.checked)}
            className="w-5 h-5 brutal-border accent-black"
          />
        )
      case 'date':
        return (
          <input
            type="date"
            value={String(value || '')}
            onChange={(e) => handleFieldChange(e.target.value)}
            className={inputClassName}
          />
        )
      case 'enum':
        return (
          <select
            value={String(value || '')}
            onChange={(e) => handleFieldChange(e.target.value)}
            className={inputClassName}
          >
            {field.values?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )
      default:
        return (
          <input
            type="text"
            value={String(value || '')}
            onChange={(e) => handleFieldChange(e.target.value)}
            className={inputClassName}
          />
        )
    }
  }

  return (
    <ErrorBoundary>
      <div className="brutal-box brutal-shadow-lg p-6 bg-white">
        <div className="flex items-center justify-between mb-6 pb-4 border-b-4 border-black">
          <h2 className="text-xl font-black uppercase tracking-tight">
            {entity.name} FORM
          </h2>
          <span className="brutal-tag bg-[#0040ff] text-white font-mono text-[10px]">
            NEW
          </span>
        </div>

        {error && (
          <div className="brutal-box-red p-4 mb-4 text-sm font-black uppercase animate-brutal-shake">
            ⚠ {error}
          </div>
        )}

        {success && (
          <div className="brutal-border bg-[#00ff66] text-black p-4 mb-4 text-sm font-black uppercase">
            ✓ RECORD SAVED
          </div>
        )}

        <div role="form" className="space-y-5">
          {entity.fields.map((field) => (
            <div key={field.name}>
              <label className="block text-xs font-black uppercase tracking-wider mb-2">
                {field.label || field.name}
                {field.required && <span className="text-[#ff2d2d] ml-1">*</span>}
              </label>
              {renderField(field)}
            </div>
          ))}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="brutal-btn w-full sm:w-auto mt-2 px-8 py-4 text-sm bg-[#ff2d2d] text-white disabled:opacity-40"
          >
            {loading ? '▓ SAVING... ▓' : '► SAVE RECORD'}
          </button>
        </div>
      </div>
    </ErrorBoundary>
  )
}
