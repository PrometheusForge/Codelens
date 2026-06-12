import React from 'react';
import { LayoutGrid, Clock, CheckCircle2 } from 'lucide-react';

// --- MOCK DATA ---
const MODELS = ['Gemini 1.5 Flash', 'Llama 3 (70B)', 'GPT-4o', 'Mistral 7B', 'Gemma 2 (9B)'];

// We structure data by Category -> Challenge -> Array of Model Results (matching the MODELS array order)
const HEATMAP_DATA = [
  {
    category: 'Algorithms',
    challenges: [
      { 
        name: 'Two Sum', 
        results: [
          { score: 98, passRate: '100%', time: '0.8s' },
          { score: 95, passRate: '100%', time: '1.2s' },
          { score: 100, passRate: '100%', time: '0.9s' },
          { score: 75, passRate: '75%', time: '0.7s' },
          { score: 70, passRate: '75%', time: '0.6s' }
        ] 
      },
      { 
        name: 'LRU Cache', 
        results: [
          { score: 85, passRate: '100%', time: '1.4s' },
          { score: 82, passRate: '100%', time: '1.8s' },
          { score: 92, passRate: '100%', time: '1.2s' },
          { score: 45, passRate: '50%', time: '1.1s' },
          { score: 55, passRate: '50%', time: '1.0s' }
        ] 
      },
      { 
        name: 'Word Ladder', 
        results: [
          { score: 72, passRate: '75%', time: '2.1s' },
          { score: 88, passRate: '100%', time: '2.4s' },
          { score: 95, passRate: '100%', time: '1.8s' },
          { score: 35, passRate: '25%', time: 'Timeout' },
          { score: null, passRate: null, time: null } // Not Evaluated
        ] 
      }
    ]
  },
  {
    category: 'Frontend',
    challenges: [
      { 
        name: 'Virtual Scroll Engine', 
        results: [
          { score: 90, passRate: '100%', time: '1.1s' },
          { score: 85, passRate: '100%', time: '1.5s' },
          { score: 94, passRate: '100%', time: '1.2s' },
          { score: 65, passRate: '50%', time: '0.9s' },
          { score: 60, passRate: '50%', time: '0.8s' }
        ] 
      },
      { 
        name: 'Promise.allSettled', 
        results: [
          { score: 95, passRate: '100%', time: '0.6s' },
          { score: 92, passRate: '100%', time: '0.9s' },
          { score: 98, passRate: '100%', time: '0.7s' },
          { score: 80, passRate: '100%', time: '0.5s' },
          { score: 75, passRate: '75%', time: '0.5s' }
        ] 
      }
    ]
  },
  {
    category: 'System Design',
    challenges: [
      { 
        name: 'Pub/Sub Broker', 
        results: [
          { score: 88, passRate: '100%', time: '1.9s' },
          { score: 92, passRate: '100%', time: '2.3s' },
          { score: 96, passRate: '100%', time: '1.7s' },
          { score: 55, passRate: '50%', time: '1.4s' },
          { score: null, passRate: null, time: null }
        ] 
      },
      { 
        name: 'Token Bucket Limiter', 
        results: [
          { score: 82, passRate: '100%', time: '1.5s' },
          { score: 89, passRate: '100%', time: '1.8s' },
          { score: 90, passRate: '100%', time: '1.4s' },
          { score: 45, passRate: '25%', time: '1.1s' },
          { score: 40, passRate: '25%', time: '1.0s' }
        ] 
      }
    ]
  }
];

// --- UTILS & MICRO-COMPONENTS ---

const getCellStyles = (score) => {
  if (score === null || score === undefined) {
    return 'bg-white/[0.02] border border-dashed border-white/10 text-transparent'; // Not evaluated
  }
  if (score >= 80) return 'bg-emerald-500/80 border border-emerald-400/20 text-emerald-50';
  if (score >= 60) return 'bg-amber-500/80 border border-amber-400/20 text-amber-50';
  if (score >= 40) return 'bg-orange-500/80 border border-orange-400/20 text-orange-50';
  return 'bg-rose-500/80 border border-rose-400/20 text-rose-50';
};

