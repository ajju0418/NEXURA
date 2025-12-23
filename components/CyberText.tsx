'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, useAnimationFrame } from 'framer-motion'

interface CyberTextProps {
    text: string
    revealProgress: number // 0 = fully scrambled, 1 = fully revealed
    className?: string
}

const CYBER_CHARS = '01!@#$%^&*()_+-=[]{}|;:,.<>?/\\~`アイウエオカキクケコ'

export function CyberText({ text, revealProgress, className = '' }: CyberTextProps) {
    const [scrambledText, setScrambledText] = useState(text)
    const [frameCount, setFrameCount] = useState(0)

    // Animate the scramble effect
    useAnimationFrame(() => {
        setFrameCount(prev => prev + 1)
    })

    useEffect(() => {
        if (revealProgress >= 1) {
            setScrambledText(text)
            return
        }

        if (revealProgress <= 0) {
            // Fully scrambled - show random chars that keep changing
            const scrambled = text.split('').map(char => {
                if (char === ' ') return ' '
                return CYBER_CHARS[Math.floor(Math.random() * CYBER_CHARS.length)]
            }).join('')
            setScrambledText(scrambled)
            return
        }

        // Partial reveal - some chars revealed, some scrambled
        const revealedCount = Math.floor(text.length * revealProgress)
        const result = text.split('').map((char, index) => {
            if (char === ' ') return ' '
            if (index < revealedCount) return char
            // Scramble remaining characters
            return CYBER_CHARS[Math.floor(Math.random() * CYBER_CHARS.length)]
        }).join('')

        setScrambledText(result)
    }, [text, revealProgress, frameCount])

    // Memoize character rendering for performance
    const characters = useMemo(() => {
        return scrambledText.split('').map((char, index) => {
            const isRevealed = index < Math.floor(text.length * revealProgress) || revealProgress >= 1
            const isSpace = char === ' '

            return (
                <span
                    key={index}
                    className={`inline-block transition-all duration-75 ${isSpace ? 'w-[0.3em]' : ''
                        } ${isRevealed
                            ? 'text-white'
                            : 'text-cyan-500/70'
                        }`}
                    style={{
                        textShadow: isRevealed
                            ? 'none'
                            : '0 0 8px rgba(34, 211, 238, 0.5)',
                        opacity: revealProgress <= 0.1 ? 0.3 + (Math.random() * 0.3) : 1
                    }}
                >
                    {char}
                </span>
            )
        })
    }, [scrambledText, text.length, revealProgress])

    return (
        <motion.div
            className={`font-mono ${className}`}
            style={{
                opacity: Math.max(0.1, revealProgress * 0.3 + 0.7) // Never fully invisible
            }}
        >
            {characters}
        </motion.div>
    )
}
