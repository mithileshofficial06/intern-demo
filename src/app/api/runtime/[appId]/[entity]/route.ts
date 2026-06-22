import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

    // 3. Fetch all Record rows
    const records = await prisma.record.findMany({
      where: {
        appId,
        entity
      }
    })

    // 4. Return mapped records
    return NextResponse.json(
      {
        records: records.map(record => ({
          id: record.id,
          data: record.data,
          createdAt: record.createdAt
        }))
      },
      { status: 200 }
    )

  } catch (error) {
    // 5. Handle errors
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
    // 6. Handle errors
    console.error('Error creating record:', error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    // 1. Await params to get appId and entity
    const { appId, entity } = await params

    // 2. Get id from searchParams
    const id = request.nextUrl?.searchParams.get('id')

    // 3. Check if id is provided
    if (!id) {
      return NextResponse.json(
        { error: "Record ID required" },
        { status: 400 }
      )
    }

    // 4. Delete Record
    await prisma.record.delete({
      where: {
        id,
        appId
      }
    })

    // 5. Return success message
    return NextResponse.json(
      { message: "Record deleted" },
      { status: 200 }
    )

  } catch (error) {
    // 6. Handle errors
    console.error('Error deleting record:', error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}