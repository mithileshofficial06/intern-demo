import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { safeValidateConfig } from '@/lib/config-validator'
import { auth } from '@/auth'
import { WorkflowEngine } from '@/lib/workflow-engine'

// Helper to save a notification to DB (fire-and-forget, non-blocking)
async function saveNotification(
  userId: string,
  type: 'success' | 'error',
  title: string,
  message: string
) {
  try {
    await prisma.notification.create({ data: { userId, type, title, message } })
    // Trim to last 50
    const count = await prisma.notification.count({ where: { userId } })
    if (count > 50) {
      const oldest = await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'asc' },
        take: count - 50,
        select: { id: true },
      })
      await prisma.notification.deleteMany({ where: { id: { in: oldest.map((n: { id: string }) => n.id) } } })
    }
  } catch {
    // Non-critical — don't fail the main request
  }
}

export async function POST(request: Request) {
  try {
    // 1. Check authentication
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      )
    }

    // 2. Parse request body as JSON
    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      )
    }

    // 3. Call safeValidateConfig
    const result = safeValidateConfig(body)

    // 4. If validation fails, return 400
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    const { config } = result

    // 5. Create new AppConfig record with user association
    const configJson = JSON.parse(JSON.stringify(config)) as Prisma.InputJsonValue
    await prisma.appConfig.create({
      data: {
        appId: config.appId,
        name: config.app,
        config: configJson,
        userId: session.user.id,
      }
    })

    // 5a. Trigger workflow: app.created
    await WorkflowEngine.trigger({
      trigger: 'app.created',
      appId: config.appId,
      data: {
        appId: config.appId,
        name: config.app,
        userId: session.user.id,
      },
      userId: session.user.id,
    }).catch(err => console.error('Workflow trigger failed:', err))

    // 6. Save success notification to DB for Notification Center
    void saveNotification(
      session.user.id,
      'success',
      'APP CREATED',
      `"${config.app}" is live and ready to use`
    )

    // 7. Return success response
    return NextResponse.json(
      {
        appId: config.appId,
        name: config.app,
        message: "App registered successfully"
      },
      { status: 201 }
    )

  } catch (error) {
    // 8. Handle any unexpected errors
    console.error('Error registering app:', error)
    // Try to save an error notification
    const session2 = await auth().catch(() => null)
    if (session2?.user?.id) {
      void saveNotification(
        session2.user.id,
        'error',
        'APP CREATION FAILED',
        'An unexpected error occurred while registering your app'
      )
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}