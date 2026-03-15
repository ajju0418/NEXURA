'use client'

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts'

const DEFAULT_DATA = [
    { subject: 'Wellness', A: 50, fullMark: 100 },
    { subject: 'Productivity', A: 50, fullMark: 100 },
    { subject: 'Finance', A: 50, fullMark: 100 },
    { subject: 'Sleep', A: 50, fullMark: 100 },
    { subject: 'Focus', A: 50, fullMark: 100 },
    { subject: 'Social', A: 50, fullMark: 100 },
]

interface PerformanceRadarProps {
    data?: Array<{ subject: string; A: number }>
}

export function PerformanceRadar({ data }: PerformanceRadarProps) {
    const chartData = (data || DEFAULT_DATA).map(d => ({ ...d, fullMark: 100 }))

    return (
        <div className="w-full h-[380px] relative">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="85%" data={chartData}>
                    <PolarGrid stroke="#334155" strokeDasharray="3 3" />
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'monospace' }}
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Tooltip
                        contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: '#334155', backdropFilter: 'blur(4px)', color: '#fff' }}
                        itemStyle={{ color: '#22d3ee' }}
                    />
                    <Radar
                        name="Performance"
                        dataKey="A"
                        stroke="#22d3ee"
                        strokeWidth={2}
                        fill="#22d3ee"
                        fillOpacity={0.2}
                    />
                </RadarChart>
            </ResponsiveContainer>

            {/* Decorative HUD Elements */}
            <div className="absolute top-2 left-2 flex gap-1">
                <div className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse" />
                <div className="w-1 h-1 bg-cyan-500/50 rounded-full" />
            </div>
            <div className="absolute bottom-2 right-2 text-[10px] text-cyan-500/50 font-mono tracking-widest">
                SYS.ANALYSIS.V2
            </div>
        </div>
    )
}
