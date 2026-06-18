import { useState, useMemo } from 'react';
import { 
  Crown, Download, Code2, LayoutGrid, Clock, Check, TerminalSquare, Sparkles, Zap
} from 'lucide-react';

// --- MOCK DATA ---
const MOCK_COMPARISON = [
  {
    id: 'gemini-flash',
    name: 'Gemini 1.5 Flash',
    provider: 'Google',
    providerIcon: Sparkles,
    time: '0.8s',
    totalScore: 92,
    dimensions: { correctness: 100, efficiency: 90, readability: 90, explanation: 90 },
    tests: [true, true, true, true],
    code: [
      { type: 'unchanged', text: 'function twoSum(nums, target) {' },
      { type: 'added', text: '  const map = new Map();' },
      { type: 'unchanged', text: '  for (let i = 0; i < nums.length; i++) {' },
      { type: 'added', text: '    const comp = target - nums[i];' },
      { type: 'added', text: '    if (map.has(comp)) return [map.get(comp), i];' },
      { type: 'added', text: '    map.set(nums[i], i);' },
      { type: 'unchanged', text: '  }' },
      { type: 'unchanged', text: '  return [];' },
      { type: 'unchanged', text: '}' }
    ]
  },
  {
    id: 'llama-70b',
    name: 'Llama 3 (70B)',
    provider: 'Groq',
    providerIcon: TerminalSquare,
    time: '1.2s',
    totalScore: 88,
    dimensions: { correctness: 100, efficiency: 80, readability: 85, explanation: 85 },
    tests: [true, true, true, true],
    code: [
      { type: 'unchanged', text: 'function twoSum(nums, target) {' },
      { type: 'removed', text: '  let obj = {};' },
      { type: 'unchanged', text: '  for (let i = 0; i < nums.length; i++) {' },
      { type: 'removed', text: '    let complement = target - nums[i];' },
      { type: 'removed', text: '    if (complement in obj) {' },
      { type: 'removed', text: '      return [obj[complement], i];' },
      { type: 'removed', text: '    }' },
      { type: 'removed', text: '    obj[nums[i]] = i;' },
      { type: 'unchanged', text: '  }' },
      { type: 'unchanged', text: '  return [];' },
      { type: 'unchanged', text: '}' }
    ]
  },
  {
    id: 'mistral-7b',
    name: 'Mistral 7B',
    provider: 'OpenRouter',
    providerIcon: Zap,
    time: '0.9s',
    totalScore: 65,
    dimensions: { correctness: 75, efficiency: 50, readability: 70, explanation: 65 },
    tests: [true, true, true, false],
    code: [
      { type: 'unchanged', text: 'function twoSum(nums, target) {' },
      { type: 'removed', text: '  // O(n^2) approach' },
      { type: 'removed', text: '  for (let i = 0; i < nums.length; i++) {' },
      { type: 'removed', text: '    for (let j = i + 1; j < nums.length; j++) {' },
      { type: 'removed', text: '      if (nums[i] + nums[j] === target) {' },
      { type: 'removed', text: '        return [i, j];' },
      { type: 'removed', text: '      }' },
      { type: 'removed', text: '    }' },
      { type: 'unchanged', text: '  }' },
      { type: 'unchanged', text: '  return [];' },
      { type: 'unchanged', text: '}' }
    ]
  }
];

const getScoreColors = (score) => {
  if (score >= 80) return { text: 'text-emerald-400', bg: 'bg-emerald-400/10', fill: 'bg-emerald-500', border: 'border-emerald-500/20' };
  if (score >= 60) return { text: 'text-amber-400', bg: 'bg-amber-400/10', fill: 'bg-amber-500', border: 'border-amber-500/20' };
  if (score >= 40) return { text: 'text-orange-400', bg: 'bg-orange-400/10', fill: 'bg-orange-500', border: 'border-orange-500/20' };
  return { text: 'text-rose-400', bg: 'bg-rose-400/10', fill: 'bg-rose-500', border: 'border-rose-500/20' };
};

const DimensionBar = ({ label, score }) => {
  const colors = getScoreColors(score);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-zinc-400">{label}</span>
        <span className={`font-mono font-bold ${colors.text}`}>{score}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/50 ring-1 ring-white/5">
        <div 
          className={`h-full ${colors.fill} transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]`} 
          style={{ width: `${score}%` }} 
        />
      </div>
    </div>
  );
};

