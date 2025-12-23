'use client'

import { Home, PenTool, BarChart3, Target } from 'lucide-react'

interface NavigationProps {
  currentPage: 'home' | 'log' | 'patterns' | 'goals'
  onNavigate: (page: 'home' | 'log' | 'patterns' | 'goals') => void
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const navItems = [
    { id: 'home' as const, icon: Home, label: 'Home' },
    { id: 'log' as const, icon: PenTool, label: 'Input' },
    { id: 'patterns' as const, icon: BarChart3, label: 'Patterns' },
    { id: 'goals' as const, icon: Target, label: 'Goals' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-lg border-t border-slate-800/80">
      <div className="max-w-md mx-auto px-6">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive = currentPage === item.id
            const IconComponent = item.icon

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="relative flex flex-col items-center justify-center py-2 px-4 transition-all duration-200 group min-w-[70px]"
              >
                {/* Active Background Pill */}
                {isActive && (
                  <div className="absolute inset-x-2 top-1 bottom-1 bg-cyan-500/10 rounded-xl border border-cyan-500/20" />
                )}

                <div className="relative z-10 flex flex-col items-center">
                  <IconComponent
                    size={22}
                    className={`mb-1 transition-all duration-200 ${isActive
                        ? 'text-cyan-400'
                        : 'text-slate-500 group-hover:text-slate-300'
                      }`}
                  />
                  <span className={`text-[10px] font-medium tracking-wide transition-all duration-200 ${isActive
                      ? 'text-cyan-400'
                      : 'text-slate-600 group-hover:text-slate-400'
                    }`}>
                    {item.label}
                  </span>
                </div>

                {/* Active Indicator Dot */}
                {isActive && (
                  <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_6px_rgba(34,211,238,0.6)]" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Safe area for mobile */}
      <div className="h-safe-area-inset-bottom bg-[#0a0a0a]" />
    </nav>
  )
}