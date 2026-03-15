'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { HUDCard } from '@/components/HUDCard'
import Image from 'next/image'
import { Activity, TrendingUp, Zap, Wallet, Terminal } from 'lucide-react'
import { useDashboardStore } from '@/stores/dashboardStore'

// Dynamic imports for heavy components (code splitting)
const PerformanceRadar = dynamic(
  () => import('@/components/PerformanceRadar').then(mod => ({ default: mod.PerformanceRadar })),
  {
    loading: () => (
      <div className="w-full h-[380px] flex items-center justify-center">
        <div className="text-cyan-400 animate-pulse">Loading chart...</div>
      </div>
    ),
    ssr: false
  }
)

const DailyNexus = dynamic(
  () => import('@/components/DailyNexus').then(mod => ({ default: mod.DailyNexus })),
  {
    loading: () => (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 bg-slate-900/50 border border-slate-800 rounded-lg animate-pulse" />
        ))}
      </div>
    ),
    ssr: false
  }
)

const RecentExpenses = dynamic(
  () => import('@/components/RecentExpenses').then(mod => ({ default: mod.RecentExpenses })),
  {
    loading: () => (
      <div className="space-y-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-16 bg-slate-900/50 border border-slate-800 rounded-lg animate-pulse" />
        ))}
      </div>
    ),
    ssr: false
  }
)

export function Home() {
  const [greeting, setGreeting] = useState('')
  const [currentDate, setCurrentDate] = useState('')
  const { stats, fetchDashboard } = useDashboardStore()

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 18) setGreeting('Good afternoon')
    else setGreeting('Good evening')

    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: '2-digit' }
    setCurrentDate(new Date().toLocaleDateString('en-US', options).toUpperCase())

    fetchDashboard()
  }, [fetchDashboard])

  const userName = stats?.user?.name || 'User'
  const userId = stats?.user?.userId || 'USER-01'
  const healthScore = stats?.stats?.healthScore ?? '--'
  const energyLevel = stats?.stats?.energyLevel ?? '--'
  const budgetLeft = stats?.expenses?.budgetLeft ?? 0
  const weekProgress = stats?.stats?.weekProgress ?? 0
  const topScore = stats?.topScore
  const lowScore = stats?.lowScore

  const formatBudget = (amount: number) => {
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`
    return `₹${amount}`
  }

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none opacity-20"
        style={{ backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#050505_100%)]" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-8 pb-24">
        <div className="mb-10 pt-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <Image
              src="/NEXURA_LOGO.png"
              alt="NEXURA"
              width={160}
              height={55}
              className="object-contain"
            />
            <span className="text-base font-mono text-cyan-500 tracking-[0.3em] font-bold uppercase">SYSTEM.ONLINE</span>
            <div className="flex gap-1 ml-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-emerald-500/30 rounded-full" />
              <div className="w-2 h-2 bg-emerald-500/30 rounded-full" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-heading font-bold tracking-tight text-white mb-3">
            {greeting}, {userName.split(' ')[0]}
          </h1>
          <div className="text-lg font-mono text-slate-500 tracking-widest">{currentDate} // ID: {userId}</div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          <div className="lg:col-span-5">
            <HUDCard title="Performance Overview" className="h-full min-h-[500px] p-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <Activity size={20} className="text-cyan-400" />
                  <span className="text-lg font-medium text-slate-300">Live Analysis</span>
                </div>
                <span className="text-base text-slate-500">Auto-refresh</span>
              </div>
              <PerformanceRadar data={stats?.performance} />
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-slate-900/50 p-5 border border-slate-800 rounded-lg">
                  <div className="text-base text-slate-500 mb-2">Top Score</div>
                  <div className="text-2xl font-bold text-emerald-400">
                    {topScore ? `${topScore.name} • ${topScore.value}%` : 'Loading...'}
                  </div>
                </div>
                <div className="bg-slate-900/50 p-5 border border-slate-800 rounded-lg">
                  <div className="text-base text-slate-500 mb-2">Needs Focus</div>
                  <div className="text-2xl font-bold text-amber-400">
                    {lowScore ? `${lowScore.name} • ${lowScore.value}%` : 'Loading...'}
                  </div>
                </div>
              </div>
            </HUDCard>
          </div>
          <div className="lg:col-span-7">
            <HUDCard title="Today's Habits" className="h-full p-6">
              <DailyNexus />
            </HUDCard>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <HUDCard className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Health Score</p>
                <p className="text-4xl font-bold text-emerald-400">{healthScore}%</p>
              </div>
              <Activity size={36} className="text-emerald-400 opacity-50" />
            </div>
          </HUDCard>
          <HUDCard className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Energy Level</p>
                <p className="text-4xl font-bold text-cyan-400">{energyLevel}%</p>
              </div>
              <Zap size={36} className="text-cyan-400 opacity-50" />
            </div>
          </HUDCard>
          <HUDCard className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Budget Left</p>
                <p className="text-4xl font-bold text-fuchsia-400">{formatBudget(budgetLeft)}</p>
              </div>
              <Wallet size={36} className="text-fuchsia-400 opacity-50" />
            </div>
          </HUDCard>
          <HUDCard className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Week Progress</p>
                <p className="text-4xl font-bold text-amber-400">{weekProgress}%</p>
              </div>
              <TrendingUp size={36} className="text-amber-400 opacity-50" />
            </div>
          </HUDCard>
        </div>
        <div>
          <HUDCard title="Recent Transactions" className="p-6">
            <RecentExpenses />
          </HUDCard>
        </div>
      </div>
    </div>
  )
}
