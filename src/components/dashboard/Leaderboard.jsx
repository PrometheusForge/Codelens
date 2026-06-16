import React, { useState, useEffect } from 'react';
import { 
  Activity, Cpu, Layers, Target, 
  TrendingUp, TrendingDown, Crown, 
  ChevronRight, TerminalSquare, Sparkles, Zap, Box, Loader2
} from 'lucide-react';
import { supabase } from '../../services/supabaseClient'; // Adjust path if needed
import { MODEL_REGISTRY } from '../../services/aiService'; // Adjust path if needed

// Helper to map providers to matching Lucide icons dynamically
const getProviderIcon = (provider) => {
  switch (provider?.toLowerCase()) {
    case 'google': return Sparkles;
    case 'groq': return TerminalSquare;
    case 'openai': return Box;
    case 'cohere': return Layers;
    case 'mistral': return Zap;
    case 'deepseek': return Cpu;
    default: return Target;
  }
};

const getRankStyles = (rank) => {
  if (rank === 1) return 'text-amber-400 bg-amber-400/10 ring-amber-400/30 shadow-[0_0_20px_rgba(251,191,36,0.1)]';
  if (rank === 2) return 'text-zinc-300 bg-zinc-300/10 ring-zinc-300/30';
  if (rank === 3) return 'text-orange-400 bg-orange-400/10 ring-orange-400/30';
  return 'text-zinc-500 bg-white/[0.02] ring-white/10';
};

