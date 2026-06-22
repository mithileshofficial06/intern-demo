import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type RouteParams = { params: Promise<{ appId: string }> }

export async function GET(request: Request, { params }: RouteParams) {
  try {
    // 1. Await params to get appId
    const { appId } = await params

    // 2. Find AppConfig in prisma
    const appConfig = await prisma.appConfig.findUnique({
      where: { appId }
    })

    // 3. If not found, return 404
    if (!appConfig) {
      return NextResponse.json(
        { error: "App not found" },
        { status: 404 }
      )
    }

    // 4. Return app configuration
    return NextResponse.json(
      {
        appId: appConfig.appId,
        name: appConfig.name,
        config: appConfig.config,
        createdAt: appConfig.createdAt
      },
      { status: 200 }
    )

  } catch (error) {
    // 5. Handle errors
    console.error('Error fetching app config:', error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}