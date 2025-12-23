'use client'

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { MouseEvent, ReactNode, useRef } from 'react'

interface HoloCardProps {
    children: ReactNode
    className?: string
    noPadding?: boolean
}

export function HoloCard({ children, className = '', noPadding = false }: HoloCardProps) {
    const ref = useRef<HTMLDivElement>(null)

    // Motion values for tilt effect
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    // Smooth spring physics for the tilt
    const xSpring = useSpring(x, { stiffness: 300, damping: 30 })
    const ySpring = useSpring(y, { stiffness: 300, damping: 30 })

    // Mapping mouse position to rotation degrees
    const rotateX = useTransform(ySpring, [-0.5, 0.5], ["7deg", "-7deg"])
    const rotateY = useTransform(xSpring, [-0.5, 0.5], ["-7deg", "7deg"])

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return
        const rect = ref.current.getBoundingClientRect()

        // Normalize mouse coordinates from -0.5 to 0.5 relative to center
        const width = rect.width
        const height = rect.height
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top
        const xPct = mouseX / width - 0.5
        const yPct = mouseY / height - 0.5

        x.set(xPct)
        y.set(yPct)
    }

    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
    }

    // Sheen effect following the mouse
    const sheenX = useTransform(xSpring, [-0.5, 0.5], ["0%", "100%"])
    const sheenY = useTransform(ySpring, [-0.5, 0.5], ["0%", "100%"])

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            className={`relative rounded-3xl transition-transform duration-200 ease-out will-change-transform ${className}`}
        >
            {/* Glass Content Layer */}
            <div className={`relative h-full bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl ${noPadding ? '' : 'p-6'}`}>

                {/* Gradient Border/Glow on hover */}
                <div className="absolute inset-0 rounded-3xl ring-1 ring-white/10 group-hover:ring-white/20 transition-all duration-500" />

                {/* Sheen Layer */}
                <motion.div
                    style={{
                        background: useMotionTemplate`radial-gradient(circle at ${sheenX} ${sheenY}, rgba(255,255,255,0.1) 0%, transparent 60%)`
                    }}
                    className="absolute inset-0 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />

                {/* Content */}
                <div className="relative z-10 h-full">
                    {children}
                </div>
            </div>

            {/* Ambient shadow behind for depth */}
            <div className="absolute -inset-2 bg-gradient-to-br from-violet-600/20 to-cyan-500/20 rounded-[2rem] blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </motion.div>
    )
}
