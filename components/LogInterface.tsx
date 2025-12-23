'use client'

import { useState } from 'react'
import { HUDCard } from '@/components/HUDCard'
import { PenTool, Activity, Zap, Droplets, BookOpen, Moon, CreditCard, ShoppingBag, Car, Film, Coffee, Utensils, History, TrendingDown, Flame, Award } from 'lucide-react'

export function LogInterface() {
  const [mode, setMode] = useState<'habit' | 'expense'>('habit')
  const [selectedHabit, setSelectedHabit] = useState<string | null>(null)
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')

  const habits = [
    { id: 'meditation', name: 'Meditation', icon: Activity, streak: 12, lastDone: 'Today, 6:30 AM' },
    { id: 'exercise', name: 'Exercise', icon: Zap, streak: 8, lastDone: 'Yesterday' },
    { id: 'reading', name: 'Reading', icon: BookOpen, streak: 15, lastDone: 'Today, 9:00 PM' },
    { id: 'water', name: 'Hydration', icon: Droplets, streak: 5, lastDone: 'Today, 3:00 PM' },
    { id: 'sleep', name: 'Early Sleep', icon: Moon, streak: 3, lastDone: '2 days ago' }
  ]

  const expenseCategories = [
    { id: 'food', name: 'Food & Dining', icon: Utensils, avg: '₹450/day' },
    { id: 'transport', name: 'Transport', icon: Car, avg: '₹200/day' },
    { id: 'shopping', name: 'Shopping', icon: ShoppingBag, avg: '₹1200/week' },
    { id: 'entertainment', name: 'Entertainment', icon: Film, avg: '₹800/week' },
    { id: 'coffee', name: 'Coffee', icon: Coffee, avg: '₹150/day' },
    { id: 'other', name: 'Other', icon: CreditCard, avg: 'Varies' }
  ]

  const recentLogs = [
    { type: 'habit', name: 'Meditation', time: '6:30 AM', icon: Activity },
    { type: 'expense', name: 'Coffee - ₹180', time: '9:00 AM', icon: Coffee },
    { type: 'habit', name: 'Reading', time: '9:00 PM', icon: BookOpen },
  ]

  const quickStats = [
    { label: 'Habits Today', value: '3/5', icon: Flame, color: 'text-emerald-400' },
    { label: 'Spent Today', value: '₹850', icon: TrendingDown, color: 'text-cyan-400' },
    { label: 'Best Streak', value: '15 days', icon: Award, color: 'text-amber-400' },
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
        <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-cyan-950/30 border border-cyan-500/30 rounded-lg">
              <PenTool className="text-cyan-400" size={28} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Quick Log</h1>
              <p className="text-lg text-slate-400">Track your habits and expenses in one place</p>
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {quickStats.map((stat) => (
            <HUDCard key={stat.label} className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <stat.icon size={32} className={`${stat.color} opacity-50`} />
              </div>
            </HUDCard>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Main Input Area */}
          <div className="lg:col-span-8">
            {/* Mode Switcher */}
            <div className="flex gap-3 mb-6">
              {['habit', 'expense'].map((type) => (
                <button
                  key={type}
                  onClick={() => setMode(type as any)}
                  className={`flex-1 py-5 px-6 text-xl font-semibold rounded-xl transition-all ${mode === type
                      ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20'
                      : 'bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                >
                  {type === 'habit' ? '✓ Log Habit' : '₹ Log Expense'}
                </button>
              ))}
            </div>

            <HUDCard className="p-8">
              {mode === 'habit' ? (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Which habit did you complete?</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {habits.map((habit) => (
                      <button
                        key={habit.id}
                        onClick={() => setSelectedHabit(habit.id)}
                        className={`flex items-center gap-4 p-6 border rounded-xl transition-all ${selectedHabit === habit.id
                            ? 'border-emerald-500 bg-emerald-950/20 scale-[1.02]'
                            : 'border-slate-800 bg-slate-900/30 hover:border-slate-700 hover:bg-slate-900/50'
                          }`}
                      >
                        <div className={`p-3 rounded-lg ${selectedHabit === habit.id ? 'bg-emerald-500' : 'bg-slate-800'}`}>
                          <habit.icon size={28} className="text-white" />
                        </div>
                        <div className="text-left flex-1">
                          <div className={`text-lg font-semibold ${selectedHabit === habit.id ? 'text-emerald-400' : 'text-white'}`}>
                            {habit.name}
                          </div>
                          <div className="text-sm text-slate-500">{habit.streak} day streak</div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {selectedHabit && (
                    <button className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white text-xl font-bold rounded-xl transition-colors shadow-lg shadow-emerald-500/20">
                      Complete Habit ✓
                    </button>
                  )}
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Log your expense</h2>

                  {/* Amount Input */}
                  <div className="mb-8">
                    <label className="block text-base text-slate-400 mb-3">Amount (₹)</label>
                    <input
                      type="text"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0"
                      className="w-full bg-slate-900/50 border-2 border-slate-800 rounded-xl text-5xl font-bold text-white py-6 px-8 focus:border-cyan-500 focus:outline-none transition-colors text-center"
                    />
                  </div>

                  {amount && (
                    <>
                      <h3 className="text-lg font-semibold text-slate-300 mb-4">Select category</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                        {expenseCategories.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => setCategory(cat.id)}
                            className={`flex flex-col items-center gap-3 p-5 border rounded-xl transition-all ${category === cat.id
                                ? 'border-cyan-500 bg-cyan-950/20 text-cyan-400 scale-[1.02]'
                                : 'border-slate-800 bg-slate-900/30 text-slate-400 hover:border-slate-700'
                              }`}
                          >
                            <cat.icon size={28} />
                            <div className="text-center">
                              <span className="text-base font-medium block">{cat.name}</span>
                              <span className="text-xs text-slate-500">{cat.avg}</span>
                            </div>
                          </button>
                        ))}
                      </div>

                      {category && (
                        <button className="w-full py-5 bg-cyan-600 hover:bg-cyan-500 text-white text-xl font-bold rounded-xl transition-colors shadow-lg shadow-cyan-500/20">
                          Save Expense
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </HUDCard>
          </div>

          {/* Sidebar - Recent Activity */}
          <div className="lg:col-span-4">
            <HUDCard title="Recent Activity" className="p-6 h-full">
              <div className="flex items-center gap-2 mb-6 text-slate-400">
                <History size={18} />
                <span className="text-base">Today's Log</span>
              </div>

              <div className="space-y-4">
                {recentLogs.map((log, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-slate-900/50 border border-slate-800 rounded-lg">
                    <div className={`p-2 rounded-lg ${log.type === 'habit' ? 'bg-emerald-500/20' : 'bg-cyan-500/20'}`}>
                      <log.icon size={20} className={log.type === 'habit' ? 'text-emerald-400' : 'text-cyan-400'} />
                    </div>
                    <div className="flex-1">
                      <div className="text-base font-medium text-white">{log.name}</div>
                      <div className="text-sm text-slate-500">{log.time}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-slate-900/30 border border-slate-800 rounded-lg">
                <p className="text-sm text-slate-400 text-center">
                  💡 <span className="text-cyan-400">Tip:</span> Logging consistently helps build better habits!
                </p>
              </div>
            </HUDCard>
          </div>
        </div>
      </div>
    </div>
  )
}