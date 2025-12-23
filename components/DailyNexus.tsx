'use client'

import { Zap, Book, Moon, TrendingUp, CheckCircle2 } from 'lucide-react'

const habits = [
    { id: 1, name: 'Morning Meditation', streak: 12, completed: true, time: '6:30 AM', icon: Zap, color: 'bg-emerald-500' },
    { id: 2, name: 'Read 30 Minutes', streak: 45, completed: true, time: '8:00 PM', icon: Book, color: 'bg-blue-500' },
    { id: 3, name: 'Sleep Before 11', streak: 7, completed: false, time: '11:00 PM', icon: Moon, color: 'bg-indigo-500' },
]

export function DailyNexus() {
    const completedCount = habits.filter(h => h.completed).length

    return (
        <div className="space-y-4">
            {/* Summary Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                    <TrendingUp size={18} className="text-emerald-400" />
                    <span className="text-base font-medium text-slate-300">Today's Progress</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-white">{completedCount}</span>
                    <span className="text-base text-slate-500">/ {habits.length}</span>
                </div>
            </div>

            {/* Habit List */}
            <div className="space-y-3">
                {habits.map((habit) => (
                    <div
                        key={habit.id}
                        className={`flex items-center gap-4 p-4 border transition-all ${habit.completed
                                ? 'border-emerald-500/30 bg-emerald-950/20'
                                : 'border-slate-800 bg-slate-900/30 hover:border-slate-700'
                            }`}
                    >
                        {/* Icon */}
                        <div className={`w-12 h-12 ${habit.color} flex items-center justify-center rounded-lg`}>
                            <habit.icon size={22} className="text-white" />
                        </div>

                        {/* Details */}
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className={`text-base font-semibold ${habit.completed ? 'text-emerald-400' : 'text-white'}`}>
                                    {habit.name}
                                </h4>
                                {habit.completed && <CheckCircle2 size={16} className="text-emerald-400" />}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                <span>{habit.streak} day streak</span>
                                <span>• {habit.time}</span>
                            </div>
                        </div>

                        {/* Status */}
                        <div className={`px-3 py-1.5 text-sm font-medium rounded ${habit.completed
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-slate-800 text-slate-400'
                            }`}>
                            {habit.completed ? 'Done' : 'Pending'}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
