'use client'

import { useState } from 'react'
import { HUDCard } from '@/components/HUDCard'
import { Target, Zap, Brain, Wallet, Activity, Plus, CheckCircle2, TrendingUp, Award, Calendar, Flame, Trophy, ArrowRight } from 'lucide-react'

interface Goal {
    id: string
    name: string
    target: number
    current: number
    unit: string
    type: 'habit' | 'budget' | 'milestone'
    icon: any
    color: string
    deadline: string
}

export function Goals() {
    const [goals] = useState<Goal[]>([
        { id: '1', name: 'Meditation Sessions', target: 7, current: 5, unit: 'sessions', type: 'habit', icon: Brain, color: 'text-emerald-400', deadline: 'This Week' },
        { id: '2', name: 'Workout Sessions', target: 5, current: 3, unit: 'sessions', type: 'habit', icon: Zap, color: 'text-cyan-400', deadline: 'This Week' },
        { id: '3', name: 'Food Budget', target: 14000, current: 8500, unit: '₹', type: 'budget', icon: Wallet, color: 'text-fuchsia-400', deadline: 'This Month' },
        { id: '4', name: 'Reading Streak', target: 30, current: 15, unit: 'days', type: 'milestone', icon: Award, color: 'text-amber-400', deadline: 'Ongoing' },
        { id: '5', name: 'Early Sleep', target: 7, current: 4, unit: 'nights', type: 'habit', icon: Activity, color: 'text-purple-400', deadline: 'This Week' },
    ])

    const getProgress = (goal: Goal) => Math.min((goal.current / goal.target) * 100, 100)
    const isComplete = (goal: Goal) => goal.current >= goal.target

    const completedCount = goals.filter(isComplete).length
    const totalProgress = Math.round(goals.reduce((acc, g) => acc + getProgress(g), 0) / goals.length)
    const habitsGoals = goals.filter(g => g.type === 'habit')
    const budgetGoals = goals.filter(g => g.type === 'budget')

    const achievements = [
        { name: '7-Day Streak', icon: Flame, unlocked: true },
        { name: 'Budget Master', icon: Wallet, unlocked: false },
        { name: 'Early Bird', icon: Calendar, unlocked: true },
        { name: 'Champion', icon: Trophy, unlocked: false },
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
                        <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-lg">
                            <Target className="text-emerald-400" size={28} />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Your Goals</h1>
                            <p className="text-lg text-slate-400">{completedCount} of {goals.length} goals completed this period</p>
                        </div>
                    </div>

                    {/* Add Goal Button */}
                    <button className="flex items-center gap-2 px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white transition-all rounded-xl text-lg font-semibold shadow-lg shadow-emerald-500/20">
                        <Plus size={20} />
                        Add Goal
                    </button>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <HUDCard className="p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Overall Progress</p>
                                <p className="text-4xl font-bold text-emerald-400">{totalProgress}%</p>
                            </div>
                            <TrendingUp size={36} className="text-emerald-400 opacity-50" />
                        </div>
                    </HUDCard>
                    <HUDCard className="p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Active Goals</p>
                                <p className="text-4xl font-bold text-cyan-400">{goals.length}</p>
                            </div>
                            <Target size={36} className="text-cyan-400 opacity-50" />
                        </div>
                    </HUDCard>
                    <HUDCard className="p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Completed</p>
                                <p className="text-4xl font-bold text-fuchsia-400">{completedCount}</p>
                            </div>
                            <CheckCircle2 size={36} className="text-fuchsia-400 opacity-50" />
                        </div>
                    </HUDCard>
                    <HUDCard className="p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Best Streak</p>
                                <p className="text-4xl font-bold text-amber-400">15</p>
                            </div>
                            <Flame size={36} className="text-amber-400 opacity-50" />
                        </div>
                    </HUDCard>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Goals List */}
                    <div className="lg:col-span-8 space-y-4">
                        <h2 className="text-xl font-semibold text-white mb-4">Active Goals</h2>

                        {goals.map((goal) => {
                            const progress = getProgress(goal)
                            const complete = isComplete(goal)

                            return (
                                <HUDCard
                                    key={goal.id}
                                    className={`p-6 transition-all ${complete ? 'border-emerald-500/30 bg-emerald-950/10' : 'hover:border-slate-700'}`}
                                >
                                    <div className="flex items-start gap-5">
                                        {/* Icon */}
                                        <div className={`p-4 rounded-xl border ${complete ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-slate-800 bg-slate-900/50'}`}>
                                            {complete ? (
                                                <CheckCircle2 size={28} className="text-emerald-400" />
                                            ) : (
                                                <goal.icon size={28} className={goal.color} />
                                            )}
                                        </div>

                                        {/* Goal Details */}
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-xl font-bold ${complete ? 'text-emerald-400 line-through opacity-70' : 'text-white'}`}>
                                                        {goal.name}
                                                    </span>
                                                    <span className={`text-sm px-3 py-1 rounded-lg font-medium ${goal.type === 'habit' ? 'bg-cyan-500/10 text-cyan-400' :
                                                            goal.type === 'budget' ? 'bg-fuchsia-500/10 text-fuchsia-400' :
                                                                'bg-amber-500/10 text-amber-400'
                                                        }`}>
                                                        {goal.type}
                                                    </span>
                                                </div>
                                                <span className="text-base text-slate-500">{goal.deadline}</span>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="w-full bg-slate-900 h-3 rounded-full mb-3 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-500 ${complete ? 'bg-emerald-500' : goal.color.replace('text-', 'bg-')}`}
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>

                                            {/* Stats */}
                                            <div className="flex items-center justify-between text-base">
                                                <span className="text-slate-400">
                                                    <span className={`font-semibold ${complete ? 'text-emerald-400' : 'text-white'}`}>{goal.current}</span>
                                                    {' / '}
                                                    <span>{goal.target} {goal.unit}</span>
                                                </span>
                                                <span className={`text-lg font-bold ${complete ? 'text-emerald-400' : goal.color}`}>
                                                    {Math.round(progress)}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </HUDCard>
                            )
                        })}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Achievements */}
                        <HUDCard title="Achievements" className="p-6">
                            <div className="grid grid-cols-2 gap-3">
                                {achievements.map((a, i) => (
                                    <div
                                        key={i}
                                        className={`flex flex-col items-center p-4 rounded-xl border transition-all ${a.unlocked
                                                ? 'border-amber-500/30 bg-amber-500/10'
                                                : 'border-slate-800 bg-slate-900/30 opacity-50'
                                            }`}
                                    >
                                        <a.icon size={28} className={a.unlocked ? 'text-amber-400' : 'text-slate-600'} />
                                        <span className={`text-sm mt-2 text-center ${a.unlocked ? 'text-amber-400' : 'text-slate-600'}`}>
                                            {a.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </HUDCard>

                        {/* Quick Actions */}
                        <HUDCard title="Quick Actions" className="p-6">
                            <div className="space-y-3">
                                <button className="w-full flex items-center justify-between p-4 bg-slate-900/50 border border-slate-800 rounded-lg hover:border-cyan-500/50 transition-all group">
                                    <span className="text-base text-slate-300">Create Habit Goal</span>
                                    <ArrowRight size={18} className="text-slate-600 group-hover:text-cyan-400 transition-colors" />
                                </button>
                                <button className="w-full flex items-center justify-between p-4 bg-slate-900/50 border border-slate-800 rounded-lg hover:border-cyan-500/50 transition-all group">
                                    <span className="text-base text-slate-300">Set Budget Limit</span>
                                    <ArrowRight size={18} className="text-slate-600 group-hover:text-cyan-400 transition-colors" />
                                </button>
                                <button className="w-full flex items-center justify-between p-4 bg-slate-900/50 border border-slate-800 rounded-lg hover:border-cyan-500/50 transition-all group">
                                    <span className="text-base text-slate-300">View All History</span>
                                    <ArrowRight size={18} className="text-slate-600 group-hover:text-cyan-400 transition-colors" />
                                </button>
                            </div>
                        </HUDCard>

                        {/* Motivation */}
                        <div className="p-5 bg-gradient-to-br from-emerald-950/50 to-cyan-950/30 border border-emerald-500/20 rounded-xl">
                            <p className="text-lg text-white font-medium mb-2">
                                "Small steps lead to big changes."
                            </p>
                            <p className="text-sm text-slate-400">Keep pushing towards your goals!</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
