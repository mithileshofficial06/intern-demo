// Workflow type definitions

export type WorkflowTrigger = 
  | 'app.created'
  | 'record.created'
  | 'record.updated'
  | 'record.deleted'

export type WorkflowActionType = 
  | 'log'
  | 'webhook'
  | 'email'
  | 'notification'

export interface WorkflowAction {
  type: WorkflowActionType
  config: {
    // For log action
    message?: string
    level?: 'info' | 'warning' | 'error'
    
    // For webhook action
    url?: string
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    headers?: Record<string, string>
    body?: Record<string, any>
    
    // For email action
    to?: string
    subject?: string
    template?: string
    
    // For notification action
    title?: string
    notificationMessage?: string
    type?: 'success' | 'error' | 'info' | 'warning'
  }
}

export interface WorkflowCondition {
  field: string
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than'
  value: any
}

export interface Workflow {
  id: string
  appId: string
  name: string
  description?: string
  trigger: WorkflowTrigger
  conditions?: WorkflowCondition[]
  actions: WorkflowAction[]
  enabled: boolean
  createdAt: Date
  updatedAt: Date
}

export interface WorkflowExecution {
  id: string
  workflowId: string
  trigger: string
  payload: Record<string, any>
  status: 'success' | 'failed' | 'running'
  result?: Record<string, any>
  error?: string
  createdAt: Date
}

export interface WorkflowEvent {
  trigger: WorkflowTrigger
  appId: string
  entityName?: string
  data: Record<string, any>
  userId?: string
}
