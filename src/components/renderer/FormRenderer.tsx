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
    entity.fields.forEach(field => {
      initialData[field.name] = field.defaultValue ?? getDefaultValue(field)
    })
    setFormData(initialData)
  }, [entity.fields])

  const handleChange = (fieldName: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }))
    // Clear messages when user starts typing
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
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        setError('Failed to save record')
        return
      }

      setSuccess(true)
      // Reset form to defaults
      const resetData: Record<string, unknown> = {}
      entity.fields.forEach(field => {
        resetData[field.name] = field.defaultValue ?? getDefaultValue(field)
      })
      setFormData(resetData)
      onSuccess?.()

    } catch (err) {
      setError('Failed to save record')
      console.error('Form submission error:', err)
    } finally {
      setLoading(false)
    }
  }

  const renderField = (field: FieldConfig) => {
    const value = formData[field.name]
    const isEmpty = field.required && (value === '' || value === null || value === undefined)
    const inputClassName = `border rounded px-3 py-2 w-full ${
      isEmpty ? 'border-red-500' : 'border-gray-300'
    } focus:outline-none focus:border-blue-500`

    const handleFieldChange = (newValue: unknown) => {
      handleChange(field.name, newValue)
    }

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
            className={`${inputClassName} min-h-[100px]`}
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
            className="w-4 h-4"
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
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">{entity.name} Form</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Record saved successfully!
          </div>
        )}
        
        <div role="form" className="space-y-4">
          {entity.fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label || field.name}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderField(field)}
            </div>
          ))}
          
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            {loading ? 'Saving...' : 'Save Record'}
          </button>
        </div>
      </div>
    </ErrorBoundary>
  )
}