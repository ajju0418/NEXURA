'use client'

import { useState, useEffect } from 'react'
import { HUDCard } from '@/components/HUDCard'
import { PenTool, Activity, Zap, Droplets, Book, Moon, CreditCard, ShoppingBag, Car, Film, Coffee, Utensils, History, TrendingDown, Flame, Award, Brain, CheckCircle2, AlertCircle } from 'lucide-react'
import { useHabitsStore } from '@/stores/habitsStore'
import { useExpensesStore } from '@/stores/expensesStore'

export function LogInterface() {
  const [mode, setMode] = useState<'habit' | 'expense'>('habit')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)

  const { habits, fetchHabits, completeHabit } = useHabitsStore()
  const { expenses, fetchExpenses, createExpense } = useExpensesStore()

  useEffect(() => {
    fetchHabits()
    fetchExpenses()
  }, [fetchHabits, fetchExpenses])

  const completedToday = habits.filter(h => h.isCompletedToday).length

  const getHabitIcon = (name: string, icon?: string) => {
    if (icon === 'brain') return Brain
    if (icon === 'zap') return Zap
    if (icon === 'book') return Book
    if (icon === 'moon') return Moon
    if (icon === 'droplets') return Droplets
    if (name.toLowerCase().includes('meditation')) return Brain
    if (name.toLowerCase().includes('exercise') || name.toLowerCase().includes('workout')) return Zap
    if (name.toLowerCase().includes('read')) return Book
    if (name.toLowerCase().includes('sleep')) return Moon
    if (name.toLowerCase().includes('hydra') || name.toLowerCase().includes('water')) return Droplets
    return Activity
  }

  const handleCompleteHabit = async (id: string) => {
    try {
      await completeHabit(id)
    } catch (err) {
      console.error('Failed to complete habit:', err)
    }
  }

  const handleSaveExpense = async () => {
    if (!amount || !category) return
    setSaving(true)
    try {
      await createExpense({
        amount: parseFloat(amount),
        category,
        description: description || undefined,
      })
      setAmount('')
      setCategory('')
      setDescription('')
    } catch (err) {
      console.error('Failed to save expense:', err)
    } finally {
      setSaving(false)
    }
  }

  const expenseCategories = [
    { id: 'food', name: 'Food & Dining', icon: Utensils, avg: '₹450/day' },
    { id: 'transport', name: 'Transport', icon: Car, avg: '₹200/day' },
    { id: 'shopping', name: 'Shopping', icon: ShoppingBag, avg: '₹1200/week' },
    { id: 'entertainment', name: 'Entertainment', icon: Film, avg: '₹800/week' },
    { id: 'coffee', name: 'Coffee', icon: Coffee, avg: '₹150/day' },
    { id: 'other', name: 'Other', icon: CreditCard, avg: 'Varies' }
  ]

  const totalSpentToday = expenses
    .filter(e => {
      const d = new Date(e.date)
      const today = new Date()
      return d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDate() === today.getDate()
    })
    .reduce((sum, e) => sum + Number(e.amount), 0)

  const bestStreak = habits.reduce((max, h) => Math.max(max, h.longestStreak || 0), 0)

  const quickStats = [
    { label: 'Habits Today', value: `${completedToday}/${habits.length}`, icon: Flame, color: 'text-emerald-400' },
    { label: 'Spent Today', value: `₹${totalSpentToday.toLocaleString()}`, icon: TrendingDown, color: 'text-cyan-400' },
    { label: 'Best Streak', value: `${bestStreak} days`, icon: Award, color: 'text-amber-400' },
  ]

  // Recent activity from both habits and expenses
  const recentActivity = [
    ...habits
      .filter(h => h.isCompletedToday)
      .map(h => ({
        type: 'habit' as const,
        name: h.name,
        time: h.lastCompletedAt ? new Date(h.lastCompletedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '',
        icon: getHabitIcon(h.name, h.icon),
      })),
    ...expenses.slice(0, 5).map(e => ({
      type: 'expense' as const,
      name: `${e.category} - ₹${Number(e.amount).toLocaleString()}`,
      time: new Date(e.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      icon: expenseCategories.find(c => c.id === e.category)?.icon || CreditCard,
    })),
  ].slice(0, 6)

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-cyan-500/30 overflow-x-hidden pt-8 pb-24">
      <div className="fixed inset-0 pointer-events-none opacity-20"
        style={{ backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#050505_100%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-cyan-950/30 border border-cyan-500/30 rounded-lg">
              <PenTool className="text-cyan-400" size={28} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-2">Quick Log</h1>
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
                  {habits.length === 0 ? (
                    <div className="text-slate-500 text-center py-8">No habits found. Create habits from the Goals page.</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                      {habits.map((habit) => {
                        const Icon = getHabitIcon(habit.name, habit.icon)
                        const completed = habit.isCompletedToday
                        return (
                          <button
                            key={habit.id}
                            onClick={() => !completed && handleCompleteHabit(habit.id)}
                            disabled={completed}
                            className={`flex items-center gap-4 p-6 border rounded-xl transition-all ${completed
                              ? 'border-emerald-500/50 bg-emerald-950/20 opacity-75'
                              : 'border-slate-800 bg-slate-900/30 hover:border-slate-700 hover:bg-slate-900/50 hover:scale-[1.02] active:scale-[0.98]'
                              }`}
                          >
                            <div className={`p-3 rounded-lg ${completed ? 'bg-emerald-500' : 'bg-slate-800'}`}>
                              <Icon size={28} className="text-white" />
                            </div>
                            <div className="text-left flex-1">
                              <div className={`text-lg font-semibold flex items-center gap-2 ${completed ? 'text-emerald-400' : 'text-white'}`}>
                                {habit.name}
                                {completed && <CheckCircle2 size={16} />}
                              </div>
                              <div className="text-sm text-slate-500">{habit.streak} day streak</div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Log your expense</h2>

                  <div className="mb-8">
                    <label className="block text-base text-slate-400 mb-3">Amount (₹)</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0"
                      className="w-full bg-slate-900/50 border-2 border-slate-800 rounded-xl text-5xl font-bold text-white py-6 px-8 focus:border-cyan-500 focus:outline-none transition-colors text-center"
                    />
                  </div>

                  {amount && (
                    <>
                      <h3 className="text-lg font-semibold text-slate-300 mb-4">Select category</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
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
                            </div>
                          </button>
                        ))}
                      </div>

                      {category && (
                        <>
                          <div className="mb-6">
                            <label className="block text-base text-slate-400 mb-3">Description (optional)</label>
                            <input
                              type="text"
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              placeholder="What was this for?"
                              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl text-white py-4 px-6 focus:border-cyan-500 focus:outline-none transition-colors"
                            />
                          </div>
                          <button
                            onClick={handleSaveExpense}
                            disabled={saving}
                            className="w-full py-5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xl font-bold rounded-xl transition-colors shadow-lg shadow-cyan-500/20"
                          >
                            {saving ? 'Saving...' : 'Save Expense'}
                          </button>
                        </>
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
                {recentActivity.length === 0 ? (
                  <div className="text-slate-500 text-center py-8 text-sm">No activity yet today.</div>
                ) : (
                  recentActivity.map((log, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-slate-900/50 border border-slate-800 rounded-lg">
                      <div className={`p-2 rounded-lg ${log.type === 'habit' ? 'bg-emerald-500/20' : 'bg-cyan-500/20'}`}>
                        <log.icon size={20} className={log.type === 'habit' ? 'text-emerald-400' : 'text-cyan-400'} />
                      </div>
                      <div className="flex-1">
                        <div className="text-base font-medium text-white">{log.name}</div>
                        <div className="text-sm text-slate-500">{log.time}</div>
                      </div>
                    </div>
                  ))
                )}
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