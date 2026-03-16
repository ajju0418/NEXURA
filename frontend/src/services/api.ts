const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
const IS_DEV = process.env.NODE_ENV === 'development'

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null

    const fullUrl = `${API_BASE_URL}${endpoint}`

    // Dev logger — shows exactly what leaves the frontend
    if (IS_DEV) {
      console.groupCollapsed(`[API] ${options.method || 'GET'} ${endpoint}`)
      console.log('URL:', fullUrl)
      if (options.body) {
        try { console.log('Body:', JSON.parse(options.body as string)) } catch { console.log('Body (raw):', options.body) }
      }
      console.groupEnd()
    }

    const response = await fetch(fullUrl, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      if (IS_DEV) console.warn(`[API] ❌ ${response.status} ${endpoint}`)

      if (response.status === 401 && endpoint !== '/auth/login' && endpoint !== '/auth/refresh' && endpoint !== '/auth/signup') {
        try {
          await this.refreshToken()
          return this.request(endpoint, options)
        } catch (refreshError) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken')
            const currentPath = window.location.pathname
            if (currentPath !== '/login' && currentPath !== '/signup') {
              window.location.href = '/login'
            }
          }
          throw refreshError
        }
      }

      const errorData = await response.json().catch(() => ({ message: response.statusText }))
      throw new Error(errorData.message || `API Error: ${response.statusText}`)
    }

    // Handle 204 No Content
    if (response.status === 204) {
      if (IS_DEV) console.log(`[API] ✅ ${response.status} ${endpoint}`)
      return {} as T
    }

    if (IS_DEV) console.log(`[API] ✅ ${response.status} ${endpoint}`)
    return response.json()
  }

  // Auth
  async login(email: string, password: string) {
    const response: any = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })

    if (typeof window !== 'undefined' && response.accessToken) {
      localStorage.setItem('accessToken', response.accessToken)
    }

    return response
  }

  async signup(signupData: any) {
    const response: any = await this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(signupData),
    })

    if (typeof window !== 'undefined' && response.accessToken) {
      localStorage.setItem('accessToken', response.accessToken)
    }

    return response
  }

  async refreshToken() {
    const response: any = await this.request('/auth/refresh', {
      method: 'POST',
    })

    if (typeof window !== 'undefined' && response.accessToken) {
      localStorage.setItem('accessToken', response.accessToken)
    }

    return response
  }

  async logout() {
    await this.request('/auth/logout', {
      method: 'POST',
    })

    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken')
    }
  }

  async getCurrentUser() {
    return this.request('/auth/me')
  }

  // Habits
  async getHabits() {
    return this.request<any[]>('/habits')
  }

  async getHabit(id: string) {
    return this.request<any>(`/habits/${id}`)
  }

  async createHabit(data: any) {
    return this.request('/habits', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateHabit(id: string, data: any) {
    return this.request(`/habits/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteHabit(id: string) {
    return this.request(`/habits/${id}`, {
      method: 'DELETE',
    })
  }

  async completeHabit(id: string, data?: { notes?: string; mood?: string }) {
    return this.request(`/habits/${id}/complete`, {
      method: 'POST',
      body: JSON.stringify(data || {}),
    })
  }

  async getHabitCompletions(id: string, limit?: number) {
    const query = limit ? `?limit=${limit}` : ''
    return this.request<any[]>(`/habits/${id}/completions${query}`)
  }

  // Goals
  async getGoals(completed?: boolean) {
    const query = completed !== undefined ? `?completed=${completed}` : ''
    return this.request<any[]>(`/goals${query}`)
  }

  async getGoal(id: string) {
    return this.request<any>(`/goals/${id}`)
  }

  async createGoal(data: any) {
    return this.request('/goals', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateGoal(id: string, data: any) {
    return this.request(`/goals/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteGoal(id: string) {
    return this.request(`/goals/${id}`, {
      method: 'DELETE',
    })
  }

  // Expenses
  async getExpenses(params?: { startDate?: string; endDate?: string; category?: string; limit?: number; offset?: number }) {
    const searchParams = new URLSearchParams()
    if (params?.startDate) searchParams.set('startDate', params.startDate)
    if (params?.endDate) searchParams.set('endDate', params.endDate)
    if (params?.category) searchParams.set('category', params.category)
    if (params?.limit) searchParams.set('limit', String(params.limit))
    if (params?.offset) searchParams.set('offset', String(params.offset))
    const query = searchParams.toString() ? `?${searchParams.toString()}` : ''
    return this.request<{ expenses: any[]; total: number; summary: any }>(`/expenses${query}`)
  }

  async getExpense(id: string) {
    return this.request<any>(`/expenses/${id}`)
  }

  async createExpense(data: any) {
    return this.request('/expenses', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateExpense(id: string, data: any) {
    return this.request(`/expenses/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteExpense(id: string) {
    return this.request(`/expenses/${id}`, {
      method: 'DELETE',
    })
  }

  async getExpenseSummary(period: string) {
    return this.request<any>(`/expenses/summary?period=${period}`)
  }

  // Timeline
  async getTimeline(date?: string) {
    const query = date ? `?date=${date}` : ''
    return this.request<any>(`/analytics/timeline${query}`)
  }

  // User
  async getProfile() {
    return this.request<any>('/users/profile')
  }

  async updateProfile(data: any) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // Settings
  async getSettings() {
    return this.request<any>('/users/settings')
  }

  async updateSettings(data: any) {
    return this.request('/users/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // Dashboard
  async getDashboardStats() {
    return this.request<any>('/users/dashboard')
  }
}

export const apiService = new ApiService()