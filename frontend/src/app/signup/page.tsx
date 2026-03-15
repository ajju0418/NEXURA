'use client'

import { useState } from 'react'
import { HUDCard } from '@/components/HUDCard'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  User, Mail, Lock, Target, Brain, Zap, Heart,
  DollarSign, Clock, Coffee, Moon, Book, Activity,
  ChevronRight, ChevronLeft, CheckCircle2, ArrowRight
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

interface UserProfile {
  name: string
  email: string
  password: string
  age: number
  lifeAreas: {
    wellness: number
    productivity: number
    finance: number
    relationships: number
    learning: number
    sleep: number
  }
  primaryGoals: string[]
  currentHabits: string[]
  budget: number
  wakeTime: string
  bedTime: string
  aiPersonality: 'supportive' | 'challenging' | 'analytical'
}

const STEPS = [
  { id: 'basic', title: 'Profile', icon: User },
  { id: 'assessment', title: 'Assessment', icon: Brain },
  { id: 'goals', title: 'Goals', icon: Target },
  { id: 'habits', title: 'Habits', icon: Activity },
  { id: 'preferences', title: 'Preferences', icon: Zap },
  { id: 'complete', title: 'Complete', icon: CheckCircle2 }
]

const LIFE_AREAS = [
  { key: 'wellness', label: 'Physical Health', icon: Heart, color: 'text-emerald-400' },
  { key: 'productivity', label: 'Work Performance', icon: Zap, color: 'text-cyan-400' },
  { key: 'finance', label: 'Financial Health', icon: DollarSign, color: 'text-fuchsia-400' },
  { key: 'relationships', label: 'Social Life', icon: User, color: 'text-amber-400' },
  { key: 'learning', label: 'Personal Growth', icon: Book, color: 'text-purple-400' },
  { key: 'sleep', label: 'Sleep Quality', icon: Moon, color: 'text-indigo-400' }
]

const GOALS = [
  'Improve daily exercise routine', 'Better financial management', 'Enhance work productivity',
  'Improve sleep schedule', 'Learn new skills', 'Reduce stress levels',
  'Build stronger relationships', 'Eat healthier meals', 'Save more money', 'Read more books'
]

