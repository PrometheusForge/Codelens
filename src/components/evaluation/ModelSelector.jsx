import { create } from 'zustand';
import { 
  Check, Cpu, Sparkles, Zap, AlertTriangle, ShieldCheck, Activity, ArrowRight, Layers
} from 'lucide-react';

// Actual model registry - In a real implementation, this would likely be fetched from a backend or config file
const MODEL_REGISTRY = [
  { 
    id: 'llama-3-70b', name: 'Llama 3 (70B)', provider: 'Groq', providerId: 'groq',
    params: '70B', tier: 'Free API', recommended: true,
    description: 'High-speed open-weights model, excellent for complex reasoning.',
    icon: Cpu, color: 'text-orange-400', bg: 'bg-orange-400/10', ring: 'ring-orange-400/20'
  },
  { 
    id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'Google', providerId: 'google',
    params: 'Multimodal', tier: 'Free Tier', recommended: true,
    description: 'Fast, long-context model optimized for high-frequency tasks.',
    icon: Sparkles, color: 'text-blue-400', bg: 'bg-blue-400/10', ring: 'ring-blue-400/20'
  },
  { 
    id: 'gemma-2-9b', name: 'Gemma 2 (9B)', provider: 'Groq', providerId: 'groq',
    params: '9B', tier: 'Free API', recommended: false,
    description: 'Google\'s open weights model running on LPUs for extreme speed.',
    icon: Layers, color: 'text-cyan-400', bg: 'bg-cyan-400/10', ring: 'ring-cyan-400/20'
  },
  { 
    id: 'codellama-7b-hf', name: 'CodeLlama 7B', provider: 'Hugging Face', providerId: 'huggingface',
    params: '7B', tier: 'Free API', recommended: true,
    description: 'Meta\'s specialized code generation model hosted on Hugging Face.',
    icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-400/10', ring: 'ring-yellow-400/20'
  }
];

const useEvaluationStore = create((set) => ({
  selectedModels: ['llama-3-70b', 'gemini-1.5-flash', 'codellama-7b-hf'],  
  rateLimits: {
    'groq': 'ok',
    'google': 'ok', 
    'huggingface': 'ok'
  },
  
  toggleModel: (id) => set((state) => ({
    selectedModels: state.selectedModels.includes(id)
      ? state.selectedModels.filter(m => m !== id)
      : [...state.selectedModels, id]
  })),
  
  selectRecommended: () => set({ 
    selectedModels: MODEL_REGISTRY.filter(m => m.recommended).map(m => m.id) 
  }),
  
  selectAll: () => set({ 
    selectedModels: MODEL_REGISTRY.map(m => m.id) 
  }),
  
  clearAll: () => set({ selectedModels: [] })
}));

const Badge = ({ children, className = '' }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest ring-1 ring-inset ${className}`}>
    {children}
  </span>
);

const RateLimitIndicator = ({ status }) => {
  if (status === 'critical') {
    return (
      <div className="flex items-center gap-1.5 group/tooltip relative">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
        </span>
        <span className="text-[10px] uppercase font-semibold tracking-wider text-rose-500">Limit Reached</span>
      </div>
    );
  }
  if (status === 'warning') {
    return (
      <div className="flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]"></span>
        </span>
        <span className="text-[10px] uppercase font-semibold tracking-wider text-amber-500">Heavy Load</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5">
      <span className="relative flex h-2 w-2">
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span>
      </span>
      <span className="text-[10px] uppercase font-semibold tracking-wider text-emerald-500/70">API Healthy</span>
    </div>
  );
};

const ModelCard = ({ model, isSelected, onToggle, rateLimitStatus }) => {
  const Icon = model.icon;
  
  return (
    <button
      type="button"
      onClick={() => onToggle(model.id)}
      className={`group relative w-full text-left rounded-[2rem] p-1.5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] ${
        isSelected 
          ? 'bg-white/[0.06] ring-1 ring-white/20 shadow-[0_0_40px_rgba(255,255,255,0.05)]' 
          : 'bg-white/[0.02] ring-1 ring-white/5 hover:bg-white/[0.04] hover:ring-white/10'
      }`}
    >
      <div className={`relative h-full rounded-[calc(2rem-0.375rem)] p-6 transition-all duration-500 flex flex-col gap-5 ${
        isSelected ? 'bg-zinc-900/80 ring-1 ring-white/10' : 'bg-zinc-950/50 ring-1 ring-white/5'
      }`}>
        
        {/* Selection Indicator (Absolute Top Right) */}
        <div className={`absolute top-5 right-5 flex h-5 w-5 items-center justify-center rounded-full transition-all duration-300 ${
          isSelected ? 'bg-zinc-100 text-zinc-900 scale-100' : 'bg-white/5 text-transparent scale-90 ring-1 ring-white/10 group-hover:bg-white/10'
        }`}>
          <Check className="w-3 h-3" strokeWidth={3} />
        </div>

        {/* Provider & Rate Limit */}
        <div className="flex items-center justify-between pr-8">
          <div className="flex items-center gap-2">
            <div className={`flex h-6 w-6 items-center justify-center rounded-md ${model.bg} ${model.ring} ring-1`}>
              <Icon className={`w-3.5 h-3.5 ${model.color}`} />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
              {model.provider}
            </span>
          </div>
        </div>

        {/* Model Identity */}
        <div>
          <h3 className={`text-xl font-medium tracking-tight transition-colors ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
            {model.name}
          </h3>
          <p className="mt-2 text-sm text-zinc-500 leading-relaxed line-clamp-2">
            {model.description}
          </p>
        </div>

        {/* Footer Meta */}
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
          <div className="flex gap-2">
            <Badge className="bg-zinc-900 text-zinc-300 ring-white/10">
              {model.params}
            </Badge>
            <Badge className="bg-emerald-500/10 text-emerald-400 ring-emerald-500/20">
              {model.tier}
            </Badge>
          </div>
          <RateLimitIndicator status={rateLimitStatus} />
        </div>

      </div>
    </button>
  );
};