const HeatmapCell = ({ data, modelName }) => {
  const { score, passRate, time } = data;
  const isEvaluated = score !== null && score !== undefined;
  
  return (
    <div className="relative group cursor-pointer w-full h-10 rounded-md transition-all duration-300 hover:scale-[1.05] hover:z-20">
      
      {/* Visual Cell */}
      <div className={`w-full h-full rounded-md flex items-center justify-center font-mono text-xs font-bold transition-colors ${getCellStyles(score)}`}>
        {isEvaluated ? score : '—'}
      </div>

      {/* Hover Tooltip (Double-Bezel Architecture) */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 opacity-0 scale-95 pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:scale-100 z-50">
        <div className="rounded-xl bg-white/[0.02] p-1 ring-1 ring-white/10 shadow-[0_0_40px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          <div className="rounded-lg bg-zinc-950 p-4 ring-1 ring-white/5 flex flex-col gap-3">
            
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">{modelName}</span>
              <span className={`text-lg font-black font-mono leading-none ${
                score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-amber-400' : score >= 40 ? 'text-orange-400' : score !== null ? 'text-rose-400' : 'text-zinc-500'
              }`}>
                {isEvaluated ? score : 'N/A'}
              </span>
            </div>

            {isEvaluated ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Pass Rate</span>
                  </div>
                  <span className="font-mono text-zinc-200">{passRate}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Response Time</span>
                  </div>
                  <span className="font-mono text-zinc-200">{time}</span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-zinc-500 text-center py-2 italic">
                Awaiting Evaluation
              </div>
            )}
          </div>
        </div>
        
        {/* Tooltip Triangle Pointer */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-white/10" />
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

export default function HeatmapGrid() {
  return (
    <div className="flex flex-col gap-4 w-full">
      
      {/* Section Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 ml-2">
        <h2 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
          <LayoutGrid className="w-3.5 h-3.5" /> Evaluation Matrix
        </h2>
        
        {/* Legend */}
        <div className="flex items-center gap-4 rounded-full bg-white/[0.02] px-4 py-1.5 ring-1 ring-white/5">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500/80 ring-1 ring-emerald-400/20" />
            <span className="text-[10px] font-medium text-zinc-400">≥ 80</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm bg-amber-500/80 ring-1 ring-amber-400/20" />
            <span className="text-[10px] font-medium text-zinc-400">60-79</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm bg-orange-500/80 ring-1 ring-orange-400/20" />
            <span className="text-[10px] font-medium text-zinc-400">40-59</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm bg-rose-500/80 ring-1 ring-rose-400/20" />
            <span className="text-[10px] font-medium text-zinc-400">&lt; 40</span>
          </div>
        </div>
      </div>

      {/* Double Bezel Container */}
      <div className="rounded-[2rem] bg-white/[0.02] p-1.5 ring-1 ring-white/5 overflow-hidden">
        <div className="rounded-[calc(2rem-0.375rem)] bg-[#0c0c0e] p-6 ring-1 ring-white/5 overflow-x-auto custom-scrollbar">
          
          {/* CSS Grid Implementation */}
          <div className="min-w-[700px] grid grid-cols-[240px_repeat(5,minmax(80px,1fr))] gap-x-2 gap-y-1">
            
            {/* Header Row: Models */}
            <div className="col-start-2 col-span-5 grid grid-cols-5 gap-2 mb-4">
              {MODELS.map((model, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 truncate px-1" title={model}>
                    {model}
                  </div>
                </div>
              ))}
            </div>

            {/* Matrix Body */}
            {HEATMAP_DATA.map((categoryBlock, catIdx) => (
              <React.Fragment key={catIdx}>
                
                {/* Category Divider */}
                <div className="col-span-6 mt-4 mb-2 first:mt-0">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                      {categoryBlock.category}
                    </span>
                    <div className="h-px flex-1 bg-white/5" />
                  </div>
                </div>

                {/* Challenge Rows */}
                {categoryBlock.challenges.map((challenge, chalIdx) => (
                  <React.Fragment key={`${catIdx}-${chalIdx}`}>
                    {/* Challenge Title (Y-Axis) */}
                    <div className="flex items-center text-sm font-medium text-zinc-300 pr-4">
                      <span className="truncate" title={challenge.name}>
                        {challenge.name}
                      </span>
                    </div>

                    {/* Data Cells (X-Axis) */}
                    <div className="col-span-5 grid grid-cols-5 gap-2">
                      {challenge.results.map((result, resIdx) => (
                        <HeatmapCell 
                          key={resIdx} 
                          data={result} 
                          modelName={MODELS[resIdx]} 
                        />
                      ))}
                    </div>
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
}