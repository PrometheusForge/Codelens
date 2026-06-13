import React, { useState } from 'react';
import { Play, Code, CheckCircle, Loader2, AlertTriangle } from 'lucide-react';

export default function Evaluate() {
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState(null);
  const [codeSnippet, setCodeSnippet] = useState(''); // New State

  const handleEvaluate = () => {
    // BUG FIX: Check if code is empty
    if (!codeSnippet.trim()) {
      alert("Please paste some code first!");
      return;
    }

    setIsEvaluating(true);
    setResult(null); // Clear previous results

    // Simulate API call
    setTimeout(() => {
      setIsEvaluating(false);
      setResult({ 
        status: 'success', 
        score: Math.floor(Math.random() * (99 - 80) + 80), // Randomized score
        feedback: 'Optimized complexity; runtime improved by 15%.' 
      });
    }, 2000);
  };

  return (
    <div className="p-8 md:p-12 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Evaluation Engine</h1>
        <p className="text-zinc-400 mt-2">Select a model and input code to analyze performance metrics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
            <label className="block text-sm font-medium text-zinc-400 mb-2">Select Model</label>
            <select className="w-full bg-[#0c0c0e] border border-white/10 rounded-lg p-3 text-white">
              <option>Gemini 1.5 Flash</option>
              <option>Llama 3 (70B)</option>
              <option>GPT-4o</option>
            </select>

            <label className="block text-sm font-medium text-zinc-400 mt-6 mb-2">Code Snippet</label>
            <textarea 
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)} // Update state
              className="w-full h-64 bg-[#0c0c0e] border border-white/10 rounded-lg p-4 font-mono text-sm text-zinc-300 outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="// Paste your code here..."
            />
          </div>

          <button 
            onClick={handleEvaluate}
            disabled={isEvaluating}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isEvaluating ? <Loader2 className="animate-spin w-5 h-5" /> : <Play className="w-5 h-5" />}
            {isEvaluating ? 'Evaluating...' : 'Run Evaluation'}
          </button>
        </div>

        {/* Results Panel */}
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
          {result ? (
            <div className="space-y-4 animate-in zoom-in-95 duration-300">
              <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
              <h3 className="text-2xl font-bold text-white">Score: {result.score}</h3>
              <p className="text-zinc-400">{result.feedback}</p>
            </div>
          ) : (
            <div className="text-zinc-500 space-y-4">
              <Code className="w-16 h-16 mx-auto opacity-20" />
              <p>Waiting for evaluation input...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}