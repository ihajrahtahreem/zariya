// app/api/analytics/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { startOfDay, subDays, format } from 'date-fns'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const days = parseInt(searchParams.get('days') || '7')

    const since = subDays(new Date(), days)

    const logs = await prisma.postureLog.findMany({
      where: { timestamp: { gte: since } },
      orderBy: { timestamp: 'asc' },
      select: { posture: true, deviation: true, timestamp: true },
    })

    // Group by day
    const grouped: Record<string, typeof logs> = {}
    for (const log of logs) {
      const day = format(log.timestamp, 'yyyy-MM-dd')
      if (!grouped[day]) grouped[day] = []
      grouped[day].push(log)
    }

    // Calculate daily stats
    const dailyStats = []
    for (let i = days - 1; i >= 0; i--) {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd')
      const dayLogs = grouped[date] || []
      const total = dayLogs.length
      const good = dayLogs.filter((l) => l.posture === 'good').length
      const warning = dayLogs.filter((l) => l.posture === 'warning').length
      const bad = dayLogs.filter((l) => l.posture === 'bad').length
      const veryBad = dayLogs.filter((l) => l.posture === 'very_bad').length
      const avgDeviation =
        total > 0
          ? dayLogs.reduce((sum, l) => sum + l.deviation, 0) / total
          : 0

      dailyStats.push({
        date,
        label: format(new Date(date), 'MMM d'),
        total,
        good,
        warning,
        bad,
        veryBad,
        goodPercent: total > 0 ? Math.round((good / total) * 100) : 0,
        avgDeviation: parseFloat(avgDeviation.toFixed(1)),
      })
    }

    // Overall stats
    const totalLogs = logs.length
    const overallGoodPercent =
      totalLogs > 0
        ? Math.round((logs.filter((l) => l.posture === 'good').length / totalLogs) * 100)
        : 0
    const avgDev =
      totalLogs > 0
        ? logs.reduce((sum, l) => sum + l.deviation, 0) / totalLogs
        : 0

    // Hourly breakdown (last 24h)
    const last24h = logs.filter(
      (l) => l.timestamp >= subDays(new Date(), 1)
    )
    const hourlyStats: Record<string, { total: number; good: number }> = {}
    for (const log of last24h) {
      const hour = format(log.timestamp, 'HH:00')
      if (!hourlyStats[hour]) hourlyStats[hour] = { total: 0, good: 0 }
      hourlyStats[hour].total++
      if (log.posture === 'good') hourlyStats[hour].good++
    }

    return NextResponse.json({
      dailyStats,
      summary: {
        totalLogs,
        overallGoodPercent,
        avgDeviation: parseFloat(avgDev.toFixed(1)),
        daysTracked: days,
      },
      hourlyStats,
    })
  } catch (error) {
    console.error('[GET /api/analytics]', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
