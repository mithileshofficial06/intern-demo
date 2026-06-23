'use client'

import { EntityConfig, FieldConfig } from '@/types/config'
import { useState, useEffect } from 'react'
import ErrorBoundary from './ErrorBoundary'
import { notify } from '@/lib/notifications'

interface FormRendererProps {
  entity: EntityConfig
  appId: string
  onSuccess?: () => void
  recordId?: string
  initialData?: Record<string, unknown>
}

export default function FormRenderer({ entity, appId, onSuccess, recordId, initialData }: FormRendererProps) {
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
    if (recordId && initialData) {
      setFormData(initialData)
    } else {
      const initialDataObj: Record<string, unknown> = {}
      entity.fields.forEach((field) => {
        initialDataObj[field.name] = field.defaultValue ?? getDefaultValue(field)
      })
      setFormData(initialDataObj)
    }
  }, [entity.fields, recordId, initialData])

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
      const url = recordId
        ? `/api/runtime/${appId}/${entity.name}?id=${recordId}`
        : `/api/runtime/${appId}/${entity.name}`
      const method = recordId ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        notify.error('Failed to save record', `${entity.name.toUpperCase()} ERROR`)
        setError('FAILED TO SAVE RECORD')
        return
      }

      notify.success(
        recordId ? `Record updated in ${entity.name}` : `Record added to ${entity.name}`,
        recordId ? 'RECORD UPDATED' : 'RECORD SAVED'
      )
      setSuccess(true)
      
      if (!recordId) {
        const resetData: Record<string, unknown> = {}
        entity.fields.forEach((field) => {
          resetData[field.name] = field.defaultValue ?? getDefaultValue(field)
        })
        setFormData(resetData)
      }
      onSuccess?.()
    } catch (err) {
      notify.error('Failed to save record')
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
            {entity.name} {recordId ? 'EDIT FORM' : 'FORM'}
          </h2>
          <span className={`brutal-tag text-white font-mono text-[10px] ${recordId ? 'bg-purple-600' : 'bg-[#0040ff]'}`}>
            {recordId ? 'EDIT' : 'NEW'}
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
            {loading ? '▓ SAVING... ▓' : recordId ? '► UPDATE RECORD' : '► SAVE RECORD'}
          </button>
        </div>
      </div>
    </ErrorBoundary>
  )
}
