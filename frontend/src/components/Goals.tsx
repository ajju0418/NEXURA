'use client'

import { useState, useEffect } from 'react'
import { HUDCard } from '@/components/HUDCard'
import { Terminal, Target, Zap, Brain, Wallet, Activity, Plus, CheckCircle2, TrendingUp, Award, Calendar, Flame, Trophy, ArrowRight, X, Moon } from 'lucide-react'
import { useGoalsStore } from '@/stores/goalsStore'
import { useHabitsStore } from '@/stores/habitsStore'

const ICON_MAP: Record<string, any> = {
    brain: Brain,
    zap: Zap,
    wallet: Wallet,
    award: Award,
    moon: Moon,
    activity: Activity,
    target: Target,
}

export function Goals() {
    const { goals, isLoading, error, fetchGoals, createGoal, updateGoal, deleteGoal } = useGoalsStore()
    const { habits } = useHabitsStore()
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [newGoal, setNewGoal] = useState({
        name: '', type: 'habit' as 'habit' | 'budget' | 'milestone',
        target: 7, current: 0, unit: 'sessions', deadline: 'This Week',
    })

    useEffect(() => {
        fetchGoals()
    }, [fetchGoals])

    const getProgress = (goal: any) => goal.progress ?? Math.min((goal.current / goal.target) * 100, 100)
    const isComplete = (goal: any) => goal.isCompleted || goal.current >= goal.target

    const completedCount = goals.filter(isComplete).length
    const totalProgress = goals.length > 0
        ? Math.round(goals.reduce((acc, g) => acc + getProgress(g), 0) / goals.length)
        : 0
    const bestStreak = habits.reduce((max, h) => Math.max(max, h.longestStreak || 0), 0)

    const getGoalIcon = (goal: any) => {
        if (goal.icon && ICON_MAP[goal.icon]) return ICON_MAP[goal.icon]
        if (goal.type === 'budget') return Wallet
        if (goal.type === 'milestone') return Award
        return Target
    }

    const getGoalColor = (goal: any) => {
        if (goal.color) return goal.color
        if (goal.type === 'budget') return '#D946EF'
        if (goal.type === 'milestone') return '#F59E0B'
        return '#22D3EE'
    }

    const handleCreateGoal = async () => {
        try {
            await createGoal(newGoal)
            setShowCreateModal(false)
            setNewGoal({ name: '', type: 'habit', target: 7, current: 0, unit: 'sessions', deadline: 'This Week' })
        } catch (err) {
            console.error('Failed to create goal:', err)
        }
    }

    const handleIncrementGoal = async (goal: any) => {
        if (isComplete(goal)) return
        try {
            await updateGoal(goal.id, { current: goal.current + 1 })
        } catch (err) {
            console.error('Failed to update goal:', err)
        }
    }

    const achievements = [
        { name: '7-Day Streak', icon: Flame, unlocked: bestStreak >= 7 },
        { name: 'Budget Master', icon: Wallet, unlocked: goals.some(g => g.type === 'budget' && isComplete(g)) },
        { name: 'Early Bird', icon: Calendar, unlocked: completedCount >= 1 },
        { name: 'Champion', icon: Trophy, unlocked: completedCount >= 3 },
    ]

    if (isLoading && goals.length === 0) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="text-cyan-400 animate-pulse">Loading goals...</div>
            </div>
        )
    }

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
                            <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-lg">
                                <Target className="text-emerald-400" size={28} />
                            </div>
                            <div>
                                <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-2">Your Goals</h1>
                                <p className="text-lg text-slate-500">{completedCount} of {goals.length} goals completed</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center gap-2 px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white transition-all rounded-xl text-lg font-semibold shadow-lg shadow-emerald-500/20"
                        >
                            <Plus size={20} />
                            Add Goal
                        </button>
                    </div>
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
                                <p className="text-4xl font-bold text-cyan-400">{goals.filter(g => !isComplete(g)).length}</p>
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
                                <p className="text-4xl font-bold text-amber-400">{bestStreak}</p>
                            </div>
                            <Flame size={36} className="text-amber-400 opacity-50" />
                        </div>
                    </HUDCard>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Goals List */}
                    <div className="lg:col-span-8 space-y-4">
                        <h2 className="text-xl font-semibold text-white mb-4">Active Goals</h2>

                        {goals.length === 0 ? (
                            <div className="text-slate-500 text-center py-12">
                                No goals yet. Click "Add Goal" to create your first goal!
                            </div>
                        ) : (
                            goals.map((goal) => {
                                const progress = getProgress(goal)
                                const complete = isComplete(goal)
                                const GoalIcon = getGoalIcon(goal)
                                const goalColor = getGoalColor(goal)

                                return (
                                    <HUDCard
                                        key={goal.id}
                                        className={`p-6 transition-all ${complete ? 'border-emerald-500/30 bg-emerald-950/10' : ''}`}
                                    >
                                        <div className="flex items-start gap-5">
                                            <div
                                                className={`p-4 rounded-xl border cursor-pointer transition-all hover:scale-105 ${complete ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-slate-800 bg-slate-900/50'}`}
                                                onClick={() => handleIncrementGoal(goal)}
                                                title={complete ? 'Completed!' : 'Click to increment'}
                                            >
                                                {complete ? (
                                                    <CheckCircle2 size={28} className="text-emerald-400" />
                                                ) : (
                                                    <GoalIcon size={28} style={{ color: goalColor }} />
                                                )}
                                            </div>

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

                                                <div className="w-full bg-slate-900 h-3 rounded-full mb-3 overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full transition-all duration-500"
                                                        style={{ width: `${progress}%`, backgroundColor: complete ? '#10B981' : goalColor }}
                                                    />
                                                </div>

                                                <div className="flex items-center justify-between text-base">
                                                    <span className="text-slate-400">
                                                        <span className={`font-semibold ${complete ? 'text-emerald-400' : 'text-white'}`}>{goal.current}</span>
                                                        {' / '}<span>{goal.target} {goal.unit}</span>
                                                    </span>
                                                    <span className="text-lg font-bold" style={{ color: complete ? '#10B981' : goalColor }}>
                                                        {Math.round(progress)}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </HUDCard>
                                )
                            })
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        <HUDCard title="Achievements" className="p-6">
                            <div className="grid grid-cols-2 gap-3">
                                {achievements.map((a, i) => (
                                    <div key={i}
                                        className={`flex flex-col items-center p-4 rounded-xl border transition-all ${a.unlocked
                                            ? 'border-amber-500/30 bg-amber-500/10' : 'border-slate-800 bg-slate-900/50 opacity-50'
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

                        <div className="p-5 bg-gradient-to-br from-emerald-950/50 to-cyan-950/30 border border-emerald-500/20 rounded-xl">
                            <p className="text-lg text-white font-medium mb-2">
                                "Small steps lead to big changes."
                            </p>
                            <p className="text-sm text-slate-400">Keep pushing towards your goals!</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Goal Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 w-full max-w-lg">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white">Create New Goal</h2>
                            <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-slate-400 mb-2 block">Goal Name</label>
                                <input
                                    type="text" value={newGoal.name}
                                    onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                                    placeholder="e.g. Workout Sessions"
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                {(['habit', 'budget', 'milestone'] as const).map(t => (
                                    <button key={t} onClick={() => setNewGoal({ ...newGoal, type: t })}
                                        className={`py-3 rounded-lg border text-sm font-medium transition-all ${newGoal.type === t
                                            ? 'border-cyan-500 bg-cyan-950/30 text-cyan-400' : 'border-slate-700 text-slate-400 hover:border-slate-600'
                                            }`}
                                    >
                                        {t.charAt(0).toUpperCase() + t.slice(1)}
                                    </button>
                                ))}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-slate-400 mb-2 block">Target</label>
                                    <input type="number" value={newGoal.target}
                                        onChange={(e) => setNewGoal({ ...newGoal, target: parseFloat(e.target.value) || 0 })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-slate-400 mb-2 block">Unit</label>
                                    <input type="text" value={newGoal.unit}
                                        onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                                        placeholder="sessions, ₹, days"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-slate-400 mb-2 block">Deadline</label>
                                <input type="text" value={newGoal.deadline}
                                    onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                                    placeholder="This Week, This Month, Ongoing"
                                />
                            </div>
                            <button
                                onClick={handleCreateGoal}
                                disabled={!newGoal.name || !newGoal.target}
                                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-lg font-bold rounded-xl transition-colors"
                            >
                                Create Goal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
