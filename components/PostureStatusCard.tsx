'use client'
// components/PostureStatusCard.tsx
import { cn, postureConfig, formatDeviation, type PostureStatus } from '@/lib/utils'
import { Activity, TrendingUp, Zap } from 'lucide-react'

interface PostureStatusCardProps {
  posture: PostureStatus | null
  deviation: number | null
  timestamp: string | null
  isLoading: boolean
}

export function PostureStatusCard({
  posture,
  deviation,
  timestamp,
  isLoading,
}: PostureStatusCardProps) {
  if (isLoading) {
    return (
      <div className="zariya-card p-6 md:p-8 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-cream-200" />
          <div className="flex-1 space-y-3">
            <div className="h-8 bg-cream-200 rounded-lg w-1/2" />
            <div className="h-5 bg-cream-100 rounded-lg w-1/3" />
            <div className="h-4 bg-cream-100 rounded-lg w-2/3" />
          </div>
        </div>
      </div>
    )
  }

  if (!posture) {
    return (
      <div className="zariya-card p-6 md:p-8">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-20 h-20 rounded-full bg-cream-100 border-2 border-dashed border-cream-300 flex items-center justify-center mb-4">
            <Activity className="w-8 h-8 text-cream-400" />
          </div>
          <p className="font-display text-xl text-zariya-700">Awaiting Data</p>
          <p className="text-sm text-zariya-400 mt-1">
            Connect your device or enable demo mode
          </p>
        </div>
      </div>
    )
  }

  const config = postureConfig[posture]
  const isGood = posture === 'good'
  const isBad = posture === 'bad' || posture === 'very_bad'
  const formattedTime = timestamp
    ? new Date(timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : '--'

  return (
    <div
      className={cn(
        'zariya-card p-6 md:p-8 slide-in-top transition-all duration-500 relative overflow-hidden',
        isGood && 'border-sage-200',
        posture === 'warning' && 'border-amber-200',
        isBad && 'border-red-200'
      )}
    >
      {/* Background tint */}
      <div
        className={cn(
          'absolute inset-0 opacity-5 pointer-events-none transition-colors duration-500',
          isGood && 'bg-sage-400',
          posture === 'warning' && 'bg-amber-400',
          isBad && 'bg-red-400'
        )}
      />

      <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5 md:gap-8">
        {/* Status orb */}
        <div className="flex-shrink-0 flex flex-col items-center gap-2">
          <div
            className={cn(
              'relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500',
              isGood && 'posture-good bg-sage-100 border-4 border-sage-300',
              posture === 'warning' && 'bg-amber-50 border-4 border-amber-300',
              posture === 'bad' && 'posture-bad bg-red-50 border-4 border-red-300',
              posture === 'very_bad' && 'posture-bad bg-red-100 border-4 border-red-500'
            )}
          >
            {/* Inner pulse ring */}
            <div
              className={cn(
                'absolute inset-2 rounded-full opacity-30 pulse-ring',
                isGood && 'bg-sage-400',
                posture === 'warning' && 'bg-amber-400',
                isBad && 'bg-red-400'
              )}
            />

            <div className="relative z-10 text-4xl">{config.emoji}</div>
          </div>
          <span className="text-xs text-zariya-400 font-mono">{formattedTime}</span>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h2
              className={cn(
                'font-display text-3xl md:text-4xl font-medium leading-tight',
                isGood && 'text-sage-700',
                posture === 'warning' && 'text-amber-700',
                isBad && 'text-red-700'
              )}
            >
              {config.label}
            </h2>
            <span
              className={cn(
                'badge text-xs mt-1',
                isGood && 'bg-sage-100 text-sage-700',
                posture === 'warning' && 'bg-amber-100 text-amber-700',
                isBad && 'bg-red-100 text-red-700'
              )}
            >
              LIVE
            </span>
          </div>

          <p className="text-sm text-zariya-500 mb-4">{config.description}</p>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-cream-50 rounded-xl p-3 border border-cream-200">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-zariya-400" />
                <span className="text-xs text-zariya-400">Deviation</span>
              </div>
              <span
                className={cn(
                  'font-mono text-xl font-semibold',
                  isGood && 'text-sage-600',
                  posture === 'warning' && 'text-amber-600',
                  isBad && 'text-red-600'
                )}
              >
                {formatDeviation(deviation!)}
              </span>
            </div>

            <div className="bg-cream-50 rounded-xl p-3 border border-cream-200">
              <div className="flex items-center gap-1.5 mb-1">
                <Zap className="w-3.5 h-3.5 text-zariya-400" />
                <span className="text-xs text-zariya-400">Range</span>
              </div>
              <span className="font-mono text-sm font-medium text-zariya-600">
                {config.deviationRange}
              </span>
            </div>

            <div className="bg-cream-50 rounded-xl p-3 border border-cream-200">
              <div className="flex items-center gap-1.5 mb-1">
                <Activity className="w-3.5 h-3.5 text-zariya-400" />
                <span className="text-xs text-zariya-400">Status</span>
              </div>
              <span
                className={cn(
                  'text-sm font-medium capitalize',
                  isGood && 'text-sage-600',
                  posture === 'warning' && 'text-amber-600',
                  isBad && 'text-red-600'
                )}
              >
                {posture.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
