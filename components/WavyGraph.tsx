'use client'

import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'

const data = [
  { name: 'Mon', wellness: 40, productivity: 24, finance: 30 },
  { name: 'Tue', wellness: 30, productivity: 13, finance: 45 },
  { name: 'Wed', wellness: 50, productivity: 60, finance: 35 },
  { name: 'Thu', wellness: 35, productivity: 40, finance: 50 },
  { name: 'Fri', wellness: 60, productivity: 38, finance: 45 },
  { name: 'Sat', wellness: 70, productivity: 80, finance: 60 },
  { name: 'Sun', wellness: 85, productivity: 50, finance: 75 },
]

export function WavyGraph() {
  return (
    <div className="w-full h-48 relative">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorWellness" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorProductivity" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorFinance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="name" hide />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
            itemStyle={{ color: '#cbd5e1' }}
          />
          <Area 
            type="monotone" 
            dataKey="wellness" 
            stroke="#10b981" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorWellness)" 
          />
          <Area 
            type="monotone" 
            dataKey="productivity" 
            stroke="#3b82f6" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorProductivity)" 
          />
          <Area 
            type="monotone" 
            dataKey="finance" 
            stroke="#a855f7" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorFinance)" 
          />
        </AreaChart>
      </ResponsiveContainer>
      
      {/* Date overlay */}
      <div className="absolute top-0 left-0 w-full flex justify-between px-4 pointer-events-none">
        {data.map((item, index) => (
            index === 2 || index === 4 || index === 6 ? 
            <motion.div 
                key={item.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="flex flex-col items-center"
            >
                <div className="w-2 h-2 rounded-full bg-slate-500 mb-1" />
                {/* <span className="text-xs text-slate-500">{item.name}</span> */}
            </motion.div> : <div key={index}></div>
        ))}
      </div>
    </div>
  )
}
