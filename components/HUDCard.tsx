'use client'

import { ReactNode } from 'react'

interface HUDCardProps {
    children: ReactNode
    className?: string
    title?: string
}

export function HUDCard({ children, className = '', title }: HUDCardProps) {
    return (
        <div className={`relative bg-slate-900/80 border border-slate-800/60 backdrop-blur-sm p-6 ${className} group`}>
            {/* Corner Brackets */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500/30 transition-all group-hover:border-cyan-400" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-500/30 transition-all group-hover:border-cyan-400" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-500/30 transition-all group-hover:border-cyan-400" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-500/30 transition-all group-hover:border-cyan-400" />

            {/* Scanning Line (Subtle) */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            {/* Title Tag */}
            {title && (
                <div className="absolute -top-3 left-4 bg-slate-950 px-2 border border-slate-800 text-[10px] text-cyan-500 font-mono tracking-widest uppercase">
                    {title}
                </div>
            )}

            <div className="relative z-10 h-full">
                {children}
            </div>
        </div>
    )
}
