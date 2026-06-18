import { useState, useEffect } from 'react';
import { 
  Radar, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, 
  Tooltip, Legend 
} from 'recharts';
import { Activity, Loader2 } from 'lucide-react';
import { supabase } from '../../services/supabaseClient'; 
import { MODEL_REGISTRY } from '../../services/aiService'; 

// Tooltip component for radar chart
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

// Legend component for radar chart
const PremiumLegend = ({ payload }) => {
  if (!payload) return null;
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
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

// Main RadarChart component
export default function RadarChartComponent() {
  const [chartData, setChartData] = useState([]);
  const [activeModels, setActiveModels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchAndProcessData = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('evaluations')
          .select('model_id, correctness, efficiency, readability, explanation, security');

        if (error) throw error;
        
        if (!data || data.length === 0) {
          if (isMounted) {
            setIsLoading(false);
          }
          return;
        }

        const modelStats = {};
        data.forEach(row => {
          const registryEntry = MODEL_REGISTRY.find(m => m.id === row.model_id);
          const label = registryEntry ? registryEntry.label : row.model_id;
          const color = registryEntry ? registryEntry.color : '#8884d8';

          if (!modelStats[label]) {
            modelStats[label] = { 
              count: 0, 
              color: color,
              Correctness: 0, 
              Efficiency: 0, 
              Readability: 0, 
              Explanation: 0, 
              Security: 0 
            };
          }
          
          modelStats[label].count += 1;
          modelStats[label].Correctness += Number(row.correctness) || 0;
          modelStats[label].Efficiency += Number(row.efficiency) || 0;
          modelStats[label].Readability += Number(row.readability) || 0;
          modelStats[label].Explanation += Number(row.explanation) || 0;
          modelStats[label].Security += Number(row.security) || 0;
        });

        const foundModelLabels = Object.keys(modelStats);
        
        const modelsToRender = foundModelLabels.map(label => ({
          name: label,
          color: modelStats[label].color
        }));

        const dimensions = ['Correctness', 'Efficiency', 'Readability', 'Explanation', 'Security'];
        
        const formattedData = dimensions.map(dim => {
          const dataPoint = { dimension: dim };
          foundModelLabels.forEach(label => {
            const avg = modelStats[label][dim] / modelStats[label].count;
            dataPoint[label] = Math.round(avg);
          });
          return dataPoint;
        });

        if (isMounted) {
          setActiveModels(modelsToRender);
          setChartData(formattedData);
        }
      } catch (err) {
        console.error("Error fetching radar data:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchAndProcessData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <h2 className="ml-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
        <Activity className="h-3.5 w-3.5" /> Performance Profile
      </h2>
      
      <div className="flex-1 rounded-[2rem] bg-white/[0.02] p-1.5 ring-1 ring-white/5">
        <div className="relative flex h-full min-h-[400px] w-full flex-col items-center justify-center rounded-[calc(2rem-0.375rem)] bg-[#0c0c0e] p-6 ring-1 ring-white/5">
          
          {isLoading ? (
            <div className="flex flex-col items-center gap-3 text-zinc-500">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
              <span className="text-xs font-medium tracking-wide">SYNCING TELEMETRY...</span>
            </div>
          ) : chartData.length === 0 ? (
            <div className="text-zinc-500 text-xs font-medium tracking-wide">
              AWAITING EVALUATION DATA
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={380}>
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                <PolarGrid 
                  stroke="#27272a" 
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
                <PolarAngleAxis 
                  dataKey="dimension" 
                  tick={{ fill: '#a1a1aa', fontSize: 11, fontWeight: 600, fontFamily: 'monospace' }}
                  tickLine={false}
                />
                <PolarRadiusAxis 
                  domain={[0, 100]} 
                  tick={false} 
                  axisLine={false} 
                />
                <Tooltip content={<PremiumTooltip />} cursor={false} />
                {activeModels.map((model) => (
                  <Radar
                    key={model.name}
                    name={model.name}
                    dataKey={model.name}
                    stroke={model.color}
                    strokeWidth={2}
                    fill={model.color}
                    fillOpacity={0.15}
                    activeDot={{ r: 4, strokeWidth: 1, stroke: '#0c0c0e' }}
                  />
                ))}
                <Legend content={<PremiumLegend />} />
              </RadarChart>
            </ResponsiveContainer>
          )}

        </div>
      </div>
    </div>
  );
}