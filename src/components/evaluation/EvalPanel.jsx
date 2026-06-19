import { useState, useMemo } from 'react';
import { 
  Save, GitCompare, Terminal, CheckCircle2, XCircle, Info, Activity, Cpu, Sparkles,
} from 'lucide-react';

// --- MOCK DATA ---
const MOCK_EVAL_DATA = {
  modelName: 'Llama 3 (70B)',
  challengeTitle: 'Two Sum',
  timeElapsed: '2.4s',
  testResults: [
    { id: 'tc1', name: 'Standard Input', passed: true, time: '12ms' },
    { id: 'tc2', name: 'Negative Numbers', passed: true, time: '14ms' },
    { id: 'tc3', name: 'Zeroes', passed: true, time: '11ms' },
    { id: 'tc4', name: 'Large Array (10^4)', passed: false, time: 'Timeout' },
  ],
  initialScores: {
    correctness: 75, // 3/4 tests passed
    efficiency: 60,  // Failed large array
    readability: 90, // Very clean code
    explanation: 85, // Good markdown explanation
  }
};

const DIMENSIONS = [
  { id: 'correctness', label: 'Correctness', desc: 'Does the code perfectly solve the problem and pass all edge cases without logic errors?' },
  { id: 'efficiency', label: 'Efficiency', desc: 'Are the time and space complexities optimal? Does it avoid unnecessary computations?' },
  { id: 'readability', label: 'Readability', desc: 'Is the code clean, well-named, and idiomatic to the language standards?' },
  { id: 'explanation', label: 'Explanation', desc: 'Did the model clearly explain its approach, constraints, and complexity analysis?' }
];

// --- TOOLTIPS FOR EVERYDAY USERS ---
export const COMPLEXITY_TOOLTIPS = {
  timeComplexity: {
    title: "Time Complexity (Speed & Scaling)",
    description: "This doesn't measure seconds; it measures how many extra steps the code takes when given more work. Think of it like reading: if it takes 1 minute to read 1 page, how long does it take to read 100 pages? This measures how fast the workload scales."
  },
  spaceComplexity: {
    title: "Space Complexity (Memory)",
    description: "This measures how much 'desk space' (computer memory) the code needs to finish the job. If you sort a deck of cards, do you just use your hands (low space), or lay all 52 cards across a massive table (high space)?"
  },
  grades: {
    "O(1)": "O(1) — The Flat Rate (Perfect). No matter how much data you throw at it, it takes the exact same amount of time and memory. Like looking at the top item in a box.",
    "O(n)": "O(n) — The Per-Item Rate (Good). The work scales evenly with the data. 10 items take 10 steps. 100 items take 100 steps. Like reading a book page by page.",
    "O(n²)": "O(n²) — The Snowball Effect (Warning). For every new piece of data, the work multiplies. 10 items take 100 steps; 1,000 items take 1,000,000 steps. The code might freeze on large data."
  }
};

const getScoreColors = (score) => {
  if (score >= 80) return { text: 'text-emerald-400', bg: 'bg-emerald-400/10', fill: 'bg-emerald-500', ring: 'ring-emerald-400/20' };
  if (score >= 60) return { text: 'text-amber-400', bg: 'bg-amber-400/10', fill: 'bg-amber-500', ring: 'ring-amber-400/20' };
  if (score >= 40) return { text: 'text-orange-400', bg: 'bg-orange-400/10', fill: 'bg-orange-500', ring: 'ring-orange-400/20' };
  return { text: 'text-rose-400', bg: 'bg-rose-400/10', fill: 'bg-rose-500', ring: 'ring-rose-400/20' };
};

const getLetterGrade = (score) => {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
};