const HABITS = [
  'Morning meditation', 'Regular exercise', 'Daily reading', 'Expense tracking',
  'Early bedtime', 'Healthy eating', 'Time blocking', 'Gratitude journaling',
  'Skill practice', 'Social connections'
]

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [profile, setProfile] = useState<UserProfile>({
    name: '', email: '', password: '', age: 25,
    lifeAreas: { wellness: 5, productivity: 5, finance: 5, relationships: 5, learning: 5, sleep: 5 },
    primaryGoals: [], currentHabits: [],
    budget: 15000, wakeTime: '07:00', bedTime: '23:00', aiPersonality: 'supportive'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { signup } = useAuthStore()

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }))
  }

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleComplete = async () => {
    setLoading(true)
    setError('')
    try {
      // Call the backend signup API with the correct format
      await signup({
        name: profile.name,
        email: profile.email,
        password: profile.password,
        age: profile.age,
        onboarding: {
          lifeAreas: profile.lifeAreas,
          primaryGoals: profile.primaryGoals,
          currentHabits: profile.currentHabits,
          budget: profile.budget,
          wakeTime: profile.wakeTime,
          bedTime: profile.bedTime,
        }
      })

      // On success, redirect to dashboard
      router.push('/dashboard')
    } catch (err: any) {
      setLoading(false)
      const errorMessage = err.message || 'Failed to create account'
      if (errorMessage.toLowerCase().includes('already exists') || errorMessage.toLowerCase().includes('duplicate')) {
        setError('EMAIL ALREADY EXISTS - TRY LOGGING IN')
      } else if (errorMessage.toLowerCase().includes('network') || errorMessage.toLowerCase().includes('fetch')) {
        setError('NETWORK ERROR - BACKEND MAY BE OFFLINE')
      } else {
        setError('REGISTRATION FAILED - ' + errorMessage.toUpperCase())
      }
    }
  }

  const renderStep = () => {
    const step = STEPS[currentStep]

    switch (step.id) {
      case 'basic':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <Image
                  src="/NEXURA_LOGO.png"
                  alt="NEXURA"
                  width={240}
                  height={85}
                  className="object-contain"
                />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Create Your Profile</h2>
              <p className="text-slate-400">Let's get started with your basic information</p>
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-950/50 border border-red-500/30 rounded-xl text-red-400 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  {error}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => updateProfile({ name: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => updateProfile({ email: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Password</label>
                <input
                  type="password"
                  value={profile.password}
                  onChange={(e) => updateProfile({ password: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                  placeholder="Create a password"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Age</label>
                <input
                  type="number"
                  value={profile.age}
                  onChange={(e) => updateProfile({ age: parseInt(e.target.value) })}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                  min="18" max="100"
                />
              </div>
            </div>
          </div>
        )

      case 'assessment':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Life Assessment</h2>
              <p className="text-slate-400">Rate your current satisfaction in each area (1-10)</p>
            </div>
            <div className="space-y-6">
              {LIFE_AREAS.map((area) => {
                const value = profile.lifeAreas[area.key as keyof typeof profile.lifeAreas]
                return (
                  <div key={area.key} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <area.icon className={area.color} size={20} />
                        <span className="text-white font-medium">{area.label}</span>
                      </div>
                      <span className={`text-xl font-bold ${area.color}`}>{value}</span>
                    </div>
                    <input
                      type="range"
                      min="1" max="10" step="1"
                      value={value}
                      onChange={(e) => updateProfile({
                        lifeAreas: { ...profile.lifeAreas, [area.key]: parseInt(e.target.value) }
                      })}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )

      case 'goals':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Mission Objectives</h2>
              <p className="text-slate-400">Select 3-5 primary optimization targets</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {GOALS.map((goal) => {
                const isSelected = profile.primaryGoals.includes(goal)
                return (
                  <button
                    key={goal}
                    onClick={() => {
                      const goals = isSelected
                        ? profile.primaryGoals.filter(g => g !== goal)
                        : [...profile.primaryGoals, goal].slice(0, 5)
                      updateProfile({ primaryGoals: goals })
                    }}
                    className={`p-4 border rounded-lg text-left transition-all font-mono hover:scale-[1.02] active:scale-[0.98] ${isSelected
                      ? 'border-cyan-500 bg-cyan-950/30 text-cyan-400'
                      : 'border-slate-700 bg-slate-900/50 text-slate-300 hover:border-slate-600'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{goal}</span>
                      {isSelected && <CheckCircle2 size={16} />}
                    </div>
                  </button>
                )
              })}
            </div>
            <div className="text-center text-sm text-slate-500 font-mono">
              SELECTED: {profile.primaryGoals.length}/5
            </div>
          </div>
        )

      case 'habits':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Active Protocols</h2>
              <p className="text-slate-400">Select currently running behavioral patterns</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {HABITS.map((habit) => {
                const isSelected = profile.currentHabits.includes(habit)
                return (
                  <button
                    key={habit}
                    onClick={() => {
                      const habits = isSelected
                        ? profile.currentHabits.filter(h => h !== habit)
                        : [...profile.currentHabits, habit]
                      updateProfile({ currentHabits: habits })
                    }}
                    className={`p-4 border rounded-lg text-left transition-all font-mono hover:scale-[1.02] active:scale-[0.98] ${isSelected
                      ? 'border-emerald-500 bg-emerald-950/30 text-emerald-400'
                      : 'border-slate-700 bg-slate-900/50 text-slate-300 hover:border-slate-600'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{habit}</span>
                      {isSelected && <CheckCircle2 size={16} />}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )

      case 'preferences':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Preferences</h2>
              <p className="text-slate-400">Configure your personal settings</p>
            </div>
            <div className="space-y-6">
              <div>
                <label className="text-sm text-slate-400 mb-3 block">Monthly Budget (₹)</label>
                <input
                  type="number"
                  value={profile.budget}
                  onChange={(e) => updateProfile({ budget: parseInt(e.target.value) })}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                  placeholder="15000"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-400 mb-3 block">Wake Up Time</label>
                  <input
                    type="time"
                    value={profile.wakeTime}
                    onChange={(e) => updateProfile({ wakeTime: e.target.value })}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-3 block">Bed Time</label>
                  <input
                    type="time"
                    value={profile.bedTime}
                    onChange={(e) => updateProfile({ bedTime: e.target.value })}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-3 block">AI Coaching Style</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: 'supportive', label: 'Supportive', desc: 'Encouraging' },
                    { key: 'challenging', label: 'Challenging', desc: 'Push harder' },
                    { key: 'analytical', label: 'Analytical', desc: 'Data-focused' }
                  ].map((type) => (
                    <button
                      key={type.key}
                      onClick={() => updateProfile({ aiPersonality: type.key as any })}
                      className={`p-4 border rounded-lg text-center transition-all ${profile.aiPersonality === type.key
                        ? 'border-purple-500 bg-purple-950/30 text-purple-400'
                        : 'border-slate-700 bg-slate-900/50 text-slate-300 hover:border-slate-600'
                        }`}
                    >
                      <div className="font-medium text-sm">{type.label}</div>
                      <div className="text-xs text-slate-500 mt-1">{type.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 'complete':
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center">
              <CheckCircle2 className="text-white" size={32} />
            </div>
            <h2 className="text-3xl font-bold text-white">Profile Complete!</h2>
            <p className="text-lg text-slate-300">
              Your NEXURA profile is ready. Let's start your journey!
            </p>
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Life Areas:</span>
                <span className="text-cyan-400">{LIFE_AREAS.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Goals Set:</span>
                <span className="text-emerald-400">{profile.primaryGoals.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Current Habits:</span>
                <span className="text-purple-400">{profile.currentHabits.length}</span>
              </div>
            </div>
            {loading && (
              <div className="text-cyan-400 text-sm animate-pulse">
                Setting up your dashboard...
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  const canProceed = () => {
    switch (STEPS[currentStep].id) {
      case 'basic': return profile.name && profile.email && profile.password
      case 'assessment': return true
      case 'goals': return profile.primaryGoals.length >= 3
      case 'habits': return true
      case 'preferences': return true
      case 'complete': return true
      default: return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-slate-200 font-sans relative">
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'linear-gradient(rgba(34, 211, 238, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {STEPS.map((step, index) => {
                const isActive = index === currentStep
                const isCompleted = index < currentStep
                const IconComponent = step.icon

                return (
                  <div key={step.id} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${isActive ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400' :
                      isCompleted ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400' :
                        'border-slate-700 bg-slate-900/50 text-slate-500'
                      }`}>
                      <IconComponent size={16} />
                    </div>
                    {index < STEPS.length - 1 && (
                      <div className={`w-12 h-0.5 mx-2 transition-colors ${isCompleted ? 'bg-emerald-500' : 'bg-slate-700'
                        }`} />
                    )}
                  </div>
                )
              })}
            </div>
            <div className="text-center">
              <span className="text-sm text-slate-400">
                Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep].title}
              </span>
            </div>
          </div>

          {/* Main Content */}
          <HUDCard className="p-6 md:p-8 min-h-[500px]">
            <div
              key={currentStep}
              className="animate-fadeIn"
            >
              {renderStep()}
            </div>
          </HUDCard>

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              <ChevronLeft size={16} />
              Back
            </button>

            {currentStep === STEPS.length - 1 ? (
              <button
                onClick={handleComplete}
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 disabled:opacity-50 text-white rounded-lg transition-all font-bold"
              >
                {loading ? 'Creating...' : 'Get Started'}
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={nextStep}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                Continue
                <ChevronRight size={16} />
              </button>
            )}
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <span className="text-slate-500 text-sm">Already have an account? </span>
            <Link
              href="/login"
              className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors text-sm"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}