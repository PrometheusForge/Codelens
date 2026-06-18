import React, { useState, useEffect } from 'react';
import { LayoutGrid, Target, Zap, Loader2 } from 'lucide-react';
import { supabase } from '../../services/supabaseClient'; // Adjust path if needed
import { MODEL_REGISTRY } from '../../services/aiService'; // Adjust path if needed

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

// Generates a short title for long prompts
const truncatePrompt = (prompt) => {
  if (!prompt) return 'Unknown Challenge';
  const words = prompt.split(' ');
  if (words.length <= 5) return prompt;
  return words.slice(0, 5).join(' ') + '...';
};

const HeatmapCell = ({ data, modelName }) => {
  // 1. Introduce React State to track hover
  const [isHovered, setIsHovered] = useState(false);
  
  const { score, correctness, efficiency } = data || {};
  const isEvaluated = score !== null && score !== undefined;
  
  return (
    <div 
      className="relative cursor-pointer w-full h-10 rounded-md transition-all duration-300"
      // 2. Dynamically force the z-index and scale to override the Grid stacking context
      style={{ 
        zIndex: isHovered ? 50 : 1,
        transform: isHovered ? 'scale(1.05)' : 'scale(1)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      
      {/* Visual Cell */}
      <div className={`w-full h-full rounded-md flex items-center justify-center font-mono text-xs font-bold transition-colors ${getCellStyles(score)}`}>
        {isEvaluated ? score : '—'}
      </div>

      {/* Hover Tooltip (Double-Bezel Architecture) */}
      <div 
        // 3. Swap Tailwind 'group-hover' for a state-driven template literal. 
        // Added 'visible/invisible' to prevent hidden elements from eating mouse clicks.
        className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isHovered ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
        }`}
      >
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
                    <Target className="w-3.5 h-3.5" />
                    <span>Correctness</span>
                  </div>
                  <span className="font-mono text-zinc-200">{correctness}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Efficiency</span>
                  </div>
                  <span className="font-mono text-zinc-200">{efficiency}</span>
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
  const [heatmapData, setHeatmapData] = useState([]);
  const [activeModels, setActiveModels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isShowingAll, setIsShowingAll] = useState(false);
  const INITIAL_RECORD_LIMIT = 10;

  useEffect(() => {
    let isMounted = true;

    const fetchHeatmapData = async () => {
      try {
        setIsLoading(true);
        
        // 1. Fetch raw data
        const { data, error } = await supabase
          .from('evaluations')
          .select('model_id, challenge_prompt, weighted_total, correctness, efficiency')
          .not('challenge_prompt', 'is', null);

        if (error) throw error;

        if (!data || data.length === 0) {
          if (isMounted) setIsLoading(false);
          return;
        }

        // 2. Identify all unique models tested to create the columns
        const modelIdsSet = new Set(data.map(r => r.model_id).filter(Boolean));
        const modelsArray = Array.from(modelIdsSet).map(id => {
          const reg = MODEL_REGISTRY.find(m => m.id === id);
          return { id, label: reg ? reg.label : id };
        });

        // 3. Group evaluations by Challenge Prompt
        const challengesMap = {};
        data.forEach(row => {
          const prompt = row.challenge_prompt;
          const model = row.model_id;
          
          if (!prompt || !model) return;

          if (!challengesMap[prompt]) {
            challengesMap[prompt] = {};
          }
          
          // If a model attempted the same prompt multiple times, average it
          if (!challengesMap[prompt][model]) {
            challengesMap[prompt][model] = { count: 0, score: 0, correct: 0, eff: 0 };
          }
          
          challengesMap[prompt][model].count += 1;
          challengesMap[prompt][model].score += Number(row.weighted_total) || 0;
          challengesMap[prompt][model].correct += Number(row.correctness) || 0;
          challengesMap[prompt][model].eff += Number(row.efficiency) || 0;
        });

        // 4. Format into our UI array structure
        const formattedChallenges = Object.keys(challengesMap).map(prompt => {
          const results = modelsArray.map(modelObj => {
            const stats = challengesMap[prompt][modelObj.id];
            if (!stats) return { score: null }; // Model hasn't attempted this challenge
            
            return {
              score: Math.round(stats.score / stats.count),
              correctness: Math.round(stats.correct / stats.count),
              efficiency: Math.round(stats.eff / stats.count)
            };
          });

          return { 
            name: truncatePrompt(prompt), 
            fullPrompt: prompt, 
            results 
          };
        });

        if (isMounted) {
          setActiveModels(modelsArray);
          // Grouping all dynamic DB prompts under one category header
          setHeatmapData([{ category: 'Benchmarked Scenarios', challenges: formattedChallenges }]);
        }

      } catch (err) {
        console.error("Error fetching heatmap data:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchHeatmapData();

    return () => { isMounted = false; };
  }, []);

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
      <div className="rounded-[2rem] bg-white/[0.02] p-1.5 ring-1 ring-white/5">
        {/* FIX: Changed pt-32 to pt-6 to remove the massive gap */}
        <div className="rounded-[calc(2rem-0.375rem)] bg-[#0c0c0e] px-6 pb-6 pt-6 ring-1 ring-white/5 overflow-x-auto custom-scrollbar">
                
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3 text-zinc-500">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
              <span className="text-xs font-medium tracking-wide uppercase">Assembling Matrix Data...</span>
            </div>
          ) : heatmapData.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-zinc-500 text-xs font-medium tracking-wide uppercase">
              No Challenge Data Available
            </div>
          ) : (
            <div 
              className="min-w-[700px] grid gap-x-2 gap-y-1"
              style={{ gridTemplateColumns: `240px repeat(${activeModels.length}, minmax(80px, 1fr))` }}
            >
              
              {/* Header Row: Models */}
              <div 
                className="col-start-2 grid gap-2 mb-4" 
                style={{ gridTemplateColumns: `repeat(${activeModels.length}, 1fr)`, gridColumnEnd: `span ${activeModels.length}` }}
              >
                {activeModels.map((model, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 truncate px-1" title={model.label}>
                      {model.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Matrix Body */}
              {heatmapData.map((categoryBlock, catIdx) => {
                // NEW: Logic to slice the array to 10 items if not showing all
                const visibleChallenges = isShowingAll 
                  ? categoryBlock.challenges 
                  : categoryBlock.challenges.slice(0, INITIAL_RECORD_LIMIT);
                
                const hasHiddenRecords = categoryBlock.challenges.length > INITIAL_RECORD_LIMIT;

                return (
                  <React.Fragment key={catIdx}>
                    
                    {/* Category Divider */}
                    <div className="mt-4 mb-2 first:mt-0" style={{ gridColumn: `1 / -1` }}>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                          {categoryBlock.category}
                        </span>
                        <div className="h-px flex-1 bg-white/5" />
                      </div>
                    </div>

                    {/* Challenge Rows (Now using visibleChallenges) */}
                    {visibleChallenges.map((challenge, chalIdx) => (
                      <React.Fragment key={`${catIdx}-${chalIdx}`}>
                        
                        {/* Challenge Title (Y-Axis) */}
                        <div className="flex items-center text-sm font-medium text-zinc-300 pr-4">
                          <span className="truncate" title={challenge.fullPrompt}>
                            {challenge.name}
                          </span>
                        </div>

                        {/* Data Cells (X-Axis) */}
                        <div 
                          className="grid gap-2" 
                          style={{ gridTemplateColumns: `repeat(${activeModels.length}, 1fr)`, gridColumnEnd: `span ${activeModels.length}` }}
                        >
                          {challenge.results.map((result, resIdx) => (
                            <HeatmapCell 
                              key={resIdx} 
                              data={result} 
                              modelName={activeModels[resIdx]?.label} 
                            />
                          ))}
                        </div>
                      </React.Fragment>
                    ))}

                    {/* NEW: Show More Button */}
                    {hasHiddenRecords && !isShowingAll && (
                      <div className="mt-8 mb-2 flex justify-center" style={{ gridColumn: `1 / -1` }}>
                        <button 
                          onClick={() => setIsShowingAll(true)}
                          className="px-6 py-2.5 bg-white/[0.03] hover:bg-white/[0.08] text-zinc-300 text-xs font-bold uppercase tracking-widest rounded-lg transition-colors border border-white/10"
                        >
                          Show {categoryBlock.challenges.length - INITIAL_RECORD_LIMIT} More Records
                        </button>
                      </div>
                    )}
                    
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}