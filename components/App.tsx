'use client'

import { useState } from 'react'
import { Home } from '@/components/Home'
import { LogInterface } from '@/components/LogInterface'
import { Patterns } from '@/components/Patterns'
import { Goals } from '@/components/Goals'
import { Navigation } from '@/components/Navigation'

export function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'log' | 'patterns' | 'goals'>('home')

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />
      case 'log':
        return <LogInterface />
      case 'patterns':
        return <Patterns />
      case 'goals':
        return <Goals />
      default:
        return <Home />
    }
  }

  return (
    <>
      {renderPage()}
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
    </>
  )
}