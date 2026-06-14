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
// UPDATED DEFAULT TO ACTIVE MODEL
export const queryGroq = async (prompt, modelId = 'llama-3.3-70b-versatile') => {
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
      temperature: 0.1
    })
  });
  
  if (!response.ok) {
    const err = await response.json();
    throw new Error(`Groq API error: ${JSON.stringify(err.error)}`);
  }
  
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
export const queryGemini = async (prompt, modelId = 'gemini-2.5-flash') => {
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
  
  if (!response.ok) {
    const err = await response.json();
    throw new Error(`Gemini API error: ${JSON.stringify(err)}`);
  }
  
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

// ----- HUGGING FACE -----
export const queryHuggingFace = async (prompt, modelId = 'codellama/CodeLlama-7b-hf') => {
  const startTime = Date.now();
  const fullPrompt = `${CODING_SYSTEM_PROMPT}\n\nChallenge:\n${prompt}`;

  const response = await fetch(`https://api-inference.huggingface.co/models/${modelId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_HF_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      inputs: fullPrompt,
      parameters: {
        max_new_tokens: 2048,
        temperature: 0.1,
        return_full_text: false
      }
    })
  });
  
  if (!response.ok) throw new Error(`Hugging Face API error: ${response.status}`);
  
  const data = await response.json();
  const content = Array.isArray(data) ? data[0].generated_text : data.generated_text;

  return {
    provider: 'Hugging Face',
    model: modelId,
    content: content ? content.trim() : "No code generated.",
    responseTimeMs: Date.now() - startTime,
    inputTokens: 0,
    outputTokens: 0,
  };
};

// --- UPDATED REGISTRY WITH ACTIVE GROQ MODELS ---
export const MODEL_REGISTRY = [
  { 
    id: 'llama-3-70b',      
    label: 'Llama 3 70B',      
    provider: 'Groq',       
    fn: (p) => queryGroq(p, 'llama-3.3-70b-versatile'), 
    color: '#4f46e5' 
  },
  { 
    id: 'gemini-2.5-flash',     
    label: 'Gemini 2.5 Flash', 
    provider: 'Google',     
    fn: (p) => queryGemini(p),                  
    color: '#22c55e' 
  },
  { 
    id: 'gemma-2-9b',       
    label: 'Llama 3 8B',       
    provider: 'Groq',       
    fn: (p) => queryGroq(p, 'llama-3.1-8b-instant'),  
    color: '#06b6d4' 
  },
  { 
    id: 'codellama-7b-hf',      
    label: 'CodeLlama 7B',  
    provider: 'Hugging Face', 
    fn: (p) => queryHuggingFace(p, 'codellama/CodeLlama-7b-hf'), 
    color: '#eab308' 
  },
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

// ----- THE AI JUDGE (Evaluation Engine) -----
export const evaluateCodeSubmission = async (challengePrompt, submittedCode, modelId = 'llama-3-70b') => {
  const systemPrompt = `You are a strict, expert code evaluator.
You will be given a coding challenge prompt and a submitted code snippet.
You must output ONLY a valid JSON object with exactly two keys:
1. "score": an integer from 0 to 100 representing the code's correctness, efficiency, and readability.
2. "feedback": a single, concise sentence explaining the score and suggesting one specific improvement.
Do not include any markdown formatting, backticks, or other text. Return ONLY raw JSON.`;

  const userPrompt = `Challenge Prompt:\n${challengePrompt}\n\nSubmitted Code:\n${submittedCode}`;

  try {
    if (modelId === 'gemini-2.5-flash') {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: systemPrompt + '\n\n' + userPrompt }] }],
            generationConfig: {
              temperature: 0.1,
              responseMimeType: "application/json"
            }
          })
        }
      );
      
      if (!response.ok) {
        const err = await response.json();
        throw new Error(`Gemini failed: ${JSON.stringify(err)}`);
      }
      const data = await response.json();
      return JSON.parse(data.candidates[0].content.parts[0].text);
    } 
    
    else if (modelId === 'codellama-7b-hf') {
      const response = await fetch(`https://api-inference.huggingface.co/models/codellama/CodeLlama-7b-hf`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_HF_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: `${systemPrompt}\n\n${userPrompt}`,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.1,
            return_full_text: false
          }
        })
      });

      if (!response.ok) throw new Error(`Hugging Face failed with status: ${response.status}`);
      const data = await response.json();
      const content = Array.isArray(data) ? data[0].generated_text : data.generated_text;
      
      const cleanJsonStr = (content || "").replace(/```json/gi, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJsonStr);
    }
    
    else {
      // UPDATED AI JUDGE MAP
      const groqModelMap = {
        'llama-3-70b': 'llama-3.3-70b-versatile',
        'gemma-2-9b': 'llama-3.1-8b-instant'
      };
      
      const targetModel = groqModelMap[modelId] || 'llama-3.3-70b-versatile';

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: targetModel,
          response_format: { type: "json_object" }, 
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.1,
          max_tokens: 1024
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(`Groq Judge failed: ${JSON.stringify(err.error)}`);
      }
      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    }
  } catch (error) {
    console.error("Judge routing error:", error);
    return { 
      score: 'Err', 
      feedback: `API Error: ${error.message}` 
    };
  }
};