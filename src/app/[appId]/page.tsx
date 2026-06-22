'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ValidatedConfig } from '@/types/config'
import FormRenderer from '@/components/renderer/FormRenderer'
import TableRenderer from '@/components/renderer/TableRenderer'
import ErrorBoundary from '@/components/renderer/ErrorBoundary'

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
          // Set active tab to first entity
          if (data.config?.entities?.length > 0) {
            setActiveTab(data.config.entities[0].name)
          }
        } else {
          setError('App not found')
        }
      } catch (err) {
        setError('Failed to load app')
        console.error('Error loading app:', err)
      } finally {
        setLoading(false)
      }
    }

    if (appId) {
      fetchApp()
    }
  }, [appId])

  const handleTabChange = (entityName: string) => {
    setActiveTab(entityName)
    setActiveView('list')
  }

  const handleAddNew = () => {
    setActiveView('form')
  }

  const handleFormSuccess = () => {
    setActiveView('list')
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your app...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">{error}</p>
          <a 
            href="/" 
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    )
  }

  // Main app interface
  if (!config) return null

  const currentEntity = config.entities.find(entity => entity.name === activeTab)

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Navbar */}
      <nav className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">{config.app}</h1>
          <span className="text-purple-400 font-medium">AppForge</span>
        </div>
      </nav>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 border-r border-gray-700 p-4">
          <h2 className="text-white font-medium mb-4">Entities</h2>
          <nav className="space-y-2">
            {config.entities.map((entity) => (
              <button
                key={entity.name}
                onClick={() => handleTabChange(entity.name)}
                className={`w-full text-left px-3 py-2 rounded transition-colors ${
                  activeTab === entity.name
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {entity.name}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {currentEntity && (
            <>
              {/* Toggle Buttons */}
              <div className="mb-6">
                <div className="flex gap-4">
                  <button
                    onClick={() => setActiveView('list')}
                    className={`px-4 py-2 rounded transition-colors ${
                      activeView === 'list'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                    }`}
                  >
                    View Records
                  </button>
                  <button
                    onClick={() => setActiveView('form')}
                    className={`px-4 py-2 rounded transition-colors ${
                      activeView === 'form'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                    }`}
                  >
                    Add New
                  </button>
                </div>
              </div>

              {/* Content Area */}
              <ErrorBoundary>
                {activeView === 'list' ? (
                  <TableRenderer
                    entity={currentEntity}
                    appId={appId}
                    onAddNew={handleAddNew}
                  />
                ) : (
                  <FormRenderer
                    entity={currentEntity}
                    appId={appId}
                    onSuccess={handleFormSuccess}
                  />
                )}
              </ErrorBoundary>
            </>
          )}
        </main>
      </div>
    </div>
  )
}