import React, { useState } from 'react';
import { Play, Code, CheckCircle, Loader2, AlertTriangle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { evaluateCodeSubmission } from '../services/aiService';

export default function Evaluate() {
  const location = useLocation();
  
  // Navigation State: 1 = Select Models, 2 = Input Code
  const [step, setStep] = useState(1); 
  
  // Code Snippet State (Catching the prompt from the Challenge page)
  const initialCode = location.state?.challengePrompt || '';
  const [codeSnippet, setCodeSnippet] = useState(initialCode);
  
  // Evaluation State
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState(null);

  const handleEvaluate = async () => {
    if (!codeSnippet.trim()) {
      alert("Please paste some code first!");
      return;
    }

    setIsEvaluating(true);
    setResult(null);

    try {
      // Grab the original prompt we passed through React Router, or use a fallback
      const promptContext = location.state?.challengePrompt || "Evaluate this code snippet.";
      
      // Call the AI Judge!
      const evaluation = await evaluateCodeSubmission(promptContext, codeSnippet);

      // Update the UI with the real AI data
      setResult({ 
        status: 'success', 
        score: evaluation.score, 
        feedback: evaluation.feedback 
      });
      
    } catch (error) {
      console.error("Evaluation Error:", error);
      setResult({ 
        status: 'error', 
        score: 'X', 
        feedback: 'The evaluation engine encountered a network error. Check your API keys.' 
      });
    } finally {
      setIsEvaluating(false);
    }
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
              <option>Gemini 1.5 Flash (Google)</option>
              <option>Llama 3 70B (Groq)</option>
              <option>Gemma 2 9B (Groq)</option>
              <option>CodeLlama 7B (Hugging Face)</option>
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