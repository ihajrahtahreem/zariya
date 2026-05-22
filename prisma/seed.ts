// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import { subHours, subMinutes } from 'date-fns'

const prisma = new PrismaClient()

const postureTypes = ['good', 'warning', 'bad', 'very_bad']
const deviationRanges: Record<string, [number, number]> = {
  good: [0, 10],
  warning: [11, 20],
  bad: [21, 35],
  very_bad: [36, 60],
}

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function weightedPosture(): string {
  const rand = Math.random()
  if (rand < 0.5) return 'good'
  if (rand < 0.75) return 'warning'
  if (rand < 0.9) return 'bad'
  return 'very_bad'
}

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.alert.deleteMany()
  await prisma.postureLog.deleteMany()
  await prisma.user.deleteMany()

  // Create demo user
  await prisma.user.create({
    data: {
      id: 'demo-user-001',
      name: 'Aisha Rahman',
      email: 'aisha@zariya.health',
    },
  })

  // Generate posture logs for last 24 hours
  const logs = []
  for (let i = 0; i < 288; i++) {
    // every 5 minutes for 24h
    const posture = weightedPosture()
    const [min, max] = deviationRanges[posture]
    logs.push({
      posture,
      deviation: parseFloat(randomBetween(min, max).toFixed(2)),
      timestamp: subMinutes(new Date(), i * 5),
    })
  }

  await prisma.postureLog.createMany({ data: logs })

  // Generate alerts for bad/very_bad postures
  const badLogs = logs.filter(
    (l) => l.posture === 'bad' || l.posture === 'very_bad'
  )
  const alerts = badLogs.slice(0, 20).map((l) => ({
    message:
      l.posture === 'very_bad'
        ? `Critical posture detected! Deviation of ${l.deviation.toFixed(1)}°. Please sit upright immediately.`
        : `Poor posture detected. Deviation of ${l.deviation.toFixed(1)}°. Try to straighten your back.`,
    severity: l.posture === 'very_bad' ? 'critical' : 'warning',
    posture: l.posture,
    deviation: l.deviation,
    read: Math.random() > 0.4,
    createdAt: l.timestamp,
  }))

  await prisma.alert.createMany({ data: alerts })

  console.log(`✅ Seeded ${logs.length} posture logs and ${alerts.length} alerts`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
