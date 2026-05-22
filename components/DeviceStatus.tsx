'use client'
// components/DeviceStatus.tsx
import { cn } from '@/lib/utils'
import { Radio, Smartphone, Battery, Signal } from 'lucide-react'

interface DeviceStatusProps {
  isConnected: boolean
  lastTimestamp?: string | null
}

export function DeviceStatus({ isConnected, lastTimestamp }: DeviceStatusProps) {
  const lastSeen = lastTimestamp
    ? new Date(lastTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : 'Never'

  return (
    <div className="zariya-card p-4">
      <h3 className="text-sm font-semibold text-zariya-700 mb-3 flex items-center gap-2">
        <Radio className="w-4 h-4 text-zariya-400" />
        Device Status
      </h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-zariya-300" />
            <span className="text-xs text-zariya-500">ESP32 + BNO055</span>
          </div>
          <div className={cn('flex items-center gap-1.5 text-xs font-medium', isConnected ? 'text-sage-600' : 'text-zariya-400')}>
            <div className={cn('w-2 h-2 rounded-full', isConnected ? 'bg-sage-400 animate-pulse' : 'bg-zariya-200')} />
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Signal className="w-4 h-4 text-zariya-300" />
            <span className="text-xs text-zariya-500">Last reading</span>
          </div>
          <span className="text-xs font-mono text-zariya-600">{lastSeen}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Battery className="w-4 h-4 text-zariya-300" />
            <span className="text-xs text-zariya-500">API endpoint</span>
          </div>
          <code className="text-xs bg-cream-100 text-zariya-600 px-2 py-0.5 rounded-md font-mono">
            POST /api/posture
          </code>
        </div>
      </div>
    </div>
  )
}
