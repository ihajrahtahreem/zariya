'use client'
// components/AnalyticsChart.tsx
import { useState, useEffect } from 'react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { TrendingUp, BarChart2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DailyStat {
  date: string
  label: string
  total: number
  good: number
  warning: number
  bad: number
  veryBad: number
  goodPercent: number
  avgDeviation: number
}

interface AnalyticsData {
  dailyStats: DailyStat[]
  summary: {
    totalLogs: number
    overallGoodPercent: number
    avgDeviation: number
    daysTracked: number
  }
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-cream-200 rounded-xl shadow-lg p-3 text-xs">
      <p className="font-semibold text-zariya-700 mb-2">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center gap-2 py-0.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-zariya-500 capitalize">{entry.name}:</span>
          <span className="font-medium text-zariya-800">
            {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
            {entry.name === 'avgDeviation' ? '°' : entry.name === 'goodPercent' ? '%' : ''}
          </span>
        </div>
      ))}
    </div>
  )
}

export function AnalyticsChart() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [chartType, setChartType] = useState<'posture' | 'deviation'>('posture')
  const [days, setDays] = useState(7)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/analytics?days=${days}`)
        const json = await res.json()
        setData(json)
      } catch {}
      setIsLoading(false)
    }
    load()
  }, [days])

  if (isLoading) {
    return (
      <div className="zariya-card p-6 flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-zariya-400 animate-spin" />
      </div>
    )
  }

  if (!data || data.dailyStats.length === 0) {
    return (
      <div className="zariya-card p-6 flex flex-col items-center justify-center h-64 text-center">
        <BarChart2 className="w-8 h-8 text-cream-400 mb-3" />
        <p className="text-zariya-400 text-sm">No analytics data yet</p>
        <p className="text-zariya-300 text-xs mt-1">Start tracking to see your progress</p>
      </div>
    )
  }

  const { dailyStats, summary } = data

  return (
    <div className="zariya-card p-5 md:p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="section-title text-xl">Posture Analytics</h3>
          <p className="text-xs text-zariya-400 mt-0.5">
            {summary.totalLogs} readings · {summary.daysTracked} days
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Chart type toggle */}
          <div className="flex rounded-xl overflow-hidden border border-cream-200 text-xs">
            <button
              onClick={() => setChartType('posture')}
              className={cn(
                'px-3 py-1.5 transition-colors',
                chartType === 'posture'
                  ? 'bg-zariya-600 text-white'
                  : 'bg-white text-zariya-500 hover:bg-cream-50'
              )}
            >
              Posture
            </button>
            <button
              onClick={() => setChartType('deviation')}
              className={cn(
                'px-3 py-1.5 transition-colors',
                chartType === 'deviation'
                  ? 'bg-zariya-600 text-white'
                  : 'bg-white text-zariya-500 hover:bg-cream-50'
              )}
            >
              Deviation
            </button>
          </div>

          {/* Days selector */}
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="text-xs border border-cream-200 rounded-xl px-2 py-1.5 bg-white text-zariya-600 focus:outline-none focus:border-zariya-400"
          >
            <option value={7}>7 days</option>
            <option value={14}>14 days</option>
            <option value={30}>30 days</option>
          </select>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3">
        <SummaryCard
          label="Good Posture"
          value={`${summary.overallGoodPercent}%`}
          trend={summary.overallGoodPercent >= 60 ? 'up' : 'down'}
        />
        <SummaryCard
          label="Avg Deviation"
          value={`${summary.avgDeviation}°`}
          trend={summary.avgDeviation <= 15 ? 'up' : 'down'}
        />
        <SummaryCard
          label="Readings"
          value={summary.totalLogs.toString()}
          trend="neutral"
        />
      </div>

      {/* Chart */}
      <div className="h-52 md:h-64">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'posture' ? (
            <BarChart data={dailyStats} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f5e5cc" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: '#8b6b5e' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#8b6b5e' }}
                axisLine={false}
                tickLine={false}
                width={28}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="good" stackId="a" fill="#4f7e4f" radius={[0, 0, 0, 0]} name="good" />
              <Bar dataKey="warning" stackId="a" fill="#d97706" name="warning" />
              <Bar dataKey="bad" stackId="a" fill="#dc2626" name="bad" />
              <Bar
                dataKey="veryBad"
                stackId="a"
                fill="#7f1d1d"
                radius={[4, 4, 0, 0]}
                name="veryBad"
              />
            </BarChart>
          ) : (
            <AreaChart data={dailyStats}>
              <defs>
                <linearGradient id="deviationGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c0432a" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#c0432a" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="goodGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f7e4f" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#4f7e4f" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5e5cc" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: '#8b6b5e' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#8b6b5e' }}
                axisLine={false}
                tickLine={false}
                width={28}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="avgDeviation"
                stroke="#c0432a"
                strokeWidth={2}
                fill="url(#deviationGrad)"
                name="avgDeviation"
              />
              <Area
                type="monotone"
                dataKey="goodPercent"
                stroke="#4f7e4f"
                strokeWidth={2}
                fill="url(#goodGrad)"
                name="goodPercent"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      {chartType === 'posture' && (
        <div className="flex items-center gap-4 text-xs text-zariya-400 flex-wrap">
          {[
            { color: '#4f7e4f', label: 'Good' },
            { color: '#d97706', label: 'Warning' },
            { color: '#dc2626', label: 'Bad' },
            { color: '#7f1d1d', label: 'Very Bad' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function SummaryCard({
  label,
  value,
  trend,
}: {
  label: string
  value: string
  trend: 'up' | 'down' | 'neutral'
}) {
  return (
    <div className="bg-cream-50 rounded-xl p-3 border border-cream-200">
      <p className="text-xs text-zariya-400 mb-1">{label}</p>
      <div className="flex items-end gap-1">
        <span className="font-mono text-lg font-semibold text-zariya-800">{value}</span>
        {trend === 'up' && <TrendingUp className="w-4 h-4 text-sage-500 mb-0.5" />}
        {trend === 'down' && <TrendingUp className="w-4 h-4 text-red-400 mb-0.5 rotate-180" />}
      </div>
    </div>
  )
}
