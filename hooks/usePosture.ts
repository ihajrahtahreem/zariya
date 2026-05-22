'use client'
// hooks/usePosture.ts
import { useState, useEffect, useRef } from 'react'
import type { PostureStatus } from '@/lib/utils'

interface PostureState {
  posture: PostureStatus
  deviation: number
  timestamp: string
  id: string
}

export function usePosture(options: { mockMode?: boolean; mockIntervalMs?: number } = {}) {
  const { mockMode = false, mockIntervalMs = 3000 } = options
  const [current, setCurrent] = useState<PostureState | null>(null)
  const [history, setHistory] = useState<PostureState[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const mockIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const fetchData = async () => {
    try {
      const [postureRes, alertsRes] = await Promise.all([
        fetch('/api/posture?limit=100&hours=24', { cache: 'no-store' }),
        fetch('/api/alerts?limit=10', { cache: 'no-store' }),
      ])
      const postureData = await postureRes.json()
      const alertsData = await alertsRes.json()

      if (postureData.latest) {
        setCurrent({
          posture: postureData.latest.posture as PostureStatus,
          deviation: postureData.latest.deviation,
          timestamp: postureData.latest.timestamp,
          id: postureData.latest.id,
        })
        setIsConnected(true)
      }
      if (postureData.history) {
        setHistory(
          postureData.history.map((l: any) => ({
            posture: l.posture as PostureStatus,
            deviation: l.deviation,
            timestamp: l.timestamp,
            id: l.id,
          }))
        )
      }
      if (alertsData.alerts) {
        setAlerts(alertsData.alerts)
      }
    } catch (err) {
      console.error('Failed to load data:', err)
      setIsConnected(false)
    } finally {
      setIsLoading(false)
    }
  }

  // Poll every 3 seconds
  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 3000)
    return () => clearInterval(interval)
  }, [])

  // Mock mode
  useEffect(() => {
    if (!mockMode) return
    const simulate = async () => {
      try {
        await fetch('/api/mock/simulate', { method: 'POST' })
      } catch { }
    }
    mockIntervalRef.current = setInterval(simulate, mockIntervalMs)
    simulate()
    return () => {
      if (mockIntervalRef.current) clearInterval(mockIntervalRef.current)
    }
  }, [mockMode, mockIntervalMs])

  const dismissAlert = async (id: string) => {
    await fetch('/api/alerts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: [id] }),
    })
    setAlerts((prev) => prev.filter((a) => a.id !== id))
  }

  const clearAllAlerts = async () => {
    await fetch('/api/alerts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ readAll: true }),
    })
    setAlerts([])
  }

  return {
    current,
    history,
    alerts,
    isLoading,
    isConnected,
    dismissAlert,
    clearAllAlerts,
    refresh: fetchData,
  }
}