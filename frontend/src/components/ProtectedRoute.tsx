'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, isLoading, isCheckingAuth } = useAuthStore()

  useEffect(() => {
    // Only redirect once auth check finished
    if (!isCheckingAuth && !isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, isCheckingAuth, router])

  // Show loading state while checking authentication
  if (isLoading || isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-cyan-400 font-mono text-sm">Authenticating...</p>
        </div>
      </div>
    )
  }

  // Don't render anything if not authenticated (will redirect)
  if (!user) {
    return null
  }

  // Render protected content
  return <>{children}</>
}