const LeaderboardRow = ({ model }) => {
  const rankStyles = getRankStyles(model.rank);
  const ProviderIcon = model.providerIcon || Target;

  return (
    <tr className="group transition-colors hover:bg-white/[0.02] border-b border-white/5 last:border-0">
      {/* Rank */}
      <td className="py-4 pl-6 pr-4 whitespace-nowrap">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ring-1 ${rankStyles}`}>
          {model.rank === 1 ? <Crown className="w-4 h-4" /> : <span className="font-mono text-xs font-bold">{model.rank}</span>}
        </div>
      </td>
      
      {/* Model Identity */}
      <td className="py-4 px-4 min-w-[200px]">
        <div className="flex flex-col gap-1">
          <span className="font-medium text-zinc-200">{model.name}</span>
          <div className="flex items-center gap-1.5 text-zinc-500">
            <ProviderIcon className="w-3 h-3" />
            <span className="text-[10px] uppercase tracking-widest font-semibold">{model.provider}</span>
          </div>
        </div>
      </td>

      {/* Aggregate Score */}
      <td className="py-4 px-4 text-right">
        <span className={`text-lg font-bold font-mono ${model.total >= 90 ? 'text-emerald-400' : model.total >= 80 ? 'text-amber-400' : 'text-zinc-300'}`}>
          {model.total.toFixed(1)}
        </span>
      </td>

      {/* Dimensions (Monospace for perfect alignment) */}
      <td className="py-4 px-4 text-right font-mono text-sm text-zinc-400">{model.correctness}</td>
      <td className="py-4 px-4 text-right font-mono text-sm text-zinc-400 hidden md:table-cell">{model.efficiency}</td>
      <td className="py-4 px-4 text-right font-mono text-sm text-zinc-400 hidden lg:table-cell">{model.readability}</td>
      
      {/* Evals Count */}
      <td className="py-4 px-4 text-right">
        <span className="inline-flex items-center px-2 py-1 rounded-md bg-white/[0.03] ring-1 ring-white/10 text-xs font-mono text-zinc-500">
          {model.evals}
        </span>
      </td>

      {/* Action */}
      <td className="py-4 pl-4 pr-6 text-right">
        <button className="p-2 rounded-lg text-zinc-600 hover:text-zinc-200 hover:bg-white/[0.05] transition-colors ring-1 ring-transparent hover:ring-white/10">
          <ChevronRight className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
};

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchLeaderboardData = async () => {
      try {
        setIsLoading(true);
        // 1. Fetch relevant columns from Supabase
        const { data, error } = await supabase
          .from('evaluations')
          .select('model_id, weighted_total, correctness, efficiency, readability');

        if (error) throw error;

        if (!data || data.length === 0) {
          if (isMounted) setLeaderboardData([]);
          return;
        }

        // 2. Aggregate the data by model
        const stats = {};
        data.forEach(row => {
          if (!row.model_id) return; // Skip any null rows safely
          
          if (!stats[row.model_id]) {
            stats[row.model_id] = { count: 0, totalScore: 0, totalCorrect: 0, totalEff: 0, totalRead: 0 };
          }
          
          stats[row.model_id].count += 1;
          stats[row.model_id].totalScore += Number(row.weighted_total) || 0;
          stats[row.model_id].totalCorrect += Number(row.correctness) || 0;
          stats[row.model_id].totalEff += Number(row.efficiency) || 0;
          stats[row.model_id].totalRead += Number(row.readability) || 0;
        });

        // 3. Format and calculate averages
        const formattedData = Object.keys(stats).map(modelId => {
          const modelStats = stats[modelId];
          const registryInfo = MODEL_REGISTRY.find(m => m.id === modelId);

          return {
            id: modelId,
            name: registryInfo ? registryInfo.label : modelId,
            provider: registryInfo ? registryInfo.provider : 'Unknown',
            providerIcon: getProviderIcon(registryInfo ? registryInfo.provider : 'Unknown'),
            total: modelStats.totalScore / modelStats.count,
            correctness: Math.round(modelStats.totalCorrect / modelStats.count),
            efficiency: Math.round(modelStats.totalEff / modelStats.count),
            readability: Math.round(modelStats.totalRead / modelStats.count),
            evals: modelStats.count
          };
        });

        // 4. Sort by highest total score first, then assign rank index
        formattedData.sort((a, b) => b.total - a.total);
        formattedData.forEach((model, index) => {
          model.rank = index + 1;
        });

        if (isMounted) {
          setLeaderboardData(formattedData);
        }

      } catch (err) {
        console.error("Error fetching leaderboard data:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchLeaderboardData();

    return () => { isMounted = false; };
  }, []);

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2 ml-2">
        <Crown className="w-3.5 h-3.5" /> Model Leaderboard
      </h2>
      
      <div className="rounded-[2rem] bg-white/[0.02] p-1.5 ring-1 ring-white/5">
        <div className="rounded-[calc(2rem-0.375rem)] bg-[#0c0c0e] ring-1 ring-white/5 overflow-x-auto min-h-[300px]">
          
          {isLoading ? (
            <div className="h-[300px] flex flex-col items-center justify-center gap-3 text-zinc-500">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
              <span className="text-xs font-medium tracking-wide uppercase">Compiling Global Rankings...</span>
            </div>
          ) : leaderboardData.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-zinc-500 text-xs font-medium tracking-wide uppercase">
              No Evaluation Data Available
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.01]">
                  <th className="py-4 pl-6 pr-4 text-[10px] font-semibold uppercase tracking-widest text-zinc-500 w-16">Rank</th>
                  <th className="py-4 px-4 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Model Architecture</th>
                  <th className="py-4 px-4 text-[10px] font-semibold uppercase tracking-widest text-zinc-500 text-right">Avg Score</th>
                  <th className="py-4 px-4 text-[10px] font-semibold uppercase tracking-widest text-zinc-500 text-right">Correct</th>
                  <th className="py-4 px-4 text-[10px] font-semibold uppercase tracking-widest text-zinc-500 text-right hidden md:table-cell">Efficient</th>
                  <th className="py-4 px-4 text-[10px] font-semibold uppercase tracking-widest text-zinc-500 text-right hidden lg:table-cell">Readable</th>
                  <th className="py-4 px-4 text-[10px] font-semibold uppercase tracking-widest text-zinc-500 text-right">Evals</th>
                  <th className="py-4 pl-4 pr-6 text-[10px] font-semibold uppercase tracking-widest text-zinc-500 text-right w-16">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-transparent">
                {leaderboardData.map((model) => (
                  <LeaderboardRow key={model.id} model={model} />
                ))}
              </tbody>
            </table>
          )}
          
        </div>
      </div>
    </section>
  );
}