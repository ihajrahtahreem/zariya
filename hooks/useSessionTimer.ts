'use client'
// hooks/useSessionTimer.ts
import { useState, useEffect } from 'react'

export function useSessionTimer() {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => s + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  const formatted =
    hours > 0
      ? `${hours}h ${minutes.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`
      : `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`

  return { seconds, formatted, hours, minutes, secs }
}
