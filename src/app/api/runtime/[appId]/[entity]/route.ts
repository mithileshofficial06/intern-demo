import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { WorkflowEngine } from '@/lib/workflow-engine'

type RouteParams = { params: Promise<{ appId: string, entity: string }> }

export async function GET(request: Request, { params }: RouteParams) {
  try {
    // 1. Await params to get appId and entity
    const { appId, entity } = await params

    // 2. Check if AppConfig exists
    const appConfig = await prisma.appConfig.findUnique({
      where: { appId }
    })

    if (!appConfig) {
      return NextResponse.json(
        { error: "App not found" },
        { status: 404 }
      )
    }

    // 3. Fetch search, page and limit query params
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '0', 10)
    const limit = parseInt(url.searchParams.get('limit') || '0', 10)
    const search = url.searchParams.get('search') || ''

    // 4. Fetch all Record rows for filtering
    let records = await prisma.record.findMany({
      where: {
        appId,
        entity
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // In-memory case-insensitive search filter
    if (search.trim()) {
      const searchLower = search.toLowerCase()
      records = records.filter((rec) => {
        const dataObj = (rec.data || {}) as Record<string, unknown>
        return Object.values(dataObj).some((val) => 
          String(val ?? '').toLowerCase().includes(searchLower)
        )
      })
    }

    const totalCount = records.length

    // Paginate in-memory if page/limit > 0
    if (page > 0 && limit > 0) {
      const startIndex = (page - 1) * limit
      records = records.slice(startIndex, startIndex + limit)
    }

    // 5. Return mapped records with pagination details
    return NextResponse.json(
      {
        records: records.map((record: { id: string; data: any; createdAt: Date }) => ({
          id: record.id,
          data: record.data,
          createdAt: record.createdAt
        })),
        pagination: {
          totalCount,
          page,
          limit,
          totalPages: limit > 0 ? Math.ceil(totalCount / limit) : 1
        }
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error fetching records:', error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    // 1. Await params to get appId and entity
    const { appId, entity } = await params

    // 2. Check if AppConfig exists
    const appConfig = await prisma.appConfig.findUnique({
      where: { appId }
    })

    if (!appConfig) {
      return NextResponse.json(
        { error: "App not found" },
        { status: 404 }
      )
    }

    // 3. Parse request body as JSON
    let data
    try {
      data = await request.json()
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      )
    }

    // 4. Create new Record
    const record = await prisma.record.create({
      data: {
        appId,
        entity,
        data
      }
    })

    // 4a. Trigger workflow: record.created
    await WorkflowEngine.trigger({
      trigger: 'record.created',
      appId,
      entityName: entity,
      data: {
        recordId: record.id,
        entity,
        ...data,
      },
    }).catch(err => console.error('Workflow trigger failed:', err))

    // 5. Return created record
    return NextResponse.json(
      {
        id: record.id,
        data: record.data,
        createdAt: record.createdAt
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error creating record:', error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { appId, entity } = await params
    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: "Record ID required" },
        { status: 400 }
      )
    }

    const appConfig = await prisma.appConfig.findUnique({
      where: { appId }
    })

    if (!appConfig) {
      return NextResponse.json(
        { error: "App not found" },
        { status: 404 }
      )
    }

    let data
    try {
      data = await request.json()
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      )
    }

    // Update Record
    const record = await prisma.record.update({
      where: {
        id,
        appId
      },
      data: {
        data
      }
    })

    return NextResponse.json(
      {
        id: record.id,
        data: record.data,
        createdAt: record.createdAt
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error updating record:', error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // 1. Await params to get appId and entity
    const { appId, entity } = await params

    // 2. Get id from searchParams
    const id = request.nextUrl.searchParams.get('id')

    // 3. Check if id is provided
    if (!id) {
      return NextResponse.json(
        { error: "Record ID required" },
        { status: 400 }
      )
    }

    // 4. Delete Record
    const deletedRecord = await prisma.record.delete({
      where: {
        id,
        appId
      }
    })

    // 4a. Trigger workflow: record.deleted
    await WorkflowEngine.trigger({
      trigger: 'record.deleted',
      appId,
      entityName: entity,
      data: {
        recordId: id,
        entity,
        deletedData: deletedRecord.data,
      },
    }).catch(err => console.error('Workflow trigger failed:', err))

    // 5. Return success message
    return NextResponse.json(
      { message: "Record deleted" },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error deleting record:', error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}