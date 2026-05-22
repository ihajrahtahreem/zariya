// app/api/socketio/route.ts
import { NextRequest, NextResponse } from 'next/server'

// Socket.IO requires a custom server setup - this endpoint provides connection info
export async function GET(req: NextRequest) {
  return NextResponse.json({
    message: 'Socket.IO endpoint',
    path: '/api/socketio',
    info: 'Connect using socket.io-client with path: /api/socketio',
  })
}
