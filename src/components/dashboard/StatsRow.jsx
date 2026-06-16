import React, { useState, useEffect } from 'react';
import { 
  Activity, Cpu, Layers, Target, 
  TrendingUp, TrendingDown, Loader2
} from 'lucide-react';
import { supabase } from '../../services/supabaseClient'; // Adjust path if needed

const StatCard = ({ stat, index }) => {
  const Icon = stat.icon;
  
  return (
    <div 
      className="group relative rounded-[2rem] bg-white/[0.02] p-1.5 ring-1 ring-white/5 transition-all duration-500 hover:bg-white/[0.04]"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="relative h-full rounded-[calc(2rem-0.375rem)] bg-[#0c0c0e] p-6 ring-1 ring-white/5 overflow-hidden flex flex-col justify-between gap-6">
        
        {/* Subtle Background Glow */}
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/[0.02] blur-3xl pointer-events-none transition-all duration-500 group-hover:bg-white/[0.04]" />

        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.03] ring-1 ring-white/10 text-zinc-400 group-hover:text-zinc-200 transition-colors">
            <Icon className="w-4 h-4" />
          </div>
          
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase ring-1 ${
            stat.isPositive === true ? 'text-emerald-400 bg-emerald-400/10 ring-emerald-400/20' : 
            stat.isPositive === false ? 'text-rose-400 bg-rose-400/10 ring-rose-400/20' : 
            'text-zinc-400 bg-zinc-400/10 ring-zinc-400/20'
          }`}>
            {stat.isPositive === true ? <TrendingUp className="w-3 h-3" /> : stat.isPositive === false ? <TrendingDown className="w-3 h-3" /> : null}
            {stat.trend}
          </div>
        </div>

        <div>
          <h3 className="text-3xl font-semibold tracking-tighter text-white font-mono">
            {stat.value}
          </h3>
          <p className="mt-1 text-xs font-medium uppercase tracking-widest text-zinc-500">
            {stat.label}
          </p>
        </div>

      </div>
    </div>
  );
};

export default function StatsRow() {
  const [statsData, setStatsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      try {
        setIsLoading(true);
        // We added 'created_at' to the fetch so we can do time-travel math
        const { data, error } = await supabase
          .from('evaluations')
          .select('model_id, challenge_prompt, correctness, created_at');

        if (error) throw error;

        // Fallback for empty database state
        if (!data || data.length === 0) {
          if (isMounted) {
            setStatsData([
              { id: 'evals', label: 'Total Evaluations', value: '0', trend: 'NO DATA', isPositive: null, icon: Activity },
              { id: 'models', label: 'Models Benchmarked', value: '0', trend: 'NO DATA', isPositive: null, icon: Cpu },
              { id: 'challenges', label: 'Active Challenges', value: '0', trend: 'NO DATA', isPositive: null, icon: Layers },
              { id: 'correctness', label: 'Global Correctness', value: '0%', trend: 'NO DATA', isPositive: null, icon: Target },
            ]);
            setIsLoading(false);
          }
          return;
        }

        // --- TIME TRAVEL MATH SETUP ---
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

        // Sort data into buckets
        const currentWeekData = data.filter(d => new Date(d.created_at) >= oneWeekAgo);
        const previousWeekData = data.filter(d => {
          const date = new Date(d.created_at);
          return date >= twoWeeksAgo && date < oneWeekAgo;
        });
        const upToOneWeekAgoData = data.filter(d => new Date(d.created_at) < oneWeekAgo);

        // --- 1. TOTAL EVALUATIONS ---
        const totalEvals = data.length;
        let evalTrend = "NO CHANGE";
        let evalIsPositive = null;
        
        if (previousWeekData.length === 0 && currentWeekData.length > 0) {
          evalTrend = `+${currentWeekData.length} THIS WEEK`;
          evalIsPositive = true;
        } else if (previousWeekData.length > 0) {
          const percentChange = ((currentWeekData.length - previousWeekData.length) / previousWeekData.length) * 100;
          evalTrend = `${percentChange > 0 ? '+' : ''}${percentChange.toFixed(1)}%`;
          evalIsPositive = percentChange > 0 ? true : percentChange < 0 ? false : null;
        }

        // --- 2. MODELS BENCHMARKED ---
        const uniqueModelsAll = new Set(data.map(row => row.model_id).filter(Boolean)).size;
        const uniqueModelsBefore = new Set(upToOneWeekAgoData.map(row => row.model_id).filter(Boolean)).size;
        const newModelsThisWeek = uniqueModelsAll - uniqueModelsBefore;
        
        let modelTrend = "NO CHANGE";
        let modelIsPositive = null;
        if (newModelsThisWeek > 0) {
          modelTrend = `+${newModelsThisWeek} THIS WEEK`;
          modelIsPositive = true;
        }

        // --- 3. ACTIVE CHALLENGES ---
        const uniqueChallengesAll = new Set(data.map(row => row.challenge_prompt).filter(Boolean)).size;
        const uniqueChallengesBefore = new Set(upToOneWeekAgoData.map(row => row.challenge_prompt).filter(Boolean)).size;
        const newChallengesThisWeek = uniqueChallengesAll - uniqueChallengesBefore;

        let challengeTrend = "NO CHANGE";
        let challengeIsPositive = null;
        if (newChallengesThisWeek > 0) {
          challengeTrend = `+${newChallengesThisWeek} THIS WEEK`;
          challengeIsPositive = true;
        }

        // --- 4. GLOBAL CORRECTNESS ---
        const getAvg = (arr) => arr.length ? arr.reduce((sum, d) => sum + (Number(d.correctness) || 0), 0) / arr.length : 0;
        const avgAll = getAvg(data);
        const avgCurrentWeek = getAvg(currentWeekData);
        const avgPrevWeek = getAvg(previousWeekData);

        let corrTrend = "NO CHANGE";
        let corrIsPositive = null;

        if (previousWeekData.length === 0 && currentWeekData.length > 0) {
          corrTrend = "NEW DATA";
          corrIsPositive = true;
        } else if (previousWeekData.length > 0 && currentWeekData.length > 0) {
          const diff = avgCurrentWeek - avgPrevWeek;
          corrTrend = `${diff > 0 ? '+' : ''}${diff.toFixed(1)}%`;
          corrIsPositive = diff > 0 ? true : diff < 0 ? false : null;
        }

        // --- UPDATE STATE ---
        if (isMounted) {
          setStatsData([
            { id: 'evals', label: 'Total Evaluations', value: totalEvals.toLocaleString(), trend: evalTrend, isPositive: evalIsPositive, icon: Activity },
            { id: 'models', label: 'Models Benchmarked', value: uniqueModelsAll.toString(), trend: modelTrend, isPositive: modelIsPositive, icon: Cpu },
            { id: 'challenges', label: 'Active Challenges', value: uniqueChallengesAll.toString(), trend: challengeTrend, isPositive: challengeIsPositive, icon: Layers },
            { id: 'correctness', label: 'Global Correctness', value: `${avgAll.toFixed(1)}%`, trend: corrTrend, isPositive: corrIsPositive, icon: Target },
          ]);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-32 w-full items-center justify-center gap-3 rounded-[2rem] bg-white/[0.02] ring-1 ring-white/5 text-zinc-500">
         <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
         <span className="text-xs font-medium tracking-wide uppercase">Calculating Global Telemetry...</span>
      </div>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat, idx) => (
        <StatCard key={stat.id} stat={stat} index={idx} />
      ))}
    </section>
  );
}