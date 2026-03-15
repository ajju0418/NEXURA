import { create } from 'zustand'
import { apiService } from '../services/api'

interface Habit {
  id: string
  name: string
  icon?: string
  color?: string
  streak: number
  longestStreak: number
  totalCompletions: number
  targetTime?: string
  reminderEnabled: boolean
  isActive: boolean
  lastCompletedAt?: string
  createdAt: string
  // Computed on frontend
  isCompletedToday?: boolean
}

interface HabitsState {
  habits: Habit[]
  isLoading: boolean
  error: string | null
  fetchHabits: () => Promise<void>
  createHabit: (data: any) => Promise<void>
  updateHabit: (id: string, data: any) => Promise<void>
  deleteHabit: (id: string) => Promise<void>
  completeHabit: (id: string, data?: { notes?: string; mood?: string }) => Promise<void>
  clearError: () => void
}

const isCompletedToday = (lastCompletedAt?: string): boolean => {
  if (!lastCompletedAt) return false
  const completed = new Date(lastCompletedAt)
  const today = new Date()
  return (
    completed.getFullYear() === today.getFullYear() &&
    completed.getMonth() === today.getMonth() &&
    completed.getDate() === today.getDate()
  )
}

export const useHabitsStore = create<HabitsState>((set, get) => ({
  habits: [],
  isLoading: false,
  error: null,

  fetchHabits: async () => {
    set({ isLoading: true, error: null })
    try {
      const habits: any[] = await apiService.getHabits()
      set({
        habits: habits.map(h => ({
          ...h,
          isCompletedToday: isCompletedToday(h.lastCompletedAt),
        })),
        isLoading: false,
      })
    } catch (error: any) {
      set({ isLoading: false, error: error.message })
    }
  },

  createHabit: async (data: any) => {
    set({ error: null })
    try {
      const newHabit: any = await apiService.createHabit(data)
      set({ habits: [...get().habits, { ...newHabit, isCompletedToday: false }] })
    } catch (error: any) {
      set({ error: error.message })
      throw error
    }
  },

  updateHabit: async (id: string, data: any) => {
    set({ error: null })
    try {
      const updatedHabit: any = await apiService.updateHabit(id, data)
      set({
        habits: get().habits.map(habit =>
          habit.id === id ? { ...updatedHabit, isCompletedToday: isCompletedToday(updatedHabit.lastCompletedAt) } : habit
        )
      })
    } catch (error: any) {
      set({ error: error.message })
      throw error
    }
  },

  deleteHabit: async (id: string) => {
    set({ error: null })
    try {
      await apiService.deleteHabit(id)
      set({ habits: get().habits.filter(habit => habit.id !== id) })
    } catch (error: any) {
      set({ error: error.message })
      throw error
    }
  },

  completeHabit: async (id: string, data?: { notes?: string; mood?: string }) => {
    set({ error: null })
    try {
      await apiService.completeHabit(id, data)
      // Refresh all habits to get updated streaks
      await get().fetchHabits()
    } catch (error: any) {
      set({ error: error.message })
      throw error
    }
  },

  clearError: () => set({ error: null }),
}))