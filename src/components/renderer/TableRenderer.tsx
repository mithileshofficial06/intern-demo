'use client'

import { EntityConfig } from '@/types/config'
import { useState, useEffect } from 'react'
import ErrorBoundary from './ErrorBoundary'
import { notify } from '@/lib/notifications'
import FormRenderer from './FormRenderer'

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

function parseCSV(text: string): string[][] {
  const lines = text.split(/\r?\n/)
  return lines
    .map(line => {
      const result: string[] = []
      let current = ''
      let inQuotes = false
      for (let i = 0; i < line.length; i++) {
        const char = line[i]
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim())
          current = ''
        } else {
          current += char
        }
      }
      result.push(current.trim())
      return result
    })
    .filter(row => row.length > 0 && row.some(cell => cell !== ''))
}

export default function TableRenderer({ entity, appId, onAddNew }: TableRendererProps) {
  const [records, setRecords] = useState<AppRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Search & Pagination state
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  // Edit Modal State
  const [editingRecord, setEditingRecord] = useState<AppRecord | null>(null)

  // CSV Import State
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [csvError, setCsvError] = useState('')
  const [importing, setImporting] = useState(false)
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])
  const [csvData, setCsvData] = useState<string[][]>([])
  const [mappings, setMappings] = useState<Record<string, string>>({})

  const fetchRecords = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `/api/runtime/${appId}/${entity.name}?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
      )
      if (response.ok) {
        const data = await response.json()
        setRecords(data.records)
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages)
          setTotalCount(data.pagination.totalCount)
        }
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
    setPage(1)
    setSearch('')
  }, [entity.name])

  useEffect(() => {
    fetchRecords()
  }, [appId, entity.name, page])

  const handleSearch = () => {
    if (page === 1) {
      fetchRecords()
    } else {
      setPage(1)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/runtime/${appId}/${entity.name}?id=${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        notify.success(`Record removed from ${entity.name}`, 'DELETED')
        await fetchRecords()
      } else {
        notify.error('Failed to delete record')
        setError('FAILED TO DELETE RECORD')
      }
    } catch (err) {
      notify.error('Failed to delete record')
      setError('FAILED TO DELETE RECORD')
      console.error('Error deleting record:', err)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      const parsed = parseCSV(text)
      if (parsed.length === 0) {
        setCsvError('CSV is empty')
        return
      }
      const headers = parsed[0]
      setCsvHeaders(headers)
      setCsvData(parsed.slice(1))
      
      const initialMappings: Record<string, string> = {}
      entity.fields.forEach(field => {
        const matchedHeader = headers.find(h => 
          h.toLowerCase() === field.name.toLowerCase() || 
          h.toLowerCase() === (field.label || '').toLowerCase()
        )
        initialMappings[field.name] = matchedHeader || ''
      })
      setMappings(initialMappings)
      setCsvError('')
    }
    reader.readAsText(file)
  }

  const handleImportSubmit = async () => {
    setImporting(true)
    setCsvError('')
    try {
      const recordsToImport = csvData.map(row => {
        const recordData: Record<string, any> = {}
        entity.fields.forEach(field => {
          const mappedHeader = mappings[field.name]
          const headerIdx = csvHeaders.indexOf(mappedHeader)
          if (headerIdx !== -1) {
            let val: any = row[headerIdx]
            if (field.type === 'number') {
              val = Number(val) || 0
            } else if (field.type === 'boolean') {
              val = val === 'true' || val === '1' || val === 'yes'
            }
            recordData[field.name] = val
          } else {
            recordData[field.name] = field.defaultValue ?? (field.type === 'number' ? 0 : field.type === 'boolean' ? false : '')
          }
        })
        return recordData
      })

      const response = await fetch(`/api/runtime/${appId}/${entity.name}/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recordsToImport)
      })

      if (response.ok) {
        notify.success(`${recordsToImport.length} records imported!`, 'IMPORT SUCCESS')
        setIsImportOpen(false)
        setCsvData([])
        setCsvHeaders([])
        fetchRecords()
      } else {
        const errData = await response.json()
        setCsvError(errData.error || 'Failed to import CSV')
      }
    } catch (err) {
      console.error(err)
      setCsvError('Error importing records')
    } finally {
      setImporting(false)
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
        {/* Header bar */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6 pb-4 border-b-4 border-black">
          <h2 className="text-xl font-black uppercase tracking-tight">
            {entity.name} RECORDS
          </h2>
          <div className="flex gap-2.5">
            <button
              onClick={() => setIsImportOpen(true)}
              className="brutal-btn px-4 py-2.5 text-xs bg-[#ffe600] text-black"
            >
              CSV IMPORT
            </button>
            {onAddNew && (
              <button
                onClick={onAddNew}
                className="brutal-btn px-4 py-2.5 text-xs bg-[#ff2d2d] text-white"
              >
                + ADD NEW
              </button>
            )}
          </div>
        </div>

        {/* Search bar */}
        <div className="flex gap-2.5 mb-6">
          <input
            type="text"
            placeholder="Search records..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-4 py-2.5 bg-white border-4 border-black font-mono text-sm font-bold placeholder-black/40 focus:outline-none focus:bg-[#ffe600]/10"
          />
          <button
            onClick={handleSearch}
            className="brutal-btn bg-black text-[#ffe600] px-5 py-2.5 font-mono font-black uppercase text-xs"
          >
            SEARCH
          </button>
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
              // HIT &quot;ADD NEW&quot; OR &quot;CSV IMPORT&quot; TO BEGIN
            </p>
          </div>
        )}

        {!loading && !error && records.length > 0 && (
          <>
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
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingRecord(record)}
                            className="brutal-btn px-2.5 py-1.5 text-[10px] bg-[#ffe600] text-black"
                          >
                            EDIT
                          </button>
                          <button
                            onClick={() => handleDelete(record.id)}
                            className="brutal-btn px-2.5 py-1.5 text-[10px] bg-black text-[#ffe600]"
                          >
                            DEL
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t-4 border-black font-mono text-sm">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="brutal-btn bg-black text-white px-3 py-1.5 text-xs disabled:opacity-40"
              >
                PREV
              </button>
              <span className="font-bold uppercase text-xs">
                PAGE {page} OF {totalPages} ({totalCount} TOTAL)
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="brutal-btn bg-black text-white px-3 py-1.5 text-xs disabled:opacity-40"
              >
                NEXT
              </button>
            </div>
          </>
        )}
      </div>

      {/* Edit Record Modal */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-lg brutal-box brutal-shadow-lg bg-white p-6 border-4 border-black">
            <button
              onClick={() => setEditingRecord(null)}
              className="absolute top-4 right-4 text-black hover:text-[#ff2d2d] font-mono font-black text-lg cursor-pointer"
            >
              ✕
            </button>
            <FormRenderer
              entity={entity}
              appId={appId}
              recordId={editingRecord.id}
              initialData={editingRecord.data}
              onSuccess={() => {
                setEditingRecord(null)
                fetchRecords()
              }}
            />
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {isImportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-xl brutal-box brutal-shadow-lg bg-white p-6 border-4 border-black max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setIsImportOpen(false)
                setCsvHeaders([])
                setCsvData([])
                setCsvError('')
              }}
              className="absolute top-4 right-4 text-black hover:text-[#ff2d2d] font-mono font-black text-lg cursor-pointer"
            >
              ✕
            </button>
            
            <h2 className="text-xl font-black uppercase tracking-tight mb-6 pb-4 border-b-4 border-black">
              CSV IMPORT — {entity.name}
            </h2>

            {csvError && (
              <div className="brutal-box-red p-4 mb-4 text-xs font-black uppercase animate-brutal-shake">
                ⚠ {csvError}
              </div>
            )}

            {csvData.length === 0 ? (
              <div className="space-y-4">
                <p className="text-xs font-mono font-bold uppercase text-black/60">
                  // UPLOAD A .CSV FILE TO START IMPORTING RECORDS IN BULK
                </p>
                <div className="brutal-border border-dashed border-4 p-8 text-center bg-[#ffe600]/10 hover:bg-[#ffe600]/20 transition-colors relative">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <p className="text-sm font-black uppercase font-mono">
                    DRAG & DROP CSV FILE OR CLICK TO SELECT
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <p className="text-xs font-mono font-bold uppercase text-black/60">
                  // {csvData.length} RECORDS FOUND. MAP CSV HEADERS TO FIELD SCHEMAS below:
                </p>

                <div className="space-y-3 brutal-border p-4 bg-black/5">
                  {entity.fields.map((field) => (
                    <div key={field.name} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <label className="text-xs font-black uppercase font-mono">
                        {field.label || field.name} {field.required && <span className="text-[#ff2d2d]">*</span>}
                      </label>
                      <select
                        value={mappings[field.name] || ''}
                        onChange={(e) => setMappings(p => ({ ...p, [field.name]: e.target.value }))}
                        className="px-2 py-1.5 font-mono text-xs font-bold bg-white brutal-border focus:outline-none"
                      >
                        <option value="">-- Skip Field --</option>
                        {csvHeaders.map((header) => (
                          <option key={header} value={header}>{header}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleImportSubmit}
                    disabled={importing}
                    className="brutal-btn bg-[#00ff66] text-black px-6 py-3 font-mono font-black uppercase text-xs disabled:opacity-40 flex-1"
                  >
                    {importing ? 'IMPORTING...' : `► IMPORT ${csvData.length} RECORDS`}
                  </button>
                  <button
                    onClick={() => {
                      setCsvData([])
                      setCsvHeaders([])
                    }}
                    className="brutal-btn bg-black text-white px-6 py-3 font-mono font-black uppercase text-xs"
                  >
                    RESET
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </ErrorBoundary>
  )
}
