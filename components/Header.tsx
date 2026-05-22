'use client'
// components/Header.tsx
import { cn } from '@/lib/utils'
import { useSessionTimer } from '@/hooks/useSessionTimer'
import { Wifi, WifiOff, Clock, Bell, Heart } from 'lucide-react'

interface HeaderProps {
  isConnected: boolean
  unreadAlerts: number
  onAlertsClick: () => void
}

export function Header({ isConnected, unreadAlerts, onAlertsClick }: HeaderProps) {
  const { formatted } = useSessionTimer()

  return (
    <header className="relative gradient-header noise-overlay overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-8 -right-8 w-64 h-64 rounded-full bg-zariya-800/20 blur-3xl" />
        <div className="absolute -bottom-4 left-1/4 w-48 h-48 rounded-full bg-cream-500/10 blur-2xl" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cream-400/30 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-zariya-400 to-zariya-600 flex items-center justify-center shadow-lg">
              <Heart className="w-5 h-5 text-white fill-white" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-semibold tracking-widest text-cream-100 leading-none">
                ZARIYA
              </h1>
              <p className="text-cream-400/70 text-[10px] md:text-xs tracking-wider font-body hidden sm:block">
                Real-time posture protection for new mothers
              </p>
            </div>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Session Timer */}
            <div className="hidden md:flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
              <Clock className="w-3.5 h-3.5 text-cream-400" />
              <span className="font-mono text-xs text-cream-300">{formatted}</span>
            </div>

            {/* Connection Status */}
            <div
              className={cn(
                'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border transition-all duration-300',
                isConnected
                  ? 'bg-sage-500/20 border-sage-400/30 text-sage-300'
                  : 'bg-red-500/20 border-red-400/30 text-red-300'
              )}
            >
              {isConnected ? (
                <Wifi className="w-3.5 h-3.5" />
              ) : (
                <WifiOff className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">{isConnected ? 'Live' : 'Offline'}</span>
            </div>

            {/* Alerts Button */}
            <button
              onClick={onAlertsClick}
              className="relative p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-150"
            >
              <Bell className="w-5 h-5 text-cream-300" />
              {unreadAlerts > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-zariya-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                  {unreadAlerts > 9 ? '9+' : unreadAlerts}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
