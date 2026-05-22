// server.ts — Custom Next.js server with Socket.IO
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { Server } = require('socket.io')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = parseInt(process.env.PORT || '3000', 10)

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const httpServer = createServer((req: any, res: any) => {
    const parsedUrl = parse(req.url!, true)
    handle(req, res, parsedUrl)
  })

  // Attach Socket.IO to HTTP server
  const io = new Server(httpServer, {
    path: '/api/socketio',
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || `http://localhost:${port}`,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  })

  // Store io globally for API routes to access
  ;(global as any).__io = io

  io.on('connection', (socket: any) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`)

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`)
    })

    socket.on('ping', () => {
      socket.emit('pong', { timestamp: Date.now() })
    })
  })

  httpServer.listen(port, () => {
    console.log(`
  ╔════════════════════════════════════╗
  ║  🌿 ZARIYA Server Running          ║
  ║  URL: http://localhost:${port}        ║
  ║  Mode: ${dev ? 'Development           ' : 'Production            '} ║
  ║  Socket.IO: /api/socketio          ║
  ╚════════════════════════════════════╝
    `)
  })
})
