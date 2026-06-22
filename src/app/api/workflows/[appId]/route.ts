import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

// GET /api/workflows/[appId] - List workflows for an app
export async function GET(
  request: Request,
  { params }: { params: Promise<{ appId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { appId } = await params

    // Verify app belongs to user
    const app = await prisma.appConfig.findFirst({
      where: { appId, userId: session.user.id },
    })

    if (!app) {
      return NextResponse.json({ error: 'App not found' }, { status: 404 })
    }

    // Fetch workflows
    const workflows = await prisma.workflow.findMany({
      where: { appId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { executions: true },
        },
      },
    })

    return NextResponse.json({ workflows })
  } catch (error) {
    console.error('Error fetching workflows:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/workflows/[appId] - Create a workflow
export async function POST(
  request: Request,
  { params }: { params: Promise<{ appId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { appId } = await params
    const body = await request.json()

    // Verify app belongs to user
    const app = await prisma.appConfig.findFirst({
      where: { appId, userId: session.user.id },
    })

    if (!app) {
      return NextResponse.json({ error: 'App not found' }, { status: 404 })
    }

    // Validate workflow data
    if (!body.name || !body.trigger || !body.actions) {
      return NextResponse.json(
        { error: 'Missing required fields: name, trigger, actions' },
        { status: 400 }
      )
    }

    // Create workflow
    const workflow = await prisma.workflow.create({
      data: {
        appId,
        name: body.name,
        description: body.description || null,
        trigger: body.trigger,
        conditions: body.conditions || null,
        actions: body.actions,
        enabled: body.enabled !== false,
      },
    })

    return NextResponse.json({ workflow }, { status: 201 })
  } catch (error) {
    console.error('Error creating workflow:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
