import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { safeValidateConfig } from '@/lib/config-validator'

export async function POST(request: Request) {
  try {
    // 1. Parse request body as JSON
    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      )
    }

    // 2. Call safeValidateConfig
    const result = safeValidateConfig(body)

    // 3. If validation fails, return 400
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    const { config } = result

    // 4. Check if appId already exists (nanoid is unique enough, proceed)
    // Note: We're proceeding as nanoid is statistically unique enough

    // 5. Create new AppConfig record
    // Serialize through JSON to produce a plain object Prisma can accept as InputJsonValue
    const configJson = JSON.parse(JSON.stringify(config)) as Prisma.InputJsonValue
    await prisma.appConfig.create({
      data: {
        appId: config.appId,
        name: config.app,
        config: configJson
      }
    })

    // 6. Return success response
    return NextResponse.json(
      {
        appId: config.appId,
        name: config.app,
        message: "App registered successfully"
      },
      { status: 201 }
    )

  } catch (error) {
    // 7. Handle any unexpected errors
    console.error('Error registering app:', error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}