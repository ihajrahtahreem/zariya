'use client'
// components/PostureHistory.tsx
import { postureConfig, formatDeviation, type PostureStatus } from '@/lib/utils'
import { History, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PostureEntry {
  id: string
  posture: PostureStatus
  deviation: number
  timestamp: string
}

interface PostureHistoryProps {
  history: PostureEntry[]
}

export function PostureHistory({ history }: PostureHistoryProps) {
  const recent = history.slice(0, 15)

  if (recent.length === 0) {
    return (
      <div className="zariya-card p-6 flex flex-col items-center justify-center py-12 text-center">
        <History className="w-8 h-8 text-cream-400 mb-3" />
        <p className="text-zariya-400 text-sm">No history yet</p>
      </div>
    )
  }

  return (
    <div className="zariya-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="section-title text-xl">Recent History</h3>
        <span className="text-xs text-zariya-400">{history.length} readings</span>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {recent.map((entry, i) => {
          const config = postureConfig[entry.posture]
          const isGood = entry.posture === 'good'
          const isBad = entry.posture === 'bad' || entry.posture === 'very_bad'

          return (
            <div
              key={entry.id}
              className={cn(
                'flex items-center gap-3 p-3 rounded-xl border transition-colors',
                i === 0 && 'bg-cream-50 border-cream-200',
                i > 0 && 'border-transparent hover:bg-cream-50'
              )}
            >
              {/* Dot */}
              <div
                className={cn(
                  'w-3 h-3 rounded-full flex-shrink-0',
                  isGood && 'bg-sage-400',
                  entry.posture === 'warning' && 'bg-amber-400',
                  isBad && 'bg-red-500'
                )}
              />

              {/* Label */}
              <span
                className={cn(
                  'text-sm font-medium flex-1 min-w-0 truncate',
                  isGood && 'text-sage-700',
                  entry.posture === 'warning' && 'text-amber-700',
                  isBad && 'text-red-700'
                )}
              >
                {config.label}
              </span>

              {/* Deviation */}
              <span className="font-mono text-sm text-zariya-500 flex-shrink-0">
                {formatDeviation(entry.deviation)}
              </span>

              {/* Time */}
              <span className="text-xs text-zariya-300 flex-shrink-0 hidden sm:block">
                {new Date(entry.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
