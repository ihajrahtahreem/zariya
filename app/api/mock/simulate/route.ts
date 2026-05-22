// app/api/mock/simulate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { generateMockPostureReading } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const mock = generateMockPostureReading()

    // Forward to the actual posture endpoint
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/posture`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...mock, deviceId: 'mock-device' }),
    })

    const data = await response.json()
    return NextResponse.json({ ...data, mock: true })
  } catch (error) {
    console.error('[POST /api/mock/simulate]', error)
    return NextResponse.json({ error: 'Simulation failed' }, { status: 500 })
  }
}
