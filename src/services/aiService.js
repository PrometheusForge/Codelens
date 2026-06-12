export const CODING_SYSTEM_PROMPT = `You are an expert software engineer solving coding challenges.

When given a coding challenge, respond EXACTLY in this format with no deviations:

## Solution
\`\`\`[language]
// Your complete, working solution here
\`\`\`

## Approach
[2-3 sentences explaining your strategy and why you chose it]

## Complexity
- Time: O(...) — [one-sentence explanation]
- Space: O(...) — [one-sentence explanation]

## Edge Cases Handled
- [list each edge case you explicitly handled]

## Notes
[Any trade-offs, alternative approaches, or important observations — omit if none]

Rules:
- The code block MUST be complete and runnable as-is
- NEVER use code from external libraries unless the problem explicitly requires it
- If the problem has no optimal solution, explain the best you can achieve and why`;

// ----- GROQ (Llama 3, Mixtral) -----
export const queryGroq = async (prompt, modelId = 'llama3-70b-8192') => {
  const startTime = Date.now();
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: modelId,
      messages: [
        { role: 'system', content: CODING_SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      max_tokens: 2048,
      temperature: 0.1  // Low temperature = more consistent, deterministic code
    })
  });
  
  if (!response.ok) throw new Error(`Groq API error: ${response.status}`);
  
  const data = await response.json();
  return {
    provider: 'Groq',
    model: modelId,
    content: data.choices[0].message.content,
    responseTimeMs: Date.now() - startTime,
    inputTokens: data.usage?.prompt_tokens || 0,
    outputTokens: data.usage?.completion_tokens || 0,
  };
};

// ----- GOOGLE GEMINI -----
export const queryGemini = async (prompt, modelId = 'gemini-1.5-flash') => {
  const startTime = Date.now();
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: CODING_SYSTEM_PROMPT + '\n\nChallenge:\n' + prompt }] }
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 2048,
          stopSequences: []
        }
      })
    }
  );
  
  if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);
  
  const data = await response.json();
  return {
    provider: 'Google',
    model: modelId,
    content: data.candidates[0].content.parts[0].text,
    responseTimeMs: Date.now() - startTime,
    inputTokens: data.usageMetadata?.promptTokenCount || 0,
    outputTokens: data.usageMetadata?.candidatesTokenCount || 0,
  };
};

// ----- OPENROUTER (free models) -----
export const queryOpenRouter = async (prompt, modelId = 'meta-llama/llama-3-8b-instruct:free') => {
  const startTime = Date.now();
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:5173',
      'X-Title': 'CodeLens'
    },
    body: JSON.stringify({
      model: modelId,
      messages: [
        { role: 'system', content: CODING_SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      max_tokens: 2048,
      temperature: 0.1
    })
  });
  
  if (!response.ok) throw new Error(`OpenRouter API error: ${response.status}`);
  
  const data = await response.json();
  return {
    provider: 'OpenRouter',
    model: modelId,
    content: data.choices[0].message.content,
    responseTimeMs: Date.now() - startTime,
    inputTokens: data.usage?.prompt_tokens || 0,
    outputTokens: data.usage?.completion_tokens || 0,
  };
};

export const MODEL_REGISTRY = [
  { id: 'llama3-70b-8192',      label: 'Llama 3 70B',      provider: 'Groq',       fn: (p) => queryGroq(p, 'llama3-70b-8192'), color: '#4f46e5' },
  { id: 'llama3-8b-8192',       label: 'Llama 3 8B',       provider: 'Groq',       fn: (p) => queryGroq(p, 'llama3-8b-8192'),  color: '#7c3aed' },
  { id: 'mixtral-8x7b-32768',   label: 'Mixtral 8x7B',     provider: 'Groq',       fn: (p) => queryGroq(p, 'mixtral-8x7b-32768'), color: '#0ea5e9' },
  { id: 'gemini-1.5-flash',     label: 'Gemini 1.5 Flash', provider: 'Google',     fn: (p) => queryGemini(p),                  color: '#22c55e' },
  { id: 'llama-3-8b-free',      label: 'Llama 3 8B (OR)',  provider: 'OpenRouter', fn: (p) => queryOpenRouter(p, 'meta-llama/llama-3-8b-instruct:free'), color: '#f59e0b' },
];

export const queryAllModels = async (formattedPrompt, selectedModelIds) => {
  const selectedModels = MODEL_REGISTRY.filter(m => selectedModelIds.includes(m.id));
  
  const results = await Promise.allSettled(
    selectedModels.map(model =>
      model.fn(formattedPrompt).then(result => ({ ...result, modelId: model.id }))
    )
  );
  
  return results.map((result, index) => {
    const model = selectedModels[index];
    if (result.status === 'fulfilled') {
      return { ...result.value, modelId: model.id, success: true };
    } else {
      return { 
        modelId: model.id, 
        model: model.label, 
        provider: model.provider,
        error: result.reason?.message || 'Unknown error', 
        success: false 
      };
    }
  });
};

// Format a challenge object into a prompt string
export const formatChallengePrompt = (challenge) => {
  return `# ${challenge.title}
**Difficulty:** ${challenge.difficulty} | **Category:** ${challenge.category}

## Problem Statement
${challenge.prompt}

## Examples
${challenge.examples.map(e => `- Input: \`${e.input}\` → Output: \`${e.output}\`${e.explanation ? ` (${e.explanation})` : ''}`).join('\n')}

## Constraints
${challenge.constraints.map(c => `- ${c}`).join('\n')}

**Write your solution in ${challenge.language}.**`;
};