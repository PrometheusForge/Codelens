const isSupabaseConfigured = () =>
  import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_URL !== 'YOUR_SUPABASE_URL';

export const saveEvaluationSafe = async (data) => {
  if (!isSupabaseConfigured()) {
    const existing = JSON.parse(localStorage.getItem('codelens_evaluations') || '[]');
    existing.push({ ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() });
    localStorage.setItem('codelens_evaluations', JSON.stringify(existing));
    return 'local';
  }
  return saveEvaluation(data);
};

import { supabase } from './supabaseClient'

export const saveEvaluation = async ({ challengeId, modelResult, scores, testResults }) => {
  const { data: response, error: responseError } = await supabase
    .from('ai_responses')
    .insert({
      challenge_id:    challengeId,
      model_id:        modelResult.modelId,
      model_label:     modelResult.model,
      provider:        modelResult.provider,
      raw_response:    modelResult.content,
      extracted_code:  modelResult.extractedCode,
      response_time_ms: modelResult.responseTimeMs,
      input_tokens:    modelResult.inputTokens,
      output_tokens:   modelResult.outputTokens,
    })
    .select()
    .single();
  
  if (responseError) throw responseError;
  
  const { error: evalError } = await supabase
    .from('evaluations')
    .insert({
      response_id:   response.id,
      ...scores,
      weighted_total: scores.weightedTotal,
      test_results:  testResults,
      is_auto_scored: scores._isAutoScored || false,
      notes:         scores.notes || null,
    });
  
  if (evalError) throw evalError;
  return response.id;
};

export const getLeaderboard = async () => {
  const { data, error } = await supabase.from('model_performance').select('*');
  if (error) throw error;
  return data;
};

export const getChallengeHistory = async (challengeId, limit = 20) => {
  const { data, error } = await supabase
    .from('ai_responses')
    .select('*, evaluations(*)')
    .eq('challenge_id', challengeId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
};