import React from 'react';
import { 
  Radar, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, 
  Tooltip, Legend 
} from 'recharts';
import { Activity } from 'lucide-react';

// --- MOCK DATA ---
// We compare up to 3 models as specified in the build guide to avoid visual clutter.
const data = [
  { dimension: 'Correctness', 'Gemini 1.5 Flash': 85, 'Llama 3 (70B)': 72, 'Mistral 7B': 91 },
  { dimension: 'Efficiency',  'Gemini 1.5 Flash': 70, 'Llama 3 (70B)': 65, 'Mistral 7B': 78 },
  { dimension: 'Readability', 'Gemini 1.5 Flash': 88, 'Llama 3 (70B)': 80, 'Mistral 7B': 83 },
  { dimension: 'Explanation', 'Gemini 1.5 Flash': 75, 'Llama 3 (70B)': 70, 'Mistral 7B': 88 },
  { dimension: 'Security',    'Gemini 1.5 Flash': 60, 'Llama 3 (70B)': 55, 'Mistral 7B': 65 },
];

// Model brand colors mapping to our premium UI palette
const MODEL_COLORS = {
  'Gemini 1.5 Flash': '#10b981',
  'Llama 3 (70B)': '#8b5cf6',
  'Mistral 7B': '#f59e0b',
};

// --- CUSTOM COMPONENTS ---

// Overriding the default Recharts tooltip to match our dark "Double-Bezel" aesthetic
const PremiumTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl bg-zinc-950/90 p-4 ring-1 ring-white/10 shadow-2xl backdrop-blur-md">
        <h4 className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
          {label} Analysis
        </h4>
        <div className="flex flex-col gap-2">
          {payload.map((entry, index) => (
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

// Overriding the default Legend to use our typography standards
const PremiumLegend = ({ payload }) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
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
export default function RadarChartComponent() {
  return (
    <div className="flex h-full w-full flex-col gap-4">
      {/* Section Header */}
      <h2 className="ml-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
        <Activity className="h-3.5 w-3.5" /> Performance Profile
      </h2>
      
      {/* Outer Shell (Double Bezel Architecture) */}
      <div className="flex-1 rounded-[2rem] bg-white/[0.02] p-1.5 ring-1 ring-white/5">
        
        {/* Inner Core */}
        <div className="relative flex h-full min-h-[400px] w-full flex-col items-center justify-center rounded-[calc(2rem-0.375rem)] bg-[#0c0c0e] p-6 ring-1 ring-white/5">
          
          {/* Explicit height on ResponsiveContainer bypasses resize observer bugs in iframes */}
          <ResponsiveContainer width="100%" height={380}>
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
              
              {/* Grid Lines - Muted to prevent visual noise */}
              <PolarGrid 
                stroke="#27272a" /* zinc-800 */
                strokeWidth={1}
                strokeDasharray="3 3"
              />
              
              {/* Axis Labels - Monospaced and subtle */}
              <PolarAngleAxis 
                dataKey="dimension" 
                tick={{ fill: '#a1a1aa', fontSize: 11, fontWeight: 600, fontFamily: 'monospace' }}
                tickLine={false}
              />
              
              {/* Force domain to 0-100 so all models map to a perfect percentage scale */}
              <PolarRadiusAxis 
                domain={[0, 100]} 
                tick={false} 
                axisLine={false} 
              />
              
              <Tooltip content={<PremiumTooltip />} cursor={false} />
              
              {/* Model 1: Gemini */}
              <Radar
                name="Gemini 1.5 Flash"
                dataKey="Gemini 1.5 Flash"
                stroke={MODEL_COLORS['Gemini 1.5 Flash']}
                strokeWidth={2}
                fill={MODEL_COLORS['Gemini 1.5 Flash']}
                fillOpacity={0.15}
                activeDot={{ r: 4, strokeWidth: 1, stroke: '#0c0c0e' }}
              />
              
              {/* Model 2: Llama */}
              <Radar
                name="Llama 3 (70B)"
                dataKey="Llama 3 (70B)"
                stroke={MODEL_COLORS['Llama 3 (70B)']}
                strokeWidth={2}
                fill={MODEL_COLORS['Llama 3 (70B)']}
                fillOpacity={0.15}
                activeDot={{ r: 4, strokeWidth: 1, stroke: '#0c0c0e' }}
              />

              {/* Model 3: Mistral */}
              <Radar
                name="Mistral 7B"
                dataKey="Mistral 7B"
                stroke={MODEL_COLORS['Mistral 7B']}
                strokeWidth={2}
                fill={MODEL_COLORS['Mistral 7B']}
                fillOpacity={0.15}
                activeDot={{ r: 4, strokeWidth: 1, stroke: '#0c0c0e' }}
              />

              <Legend content={<PremiumLegend />} />
            </RadarChart>
          </ResponsiveContainer>

        </div>
      </div>
    </div>
  );
}