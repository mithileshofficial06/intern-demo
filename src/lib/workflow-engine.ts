import { prisma } from './prisma'
import type { WorkflowEvent, WorkflowAction, WorkflowCondition } from '@/types/workflow'

/**
 * Workflow Engine - Executes workflows based on events
 */
export class WorkflowEngine {
  /**
   * Trigger workflows based on an event
   */
  static async trigger(event: WorkflowEvent): Promise<void> {
    try {
      // Find all workflows for this app and trigger
      const workflows = await prisma.workflow.findMany({
        where: {
          appId: event.appId,
          trigger: event.trigger,
          enabled: true,
        },
      })

      // Execute each workflow
      for (const workflow of workflows) {
        await this.executeWorkflow(workflow, event)
      }
    } catch (error) {
      console.error('Workflow trigger error:', error)
    }
  }

  /**
   * Execute a single workflow
   */
  private static async executeWorkflow(workflow: any, event: WorkflowEvent): Promise<void> {
    const executionId = await this.createExecution(workflow.id, event)

    try {
      // Check conditions
      const conditions = workflow.conditions as WorkflowCondition[] | null
      if (conditions && conditions.length > 0) {
        const conditionsMet = this.evaluateConditions(conditions, event.data)
        if (!conditionsMet) {
          await this.updateExecution(executionId, 'success', {
            message: 'Conditions not met, workflow skipped',
          })
          return
        }
      }

      // Execute actions
      const actions = workflow.actions as WorkflowAction[]
      const results: any[] = []

      for (const action of actions) {
        const result = await this.executeAction(action, event)
        results.push(result)
      }

      // Mark as success
      await this.updateExecution(executionId, 'success', { results })
    } catch (error) {
      // Mark as failed
      await this.updateExecution(executionId, 'failed', null, (error as Error).message)
      console.error('Workflow execution error:', error)
    }
  }

  /**
   * Evaluate workflow conditions
   */
  private static evaluateConditions(
    conditions: WorkflowCondition[],
    data: Record<string, any>
  ): boolean {
    return conditions.every((condition) => {
      const fieldValue = data[condition.field]

      switch (condition.operator) {
        case 'equals':
          return fieldValue === condition.value
        case 'not_equals':
          return fieldValue !== condition.value
        case 'contains':
          return String(fieldValue).includes(String(condition.value))
        case 'greater_than':
          return Number(fieldValue) > Number(condition.value)
        case 'less_than':
          return Number(fieldValue) < Number(condition.value)
        default:
          return false
      }
    })
  }

  /**
   * Execute a workflow action
   */
  private static async executeAction(
    action: WorkflowAction,
    event: WorkflowEvent
  ): Promise<any> {
    switch (action.type) {
      case 'log':
        return this.executeLogAction(action, event)
      case 'webhook':
        return this.executeWebhookAction(action, event)
      case 'notification':
        return this.executeNotificationAction(action, event)
      case 'email':
        return this.executeEmailAction(action, event)
      default:
        throw new Error(`Unknown action type: ${action.type}`)
    }
  }

  /**
   * Log action - Console log
   */
  private static async executeLogAction(
    action: WorkflowAction,
    event: WorkflowEvent
  ): Promise<any> {
    const message = this.replaceVariables(action.config.message || '', event)
    const level = action.config.level || 'info'

    // Use proper console methods
    if (level === 'error') {
      console.error(`[Workflow Log] ${message}`, event.data)
    } else if (level === 'warning') {
      console.warn(`[Workflow Log] ${message}`, event.data)
    } else {
      console.log(`[Workflow Log] ${message}`, event.data)
    }

    return {
      action: 'log',
      message,
      level,
      timestamp: new Date().toISOString(),
    }
  }

  /**
   * Webhook action - HTTP request
   */
  private static async executeWebhookAction(
    action: WorkflowAction,
    event: WorkflowEvent
  ): Promise<any> {
    const url = action.config.url
    if (!url) throw new Error('Webhook URL is required')

    const method = action.config.method || 'POST'
    const headers = action.config.headers || { 'Content-Type': 'application/json' }
    const body = action.config.body || event.data

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: method !== 'GET' ? JSON.stringify(body) : undefined,
      })

      const result = await response.json().catch(() => response.text())

      return {
        action: 'webhook',
        url,
        method,
        status: response.status,
        response: result,
      }
    } catch (error) {
      throw new Error(`Webhook failed: ${(error as Error).message}`)
    }
  }

  /**
   * Notification action - In-app notification
   */
  private static async executeNotificationAction(
    action: WorkflowAction,
    event: WorkflowEvent
  ): Promise<any> {
    const title = this.replaceVariables(action.config.title || 'Notification', event)
    const message = this.replaceVariables(action.config.notificationMessage || '', event)

    // In a real implementation, this would create a notification record
    // For now, just log it
    console.log(`[Notification] ${title}: ${message}`)

    return {
      action: 'notification',
      title,
      message,
      type: action.config.type || 'info',
    }
  }

  /**
   * Email action - Send email (placeholder)
   */
  private static async executeEmailAction(
    action: WorkflowAction,
    event: WorkflowEvent
  ): Promise<any> {
    const to = action.config.to
    const subject = this.replaceVariables(action.config.subject || '', event)
    const template = action.config.template || ''

    // Placeholder - in real implementation would use email service
    console.log(`[Email] To: ${to}, Subject: ${subject}`)

    return {
      action: 'email',
      to,
      subject,
      status: 'sent',
    }
  }

  /**
   * Replace variables in strings like {fieldName}
   */
  private static replaceVariables(template: string, event: WorkflowEvent): string {
    return template.replace(/\{(\w+)\}/g, (_, key) => {
      return event.data[key] !== undefined ? String(event.data[key]) : `{${key}}`
    })
  }

  /**
   * Create workflow execution record
   */
  private static async createExecution(
    workflowId: string,
    event: WorkflowEvent
  ): Promise<string> {
    const execution = await prisma.workflowExecution.create({
      data: {
        workflowId,
        trigger: event.trigger,
        payload: event.data as any,
        status: 'running',
      },
    })
    return execution.id
  }

  /**
   * Update workflow execution record
   */
  private static async updateExecution(
    executionId: string,
    status: 'success' | 'failed',
    result?: any,
    error?: string
  ): Promise<void> {
    await prisma.workflowExecution.update({
      where: { id: executionId },
      data: {
        status,
        result: result as any,
        error,
      },
    })
  }
}
