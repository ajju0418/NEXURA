'use client'

import { motion } from 'framer-motion'
import { Coffee, ShoppingBag, Droplet } from 'lucide-react'

const expenses = [
    { id: 1, name: 'Deep Work Session', category: 'Food', amount: 315, impact: 'neutral', icon: Coffee },
    { id: 2, name: 'Software Sub', category: 'Tech', amount: 840, impact: 'positive', icon: Droplet }, // scalable example
]

export function RecentExpenses() {
    return (
        <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-light text-slate-200">Recent Expenses</h3>
                <span className="text-2xl font-medium text-slate-400">₹3990</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                {expenses.map((expense, index) => (
                    <motion.div
                        key={expense.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex-1 bg-slate-800/60 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4 flex items-center gap-4 hover:bg-slate-800/80 transition-colors"
                    >
                        <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center">
                            <expense.icon size={20} />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-medium text-slate-200">{expense.name}</h4>
                            <p className="text-xs text-slate-500">{expense.category}</p>
                        </div>
                        <div className="text-right">
                            <span className="block font-medium text-slate-200">₹{expense.amount}</span>
                            <span className="text-xs text-slate-500">{expense.impact}</span>
                        </div>
                    </motion.div>
                ))}

                {/* Add Button Placeholder */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-12 flex items-center justify-center rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-700/50 transition-colors"
                >
                    <span className="text-2xl text-slate-400">+</span>
                </motion.button>
            </div>
        </div>
    )
}
