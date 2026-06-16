import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { create } from 'zustand';
import ReactMarkdown from 'react-markdown';
import { 
  Search, Grid as GridIcon, List as ListIcon, 
  Cpu, Database, Layout, Server, Bug, Network, 
  Clock, ChevronRight, SlidersHorizontal, X,
  Copy, Check, TerminalSquare, Activity, Beaker
} from 'lucide-react';
import { challenges } from '../data/challenges.js';


// --- ZUSTAND STORE ---
const useAppStore = create((set) => ({
  viewMode: 'grid',
  setViewMode: (mode) => set({ viewMode: mode }),
}));

// --- MOCK DATA SEED (Enriched for Slide-Over) ---


const CATEGORIES = [
  { id: 'algorithms', label: 'Algorithms', icon: Cpu },
  { id: 'data-structures', label: 'Data Structures', icon: Database },
  { id: 'frontend', label: 'Frontend', icon: Layout },
  { id: 'backend', label: 'Backend', icon: Server },
  { id: 'debugging', label: 'Debugging', icon: Bug },
  { id: 'system-design', label: 'System Design', icon: Network },
];

const DIFFICULTIES = ['easy', 'medium', 'hard', 'expert'];

// MOCK PAST RESULTS
const MOCK_PAST_RESULTS = [
  { id: 1, model: 'Llama 3 70B', score: 95, time: '2 hours ago', success: true },
  { id: 2, model: 'Gemini 1.5 Flash', score: 100, time: '5 hours ago', success: true },
  { id: 3, model: 'Mistral 7B', score: 65, time: '1 day ago', success: false },
  { id: 4, model: 'GPT-4o', score: 100, time: '2 days ago', success: true },
  { id: 5, model: 'Claude 3.5 Sonnet', score: 98, time: '4 days ago', success: true },
];

// --- UTILS ---
const getDifficultyStyles = (diff) => {
  switch (diff) {
    case 'easy': return 'text-emerald-400 bg-emerald-400/10 ring-emerald-400/20';
    case 'medium': return 'text-amber-400 bg-amber-400/10 ring-amber-400/20';
    case 'hard': return 'text-orange-400 bg-orange-400/10 ring-orange-400/20';
    case 'expert': return 'text-rose-400 bg-rose-400/10 ring-rose-400/20';
    default: return 'text-zinc-400 bg-zinc-400/10 ring-zinc-400/20';
  }
};

const getCategoryIcon = (categoryId) => {
  const cat = CATEGORIES.find(c => c.id === categoryId);
  const Icon = cat ? cat.icon : TerminalSquare;
  return <Icon className="w-4 h-4" />;
};

// --- COMPONENTS ---

