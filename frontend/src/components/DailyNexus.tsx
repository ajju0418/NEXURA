'use client'

import { useEffect } from 'react'
import { Zap, Book, Moon, TrendingUp, CheckCircle2, AlertCircle, Brain, Droplets } from 'lucide-react'
import { useHabitsStore } from '../stores/habitsStore'

export function DailyNexus() {
    const { habits, isLoading, error, fetchHabits, completeHabit, clearError } = useHabitsStore()
    const completedCount = habits.filter(h => h.isCompletedToday).length

    useEffect(() => {
        fetchHabits()
    }, [fetchHabits])

    const handleCompleteHabit = async (id: string) => {
        try {
            await completeHabit(id)
        } catch (error) {
            console.error('Failed to complete habit:', error)
        }
    }

    if (isLoading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 bg-slate-900/50 border border-slate-800 rounded-lg animate-pulse" />
                ))}
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-red-400 p-4 border border-red-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                    <AlertCircle size={16} />
                    <span>Failed to load habits</span>
                </div>
                <p className="text-sm text-red-300">{error}</p>
                <button 
                    onClick={() => { clearError(); fetchHabits(); }}
                    className="mt-2 text-sm text-red-400 hover:text-red-300 underline"
                >
                    Try again
                </button>
            </div>
        )
    }

    const getIcon = (name: string, iconStr?: string) => {
        if (iconStr === 'brain') return Brain
        if (iconStr === 'zap') return Zap
        if (iconStr === 'book') return Book
        if (iconStr === 'moon') return Moon
        if (iconStr === 'droplets') return Droplets
        // Fallback to name matching
        if (name.toLowerCase().includes('meditation')) return Brain
        if (name.toLowerCase().includes('exercise') || name.toLowerCase().includes('workout')) return Zap
        if (name.toLowerCase().includes('read')) return Book
        if (name.toLowerCase().includes('sleep')) return Moon
        if (name.toLowerCase().includes('hydra') || name.toLowerCase().includes('water')) return Droplets
        return Zap
    }

    const getColor = (color?: string) => {
        if (color) return color
        return '#10B981'
    }

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

            {/* Progress bar */}
            {habits.length > 0 && (
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${habits.length > 0 ? (completedCount / habits.length) * 100 : 0}%` }}
                    />
                </div>
            )}

            {/* Habit List */}
            <div className="space-y-3">
                {habits.length === 0 ? (
                    <div className="text-slate-500 text-center py-8">
                        No habits found. Create your first habit to get started!
                    </div>
                ) : (
                    habits.map((habit) => {
                        const IconComponent = getIcon(habit.name, habit.icon)
                        const color = getColor(habit.color)
                        const completed = habit.isCompletedToday
                        return (
                            <div
                                key={habit.id}
                                className={`flex items-center gap-4 p-4 border transition-all cursor-pointer rounded-lg ${
                                    completed
                                        ? 'border-emerald-500/30 bg-emerald-950/20'
                                        : 'border-slate-800 bg-slate-900/30 hover:border-slate-700'
                                }`}
                                onClick={() => !completed && handleCompleteHabit(habit.id)}
                            >
                                {/* Icon */}
                                <div
                                    className="w-12 h-12 flex items-center justify-center rounded-lg"
                                    style={{ backgroundColor: completed ? '#10B981' : color + '33' }}
                                >
                                    <IconComponent size={22} className="text-white" />
                                </div>

                                {/* Details */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className={`text-base font-semibold ${completed ? 'text-emerald-400' : 'text-white'}`}>
                                            {habit.name}
                                        </h4>
                                        {completed && <CheckCircle2 size={16} className="text-emerald-400" />}
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-slate-500">
                                        <span>{habit.streak} day streak</span>
                                        {habit.targetTime && <span>• {habit.targetTime}</span>}
                                    </div>
                                </div>

                                {/* Status */}
                                <div className={`px-3 py-1.5 text-sm font-medium rounded ${
                                    completed
                                        ? 'bg-emerald-500/20 text-emerald-400'
                                        : 'bg-slate-800 text-slate-400'
                                }`}>
                                    {completed ? 'Done' : 'Pending'}
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}