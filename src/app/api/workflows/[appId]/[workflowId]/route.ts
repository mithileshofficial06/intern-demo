import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

// GET /api/workflows/[appId]/[workflowId] - Get workflow details
export async function GET(
  request: Request,
  { params }: { params: Promise<{ appId: string; workflowId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { appId, workflowId } = await params

    const workflow = await prisma.workflow.findFirst({
      where: {
        id: workflowId,
        appId,
        app: { userId: session.user.id },
      },
      include: {
        executions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    })

    if (!workflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
    }

    return NextResponse.json({ workflow })
  } catch (error) {
    console.error('Error fetching workflow:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/workflows/[appId]/[workflowId] - Update workflow
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ appId: string; workflowId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { appId, workflowId } = await params
    const body = await request.json()

    // Verify ownership
    const existing = await prisma.workflow.findFirst({
      where: {
        id: workflowId,
        appId,
        app: { userId: session.user.id },
      },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
    }

    // Update workflow
    const workflow = await prisma.workflow.update({
      where: { id: workflowId },
      data: {
        name: body.name,
        description: body.description,
        trigger: body.trigger,
        conditions: body.conditions,
        actions: body.actions,
        enabled: body.enabled,
      },
    })

    return NextResponse.json({ workflow })
  } catch (error) {
    console.error('Error updating workflow:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/workflows/[appId]/[workflowId] - Delete workflow
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ appId: string; workflowId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { appId, workflowId } = await params

    // Verify ownership
    const existing = await prisma.workflow.findFirst({
      where: {
        id: workflowId,
        appId,
        app: { userId: session.user.id },
      },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
    }

    // Delete workflow
    await prisma.workflow.delete({
      where: { id: workflowId },
    })

    return NextResponse.json({ message: 'Workflow deleted' })
  } catch (error) {
    console.error('Error deleting workflow:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
