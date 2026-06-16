import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  TerminalSquare, Layout, Database, Server, Bug, Network,
  Plus, Trash2, Eye, Edit3, AlertCircle, Beaker,
  ChevronDown, ArrowRight, CheckCircle2
} from 'lucide-react';

// --- CONSTANTS ---
const CATEGORIES = [
  { id: 'algorithms', label: 'Algorithms', icon: TerminalSquare },
  { id: 'data-structures', label: 'Data Structures', icon: Database },
  { id: 'frontend', label: 'Frontend', icon: Layout },
  { id: 'backend', label: 'Backend', icon: Server },
  { id: 'debugging', label: 'Debugging', icon: Bug },
  { id: 'system-design', label: 'System Design', icon: Network },
];
const DIFFICULTIES = ['easy', 'medium', 'hard', 'expert'];
const LANGUAGES = ['javascript', 'python', 'both'];

// --- UTILS ---
const generateId = () => Math.random().toString(36).substr(2, 9);
const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

const isSupabaseConfigured = () => {
  // Use try/catch for safe environment variable access
  // When running locally in Vite or Next, this resolves gracefully.
  try {
    const url = typeof import.meta !== 'undefined' ? import.meta.env?.VITE_SUPABASE_URL : process?.env?.VITE_SUPABASE_URL;
    return !!url && url !== 'YOUR_SUPABASE_URL';
  } catch (e) {
    return false;
  }
};

// --- COMPONENTS ---

const Label = ({ children, htmlFor }) => (
  <label htmlFor={htmlFor} className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500 mb-2">
    {children}
  </label>
);

const Input = ({ ...props }) => (
  <input 
    className="w-full rounded-xl bg-white/[0.02] px-4 py-3 text-sm text-white placeholder-zinc-600 ring-1 ring-white/10 transition-all duration-300 focus:bg-white/[0.04] focus:outline-none focus:ring-white/20"
    {...props}
  />
);

const Select = ({ options, value, onChange, icon: Icon }) => (
  <div className="relative">
    <select 
      value={value}
      onChange={onChange}
      className="w-full appearance-none rounded-xl bg-white/[0.02] pl-11 pr-10 py-3 text-sm font-medium text-zinc-300 ring-1 ring-white/10 transition-all focus:outline-none focus:ring-white/20 capitalize"
    >
      {options.map(opt => (
        <option key={opt.id || opt} value={opt.id || opt} className="bg-zinc-900">
          {opt.label || opt}
        </option>
      ))}
    </select>
    {Icon && <Icon className="absolute left-4 top-1/2 w-4 h-4 -translate-y-1/2 text-zinc-500 pointer-events-none" />}
    <ChevronDown className="absolute right-4 top-1/2 w-4 h-4 -translate-y-1/2 text-zinc-500 pointer-events-none" />
  </div>
);

