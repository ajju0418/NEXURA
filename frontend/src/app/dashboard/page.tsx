'use client'

import { App } from '@/components/App'
import { ProtectedRoute } from '@/components/ProtectedRoute'

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <App />
    </ProtectedRoute>
  )
}