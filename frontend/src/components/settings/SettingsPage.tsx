'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProfileSection } from './ProfileSection'
import { AISection } from './AISection'
import { NotificationSection } from './NotificationSection'
import { DisplaySection } from './DisplaySection'
import { DataSection } from './DataSection'
import { dbService } from '@/services/db/indexedDB'
import { settingsService } from '@/services/settingsService'
import { apiService } from '@/services/api'
import { UserSettings } from '@/types/settings'
import { ArrowLeft, Settings as SettingsIcon, User, Brain, Bell, Palette, Database, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/stores/authStore'

type SettingsSection = 'profile' | 'ai' | 'notifications' | 'display' | 'data'

export function SettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile')
  const { logout } = useAuthStore()

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  useEffect(() => {
    async function init() {
      try {
        // Initialize IndexedDB
        await dbService.init()
        // Get local settings
        const userSettings = await settingsService.getSettings()

        // Fetch profile from backend and merge
        try {
          const profile = await apiService.getProfile()
          if (profile) {
            userSettings.profile = {
              ...userSettings.profile,
              name: profile.name || userSettings.profile.name,
              email: profile.email || userSettings.profile.email,
              userId: profile.userId || userSettings.profile.userId,
              timezone: profile.timezone || userSettings.profile.timezone,
              currency: profile.currency || userSettings.profile.currency,
              dateFormat: profile.dateFormat || userSettings.profile.dateFormat,
            }
          }
        } catch (err) {
          console.warn('Failed to fetch backend profile, using local settings:', err)
        }

        setSettings(userSettings)
      } catch (error) {
        console.error('Error initializing settings:', error)
        const defaultSettings = await import('@/types/settings').then(m => m.DEFAULT_SETTINGS)
        setSettings(defaultSettings)
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [])

  const handleSettingsUpdate = async (updates: Partial<UserSettings>) => {
    try {
      const updated = await settingsService.updateSettings(updates)
      setSettings(updated)

      // Sync profile changes to backend
      if (updates.profile) {
        try {
          await apiService.updateProfile({
            name: updates.profile.name,
            timezone: updates.profile.timezone,
            currency: updates.profile.currency,
            dateFormat: updates.profile.dateFormat,
          })
        } catch (err) {
          console.warn('Failed to sync profile to backend:', err)
        }
      }

      // Sync AI/notification/display settings to backend
      if (updates.ai || updates.notifications || updates.display || updates.data) {
        try {
          await apiService.updateSettings({
            ...(updates.ai && {
              assistantName: updates.ai.assistantName,
              aiPersonality: updates.ai.personality,
              insightFrequency: updates.ai.insightFrequency,
              patternRecognition: updates.ai.patternRecognition,
              predictiveAnalytics: updates.ai.predictiveAnalytics,
              smartRecommendations: updates.ai.smartRecommendations,
              spendingPredictions: updates.ai.spendingPredictions,
              habitOptimization: updates.ai.habitOptimization,
            }),
            ...(updates.notifications && {
              habitReminders: updates.notifications.habitReminders,
              budgetAlerts: updates.notifications.budgetAlerts,
              weeklySummary: updates.notifications.weeklySummary,
              milestoneCelebrations: updates.notifications.milestoneCelebrations,
              smartTiming: updates.notifications.smartTiming,
            }),
            ...(updates.display && {
              theme: updates.display.theme,
              defaultView: updates.display.defaultView,
              animationSpeed: updates.display.animationSpeed,
              hapticFeedback: updates.display.hapticFeedback,
            }),
            ...(updates.data && {
              autoBackup: updates.data.autoBackup,
              backupFrequency: updates.data.backupFrequency,
              exportFormat: updates.data.exportFormat,
            }),
          })
        } catch (err) {
          console.warn('Failed to sync settings to backend:', err)
        }
      }
    } catch (error) {
      console.error('Error updating settings:', error)
    }
  }

  if (loading || !settings) {
    return (
      <div className="min-h-screen bg-[#050505] text-slate-200 flex items-center justify-center">
        <div className="text-cyan-400 animate-pulse">Loading settings...</div>
      </div>
    )
  }

  const sections = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'ai' as const, label: 'AI Assistant', icon: Brain },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'display' as const, label: 'Display', icon: Palette },
    { id: 'data' as const, label: 'Data & Privacy', icon: Database },
  ]

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <ProfileSection
            profile={settings.profile}
            onUpdate={(profile) => handleSettingsUpdate({ profile: profile as UserSettings['profile'] })}
          />
        )
      case 'ai':
        return (
          <AISection
            ai={settings.ai}
            onUpdate={(ai) => handleSettingsUpdate({ ai: ai as UserSettings['ai'] })}
          />
        )
      case 'notifications':
        return (
          <NotificationSection
            notifications={settings.notifications}
            onUpdate={(notifications) => handleSettingsUpdate({ notifications: notifications as UserSettings['notifications'] })}
          />
        )
      case 'display':
        return (
          <DisplaySection
            display={settings.display}
            onUpdate={(display) => handleSettingsUpdate({ display: display as UserSettings['display'] })}
          />
        )
      case 'data':
        return (
          <DataSection
            data={settings.data}
            onUpdate={(data) => handleSettingsUpdate({ data: data as UserSettings['data'] })}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      <div
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#050505_100%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-8 pb-24">
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors mb-6 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Home</span>
          </button>

          <div className="flex items-center gap-4 mb-2">
            <div className="p-4 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded-xl backdrop-blur-sm">
              <SettingsIcon className="text-cyan-400" size={28} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-1">
                Settings
              </h1>
              <p className="text-lg text-slate-500">Configure your NEXURA experience</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3">
            <div className="bg-slate-900/80 border border-slate-800/60 backdrop-blur-sm rounded-xl p-2 sticky top-6">
              <nav className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon
                  const isActive = activeSection === section.id
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-400'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <Icon size={18} className={isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-cyan-400'} />
                      <span className="font-medium">{section.label}</span>
                      {isActive && (
                        <div className="ml-auto w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                      )}
                    </button>
                  )
                })}
              </nav>

              {/* Logout */}
              <div className="mt-2 pt-2 border-t border-slate-800">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all group"
                >
                  <LogOut size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderSection()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