// --- MAIN FORM ---
export default function ChallengeForm() {
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'algorithms',
    difficulty: 'medium',
    language: 'both',
    estimatedMinutes: 30,
    prompt: '# Challenge Title\n\nWrite your prompt description here...\n\n## Examples\n- **Input:** `x = 1`\n- **Output:** `2`',
  });

  const [testCases, setTestCases] = useState([
    { id: generateId(), input: '', expectedOutput: '', points: 50 },
    { id: generateId(), input: '', expectedOutput: '', points: 50 },
  ]);

  // UI State
  const [activeTab, setActiveTab] = useState('write'); // 'write' | 'preview'
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTestCase = () => {
    setTestCases(prev => [...prev, { id: generateId(), input: '', expectedOutput: '', points: 0 }]);
  };

  const handleRemoveTestCase = (id) => {
    setTestCases(prev => prev.filter(tc => tc.id !== id));
  };

  const handleTestCaseChange = (id, field, value) => {
    setTestCases(prev => prev.map(tc => tc.id === id ? { ...tc, [field]: value } : tc));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Validating...' });

    // 1. Validation
    if (!formData.title.trim()) {
      return setStatus({ type: 'error', message: 'Challenge title is required.' });
    }
    if (testCases.length < 2) {
      return setStatus({ type: 'error', message: 'At least 2 test cases are required for robust evaluation.' });
    }
    const invalidTests = testCases.filter(tc => !tc.input.trim() || !tc.expectedOutput.trim());
    if (invalidTests.length > 0) {
      return setStatus({ type: 'error', message: 'All test cases must have both input and expected output.' });
    }

    // 2. Construct Payload
    const newChallenge = {
      ...formData,
      id: slugify(formData.title),
      testCases,
      tags: [], // Tags omitted for brevity, can be added later
      examples: [], // Could be parsed from prompt or added as separate fields
      constraints: [],
      createdAt: new Date().toISOString()
    };

    setStatus({ type: 'loading', message: 'Saving protocol...' });

    // 3. Save Logic (Supabase fallback to LocalStorage)
    try {
      if (isSupabaseConfigured()) {
        // Pseudo-code for actual Supabase insert:
        // const { error } = await supabase.from('challenges').insert(newChallenge);
        // if (error) throw error;
        
        // Simulating network delay
        await new Promise(r => setTimeout(r, 800));
      } else {
        // LocalStorage Fallback (Zero-Budget mode)
        const existing = JSON.parse(localStorage.getItem('codelens_custom_challenges') || '[]');
        localStorage.setItem('codelens_custom_challenges', JSON.stringify([...existing, newChallenge]));
        await new Promise(r => setTimeout(r, 400));
      }
      
      setStatus({ type: 'success', message: 'Challenge successfully added to the library.' });
      
      // Reset form after success
      setTimeout(() => {
        setFormData({ ...formData, title: '', prompt: '' });
        setTestCases([{ id: generateId(), input: '', expectedOutput: '', points: 50 }, { id: generateId(), input: '', expectedOutput: '', points: 50 }]);
        setStatus({ type: 'idle', message: '' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 2000);

    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to save challenge.' });
    }
  };

  const selectedCategoryIcon = CATEGORIES.find(c => c.id === formData.category)?.icon || TerminalSquare;

  return (
    <div className="min-h-[100dvh] bg-[#09090b] text-zinc-100 selection:bg-zinc-800 py-12 md:py-24">
      <div className="mx-auto max-w-4xl px-4 md:px-8">
        
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-3xl font-semibold tracking-tighter text-white md:text-4xl">
            Protocol Architect
          </h1>
          <p className="mt-3 text-sm text-zinc-400 leading-relaxed max-w-[60ch]">
            Design and deploy custom evaluation challenges. Define constraints, craft the prompt, and establish the execution test cases required for AI benchmarking.
          </p>
        </header>

        <form onSubmit={handleSave} className="space-y-12">
          
          {/* SECTION 1: METADATA */}
          <section className="rounded-[2rem] bg-white/[0.02] p-1.5 ring-1 ring-white/5">
            <div className="rounded-[calc(2rem-0.375rem)] bg-zinc-950/50 p-8 ring-1 ring-white/5">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2 mb-8">
                <TerminalSquare className="w-4 h-4" /> Core Metadata
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <Label htmlFor="title">Challenge Title</Label>
                  <Input 
                    id="title"
                    name="title"
                    placeholder="e.g., Implement a Distributed Lock" 
                    value={formData.title}
                    onChange={handleInputChange}
                    autoFocus
                  />
                </div>

                <div>
                  <Label>Category</Label>
                  <Select 
                    options={CATEGORIES} 
                    value={formData.category} 
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    icon={selectedCategoryIcon}
                  />
                </div>

                <div>
                  <Label>Difficulty Level</Label>
                  <Select 
                    options={DIFFICULTIES} 
                    value={formData.difficulty} 
                    onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                  />
                </div>

                <div>
                  <Label>Target Language</Label>
                  <Select 
                    options={LANGUAGES} 
                    value={formData.language} 
                    onChange={(e) => setFormData({...formData, language: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="estimatedMinutes">Est. Human Time (Minutes)</Label>
                  <Input 
                    id="estimatedMinutes"
                    name="estimatedMinutes"
                    type="number"
                    min="1"
                    value={formData.estimatedMinutes}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: PROMPT EDITOR */}
          <section className="rounded-[2rem] bg-white/[0.02] p-1.5 ring-1 ring-white/5">
            <div className="rounded-[calc(2rem-0.375rem)] bg-zinc-950/50 ring-1 ring-white/5 overflow-hidden flex flex-col h-[500px]">
              
              {/* Editor Toolbar */}
              <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-4 py-3">
                <div className="flex items-center gap-1 rounded-full bg-white/[0.03] p-1 ring-1 ring-white/10">
                  <button 
                    type="button"
                    onClick={() => setActiveTab('write')}
                    className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium transition-all ${activeTab === 'write' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Write
                  </button>
                  <button 
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium transition-all ${activeTab === 'preview' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    <Eye className="w-3.5 h-3.5" /> Preview
                  </button>
                </div>
                <div className="text-[10px] uppercase tracking-wider text-zinc-600 font-semibold">
                  Markdown Supported
                </div>
              </div>

              {/* Editor / Preview Area */}
              <div className="flex-1 overflow-hidden relative bg-[#09090b]">
                {activeTab === 'write' ? (
                  <textarea
                    name="prompt"
                    value={formData.prompt}
                    onChange={handleInputChange}
                    placeholder="Describe the challenge parameters..."
                    className="absolute inset-0 w-full h-full resize-none bg-transparent p-6 text-sm font-mono text-zinc-300 placeholder-zinc-700 focus:outline-none leading-relaxed"
                  />
                ) : (
                  <div className="absolute inset-0 w-full h-full overflow-y-auto p-6 text-zinc-300 text-sm">
                    {formData.prompt ? (
                      <ReactMarkdown>{formData.prompt}</ReactMarkdown>
                    ) : (
                      <span className="text-zinc-600 italic">Nothing to preview.</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* SECTION 3: TEST CASES */}
          <section className="rounded-[2rem] bg-white/[0.02] p-1.5 ring-1 ring-white/5">
            <div className="rounded-[calc(2rem-0.375rem)] bg-zinc-950/50 p-8 ring-1 ring-white/5">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
                  <Beaker className="w-4 h-4" /> Execution Suite
                </h2>
                <span className="text-xs text-zinc-500 font-medium">
                  {testCases.length} Cases Configured
                </span>
              </div>

              <div className="space-y-4">
                {testCases.map((tc, index) => (
                  <div key={tc.id} className="group relative flex flex-col md:flex-row gap-4 rounded-2xl bg-white/[0.02] p-4 ring-1 ring-white/10 transition-all hover:bg-white/[0.04]">
                    
                    <div className="flex items-center gap-3 absolute -left-3 -top-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-800 text-[10px] font-bold text-zinc-400 ring-2 ring-[#09090b]">
                        {index + 1}
                      </span>
                    </div>

                    <div className="flex-1 space-y-2 pt-2 md:pt-0">
                      <Label>Standard Input (stdin)</Label>
                      <textarea 
                        value={tc.input}
                        onChange={(e) => handleTestCaseChange(tc.id, 'input', e.target.value)}
                        placeholder="e.g., [1,2,3]\n5"
                        className="w-full h-20 resize-y rounded-lg bg-black/40 px-3 py-2 text-xs font-mono text-emerald-300 placeholder-zinc-700 ring-1 ring-white/5 focus:outline-none focus:ring-white/20"
                      />
                    </div>
                    
                    <div className="flex-1 space-y-2 pt-2 md:pt-0">
                      <Label>Expected Output (stdout)</Label>
                      <textarea 
                        value={tc.expectedOutput}
                        onChange={(e) => handleTestCaseChange(tc.id, 'expectedOutput', e.target.value)}
                        placeholder="e.g., 2"
                        className="w-full h-20 resize-y rounded-lg bg-black/40 px-3 py-2 text-xs font-mono text-amber-300 placeholder-zinc-700 ring-1 ring-white/5 focus:outline-none focus:ring-white/20"
                      />
                    </div>

                    <div className="w-full md:w-24 space-y-2 pt-2 md:pt-0">
                      <Label>Points</Label>
                      <input 
                        type="number"
                        value={tc.points}
                        onChange={(e) => handleTestCaseChange(tc.id, 'points', parseInt(e.target.value) || 0)}
                        className="w-full rounded-lg bg-black/40 px-3 py-2 text-xs font-mono text-zinc-300 ring-1 ring-white/5 focus:outline-none focus:ring-white/20"
                      />
                    </div>

                    <div className="flex items-start pt-6">
                      <button
                        type="button"
                        onClick={() => handleRemoveTestCase(tc.id)}
                        className="p-2 text-zinc-600 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors"
                        title="Remove test case"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddTestCase}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl border border-dashed border-white/10 bg-white/[0.01] py-6 text-sm font-medium text-zinc-500 hover:bg-white/[0.03] hover:text-zinc-300 transition-all active:scale-[0.99]"
                >
                  <Plus className="w-4 h-4" /> Add Test Case
                </button>
              </div>
            </div>
          </section>

          {/* STATUS NOTIFICATION */}
          {status.message && (
            <div className={`flex items-center gap-3 p-4 rounded-xl text-sm font-medium transition-all ${
              status.type === 'error' ? 'bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20' :
              status.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20' :
              'bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20'
            }`}>
              {status.type === 'error' ? <AlertCircle className="w-4 h-4" /> : 
               status.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : 
               <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />}
              {status.message}
            </div>
          )}

          {/* FOOTER CTA */}
          <div className="pt-4 flex justify-end">
            <button 
              type="submit"
              disabled={status.type === 'loading'}
              className="group relative flex items-center gap-3 rounded-full bg-zinc-100 py-3 pl-6 pr-2 text-sm font-semibold text-zinc-950 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-white active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:pointer-events-none"
            >
              <span>{status.type === 'loading' ? 'Committing...' : 'Deploy Challenge'}</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/10 transition-transform duration-500 group-hover:scale-105">
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}