export default function ComparisonView() {
  const [viewMode, setViewMode] = useState('metrics');
  const [copied, setCopied] = useState(false);
  const highestScore = useMemo(() => Math.max(...MOCK_COMPARISON.map(m => m.totalScore)), []);// Identify winner
  const handleExportMarkdown = () => {
    let md = `## Model Evaluation Comparison\n\n`;
    md += `| Model | Total | Correctness | Efficiency | Readability | Explanation | Time |\n`;
    md += `|---|:---:|:---:|:---:|:---:|:---:|:---:|\n`;
    
    MOCK_COMPARISON.forEach(m => {
      const { correctness, efficiency, readability, explanation } = m.dimensions;
      md += `| **${m.name}** | **${m.totalScore}** | ${correctness} | ${efficiency} | ${readability} | ${explanation} | ${m.time} |\n`;
    });

    navigator.clipboard.writeText(md).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-[100dvh] bg-[#09090b] text-zinc-100 selection:bg-zinc-800 p-4 md:p-8 lg:p-12 overflow-x-hidden">
      <div className="mx-auto max-w-[1600px]">
        
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tighter text-white">
              Evaluation Comparison
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              Side-by-side analysis for <span className="font-medium text-zinc-200">Two Sum</span>
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <div className="flex items-center gap-1 rounded-full bg-white/[0.03] p-1 ring-1 ring-white/10">
              <button 
                onClick={() => setViewMode('metrics')}
                className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-300 ${viewMode === 'metrics' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <LayoutGrid className="w-3.5 h-3.5" /> Metrics
              </button>
              <button 
                onClick={() => setViewMode('diff')}
                className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-300 ${viewMode === 'diff' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <Code2 className="w-3.5 h-3.5" /> Code Diff
              </button>
            </div>

            {/* Export */}
            <button 
              onClick={handleExportMarkdown}
              className="flex items-center gap-2 rounded-full bg-white/[0.03] px-4 py-2 text-sm font-medium text-zinc-300 ring-1 ring-white/10 transition-all hover:bg-white/[0.06] hover:text-white"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4" />}
              {copied ? 'Copied to Clipboard' : 'Export Table'}
            </button>
          </div>
        </header>

        {/* Comparison Grid */}
        <div className={`grid gap-6 ${MOCK_COMPARISON.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
          {MOCK_COMPARISON.map(model => {
            const isWinner = model.totalScore === highestScore;
            const colors = getScoreColors(model.totalScore);
            const ProviderIcon = model.providerIcon;

            return (
              <div key={model.id} className={`relative rounded-[2rem] p-1.5 transition-all duration-500 ${isWinner ? 'bg-emerald-500/10 ring-1 ring-emerald-500/30 shadow-[0_0_80px_rgba(16,185,129,0.05)]' : 'bg-white/[0.02] ring-1 ring-white/5'}`}>
                
                {/* Winner Crown */}
                {isWinner && (
                  <div className="absolute -top-4 inset-x-0 flex justify-center z-10">
                    <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-400 ring-1 ring-emerald-500/30 backdrop-blur-md">
                      <Crown className="w-3.5 h-3.5" /> Top Performer
                    </div>
                  </div>
                )}

                <div className={`relative h-full rounded-[calc(2rem-0.375rem)] bg-[#0c0c0e] p-6 lg:p-8 flex flex-col ${isWinner ? 'ring-1 ring-emerald-500/20' : 'ring-1 ring-white/5'}`}>
                  
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-zinc-500 mb-1">
                        <ProviderIcon className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-semibold uppercase tracking-widest">{model.provider}</span>
                      </div>
                      <h2 className="text-xl font-medium tracking-tight text-white">{model.name}</h2>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <div className={`text-4xl font-bold tracking-tighter ${colors.text}`}>
                        {model.totalScore}
                      </div>
                      <div className="text-[10px] font-medium uppercase tracking-widest text-zinc-500 mt-1">Total Score</div>
                    </div>
                  </div>

                  {/* Dynamic View Content */}
                  <div className="flex-1">
                    {viewMode === 'metrics' ? (
                      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                        <div className="space-y-5">
                          <DimensionBar label="Correctness" score={model.dimensions.correctness} />
                          <DimensionBar label="Efficiency" score={model.dimensions.efficiency} />
                          <DimensionBar label="Readability" score={model.dimensions.readability} />
                          <DimensionBar label="Explanation" score={model.dimensions.explanation} />
                        </div>

                        {/* Test Cases Row */}
                        <div className="pt-6 border-t border-white/5">
                          <div className="flex items-center justify-between text-xs mb-3">
                            <span className="font-medium text-zinc-400">Test Cases</span>
                            <div className="flex items-center gap-1.5 font-mono text-zinc-500">
                              <Clock className="w-3.5 h-3.5" /> {model.time}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {model.tests.map((passed, idx) => (
                              <div 
                                key={idx} 
                                className={`flex-1 h-2 rounded-full ${passed ? 'bg-emerald-500/50 ring-1 ring-emerald-500/30' : 'bg-rose-500/50 ring-1 ring-rose-500/30'}`}
                                title={`Test ${idx + 1}: ${passed ? 'Passed' : 'Failed'}`}
                              />
                            ))}
                          </div>
                        </div>

                      </div>
                    ) : (
                      <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Code Diff Simulation */}
                        <div className="flex-1 rounded-xl bg-black/60 p-4 ring-1 ring-white/5 font-mono text-[11px] md:text-xs leading-loose overflow-x-auto">
                          <pre className="min-w-fit">
                            {model.code.map((line, idx) => (
                              <div 
                                key={idx} 
                                className={`px-2 -mx-2 rounded-sm ${
                                  line.type === 'added' ? 'bg-emerald-500/10 text-emerald-300 border-l-2 border-emerald-500/50' :
                                  line.type === 'removed' ? 'bg-rose-500/10 text-rose-300 border-l-2 border-rose-500/50 line-through opacity-75' :
                                  'text-zinc-400 border-l-2 border-transparent'
                                }`}
                              >
                                {line.text}
                              </div>
                            ))}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}