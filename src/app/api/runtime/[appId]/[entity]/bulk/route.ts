import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { WorkflowEngine } from '@/lib/workflow-engine'

type RouteParams = { params: Promise<{ appId: string, entity: string }> }

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { appId, entity } = await params

    const appConfig = await prisma.appConfig.findUnique({
      where: { appId }
    })

    if (!appConfig) {
      return NextResponse.json(
        { error: "App not found" },
        { status: 404 }
      )
    }

    let records
    try {
      records = await request.json()
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      )
    }

    if (!Array.isArray(records)) {
      return NextResponse.json(
        { error: "Body must be an array of records" },
        { status: 400 }
      )
    }

    // Insert records in a transaction
    const createdRecords = await prisma.$transaction(
      records.map((data) =>
        prisma.record.create({
          data: {
            appId,
            entity,
            data
          }
        })
      )
    )

    // Trigger workflow: record.created for each record
    await Promise.all(
      createdRecords.map((record) =>
        WorkflowEngine.trigger({
          trigger: 'record.created',
          appId,
          entityName: entity,
          data: {
            recordId: record.id,
            entity,
            ...(record.data as Record<string, any>),
          },
        }).catch((err) => console.error('Workflow trigger failed:', err))
      )
    )

    return NextResponse.json(
      {
        message: `${createdRecords.length} records imported successfully`,
        count: createdRecords.length
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error importing records:', error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
