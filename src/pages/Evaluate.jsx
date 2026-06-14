import React, { useState } from 'react';
import { Play, Code, CheckCircle, Loader2, AlertTriangle, X, Cpu } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { evaluateCodeSubmission, MODEL_REGISTRY } from '../services/aiService';
import { extractCode } from '../utils/codeExtractor';

export default function Evaluate() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const initialCode = location.state?.challengePrompt || '';
  const [codeSnippet, setCodeSnippet] = useState(''); // Starts empty for real code
  
  const [selectedModelId, setSelectedModelId] = useState(
    MODEL_REGISTRY && MODEL_REGISTRY.length > 0 ? MODEL_REGISTRY[0].id : ''
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState(null);

  const clearChallengeContext = () => {
    navigate(location.pathname, { replace: true, state: {} });
  };

  // --- NEW: PHASE 1 (GENERATION) ---
  const handleGenerate = async () => {
    const promptContext = location.state?.challengePrompt;
    if (!promptContext) return;

    setIsGenerating(true);
    setResult(null); // Clear previous scores
    setCodeSnippet(''); // Clear the box

    try {
      // 1. Find the exact model function from your registry
      const selectedModel = MODEL_REGISTRY.find(m => m.id === selectedModelId);
      
      // 2. Ask that specific AI model to solve the prompt
      const response = await selectedModel.fn(promptContext);
      
      // 3. Clean the response (strip markdown like ```javascript ... ```)
      const pureCode = extractCode(response.content) || response.content;
      
      // 4. Drop the clean code into the text box
      setCodeSnippet(pureCode);
      
    } catch (error) {
      console.error("Generation Error:", error);
      alert(`Failed to generate code: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // --- PHASE 2 (EVALUATION) ---
  const handleEvaluate = async () => {
    if (!codeSnippet.trim()) {
      alert("Please paste some code first!");
      return;
    }

    setIsEvaluating(true);
    setResult(null);

    try {
      const promptContext = location.state?.challengePrompt || "Evaluate this code snippet.";
      
      // This forces Llama 3 70B to act as the universal, unbiased judge for everyone
      const evaluation = await evaluateCodeSubmission(promptContext, codeSnippet, 'llama-3-70b');

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
          
          {/* Active Challenge Banner */}
          {location.state?.challengePrompt && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg relative">
              <button 
                onClick={clearChallengeContext}
                className="absolute top-4 right-4 text-emerald-500/60 hover:text-emerald-400 transition-colors cursor-pointer"
                title="Clear active challenge"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-2 mb-2 pr-8">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-bold text-emerald-400">Active Challenge Context</span>
              </div>
              
              <p className="text-xs text-zinc-300 font-mono line-clamp-2 pr-8">
                {location.state.challengePrompt}
              </p>
            </div>
          )}

          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
            <label className="block text-sm font-medium text-zinc-400 mb-2">Select Model</label>
            <select 
              value={selectedModelId}
              onChange={(e) => setSelectedModelId(e.target.value)}
              className="w-full bg-[#0c0c0e] border border-white/10 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {MODEL_REGISTRY?.map(model => (
                <option key={model.id} value={model.id}>
                  {model.label} ({model.provider})
                </option>
              ))}
            </select>

            <label className="block text-sm font-medium text-zinc-400 mt-6 mb-2">Code Snippet</label>
            <textarea 
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              className="w-full h-64 bg-[#0c0c0e] border border-white/10 rounded-lg p-4 font-mono text-sm text-zinc-300 outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="// Paste or generate code here..."
            />
          </div>

          {/* TWO-STEP BUTTON LAYOUT */}
          <div className="flex flex-col gap-4">
            
            {/* Step 1: Generate */}
            <button 
              onClick={handleGenerate}
              disabled={isGenerating || isEvaluating || !location.state?.challengePrompt}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer border border-white/10"
              title={!location.state?.challengePrompt ? "Select a challenge from the library first" : ""}
            >
              {isGenerating ? <Loader2 className="animate-spin w-5 h-5" /> : <Cpu className="w-5 h-5" />}
              {isGenerating ? 'Generating Solution...' : '1. Auto-Generate Solution'}
            </button>

            {/* Step 2: Evaluate */}
            <button 
              onClick={handleEvaluate}
              disabled={isEvaluating || isGenerating || !codeSnippet.trim()}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isEvaluating ? <Loader2 className="animate-spin w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isEvaluating ? 'Evaluating...' : '2. Run AI Judge'}
            </button>
            
          </div>
        </div>

        {/* Results Panel */}
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
          {result ? (
            <div className="space-y-4 animate-in zoom-in-95 duration-300">
              {result.status === 'success' ? (
                 <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
              ) : (
                 <AlertTriangle className="w-16 h-16 text-red-500 mx-auto" />
              )}
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