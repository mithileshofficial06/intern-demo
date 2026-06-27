'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ValidatedConfig } from '@/types/config'
import FormRenderer from '@/components/renderer/FormRenderer'
import TableRenderer from '@/components/renderer/TableRenderer'
import ErrorBoundary from '@/components/renderer/ErrorBoundary'

function BrutalMarquee() {
  const items = [...['LIVE APP', 'CRUD READY', 'JSON POWERED', 'APP FORGE'], ...['LIVE APP', 'CRUD READY', 'JSON POWERED', 'APP FORGE']]
  return (
    <div className="brutal-border bg-black text-[#ffe600] py-2 overflow-hidden border-x-0 shrink-0">
      <div className="flex animate-brutal-marquee w-max gap-10">
        {items.map((item, i) => (
          <span key={i} className="text-xs font-black uppercase tracking-[0.25em] whitespace-nowrap font-mono">
            ★ {item} ★
          </span>
        ))}
      </div>
    </div>
  )
}

export default function AppPage() {
  const [config, setConfig] = useState<ValidatedConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('')
  const [activeView, setActiveView] = useState<'list' | 'form'>('list')
  const params = useParams()
  const appId = params.appId as string

  useEffect(() => {
    const fetchApp = async () => {
      try {
        const response = await fetch(`/api/runtime/${appId}`)
        if (response.ok) {
          const data = await response.json()
          setConfig(data.config)
          if (data.config?.entities?.length > 0) {
            setActiveTab(data.config.entities[0].name)
          }
        } else {
          setError('APP NOT FOUND')
        }
      } catch (err) {
        setError('FAILED TO LOAD APP')
        console.error('Error loading app:', err)
      } finally {
        setLoading(false)
      }
    }
    if (appId) fetchApp()
  }, [appId])

  const handleTabChange = (entityName: string) => {
    setActiveTab(entityName)
    setActiveView('list')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#ffe600] flex flex-col">
        <BrutalMarquee />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="brutal-box brutal-shadow-lg p-10 text-center bg-white">
            <p className="text-2xl font-black uppercase tracking-tight animate-brutal-blink">
              LOADING...
            </p>
            <p className="text-xs font-bold mt-3 font-mono uppercase tracking-widest opacity-60">
              ▓▓▓▓▓▓▓▓▓▓
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#ffe600] flex flex-col">
        <BrutalMarquee />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="brutal-box-red brutal-shadow-lg p-10 text-center max-w-md">
            <p className="text-xl font-black uppercase mb-6">⚠ {error}</p>
            <Link href="/dashboard" className="brutal-btn inline-block px-6 py-3 bg-black text-[#ffe600] text-sm">
              ← DASHBOARD
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!config) return null

  const currentEntity = config.entities.find((entity) => entity.name === activeTab)

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <BrutalMarquee />

      {/* Header */}
      <header className="bg-[#ffe600] brutal-border border-t-0 border-x-0 px-6 py-4 shrink-0">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <Link
              href="/dashboard"
              className="brutal-btn shrink-0 px-3 py-2 text-xs bg-white text-black hidden sm:inline-block"
            >
              ← DASHBOARD
            </Link>
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight truncate">
              {config.app}
            </h1>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href={`/workflows/${appId}`}
              className="brutal-btn px-3 py-2 text-xs bg-black text-[#ffe600] hover:bg-white hover:text-black"
            >
              ⚡ WORKFLOWS
            </Link>
            <span className="brutal-tag bg-black text-[#ffe600] hidden sm:inline-block font-mono">
              ID:{appId.slice(0, 6)}
            </span>
            <span className="font-black text-sm uppercase">
              APP<span className="brutal-highlight">FORGE</span>
            </span>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row flex-1 min-h-0">
        {/* Sidebar */}
        <aside className="w-full lg:w-56 bg-[#ffe600] brutal-border border-t-0 border-l-0 border-b-0 shrink-0">
          <div className="p-4 border-b-4 border-black">
            <h2 className="text-xs font-black uppercase tracking-[0.2em]">► ENTITIES</h2>
          </div>
          <nav className="p-3 space-y-2">
            {config.entities.map((entity) => (
              <button
                key={entity.name}
                onClick={() => handleTabChange(entity.name)}
                className={`brutal-btn w-full text-left px-3 py-3 text-xs ${
                  activeTab === entity.name
                    ? 'bg-black text-[#ffe600]'
                    : 'bg-white text-black hover:bg-black hover:text-[#ffe600]'
                }`}
              >
                {activeTab === entity.name ? '■ ' : '□ '}
                {entity.name.toUpperCase()}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 p-4 sm:p-6 bg-white relative min-w-0">
          <div className="absolute inset-0 brutal-checker pointer-events-none" />

          {currentEntity && (
            <div className="relative z-10">
              {/* View toggle */}
              <div className="flex flex-wrap gap-3 mb-6">
                <button
                  onClick={() => setActiveView('list')}
                  className={`brutal-btn px-4 py-2.5 text-xs ${
                    activeView === 'list'
                      ? 'bg-black text-[#ffe600]'
                      : 'bg-white text-black'
                  }`}
                >
                  ► VIEW RECORDS
                </button>
                <button
                  onClick={() => setActiveView('form')}
                  className={`brutal-btn px-4 py-2.5 text-xs ${
                    activeView === 'form'
                      ? 'bg-[#ff2d2d] text-white'
                      : 'bg-white text-black'
                  }`}
                >
                  + ADD NEW
                </button>
              </div>

              <ErrorBoundary>
                {activeView === 'list' ? (
                  <TableRenderer
                    entity={currentEntity}
                    appId={appId}
                    onAddNew={() => setActiveView('form')}
                  />
                ) : (
                  <FormRenderer
                    entity={currentEntity}
                    appId={appId}
                    onSuccess={() => setActiveView('list')}
                  />
                )}
              </ErrorBoundary>
            </div>
          )}
        </main>
      </div>

      <BrutalMarquee />
    </div>
  )
}
