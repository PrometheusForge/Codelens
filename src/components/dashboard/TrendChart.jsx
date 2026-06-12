import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { TrendingUp } from 'lucide-react';

// --- MOCK DATA ---
// Binned by week over a 6-week period
const TREND_DATA = [
  { week: 'Week 1', 'Gemini 1.5 Flash': 82, 'Llama 3 (70B)': 78, 'Mistral 7B': 62 },
  { week: 'Week 2', 'Gemini 1.5 Flash': 84, 'Llama 3 (70B)': 80, 'Mistral 7B': 65 },
  { week: 'Week 3', 'Gemini 1.5 Flash': 89, 'Llama 3 (70B)': 85, 'Mistral 7B': 64 },
  { week: 'Week 4', 'Gemini 1.5 Flash': 91, 'Llama 3 (70B)': 86, 'Mistral 7B': 68 },
  { week: 'Week 5', 'Gemini 1.5 Flash': 94, 'Llama 3 (70B)': 88, 'Mistral 7B': 70 },
  { week: 'Week 6', 'Gemini 1.5 Flash': 96, 'Llama 3 (70B)': 89, 'Mistral 7B': 72 },
];

// Model brand colors mapping to our premium UI palette
const MODEL_COLORS = {
  'Gemini 1.5 Flash': '#10b981', // Emerald 500
  'Llama 3 (70B)': '#8b5cf6',    // Violet 500
  'Mistral 7B': '#f59e0b',       // Amber 500
};

// --- CUSTOM COMPONENTS ---

// Premium Tooltip overriding Recharts default
const PremiumTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl bg-zinc-950/90 p-4 ring-1 ring-white/10 shadow-2xl backdrop-blur-md">
        <h4 className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
          {label} Performance
        </h4>
        <div className="flex flex-col gap-2">
          {/* Sort descending by value so the highest score is at the top of the tooltip */}
          {[...payload].sort((a, b) => b.value - a.value).map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div 
                  className="h-2 w-2 rounded-full" 
                  style={{ backgroundColor: entry.color }} 
                />
                <span className="font-medium text-zinc-300">{entry.name}</span>
              </div>
              <span className="font-mono font-bold text-white">
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// Premium Legend overriding Recharts default
const PremiumLegend = ({ payload }) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div 
            className="flex h-4 w-4 items-center justify-center rounded bg-white/[0.03] ring-1 ring-white/10"
          >
            <div 
              className="h-1.5 w-1.5 rounded-full" 
              style={{ backgroundColor: entry.color }} 
            />
          </div>
          <span className="text-xs font-medium text-zinc-400">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function TrendChart() {
  return (
    <div className="flex h-full w-full flex-col gap-4">
      {/* Section Header */}
      <h2 className="ml-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
        <TrendingUp className="h-3.5 w-3.5" /> Longitudinal Trajectory
      </h2>
      
      {/* Outer Shell (Double Bezel Architecture) */}
      <div className="flex-1 rounded-[2rem] bg-white/[0.02] p-1.5 ring-1 ring-white/5">
        
        {/* Inner Core */}
        <div className="relative flex h-full min-h-[400px] w-full flex-col items-center justify-center rounded-[calc(2rem-0.375rem)] bg-[#0c0c0e] p-6 ring-1 ring-white/5">
          
          <ResponsiveContainer width="100%" height={380}>
            <LineChart data={TREND_DATA} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              
              {/* Grid Lines - Highly muted */}
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#27272a" 
                vertical={false} 
              />
              
              {/* X-Axis */}
              <XAxis 
                dataKey="week" 
                tick={{ fill: '#a1a1aa', fontSize: 11, fontWeight: 600, fontFamily: 'monospace' }}
                tickLine={false}
                axisLine={{ stroke: '#3f3f46' }}
                dy={10}
              />
              
              {/* Y-Axis */}
              <YAxis 
                domain={[40, 100]} 
                tick={{ fill: '#a1a1aa', fontSize: 11, fontWeight: 600, fontFamily: 'monospace' }}
                tickLine={false}
                axisLine={false}
                dx={-10}
              />
              
              <Tooltip content={<PremiumTooltip />} cursor={{ stroke: '#3f3f46', strokeWidth: 1, strokeDasharray: '5 5' }} />
              
              {/* Target / Passing Threshold Line */}
              <ReferenceLine 
                y={70} 
                stroke="#ef4444" 
                strokeDasharray="4 4" 
                label={{ position: 'top', value: 'Passing Threshold', fill: '#ef4444', fontSize: 10, fontWeight: 600, textAnchor: 'start', dx: 10, dy: -5 }} 
              />

              {/* Model Lines */}
              <Line 
                type="monotone" 
                dataKey="Gemini 1.5 Flash" 
                stroke={MODEL_COLORS['Gemini 1.5 Flash']} 
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: '#0c0c0e', stroke: MODEL_COLORS['Gemini 1.5 Flash'] }}
                activeDot={{ r: 6, strokeWidth: 0, fill: MODEL_COLORS['Gemini 1.5 Flash'] }}
              />
              <Line 
                type="monotone" 
                dataKey="Llama 3 (70B)" 
                stroke={MODEL_COLORS['Llama 3 (70B)']} 
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: '#0c0c0e', stroke: MODEL_COLORS['Llama 3 (70B)'] }}
                activeDot={{ r: 6, strokeWidth: 0, fill: MODEL_COLORS['Llama 3 (70B)'] }}
              />
              <Line 
                type="monotone" 
                dataKey="Mistral 7B" 
                stroke={MODEL_COLORS['Mistral 7B']} 
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: '#0c0c0e', stroke: MODEL_COLORS['Mistral 7B'] }}
                activeDot={{ r: 6, strokeWidth: 0, fill: MODEL_COLORS['Mistral 7B'] }}
              />

              <Legend content={<PremiumLegend />} verticalAlign="bottom" />
            </LineChart>
          </ResponsiveContainer>

        </div>
      </div>
    </div>
  );
}