const Badge = ({ children, className = '' }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ring-1 ring-inset ${className}`}>
    {children}
  </span>
);

// --- SLIDE-OVER PANEL ---
const SlideOver = ({ challenge, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [showAllTests, setShowAllTests] = useState(false);

  const navigate = useNavigate();

  // Keyboard shortcut to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!challenge) return null;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(challenge.prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const testCases = challenge.testCases || [];
  const visibleTests = showAllTests ? testCases : testCases.slice(0, 2);

  return (
    <div className={`fixed inset-0 z-50 flex justify-end ${isOpen ? '' : 'pointer-events-none'}`}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
        onClick={onClose} 
      />
      
      {/* Panel */}
      <div className={`relative w-full max-w-2xl bg-[#09090b] border-l border-white/5 h-[100dvh] flex flex-col transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_0_80px_rgba(0,0,0,0.8)] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-8 py-6 border-b border-white/5 bg-white/[0.02]">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-zinc-400">
                {getCategoryIcon(challenge.category)}
                <span className="text-xs font-medium uppercase tracking-widest">{challenge.category.replace('-', ' ')}</span>
              </div>
              <span className="text-zinc-600 px-1">•</span>
              <Badge className={getDifficultyStyles(challenge.difficulty)}>
                {challenge.difficulty}
              </Badge>
            </div>
            <h2 className="text-2xl font-semibold tracking-tighter text-white">
              {challenge.title}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="rounded-full p-2.5 text-zinc-500 ring-1 ring-white/10 transition-all duration-300 hover:bg-white/[0.05] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-12">
          
          {/* Prompt Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
                <TerminalSquare className="w-4 h-4" /> Prompt Description
              </h3>
              <button 
                onClick={handleCopyPrompt}
                className="flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Prompt'}
              </button>
            </div>
            <div className="prose prose-invert prose-zinc max-w-none text-zinc-300 leading-relaxed text-sm">
              <ReactMarkdown>{challenge.prompt}</ReactMarkdown>
            </div>
          </section>

          {/* Examples Section */}
          {challenge.examples && challenge.examples.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
                <Layout className="w-4 h-4" /> Examples
              </h3>
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar">
                {challenge.examples.map((ex, idx) => (
                  <div key={idx} className="min-w-[300px] flex-shrink-0 snap-start rounded-2xl bg-white/[0.02] ring-1 ring-white/5 p-5">
                    <div className="mb-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Example {idx + 1}</div>
                    <div className="space-y-3 font-mono text-[13px]">
                      <div><span className="text-zinc-500">Input:</span> <span className="text-emerald-300">{ex.input}</span></div>
                      <div><span className="text-zinc-500">Output:</span> <span className="text-amber-300">{ex.output}</span></div>
                      {ex.explanation && (
                        <div className="text-zinc-400 mt-2 text-xs font-sans leading-relaxed border-t border-white/5 pt-3">
                          {ex.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Test Cases Section */}
          {testCases.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
                <Beaker className="w-4 h-4" /> Execution Test Cases
              </h3>
              <div className="space-y-3">
                {visibleTests.map((tc, idx) => (
                  <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl bg-zinc-950 p-4 ring-1 ring-white/5">
                    <div className="flex-1 space-y-1 font-mono text-[13px]">
                      <div className="text-zinc-300 truncate"><span className="text-zinc-600">IN:</span> {tc.input.replace(/\n/g, '↵')}</div>
                      <div className="text-zinc-300 truncate"><span className="text-zinc-600">OUT:</span> {tc.expectedOutput.replace(/\n/g, '↵')}</div>
                    </div>
                    <Badge className="bg-white/[0.03] text-zinc-400 ring-white/10 shrink-0">
                      {tc.points} pts
                    </Badge>
                  </div>
                ))}
                
                {testCases.length > 2 && (
                  <button 
                    onClick={() => setShowAllTests(!showAllTests)}
                    className="w-full rounded-xl border border-dashed border-white/10 py-3 text-xs font-medium text-zinc-500 hover:bg-white/[0.02] hover:text-zinc-300 transition-colors"
                  >
                    {showAllTests ? 'Collapse test cases' : `Show ${testCases.length - 2} more test cases`}
                  </button>
                )}
              </div>
            </section>
          )}

          {/* Past Results Section */}
          <section className="space-y-4">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Past Results
            </h3>
            <div className="overflow-hidden rounded-2xl ring-1 ring-white/5">
              <table className="w-full text-left text-sm text-zinc-400">
                <thead className="bg-white/[0.02] text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                  <tr>
                    <th className="px-6 py-4">Model</th>
                    <th className="px-6 py-4">Score</th>
                    <th className="px-6 py-4 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-zinc-950/50">
                  {MOCK_PAST_RESULTS.map((res) => (
                    <tr key={res.id} className="transition-colors hover:bg-white/[0.02]">
                      <td className="px-6 py-4 font-medium text-zinc-200">{res.model}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 ${res.success ? 'text-emerald-400' : 'text-orange-400'}`}>
                          {res.score}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-xs text-zinc-500">{res.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

        </div>

        {/* Footer (Sticky CTA) */}
        <div className="flex-shrink-0 p-6 border-t border-white/5 bg-[#09090b]/80 backdrop-blur-xl">
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              
              // THE FIX: Adding `challenge: challenge` to the state payload
              navigate(`/evaluate/${challenge.id}`, { 
                state: { 
                  challengePrompt: challenge.prompt,
                  challenge: challenge // <-- This passes the testCases to the sandbox!
                } 
              });
            }}
            className="group relative w-full flex items-center justify-center gap-3 rounded-full bg-zinc-100 py-3.5 text-sm font-semibold text-zinc-950 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-white active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          >
            <span>Start Evaluation</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

      </div>
    </div>
  );
};

// --- CHALLENGE CARD ---
const ChallengeCard = ({ challenge, viewMode, onSelect }) => {
  const isList = viewMode === 'list';

  return (
    <div 
      onClick={() => onSelect(challenge)}
      className="group relative cursor-pointer rounded-[2rem] bg-white/[0.02] p-1.5 ring-1 ring-white/5 transition-all duration-500 hover:bg-white/[0.04]"
    >
      {/* Inner Core (Double-Bezel Architecture) */}
      <div className={`relative h-full rounded-[calc(2rem-0.375rem)] bg-zinc-950/50 p-6 ring-1 ring-white/5 transition-all duration-500 group-hover:ring-white/10 flex flex-col ${isList ? 'md:flex-row md:items-center md:gap-8' : 'gap-5'}`}>
        
        {/* Header Section */}
        <div className={`flex flex-col gap-3 ${isList ? 'md:w-1/3' : ''}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-zinc-400">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.03] ring-1 ring-white/10">
                {getCategoryIcon(challenge.category)}
              </div>
              <span className="text-xs font-medium uppercase tracking-widest">{challenge.category.replace('-', ' ')}</span>
            </div>
            {!isList && (
              <Badge className={getDifficultyStyles(challenge.difficulty)}>
                {challenge.difficulty}
              </Badge>
            )}
          </div>
          
          <h3 className="text-lg font-medium tracking-tight text-zinc-100 line-clamp-1">
            {challenge.title}
          </h3>
        </div>

        {/* List-only Difficulty */}
        {isList && (
          <div className="hidden md:flex w-24">
            <Badge className={getDifficultyStyles(challenge.difficulty)}>
              {challenge.difficulty}
            </Badge>
          </div>
        )}

        {/* Prompt Preview & Tags */}
        <div className={`flex flex-col gap-4 ${isList ? 'md:flex-1' : 'flex-1'}`}>
          <p className="text-sm leading-relaxed text-zinc-500 line-clamp-2">
            {challenge.prompt}
          </p>
          <div className="flex flex-wrap gap-2">
            {challenge.tags.slice(0, 3).map(tag => (
              <span key={tag} className="inline-flex items-center rounded-md bg-zinc-900 px-2 py-1 text-xs font-medium text-zinc-400 ring-1 ring-inset ring-white/5">
                {tag}
              </span>
            ))}
            {challenge.tags.length > 3 && (
              <span className="inline-flex items-center text-xs font-medium text-zinc-600">
                +{challenge.tags.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className={`flex items-center justify-between mt-auto pt-4 border-t border-white/5 ${isList ? 'md:border-none md:pt-0 md:mt-0 md:w-auto' : ''}`}>
          <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
            <Clock className="w-3.5 h-3.5" />
            <span>{challenge.estimatedMinutes}m</span>
          </div>
          
          <button className="group/btn relative flex items-center gap-3 rounded-full bg-white/[0.03] ring-1 ring-white/10 py-2 pl-4 pr-2 text-sm font-semibold text-zinc-300 transition-all duration-500 hover:bg-white/[0.08] hover:text-white">
            <span>View Details</span>
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/5 transition-transform duration-500 group-hover/btn:scale-105">
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>

      </div>
    </div>
  );
};

// --- MAIN PAGE ---
export default function Challenges() {
  const { viewMode, setViewMode } = useAppStore();
  
  // Panel State
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState([]);
  const [sortBy, setSortBy] = useState('newest');

  // Handlers
  const handleOpenChallenge = (challenge) => {
    setActiveChallenge(challenge);
    // Request animation frame to ensure DOM updates before triggering CSS transition
    requestAnimationFrame(() => setIsSlideOverOpen(true));
  };

  const handleCloseSlideOver = () => {
    setIsSlideOverOpen(false);
    // Wait for slide-out transition to finish before destroying content
    setTimeout(() => setActiveChallenge(null), 500);
  };

  const toggleCategory = (id) => {
    setSelectedCategories(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const toggleDifficulty = (diff) => {
    setSelectedDifficulties(prev => prev.includes(diff) ? prev.filter(d => d !== diff) : [...prev, diff]);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setSelectedDifficulties([]);
  };

  // Derived Data
  const filteredChallenges = useMemo(() => {
    // ⬇️ UPDATE THIS LINE to use your imported data
    let result = challenges;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(c => 
        c.title.toLowerCase().includes(q) || 
        c.prompt.toLowerCase().includes(q) ||
        c.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter(c => selectedCategories.includes(c.category));
    }

    if (selectedDifficulties.length > 0) {
      result = result.filter(c => selectedDifficulties.includes(c.difficulty));
    }

    result.sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'difficulty') {
        const order = { easy: 1, medium: 2, hard: 3, expert: 4 };
        return order[a.difficulty] - order[b.difficulty];
      }
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });

    return result;
  }, [searchTerm, selectedCategories, selectedDifficulties, sortBy]);

  return (
    <div className="min-h-[100dvh] bg-[#09090b] text-zinc-100 selection:bg-zinc-800">
      
      <SlideOver 
        challenge={activeChallenge} 
        isOpen={isSlideOverOpen} 
        onClose={handleCloseSlideOver} 
      />

      <div className="mx-auto max-w-[1400px] px-4 py-12 md:px-8 md:py-24">
        
        {/* Editorial Hero Header */}
        <header className="mb-16 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-semibold tracking-tighter text-white md:text-5xl lg:text-6xl">
              Challenge Library
            </h1>
            <p className="mt-4 text-lg text-zinc-400 leading-relaxed max-w-[50ch]">
              Select a rigorously engineered coding challenge to benchmark against state-of-the-art AI models.
            </p>
          </div>

          {/* View Toggle (Segmented Control) */}
          <div className="flex items-center gap-1 rounded-full bg-white/[0.03] p-1.5 ring-1 ring-white/10">
            <button 
              onClick={() => setViewMode('grid')}
              className={`relative flex items-center justify-center rounded-full p-2.5 transition-all duration-300 ${viewMode === 'grid' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
              aria-label="Grid View"
            >
              <GridIcon className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`relative flex items-center justify-center rounded-full p-2.5 transition-all duration-300 ${viewMode === 'list' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
              aria-label="List View"
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          
          {/* FILTER SIDEBAR */}
          <aside className="lg:col-span-3 flex flex-col gap-10 lg:sticky lg:top-8 lg:self-start">
            
            {/* Search */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-500 transition-colors group-focus-within:text-zinc-300">
                <Search className="w-4 h-4" />
              </div>
              <input 
                type="text" 
                placeholder="Search queries, tags..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl bg-white/[0.02] py-3.5 pl-11 pr-4 text-sm text-white placeholder-zinc-500 ring-1 ring-white/10 transition-all duration-300 focus:bg-white/[0.04] focus:outline-none focus:ring-white/20"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute inset-y-0 right-0 flex items-center pr-4 text-zinc-500 hover:text-zinc-300">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Filters */}
            <div className="flex flex-col gap-4">
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Categories</h4>
              <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                {CATEGORIES.map(cat => (
                  <label key={cat.id} className="group flex cursor-pointer items-center gap-3">
                    <div className="relative flex h-5 w-5 items-center justify-center rounded-md bg-white/[0.03] ring-1 ring-white/10 transition-all group-hover:bg-white/[0.06]">
                      <input 
                        type="checkbox" 
                        className="peer sr-only"
                        checked={selectedCategories.includes(cat.id)}
                        onChange={() => toggleCategory(cat.id)}
                      />
                      <div className="h-2.5 w-2.5 scale-0 rounded-sm bg-zinc-300 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-checked:scale-100" />
                    </div>
                    <span className="text-sm font-medium text-zinc-400 transition-colors group-hover:text-zinc-200">
                      {cat.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Difficulty Filters */}
            <div className="flex flex-col gap-4">
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Difficulty</h4>
              <div className="flex flex-wrap gap-2">
                {DIFFICULTIES.map(diff => {
                  const isSelected = selectedDifficulties.includes(diff);
                  return (
                    <button
                      key={diff}
                      onClick={() => toggleDifficulty(diff)}
                      className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium capitalize ring-1 transition-all duration-300 ${
                        isSelected 
                          ? 'bg-zinc-100 text-zinc-900 ring-transparent' 
                          : 'bg-white/[0.02] text-zinc-400 ring-white/10 hover:bg-white/[0.06] hover:text-zinc-200'
                      }`}
                    >
                      {diff}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="flex flex-col gap-4">
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Sort By</h4>
              <div className="relative">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none rounded-xl bg-white/[0.02] px-4 py-3 text-sm font-medium text-zinc-300 ring-1 ring-white/10 transition-all focus:outline-none focus:ring-white/20"
                >
                  <option value="newest">Newest Added</option>
                  <option value="difficulty">Difficulty Level</option>
                  <option value="title">Alphabetical</option>
                </select>
                <SlidersHorizontal className="absolute right-4 top-1/2 w-4 h-4 -translate-y-1/2 text-zinc-500 pointer-events-none" />
              </div>
            </div>

          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="lg:col-span-9 flex flex-col gap-6">
            
            <div className="flex items-center justify-between text-sm font-medium text-zinc-500">
              <span>Showing {filteredChallenges.length} challenges</span>
              {(selectedCategories.length > 0 || selectedDifficulties.length > 0 || searchTerm) && (
                <button onClick={clearFilters} className="text-zinc-400 hover:text-zinc-100 transition-colors">
                  Clear filters
                </button>
              )}
            </div>

            {filteredChallenges.length === 0 ? (
              // Empty State
              <div className="flex flex-col items-center justify-center rounded-[2rem] bg-white/[0.01] px-6 py-24 ring-1 ring-white/5 border border-dashed border-white/10 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/[0.03] ring-1 ring-white/10 mb-6">
                  <Search className="w-6 h-6 text-zinc-500" />
                </div>
                <h3 className="text-xl font-medium text-zinc-200 mb-2">No protocols found</h3>
                <p className="text-zinc-500 max-w-sm mx-auto leading-relaxed mb-8">
                  We couldn't find any challenges matching your current filters. Adjust your parameters to continue.
                </p>
                <button onClick={clearFilters} className="rounded-full bg-white/[0.05] px-6 py-2.5 text-sm font-medium text-zinc-300 ring-1 ring-white/10 transition-all hover:bg-white/[0.1] hover:text-white active:scale-95">
                  Reset Parameters
                </button>
              </div>
            ) : (
              // Grid / List View
              <div className={viewMode === 'grid' ? "grid grid-cols-1 gap-6 md:grid-cols-2" : "flex flex-col gap-4"}>
                {filteredChallenges.map(challenge => (
                  <ChallengeCard 
                    key={challenge.id} 
                    challenge={challenge} 
                    viewMode={viewMode}
                    onSelect={handleOpenChallenge}
                  />
                ))}
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}