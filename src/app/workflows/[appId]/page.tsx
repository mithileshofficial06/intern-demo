"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Workflow {
  id: string
  name: string
  description?: string
  trigger: string
  enabled: boolean
  createdAt: string
  _count: {
    executions: number
  }
}

export default function WorkflowsPage() {
  const params = useParams()
  const router = useRouter()
  const appId = params.appId as string

  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    fetchWorkflows()
  }, [appId])

  const fetchWorkflows = async () => {
    try {
      const res = await fetch(`/api/workflows/${appId}`)
      if (res.ok) {
        const data = await res.json()
        setWorkflows(data.workflows)
      }
    } catch (error) {
      console.error('Error fetching workflows:', error)
    } finally {
      setLoading(false)
    }
  }

  const createSampleWorkflow = async () => {
    const sample = {
      name: 'Log New Records',
      description: 'Log a message when a new record is created',
      trigger: 'record.created',
      actions: [
        {
          type: 'log',
          config: {
            message: 'New record created: {entity}',
            level: 'info',
          },
        },
      ],
      enabled: true,
    }

    try {
      const res = await fetch(`/api/workflows/${appId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sample),
      })

      if (res.ok) {
        fetchWorkflows()
        setShowCreateForm(false)
      }
    } catch (error) {
      console.error('Error creating workflow:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-[#ffe600] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="font-mono text-[#ffe600] uppercase">Loading workflows...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-12">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8 pb-6 border-b-4 border-[#ffe600]">
          <div>
            <Link
              href={`/${appId}`}
              className="text-sm font-mono text-[#ffe600]/60 hover:text-[#ffe600] mb-2 inline-block"
            >
              ← Back to App
            </Link>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-[#ffe600]">
              WORKFLOWS
            </h1>
            <p className="text-sm font-mono text-white/50 mt-2">
              Automate actions when events occur
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-6 py-3 bg-[#ffe600] text-black border-4 border-black font-black uppercase text-sm hover:bg-[#00ff66] transition-all"
          >
            + Create Workflow
          </button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="mb-8 p-6 bg-[#0d0d0d] border-4 border-[#ffe600]">
            <h3 className="text-xl font-black uppercase text-[#ffe600] mb-4">
              Quick Create: Sample Workflow
            </h3>
            <p className="text-white/70 mb-4 font-mono text-sm">
              This will create a workflow that logs messages when records are created.
            </p>
            <div className="flex gap-3">
              <button
                onClick={createSampleWorkflow}
                className="px-5 py-2 bg-[#00ff66] text-black border-2 border-black font-black uppercase text-sm"
              >
                Create Sample
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-5 py-2 bg-white/10 text-white border-2 border-white/20 font-bold uppercase text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Workflows List */}
        {workflows.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block p-8 border-4 border-[#ffe600] bg-[#0d0d0d]">
              <div className="w-16 h-16 bg-black border-2 border-[#ffe600] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-[#ffe600] text-2xl">⚡</span>
              </div>
              <h2 className="text-2xl font-black mb-3 text-[#ffe600] uppercase">
                No Workflows Yet
              </h2>
              <p className="text-white/60 mb-6 font-mono text-sm">
                Create your first workflow to automate actions
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-5 py-3 bg-[#ffe600] text-black border-2 border-black font-black uppercase text-sm"
              >
                Create Workflow
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {workflows.map((workflow) => (
              <div
                key={workflow.id}
                className="p-6 bg-[#0d0d0d] border-4 border-white/20 hover:border-[#ffe600] transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-black text-[#ffe600] uppercase">
                      {workflow.name}
                    </h3>
                    {workflow.description && (
                      <p className="text-white/60 text-sm mt-1">{workflow.description}</p>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-black uppercase ${
                      workflow.enabled
                        ? 'bg-[#00ff66] text-black'
                        : 'bg-white/20 text-white/60'
                    }`}
                  >
                    {workflow.enabled ? 'Active' : 'Disabled'}
                  </span>
                </div>

                <div className="space-y-2 text-sm font-mono border-t-2 border-white/10 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white/50">Trigger:</span>
                    <span className="text-[#ffe600] font-bold">{workflow.trigger}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/50">Executions:</span>
                    <span className="text-white font-bold">
                      {workflow._count.executions}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/50">Created:</span>
                    <span className="text-white/70">
                      {new Date(workflow.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Panel */}
        <div className="mt-12 p-6 bg-[#0d0d0d] border-4 border-[#00ff66]">
          <h3 className="text-xl font-black uppercase text-[#00ff66] mb-4">
            ⚡ How Workflows Work
          </h3>
          <div className="space-y-3 font-mono text-sm text-white/70">
            <p>
              <span className="text-[#ffe600] font-bold">Triggers:</span> Events that
              start workflows (app.created, record.created, record.deleted)
            </p>
            <p>
              <span className="text-[#ffe600] font-bold">Actions:</span> What happens when
              triggered (log, webhook, notification, email)
            </p>
            <p>
              <span className="text-[#ffe600] font-bold">Conditions:</span> Optional filters
              to control when workflows run
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
