import { useState } from 'react';
import { Play, Code, CheckCircle, Loader2, AlertTriangle, X, Cpu, FileText } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { evaluateCodeSubmission, MODEL_REGISTRY } from '../services/aiService';
import { extractCode } from '../utils/codeExtractor';
import { supabase } from '../services/supabaseClient';

export default function Evaluate() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [customPrompt, setCustomPrompt] = useState('');
  const [codeSnippet, setCodeSnippet] = useState(''); 
  
  const [selectedModelId, setSelectedModelId] = useState(
    MODEL_REGISTRY && MODEL_REGISTRY.length > 0 ? MODEL_REGISTRY[0].id : ''
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState(null);

  // Checks for a Challenge Card first then falls back to typed prompt
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
      
      const evaluation = await evaluateCodeSubmission(evalContext, codeSnippet, 'qwen-3-32b');

      const { error: dbError } = await supabase
        .from('evaluations')
        .insert([
          {
            model_id: selectedModelId,         
            challenge_prompt: evalContext,
            correctness: evaluation.metrics?.correctness || 0,
            efficiency: evaluation.metrics?.efficiency || 0,
            readability: evaluation.metrics?.readability || 0,
            explanation: evaluation.metrics?.explanation || 0,
            security: evaluation.metrics?.security || 0,
            weighted_total: evaluation.score || 0,
            notes: evaluation.technical_feedback || '', 
            test_results: evaluation.simulatedExecution || {},
            is_auto_scored: true
          }
        ]);

      if (dbError) {
        console.error("Failed to save to Supabase:", dbError.message);
      } else {
        console.log("Successfully locked evaluation into Supabase!");
      }

      let rawFeedback = evaluation.client_facing_feedback || evaluation.feedback || evaluation.technical_feedback || "";
     
      let cleanFeedback = typeof rawFeedback === 'string' ? rawFeedback.trim() : ""; // Ensure it's a string
      
      setResult({ 
        status: 'success', 
        score: evaluation.score, 
        feedback: cleanFeedback !== "" ? cleanFeedback : "Evaluation completed successfully. The AI judge processed the code but did not return a readable summary.", 
        metrics: evaluation.metrics 
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
    <div className="p-8 md:px-8 md:py-15 mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">Evaluation Engine</h1>
        <p className="mt-4 text-lg text-zinc-400 leading-relaxed max-w-[50ch]">Select a model and input code to analyze performance metrics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          
          {location.state?.challengePrompt ? (
            // Challenge Card Green Banner
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
            // Free Play Mode: Text Box
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
              className="w-full h-30 bg-[#0c0c0e] border border-white/10 rounded-lg p-4 font-mono text-sm text-zinc-300 outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="// Paste or generate code here..."
            />
          </div>

          <div className="flex flex-col gap-4">
            <button 
              onClick={handleGenerate}
              disabled={isGenerating || isEvaluating || !activePrompt.trim()}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer border border-white/10"
              title={!activePrompt.trim() ? "Enter a prompt first" : ""}
            >
              {isGenerating ? <Loader2 className="animate-spin w-5 h-5" /> : <Cpu className="w-5 h-5" />}
              {isGenerating ? 'Generating Solution...' : '1. Auto-Generate Solution'}
            </button>

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

        <div className="break-words bg-white/[0.02] border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
          {result ? (
            <div className="break-words space-y-4 animate-in zoom-in-95 duration-300">
              {result.status === 'success' ? (
                 <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
              ) : (
                 <AlertTriangle className="w-16 h-16 text-red-500 mx-auto" />
              )}
              <h3 className="text-4xl font-bold text-white mb-2">Score: {result.score}</h3>
              
              {/* Styled feedback container */}
              <div className="bg-[#0c0c0e] border border-white/10 rounded-lg p-4 mt-4">
                <h4 className="text-sm font-bold text-emerald-400 mb-2 uppercase tracking-wider">Evaluation Feedback</h4>
                <p className="text-zinc-300 text-sm leading-relaxed">{result.feedback}</p>
              </div>
            </div>
          ) : (
            <div className="break-words whitespace-pre-wrap text-zinc-500 space-y-4">
              <Code className="w-16 h-16 mx-auto opacity-20" />
              <p>Waiting for evaluation input...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}