// Main Page Component
export default function ModelSelector() {
  const { 
    selectedModels, rateLimits, 
    toggleModel, selectRecommended, selectAll, clearAll 
  } = useEvaluationStore();

  const isOverloaded = selectedModels.length > 3;

  return (
    <div className="min-h-[100dvh] bg-[#09090b] text-zinc-100 selection:bg-zinc-800 py-12 md:py-24">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        
        <header className="mb-12 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.03] ring-1 ring-white/10">
                <ShieldCheck className="w-4 h-4 text-zinc-400" />
              </span>
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Phase 3: Evaluation Engine
              </h2>
            </div>
            <h1 className="text-4xl font-semibold tracking-tighter text-white md:text-5xl">
              Select Inference Models
            </h1>
            <p className="mt-4 text-lg text-zinc-400 leading-relaxed max-w-[55ch]">
              Choose the LLMs to benchmark this challenge against. The platform will execute parallel API requests to gather generated code for sandbox evaluation.
            </p>
          </div>

          {/* Quick Selection Actions */}
          <div className="flex items-center gap-3 rounded-2xl bg-white/[0.02] p-2 ring-1 ring-white/5">
            <button 
              onClick={selectRecommended}
              className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all"
            >
              Select Recommended (Top 3)
            </button>
            <div className="w-px h-4 bg-white/10" />
            <button 
              onClick={selectAll}
              className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all"
            >
              Select All
            </button>
            <div className="w-px h-4 bg-white/10" />
            <button 
              onClick={clearAll}
              className="px-4 py-2 text-sm font-medium text-zinc-500 hover:text-rose-400 hover:bg-rose-400/10 rounded-xl transition-all"
            >
              Clear
            </button>
          </div>
        </header>

        {/* Warning Banner */}
        <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOverloaded ? 'max-h-24 opacity-100 mb-8' : 'max-h-0 opacity-0 m-0'}`}>
          <div className="flex items-center justify-between rounded-2xl bg-amber-500/10 p-4 ring-1 ring-amber-500/20 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-amber-400">High Request Volume Warning</h4>
                <p className="text-xs font-medium text-amber-500/80 mt-0.5">
                  Selecting more than 3 models simultaneously may result in extended wait times or trigger free-tier rate limits.
                </p>
              </div>
            </div>
            <div className="hidden sm:block text-[10px] uppercase font-bold tracking-widest text-amber-500/50 pr-4">
              {selectedModels.length} Selected
            </div>
          </div>
        </div>

        {/* Model Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MODEL_REGISTRY.map(model => (
            <ModelCard 
              key={model.id}
              model={model}
              isSelected={selectedModels.includes(model.id)}
              onToggle={toggleModel}
              rateLimitStatus={rateLimits[model.providerId]}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-between border-t border-white/5 pt-8 gap-6">
          <div className="flex items-center gap-3 text-sm font-medium text-zinc-500">
            <Activity className="w-4 h-4" />
            <span>{selectedModels.length} models queued for parallel execution</span>
          </div>
          
          <button 
            disabled={selectedModels.length === 0}
            className="group relative flex w-full sm:w-auto items-center justify-center gap-3 rounded-full bg-zinc-100 py-3.5 pl-6 pr-2 text-sm font-semibold text-zinc-950 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-white active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          >
            <span>Proceed to Execution</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/10 transition-transform duration-500 group-hover:scale-105">
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>

      </div>
    </div>
  );
}