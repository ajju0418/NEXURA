'use client'

import { SettingsPage } from '@/components/settings/SettingsPage'
import { ProtectedRoute } from '@/components/ProtectedRoute'

export default function Settings() {
  return (
    <ProtectedRoute>
      <SettingsPage />
    </ProtectedRoute>
  )
}
