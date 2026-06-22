'use client'

import { EntityConfig } from '@/types/config'
import { useState, useEffect } from 'react'
import ErrorBoundary from './ErrorBoundary'

interface TableRendererProps {
  entity: EntityConfig
  appId: string
  onAddNew?: () => void
}

interface Record {
  id: string
  data: Record<string, unknown>
  createdAt: string
}

export default function TableRenderer({ entity, appId, onAddNew }: TableRendererProps) {
  const [records, setRecords] = useState<Record[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRecords = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/runtime/${appId}/${entity.name}`)

      if (response.ok) {
        const data = await response.json()
        setRecords(data.records)
      } else {
        setError('Failed to load records')
      }
    } catch (err) {
      setError('Failed to load records')
      console.error('Error fetching records:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecords()
  }, [appId, entity.name])

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/runtime/${appId}/${entity.name}?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchRecords() // Refresh the list
      } else {
        setError('Failed to delete record')
      }
    } catch (err) {
      setError('Failed to delete record')
      console.error('Error deleting record:', err)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  return (
    <ErrorBoundary>
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{entity.name} Records</h2>
          {onAddNew && (
            <button
              onClick={onAddNew}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              Add New
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && records.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No records yet
          </div>
        )}

        {/* Table */}
        {!loading && !error && records.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  {entity.fields.map((field) => (
                    <th
                      key={field.name}
                      className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700"
                    >
                      {field.label || field.name}
                    </th>
                  ))}
                  <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">
                    Created At
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    {entity.fields.map((field) => (
                      <td
                        key={field.name}
                        className="border border-gray-300 px-4 py-2 text-sm"
                      >
                        {String(record.data[field.name] ?? '')}
                      </td>
                    ))}
                    <td className="border border-gray-300 px-4 py-2 text-sm">
                      {formatDate(record.createdAt)}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        onClick={() => handleDelete(record.id)}
                        className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-1 px-3 rounded transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ErrorBoundary>
  )
}