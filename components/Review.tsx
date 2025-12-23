'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { HUDCard } from '@/components/HUDCard'
import { Terminal, Activity, Zap, TrendingUp, Brain, Clock, ChevronRight, AlertTriangle, Lightbulb, Wallet, Target, Award, PieChart, BarChart3, ArrowRight } from 'lucide-react'

export function Review() {
  const [selectedPeriod, setSelectedPeriod] = useState('week')

  const weeklyStats = [
    {
      label: 'COMPLETION_RATE',
      value: 78,
      change: '+12%',
      description: 'PROTOCOL_ADHERENCE',
      color: 'text-emerald-400',
      icon: Target
    },
    {
      label: 'BUDGET_DELTA',
      value: 85,
      change: '+5%',
      description: 'RESOURCE_EFFICIENCY',
      color: 'text-cyan-400',
      icon: Wallet
    },
    {
      label: 'FOCUS_INDEX',
      value: 92,
      change: '+18%',
      description: 'COGNITIVE_OUTPUT',
      color: 'text-fuchsia-400',
      icon: Zap
    },
    {
      label: 'BIO_SCORE',
      value: 74,
      change: '-3%',
      description: 'WELLNESS_METRIC',
      color: 'text-amber-400',
      icon: Activity
    }
  ]

  const habitAnalysis = [
    { name: 'MEDITATION', completion: 85, streak: 12, impact: 'HIGH', color: 'bg-emerald-500' },
    { name: 'TRAINING', completion: 71, streak: 8, impact: 'HIGH', color: 'bg-cyan-500' },
    { name: 'READING', completion: 92, streak: 15, impact: 'MED', color: 'bg-indigo-500' },
    { name: 'LOG_ENTRY', completion: 57, streak: 3, impact: 'MED', color: 'bg-amber-500' },
    { name: 'SLEEP_CYCLE', completion: 43, streak: 2, impact: 'CRIT', color: 'bg-red-500' }
  ]

  const spendingInsights = [
    { category: 'NUTRITION', amount: 10955, budget: 14000, trend: 'UNDER', transactions: 12, color: 'text-emerald-400', progress: 'bg-emerald-500' },
    { category: 'TRANSPORT', amount: 6244, budget: 7000, trend: 'UNDER', transactions: 8, color: 'text-cyan-400', progress: 'bg-cyan-500' },
    { category: 'LEISURE', amount: 10206, budget: 8400, trend: 'OVER', transactions: 6, color: 'text-red-400', progress: 'bg-red-500' },
    { category: 'EQUIPMENT', amount: 5523, budget: 10500, trend: 'UNDER', transactions: 4, color: 'text-purple-400', progress: 'bg-purple-500' }
  ]

  const aiInsights = [
    {
      id: 'pattern1',
      title: 'MORNING_ROUTINE_OPTIMIZATION',
      description: 'Meditation efficiency +34% when executed post-training. Sequence adjustment recommended.',
      confidence: 94,
      impact: 'HIGH',
      type: 'PROTOCOL'
    },
    {
      id: 'pattern2',
      title: 'SPENDING_CORRELATION',
      description: 'Leisure expenditure vector increases 67% on non-routine days.',
      confidence: 87,
      impact: 'MED',
      type: 'RESOURCE'
    },
    {
      id: 'pattern3',
      title: 'PRODUCTIVITY_PEAK',
      description: 'Cognitive output maximized 1400-1600. optimal slot for deep work.',
      confidence: 91,
      impact: 'HIGH',
      type: 'PERFORMANCE'
    }
  ]

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-cyan-500/30 overflow-x-hidden pt-24 pb-32">

      {/* Tech Background Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-20"
        style={{ backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#050505_100%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-12 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-950/30 border border-cyan-500/30">
              <PieChart className="text-cyan-400" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-mono font-bold text-white tracking-widest uppercase mb-1">System_Audit</h1>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-500 uppercase tracking-widest">
                <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                Performance Review // Cycle Active
              </div>
            </div>
          </div>

          {/* Period Selector */}
          <div className="flex gap-1 bg-slate-900/50 p-1 border border-slate-800">
            {['WEEK', 'MONTH', 'QUARTER'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period.toLowerCase())}
                className={`px-6 py-2 font-mono text-xs transition-all ${selectedPeriod === period.toLowerCase()
                    ? 'bg-cyan-950/50 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-500 hover:text-slate-300'
                  }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Weekly Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {weeklyStats.map((stat) => (
            <HUDCard key={stat.label} className="relative group">
              <div className="flex justify-between items-start mb-4">
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{stat.label}</div>
                <stat.icon size={14} className={stat.color} />
              </div>

              <div className="flex items-end gap-2 mb-2">
                <div className="text-4xl font-mono font-bold text-white tracking-tighter">{stat.value}</div>
                <div className={`text-xs font-mono mb-1.5 ${stat.color}`}>{stat.change}</div>
              </div>
              <div className="w-full bg-slate-800 h-1 mb-3">
                <div className={`h-full ${stat.color.replace('text-', 'bg-')} opacity-60`} style={{ width: `${stat.value}%` }} />
              </div>
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{stat.description}</div>
            </HUDCard>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

          {/* Habit Analysis */}
          <HUDCard title="PROTOCOL_EFFICIENCY">
            <div className="space-y-4 mt-2">
              {habitAnalysis.map((habit) => (
                <div key={habit.name} className="group">
                  <div className="flex justify-between items-end mb-1">
                    <span className="font-mono text-xs text-slate-300 tracking-wider group-hover:text-cyan-400 transition-colors uppercase">{habit.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-slate-500">{habit.streak} DAY STREAK</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 border border-slate-800 ${habit.impact === 'HIGH' ? 'text-emerald-500 bg-emerald-950/30' :
                          habit.impact === 'MED' ? 'text-amber-500 bg-amber-950/30' : 'text-red-500 bg-red-950/30'
                        }`}>{habit.impact}</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 border border-slate-800">
                    <div className={`h-full ${habit.color} transition-all duration-500`} style={{ width: `${habit.completion}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </HUDCard>

          {/* Spending Analysis */}
          <HUDCard title="RESOURCE_ALLOCATION">
            <div className="space-y-4 mt-2">
              {spendingInsights.map((cat) => (
                <div key={cat.category} className="group">
                  <div className="flex justify-between items-end mb-1">
                    <span className="font-mono text-xs text-slate-300 tracking-wider group-hover:text-cyan-400 transition-colors uppercase">{cat.category}</span>
                    <span className={`text-[10px] font-mono ${cat.color}`}>
                      {cat.trend === 'UNDER' ? '▼' : '▲'} {Math.abs(cat.amount - cat.budget)}
                    </span>
                  </div>

                  <div className="w-full bg-slate-900 h-1.5 border border-slate-800 mb-1 relative overflow-hidden">
                    {/* Budget Marker Line if over budget? No, simpler bar */}
                    <div className={`h-full ${cat.progress} transition-all duration-500`} style={{ width: `${Math.min((cat.amount / cat.budget) * 100, 100)}%` }} />
                  </div>

                  <div className="flex justify-between items-center text-[9px] font-mono text-slate-500">
                    <span>{cat.amount} / {cat.budget}</span>
                    <span>{cat.transactions} TRANSACTIONS</span>
                  </div>
                </div>
              ))}
            </div>
          </HUDCard>
        </div>

        {/* AI Insights */}
        <h2 className="text-sm font-mono text-slate-500 uppercase tracking-widest pl-2 border-l-2 border-cyan-500 mb-6">
          System_Optimization_Recommendations
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {aiInsights.map((insight, i) => (
            <HUDCard key={i} className="group hover:border-cyan-500/30 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="p-1.5 border border-purple-500/30 bg-purple-500/10 text-purple-400">
                  <Brain size={14} />
                </div>
                <div className="text-[10px] font-mono text-slate-600">CONFIDENCE: {insight.confidence}%</div>
              </div>

              <h3 className="font-mono text-xs text-white mb-2 tracking-wider">{insight.title}</h3>
              <p className="font-mono text-[10px] text-slate-400 leading-relaxed mb-4">
                {'>'} {insight.description}
              </p>

              <div className="flex items-center gap-2 mt-auto">
                <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">IMPACT_VECTOR:</span>
                <div className={`text-[9px] font-mono px-2 py-0.5 border border-slate-800 ${insight.impact === 'HIGH' ? 'text-emerald-500 bg-emerald-950/30' : 'text-amber-500 bg-amber-950/30'
                  }`}>
                  {insight.impact}
                </div>
              </div>
            </HUDCard>
          ))}
        </div>

      </div>
    </div>
  )
}