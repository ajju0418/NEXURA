'use client'

import { useState, useEffect } from 'react'
import { HUDCard } from '@/components/HUDCard'
import { Terminal, Activity, Zap, TrendingUp, Brain, Clock, AlertTriangle, Lightbulb, DollarSign } from 'lucide-react'
import { apiService } from '@/services/api'
import { useDashboardStore } from '@/stores/dashboardStore'

interface TimelineEvent {
  id: string
  time: string
  event: string
  type: string
  duration?: number
  color: string
  icon: string
  metadata?: string
}

const ICON_MAP: Record<string, any> = {
  brain: Brain,
  zap: Zap,
  'dollar-sign': DollarSign,
  target: Activity,
  circle: Clock,
  book: Brain,
  moon: Clock,
  droplets: Activity,
}

export function Patterns() {
  const [selectedPeriod, setSelectedPeriod] = useState('today')
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null)
  const [timeline, setTimeline] = useState<{ date: string; events: TimelineEvent[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const { stats, fetchDashboard } = useDashboardStore()

  useEffect(() => {
    fetchDashboard()
    loadTimeline()
  }, [fetchDashboard])

  const loadTimeline = async (date?: string) => {
    setLoading(true)
    try {
      const data = await apiService.getTimeline(date)
      setTimeline(data)
    } catch (err) {
      console.error('Failed to load timeline:', err)
    } finally {
      setLoading(false)
    }
  }

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period)
    if (period === 'today') {
      loadTimeline()
    } else if (period === 'week') {
      const d = new Date()
      d.setDate(d.getDate() - 1)
      loadTimeline(d.toISOString().split('T')[0])
    }
  }

  const getEventIcon = (event: TimelineEvent) => {
    if (event.icon && ICON_MAP[event.icon]) return ICON_MAP[event.icon]
    if (event.type === 'HABIT') return Zap
    if (event.type === 'EXPENSE') return DollarSign
    return Clock
  }

  const getEventColorClass = (event: TimelineEvent) => {
    const color = event.color || '#6B7280'
    const colorMap: Record<string, string> = {
      '#10B981': 'bg-emerald-500',
      '#22D3EE': 'bg-cyan-500',
      '#8B5CF6': 'bg-purple-500',
      '#F59E0B': 'bg-amber-500',
      '#6366F1': 'bg-indigo-500',
      '#06B6D4': 'bg-cyan-500',
    }
    return colorMap[color] || 'bg-slate-500'
  }

  // Compute behavior metrics from dashboard stats
  const performanceData = stats?.performance || []
  const avgScore = performanceData.length > 0
    ? Math.round(performanceData.reduce((s, p) => s + p.A, 0) / performanceData.length)
    : 0
  const habitCompletionRate = stats?.habits
    ? (stats.habits.total > 0 ? Math.round((stats.habits.completedToday / stats.habits.total) * 100) : 0)
    : 0

  const behaviorMetrics = [
    { id: 'momentum', label: 'Momentum', value: Math.min(100, avgScore + 10), trend: '+12%', description: 'Velocity & Consistency', icon: Zap, color: 'text-emerald-400' },
    { id: 'consistency', label: 'Stability', value: habitCompletionRate, trend: `${habitCompletionRate}%`, description: 'Routine Adherence', icon: Activity, color: 'text-cyan-400' },
    { id: 'efficiency', label: 'Efficiency', value: Math.min(100, avgScore + 5), trend: '+8%', description: 'Intentional Action', icon: TrendingUp, color: 'text-fuchsia-400' },
    { id: 'balance', label: 'Balance', value: avgScore, trend: `${avgScore}%`, description: 'Life Distribution', icon: Brain, color: 'text-amber-400' }
  ]

  // Dynamic insights based on real data
  const insights = [
    {
      title: 'Habit Momentum',
      description: stats?.habits
        ? `${stats.habits.completedToday}/${stats.habits.total} habits completed today. Best streak: ${stats.habits.bestStreak} days.`
        : 'Loading habit data...',
      confidence: habitCompletionRate || 50,
      type: habitCompletionRate >= 60 ? 'OPTIMAL' : 'WARNING',
    },
    {
      title: 'Budget Status',
      description: stats?.expenses
        ? `₹${stats.expenses.totalThisMonth.toLocaleString()} spent of ₹${stats.expenses.monthlyBudget.toLocaleString()} budget. ₹${stats.expenses.budgetLeft.toLocaleString()} remaining.`
        : 'Loading expense data...',
      confidence: stats?.expenses ? Math.round((stats.expenses.budgetLeft / stats.expenses.monthlyBudget) * 100) : 50,
      type: (stats?.expenses?.budgetLeft ?? 0) > 0 ? 'INSIGHT' : 'WARNING',
    },
    {
      title: 'Performance Analysis',
      description: stats?.topScore && stats?.lowScore
        ? `Top area: ${stats.topScore.name} (${stats.topScore.value}%). Focus needed: ${stats.lowScore.name} (${stats.lowScore.value}%).`
        : 'Analyzing performance patterns...',
      confidence: avgScore || 50,
      type: 'INSIGHT',
    }
  ]

  const events = timeline?.events || []

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none opacity-20"
        style={{ backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#050505_100%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-8 pb-24">
        {/* Header */}
        <div className="mb-10 pt-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <Terminal size={20} className="text-cyan-500" />
            <span className="text-base font-mono text-cyan-500 tracking-[0.3em] font-bold uppercase">SYSTEM.ONLINE</span>
            <div className="flex gap-1 ml-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-emerald-500/30 rounded-full" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-cyan-950/30 border border-cyan-500/30 rounded-lg">
                <Brain className="text-cyan-400" size={28} />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-2">Pattern Recognition</h1>
                <div className="flex items-center gap-2 text-base text-slate-500">
                  <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                  Analysis Active • Live Data
                </div>
              </div>
            </div>

            <div className="flex gap-1 bg-slate-900/50 p-1.5 border border-slate-800 rounded-lg">
              {['Today', 'Week', 'Month'].map((period) => (
                <button
                  key={period}
                  onClick={() => handlePeriodChange(period.toLowerCase())}
                  className={`px-5 py-2.5 text-sm font-medium rounded-md transition-all ${selectedPeriod === period.toLowerCase()
                    ? 'bg-cyan-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {behaviorMetrics.map((metric) => (
            <HUDCard key={metric.id} className="p-5">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm text-slate-400">{metric.label}</span>
                <metric.icon size={18} className={metric.color} />
              </div>
              <div className="flex items-end gap-3 mb-3">
                <span className="text-4xl font-bold text-white">{metric.value}</span>
                <span className={`text-base font-semibold mb-1 ${metric.color}`}>{metric.trend}</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full mb-3">
                <div className={`h-full rounded-full ${metric.color.replace('text-', 'bg-')}`} style={{ width: `${metric.value}%` }} />
              </div>
              <span className="text-sm text-slate-500">{metric.description}</span>
            </HUDCard>
          ))}
        </div>

        {/* Timeline */}
        <HUDCard title="Today's Timeline" className="mb-8 p-6 overflow-hidden">
          {loading ? (
            <div className="text-slate-400 text-center py-8 animate-pulse">Loading timeline...</div>
          ) : events.length === 0 ? (
            <div className="text-slate-500 text-center py-8">No events recorded for this period.</div>
          ) : (
            <div className="relative pt-6 pb-4 overflow-x-auto">
              <div className="min-w-[700px] px-4 relative">
                <div className="absolute top-[4rem] left-0 right-0 h-0.5 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800" />
                <div className="flex justify-between items-start relative">
                  {events.map((event) => {
                    const EventIcon = getEventIcon(event)
                    const colorClass = getEventColorClass(event)
                    return (
                      <div
                        key={event.id}
                        className="relative flex flex-col items-center group cursor-pointer"
                        style={{ flex: 1 }}
                        onMouseEnter={() => setHoveredEvent(event.event)}
                        onMouseLeave={() => setHoveredEvent(null)}
                      >
                        <span className="text-base font-semibold text-slate-300 mb-3 group-hover:text-cyan-400 transition-colors">
                          {event.time}
                        </span>
                        <div className={`w-4 h-4 rotate-45 border-2 border-slate-900 ${colorClass} transition-all group-hover:scale-150 z-10`} />
                        <div className={`h-10 w-0.5 ${hoveredEvent === event.event ? 'bg-cyan-500' : 'bg-slate-700'} transition-colors my-2`} />
                        <div className={`p-4 border min-w-[130px] transition-all text-center ${hoveredEvent === event.event
                          ? 'border-cyan-500 bg-cyan-950/30 scale-105'
                          : 'border-slate-800 bg-slate-900/50'
                          }`}>
                          <EventIcon size={20} className={`mx-auto mb-2 ${colorClass.replace('bg-', 'text-')}`} />
                          <div className="text-base font-semibold text-white mb-1">{event.event}</div>
                          <div className="flex justify-between items-center text-sm text-slate-500">
                            <span>{event.duration ? `${event.duration}m` : ''}</span>
                            <span className={event.type === 'HABIT' ? 'text-emerald-500' : 'text-amber-500'}>{event.type}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </HUDCard>

        {/* AI Insights */}
        <h2 className="text-xl font-semibold text-slate-300 mb-5 pl-3 border-l-4 border-cyan-500">
          AI Insights
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {insights.map((insight, i) => (
            <HUDCard key={i} className="p-6 hover:border-cyan-500/30 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2 border rounded-lg ${insight.type === 'OPTIMAL' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' :
                  insight.type === 'WARNING' ? 'border-amber-500/30 bg-amber-500/10 text-amber-400' :
                    'border-purple-500/30 bg-purple-500/10 text-purple-400'
                  }`}>
                  {insight.type === 'OPTIMAL' ? <Zap size={18} /> :
                    insight.type === 'WARNING' ? <AlertTriangle size={18} /> :
                      <Lightbulb size={18} />}
                </div>
                <span className="text-sm text-slate-500">{insight.confidence}% confidence</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{insight.title}</h3>
              <p className="text-base text-slate-400 leading-relaxed mb-4">{insight.description}</p>
              <div className="w-full bg-slate-900 h-1.5 rounded-full">
                <div
                  className={`h-full rounded-full ${insight.type === 'OPTIMAL' ? 'bg-emerald-500' :
                    insight.type === 'WARNING' ? 'bg-amber-500' : 'bg-purple-500'
                    }`}
                  style={{ width: `${insight.confidence}%` }}
                />
              </div>
            </HUDCard>
          ))}
        </div>

      </div>
    </div>
  )
}