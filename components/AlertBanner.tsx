'use client'
// components/AlertBanner.tsx
import { cn } from '@/lib/utils'
import { AlertTriangle, X, XCircle, Bell } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Alert {
  id: string
  message: string
  severity: string
  posture?: string
  deviation?: number
  createdAt: string
}

interface AlertBannerProps {
  alerts: Alert[]
  onDismiss: (id: string) => void
  onClearAll: () => void
}

export function AlertBanner({ alerts, onDismiss, onClearAll }: AlertBannerProps) {
  const [visible, setVisible] = useState(false)
  const activeAlerts = alerts.filter((a) => !a.read).slice(0, 3)

  useEffect(() => {
    if (activeAlerts.length > 0) {
      setVisible(true)
    }
  }, [activeAlerts.length])

  if (activeAlerts.length === 0 || !visible) return null

  const critical = activeAlerts.some((a) => a.severity === 'critical')

  return (
    <div className="space-y-2 animate-fade-in">
      {/* Header */}
      {activeAlerts.length > 1 && (
        <div className="flex items-center justify-between px-1">
          <span className="text-xs text-zariya-400 font-medium flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5" />
            {activeAlerts.length} active alert{activeAlerts.length > 1 ? 's' : ''}
          </span>
          <button
            onClick={onClearAll}
            className="text-xs text-zariya-400 hover:text-zariya-600 transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      {activeAlerts.map((alert) => (
        <AlertItem key={alert.id} alert={alert} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

function AlertItem({ alert, onDismiss }: { alert: Alert; onDismiss: (id: string) => void }) {
  const [dismissed, setDismissed] = useState(false)
  const isCritical = alert.severity === 'critical'

  const handleDismiss = () => {
    setDismissed(true)
    setTimeout(() => onDismiss(alert.id), 300)
  }

  return (
    <div
      className={cn(
        'relative rounded-2xl border p-4 flex items-start gap-3 transition-all duration-300 slide-in-top',
        dismissed && 'opacity-0 translate-y-2',
        isCritical
          ? 'bg-red-50 border-red-300 shadow-red-100 shadow-md'
          : 'bg-amber-50 border-amber-200'
      )}
    >
      {/* Flashing indicator for critical */}
      {isCritical && (
        <div className="absolute top-3 left-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
          </span>
        </div>
      )}

      <div
        className={cn(
          'flex-shrink-0 mt-0.5',
          isCritical ? 'ml-4 text-red-500' : 'text-amber-500'
        )}
      >
        {isCritical ? (
          <XCircle className="w-5 h-5" />
        ) : (
          <AlertTriangle className="w-5 h-5" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'text-sm font-medium leading-snug',
            isCritical ? 'text-red-800' : 'text-amber-800'
          )}
        >
          {alert.message}
        </p>
        <p
          className={cn(
            'text-xs mt-0.5',
            isCritical ? 'text-red-500' : 'text-amber-500'
          )}
        >
          {new Date(alert.createdAt).toLocaleTimeString()}
        </p>
      </div>

      <button
        onClick={handleDismiss}
        className={cn(
          'flex-shrink-0 p-1 rounded-lg transition-colors',
          isCritical
            ? 'hover:bg-red-100 text-red-400 hover:text-red-600'
            : 'hover:bg-amber-100 text-amber-400 hover:text-amber-600'
        )}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
