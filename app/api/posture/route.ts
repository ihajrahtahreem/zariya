// app/api/posture/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { isAlertWorthy, generateAlertMessage } from '@/lib/utils'

const postureSchema = z.object({
  posture: z.enum(['good', 'warning', 'bad', 'very_bad']),
  deviation: z.number().min(0).max(180),
  deviceId: z.string().optional(),
})

// GET - fetch latest posture reading + recent history
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const hours = parseInt(searchParams.get('hours') || '24')
    const since = new Date(Date.now() - hours * 60 * 60 * 1000)

    const [latest, history] = await Promise.all([
      prisma.postureLog.findFirst({
        orderBy: { timestamp: 'desc' },
      }),
      prisma.postureLog.findMany({
        where: { timestamp: { gte: since } },
        orderBy: { timestamp: 'desc' },
        take: limit,
      }),
    ])

    return NextResponse.json({
      latest,
      history,
      count: history.length,
    })
  } catch (error) {
    console.error('[GET /api/posture]', error)
    return NextResponse.json({ error: 'Failed to fetch posture data' }, { status: 500 })
  }
}

// POST - receive data from ESP32 hardware
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = postureSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { posture, deviation, deviceId } = parsed.data

    // Store posture log
    const log = await prisma.postureLog.create({
      data: { posture, deviation, deviceId },
    })

    // Create alert if posture is bad
    let alert = null
    if (isAlertWorthy(posture)) {
      alert = await prisma.alert.create({
        data: {
          message: generateAlertMessage(posture, deviation),
          severity: posture === 'very_bad' ? 'critical' : 'warning',
          posture,
          deviation,
        },
      })
    }

    // Broadcast via Socket.IO if available
    try {
      const { broadcastPostureUpdate, broadcastAlert } = await import('@/lib/socket-server')
      broadcastPostureUpdate({
        id: log.id,
        posture: log.posture,
        deviation: log.deviation,
        timestamp: log.timestamp.toISOString(),
      })
      if (alert) {
        broadcastAlert({
          id: alert.id,
          message: alert.message,
          severity: alert.severity,
          posture: alert.posture || posture,
          deviation: alert.deviation || deviation,
          createdAt: alert.createdAt.toISOString(),
        })
      }
    } catch {
      // Socket server may not be initialized in serverless
    }

    return NextResponse.json({ success: true, log, alert }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/posture]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
