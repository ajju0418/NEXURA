'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Coffee, ShoppingBag, Car, Film, Utensils, CreditCard, AlertCircle } from 'lucide-react'
import { useExpensesStore } from '../stores/expensesStore'

export function RecentExpenses() {
    const { expenses, isLoading, error, fetchExpenses, clearError } = useExpensesStore()

    useEffect(() => {
        fetchExpenses()
    }, [fetchExpenses])

    const getIcon = (category: string) => {
        switch (category.toLowerCase()) {
            case 'food': return Utensils
            case 'transport': return Car
            case 'coffee': return Coffee
            case 'shopping': return ShoppingBag
            case 'entertainment': return Film
            default: return CreditCard
        }
    }

    const getCategoryColor = (category: string) => {
        switch (category.toLowerCase()) {
            case 'food': return 'bg-orange-500/20 text-orange-400'
            case 'transport': return 'bg-blue-500/20 text-blue-400'
            case 'coffee': return 'bg-amber-500/20 text-amber-400'
            case 'shopping': return 'bg-fuchsia-500/20 text-fuchsia-400'
            case 'entertainment': return 'bg-purple-500/20 text-purple-400'
            default: return 'bg-slate-500/20 text-slate-400'
        }
    }

    const totalAmount = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0)

    if (isLoading) {
        return (
            <div className="space-y-2">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-16 bg-slate-900/50 border border-slate-800 rounded-lg animate-pulse" />
                ))}
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-red-400 p-4 border border-red-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                    <AlertCircle size={16} />
                    <span>Failed to load expenses</span>
                </div>
                <p className="text-sm text-red-300">{error}</p>
                <button 
                    onClick={() => { clearError(); fetchExpenses(); }}
                    className="mt-2 text-sm text-red-400 hover:text-red-300 underline"
                >
                    Try again
                </button>
            </div>
        )
    }

    return (
        <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-light text-slate-200">Recent Expenses</h3>
                <span className="text-2xl font-medium text-slate-400">₹{totalAmount.toLocaleString()}</span>
            </div>

            {expenses.length === 0 ? (
                <div className="text-slate-500 text-center py-8">
                    No expenses recorded yet.
                </div>
            ) : (
                <div className="space-y-3">
                    {expenses.slice(0, 5).map((expense, index) => {
                        const IconComponent = getIcon(expense.category)
                        const colorClass = getCategoryColor(expense.category)
                        return (
                            <motion.div
                                key={expense.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-center gap-4 p-4 bg-slate-900/50 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors"
                            >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
                                    <IconComponent size={18} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-medium text-white">{expense.description || expense.category}</h4>
                                    <p className="text-xs text-slate-500 capitalize">{expense.category}</p>
                                </div>
                                <div className="text-right">
                                    <span className="block font-semibold text-white">₹{Number(expense.amount).toLocaleString()}</span>
                                    <span className="text-xs text-slate-500">
                                        {new Date(expense.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                    </span>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}