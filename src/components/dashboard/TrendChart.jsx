import { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { TrendingUp, Loader2 } from 'lucide-react';
import { supabase } from '../../services/supabaseClient'; 
import { MODEL_REGISTRY } from '../../services/aiService'; 

const TIME_FRAME_OPTIONS = [
  { label: '2H', value: '2h' },
  { label: '4H', value: '4h' },
  { label: '8H', value: '8h' },
  { label: '12H', value: '12h' },
  { label: 'Daily', value: 'daily' },
];

const PremiumTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl bg-zinc-950/90 p-4 ring-1 ring-white/10 shadow-2xl backdrop-blur-md">
        <h4 className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
          {label} Performance
        </h4>
        <div className="flex flex-col gap-2">
          {[...payload].sort((a, b) => b.value - a.value).map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
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

const PremiumLegend = ({ payload }) => {
  if (!payload) return null;
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className="flex h-4 w-4 items-center justify-center rounded bg-white/[0.03] ring-1 ring-white/10">
            <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
          </div>
          <span className="text-xs font-medium text-zinc-400">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function TrendChart() {
  const [chartData, setChartData] = useState([]);
  const [activeModels, setActiveModels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeFrame, setTimeFrame] = useState('daily'); 

  useEffect(() => {
    let isMounted = true;

    const fetchAndProcessData = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('evaluations')
          .select('model_id, weighted_total, created_at')
          .order('created_at', { ascending: true });

        if (error) throw error;

        if (!data || data.length === 0) {
          if (isMounted) setIsLoading(false);
          return;
        }

        const groupedByDate = {};

        data.forEach(row => {
          const dateObj = new Date(row.created_at);
          let dateLabel;

          if (timeFrame === 'daily') {
            dateLabel = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          } else {
            const bucketSize = parseInt(timeFrame);
            const hours = Math.floor(dateObj.getHours() / bucketSize) * bucketSize;
            const day = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            dateLabel = `${day} ${hours.toString().padStart(2, '0')}:00`;
          }

          if (!groupedByDate[dateLabel]) {
            groupedByDate[dateLabel] = { date: dateLabel };
          }

          const registryEntry = MODEL_REGISTRY.find(m => m.id === row.model_id);
          const modelLabel = registryEntry ? registryEntry.label : row.model_id;

          if (!groupedByDate[dateLabel][modelLabel]) {
            groupedByDate[dateLabel][modelLabel] = { sum: 0, count: 0 };
          }
          
          groupedByDate[dateLabel][modelLabel].sum += Number(row.weighted_total) || 0;
          groupedByDate[dateLabel][modelLabel].count += 1;
        });

        const formattedData = Object.keys(groupedByDate).map(dateKey => {
          const dayData = { date: dateKey };
          Object.keys(groupedByDate[dateKey]).forEach(key => {
            if (key !== 'date') {
              dayData[key] = Math.round(groupedByDate[dateKey][key].sum / groupedByDate[dateKey][key].count);
            }
          });
          return dayData;
        });

        if (isMounted) {
          setChartData(formattedData);
          const uniqueModels = [...new Set(data.map(d => d.model_id))].map(id => {
            const entry = MODEL_REGISTRY.find(m => m.id === id);
            return { name: entry ? entry.label : id, color: entry ? entry.color : '#888' };
          });
          setActiveModels(uniqueModels);
        }

      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchAndProcessData();

    return () => { isMounted = false; };
  }, [timeFrame]); // Chart redraw when timeFrame changes

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <div className="flex items-center justify-between ml-2">
        <h2 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
          <TrendingUp className="h-3.5 w-3.5" /> Longitudinal Trajectory
        </h2>
        <select 
          className="bg-zinc-900 text-[10px] uppercase tracking-widest text-zinc-400 border border-white/10 rounded px-2 py-1 cursor-pointer outline-none hover:text-white transition-colors"
          value={timeFrame}
          onChange={(e) => setTimeFrame(e.target.value)}
        >
          {TIME_FRAME_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      
      <div className="flex-1 rounded-[2rem] bg-white/[0.02] p-1.5 ring-1 ring-white/5">
        
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
                
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                
                {/* adjust text for tighter timeframes */}
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: '#a1a1aa', fontSize: 10, fontWeight: 600, fontFamily: 'monospace' }}
                  tickLine={false}
                  axisLine={{ stroke: '#3f3f46' }}
                  dy={10}
                  interval={timeFrame === 'daily' ? 'preserveStartEnd' : 0}
                  angle={timeFrame === 'daily' ? 0 : -35}
                  textAnchor={timeFrame === 'daily' ? 'middle' : 'end'}
                  height={50}
                />
                
                <YAxis 
                  domain={[0, 100]} 
                  tick={{ fill: '#a1a1aa', fontSize: 11, fontWeight: 600, fontFamily: 'monospace' }}
                  tickLine={false}
                  axisLine={false}
                  dx={-10}
                />
                
                <Tooltip content={<PremiumTooltip />} cursor={{ stroke: '#3f3f46', strokeWidth: 1, strokeDasharray: '5 5' }} />
                
                <ReferenceLine 
                  y={70} 
                  stroke="#ef4444" 
                  strokeDasharray="4 4" 
                  label={{ position: 'top', value: 'Passing Threshold', fill: '#ef4444', fontSize: 10, fontWeight: 600, textAnchor: 'start', dx: 10, dy: -5 }} 
                />

                {activeModels.map((model) => (
                  <Line 
                    key={model.name}
                    type="monotone" 
                    dataKey={model.name} 
                    stroke={model.color} 
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2, fill: '#0c0c0e', stroke: model.color }}
                    activeDot={{ r: 6, strokeWidth: 0, fill: model.color }}
                    connectNulls={true} 
                    label={{ 
                      position: 'top', 
                      fill: '#a1a1aa', 
                      fontSize: 10, 
                      fontWeight: 600,
                      formatter: (value) => value > 0 ? value : '' 
                    }}
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