// Custom Range Slider with Dynamic Fill
const ScoreSlider = ({ dimension, value, onChange }) => {
  const colors = getScoreColors(value);

  return (
    <div className="flex flex-col gap-3 group/slider relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 relative group/tooltip">
          <label className="text-sm font-semibold text-zinc-300">{dimension.label}</label>
          <Info className="w-3.5 h-3.5 text-zinc-600 cursor-help transition-colors group-hover/tooltip:text-zinc-400" />
          
          {/* Tooltip */}
          <div className="absolute bottom-full left-0 mb-2 w-64 rounded-xl bg-zinc-800 p-3 text-xs text-zinc-300 ring-1 ring-white/10 opacity-0 scale-95 origin-bottom-left transition-all duration-200 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:scale-100 z-10 shadow-xl">
            {dimension.desc}
          </div>
        </div>
        <div className={`px-2 py-0.5 rounded-md text-xs font-bold font-mono tracking-widest ring-1 ${colors.bg} ${colors.text} ${colors.ring}`}>
          {value}
        </div>
      </div>

      <div className="relative h-3 w-full rounded-full bg-black/50 ring-1 ring-white/5 overflow-hidden">
        <div 
          className={`absolute top-0 left-0 h-full ${colors.fill} transition-all duration-200 ease-out`}
          style={{ width: `${value}%` }}
        />
        <input 
          type="range" 
          min="0" max="100" 
          value={value}
          onChange={(e) => onChange(dimension.id, parseInt(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
};

//Main Panel
export default function EvalPanel() {
  const [scores, setScores] = useState(MOCK_EVAL_DATA.initialScores);
  const [saveStatus, setSaveStatus] = useState('idle');

  const totalScore = useMemo(() => {
    const vals = Object.values(scores);
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  }, [scores]);

  const totalColors = getScoreColors(totalScore);
  const letterGrade = getLetterGrade(totalScore);

  const handleScoreChange = (id, value) => {
    setScores(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    setSaveStatus('loading');
    await new Promise(r => setTimeout(r, 1200));
    setSaveStatus('success');
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  return (
    <div className="min-h-[100dvh] bg-[#09090b] text-zinc-100 selection:bg-zinc-800 p-4 md:p-8 lg:p-12">
      <div className="mx-auto max-w-[1600px]">        
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="flex items-center gap-1.5 rounded-full bg-white/[0.03] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400 ring-1 ring-white/10">
                <Activity className="w-3.5 h-3.5" />
                Live Evaluation
              </span>
              <span className="text-xs font-medium text-zinc-600 font-mono">ID: eval_9x8f2</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tighter text-white">
              {MOCK_EVAL_DATA.challengeTitle} <span className="text-zinc-600 font-light px-2">/</span> {MOCK_EVAL_DATA.modelName}
            </h1>
          </div>
          
          <button className="flex items-center gap-2 rounded-full bg-white/[0.03] px-4 py-2 text-sm font-medium text-zinc-300 ring-1 ring-white/10 transition-all hover:bg-white/[0.06] hover:text-white">
            <GitCompare className="w-4 h-4" />
            Compare Model
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            <div className="rounded-[2rem] bg-white/[0.02] p-1.5 ring-1 ring-white/5">
              <div className="rounded-[calc(2rem-0.375rem)] bg-[#0c0c0e] ring-1 ring-white/5 overflow-hidden flex flex-col shadow-2xl">
                
                <div className="flex items-center justify-between border-b border-white/5 bg-black/40 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Cpu className="w-4 h-4 text-zinc-500" />
                    <span className="text-xs font-medium uppercase tracking-widest text-zinc-400">Model Output</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500/50"></span>
                    <span className="text-xs font-mono text-zinc-500">{MOCK_EVAL_DATA.timeElapsed}</span>
                  </div>
                </div>

                <div className="p-8 overflow-y-auto max-h-[800px] flex flex-col gap-6 scrollbar-thin scrollbar-thumb-white/10">
                  
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    To solve the <strong className="text-white font-medium">Two Sum</strong> problem optimally, we can use a Hash Map to store the values we have seen so far along with their indices. This allows us to achieve <code className="bg-white/10 px-1.5 py-0.5 rounded text-emerald-300">O(n)</code> time complexity.
                  </p>

                  <div className="rounded-xl bg-black/60 p-5 ring-1 ring-white/5 font-mono text-sm leading-loose overflow-x-auto">
                    <pre>
                      <span className="text-rose-400">function</span> <span className="text-blue-400">twoSum</span>(nums, target) {'{\n'}
                      <span className="text-zinc-500">  // Create a map to store seen numbers</span>{'\n'}
                      <span className="text-rose-400">  const</span> map = <span className="text-rose-400">new</span> <span className="text-amber-300">Map</span>();{'\n\n'}
                      <span className="text-rose-400">  for</span> (<span className="text-rose-400">let</span> i = <span className="text-emerald-300">0</span>; i {'<'} nums.<span className="text-cyan-300">length</span>; i++) {'{\n'}
                      <span className="text-rose-400">    const</span> complement = target - nums[i];{'\n\n'}
                      <span className="text-rose-400">    if</span> (map.<span className="text-blue-400">has</span>(complement)) {'{\n'}
                      <span className="text-rose-400">      return</span> [map.<span className="text-blue-400">get</span>(complement), i];{'\n'}
                      {'    }\n\n'}
                      {'    map.'}<span className="text-blue-400">set</span>(nums[i], i);{'\n'}
                      {'  }\n'}
                      <span className="text-rose-400">  return</span> [];{'\n'}
                      {'}'}
                    </pre>
                  </div>

                  <p className="text-sm text-zinc-300 leading-relaxed">
                    We iterate through the array exactly once. For each element, we calculate its <code>complement</code> and check if it exists in the hash map. If it does, we return the indices immediately.
                  </p>

                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6 sticky top-8">
            
            <div className="rounded-[2rem] bg-white/[0.02] p-1.5 ring-1 ring-white/5">
              <div className="rounded-[calc(2rem-0.375rem)] bg-zinc-950/50 p-6 ring-1 ring-white/5 flex items-center justify-between">
                <div>
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500 mb-1">Final Evaluation Score</h3>
                  <div className="flex items-end gap-2">
                    <span className={`text-4xl font-bold tracking-tighter ${totalColors.text}`}>
                      {totalScore}
                    </span>
                    <span className="text-zinc-600 font-medium mb-1">/ 100</span>
                  </div>
                </div>
                
                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${totalColors.bg} ${totalColors.ring} ring-1`}>
                  <span className={`text-3xl font-black ${totalColors.text}`}>{letterGrade}</span>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] bg-white/[0.02] p-1.5 ring-1 ring-white/5">
              <div className="rounded-[calc(2rem-0.375rem)] bg-zinc-950/50 p-6 ring-1 ring-white/5 space-y-4">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5" /> Execution Results
                </h3>
                <div className="space-y-2">
                  {MOCK_EVAL_DATA.testResults.map((test) => (
                    <div key={test.id} className="flex items-center justify-between p-3 rounded-xl bg-black/40 ring-1 ring-white/5">
                      <div className="flex items-center gap-3">
                        {test.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-500" />
                        )}
                        <span className="text-sm font-medium text-zinc-300">{test.name}</span>
                      </div>
                      <span className="text-xs font-mono text-zinc-600">{test.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] bg-white/[0.02] p-1.5 ring-1 ring-white/5">
              <div className="rounded-[calc(2rem-0.375rem)] bg-zinc-950/50 p-8 ring-1 ring-white/5 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" /> Scoring Rubric
                  </h3>
                  <span className="text-[10px] text-zinc-600 font-medium bg-white/5 px-2 py-1 rounded-md">AUTO-FILLED</span>
                </div>

                <div className="space-y-8">
                  {DIMENSIONS.map((dim) => (
                    <ScoreSlider 
                      key={dim.id} 
                      dimension={dim} 
                      value={scores[dim.id]} 
                      onChange={handleScoreChange} 
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button 
                onClick={handleSave}
                disabled={saveStatus === 'loading'}
                className="group relative flex w-full items-center justify-center gap-3 rounded-full bg-zinc-100 py-4 text-sm font-semibold text-zinc-950 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-white active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]"
              >
                {saveStatus === 'loading' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                    <span>Committing to Database...</span>
                  </>
                ) : saveStatus === 'success' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">Evaluation Saved</span>
                  </>
                ) : (
                  <>
                    <span>Save Evaluation</span>
                    <Save className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}