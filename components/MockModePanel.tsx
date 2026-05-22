'use client'
// components/MockModePanel.tsx
import { useState } from 'react'
import { Cpu, Play, Pause, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MockModePanelProps {
  isActive: boolean
  onToggle: (active: boolean) => void
}

export function MockModePanel({ isActive, onToggle }: MockModePanelProps) {
  const [loading, setLoading] = useState(false)

  const sendManual = async () => {
    setLoading(true)
    try {
      await fetch('/api/mock/simulate', { method: 'POST' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={cn(
        'zariya-card p-4 border-2 transition-colors duration-300',
        isActive ? 'border-zariya-300 bg-zariya-50/50' : 'border-cream-200'
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              'w-9 h-9 rounded-xl flex items-center justify-center transition-colors',
              isActive ? 'bg-zariya-100' : 'bg-cream-100'
            )}
          >
            <Cpu
              className={cn('w-5 h-5', isActive ? 'text-zariya-600' : 'text-zariya-400')}
            />
          </div>
          <div>
            <p className="text-sm font-medium text-zariya-700">Demo Mode</p>
            <p className="text-xs text-zariya-400">
              {isActive ? 'Simulating ESP32 data...' : 'No hardware connected'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={sendManual}
            disabled={loading}
            className="btn-ghost py-1 px-2.5 flex items-center gap-1.5 text-xs"
            title="Send one reading"
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Send</span>
          </button>

          <button
            onClick={() => onToggle(!isActive)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all',
              isActive
                ? 'bg-zariya-600 text-white hover:bg-zariya-700'
                : 'bg-cream-100 text-zariya-600 hover:bg-cream-200 border border-cream-300'
            )}
          >
            {isActive ? (
              <>
                <Pause className="w-3.5 h-3.5" /> Stop
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" /> Start
              </>
            )}
          </button>
        </div>
      </div>

      {isActive && (
        <div className="mt-3 pt-3 border-t border-zariya-200/50">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-zariya-400 rounded-full animate-bounce"
                  style={{
                    height: `${8 + Math.random() * 12}px`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
            <span className="text-xs text-zariya-500">Streaming at 3s intervals</span>
          </div>
        </div>
      )}
    </div>
  )
}
