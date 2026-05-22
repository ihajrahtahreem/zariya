'use client'
// hooks/useSocket.ts
import { useEffect, useRef, useState, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'

export interface PostureUpdate {
  id: string
  posture: string
  deviation: number
  timestamp: string
}

export interface AlertUpdate {
  id: string
  message: string
  severity: string
  posture: string
  deviation: number
  createdAt: string
}

export function useSocket() {
  const socketRef = useRef<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [lastPosture, setLastPosture] = useState<PostureUpdate | null>(null)
  const [latestAlert, setLatestAlert] = useState<AlertUpdate | null>(null)

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return

    const socket = io(process.env.NEXT_PUBLIC_WS_URL || '', {
      path: '/api/socketio',
      transports: ['websocket', 'polling'],
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    })

    socket.on('connect', () => {
      console.log('[Socket] Connected:', socket.id)
      setIsConnected(true)
    })

    socket.on('disconnect', () => {
      console.log('[Socket] Disconnected')
      setIsConnected(false)
    })

    socket.on('posture:update', (data: PostureUpdate) => {
      setLastPosture(data)
    })

    socket.on('alert:new', (data: AlertUpdate) => {
      setLatestAlert(data)
    })

    socket.on('connect_error', (err) => {
      console.warn('[Socket] Connection error:', err.message)
      setIsConnected(false)
    })

    socketRef.current = socket
  }, [])

  useEffect(() => {
    connect()
    return () => {
      socketRef.current?.disconnect()
    }
  }, [connect])

  return { isConnected, lastPosture, latestAlert, socket: socketRef.current }
}
