import React from 'react';
import { 
  Activity, Cpu, Layers, Target, 
  TrendingUp, TrendingDown, Crown, 
  ChevronRight, TerminalSquare, Sparkles, Zap, Box
} from 'lucide-react';

const TELEMETRY_STATS = [
  { id: 'evals', label: 'Total Evaluations', value: '1,428', trend: '+12.4%', isPositive: true, icon: Activity },
  { id: 'models', label: 'Models Benchmarked', value: '8', trend: '+2 this week', isPositive: true, icon: Cpu },
  { id: 'challenges', label: 'Active Challenges', value: '47', trend: 'No change', isPositive: null, icon: Layers },
  { id: 'correctness', label: 'Global Correctness', value: '78.2%', trend: '-1.2%', isPositive: false, icon: Target },
];

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
  return (
    <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {TELEMETRY_STATS.map((stat, idx) => (
        <StatCard key={stat.id} stat={stat} index={idx} />
      ))}
    </section>
  );
};