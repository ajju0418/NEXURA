'use client'

import { motion } from 'framer-motion'
import { Zap, Activity, Coins } from 'lucide-react'

interface MetricCoreProps {
    label: string
    value: number
    max?: number
    icon: 'zap' | 'activity' | 'coins'
    color: string // Expecting 'emerald', 'cyan', 'fuchsia' etc base names for custom construction
}

export function MetricCore({ label, value, max = 100, icon, color }: MetricCoreProps) {
    // Map icons
    const Icon = icon === 'zap' ? Zap : icon === 'coins' ? Coins : Activity

    // Calculate percentage for bar
    const percent = Math.min((value / max) * 100, 100)

    // Dynamic classes based on color prop
    // Note: Safelist these or ensure they exist. Using style for dynamic colors often safer but keeping tailwind class logic for consistency if established.
    // For safety with JIT, I'll use specific mappings.
    const colorMap: Record<string, { bg: string, text: string, border: string, glow: string }> = {
        emerald: { bg: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500/30', glow: 'shadow-emerald-500/20' },
        cyan: { bg: 'bg-cyan-500', text: 'text-cyan-400', border: 'border-cyan-500/30', glow: 'shadow-cyan-500/20' },
        fuchsia: { bg: 'bg-fuchsia-500', text: 'text-fuchsia-400', border: 'border-fuchsia-500/30', glow: 'shadow-fuchsia-500/20' },
    }

    const theme = colorMap[color] || colorMap.cyan

    return (
        <div className={`relative flex flex-col w-full bg-slate-900/40 p-4 border border-slate-800 backdrop-blur-sm group overflow-hidden`}>
            {/* Glow behind */}
            <div className={`absolute top-0 right-0 w-24 h-24 ${theme.bg} opacity-5 blur-[50px] transition-opacity group-hover:opacity-10`} />

            {/* Header */}
            <div className="flex items-center justify-between mb-3 relative z-10">
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">MODULE: {label}</span>
                <Icon size={14} className={`${theme.text}`} />
            </div>

            {/* Main Value */}
            <div className="flex items-end gap-2 mb-4 relative z-10">
                <span className={`text-3xl font-bold font-mono text-white tracking-tighter`}>{value}</span>
                <span className="text-xs text-slate-600 font-mono mb-1">/ {max} UNITS</span>
            </div>

            {/* Technical Progress Bar */}
            <div className="relative h-1.5 w-full bg-slate-800 mb-2 overflow-hidden">
                {/* Ticks */}
                <div className="absolute inset-0 flex justify-between px-[1px]">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="w-[1px] h-full bg-slate-900 z-20" />
                    ))}
                </div>
                {/* Fill */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`absolute top-0 left-0 h-full ${theme.bg} shadow-[0_0_10px_currentColor]`}
                />
            </div>

            {/* Footer info */}
            <div className="flex justify-between items-center relative z-10">
                <div className={`text-[9px] ${theme.text} font-mono animate-pulse`}>
                    {value > 80 ? 'OPTIMAL' : value > 50 ? 'STABLE' : 'CRITICAL'}
                </div>
                <div className="text-[9px] text-slate-600 font-mono">
                    {percent}% CAP
                </div>
            </div>

            {/* Corner Decor */}
            <div className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r ${theme.border}`} />
        </div>
    )
}
