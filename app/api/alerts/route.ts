// app/api/alerts/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const unreadOnly = searchParams.get('unread') === 'true'

    const alerts = await prisma.alert.findMany({
      where: unreadOnly ? { read: false } : {},
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    const unreadCount = await prisma.alert.count({ where: { read: false } })

    return NextResponse.json({ alerts, unreadCount })
  } catch (error) {
    console.error('[GET /api/alerts]', error)
    return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { ids, readAll } = body

    if (readAll) {
      await prisma.alert.updateMany({ data: { read: true } })
    } else if (ids && Array.isArray(ids)) {
      await prisma.alert.updateMany({
        where: { id: { in: ids } },
        data: { read: true },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[PATCH /api/alerts]', error)
    return NextResponse.json({ error: 'Failed to update alerts' }, { status: 500 })
  }
}
