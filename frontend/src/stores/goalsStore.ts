import { create } from 'zustand'
import { apiService } from '../services/api'

interface Goal {
  id: string
  name: string
  type: 'habit' | 'budget' | 'milestone'
  target: number
  current: number
  unit: string
  icon?: string
  color?: string
  deadline?: string
  deadlineDate?: string
  isCompleted: boolean
  completedAt?: string
  progress: number
  createdAt: string
}

interface GoalsState {
  goals: Goal[]
  isLoading: boolean
  error: string | null
  fetchGoals: (completed?: boolean) => Promise<void>
  createGoal: (data: any) => Promise<void>
  updateGoal: (id: string, data: any) => Promise<void>
  deleteGoal: (id: string) => Promise<void>
  clearError: () => void
}

export const useGoalsStore = create<GoalsState>((set, get) => ({
  goals: [],
  isLoading: false,
  error: null,

  fetchGoals: async (completed?: boolean) => {
    set({ isLoading: true, error: null })
    try {
      const goals: any[] = await apiService.getGoals(completed)
      set({ goals, isLoading: false })
    } catch (error: any) {
      set({ isLoading: false, error: error.message })
    }
  },

  createGoal: async (data: any) => {
    set({ error: null })
    try {
      const newGoal: any = await apiService.createGoal(data)
      set({ goals: [...get().goals, newGoal] })
    } catch (error: any) {
      set({ error: error.message })
      throw error
    }
  },

  updateGoal: async (id: string, data: any) => {
    set({ error: null })
    try {
      const updatedGoal: any = await apiService.updateGoal(id, data)
      set({
        goals: get().goals.map(goal =>
          goal.id === id ? updatedGoal : goal
        )
      })
    } catch (error: any) {
      set({ error: error.message })
      throw error
    }
  },

  deleteGoal: async (id: string) => {
    set({ error: null })
    try {
      await apiService.deleteGoal(id)
      set({ goals: get().goals.filter(goal => goal.id !== id) })
    } catch (error: any) {
      set({ error: error.message })
      throw error
    }
  },

  clearError: () => set({ error: null }),
}))

