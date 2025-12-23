'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface CircularMetricProps {
    label: string
    subLabel?: string
    value: number
    max?: number
    color: string // Expecting hex or tailwind class prefix that can be manipulated if needed
    gradientFrom: string
    gradientTo: string
}

export function CircularMetric({ label, value, max = 100, gradientFrom, gradientTo }: CircularMetricProps) {
    const radius = 55 // Slightly larger
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (value / max) * circumference

    // Extract color name from gradient class for text usage simplistically
    // e.g. "from-emerald-400" -> "text-emerald-400"
    const textColor = gradientFrom.replace('from-', 'text-')

    return (
        <div className="relative flex flex-col items-center justify-center">
            {/* Outer Glow/Reflection for 3D sphere feel */}
            <div className="relative w-48 h-48 flex items-center justify-center">

                {/* Main Glass Sphere Background */}
                <div className="absolute inset-0 rounded-full bg-slate-800/40 backdrop-blur-2xl shadow-[inset_0_2px_15px_rgba(255,255,255,0.1),_0_10px_30px_rgba(0,0,0,0.5)] border border-slate-700/30">
                    {/* Top Highlight for convexity */}
                    <div className="absolute top-0 left-1/4 right-1/4 h-1/2 bg-gradient-to-b from-white/10 to-transparent rounded-full blur-xl" />
                </div>

                {/* Inner colored ambient glow based on score */}
                <div className={`absolute inset-4 rounded-full opacity-20 blur-2xl bg-gradient-to-tr ${gradientFrom} ${gradientTo}`} />

                <svg className="w-full h-full transform -rotate-90 p-2 relative z-10">
                    {/* Defs for gradients and shadow */}
                    <defs>
                        <linearGradient id={`gradient-${label.replace(/\s/g, '')}`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" className={gradientFrom.replace('from-', 'text-').replace('text-', 'stop-color-')} style={{ stopColor: 'currentColor' }} />
                            <stop offset="100%" className={gradientTo.replace('to-', 'text-').replace('text-', 'stop-color-')} style={{ stopColor: 'currentColor' }} />
                        </linearGradient>
                    </defs>

                    {/* Track (Dark ring groove) */}
                    <circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        fill="none"
                        stroke="#1e293b" // slate-800
                        strokeWidth="12"
                        className="opacity-50"
                    />

                    {/* Progress Segment */}
                    <motion.circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        fill="none"
                        stroke={`url(#gradient-${label.replace(/\s/g, '')})`}
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className={`drop-shadow-[0_0_10px_rgba(0,0,0,0.5)] ${textColor}`}
                    />
                </svg>

                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20">
                    <span className="text-xs text-slate-400 font-medium tracking-wide uppercase mb-1">{label}</span>
                    <div className="flex items-baseline text-white">
                        <span className="text-5xl font-bold tracking-tighter drop-shadow-lg">{value}</span>
                        <span className="text-sm text-slate-500 font-light ml-1">/{max}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
