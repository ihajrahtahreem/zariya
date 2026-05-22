'use client'
// app/page.tsx (Dashboard)
import { useState } from 'react'
import { Header } from '@/components/Header'
import { PostureStatusCard } from '@/components/PostureStatusCard'
import { AlertBanner } from '@/components/AlertBanner'
import { AnalyticsChart } from '@/components/AnalyticsChart'
import { ZariyaChat } from '@/components/ZariyaChat'
import { PostureHistory } from '@/components/PostureHistory'
import { MockModePanel } from '@/components/MockModePanel'
import { DeviceStatus } from '@/components/DeviceStatus'
import { usePosture } from '@/hooks/usePosture'
import { useSocket } from '@/hooks/useSocket'
import { LayoutDashboard, MessageSquare, BarChart3, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

type Tab = 'dashboard' | 'analytics' | 'chat'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [mockMode, setMockMode] = useState(false)
  const [showAlerts, setShowAlerts] = useState(false)

  const { isConnected } = useSocket()
  const {
    current,
    history,
    alerts,
    isLoading,
    dismissAlert,
    clearAllAlerts,
  } = usePosture({ mockMode, mockIntervalMs: 3000 })

  const unreadAlerts = alerts.filter((a) => !a.read).length

  const tabs = [
    { id: 'dashboard' as Tab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analytics' as Tab, label: 'Analytics', icon: BarChart3 },
    { id: 'chat' as Tab, label: 'Zariya AI', icon: MessageSquare },
  ]

  return (
    <div className="min-h-screen gradient-zariya">
      <Header
        isConnected={isConnected}
        unreadAlerts={unreadAlerts}
        onAlertsClick={() => setShowAlerts((p) => !p)}
      />

      {/* Tab Navigation */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-cream-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-3.5 text-sm font-medium border-b-2 transition-all duration-150',
                    activeTab === tab.id
                      ? 'border-zariya-600 text-zariya-700'
                      : 'border-transparent text-zariya-400 hover:text-zariya-600 hover:border-cream-300'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Alerts panel */}
        {showAlerts && alerts.length > 0 && (
          <div className="mb-6 animate-slide-up">
            <AlertBanner
              alerts={alerts}
              onDismiss={dismissAlert}
              onClearAll={clearAllAlerts}
            />
          </div>
        )}

        {/* Alert banner auto-show for new critical alerts */}
        {!showAlerts &&
          alerts.some((a) => !a.read && a.severity === 'critical') && (
            <div className="mb-6">
              <AlertBanner
                alerts={alerts.filter((a) => !a.read && a.severity === 'critical').slice(0, 1)}
                onDismiss={dismissAlert}
                onClearAll={clearAllAlerts}
              />
            </div>
          )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-5 animate-fade-in">
            {/* Top row: Status + Device */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2">
                <PostureStatusCard
                  posture={current?.posture ?? null}
                  deviation={current?.deviation ?? null}
                  timestamp={current?.timestamp ?? null}
                  isLoading={isLoading}
                />
              </div>
              <div className="space-y-4">
                <DeviceStatus
                  isConnected={isConnected}
                  lastTimestamp={current?.timestamp}
                />
                <MockModePanel isActive={mockMode} onToggle={setMockMode} />
              </div>
            </div>

            {/* Recent alerts inline */}
            {alerts.filter((a) => !a.read).length > 0 && !showAlerts && (
              <AlertBanner
                alerts={alerts.filter((a) => !a.read)}
                onDismiss={dismissAlert}
                onClearAll={clearAllAlerts}
              />
            )}

            {/* History */}
            <PostureHistory history={history} />
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="animate-fade-in">
            <AnalyticsChart />
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <ZariyaChat />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 py-6 border-t border-cream-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-zariya-300 font-display tracking-wider">
            ZARIYA · Real-time posture protection for new mothers · Built with ♥
          </p>
        </div>
      </footer>
    </div>
  )
}
