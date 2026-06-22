'use client'

import { EntityConfig } from '@/types/config'
import { useState, useEffect } from 'react'
import ErrorBoundary from './ErrorBoundary'

interface TableRendererProps {
  entity: EntityConfig
  appId: string
  onAddNew?: () => void
}

interface AppRecord {
  id: string
  data: Record<string, unknown>
  createdAt: string
}

export default function TableRenderer({ entity, appId, onAddNew }: TableRendererProps) {
  const [records, setRecords] = useState<AppRecord[]>([])
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
        setError('FAILED TO LOAD RECORDS')
      }
    } catch (err) {
      setError('FAILED TO LOAD RECORDS')
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
        method: 'DELETE',
      })
      if (response.ok) {
        await fetchRecords()
      } else {
        setError('FAILED TO DELETE RECORD')
      }
    } catch (err) {
      setError('FAILED TO DELETE RECORD')
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
        minute: '2-digit',
      })
    } catch {
      return dateString
    }
  }

  return (
    <ErrorBoundary>
      <div className="brutal-box brutal-shadow-lg p-6 bg-white">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6 pb-4 border-b-4 border-black">
          <h2 className="text-xl font-black uppercase tracking-tight">
            {entity.name} RECORDS
          </h2>
          {onAddNew && (
            <button
              onClick={onAddNew}
              className="brutal-btn px-4 py-2.5 text-xs bg-[#ff2d2d] text-white"
            >
              + ADD NEW
            </button>
          )}
        </div>

        {loading && (
          <div className="py-12 text-center">
            <p className="text-lg font-black uppercase font-mono animate-brutal-blink">
              LOADING...
            </p>
          </div>
        )}

        {error && (
          <div className="brutal-box-red p-4 mb-4 text-sm font-black uppercase animate-brutal-shake">
            ⚠ {error}
          </div>
        )}

        {!loading && !error && records.length === 0 && (
          <div className="brutal-border bg-[#ffe600] p-10 text-center">
            <p className="text-lg font-black uppercase">NO RECORDS YET</p>
            <p className="text-xs font-bold mt-2 font-mono opacity-60">
              // HIT &quot;ADD NEW&quot; TO CREATE ONE
            </p>
          </div>
        )}

        {!loading && !error && records.length > 0 && (
          <div className="overflow-x-auto brutal-border">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-black text-[#ffe600]">
                  {entity.fields.map((field) => (
                    <th
                      key={field.name}
                      className="border-r-4 border-[#ffe600] px-4 py-3 text-left text-xs font-black uppercase tracking-wide last:border-r-0"
                    >
                      {field.label || field.name}
                    </th>
                  ))}
                  <th className="border-r-4 border-[#ffe600] px-4 py-3 text-left text-xs font-black uppercase tracking-wide">
                    CREATED
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wide">
                    ACT
                  </th>
                </tr>
              </thead>
              <tbody>
                {records.map((record, rowIdx) => (
                  <tr
                    key={record.id}
                    className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-[#ffe600]/20'}
                  >
                    {entity.fields.map((field) => (
                      <td
                        key={field.name}
                        className="border-t-4 border-black px-4 py-3 text-sm font-mono font-bold"
                      >
                        {String(record.data[field.name] ?? '—')}
                      </td>
                    ))}
                    <td className="border-t-4 border-black px-4 py-3 text-xs font-mono font-bold">
                      {formatDate(record.createdAt)}
                    </td>
                    <td className="border-t-4 border-black px-4 py-3">
                      <button
                        onClick={() => handleDelete(record.id)}
                        className="brutal-btn px-3 py-1.5 text-[10px] bg-black text-[#ffe600]"
                      >
                        DEL
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
