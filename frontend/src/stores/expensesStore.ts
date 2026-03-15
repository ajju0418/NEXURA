import { create } from 'zustand'
import { apiService } from '../services/api'

interface Expense {
  id: string
  amount: number
  category: string
  description?: string
  date: string
  impact?: string
  tags?: string
  createdAt: string
}

interface ExpenseSummary {
  totalAmount: number
  byCategory: Record<string, number>
}

interface ExpensesState {
  expenses: Expense[]
  total: number
  summary: ExpenseSummary | null
  isLoading: boolean
  error: string | null
  fetchExpenses: (params?: { startDate?: string; endDate?: string; category?: string }) => Promise<void>
  createExpense: (data: any) => Promise<void>
  updateExpense: (id: string, data: any) => Promise<void>
  deleteExpense: (id: string) => Promise<void>
  clearError: () => void
}

export const useExpensesStore = create<ExpensesState>((set, get) => ({
  expenses: [],
  total: 0,
  summary: null,
  isLoading: false,
  error: null,

  fetchExpenses: async (params?: { startDate?: string; endDate?: string; category?: string }) => {
    set({ isLoading: true, error: null })
    try {
      const result = await apiService.getExpenses(params)
      set({
        expenses: result.expenses,
        total: result.total,
        summary: result.summary,
        isLoading: false,
      })
    } catch (error: any) {
      set({ isLoading: false, error: error.message })
    }
  },

  createExpense: async (data: any) => {
    set({ error: null })
    try {
      const newExpense: any = await apiService.createExpense(data)
      // Refresh to get updated summary
      await get().fetchExpenses()
    } catch (error: any) {
      set({ error: error.message })
      throw error
    }
  },

  updateExpense: async (id: string, data: any) => {
    set({ error: null })
    try {
      const updatedExpense: any = await apiService.updateExpense(id, data)
      set({
        expenses: get().expenses.map(expense =>
          expense.id === id ? updatedExpense : expense
        )
      })
    } catch (error: any) {
      set({ error: error.message })
      throw error
    }
  },

  deleteExpense: async (id: string) => {
    set({ error: null })
    try {
      await apiService.deleteExpense(id)
      set({ expenses: get().expenses.filter(expense => expense.id !== id) })
    } catch (error: any) {
      set({ error: error.message })
      throw error
    }
  },

  clearError: () => set({ error: null }),
}))