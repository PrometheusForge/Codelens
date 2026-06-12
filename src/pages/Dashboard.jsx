export default function Dashboard() {
  return (
    <div className="min-h-[100dvh] bg-[#09090b] text-zinc-100 selection:bg-zinc-800 py-12 md:py-24 overflow-x-hidden">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        
        {/* Editorial Header */}
        <header className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-semibold tracking-tighter text-white md:text-5xl">
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

          {/* BENTO GRID: Leaderboard + Future Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <div className="lg:col-span-8">
              {/* STEP 6.2: Placed perfectly as an isolated component */}
              <Leaderboard />
            </div>

            {/* PLACEHOLDER: Radar Chart & Heatmap Area (Steps 6.3 & 6.4) */}
            <aside className="lg:col-span-4 flex flex-col gap-8">
              <div className="flex flex-col gap-4 h-full">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2 ml-2">
                  <Activity className="w-3.5 h-3.5" /> Performance Profile
                </h2>
                
                <div className="flex-1 rounded-[2rem] bg-white/[0.02] p-1.5 ring-1 ring-white/5">
                  <div className="h-full min-h-[300px] rounded-[calc(2rem-0.375rem)] bg-[#0c0c0e] p-6 ring-1 ring-white/5 flex flex-col items-center justify-center text-center relative overflow-hidden">
                    
                    {/* Decorative Chart Placeholder UI */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                      <svg className="w-48 h-48 animate-pulse" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
                        <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" className="text-zinc-500" />
                        <polygon points="50,30 75,45 75,70 50,80 25,70 25,45" className="text-emerald-500" />
                        <line x1="50" y1="50" x2="50" y2="10" className="text-zinc-600" />
                        <line x1="50" y1="50" x2="90" y2="30" className="text-zinc-600" />
                        <line x1="50" y1="50" x2="90" y2="70" className="text-zinc-600" />
                        <line x1="50" y1="50" x2="50" y2="90" className="text-zinc-600" />
                        <line x1="50" y1="50" x2="10" y2="70" className="text-zinc-600" />
                        <line x1="50" y1="50" x2="10" y2="30" className="text-zinc-600" />
                      </svg>
                    </div>

                    <div className="relative z-10">
                      <div className="mb-3 mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.03] ring-1 ring-white/10 text-zinc-500">
                        <Target className="w-4 h-4" />
                      </div>
                      <p className="text-sm font-medium text-zinc-300">Radar Chart Sandbox</p>
                      <p className="mt-1 text-xs text-zinc-500 max-w-[200px]">
                        Recharts dimensional analysis will mount here in Step 6.3.
                      </p>
                    </div>

                  </div>
                </div>
              </div>
            </aside>

          </div>
        </div>

      </div>
    </div>
  );
}