'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { HUDCard } from '@/components/HUDCard'
import { Terminal, Activity, Zap, TrendingUp, Brain, Clock, AlertTriangle, Lightbulb, CheckCircle2, DollarSign, GripHorizontal } from 'lucide-react'

export function Patterns() {
  const [selectedPeriod, setSelectedPeriod] = useState('today')
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null)

  const behaviorMetrics = [
    { id: 'momentum', label: 'Momentum', value: 87, trend: '+12%', description: 'Velocity & Consistency', icon: Zap, color: 'text-emerald-400' },
    { id: 'consistency', label: 'Stability', value: 73, trend: '+5%', description: 'Routine Adherence', icon: Activity, color: 'text-cyan-400' },
    { id: 'efficiency', label: 'Efficiency', value: 91, trend: '+8%', description: 'Intentional Action', icon: TrendingUp, color: 'text-fuchsia-400' },
    { id: 'balance', label: 'Balance', value: 68, trend: '-3%', description: 'Life Distribution', icon: Brain, color: 'text-amber-400' }
  ]

  const timelineEvents = [
    { id: 1, time: '06:00', event: 'Meditation', type: 'HABIT', duration: '30m', color: 'bg-emerald-500', icon: Brain },
    { id: 2, time: '07:30', event: 'Training', type: 'HABIT', duration: '60m', color: 'bg-cyan-500', icon: Zap },
    { id: 3, time: '09:00', event: 'Coffee', type: 'EXPENSE', duration: '15m', color: 'bg-amber-500', icon: DollarSign },
    { id: 4, time: '12:30', event: 'Lunch', type: 'EXPENSE', duration: '45m', color: 'bg-blue-500', icon: DollarSign },
    { id: 5, time: '14:00', event: 'Deep Work', type: 'HABIT', duration: '120m', color: 'bg-purple-500', icon: Clock },
    { id: 6, time: '20:00', event: 'Dinner', type: 'EXPENSE', duration: '90m', color: 'bg-red-500', icon: DollarSign },
    { id: 7, time: '22:30', event: 'Reading', type: 'HABIT', duration: '45m', color: 'bg-indigo-500', icon: Brain }
  ]

  const insights = [
    { title: 'Peak Performance', description: 'Productivity optimized 2-4 PM. Morning routine correlation: HIGH.', confidence: 94, type: 'OPTIMAL' },
    { title: 'Spending Alert', description: 'Evening expenses +40% when morning routine is skipped.', confidence: 87, type: 'WARNING' },
    { title: 'Synergy Found', description: 'Pre-sleep reading boosts next-day consistency by 23%.', confidence: 91, type: 'INSIGHT' }
  ]

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-cyan-500/30 overflow-x-hidden pt-8 pb-24">

      {/* Tech Background Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-20"
        style={{ backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#050505_100%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-10 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-cyan-950/30 border border-cyan-500/30">
              <Brain className="text-cyan-400" size={28} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-wide mb-1">Pattern Recognition</h1>
              <div className="flex items-center gap-2 text-sm text-cyan-500">
                <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                Analysis Active • Deep Learning Model
              </div>
            </div>
          </div>

          {/* Period Selector */}
          <div className="flex gap-1 bg-slate-900/50 p-1.5 border border-slate-800 rounded-lg">
            {['Today', 'Week', 'Month'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period.toLowerCase())}
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

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {behaviorMetrics.map((metric) => (
            <HUDCard key={metric.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm text-slate-400">{metric.label}</span>
                <metric.icon size={18} className={metric.color} />
              </div>

              <div className="flex items-end gap-3 mb-3">
                <span className="text-5xl font-bold text-white">{metric.value}</span>
                <span className={`text-lg font-semibold mb-1 ${metric.color}`}>{metric.trend}</span>
              </div>

              <div className="w-full bg-slate-800 h-2 rounded-full mb-3">
                <div className={`h-full rounded-full ${metric.color.replace('text-', 'bg-')} opacity-70`} style={{ width: `${metric.value}%` }} />
              </div>

              <span className="text-sm text-slate-500">{metric.description}</span>
            </HUDCard>
          ))}
        </div>

        {/* Timeline */}
        <HUDCard title="Today's Timeline" className="mb-10 overflow-hidden p-6">
          <div className="relative pt-6 pb-4 overflow-x-auto">
            <div className="min-w-[900px] px-4 relative">
              <div className="absolute top-[4rem] left-0 right-0 h-0.5 bg-gradient-to-r from-slate-800 via-cyan-900/50 to-slate-800" />

              <div className="flex justify-between items-start relative">
                {timelineEvents.map((event) => (
                  <div
                    key={event.id}
                    className="relative flex flex-col items-center group cursor-pointer"
                    style={{ flex: 1 }}
                    onMouseEnter={() => setHoveredEvent(event.event)}
                    onMouseLeave={() => setHoveredEvent(null)}
                  >
                    {/* Time */}
                    <span className="text-base font-semibold text-slate-300 mb-3 group-hover:text-cyan-400 transition-colors">
                      {event.time}
                    </span>

                    {/* Node */}
                    <div className={`w-4 h-4 rotate-45 border-2 border-slate-900 ${event.color} transition-all group-hover:scale-150 z-10`} />

                    {/* Connector */}
                    <div className={`h-10 w-0.5 ${hoveredEvent === event.event ? 'bg-cyan-500' : 'bg-slate-700'} transition-colors my-2`} />

                    {/* Event Card */}
                    <div className={`p-4 border min-w-[130px] transition-all text-center ${hoveredEvent === event.event
                        ? 'border-cyan-500 bg-cyan-950/30 scale-105'
                        : 'border-slate-800 bg-slate-900/50'
                      }`}>
                      <event.icon size={20} className={`mx-auto mb-2 ${event.color.replace('bg-', 'text-')}`} />
                      <div className="text-base font-semibold text-white mb-1">{event.event}</div>
                      <div className="flex justify-between items-center text-sm text-slate-500">
                        <span>{event.duration}</span>
                        <span className={event.type === 'HABIT' ? 'text-emerald-500' : 'text-amber-500'}>{event.type}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </HUDCard>

        {/* AI Insights */}
        <h2 className="text-xl font-semibold text-slate-300 mb-5 pl-3 border-l-4 border-cyan-500">
          AI Predictions
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
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
                      insight.type === 'WARNING' ? 'bg-amber-500' :
                        'bg-purple-500'
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