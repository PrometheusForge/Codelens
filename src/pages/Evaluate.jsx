import { useState } from 'react';
import { Play, Code, CheckCircle, Loader2, AlertTriangle, X, Cpu, FileText } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { evaluateCodeSubmission, MODEL_REGISTRY } from '../services/aiService';
import { extractCode } from '../utils/codeExtractor';
import { supabase } from '../services/supabaseClient';

export default function Evaluate() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // NEW: State to hold a manually typed prompt
  const [customPrompt, setCustomPrompt] = useState('');
  const [codeSnippet, setCodeSnippet] = useState(''); 
  
  const [selectedModelId, setSelectedModelId] = useState(
    MODEL_REGISTRY && MODEL_REGISTRY.length > 0 ? MODEL_REGISTRY[0].id : ''
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState(null);

  // NEW: Smart variable that checks for a Challenge Card first, then falls back to the typed prompt
  const activePrompt = location.state?.challengePrompt || customPrompt;

  const clearChallengeContext = () => {
    navigate(location.pathname, { replace: true, state: {} });
    setCustomPrompt('');
  };

  const handleGenerate = async () => {
    if (!activePrompt.trim()) return alert("Please enter a challenge prompt first.");

    setIsGenerating(true);
    setResult(null); 
    setCodeSnippet(''); 

    try {
      const selectedModel = MODEL_REGISTRY.find(m => m.id === selectedModelId);
      const response = await selectedModel.fn(activePrompt);
      const pureCode = extractCode(response.content) || response.content;
      setCodeSnippet(pureCode);
    } catch (error) {
      console.error("Generation Error:", error);
      alert(`Failed to generate code: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEvaluate = async () => {
    if (!codeSnippet.trim()) {
      alert("Please paste some code first!");
      return;
    }

    setIsEvaluating(true);
    setResult(null);

    try {
      const evalContext = activePrompt || "Evaluate this code snippet for correctness and efficiency.";
      
      // 1. Pass the code to Qwen 3 (Aegis v2) for LLM-based grading
      const evaluation = await evaluateCodeSubmission(evalContext, codeSnippet, 'qwen-3-32b');

      // 2. THE PUSH: Send the results to Supabase matching your existing table schema
      const { error: dbError } = await supabase
        .from('evaluations')
        .insert([
          {
            model_id: selectedModelId,         
            challenge_prompt: evalContext,
            // We map the Aegis JSON directly to your SQL constraints
            correctness: evaluation.metrics?.correctness || 0,
            efficiency: evaluation.metrics?.efficiency || 0,
            readability: evaluation.metrics?.readability || 0,
            explanation: evaluation.metrics?.explanation || 0,
            security: evaluation.metrics?.security || 0,
            
            weighted_total: evaluation.score || 0,
            notes: evaluation.feedback || '',
            test_results: evaluation.simulatedExecution || {},
            is_auto_scored: true
            
            // Note: If your database requires response_id, you will need to 
            // insert into 'ai_responses' first and pass that ID here!
          }
        ]);

      if (dbError) {
        console.error("Failed to save to Supabase:", dbError.message);
      } else {
        console.log("Successfully locked evaluation into Supabase!");
      }

      // 3. Update the UI
      setResult({ 
        status: 'success', 
        score: evaluation.score, 
        feedback: evaluation.feedback,
        metrics: evaluation.metrics // Passing metrics to the UI just in case
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
          
          {/* DYNAMIC PROMPT UI */}
          {location.state?.challengePrompt ? (
            // Challenge Card Mode: Show the Green Banner
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg relative">
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
          ) : (
            // Free Play Mode: Show the Text Box
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
              <label className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-2">
                <FileText className="w-4 h-4" /> Challenge Prompt
              </label>
              <textarea 
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="w-full h-24 bg-[#0c0c0e] border border-white/10 rounded-lg p-3 text-sm text-zinc-300 outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                placeholder="Paste a coding problem here, or select one from the Challenges Library..."
              />
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

          <div className="flex flex-col gap-4">
            {/* Step 1: Generate */}
            <button 
              onClick={handleGenerate}
              // NEW: Button un-disables as long as activePrompt has text!
              disabled={isGenerating || isEvaluating || !activePrompt.trim()}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer border border-white/10"
              title={!activePrompt.trim() ? "Enter a prompt first" : ""}
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
        <div className="break-words bg-white/[0.02] border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
          {result ? (
            <div className="break-words space-y-4 animate-in zoom-in-95 duration-300">
              {result.status === 'success' ? (
                 <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
              ) : (
                 <AlertTriangle className="w-16 h-16 text-red-500 mx-auto" />
              )}
              <h3 className="text-2xl font-bold text-white">Score: {result.score}</h3>
              <p className="text-zinc-400">{result.feedback}</p>
            </div>
          ) : (
            <div className="break-words text-zinc-500 space-y-4">
              <Code className="w-16 h-16 mx-auto opacity-20" />
              <p>Waiting for evaluation input...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}