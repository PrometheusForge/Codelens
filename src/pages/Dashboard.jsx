//import { Activity, Target } from 'lucide-react';
import StatsRow from '../components/dashboard/StatsRow';
import Leaderboard from '../components/dashboard/Leaderboard';
import RadarChart from '../components/dashboard/RadarChart';
import TrendChart from '../components/dashboard/TrendChart';
import HeatmapGrid from '../components/dashboard/HeatmapGrid';

export default function Dashboard() {
  return (
    <div className="min-h-[100dvh] bg-[#09090b] text-zinc-100 selection:bg-zinc-800 py-12 md:py-24 overflow-x-hidden">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        
        <header className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
              Telemetry & Rankings
            </h1>
            <p className="mt-4 text-lg text-zinc-400 leading-relaxed">
              Global performance aggregates across all evaluated models. Scores represent a weighted composite of correctness, efficiency, readability, and security.
            </p>
          </div>
          
          {/* Last Updated Badge */}
          <div className="flex items-center gap-2 rounded-full bg-white/[0.02] px-4 py-2 ring-1 ring-white/5">
            <div className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </div>
            <span className="text-xs font-medium uppercase tracking-widest text-zinc-500">Live Data</span>
          </div>
        </header>

        <div className="flex flex-col gap-12">
          
          {/* STEP 6.1: Placed perfectly as an isolated component */}
          <StatsRow />

          {/* BENTO GRID ROW 1: Leaderboard + Radar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              {/* STEP 6.2: Placed perfectly as an isolated component */}
              <Leaderboard />
            </div>

           {/* STEP 6.3: Radar Chart Component */}
            <aside className="lg:col-span-4 flex flex-col gap-8">
              <RadarChart />
            </aside>
          </div>

          {/* BENTO GRID ROW 2: Trend Chart */}
          {/* Stretches full width to give the timeline room to breathe */}
          <div className="w-full">
            <TrendChart />
          </div>

          {/* BENTO GRID ROW 3: Heatmap Grid */}
          {/* Sits at the bottom as the granular data matrix */}
          <div className="w-full">
            <HeatmapGrid />
          </div>

        </div>

      </div>
    </div>
  );
}