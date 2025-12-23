'use client'

import { useState, useEffect } from 'react'
import { PerformanceRadar } from '@/components/PerformanceRadar'
import { DailyNexus } from '@/components/DailyNexus'
import { RecentExpenses } from '@/components/RecentExpenses'
import { HUDCard } from '@/components/HUDCard'
import { Activity, TrendingUp, Zap, Wallet, Terminal } from 'lucide-react'

export function Home() {
  const [greeting, setGreeting] = useState('')
  const [currentDate, setCurrentDate] = useState('')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 18) setGreeting('Good afternoon')
    else setGreeting('Good evening')

    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: '2-digit' }
    setCurrentDate(new Date().toLocaleDateString('en-US', options).toUpperCase())
  }, [])

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-cyan-500/30 overflow-x-hidden">

      {/* Tech Background Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-20"
        style={{ backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#050505_100%)]" />

      {/* Main Interface */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-8 pb-24">

        {/* Header with SYSTEM.ONLINE style - Bigger */}
        <div className="mb-10 pt-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <Terminal size={20} className="text-cyan-500" />
            <span className="text-base font-mono text-cyan-500 tracking-[0.3em] font-bold uppercase">SYSTEM.ONLINE</span>
            <div className="flex gap-1 ml-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-emerald-500/30 rounded-full" />
              <div className="w-2 h-2 bg-emerald-500/30 rounded-full" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-mono font-bold tracking-tight text-white mb-3">
            {greeting}
          </h1>
          <div className="text-lg font-mono text-slate-500 tracking-widest">{currentDate} // ID: ALEX-01</div>
        </div>

        {/* Main Grid - Performance & Habits First */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">

          {/* 1. Radar Analysis */}
          <div className="lg:col-span-5">
            <HUDCard title="Performance Overview" className="h-full min-h-[500px] p-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <Activity size={20} className="text-cyan-400" />
                  <span className="text-lg font-medium text-slate-300">Live Analysis</span>
                </div>
                <span className="text-base text-slate-500">Auto-refresh</span>
              </div>
              <PerformanceRadar />

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-slate-900/50 p-5 border border-slate-800 rounded-lg">
                  <div className="text-base text-slate-500 mb-2">Top Score</div>
                  <div className="text-2xl font-bold text-emerald-400">Finance • 91%</div>
                </div>
                <div className="bg-slate-900/50 p-5 border border-slate-800 rounded-lg">
                  <div className="text-base text-slate-500 mb-2">Needs Focus</div>
                  <div className="text-2xl font-bold text-amber-400">Sleep • 65%</div>
                </div>
              </div>
            </HUDCard>
          </div>

          {/* 2. Daily Habits */}
          <div className="lg:col-span-7">
            <HUDCard title="Today's Habits" className="h-full p-6">
              <DailyNexus />
            </HUDCard>
          </div>
        </div>

        {/* Quick Stats Row - Below Performance & Habits */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <HUDCard className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Health Score</p>
                <p className="text-4xl font-bold text-emerald-400">87%</p>
              </div>
              <Activity size={36} className="text-emerald-400 opacity-50" />
            </div>
          </HUDCard>
          <HUDCard className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Energy Level</p>
                <p className="text-4xl font-bold text-cyan-400">73%</p>
              </div>
              <Zap size={36} className="text-cyan-400 opacity-50" />
            </div>
          </HUDCard>
          <HUDCard className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Budget Left</p>
                <p className="text-4xl font-bold text-fuchsia-400">₹5.5K</p>
              </div>
              <Wallet size={36} className="text-fuchsia-400 opacity-50" />
            </div>
          </HUDCard>
          <HUDCard className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Week Progress</p>
                <p className="text-4xl font-bold text-amber-400">60%</p>
              </div>
              <TrendingUp size={36} className="text-amber-400 opacity-50" />
            </div>
          </HUDCard>
        </div>

        {/* 3. Recent Expenses */}
        <div>
          <HUDCard title="Recent Transactions" className="p-6">
            <RecentExpenses />
          </HUDCard>
        </div>

      </div>
    </div>
  )
}
