import { create } from 'zustand'
import { apiService } from '../services/api'

interface DashboardStats {
  user: {
    name: string
    userId: string
  }
  habits: {
    total: number
    completedToday: number
    bestStreak: number
  }
  goals: {
    active: number
    completed: number
    total: number
  }
  expenses: {
    monthlyBudget: number
    totalThisMonth: number
    budgetLeft: number
  }
  performance: Array<{ subject: string; A: number }>
  stats: {
    healthScore: number
    energyLevel: number
    budgetLeft: number
    weekProgress: number
  }
  topScore: { name: string; value: number }
  lowScore: { name: string; value: number }
}

interface DashboardState {
  stats: DashboardStats | null
  isLoading: boolean
  error: string | null
  fetchDashboard: () => Promise<void>
  clearError: () => void
}

export const useDashboardStore = create<DashboardState>((set) => ({
  stats: null,
  isLoading: false,
  error: null,

  fetchDashboard: async () => {
    set({ isLoading: true, error: null })
    try {
      const stats = await apiService.getDashboardStats()
      set({ stats, isLoading: false })
    } catch (error: any) {
      set({ isLoading: false, error: error.message })
    }
  },

  clearError: () => set({ error: null }),
}))

