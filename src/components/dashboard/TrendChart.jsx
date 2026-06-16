import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { TrendingUp, Loader2 } from 'lucide-react';
import { supabase } from '../../services/supabaseClient'; // Adjust path if needed
import { MODEL_REGISTRY } from '../../services/aiService'; // Adjust path if needed

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
  if (!payload) return null;
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className="flex h-4 w-4 items-center justify-center rounded bg-white/[0.03] ring-1 ring-white/10">
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
  const [chartData, setChartData] = useState([]);
  const [activeModels, setActiveModels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchAndProcessData = async () => {
      try {
        setIsLoading(true);
        
        // 1. Fetch evaluations ordered by creation date
        const { data, error } = await supabase
          .from('evaluations')
          .select('model_id, weighted_total, created_at')
          .order('created_at', { ascending: true });

        if (error) throw error;

        if (!data || data.length === 0) {
          if (isMounted) setIsLoading(false);
          return;
        }

        // 2. Group data by Date (e.g., "Jun 15") and aggregate scores
        const groupedByDate = {};
        const modelsFound = new Set();

        data.forEach(row => {
          if (!row.model_id || row.weighted_total == null) return;
          
          // Format date as "MMM DD" (e.g., Jun 15)
          const dateObj = new Date(row.created_at);
          const dateLabel = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          
          // Map model_id to nice label from registry
          const registryEntry = MODEL_REGISTRY.find(m => m.id === row.model_id);
          const modelLabel = registryEntry ? registryEntry.label : row.model_id;
          
          modelsFound.add(row.model_id);

          if (!groupedByDate[dateLabel]) {
            groupedByDate[dateLabel] = {};
          }
          if (!groupedByDate[dateLabel][modelLabel]) {
            groupedByDate[dateLabel][modelLabel] = { sum: 0, count: 0 };
          }
          
          groupedByDate[dateLabel][modelLabel].sum += Number(row.weighted_total);
          groupedByDate[dateLabel][modelLabel].count += 1;
        });

        // 3. Format into Recharts array structure
        const formattedData = Object.keys(groupedByDate).map(dateLabel => {
          const dataPoint = { date: dateLabel };
          
          Object.keys(groupedByDate[dateLabel]).forEach(modelLabel => {
            const stats = groupedByDate[dateLabel][modelLabel];
            // Calculate average for that day and round it
            dataPoint[modelLabel] = Math.round(stats.sum / stats.count);
          });
          
          return dataPoint;
        });

        // 4. Map active models for rendering the Line components dynamically
        const modelsToRender = Array.from(modelsFound).map(modelId => {
          const registryEntry = MODEL_REGISTRY.find(m => m.id === modelId);
          return {
            name: registryEntry ? registryEntry.label : modelId,
            color: registryEntry ? registryEntry.color : '#8884d8'
          };
        });

        if (isMounted) {
          setChartData(formattedData);
          setActiveModels(modelsToRender);
        }
      } catch (err) {
        console.error("Error fetching trend data:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchAndProcessData();

    return () => { isMounted = false; };
  }, []);

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
          
          {isLoading ? (
            <div className="flex flex-col items-center gap-3 text-zinc-500">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
              <span className="text-xs font-medium tracking-wide uppercase">Mapping Trajectories...</span>
            </div>
          ) : chartData.length === 0 ? (
            <div className="text-zinc-500 text-xs font-medium tracking-wide uppercase">
              Awaiting Evaluation Data
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={380}>
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                
                {/* Grid Lines - Highly muted */}
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#27272a" 
                  vertical={false} 
                />
                
                {/* X-Axis */}
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: '#a1a1aa', fontSize: 11, fontWeight: 600, fontFamily: 'monospace' }}
                  tickLine={false}
                  axisLine={{ stroke: '#3f3f46' }}
                  dy={10}
                />
                
                {/* Y-Axis */}
                <YAxis 
                  domain={[0, 100]} 
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

                {/* Dynamically render Model Lines based on database records */}
                {activeModels.map((model) => (
                  <Line 
                    key={model.name}
                    type="monotone" 
                    dataKey={model.name} 
                    stroke={model.color} 
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2, fill: '#0c0c0e', stroke: model.color }}
                    activeDot={{ r: 6, strokeWidth: 0, fill: model.color }}
                    connectNulls={true} // Prevents line breaks if a model wasn't evaluated on a specific day
                  />
                ))}

                <Legend content={<PremiumLegend />} verticalAlign="bottom" />
              </LineChart>
            </ResponsiveContainer>
          )}

        </div>
      </div>
    </div>
  );
}