// lib/socket-server.ts
import { Server as HttpServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'

let io: SocketIOServer | null = null

export function getSocketServer(): SocketIOServer | null {
  return io
}

export function initSocketServer(httpServer: HttpServer): SocketIOServer {
  if (io) return io

  io = new SocketIOServer(httpServer, {
    path: '/api/socketio',
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  })

  io.on('connection', (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`)

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`)
    })

    socket.on('ping', () => {
      socket.emit('pong', { timestamp: Date.now() })
    })
  })

  return io
}

export function broadcastPostureUpdate(data: {
  posture: string
  deviation: number
  timestamp: string
  id: string
}) {
  if (io) {
    io.emit('posture:update', data)
  }
}

export function broadcastAlert(data: {
  id: string
  message: string
  severity: string
  posture: string
  deviation: number
  createdAt: string
}) {
  if (io) {
    io.emit('alert:new', data)
  }
}
